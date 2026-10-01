import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Plus } from "lucide-react";

import { PageShell, PageHeader, Section, EmptyState } from "@/components/avrum";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/farms/calendar")({
  head: () => ({
    meta: [
      { title: "Crop Calendar — AVRUM AI" },
      { name: "description", content: "Track planting, growth stages and harvest windows across all crop cycles." },
      { property: "og:title", content: "Crop Calendar — AVRUM AI" },
      { property: "og:description", content: "Track planting, growth stages and harvest windows across all crop cycles." },
    ],
  }),
  component: CropCalendarPage,
});

function CropCalendarPage() {
  return (
    <PageShell>
      <PageHeader
        title="Crop Calendar"
        subtitle="Planting, growth stage and harvest timelines for every crop cycle."
        crumbs={[{ label: "Dashboard", to: "/" }, { label: "My Farms", to: "/farms" }, { label: "Crop Calendar" }]}
        actions={
          <Button variant="ai"><Plus /> New crop cycle</Button>
        }
      />
      <Section title="Season timeline">
        <EmptyState
          icon={CalendarDays}
          title="No crop cycles planned"
          description="Create a crop cycle to see stage-by-stage timelines and time-sensitive advisories."
          action={<Button variant="ai"><Plus /> New crop cycle</Button>}
        />
      </Section>
    </PageShell>
  );
}
