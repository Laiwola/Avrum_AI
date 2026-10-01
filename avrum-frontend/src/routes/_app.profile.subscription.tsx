import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard, Sparkles, ArrowUpRight, Check } from "lucide-react";

import { SettingsCard, SettingsRow, SettingsRowGroup, EmptyState } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/profile/subscription")({
  head: () => ({
    meta: [
      { title: "Subscription — AVRUM AI" },
      { name: "description", content: "Review your AVRUM AI plan, usage allowances and billing details. Paid plans are coming soon." },
      { property: "og:title", content: "Subscription — AVRUM AI" },
      { property: "og:description", content: "Plan, usage allowances and billing for your AVRUM AI account." },
    ],
  }),
  component: SubscriptionPage,
});

const planFeatures = [
  "Unlimited AI Crop Doctor diagnoses",
  "Satellite monitoring across all fields",
  "Regional disease outbreak intelligence",
  "SMS and WhatsApp advisory delivery",
];

function SubscriptionPage() {
  return (
    <div className="space-y-6">
      <SettingsCard
        title="Current plan"
        description="Your access level while AVRUM AI is in early access."
        icon={CreditCard}
        tone="ai"
        badge={<Badge variant="ai" size="sm">Early access</Badge>}
      >
        <SettingsRowGroup>
          <SettingsRow title="Early Access — Free" description="Full product access during the 2026 wet season pilot." control={<Badge variant="success" size="sm">Active</Badge>} />
          <SettingsRow title="Renewal" description="No payment method required." control={<Badge variant="muted" size="sm">—</Badge>} />
        </SettingsRowGroup>
      </SettingsCard>

      <SettingsCard title="What's included" description="Everything available on your current plan." icon={Sparkles}>
        <ul className="grid gap-2 sm:grid-cols-2">
          {planFeatures.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 size-4 shrink-0 text-emerald" />
              {feature}
            </li>
          ))}
        </ul>
      </SettingsCard>

      <EmptyState
        icon={CreditCard}
        title="Billing is coming soon"
        description="Paid plans, invoices and payment methods will appear here once AVRUM AI leaves early access. Nothing is charged in the meantime."
        tone="ai"
        action={
          <Button variant="ai" asChild>
            <Link to="/help">Talk to us about pricing <ArrowUpRight /></Link>
          </Button>
        }
      />
    </div>
  );
}
