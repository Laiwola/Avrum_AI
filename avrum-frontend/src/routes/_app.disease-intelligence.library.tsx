import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

import { PageShell, PageHeader, Section, EmptyState } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/avrum";

export const Route = createFileRoute("/_app/disease-intelligence/library")({
  head: () => ({
    meta: [
      { title: "Disease Library — AVRUM AI" },
      { name: "description", content: "Browse reference profiles for crop diseases with symptoms, conditions and treatments." },
      { property: "og:title", content: "Disease Library — AVRUM AI" },
      { property: "og:description", content: "Browse reference profiles for crop diseases with symptoms, conditions and treatments." },
    ],
  }),
  component: DiseaseLibraryPage,
});

function DiseaseLibraryPage() {
  return (
    <PageShell>
      <PageHeader
        title="Disease Library"
        subtitle="Reference profiles for crop diseases: symptoms, conditions and treatment options."
        crumbs={[{ label: "Dashboard", to: "/" }, { label: "Disease Intelligence", to: "/disease-intelligence" }, { label: "Disease Library" }]}
        actions={
          <Button variant="outline"><BookOpen /> Request a disease</Button>
        }
      />
      <Section title="Browse library" actions={<SearchBox placeholder="Search diseases…" className="sm:w-72" />}>
        <EmptyState
          icon={BookOpen}
          title="Library is being prepared"
          description="Curated disease profiles for maize, cassava, rice, tomato and cocoa will be listed here."
        />
      </Section>
    </PageShell>
  );
}
