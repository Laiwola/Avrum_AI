import crypto from "node:crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getEnv } from "../config/env.js";

export type TokenType = "access" | "refresh";

export interface TokenPayload extends JwtPayload {
  sub: string;
  jti: string;
  type: TokenType;
  role: string;
  email: string;
}

export function createTokenId(): string {
  return crypto.randomUUID();
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function signToken(payload: Omit<TokenPayload, "iat" | "exp">, type: TokenType): string {
  const env = getEnv();
  const secret = type === "access" ? env.JWT_ACCESS_SECRET : env.JWT_REFRESH_SECRET;
  const expiresIn = type === "access" ? env.JWT_ACCESS_TTL : env.JWT_REFRESH_TTL;

  return jwt.sign({ ...payload, type }, secret, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string, type: TokenType): TokenPayload {
  const env = getEnv();
  const secret = type === "access" ? env.JWT_ACCESS_SECRET : env.JWT_REFRESH_SECRET;
  const decoded = jwt.verify(token, secret) as JwtPayload;

  if (typeof decoded.sub !== "string" || typeof decoded.jti !== "string") {
    throw new Error("Invalid token payload");
  }

  return {
    ...decoded,
    sub: decoded.sub,
    jti: decoded.jti,
    type,
    role: typeof decoded.role === "string" ? decoded.role : "farmer",
    email: typeof decoded.email === "string" ? decoded.email : "",
  } as TokenPayload;
}
