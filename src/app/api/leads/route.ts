import { NextRequest, NextResponse, after } from "next/server";
import { getLeads, saveLead, updateLead, deleteLead, Lead } from "@/lib/leads";
import { isAuthenticatedRequest } from "@/lib/auth";
import { syncLeadToGoogleSheet } from "@/lib/googleSheets";
import { getClientIp, isRateLimited } from "@/lib/rateLimit";

const MAX_LEADS_PER_WINDOW = 10;
const LEADS_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

// GET /api/leads - Protected: Requires Admin Session
export async function GET(req: NextRequest) {
  try {
    if (!isAuthenticatedRequest(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please authenticate." },
        { status: 401 }
      );
    }

    const leads = getLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error("GET /api/leads error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

// POST /api/leads - Public: Visitors book calls & send briefs
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rateLimitKey = `leads:${ip}`;

  // Rate limit public lead submission
  if (isRateLimited(rateLimitKey, MAX_LEADS_PER_WINDOW, LEADS_WINDOW_MS)) {
    return NextResponse.json(
      { success: false, error: "Too many booking requests from your IP. Please try again in 10 minutes." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { type, name, contact, day, slot, service, budget, timeline, notes, website_hp } = body;

    // Honeypot bot protection: if hidden field is filled, silently ignore
    if (website_hp && typeof website_hp === "string" && website_hp.trim().length > 0) {
      console.warn("Honeypot triggered on /api/leads. Silently discarding spam bot payload.");
      return NextResponse.json({ success: true, message: "Inquiry received." }, { status: 201 });
    }

    if (!type || !name || !contact) {
      return NextResponse.json(
        { success: false, error: "Name and contact (email or phone) are required." },
        { status: 400 }
      );
    }

    if (type !== "call_booking" && type !== "project_brief") {
      return NextResponse.json(
        { success: false, error: "Invalid inquiry type." },
        { status: 400 }
      );
    }

    if (type === "call_booking" && (!day || !slot)) {
      return NextResponse.json(
        { success: false, error: "Please select both a day and time slot." },
        { status: 400 }
      );
    }

    const lead = saveLead({
      type,
      name: String(name).trim().slice(0, 100),
      contact: String(contact).trim().slice(0, 150),
      day: day ? String(day).slice(0, 50) : undefined,
      slot: slot ? String(slot).slice(0, 50) : undefined,
      service: service ? String(service).slice(0, 100) : undefined,
      budget: budget ? String(budget).slice(0, 100) : undefined,
      timeline: timeline ? String(timeline).slice(0, 100) : undefined,
      notes: notes ? String(notes).trim().slice(0, 2000) : "",
    });

    // Fail-proof async sync to Google Sheets in background via after()
    after(() => {
      syncLeadToGoogleSheet(lead).catch((err) => {
        console.warn("Background sheet sync notice:", err);
      });
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error("POST /api/leads error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save lead" },
      { status: 500 }
    );
  }
}

// PATCH /api/leads - Protected: Update status, deal value, and payment details
export async function PATCH(req: NextRequest) {
  try {
    if (!isAuthenticatedRequest(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please authenticate." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, ...updates } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Lead ID is required." },
        { status: 400 }
      );
    }

    // Whitelist only allowed update fields to prevent tampering
    const allowedKeys: (keyof Lead)[] = [
      "status",
      "currency",
      "dealValue",
      "amountPaid",
      "paymentStatus",
      "paymentRef",
      "internalNotes",
    ];

    const sanitizedUpdates: Partial<Lead> = {};
    for (const key of allowedKeys) {
      if (key in updates) {
        if (key === "status") {
          const validStatuses = ["new", "contacted", "proposal", "booked", "completed"] as const;
          if (validStatuses.includes(updates[key])) {
            sanitizedUpdates.status = updates[key];
          }
        } else if (key === "paymentStatus") {
          const validPaymentStatuses = ["unpaid", "deposit_paid", "fully_paid"] as const;
          if (validPaymentStatuses.includes(updates[key])) {
            sanitizedUpdates.paymentStatus = updates[key];
          }
        } else if (key === "currency") {
          if (updates[key] === "USD" || updates[key] === "INR") {
            sanitizedUpdates.currency = updates[key];
          }
        } else if (key === "dealValue" || key === "amountPaid") {
          sanitizedUpdates[key] = Math.max(0, Number(updates[key]) || 0);
        } else if (key === "internalNotes" || key === "paymentRef") {
          sanitizedUpdates[key] = String(updates[key] || "").slice(0, 2000);
        }
      }
    }

    const updated = updateLead(id, sanitizedUpdates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Lead not found." },
        { status: 404 }
      );
    }

    // Sync updated terms & payment state to Google Sheets via after()
    after(() => {
      syncLeadToGoogleSheet(updated).catch((err) => {
        console.warn("Background sheet sync notice:", err);
      });
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error("PATCH /api/leads error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update lead" },
      { status: 500 }
    );
  }
}

// DELETE /api/leads - Protected: Delete spam/fake leads
export async function DELETE(req: NextRequest) {
  try {
    if (!isAuthenticatedRequest(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please authenticate." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Lead ID is required for deletion." },
        { status: 400 }
      );
    }

    const deleted = deleteLead(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Lead not found or already deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Lead permanently deleted." });
  } catch (error) {
    console.error("DELETE /api/leads error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete lead" },
      { status: 500 }
    );
  }
}
