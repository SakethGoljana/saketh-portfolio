import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  isAuthenticatedRequest,
  verifyPassword,
  verifyPin,
  getTotpSetupInfo,
  generateSessionToken,
} from "@/lib/auth";
import { getClientIp, isRateLimited, resetRateLimit } from "@/lib/rateLimit";

const MAX_AUTH_ATTEMPTS = 5;
const AUTH_WINDOW_MS = 15 * 60 * 1000; // 15 minutes lockout

export async function GET(req: NextRequest) {
  const isAuth = isAuthenticatedRequest(req);
  if (!isAuth) {
    return NextResponse.json({ authenticated: false });
  }

  // Provide TOTP setup info strictly for authenticated admin
  return NextResponse.json({
    authenticated: true,
    totp: getTotpSetupInfo(),
  });
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rateLimitKey = `auth:${ip}`;

  // Check brute-force rate limit
  if (isRateLimited(rateLimitKey, MAX_AUTH_ATTEMPTS, AUTH_WINDOW_MS)) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many failed attempts. Temporary lockout for 15 minutes to protect CRM access.",
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { password, pin } = body;

    let isValid = false;
    let authMethod = "";

    // Authenticate with 6-digit Google Authenticator PIN
    if (pin && typeof pin === "string" && pin.trim().length === 6) {
      if (verifyPin(pin)) {
        isValid = true;
        authMethod = "Google Authenticator TOTP PIN";
      }
    }

    // Authenticate with Master Password
    if (!isValid && password && typeof password === "string") {
      if (verifyPassword(password)) {
        isValid = true;
        authMethod = "Master Password";
      }
    }

    if (!isValid) {
      // Artificial 250ms delay to deter timing analysis & slow down brute-force attacks
      await new Promise((resolve) => setTimeout(resolve, 250));

      const errorMsg = pin
        ? "Invalid 6-digit Authenticator PIN or expired code. Try again."
        : "Incorrect secret password. Access denied.";
      return NextResponse.json({ success: false, error: errorMsg }, { status: 401 });
    }

    // Login successful: reset rate limiter for this IP
    resetRateLimit(rateLimitKey);

    // Generate cryptographically signed HMAC session token
    const sessionToken = generateSessionToken();

    const response = NextResponse.json({
      success: true,
      message: `Authenticated via ${authMethod}`,
    });

    // Set HttpOnly, SameSite=Strict cookie valid for 7 days
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Auth login error:", err);
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}
