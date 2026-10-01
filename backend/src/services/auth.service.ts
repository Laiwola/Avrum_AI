import mongoose from "mongoose";
import { getEnv } from "../config/env.js";
import { createTokenId, hashToken, signToken, verifyToken } from "../lib/token.js";
import { generateOtpCode, resolveClientIp, resolveUserAgent } from "../lib/auth.js";
import { Farm } from "../models/Farm.js";
import { Field } from "../models/Field.js";
import { OnboardingDraft } from "../models/OnboardingDraft.js";
import { Organization } from "../models/Organization.js";
import { OrganizationMember } from "../models/OrganizationMember.js";
import { Session } from "../models/Session.js";
import { User } from "../models/User.js";
import { VerificationToken } from "../models/VerificationToken.js";
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../utils/errors.js";
import { sendPasswordResetEmail, sendVerificationEmail } from "./email.service.js";

function buildUserResponse(user: Record<string, unknown>) {
  const { passwordHash, verificationCode, verificationCodeExpiresAt, ...safeUser } = user as Record<string, unknown> & {
    passwordHash?: string;
    verificationCode?: string;
    verificationCodeExpiresAt?: Date;
  };
  return safeUser;
}

function parseFullName(fullName: string) {
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  const firstName = parts.shift() ?? "";
  const lastName = parts.join(" ") || "";
  return { firstName, lastName };
}

export function normalizeFarmOwnershipType(value?: unknown): "individual" | "cooperative" | "commercial" | "government" | "ngo" {
  switch (value) {
    case "cooperative":
      return "cooperative";
    case "government":
      return "government";
    case "ngo":
      return "ngo";
    case "leased":
    case "managed":
      return "commercial";
    case "family":
    case "owned":
    default:
      return "individual";
  }
}

export function normalizeFarmSizeUnit(value?: unknown): "hectares" | "acres" | "plots" {
  switch (value) {
    case "acres":
    case "plots":
      return value;
    case "hectares":
    default:
      return "hectares";
  }
}

function roleFromUserType(userType?: string): "farmer" | "agronomist" | "cooperative_lead" | "developer" | "admin" {
  switch (userType) {
    case "agronomist":
      return "agronomist";
    case "cooperative":
      return "cooperative_lead";
    case "developer":
      return "developer";
    case "admin":
      return "admin";
    default:
      return "farmer";
  }
}

function buildSessionPayload(user: { _id: mongoose.Types.ObjectId; email: string; role: string }, userAgent: string, ipAddress: string) {
  const accessTokenJti = createTokenId();
  const refreshTokenJti = createTokenId();

  const accessToken = signToken(
    {
      sub: user._id.toString(),
      jti: accessTokenJti,
      role: user.role,
      email: user.email,
    },
    "access"
  );

  const refreshToken = signToken(
    {
      sub: user._id.toString(),
      jti: refreshTokenJti,
      role: user.role,
      email: user.email,
    },
    "refresh"
  );

  return {
    accessToken,
    refreshToken,
    accessTokenJti,
    refreshTokenJti,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    userAgent,
    ipAddress,
  };
}

export async function registerUser(input: {
  fullName: string;
  organisation?: string;
  email: string;
  password: string;
}) {
  const email = input.email.trim().toLowerCase();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError("An account with this email already exists");
  }

  const { firstName, lastName } = parseFullName(input.fullName);
  const verificationCode = generateOtpCode();
  const user = new User({
    email,
    firstName,
    lastName,
    organisation: input.organisation?.trim() || undefined,
    passwordHash: input.password,
    role: "farmer",
    emailVerified: false,
    verificationCode,
    verificationCodeExpiresAt: new Date(Date.now() + 1000 * 60 * 10),
  });

  await user.save();

  const verificationToken = await VerificationToken.create({
    userId: user._id,
    token: verificationCode,
    type: "email_verification",
    expiresAt: new Date(Date.now() + 1000 * 60 * 10),
  });

  try {
    await sendVerificationEmail(email, verificationCode);
  } catch (error) {
    const env = getEnv();
    // In development, log the error but continue; in production, roll back
    if (env.NODE_ENV === "production") {
      await User.deleteOne({ _id: user._id });
      await VerificationToken.deleteOne({ _id: verificationToken._id });
      throw error;
    } else {
      // Development: log error but allow registration to proceed
      console.warn("⚠️  Email delivery failed in development mode, but user was created. Error:", error instanceof Error ? error.message : String(error));
    }
  }

  return {
    user: buildUserResponse(user.toObject()),
    requiresVerification: true,
  };
}

