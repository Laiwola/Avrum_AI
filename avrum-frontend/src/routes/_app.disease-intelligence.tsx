import { createFileRoute } from "@tanstack/react-router";
import { Bug, Bell } from "lucide-react";

import { PageShell, PageHeader, Section, EmptyState } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { MapPlaceholder } from "@/components/avrum";

export const Route = createFileRoute("/_app/disease-intelligence")({
  head: () => ({
    meta: [
      { title: "Disease Intelligence — AVRUM AI" },
      { name: "description", content: "Monitor regional disease outbreaks, spread risk and early-warning alerts near your fields." },
      { property: "og:title", content: "Disease Intelligence — AVRUM AI" },
      { property: "og:description", content: "Monitor regional disease outbreaks, spread risk and early-warning alerts near your fields." },
    ],
  }),
  component: DiseaseIntelligencePage,
});

function DiseaseIntelligencePage() {
  return (
    <PageShell>
      <PageHeader
        title="Disease Intelligence"
        subtitle="Regional outbreak signals, spread risk and early-warning alerts near your fields."
        crumbs={[{ label: "Dashboard", to: "/" }, { label: "Disease Intelligence" }]}
        actions={
          <Button variant="outline"><Bell /> Alert settings</Button>
        }
      />
      <Section title="Outbreak map" description="Reported cases and modelled spread across your region.">
        <MapPlaceholder label="Outbreak heatmap" caption="Regional disease pressure will render here" height="h-72 sm:h-96" />
      </Section>
      <Section title="Active signals">
        <EmptyState
          icon={Bug}
          title="No outbreak signals"
          description="Once fields are registered, AVRUM AI will surface nearby outbreaks ranked by proximity and risk."
          tone="info"
        />
      </Section>
    </PageShell>
  );
}
