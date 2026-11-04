import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import crypto from "crypto";
import { verifyTOTP, getTotpUri } from "./totp";

export const AUTH_COOKIE_NAME = "saketh_admin_session";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Ephemeral development-only fallback; never committed credentials.
const DEV_EPHEMERAL_SECRET = crypto.randomBytes(32).toString("hex");

// Track recently consumed TOTP codes to prevent replay attacks within time window
const consumedTotpTokens = new Map<string, number>();

export function getAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "CRITICAL SECURITY CONFIGURATION: ADMIN_SECRET environment variable must be set in production before starting the server."
      );
    }
    return DEV_EPHEMERAL_SECRET;
  }
  return secret;
}

export function getAdminTotpSecret(): string {
  const totpSecret = process.env.ADMIN_TOTP_SECRET;
  if (!totpSecret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "CRITICAL SECURITY CONFIGURATION: ADMIN_TOTP_SECRET environment variable must be set in production before starting the server."
      );
    }
    return "";
  }
  return totpSecret.replace(/\s+/g, "").toUpperCase();
}

/**
 * Constant-time password verification using SHA-256 digest comparison
 * to eliminate timing attack vulnerabilities.
 */
export function verifyPassword(password: string): boolean {
  if (!password || typeof password !== "string") return false;
  const secret = getAdminSecret().trim();
  const cleanInput = password.trim();

  const hashA = crypto.createHash("sha256").update(cleanInput).digest();
  const hashB = crypto.createHash("sha256").update(secret).digest();

  return crypto.timingSafeEqual(hashA, hashB);
}

/**
 * Verify 6-digit TOTP with replay protection
 */
export function verifyPin(pin: string): boolean {
  if (!pin || typeof pin !== "string") return false;
  const cleanPin = pin.trim();
  if (cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) return false;

  const now = Date.now();

  // Purge expired replay cache (older than 90s)
  for (const [code, timestamp] of consumedTotpTokens.entries()) {
    if (now - timestamp > 90 * 1000) {
      consumedTotpTokens.delete(code);
    }
  }

  // Prevent token replay
  if (consumedTotpTokens.has(cleanPin)) {
    return false;
  }

  const secret = getAdminTotpSecret();
  const isValid = verifyTOTP(cleanPin, secret, 1);

  if (isValid) {
    consumedTotpTokens.set(cleanPin, now);
  }

  return isValid;
}

export function getTotpSetupInfo() {
  const secret = getAdminTotpSecret();
  const uri = getTotpUri(secret, "saketh_", "Saketh Portfolio");
  return {
    secret,
    uri,
    account: "saketh_",
    issuer: "Saketh Portfolio",
  };
}

/**
 * Generate a cryptographically signed HMAC session token
 * Format: <timestamp>.<hmacSignature>
 */
export function generateSessionToken(): string {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac("sha256", getAdminSecret())
    .update(`session:${timestamp}`)
    .digest("hex");
  return `${timestamp}.${signature}`;
}

/**
 * Verify HMAC session token authenticity and expiration
 */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  const now = Date.now();
  // Check if expired or clock skewed in the future > 1 min
  if (now < timestamp - 60 * 1000 || now - timestamp > SESSION_MAX_AGE_MS) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", getAdminSecret())
    .update(`session:${timestampStr}`)
    .digest("hex");

  try {
    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expectedSignature, "hex");
    if (sigBuf.length !== expBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

// Check session in API Route handlers
export function isAuthenticatedRequest(req: NextRequest): boolean {
  const cookie = req.cookies.get(AUTH_COOKIE_NAME);
  if (!cookie || !cookie.value) return false;
  return verifySessionToken(cookie.value);
}

// Check session in Server Components
export async function isAuthenticatedServer(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);
  if (!sessionCookie || !sessionCookie.value) return false;
  return verifySessionToken(sessionCookie.value);
}
