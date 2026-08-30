import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, ShieldCheck, Smartphone, MonitorSmartphone, LogOut, Save } from "lucide-react";
import { toast } from "sonner";

import { SettingsCard, SettingsField, SettingsRow, SettingsRowGroup } from "@/components/avrum";
import { PasswordInput, PasswordStrengthMeter } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import * as React from "react";

export const Route = createFileRoute("/_app/profile/security")({
  head: () => ({
    meta: [
      { title: "Security — AVRUM AI" },
      { name: "description", content: "Update your password, enable two-factor authentication and review active AVRUM AI sessions." },
      { property: "og:title", content: "Security — AVRUM AI" },
      { property: "og:description", content: "Password, two-factor authentication and active session management." },
    ],
  }),
  component: SecurityPage,
});

const sessions = [
  { device: "Chrome · MacBook Pro", location: "Ibadan, Nigeria", last: "Active now", current: true },
  { device: "AVRUM Mobile · Android", location: "Ibadan, Nigeria", last: "2 hours ago", current: false },
  { device: "Safari · iPad", location: "Lagos, Nigeria", last: "4 days ago", current: false },
];

function SecurityPage() {
  const [password, setPassword] = React.useState("");

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Password"
        description="Use a strong, unique password you don't use anywhere else."
        icon={KeyRound}
        contentClassName="grid gap-4 sm:grid-cols-2"
        footer={
          <Button
            variant="ai"
            onClick={() => {
              setPassword("");
              toast.success("Password updated");
            }}
          >
            <Save /> Update password
          </Button>
        }
      >
        <SettingsField label="Current password" className="sm:col-span-2">
          <PasswordInput placeholder="Enter your current password" autoComplete="current-password" />
        </SettingsField>
        <SettingsField label="New password">
          <PasswordInput
            placeholder="Choose a new password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </SettingsField>
        <SettingsField label="Confirm new password">
          <PasswordInput placeholder="Repeat the new password" autoComplete="new-password" />
        </SettingsField>
        <div className="sm:col-span-2">
          <PasswordStrengthMeter value={password} />
        </div>
      </SettingsCard>

      <SettingsCard
        title="Two-factor authentication"
        description="Add a second step when signing in from a new device."
        icon={ShieldCheck}
        tone="ai"
        badge={<Badge variant="warning" size="sm">Recommended</Badge>}
      >
        <SettingsRowGroup>
          <SettingsRow
            icon={Smartphone}
            title="Authenticator app"
            description="Use a time-based code from Google Authenticator, Authy or 1Password."
            control={<Switch onCheckedChange={(v) => toast.info(v ? "Scan the QR code to finish setup." : "Authenticator disabled.")} />}
          />
          <SettingsRow
            icon={Smartphone}
            title="SMS backup codes"
            description="Receive a one-time code by SMS when your authenticator is unavailable."
            control={<Switch />}
          />
        </SettingsRowGroup>
      </SettingsCard>

      <SettingsCard
        title="Active sessions"
        description="Devices currently signed in to your account."
        icon={MonitorSmartphone}
        tone="info"
        footer={
          <Button variant="outline" onClick={() => toast.success("All other sessions signed out")}>
            <LogOut /> Sign out everywhere else
          </Button>
        }
      >
        <SettingsRowGroup>
          {sessions.map((s) => (
            <SettingsRow
              key={s.device}
              icon={MonitorSmartphone}
              title={s.device}
              description={`${s.location} · ${s.last}`}
              control={
                s.current ? (
                  <Badge variant="success" size="sm">This device</Badge>
                ) : (
                  <Button variant="ghost" size="sm" className="text-destructive">Revoke</Button>
                )
              }
            />
          ))}
        </SettingsRowGroup>
      </SettingsCard>
    </div>
  );
}