export async function verifyEmail(input: { email: string; code: string }) {
  const user = await User.findOne({ email: input.email.trim().toLowerCase() });
  if (!user) {
    throw new NotFoundError("User");
  }

  if (!user.verificationCode || !user.verificationCodeExpiresAt || user.verificationCodeExpiresAt < new Date()) {
    throw new ValidationError("Verification code has expired. Please request a new one.");
  }

  if (user.verificationCode !== input.code.trim()) {
    throw new ValidationError("Invalid verification code");
  }

  user.emailVerified = true;
  user.emailVerifiedAt = new Date();
  user.verificationCode = undefined;
  user.verificationCodeExpiresAt = undefined;
  await user.save();

  return await createAuthenticatedSession(user, "email_verification");
}

export async function resendVerificationEmail(input: { email: string }) {
  const user = await User.findOne({ email: input.email.trim().toLowerCase() });
  if (!user) {
    throw new NotFoundError("User");
  }

  if (user.emailVerified) {
    throw new ValidationError("Email address is already verified");
  }

  // Generate new verification code
  const verificationCode = generateOtpCode();
  user.verificationCode = verificationCode;
  user.verificationCodeExpiresAt = new Date(Date.now() + 1000 * 60 * 10);
  await user.save();

  // Delete old verification tokens
  await VerificationToken.deleteMany({ userId: user._id, type: "email_verification" });

  // Create new verification token
  await VerificationToken.create({
    userId: user._id,
    token: verificationCode,
    type: "email_verification",
    expiresAt: new Date(Date.now() + 1000 * 60 * 10),
  });

  await sendVerificationEmail(user.email, verificationCode);

  return { ok: true };
}

export async function loginUser(input: { email: string; password: string; remember?: boolean }, metadata: { userAgent: string; ipAddress: string }) {
  const user = await User.findOne({ email: input.email.trim().toLowerCase() }).select("+passwordHash");
  if (!user) {
    throw new AuthenticationError("Invalid email or password");
  }

  const isValidPassword = await user.comparePassword(input.password);
  if (!isValidPassword) {
    throw new AuthenticationError("Invalid email or password");
  }

  if (!user.emailVerified) {
    throw new ValidationError("Email address has not been verified yet");
  }

  user.lastLoginAt = new Date();
  await user.save();

  return await createAuthenticatedSession(user, "login", { remember: input.remember, ...(metadata ?? {}) });
}

export async function refreshToken(input: { refreshToken: string }, metadata: { userAgent: string; ipAddress: string }) {
  const token = input.refreshToken.trim();
  const payload = verifyToken(token, "refresh");

  const session = await Session.findOne({
    refreshTokenJti: payload.jti,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!session) {
    throw new AuthenticationError("Refresh token is invalid or expired");
  }

  const user = await User.findById(session.userId);
  if (!user) {
    throw new AuthenticationError("User account no longer exists");
  }

  const newSession = buildSessionPayload(user, metadata.userAgent, metadata.ipAddress);

  session.accessTokenJti = newSession.accessTokenJti;
  session.refreshTokenJti = newSession.refreshTokenJti;
  session.refreshTokenHash = hashToken(newSession.refreshToken);
  session.userAgent = metadata.userAgent;
  session.ipAddress = metadata.ipAddress;
  session.expiresAt = newSession.expiresAt;
  await session.save();

  return {
    accessToken: newSession.accessToken,
    refreshToken: newSession.refreshToken,
  };
}

export async function logoutUser(userId: string, accessToken?: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User");
  }

  if (accessToken) {
    const payload = verifyToken(accessToken, "access");
    await Session.updateMany(
      { userId: user._id, accessTokenJti: payload.jti, revokedAt: null },
      { revokedAt: new Date(), revokedReason: "user_logout" }
    );
  }

  await Session.updateMany({ userId: user._id, revokedAt: null }, { revokedAt: new Date(), revokedReason: "user_logout" });

  return { ok: true };
}

export async function forgotPassword(input: { email: string }) {
  const user = await User.findOne({ email: input.email.trim().toLowerCase() });
  if (!user) {
    return { ok: true };
  }

  const token = createTokenId();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

  await VerificationToken.create({
    userId: user._id,
    token,
    type: "password_reset",
    expiresAt,
  });

  await sendPasswordResetEmail(user.email, token);

  return { ok: true };
}

