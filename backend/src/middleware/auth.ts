import { NextFunction, Request, Response } from "express";
import { User, IUser } from "../models/User.js";
import { Session } from "../models/Session.js";
import { AuthenticationError, AuthorizationError } from "../utils/errors.js";
import { verifyToken } from "../lib/token.js";

export type AuthenticatedRequest = Request & {
  user?: IUser;
};

export async function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): Promise<void> {
  try {
    const header = req.headers.authorization;
    const token = typeof header === "string" && header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      throw new AuthenticationError("Authentication required");
    }

    const payload = verifyToken(token, "access");
    const user = await User.findById(payload.sub);
    if (!user) {
      throw new AuthenticationError("User account not found");
    }

    const activeSession = await Session.findOne({
      userId: user._id,
      accessTokenJti: payload.jti,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    });

    if (!activeSession) {
      throw new AuthenticationError("Session is no longer valid");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error instanceof Error ? error : new AuthenticationError());
  }
}

export function requireRole(roles: Array<IUser["role"]>) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    const user = req.user;
    if (!user) {
      next(new AuthenticationError("Authentication required"));
      return;
    }

    if (!roles.includes(user.role)) {
      next(new AuthorizationError("Insufficient permissions"));
      return;
    }

    next();
  };
}

export const requireAdmin = requireRole(["admin"]);
export const requireDeveloperOrAdmin = requireRole(["developer", "admin"]);

export function requireOrganizationMembership(expectedOrganizationId?: string) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    const user = req.user;
    const targetId = expectedOrganizationId ?? (req.params as { organizationId?: string }).organizationId;

    if (!user) {
      next(new AuthenticationError("Authentication required"));
      return;
    }

    if (user.organizationId && targetId && user.organizationId.toString() === targetId) {
      next();
      return;
    }

    if (!targetId && user.organizationId) {
      next();
      return;
    }

    next(new AuthorizationError("You do not belong to this organization"));
  };
}
