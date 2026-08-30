import { createFileRoute } from "@tanstack/react-router";
import { Activity, BarChart3, Gauge, Zap } from "lucide-react";

import { PageShell, PageHeader, Section } from "@/components/avrum";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { APIStatCard, UsageCard } from "@/components/developer";
import { apiProducts } from "@/lib/developer";

export const Route = createFileRoute("/_dev/developer/usage")({
  head: () => ({
    meta: [
      { title: "Usage — AVRUM Intelligence" },
      { name: "description", content: "Track API request volume, latency, success rate and quota consumption across Avrum's agricultural intelligence products." },
      { property: "og:title", content: "Usage — AVRUM Intelligence" },
      { property: "og:description", content: "API request volume, latency and quota consumption for Avrum Intelligence." },
    ],
  }),
  component: UsagePage,
});

const perProduct = [
  { slug: "crop-intelligence", used: 128400 },
  { slug: "disease-intelligence", used: 96210 },
  { slug: "agricultural-ai", used: 204873 },
  { slug: "satellite-intelligence", used: 61905 },
  { slug: "soil-intelligence", used: 18442 },
];

function UsagePage() {
  const max = Math.max(...perProduct.map((p) => p.used));

  return (
    <PageShell>
      <PageHeader
        title="Usage"
        subtitle="Consumption across every API product, key and environment for the current billing period."
        crumbs={[{ label: "Developer" }, { label: "Usage" }]}
        eyebrow={<Badge variant="info" size="sm"><BarChart3 /> Aug 2026</Badge>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <APIStatCard label="Total requests" value="509,830" icon={Activity} trend="up" trendLabel="+12.4% MoM" />
        <APIStatCard label="Success rate" value="99.72" unit="%" icon={Zap} tone="ai" trend="up" trendLabel="+0.18% MoM" />
        <APIStatCard label="p95 latency" value="486" unit="ms" icon={Gauge} tone="info" trend="down" trendLabel="-64 ms MoM" />
        <APIStatCard label="Error responses" value="1,427" icon={Activity} tone="danger" trend="down" trendLabel="-8.1% MoM" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Section className="xl:col-span-2" title="Requests by API product">
          <Card className="space-y-4 p-5">
            {perProduct.map((row) => {
              const product = apiProducts.find((p) => p.slug === row.slug)!;
              return (
                <div key={row.slug} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-semibold">{product.name}</span>
                    <span className="tabular-nums text-muted-foreground">{row.used.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-primary to-emerald"
                      style={{ width: `${Math.round((row.used / max) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </Card>
        </Section>

        <div className="space-y-6">
          <UsageCard title="Included requests" description="Developer plan allowance." used={509830} limit={750000} />
          <UsageCard title="Satellite tile credits" description="Metered separately from standard requests." used={8420} limit={10000} tone="info" />
        </div>
      </div>
    </PageShell>
  );
}
