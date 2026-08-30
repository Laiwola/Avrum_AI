import crypto from "node:crypto";

export function generateOtpCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export function sanitizeUserPayload(user: Record<string, unknown>) {
  const { passwordHash, __v, ...safeUser } = user as Record<string, unknown> & {
    passwordHash?: string;
    __v?: number;
  };

  return safeUser;
}

export function resolveClientIp(req: { ip?: string; headers: Record<string, unknown> }): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  if (Array.isArray(forwarded) && forwarded.length > 0) return String(forwarded[0]).trim();
  return req.ip ?? "unknown";
}

export function resolveUserAgent(req: { headers: Record<string, unknown> }): string {
  const userAgent = req.headers["user-agent"];
  return typeof userAgent === "string" ? userAgent : "unknown";
}
