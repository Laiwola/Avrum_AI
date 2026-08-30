import { createFileRoute } from "@tanstack/react-router";
import { Satellite, RefreshCw } from "lucide-react";

import { PageShell, PageHeader, Section, EmptyState } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { MapPlaceholder } from "@/components/avrum";

export const Route = createFileRoute("/_app/satellite-monitoring")({
  head: () => ({
    meta: [
      { title: "Satellite Monitoring — AVRUM AI" },
      { name: "description", content: "Track vegetation, moisture and crop stress indices from satellite imagery." },
      { property: "og:title", content: "Satellite Monitoring — AVRUM AI" },
      { property: "og:description", content: "Track vegetation, moisture and crop stress indices from satellite imagery." },
    ],
  }),
  component: SatelliteMonitoringPage,
});

function SatelliteMonitoringPage() {
  return (
    <PageShell>
      <PageHeader
        title="Satellite Monitoring"
        subtitle="Vegetation, moisture and stress indices tracked from space, field by field."
        crumbs={[{ label: "Dashboard", to: "/" }, { label: "Satellite Monitoring" }]}
        actions={
          <Button variant="outline"><RefreshCw /> Refresh imagery</Button>
        }
      />
      <Section title="Index viewer" description="NDVI, NDMI and stress layers for the selected field.">
        <MapPlaceholder label="Satellite index layer" caption="NDVI imagery will render here" height="h-80 sm:h-[28rem]" />
      </Section>
      <Section title="Index history">
        <EmptyState
          icon={Satellite}
          title="No imagery available"
          description="Add a field boundary to begin receiving satellite passes and time-series index history."
          tone="info"
        />
      </Section>
    </PageShell>
  );
}
