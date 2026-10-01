import { createFileRoute, Link } from "@tanstack/react-router";
import { MonitorSmartphone, ShieldCheck, ArrowUpRight } from "lucide-react";

import { SettingsCard, SettingsRow, SettingsRowGroup, EmptyState } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/profile/devices")({
  head: () => ({
    meta: [
      { title: "Connected Devices — AVRUM AI" },
      { name: "description", content: "See which phones, tablets and computers are connected to your AVRUM AI account. Full device management is coming soon." },
      { property: "og:title", content: "Connected Devices — AVRUM AI" },
      { property: "og:description", content: "Phones, tablets and computers connected to your AVRUM AI account." },
    ],
  }),
  component: DevicesPage,
});

function DevicesPage() {
  return (
    <div className="space-y-6">
      <SettingsCard
        title="This device"
        description="The device you're using right now."
        icon={MonitorSmartphone}
        tone="info"
      >
        <SettingsRowGroup>
          <SettingsRow
            icon={MonitorSmartphone}
            title="Chrome · MacBook Pro"
            description="Ibadan, Nigeria · Active now"
            control={<Badge variant="success" size="sm">Trusted</Badge>}
          />
        </SettingsRowGroup>
      </SettingsCard>

      <EmptyState
        icon={MonitorSmartphone}
        title="Device management is coming soon"
        description="Paired field sensors, offline mobile devices and trusted-device approvals will be listed here. Until then, you can review and revoke active sign-in sessions from Security."
        tone="info"
        action={
          <Button variant="ai" asChild>
            <Link to="/profile/security"><ShieldCheck /> Review sessions</Link>
          </Button>
        }
        secondaryAction={
          <Button variant="outline" asChild>
            <Link to="/help">Learn more <ArrowUpRight /></Link>
          </Button>
        }
      />
    </div>
  );
}
