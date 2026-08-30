import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, UserPlus } from "lucide-react";

import {
  AuthAlert,
  AuthCard,
  AuthField,
  OAuthProviders,
  PasswordInput,
  PasswordStrengthMeter,
} from "@/components/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpSchema, toFieldErrors, type FieldErrors } from "@/lib/auth-validation";

const TITLE = "Create your account — AVRUM AI";
const DESCRIPTION =
  "Create an AVRUM AI account to diagnose crop disease, plan spray windows and monitor field health from satellite and soil data.";

export const Route = createFileRoute("/_auth/sign-up")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [loading, setLoading] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [terms, setTerms] = React.useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = signUpSchema.safeParse({
      fullName: String(data.get("fullName") ?? ""),
      organisation: String(data.get("organisation") ?? ""),
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
      confirmPassword: String(data.get("confirmPassword") ?? ""),
      terms,
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
      navigate({ to: "/verify-email", search: { email: parsed.data.email } });
    }, 900);
  }

  return (
    <AuthCard
      icon={UserPlus}
      eyebrow={
        <Badge variant="ai" size="sm">
          Free 14-day trial
        </Badge>
      }
      title="Create your account"
      description="Set up your workspace and add your first farm in under two minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/sign-in" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {errors["form"] && <AuthAlert tone="error">{errors["form"]}</AuthAlert>}

        <AuthField id="fullName" label="Full name" error={errors["fullName"]}>
          <Input
            id="fullName"
            name="fullName"
            autoComplete="name"
            placeholder="Amina Dauda"
            maxLength={100}
            aria-invalid={Boolean(errors["fullName"])}
          />
        </AuthField>

        <AuthField id="organisation" label="Farm or organisation" optional error={errors["organisation"]}>
          <Input
            id="organisation"
            name="organisation"
            autoComplete="organization"
            placeholder="Green Valley Farms"
            maxLength={120}
            aria-invalid={Boolean(errors["organisation"])}
          />
        </AuthField>

        <AuthField id="email" label="Work email" error={errors["email"]}>
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

        <AuthField id="password" label="Password" error={errors["password"]}>
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

        <AuthField id="confirmPassword" label="Confirm password" error={errors["confirmPassword"]}>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            maxLength={72}
            aria-invalid={Boolean(errors["confirmPassword"])}
          />
        </AuthField>

        <div className="space-y-1.5">
          <div className="flex items-start gap-2.5">
            <Checkbox
              id="terms"
              className="mt-0.5"
              checked={terms}
              onCheckedChange={(v) => setTerms(v === true)}
              aria-invalid={Boolean(errors["terms"])}
            />
            <Label htmlFor="terms" className="text-xs font-medium leading-relaxed text-muted-foreground">
              I agree to the AVRUM AI Terms of Service and Privacy Policy, including how field and
              crop imagery is processed.
            </Label>
          </div>
          {errors["terms"] && (
            <p role="alert" className="text-xs font-medium text-destructive">
              {errors["terms"]}
            </p>
          )}
        </div>

        <Button type="submit" variant="ai" size="lg" block loading={loading}>
          {loading ? "Creating account…" : "Create account"}
          {!loading && <ArrowRight />}
        </Button>

        <OAuthProviders label="Or sign up with" />
      </form>
    </AuthCard>
  );
}
