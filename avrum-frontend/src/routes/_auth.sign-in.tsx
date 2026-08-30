import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, LogIn } from "lucide-react";

import { AuthAlert, AuthCard, AuthField, OAuthProviders, PasswordInput } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInSchema, toFieldErrors, type FieldErrors } from "@/lib/auth-validation";

const TITLE = "Sign in — AVRUM AI";
const DESCRIPTION =
  "Sign in to AVRUM AI to access crop diagnosis, outbreak intelligence, spray windows and satellite monitoring for your farms.";

export const Route = createFileRoute("/_auth/sign-in")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [loading, setLoading] = React.useState(false);
  const [remember, setRemember] = React.useState(true);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = signInSchema.safeParse({
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
      remember,
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
      navigate({ to: "/dashboard" });
    }, 900);
  }

  return (
    <AuthCard
      icon={LogIn}
      title="Welcome back"
      description="Sign in to your AVRUM AI workspace to continue monitoring your fields."
      footer={
        <>
          New to AVRUM AI?{" "}
          <Link to="/sign-up" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {errors["form"] && <AuthAlert tone="error">{errors["form"]}</AuthAlert>}

        <AuthField id="email" label="Work email" error={errors["email"]}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="agronomist@farm.co"
            maxLength={255}
            aria-invalid={Boolean(errors["email"])}
            aria-describedby={errors["email"] ? "email-error" : undefined}
          />
        </AuthField>

        <AuthField id="password" label="Password" error={errors["password"]}>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            maxLength={72}
            aria-invalid={Boolean(errors["password"])}
            aria-describedby={errors["password"] ? "password-error" : undefined}
          />
        </AuthField>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(v) => setRemember(v === true)}
            />
            <Label htmlFor="remember" className="text-sm font-medium text-muted-foreground">
              Keep me signed in
            </Label>
          </div>
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="ai" size="lg" block loading={loading}>
          {loading ? "Signing in…" : "Sign in"}
          {!loading && <ArrowRight />}
        </Button>

        <OAuthProviders />
      </form>
    </AuthCard>
  );
}
