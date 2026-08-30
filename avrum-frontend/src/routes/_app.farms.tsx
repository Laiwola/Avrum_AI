import { createFileRoute } from "@tanstack/react-router";
import { Sprout, Plus, Upload } from "lucide-react";

import { PageShell, PageHeader, Section, EmptyState } from "@/components/avrum";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/farms")({
  head: () => ({
    meta: [
      { title: "My Farms — AVRUM AI" },
      { name: "description", content: "Manage your farms, field boundaries and crop cycles inside AVRUM AI." },
      { property: "og:title", content: "My Farms — AVRUM AI" },
      { property: "og:description", content: "Manage your farms, field boundaries and crop cycles inside AVRUM AI." },
    ],
  }),
  component: FarmsPage,
});

function FarmsPage() {
  return (
    <PageShell>
      <PageHeader
        title="My Farms"
        subtitle="Every farm, field and crop cycle you manage — organised for fast decisions."
        crumbs={[{ label: "Dashboard", to: "/" }, { label: "My Farms" }]}
        actions={
          <Button variant="ai"><Plus /> Add farm</Button>
        }
      />
      <Section title="Your farms" description="Farms you own or have been granted access to.">
        <EmptyState
          icon={Sprout}
          title="No farms yet"
          description="Add your first farm to unlock diagnosis, satellite monitoring and spray advisories for its fields."
          action={<Button variant="ai"><Plus /> Add farm</Button>}
          secondaryAction={<Button variant="outline"><Upload /> Import boundaries</Button>}
        />
      </Section>
    </PageShell>
  );
}
