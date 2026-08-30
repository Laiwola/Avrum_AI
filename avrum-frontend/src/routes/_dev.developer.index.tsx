import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity, ArrowUpRight, BookOpen, Gauge, KeyRound, Plus, TerminalSquare, Zap,
} from "lucide-react";

import { PageShell, PageHeader, Section } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  APIProductCard, APIStatCard, APIActivityRow, GettingStartedCard, QuickActionCard, UsageCard,
} from "@/components/developer";
import { apiProducts, gettingStartedSteps, recentApiActivity } from "@/lib/developer";

export const Route = createFileRoute("/_dev/developer/")({
  head: () => ({
    meta: [
      { title: "Developer Overview — AVRUM Intelligence" },
      {
        name: "description",
        content:
          "Build with Avrum's agricultural intelligence: crop, disease, satellite, soil and spray APIs with keys, usage and logs in one workspace.",
      },
      { property: "og:title", content: "Developer Overview — AVRUM Intelligence" },
      {
        property: "og:description",
        content: "Integrate Avrum's agricultural AI into your own applications through a single API platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DeveloperOverviewPage,
});

function DeveloperOverviewPage() {
  return (
    <PageShell>
      <PageHeader
        title="Build with Avrum's Agricultural Intelligence"
        subtitle="Integrate crop, disease, satellite, soil and spray intelligence directly into your own applications. One API platform for agritech products, agribusinesses, NGOs and research teams."
        crumbs={[{ label: "Developer" }, { label: "Overview" }]}
        eyebrow={<Badge variant="ai" size="sm">AVRUM Intelligence · Sandbox</Badge>}
        actions={
          <>
            <Button variant="outline"><KeyRound /> Create API key</Button>
            <Button variant="ai"><TerminalSquare /> Open playground</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <APIStatCard label="API requests" value="509,830" icon={Activity} trend="up" trendLabel="+12.4% vs last 30d" />
        <APIStatCard label="Success rate" value="99.72" unit="%" icon={Zap} tone="ai" trend="up" trendLabel="+0.18% vs last 30d" />
        <APIStatCard label="Average latency" value="214" unit="ms" icon={Gauge} tone="info" trend="down" trendLabel="-38 ms vs last 30d" />
        <APIStatCard label="Active API keys" value="4" icon={KeyRound} tone="warning" trend="flat" trendLabel="2 live · 2 sandbox" />
      </div>

      <Section
        title="API products"
        description="Composable agricultural intelligence endpoints. Every product shares one key, one base URL and one usage ledger."
        actions={
          <Button variant="ghost" size="sm" asChild>
            <Link to="/developer/api-products">View all <ArrowUpRight /></Link>
          </Button>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {apiProducts.map((p) => (
            <APIProductCard key={p.slug} product={p} />
          ))}
        </div>
      </Section>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Section
            title="Recent API activity"
            description="Live request stream across all environments."
            actions={
              <Button variant="ghost" size="sm" asChild>
                <Link to="/developer/logs">Open logs <ArrowUpRight /></Link>
              </Button>
            }
          >
            <Card className="divide-y divide-border overflow-hidden p-0">
              {recentApiActivity.map((item) => (
                <APIActivityRow key={item.id} item={item} />
              ))}
            </Card>
          </Section>

          <Section title="Quick actions" description="The fastest paths to your first production call.">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <QuickActionCard
                icon={Plus}
                title="Create API key"
                description="Generate a sandbox or live key scoped to specific API products."
                to="/developer/api-keys"
              />
              <QuickActionCard
                icon={TerminalSquare}
                title="Open playground"
                description="Send a real request and inspect the response payload instantly."
                tone="ai"
                badge={<Badge variant="ai" size="sm">Beta</Badge>}
                to="/developer/playground"
              />
              <QuickActionCard
                icon={BookOpen}
                title="Read documentation"
                description="Authentication, rate limits, schemas and SDK quickstarts."
                tone="info"
                to="/developer/docs"
              />
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <GettingStartedCard steps={gettingStartedSteps} />
          <UsageCard
            title="Sandbox request quota"
            description="Resets daily at 00:00 UTC."
            used={412}
            limit={1000}
            period="Today"
            tone="ai"
          />
          <UsageCard
            title="Monthly included requests"
            description="Developer plan allowance across all API products."
            used={509830}
            limit={750000}
          />
        </div>
      </div>
    </PageShell>
  );
}
