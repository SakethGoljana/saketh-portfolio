import { NextRequest, NextResponse } from "next/server";
import { getFeedbacks, saveFeedback, FeedbackCategory } from "@/lib/feedback";
import { isAuthenticatedRequest } from "@/lib/auth";
import { getClientIp, isRateLimited } from "@/lib/rateLimit";

const MAX_FEEDBACK_PER_WINDOW = 5;
const FEEDBACK_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

// GET /api/feedback - Protected: Requires Admin Session (CRM access)
export async function GET(req: NextRequest) {
  try {
    if (!isAuthenticatedRequest(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please authenticate." },
        { status: 401 }
      );
    }

    const feedbacks = getFeedbacks();
    return NextResponse.json({ success: true, feedbacks });
  } catch (error) {
    console.error("GET /api/feedback error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}

// POST /api/feedback - Public: Visitors provide micro-feedback
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rateLimitKey = `feedback:${ip}`;

  if (isRateLimited(rateLimitKey, MAX_FEEDBACK_PER_WINDOW, FEEDBACK_WINDOW_MS)) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many submissions from your IP. Please try again in a few minutes.",
      },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  try {
    const {
      category = "craft",
      sentiment = "positive",
      message,
      contact,
      metadata,
      website_hp,
    } = (body || {}) as {
      category?: FeedbackCategory;
      sentiment?: string;
      message?: string;
      contact?: string;
      metadata?: Record<string, unknown>;
      website_hp?: string;
    };

    // Honeypot bot protection
    if (website_hp && typeof website_hp === "string" && website_hp.trim().length > 0) {
      console.warn("Honeypot triggered on /api/feedback. Discarding payload.");
      return NextResponse.json(
        { success: true, message: "Feedback received." },
        { status: 201 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Please enter a message before submitting." },
        { status: 400 }
      );
    }

    if (message.length > 2500) {
      return NextResponse.json(
        { success: false, error: "Message exceeds maximum length (2500 chars)." },
        { status: 400 }
      );
    }

    const validCategories: FeedbackCategory[] = ["craft", "bug", "idea", "inquiry", "other"];
    const sanitizedCategory: FeedbackCategory = validCategories.includes(category)
      ? category
      : "craft";

    const saved = saveFeedback({
      category: sanitizedCategory,
      sentiment: sentiment === "issue" || sentiment === "neutral" ? sentiment : "positive",
      message: message.trim(),
      contact: typeof contact === "string" ? contact.trim().slice(0, 150) : undefined,
      metadata:
        metadata && typeof metadata === "object"
          ? {
              pathname: typeof metadata.pathname === "string" ? metadata.pathname.slice(0, 200) : undefined,
              screen: typeof metadata.screen === "string" ? metadata.screen.slice(0, 30) : undefined,
              theme: typeof metadata.theme === "string" ? metadata.theme.slice(0, 10) : undefined,
              userAgent: typeof metadata.userAgent === "string" ? metadata.userAgent.slice(0, 300) : undefined,
            }
          : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for the feedback!",
        feedback: saved,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/feedback error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
