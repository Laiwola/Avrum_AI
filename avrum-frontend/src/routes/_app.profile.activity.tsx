import { createFileRoute, Link } from "@tanstack/react-router";
import { History, Download, ArrowUpRight } from "lucide-react";

import { SettingsCard, SettingsRow, SettingsRowGroup, EmptyState } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/profile/activity")({
  head: () => ({
    meta: [
      { title: "Activity Log — AVRUM AI" },
      { name: "description", content: "A record of sign-ins, profile changes and advisory actions on your AVRUM AI account. Full history is coming soon." },
      { property: "og:title", content: "Activity Log — AVRUM AI" },
      { property: "og:description", content: "Sign-ins, profile changes and advisory actions on your account." },
    ],
  }),
  component: ActivityLogPage,
});

function ActivityLogPage() {
  return (
    <div className="space-y-6">
      <SettingsCard
        title="Recent account events"
        description="The last few actions recorded against your account."
        icon={History}
        footer={
          <Button variant="outline" size="sm" disabled><Download /> Export log</Button>
        }
      >
        <SettingsRowGroup>
          <SettingsRow icon={History} title="Signed in" description="Chrome · MacBook Pro · Ibadan, Nigeria" control={<Badge variant="muted" size="sm">Just now</Badge>} />
          <SettingsRow icon={History} title="Profile created" description="Account registered with email address" control={<Badge variant="muted" size="sm">March 2026</Badge>} />
        </SettingsRowGroup>
      </SettingsCard>

      <EmptyState
        icon={History}
        title="Full activity history is coming soon"
        description="Every diagnosis, advisory acknowledgement, farm edit and security change will be listed here with filters and CSV export."
        action={
          <Button variant="ai" asChild>
            <Link to="/profile">Back to overview <ArrowUpRight /></Link>
          </Button>
        }
      />
    </div>
  );
}
