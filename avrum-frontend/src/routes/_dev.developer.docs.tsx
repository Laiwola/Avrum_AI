import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Code2, KeyRound, Rocket, ShieldCheck, Webhook } from "lucide-react";

import { PageShell, PageHeader, Section } from "@/components/avrum";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EndpointBadge, QuickActionCard } from "@/components/developer";
import { apiProducts } from "@/lib/developer";

export const Route = createFileRoute("/_dev/developer/docs")({
  head: () => ({
    meta: [
      { title: "Documentation — AVRUM Intelligence" },
      { name: "description", content: "Authentication, rate limits, endpoints and quickstarts for Avrum's agricultural intelligence APIs." },
      { property: "og:title", content: "Documentation — AVRUM Intelligence" },
      { property: "og:description", content: "Quickstarts, authentication and endpoint reference for Avrum Intelligence APIs." },
    ],
  }),
  component: DocsPage,
});

const snippet = `curl https://api.avrum.ai/v1/crop/analyze \\
  -H "Authorization: Bearer $AVRUM_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "latitude": 9.0765, "longitude": 7.3986, "crop": "maize" }'`;

function DocsPage() {
  return (
    <PageShell>
      <PageHeader
        title="Documentation"
        subtitle="Everything you need to authenticate, call and scale on the Avrum Intelligence platform."
        crumbs={[{ label: "Developer" }, { label: "Documentation" }]}
        eyebrow={<Badge variant="info" size="sm"><BookOpen /> v1 reference</Badge>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <QuickActionCard icon={Rocket} title="Quickstart" description="First call in under five minutes." to="/developer/playground" />
        <QuickActionCard icon={KeyRound} title="Authentication" description="Bearer keys, scopes and rotation." tone="ai" to="/developer/api-keys" />
        <QuickActionCard icon={Webhook} title="Webhooks" description="Event payloads and signature verification." tone="info" to="/developer/webhooks" />
        <QuickActionCard icon={ShieldCheck} title="Rate limits" description="Quotas, bursts and 429 handling." to="/developer/usage" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Section className="xl:col-span-2" title="Your first request">
          <Card className="overflow-hidden p-0">
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-bold">
                <Code2 className="size-4 text-emerald" /> cURL
              </span>
              <Button variant="ghost" size="sm">Copy</Button>
            </div>
            <pre className="overflow-x-auto bg-muted/40 p-4 text-xs leading-relaxed">
              <code className="font-mono">{snippet}</code>
            </pre>
          </Card>
        </Section>

        <Section title="Endpoint reference">
          <Card className="divide-y divide-border p-0">
            {apiProducts.map((p) => (
              <div key={p.slug} className="space-y-2 p-4">
                <p className="text-sm font-bold">{p.name}</p>
                <EndpointBadge method={p.endpoint.method} path={p.endpoint.path} className="max-w-full" />
              </div>
            ))}
          </Card>
        </Section>
      </div>
    </PageShell>
  );
}
