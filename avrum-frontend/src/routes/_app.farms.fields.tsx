import { createFileRoute } from "@tanstack/react-router";
import { MapPinned, Upload } from "lucide-react";

import { PageShell, PageHeader, Section, EmptyState } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { MapPlaceholder } from "@/components/avrum";

export const Route = createFileRoute("/_app/farms/fields")({
  head: () => ({
    meta: [
      { title: "Field Boundaries — AVRUM AI" },
      { name: "description", content: "Draw and import field boundaries used for satellite and soil analysis." },
      { property: "og:title", content: "Field Boundaries — AVRUM AI" },
      { property: "og:description", content: "Draw and import field boundaries used for satellite and soil analysis." },
    ],
  }),
  component: FieldBoundariesPage,
});

function FieldBoundariesPage() {
  return (
    <PageShell>
      <PageHeader
        title="Field Boundaries"
        subtitle="Draw, import and verify the geometry that powers satellite and soil intelligence."
        crumbs={[{ label: "Dashboard", to: "/" }, { label: "My Farms", to: "/farms" }, { label: "Field Boundaries" }]}
        actions={
          <Button variant="outline"><Upload /> Import boundaries</Button>
        }
      />
      <Section title="Boundary map">
        <MapPlaceholder label="Boundary editor" caption="Field polygons will be drawn and edited here" height="h-72 sm:h-96" />
      </Section>
      <Section title="Saved boundaries">
        <EmptyState
          icon={MapPinned}
          title="No boundaries saved"
          description="Import a KML or GeoJSON file, or draw a field directly on the map to get started."
          tone="info"
          action={<Button variant="outline"><Upload /> Import file</Button>}
        />
      </Section>
    </PageShell>
  );
}
