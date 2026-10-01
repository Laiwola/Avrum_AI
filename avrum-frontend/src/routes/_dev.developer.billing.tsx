import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Receipt } from "lucide-react";

import { PageShell, PageHeader, Section } from "@/components/avrum";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DevEmptyState, UsageCard } from "@/components/developer";

export const Route = createFileRoute("/_dev/developer/billing")({
  head: () => ({
    meta: [
      { title: "Billing — AVRUM Intelligence" },
      { name: "description", content: "Review your Avrum developer plan, metered usage and invoices for agricultural intelligence APIs." },
      { property: "og:title", content: "Billing — AVRUM Intelligence" },
      { property: "og:description", content: "Plans, metered usage and invoices for Avrum Intelligence." },
    ],
  }),
  component: BillingPage,
});

function BillingPage() {
  return (
    <PageShell>
      <PageHeader
        title="Billing"
        subtitle="Usage-based pricing across every API product, billed monthly with a generous included allowance."
        crumbs={[{ label: "Developer" }, { label: "Billing" }]}
        eyebrow={<Badge variant="ai" size="sm"><CreditCard /> Developer plan</Badge>}
        actions={<Button variant="outline">Compare plans</Button>}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="space-y-3 p-5 xl:col-span-1">
          <p className="text-overline text-muted-foreground">Current plan</p>
          <p className="text-metric">Developer</p>
          <p className="text-sm text-muted-foreground">
            750,000 included requests per month, 30-day log retention and sandbox environments.
          </p>
          <Button variant="ai" className="w-full">Upgrade to Scale</Button>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:col-span-2">
          <UsageCard title="Included requests" description="Resets Sep 1, 2026." used={509830} limit={750000} />
          <UsageCard title="Satellite tile credits" description="Metered add-on." used={8420} limit={10000} tone="info" />
        </div>
      </div>

      <Section title="Invoices">
        <DevEmptyState
          icon={Receipt}
          title="No invoices yet"
          description="Billing is not activated for this workspace. Invoices will appear here once live traffic starts."
        />
      </Section>
    </PageShell>
  );
}
