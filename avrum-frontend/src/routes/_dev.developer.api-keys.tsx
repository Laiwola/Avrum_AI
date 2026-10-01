import { createFileRoute } from "@tanstack/react-router";
import { Copy, KeyRound, Plus } from "lucide-react";

import { PageShell, PageHeader, Section, DataTable, type Column } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UsageCard } from "@/components/developer";

export const Route = createFileRoute("/_dev/developer/api-keys")({
  head: () => ({
    meta: [
      { title: "API Keys — AVRUM Intelligence" },
      { name: "description", content: "Create, scope and rotate sandbox and live API keys for the Avrum agricultural intelligence platform." },
      { property: "og:title", content: "API Keys — AVRUM Intelligence" },
      { property: "og:description", content: "Manage sandbox and live keys for Avrum's agricultural APIs." },
    ],
  }),
  component: ApiKeysPage,
});

type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  env: "Live" | "Sandbox";
  scopes: string;
  lastUsed: string;
  created: string;
};

const keys: ApiKey[] = [
  { id: "1", name: "Production backend", prefix: "avr_live_a91•••••••", env: "Live", scopes: "All products", lastUsed: "12s ago", created: "Mar 4, 2026" },
  { id: "2", name: "Mobile app", prefix: "avr_live_c47•••••••", env: "Live", scopes: "Crop, Disease", lastUsed: "3h ago", created: "Apr 18, 2026" },
  { id: "3", name: "Sandbox testing", prefix: "avr_test_7f2•••••••", env: "Sandbox", scopes: "All products", lastUsed: "5m ago", created: "May 2, 2026" },
  { id: "4", name: "NGO pilot", prefix: "avr_test_b13•••••••", env: "Sandbox", scopes: "Satellite, Soil", lastUsed: "2d ago", created: "Jun 21, 2026" },
];

const columns: Column<ApiKey>[] = [
  { key: "name", header: "Name", cell: (r) => <span className="font-semibold">{r.name}</span> },
  { key: "prefix", header: "Key", cell: (r) => (
    <span className="flex items-center gap-2">
      <code className="font-mono text-xs text-muted-foreground">{r.prefix}</code>
      <Button variant="ghost" size="icon" className="size-7" aria-label="Copy key"><Copy /></Button>
    </span>
  ) },
  { key: "env", header: "Environment", cell: (r) => (
    <Badge variant={r.env === "Live" ? "success" : "muted"} size="sm">{r.env}</Badge>
  ) },
  { key: "scopes", header: "Scopes", cell: (r) => <span className="text-muted-foreground">{r.scopes}</span> },
  { key: "lastUsed", header: "Last used", cell: (r) => <span className="text-muted-foreground">{r.lastUsed}</span> },
  { key: "created", header: "Created", cell: (r) => <span className="text-muted-foreground">{r.created}</span>, align: "right" },
];

function ApiKeysPage() {
  return (
    <PageShell>
      <PageHeader
        title="API Keys"
        subtitle="Scope keys per environment and per API product. Rotate regularly and never ship live keys to client applications."
        crumbs={[{ label: "Developer" }, { label: "API Keys" }]}
        eyebrow={<Badge variant="ai" size="sm"><KeyRound /> 4 active keys</Badge>}
        actions={<Button variant="ai"><Plus /> Create API key</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <UsageCard title="Live key requests" description="Across 2 live keys." used={402118} limit={750000} />
        <UsageCard title="Sandbox key requests" description="Across 2 sandbox keys." used={412} limit={1000} period="Today" tone="ai" />
      </div>

      <Section title="Your keys" description="Secrets are shown once at creation time.">
        <DataTable columns={columns} data={keys} getRowKey={(r) => r.id} />
      </Section>
    </PageShell>
  );
}
