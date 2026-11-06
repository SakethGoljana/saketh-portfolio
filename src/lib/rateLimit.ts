import { NextRequest } from "next/server";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired records every 5 minutes to prevent memory leak
if (typeof setInterval !== "undefined") {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);

  // Unref the timer in Node.js environments so it does not keep serverless processes awake
  if (typeof cleanupTimer === "object" && typeof cleanupTimer.unref === "function") {
    cleanupTimer.unref();
  }
}

// Regular expression for validating standard IPv4 and IPv6 addresses
const IP_REGEX = /^(?:(?:\d{1,3}\.){3}\d{1,3}|[a-fA-F0-9:]{2,39})$/;

/**
 * Extract client IP from Next.js request headers.
 * Prioritizes platform-authenticated headers (Vercel, Cloudflare, standard proxy)
 * before checking generic forwarded headers.
 *
 * NOTE: On serverless infrastructure (e.g., Vercel), each cold container maintains its
 * own memory space. High-entropy credentials (`ADMIN_SECRET`, `ADMIN_TOTP_SECRET`) serve
 * as the primary security defense against brute-force attacks, while this rate-limiter
 * provides defence-in-depth cost and flood mitigation per instance.
 */
export function getClientIp(req: NextRequest): string {
  // 1. Vercel edge network header (platform-verified)
  const vercelIp = req.headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    const candidate = vercelIp.split(",")[0].trim();
    if (IP_REGEX.test(candidate)) return candidate;
  }

  // 2. Cloudflare verified connecting IP
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) {
    const candidate = cfIp.trim();
    if (IP_REGEX.test(candidate)) return candidate;
  }

  // 3. Trusted reverse proxy IP
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    const candidate = realIp.trim();
    if (IP_REGEX.test(candidate)) return candidate;
  }

  // 4. Upstream proxy chain
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((ip) => ip.trim()).filter(Boolean);
    if (ips.length > 0 && IP_REGEX.test(ips[0])) {
      return ips[0];
    }
  }

  // Fallback for local development or direct connections
  return "127.0.0.1";
}

/**
 * Fixed-window in-memory rate limiter.
 * Returns true if request limit is exceeded (blocked), false if request is allowed.
 */
export function isRateLimited(key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return false;
  }

  if (record.count >= maxAttempts) {
    return true; // Blocked
  }

  record.count += 1;
  return false;
}

/**
 * Reset rate limit counter (e.g. on successful login)
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}
