import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MailCheck, RefreshCw } from "lucide-react";

import { AuthAlert, AuthCard, AuthIllustration } from "@/components/auth";
import { Button } from "@/components/ui/button";

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
  const [resending, setResending] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);
  const [resent, setResent] = React.useState(false);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [cooldown]);

  function resend() {
    setResending(true);
    setResent(false);
    // Frontend only: no backend call yet.
    window.setTimeout(() => {
      setResending(false);
      setResent(true);
      setCooldown(45);
    }, 900);
  }

  return (
    <AuthCard
      title="Verify your email"
      description={
        email ? (
          <>
            We sent a confirmation link to{" "}
            <span className="font-semibold text-foreground">{email}</span>. Click it to activate your
            AVRUM AI account.
          </>
        ) : (
          "We sent a confirmation link to your inbox. Click it to activate your AVRUM AI account."
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

        {resent && (
          <AuthAlert tone="success">
            Confirmation email sent again. It can take a minute to arrive.
          </AuthAlert>
        )}

        <AuthAlert tone="info">
          Nothing in your inbox? Check spam and promotions, and confirm your organisation allows mail
          from avrum.ai.
        </AuthAlert>

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
            onClick={() => navigate({ to: "/account-created" })}
          >
            I've confirmed my email
          </Button>
        </div>
      </div>
    </AuthCard>
  );
}
