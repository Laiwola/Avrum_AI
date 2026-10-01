import { createFileRoute } from "@tanstack/react-router";
import { FlaskConical, Upload } from "lucide-react";

import { PageShell, PageHeader, Section, EmptyState } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { AIInsightCard } from "@/components/avrum";

export const Route = createFileRoute("/_app/soil-intelligence")({
  head: () => ({
    meta: [
      { title: "Soil Intelligence — AVRUM AI" },
      { name: "description", content: "Understand nutrient balance, pH and moisture, translated into fertiliser recommendations." },
      { property: "og:title", content: "Soil Intelligence — AVRUM AI" },
      { property: "og:description", content: "Understand nutrient balance, pH and moisture, translated into fertiliser recommendations." },
    ],
  }),
  component: SoilIntelligencePage,
});

function SoilIntelligencePage() {
  return (
    <PageShell>
      <PageHeader
        title="Soil Intelligence"
        subtitle="Nutrient balance, pH and moisture insight translated into fertiliser action."
        crumbs={[{ label: "Dashboard", to: "/" }, { label: "Soil Intelligence" }]}
        actions={
          <Button variant="outline"><Upload /> Upload soil test</Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="Soil test results">
            <EmptyState
              icon={FlaskConical}
              title="No soil data yet"
              description="Upload a lab report or request a sampling kit to see nutrient balance and fertiliser guidance."
              action={<Button variant="outline"><Upload /> Upload soil test</Button>}
            />
          </Section>
        </div>
        <AIInsightCard
          title="Why soil data matters"
          insight="Nutrient and pH readings let AVRUM AI move from generic advice to field-specific fertiliser rates."
          recommendation="Sample 3 points per hectare, 0–20 cm depth."
          confidence={0}
        />
      </div>
    </PageShell>
  );
}
