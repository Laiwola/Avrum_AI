import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, { message: "Email is required" })
  .email({ message: "Enter a valid email address" })
  .max(255, { message: "Email must be less than 255 characters" });

export const passwordSchema = z
  .string()
  .min(8, { message: "Use at least 8 characters" })
  .max(72, { message: "Password must be less than 72 characters" });

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, { message: "Enter your full name" })
      .max(100, { message: "Name must be less than 100 characters" }),
    organisation: z
      .string()
      .trim()
      .max(120, { message: "Organisation must be less than 120 characters" })
      .optional()
      .or(z.literal("")),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, { message: "Confirm your password" }),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }),
  remember: z.boolean().optional(),
});

export const verifyEmailSchema = z.object({
  email: emailSchema,
  code: z.string().trim().min(4, { message: "Verification code is required" }),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, { message: "Refresh token is required" }),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, { message: "Reset token is required" }),
    password: passwordSchema,
    confirmPassword: z.string().min(1, { message: "Confirm your password" }),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1).max(64).optional(),
  lastName: z.string().trim().min(1).max(64).optional(),
  phone: z.string().trim().max(32).optional(),
  organisation: z.string().trim().max(120).optional(),
  language: z.enum(["en", "ha", "yo", "ig", "fr", "sw"]).optional(),
  timezone: z.string().max(64).optional(),
  theme: z.enum(["light", "dark"]).optional(),
  bio: z.string().trim().max(500).optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    password: passwordSchema,
    confirmPassword: z.string().min(1, { message: "Confirm your password" }),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const onboardingDraftSchema = z.object({
  step: z.number().int().min(0).max(50).optional(),
  data: z.record(z.unknown()).optional(),
});

export const onboardingCompleteSchema = z.object({
  draft: z.record(z.unknown()).optional(),
  data: z.record(z.unknown()).optional(),
  step: z.number().int().min(0).optional(),
});
