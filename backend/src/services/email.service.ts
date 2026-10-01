import { Resend } from "resend";
import { getEnv } from "../config/env.js";
import { AppError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

function getResendClient(): Resend {
  const env = getEnv();
  if (!env.EMAIL_PROVIDER_API_KEY) {
    throw new AppError(500, "email_config_missing", "Email provider is not configured");
  }

  return new Resend(env.EMAIL_PROVIDER_API_KEY);
}

function getVerificationHtml(code: string, appBaseUrl: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #102a27; background: #f5faf8; padding: 32px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="display: inline-block; background: #133a35; color: #ffffff; border-radius: 999px; padding: 10px 18px; font-size: 12px; letter-spacing: 0.08em; font-weight: 700; text-transform: uppercase;">
          AVRUM AI
        </div>
      </div>
      <h2 style="margin: 0 0 16px; font-size: 28px; color: #0f172a;">Verify your email</h2>
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #334155;">
        Use the code below to complete your Avrum account setup.
      </p>
      <div style="background: #ffffff; border: 1px solid #dfeae7; border-radius: 10px; padding: 24px; text-align: center; margin: 20px 0;">
        <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 0.12em; color: #64748b; text-transform: uppercase; font-weight: 700;">
          Verification code
        </p>
        <div style="font-size: 36px; font-weight: 800; letter-spacing: 0.18em; color: #133a35;">${code}</div>
      </div>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #475569;">
        If you did not create this account, you can safely ignore this email.
      </p>
      <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #dfeae7; font-size: 12px; color: #64748b;">
        Avrum AI • <a href="${appBaseUrl}" style="color: #133a35;">${appBaseUrl}</a>
      </div>
    </div>
  `;
}

function getPasswordResetHtml(resetToken: string, appBaseUrl: string): string {
  const resetLink = `${appBaseUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #102a27; background: #f5faf8; padding: 32px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="display: inline-block; background: #133a35; color: #ffffff; border-radius: 999px; padding: 10px 18px; font-size: 12px; letter-spacing: 0.08em; font-weight: 700; text-transform: uppercase;">
          AVRUM AI
        </div>
      </div>
      <h2 style="margin: 0 0 16px; font-size: 28px; color: #0f172a;">Reset your password</h2>
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #334155;">
        We received a request to reset your Avrum password. Use the button below to continue.
      </p>
      <div style="margin: 24px 0; text-align: center;">
        <a href="${resetLink}" style="display: inline-block; background: #133a35; color: #ffffff; text-decoration: none; padding: 14px 22px; border-radius: 8px; font-weight: 700;">
          Reset password
        </a>
      </div>
      <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.6; color: #475569;">
        If the button does not work, copy and paste this link into your browser:
      </p>
      <p style="margin: 0; font-size: 12px; word-break: break-all; color: #475569;">${resetLink}</p>
      <p style="margin-top: 20px; font-size: 13px; line-height: 1.6; color: #475569;">
        If you did not request this reset, you can ignore this email and your password will remain unchanged.
      </p>
      <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #dfeae7; font-size: 12px; color: #64748b;">
        Avrum AI • <a href="${appBaseUrl}" style="color: #133a35;">${appBaseUrl}</a>
      </div>
    </div>
  `;
}

async function sendHtmlEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const env = getEnv();

  try {
    const resend = getResendClient();
    const response = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: [to],
      subject,
      html,
    });

    if (response.error) {
      throw new Error(response.error.message ?? "Unknown email provider error");
    }
  } catch (error) {
    logger.error("Email delivery failed");
    throw new AppError(
      502,
      "email_delivery_failed",
      "We could not deliver the email. Please try again.",
      {
        provider: "resend",
      }
    );
  }
}

export async function sendVerificationEmail(email: string, code: string): Promise<void> {
  const env = getEnv();
  await sendHtmlEmail({
    to: email,
    subject: "Verify your Avrum account",
    html: getVerificationHtml(code, env.APP_BASE_URL),
  });
}

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
  const env = getEnv();
  await sendHtmlEmail({
    to: email,
    subject: "Reset your Avrum password",
    html: getPasswordResetHtml(resetToken, env.APP_BASE_URL),
  });
}