export async function resetPassword(input: { token: string; password: string }) {
  const resetToken = await VerificationToken.findOne({
    token: input.token,
    type: "password_reset",
    usedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!resetToken) {
    throw new ValidationError("Password reset token is invalid or expired");
  }

  const user = await User.findById(resetToken.userId);
  if (!user) {
    throw new NotFoundError("User");
  }

  user.passwordHash = input.password;
  resetToken.usedAt = new Date();
  await Promise.all([user.save(), resetToken.save()]);

  return { ok: true };
}

export async function getCurrentUser(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User");
  return buildUserResponse(user.toObject());
}

export async function updateProfile(userId: string, input: Record<string, unknown>) {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User");

  if (typeof input.firstName === "string") user.firstName = input.firstName.trim();
  if (typeof input.lastName === "string") user.lastName = input.lastName.trim();
  if (typeof input.phone === "string") user.phone = input.phone.trim();
  if (typeof input.organisation === "string") user.organisation = input.organisation.trim();
  if (typeof input.language === "string") user.language = input.language;
  if (typeof input.timezone === "string") user.timezone = input.timezone;
  if (typeof input.theme === "string") user.theme = input.theme as "light" | "dark";
  if (typeof input.bio === "string") user.bio = input.bio.trim();

  await user.save();
  return buildUserResponse(user.toObject());
}

export async function changePassword(userId: string, currentPassword: string, nextPassword: string) {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User");

  const valid = await user.comparePassword(currentPassword);
  if (!valid) {
    throw new AuthenticationError("Current password is incorrect");
  }

  user.passwordHash = nextPassword;
  await user.save();
  return { ok: true };
}

export async function listSessions(userId: string) {
  const sessions = await Session.find({ userId, revokedAt: null }).sort({ createdAt: -1 }).lean();
  return { sessions: sessions.map((item) => ({
    id: item._id,
    userAgent: item.userAgent,
    ipAddress: item.ipAddress,
    deviceName: item.deviceName,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    expiresAt: item.expiresAt,
  })) };
}

export async function revokeSession(userId: string, sessionId: string) {
  const session = await Session.findOne({ _id: sessionId, userId });
  if (!session) throw new NotFoundError("Session");
  session.revokedAt = new Date();
  session.revokedReason = "user_revoked";
  await session.save();
  return { ok: true };
}

export async function saveDraft(userId: string, input: { step?: number; data?: Record<string, unknown> }) {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User");

  const draft = await OnboardingDraft.findOneAndUpdate(
    { userId },
    {
      $set: {
        step: input.step,
        data: input.data ?? {},
        lastSavedAt: new Date(),
        status: "in_progress",
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return { draftId: draft._id, savedAt: draft.lastSavedAt };
}

export async function completeOnboarding(userId: string, payload: Record<string, unknown>) {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User");

  const draftInput = (payload.draft ?? payload.data ?? {}) as Record<string, unknown>;
  const mergedData = { ...draftInput, ...((payload.data as Record<string, unknown>) ?? {}) };

  const userType = typeof mergedData.userType === "string" ? mergedData.userType : user.userType ?? "smallholder";
  const role = roleFromUserType(userType);
  const organisationName =
    typeof mergedData.organisation === "string" && mergedData.organisation.trim().length > 0
      ? mergedData.organisation.trim()
      : typeof user.organisation === "string"
        ? user.organisation
        : undefined;

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const currentUser = await User.findById(userId).session(session);
      if (!currentUser) throw new NotFoundError("User");

      currentUser.userType = userType;
      currentUser.role = role;
      currentUser.onboardingCompleted = true;
      if (typeof mergedData.firstName === "string") currentUser.firstName = mergedData.firstName.trim();
      if (typeof mergedData.lastName === "string") currentUser.lastName = mergedData.lastName.trim();
      if (typeof mergedData.phone === "string") currentUser.phone = mergedData.phone.trim();
      if (typeof mergedData.language === "string") currentUser.language = mergedData.language;
      if (typeof mergedData.country === "string") currentUser.location = `${mergedData.country}${typeof mergedData.state === "string" ? `, ${mergedData.state}` : ""}`;
      if (typeof mergedData.organisation === "string") currentUser.organisation = mergedData.organisation.trim();
      await currentUser.save({ session });

      if (organisationName) {
        let organization = await Organization.findOne({ slug: organisationName.toLowerCase().replace(/\s+/g, "-") }).session(session);
        if (!organization) {
          const createdOrganization: any = (
            await Organization.create(
              [
                {
                  name: organisationName,
                  slug: organisationName.toLowerCase().replace(/\s+/g, "-"),
                  type: "individual",
                  ownerId: currentUser._id,
                  settings: {},
                  isActive: true,
                },
              ],
              { session }
            )
          )[0];
          currentUser.organizationId = createdOrganization._id;
          await currentUser.save({ session });
        } else {
          currentUser.organizationId = organization._id;
          await currentUser.save({ session });
        }

        await OrganizationMember.findOneAndUpdate(
          { organizationId: currentUser.organizationId, userId: currentUser._id },
          { role: "owner", status: "active" },
          { upsert: true, new: true, setDefaultsOnInsert: true, session }
        );
      }

      const farmName =
        typeof mergedData.farmName === "string" && mergedData.farmName.trim().length > 0
          ? mergedData.farmName.trim()
          : `${currentUser.firstName || "My"} Farm`;

      const farmSize = Number(mergedData.farmSize ?? 0);
      const farmSizeUnit = normalizeFarmSizeUnit(mergedData.sizeUnit);
      const farmOwnershipType = normalizeFarmOwnershipType(mergedData.ownership);
      const createdFarm: any = (
        await Farm.create(
          [
            {
              name: farmName,
              ownerId: currentUser._id,
              organizationId: currentUser.organizationId,
              location: {
                country: typeof mergedData.country === "string" ? mergedData.country : "Nigeria",
                state: typeof mergedData.state === "string" ? mergedData.state : "",
                town: typeof mergedData.town === "string" ? mergedData.town : "",
              },
              size: Number.isFinite(farmSize) ? farmSize : 0,
              sizeUnit: farmSizeUnit,
              ownershipType: farmOwnershipType,
              crops: Array.isArray(mergedData.crops) ? mergedData.crops.filter((item): item is string => typeof item === "string") : [],
            },
          ],
          { session }
        )
      )[0];

      const fieldBoundary = {
        type: "Polygon",
        coordinates: [[
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0],
          [0, 0],
        ]],
      };

      const createdField: any = (
        await Field.create(
          [
            {
              name: `${createdFarm.name} Field 1`,
              farmId: createdFarm._id,
              boundary: fieldBoundary,
              areaHectares: Number.isFinite(farmSize) ? Math.max(farmSize, 0) : 0,
            },
          ],
          { session }
        )
      )[0];

      await OnboardingDraft.findOneAndUpdate(
        { userId },
        {
          $set: {
            status: "completed",
            data: mergedData,
            completedAt: new Date(),
            lastSavedAt: new Date(),
          },
        },
        { upsert: true, session }
      );

      await currentUser.save({ session });

      return {
        user: buildUserResponse(currentUser.toObject()),
        farm: createdFarm.toObject(),
        field: createdField.toObject(),
      };
    });

    return { ok: true };
  } finally {
    await session.endSession();
  }
}

