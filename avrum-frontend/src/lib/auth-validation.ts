import { z } from "zod";

/**
 * Client-side auth validation. Frontend-only for now — the same schemas are
 * intended to be reused by the backend handler once auth is wired up.
 */
const email = z
  .string()
  .trim()
  .min(1, { message: "Email is required" })
  .email({ message: "Enter a valid email address" })
  .max(255, { message: "Email must be less than 255 characters" });

const password = z
  .string()
  .min(8, { message: "Use at least 8 characters" })
  .max(72, { message: "Password must be less than 72 characters" });

export const signInSchema = z.object({
  email,
  password: z.string().min(1, { message: "Password is required" }),
  remember: z.boolean().optional(),
});

export const signUpSchema = z
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
      .optional(),
    email,
    password,
    confirmPassword: z.string().min(1, { message: "Confirm your password" }),
    terms: z.literal(true, {
      errorMap: () => ({ message: "Accept the terms to continue" }),
    }),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    password,
    confirmPassword: z.string().min(1, { message: "Confirm your password" }),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type FieldErrors = Record<string, string>;

/** Flatten a Zod error into a `{ field: message }` map for inline field states. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export type PasswordRule = { label: string; met: boolean };

export type PasswordStrength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  rules: PasswordRule[];
};

export function getPasswordStrength(value: string): PasswordStrength {
  const rules: PasswordRule[] = [
    { label: "At least 8 characters", met: value.length >= 8 },
    { label: "Upper and lower case letters", met: /[a-z]/.test(value) && /[A-Z]/.test(value) },
    { label: "At least one number", met: /\d/.test(value) },
    { label: "At least one symbol", met: /[^A-Za-z0-9]/.test(value) },
  ];

  const met = rules.filter((r) => r.met).length;
  const score = (value.length === 0 ? 0 : Math.max(1, met)) as PasswordStrength["score"];
  const label = ["Empty", "Weak", "Fair", "Good", "Strong"][score] as string;

  return { score, label, rules };
}
