import { createFileRoute } from "@tanstack/react-router";
import { Building2, Globe2, ShieldCheck } from "lucide-react";

import { PageShell, PageHeader, SettingsCard, SettingsField, SettingsRow, SettingsRowGroup } from "@/components/avrum";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_dev/developer/settings")({
  head: () => ({
    meta: [
      { title: "Developer Settings — AVRUM Intelligence" },
      { name: "description", content: "Configure your Avrum developer organisation, environments, IP allowlists and production access." },
      { property: "og:title", content: "Developer Settings — AVRUM Intelligence" },
      { property: "og:description", content: "Organisation, environment and security settings for Avrum Intelligence." },
    ],
  }),
  component: DeveloperSettingsPage,
});

function DeveloperSettingsPage() {
  return (
    <PageShell>
      <PageHeader
        title="Developer Settings"
        subtitle="Organisation details, environment defaults and platform security controls."
        crumbs={[{ label: "Developer" }, { label: "Settings" }]}
        eyebrow={<Badge variant="info" size="sm">Sandbox workspace</Badge>}
      />

      <SettingsCard
        icon={Building2}
        title="Organisation"
        description="Shown on invoices and in API support requests."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <SettingsField label="Organisation name">
            <Input defaultValue="Avrum Labs" />
          </SettingsField>
          <SettingsField label="Technical contact email">
            <Input type="email" defaultValue="developers@avrumlabs.io" />
          </SettingsField>
        </div>
        <div className="flex justify-end pt-2">
          <Button variant="ai">Save changes</Button>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={Globe2}
        title="Environments"
        description="Defaults applied to newly created API keys."
      >
        <SettingsRowGroup>
          <SettingsRow
            title="Default to sandbox"
            description="New keys start in the sandbox environment."
            control={<Switch defaultChecked />}
          />
          <SettingsRow
            title="Request production access"
            description="Verification unlocks live traffic and higher rate limits."
            control={<Button variant="outline" size="sm">Request access</Button>}
          />
        </SettingsRowGroup>
      </SettingsCard>

      <SettingsCard
        icon={ShieldCheck}
        title="Security"
        description="Protect your keys and API traffic."
      >
        <SettingsRowGroup>
          <SettingsRow
            title="IP allowlist"
            description="Restrict live keys to known egress addresses."
            control={<Switch />}
          />
          <SettingsRow
            title="Alert on anomalous usage"
            description="Email the technical contact when traffic spikes unexpectedly."
            control={<Switch defaultChecked />}
          />
          <SettingsRow
            title="Rotate keys every 90 days"
            description="Enforce rotation policy across the organisation."
            control={<Switch />}
          />
        </SettingsRowGroup>
      </SettingsCard>
    </PageShell>
  );
}
