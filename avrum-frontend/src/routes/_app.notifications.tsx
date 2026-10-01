import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCheck } from "lucide-react";

import { PageShell, PageHeader, Section, EmptyState } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/avrum";

export const Route = createFileRoute("/_app/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — AVRUM AI" },
      { name: "description", content: "Review risk alerts, advisory updates and system messages from AVRUM AI." },
      { property: "og:title", content: "Notifications — AVRUM AI" },
      { property: "og:description", content: "Review risk alerts, advisory updates and system messages from AVRUM AI." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <PageShell>
      <PageHeader
        title="Notifications"
        subtitle="Risk alerts, advisory updates and system messages, newest first."
        crumbs={[{ label: "Dashboard", to: "/" }, { label: "Notifications" }]}
        actions={
          <Button variant="outline"><CheckCheck /> Mark all read</Button>
        }
      />
      <Section title="Inbox" actions={<SearchBox placeholder="Search notifications…" className="sm:w-72" />}>
        <EmptyState
          icon={Bell}
          title="You're all caught up"
          description="Critical risk alerts and advisory updates will appear here as soon as they are generated."
        />
      </Section>
    </PageShell>
  );
}
