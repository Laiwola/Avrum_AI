import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MailCheck, RefreshCw } from "lucide-react";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { AuthAlert, AuthCard, AuthIllustration } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/auth-service";
import { useAuth } from "@/components/auth/auth-provider";

const TITLE = "Verify your email — AVRUM AI";
const DESCRIPTION =
  "Confirm your email address to activate your AVRUM AI account and start monitoring your fields.";

export const Route = createFileRoute("/_auth/verify-email")({
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search['email'] === "string" ? search['email'].slice(0, 255) : undefined,
  }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { email } = Route.useSearch();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [verificationCode, setVerificationCode] = React.useState("");
  const [resending, setResending] = React.useState(false);
  const [verifying, setVerifying] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);
  const [resent, setResent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [cooldown]);

  async function resend() {
    if (!email) {
      setError("Email address not found. Please try signing up again.");
      return;
    }

    setResending(true);
    setResent(false);
    setError(null);

    try {
      await authService.resendVerificationEmail(email);
      setResent(true);
      setCooldown(45);
      toast.success("Verification email sent again. It can take a minute to arrive.");
    } catch (err) {
      const axiosError = err as AxiosError<any>;
      const errorMsg = axiosError.response?.data?.message || "Failed to resend verification email";
      setError(errorMsg);
    } finally {
      setResending(false);
    }
  }

  async function verify() {
    if (!email || !verificationCode.trim()) {
      setError("Please enter the verification code");
      return;
    }

    setVerifying(true);
    setError(null);

    try {
      const response = await authService.verifyEmail({
        email,
        code: verificationCode.trim(),
      });

      setUser(response.user);
      navigate({ to: "/account-created" });
    } catch (err) {
      const axiosError = err as AxiosError<any>;
      const errorMsg = axiosError.response?.data?.message || "Invalid verification code";
      setError(errorMsg);
    } finally {
      setVerifying(false);
    }
  }

  return (
    <AuthCard
      title="Verify your email"
      description={
        email ? (
          <>
            We sent a confirmation code to{" "}
            <span className="font-semibold text-foreground">{email}</span>. Enter it below to activate your
            AVRUM AI account.
          </>
        ) : (
          "We sent a confirmation code to your inbox. Enter it below to activate your AVRUM AI account."
        )
      }
      footer={
        <>
          Wrong email address?{" "}
          <Link to="/sign-up" className="font-semibold text-primary hover:underline">
            Start over
          </Link>
        </>
      }
    >
      <div className="space-y-6">
        <AuthIllustration icon={MailCheck} tone="sky" />

        {error && <AuthAlert tone="error">{error}</AuthAlert>}

        {resent && (
          <AuthAlert tone="success">
            Confirmation email sent again. It can take a minute to arrive.
          </AuthAlert>
        )}

        <AuthAlert tone="info">
          Nothing in your inbox? Check spam and promotions, and confirm your organisation allows mail
          from avrum.ai.
        </AuthAlert>

        <div className="space-y-3">
          <div>
            <label htmlFor="code" className="block text-sm font-medium mb-1.5">
              Verification code
            </label>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Button
            variant="outline"
            size="lg"
            block
            loading={resending}
            disabled={cooldown > 0}
            onClick={resend}
          >
            {!resending && <RefreshCw />}
            {resending
              ? "Sending…"
              : cooldown > 0
                ? `Resend available in ${cooldown}s`
                : "Resend confirmation email"}
          </Button>
          <Button
            variant="ai"
            size="lg"
            block
            loading={verifying}
            onClick={verify}
          >
            {verifying ? "Verifying…" : "Verify email"}
          </Button>
        </div>
      </div>
    </AuthCard>
  );
}
