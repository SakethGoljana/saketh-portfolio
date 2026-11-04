import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedRequest } from "@/lib/auth";
import { getLeads } from "@/lib/leads";
import {
  isGoogleSheetConfigured,
  syncAllLeadsToGoogleSheet,
  getGoogleSheetWebhookUrl,
} from "@/lib/googleSheets";

// GET /api/sheets - Check configuration status
export async function GET(req: NextRequest) {
  if (!isAuthenticatedRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const configured = isGoogleSheetConfigured();
  const rawUrl = getGoogleSheetWebhookUrl();
  const match = rawUrl?.match(/^(https:\/\/[^/]+\/[^/]+\/[^/]+)\/.*$/);
  const maskedUrl = rawUrl
    ? match
      ? `${match[1]}/••••••••`
      : "https://script.google.com/••••••••"
    : null;

  return NextResponse.json({
    success: true,
    configured,
    webhookPreview: maskedUrl,
  });
}

// POST /api/sheets - Bulk sync all leads to Google Sheet
export async function POST(req: NextRequest) {
  if (!isAuthenticatedRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const allowEmpty = Boolean(body?.allowEmpty);

    const leads = getLeads();
    if (leads.length === 0 && !allowEmpty) {
      return NextResponse.json(
        {
          success: false,
          error: "No leads available locally. Bulk sync aborted to protect the sheet. Pass { allowEmpty: true } to explicitly clear the sheet.",
        },
        { status: 409 }
      );
    }

    const result = await syncAllLeadsToGoogleSheet(leads, allowEmpty);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        syncedCount: result.syncedCount,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message,
          configured: result.configured,
        },
        { status: result.configured ? 502 : 400 }
      );
    }
  } catch (err: unknown) {
    console.error("POST /api/sheets error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error during sheet sync" },
      { status: 500 }
    );
  }
}
