import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, LockKeyhole } from "lucide-react";

import {
  AuthAlert,
  AuthCard,
  AuthField,
  AuthIllustration,
  PasswordInput,
  PasswordStrengthMeter,
} from "@/components/auth";
import { Button } from "@/components/ui/button";
import { resetPasswordSchema, toFieldErrors, type FieldErrors } from "@/lib/auth-validation";

const TITLE = "Set a new password — AVRUM AI";
const DESCRIPTION =
  "Choose a new password for your AVRUM AI account and return to your farm intelligence workspace.";

export const Route = createFileRoute("/_auth/reset-password")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [loading, setLoading] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [done, setDone] = React.useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = resetPasswordSchema.safeParse({
      password: String(data.get("password") ?? ""),
      confirmPassword: String(data.get("confirmPassword") ?? ""),
    });

    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      return;
    }

    setErrors({});
    setLoading(true);
    // Frontend only: no backend call yet.
    window.setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 900);
  }

  if (done) {
    return (
      <AuthCard
        title="Password updated"
        description="Your password has been changed. Sign in with your new credentials to continue."
      >
        <div className="space-y-6">
          <AuthIllustration icon={CheckCircle2} tone="emerald" />
          <Button
            variant="ai"
            size="lg"
            block
            onClick={() => navigate({ to: "/sign-in" })}
          >
            Continue to sign in
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      icon={LockKeyhole}
      title="Set a new password"
      description="Choose a password you haven't used on AVRUM AI before."
      footer={
        <>
          Link expired?{" "}
          <Link to="/forgot-password" className="font-semibold text-primary hover:underline">
            Request a new one
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <AuthAlert tone="info">
          For security, you'll be signed out of other devices after updating your password.
        </AuthAlert>

        <AuthField id="password" label="New password" error={errors["password"]}>
          <div className="space-y-2.5">
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              placeholder="Create a strong password"
              maxLength={72}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(errors["password"])}
            />
            <PasswordStrengthMeter value={password} />
          </div>
        </AuthField>

        <AuthField id="confirmPassword" label="Confirm new password" error={errors["confirmPassword"]}>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            maxLength={72}
            aria-invalid={Boolean(errors["confirmPassword"])}
          />
        </AuthField>

        <Button type="submit" variant="ai" size="lg" block loading={loading}>
          {loading ? "Updating password…" : "Update password"}
        </Button>
      </form>
    </AuthCard>
  );
}
