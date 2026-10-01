import { createFileRoute } from "@tanstack/react-router";
import { SprayCan, Sparkles } from "lucide-react";

import { PageShell, PageHeader, Section, EmptyState } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { FilterPanel, FilterField } from "@/components/avrum";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";

function SelectStub({ placeholder }: { placeholder: string }) {
  return (
    <Select>
      <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent />
    </Select>
  );
}

export const Route = createFileRoute("/_app/spray-recommendation")({
  head: () => ({
    meta: [
      { title: "Spray Recommendation — AVRUM AI" },
      { name: "description", content: "Get product, dosage and safe weather windows for every spray decision." },
      { property: "og:title", content: "Spray Recommendation — AVRUM AI" },
      { property: "og:description", content: "Get product, dosage and safe weather windows for every spray decision." },
    ],
  }),
  component: SprayRecommendationPage,
});

function SprayRecommendationPage() {
  return (
    <PageShell>
      <PageHeader
        title="Spray Recommendation"
        subtitle="Product, dosage and the safest weather window for each treatment decision."
        crumbs={[{ label: "Dashboard", to: "/" }, { label: "Spray Recommendation" }]}
        actions={
          <Button variant="ai"><Sparkles /> Generate advisory</Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <FilterPanel onReset={() => {}}>
          <FilterField label="Crop">
            <SelectStub placeholder="Select crop" />
          </FilterField>
          <FilterField label="Field">
            <SelectStub placeholder="Select field" />
          </FilterField>
          <FilterField label="Target issue">
            <SelectStub placeholder="Select issue" />
          </FilterField>
        </FilterPanel>
        <Section title="Recommended treatment">
          <EmptyState
            icon={SprayCan}
            title="No advisory generated"
            description="Choose a crop and field, then generate an advisory to see product, dosage, timing and safety guidance."
            tone="ai"
            action={<Button variant="ai"><Sparkles /> Generate advisory</Button>}
          />
        </Section>
      </div>
    </PageShell>
  );
}
