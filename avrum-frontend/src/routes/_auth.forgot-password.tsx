import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, KeyRound, MailCheck } from "lucide-react";

import { AuthAlert, AuthCard, AuthField, AuthIllustration } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema, toFieldErrors, type FieldErrors } from "@/lib/auth-validation";

const TITLE = "Reset your password — AVRUM AI";
const DESCRIPTION =
  "Request a password reset link for your AVRUM AI account and regain access to your farm intelligence workspace.";

export const Route = createFileRoute("/_auth/forgot-password")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [loading, setLoading] = React.useState(false);
  const [sentTo, setSentTo] = React.useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = forgotPasswordSchema.safeParse({ email: String(data.get("email") ?? "") });

    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      return;
    }

    setErrors({});
    setLoading(true);
    // Frontend only: no backend call yet.
    window.setTimeout(() => {
      setLoading(false);
      setSentTo(parsed.data.email);
    }, 900);
  }

  if (sentTo) {
    return (
      <AuthCard
        title="Check your inbox"
        description={
          <>
            We sent a password reset link to{" "}
            <span className="font-semibold text-foreground">{sentTo}</span>. The link expires in 30
            minutes.
          </>
        }
        footer={
          <>
            Wrong address?{" "}
            <button
              type="button"
              onClick={() => setSentTo(null)}
              className="font-semibold text-primary hover:underline"
            >
              Use a different email
            </button>
          </>
        }
      >
        <div className="space-y-6">
          <AuthIllustration icon={MailCheck} tone="emerald" />
          <AuthAlert tone="info">
            Reset links are single use. If it expires, request a new one from this page.
          </AuthAlert>
          <Button variant="outline" size="lg" block asChild>
            <Link to="/sign-in">Back to sign in</Link>
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      icon={KeyRound}
      title="Forgot your password?"
      description="Enter the email on your account and we'll send you a secure reset link."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/sign-in" className="font-semibold text-primary hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <AuthField
          id="email"
          label="Work email"
          error={errors["email"]}
          hint="We'll only email you if this address has an AVRUM AI account."
        >
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="agronomist@farm.co"
            maxLength={255}
            aria-invalid={Boolean(errors["email"])}
          />
        </AuthField>

        <Button type="submit" variant="ai" size="lg" block loading={loading}>
          {loading ? "Sending link…" : "Send reset link"}
          {!loading && <ArrowRight />}
        </Button>
      </form>
    </AuthCard>
  );
}
