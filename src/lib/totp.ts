import crypto from "crypto";

// RFC 4648 Base32 alphabet
const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * Decode a Base32 string into a Buffer.
 * Removes spaces, dashes, and ignores case.
 */
export function base32Decode(input: string): Buffer {
  const cleanInput = input.toUpperCase().replace(/[\s-]/g, "");
  let bits = "";

  for (let i = 0; i < cleanInput.length; i++) {
    const char = cleanInput[i];
    const val = BASE32_ALPHABET.indexOf(char);
    if (val === -1) continue; // Skip padding or invalid characters
    bits += val.toString(2).padStart(5, "0");
  }

  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2));
  }

  return Buffer.from(bytes);
}

/**
 * Generate a 6-digit TOTP code for a given secret and counter step.
 * RFC 6238 / RFC 4226 HMAC-SHA1.
 */
export function generateTOTP(secret: string, timeStepWindow = 30, offsetSteps = 0): string {
  const key = base32Decode(secret);
  if (key.length === 0) {
    return "000000";
  }
  const epoch = Math.floor(Date.now() / 1000);
  const counter = Math.floor(epoch / timeStepWindow) + offsetSteps;

  // Counter must be 8-byte big-endian buffer
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter), 0);

  const hmac = crypto.createHmac("sha1", key);
  hmac.update(buf);
  const digest = hmac.digest();

  // Dynamic truncation
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const otp = binary % 1000000;
  return otp.toString().padStart(6, "0");
}

/**
 * Verify a 6-digit TOTP token against a secret.
 * Checks the current time window and ±1 window (drift tolerance of ±30s).
 */
export function verifyTOTP(token: string, secret: string, window = 1): boolean {
  if (!token || !secret) return false;
  const cleanToken = token.trim();
  if (cleanToken.length !== 6 || !/^\d{6}$/.test(cleanToken)) return false;

  for (let offset = -window; offset <= window; offset++) {
    const expected = generateTOTP(secret, 30, offset);
    if (crypto.timingSafeEqual(Buffer.from(cleanToken), Buffer.from(expected))) {
      return true;
    }
  }

  return false;
}

/**
 * Build standard otpauth URI for Google Authenticator.
 */
export function getTotpUri(
  secret: string,
  account = "admin",
  issuer = "Saketh Portfolio"
): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedAccount = encodeURIComponent(account);
  const cleanSecret = secret.replace(/[\s-]+/g, "").toUpperCase();
  return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${cleanSecret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}
