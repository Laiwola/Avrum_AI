import { createFileRoute } from "@tanstack/react-router";
import { Download, ScrollText } from "lucide-react";

import { PageShell, PageHeader, Section, SearchBox } from "@/components/avrum";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { APIActivityRow } from "@/components/developer";
import { recentApiActivity } from "@/lib/developer";

export const Route = createFileRoute("/_dev/developer/logs")({
  head: () => ({
    meta: [
      { title: "Logs — AVRUM Intelligence" },
      { name: "description", content: "Inspect every API request made with your Avrum keys: method, status, latency and environment." },
      { property: "og:title", content: "Logs — AVRUM Intelligence" },
      { property: "og:description", content: "Request-level logs for Avrum Intelligence API traffic." },
    ],
  }),
  component: LogsPage,
});

function LogsPage() {
  const rows = [...recentApiActivity, ...recentApiActivity.map((r) => ({ ...r, id: `b-${r.id}` }))];

  return (
    <PageShell>
      <PageHeader
        title="Logs"
        subtitle="Request-level visibility across every key and environment, retained for 30 days on the developer plan."
        crumbs={[{ label: "Developer" }, { label: "Logs" }]}
        eyebrow={<Badge variant="info" size="sm"><ScrollText /> Last 24 hours</Badge>}
        actions={<Button variant="outline"><Download /> Export</Button>}
      />

      <Section>
        <Card className="overflow-hidden p-0">
          <div className="border-b border-border p-4">
            <SearchBox placeholder="Filter by endpoint, status or key…" />
          </div>
          <div className="divide-y divide-border">
            {rows.map((item) => (
              <APIActivityRow key={item.id} item={item} />
            ))}
          </div>
        </Card>
      </Section>
    </PageShell>
  );
}
