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

/**
 * Extract client IP from Next.js request headers.
 * Prioritizes platform-authenticated headers (Vercel, Cloudflare, standard proxy)
 * before checking generic forwarded headers.
 */
export function getClientIp(req: NextRequest): string {
  // Vercel edge network header
  const vercelIp = req.headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    return vercelIp.split(",")[0].trim();
  }

  // Cloudflare verified connecting IP
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp.trim();
  }

  // Trusted reverse proxy IP
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  // Upstream proxy chain
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((ip) => ip.trim()).filter(Boolean);
    if (ips.length > 0) {
      return ips[0];
    }
  }

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
