import { createFileRoute } from "@tanstack/react-router";
import { Plus, Webhook } from "lucide-react";

import { PageShell, PageHeader, Section } from "@/components/avrum";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DevEmptyState } from "@/components/developer";

export const Route = createFileRoute("/_dev/developer/webhooks")({
  head: () => ({
    meta: [
      { title: "Webhooks — AVRUM Intelligence" },
      { name: "description", content: "Subscribe to Avrum agricultural events: outbreak alerts, spray windows, satellite passes and advisory updates." },
      { property: "og:title", content: "Webhooks — AVRUM Intelligence" },
      { property: "og:description", content: "Receive Avrum agricultural intelligence events in real time." },
    ],
  }),
  component: WebhooksPage,
});

const events = [
  { name: "disease.outbreak.detected", description: "Fired when regional outbreak risk crosses your threshold." },
  { name: "satellite.pass.completed", description: "New imagery processed for a monitored boundary." },
  { name: "spray.window.opened", description: "A favourable spray window opens for a registered field." },
  { name: "soil.report.ready", description: "A requested soil profile finished processing." },
];

function WebhooksPage() {
  return (
    <PageShell>
      <PageHeader
        title="Webhooks"
        subtitle="Push agricultural events into your systems instead of polling for changes."
        crumbs={[{ label: "Developer" }, { label: "Webhooks" }]}
        eyebrow={<Badge variant="ai" size="sm"><Webhook /> Signed with HMAC-SHA256</Badge>}
        actions={<Button variant="ai"><Plus /> Add endpoint</Button>}
      />

      <Section title="Your endpoints">
        <DevEmptyState
          icon={Webhook}
          title="No webhook endpoints yet"
          description="Register an HTTPS endpoint to start receiving signed agricultural intelligence events."
          action={<Button variant="ai"><Plus /> Add endpoint</Button>}
        />
      </Section>

      <Section title="Available events" description="Subscribe per endpoint once delivery is enabled.">
        <Card className="divide-y divide-border p-0">
          {events.map((e) => (
            <div key={e.name} className="space-y-1 p-4">
              <code className="font-mono text-xs font-bold text-emerald">{e.name}</code>
              <p className="text-sm text-muted-foreground">{e.description}</p>
            </div>
          ))}
        </Card>
      </Section>
    </PageShell>
  );
}