async function createAuthenticatedSession(user: { _id: mongoose.Types.ObjectId; email: string; role: string }, source: string, extra: Record<string, unknown> = {}) {
  const env = getEnv();
  const metadata = {
    userAgent: typeof extra.userAgent === "string" ? extra.userAgent : "unknown",
    ipAddress: typeof extra.ipAddress === "string" ? extra.ipAddress : "unknown",
  };

  const session = buildSessionPayload(user, metadata.userAgent, metadata.ipAddress);
  const sessionDocument = await Session.create({
    userId: user._id,
    accessTokenJti: session.accessTokenJti,
    refreshTokenJti: session.refreshTokenJti,
    refreshTokenHash: hashToken(session.refreshToken),
    userAgent: metadata.userAgent,
    ipAddress: metadata.ipAddress,
    deviceName: source,
    expiresAt: new Date(Date.now() + Number.parseInt(env.JWT_REFRESH_TTL.replace(/\D/g, ""), 10) * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    user: buildUserResponse((await User.findById(user._id))?.toObject() ?? {}),
    sessionId: sessionDocument._id,
  };
}

export function decodeAccessToken(token: string) {
  return verifyToken(token, "access");
}

export function getRequestContext(req: { headers: Record<string, unknown>; ip?: string }) {
  return {
    userAgent: resolveUserAgent(req),
    ipAddress: resolveClientIp(req),
  };
}
