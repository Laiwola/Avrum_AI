import { createFileRoute } from "@tanstack/react-router";
import {
  Sprout, Activity, Satellite, Droplets, Plus, Stethoscope, ArrowUpRight,
} from "lucide-react";

import { PageShell, PageHeader, Section, StatCard, AIInsightCard, EmptyState, MapPlaceholder } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AVRUM AI" },
      { name: "description", content: "Your farm intelligence overview: crop health, risk alerts, spray windows and satellite insights in one place." },
      { property: "og:title", content: "Dashboard — AVRUM AI" },
      { property: "og:description", content: "Farm intelligence overview: crop health, risk alerts, spray windows and satellite insights." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <PageShell>
      <PageHeader
        title="Farm Intelligence Overview"
        subtitle="A single view of crop health, risk and recommended action across every field you manage."
        crumbs={[{ label: "Dashboard" }]}
        eyebrow={<Badge variant="ai" size="sm">AI monitoring active</Badge>}
        actions={
          <>
            <Button variant="outline"><Plus /> Add farm</Button>
            <Button variant="ai"><Stethoscope /> Diagnose crop</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active farms" value={0} icon={Sprout} trend="flat" trendLabel="No farms added yet" />
        <StatCard label="Crop health index" value="—" icon={Activity} tone="ai" />
        <StatCard label="Satellite passes" value="—" icon={Satellite} tone="info" />
        <StatCard label="Spray windows" value="—" icon={Droplets} tone="warning" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Section title="Field overview" description="Geospatial view of your monitored fields.">
            <MapPlaceholder height="h-72 sm:h-96" />
          </Section>

          <Section title="Recent activity">
            <EmptyState
              icon={Activity}
              title="No activity yet"
              description="Once you add a farm, diagnoses, advisories and satellite updates will appear here as a timeline."
              action={<Button variant="ai"><Plus /> Add your first farm</Button>}
            />
          </Section>
        </div>

        <div className="space-y-6">
          <AIInsightCard
            title="What to do next"
            insight="AVRUM AI has no field data yet. Add a farm and upload a crop photo to generate your first diagnosis and advisory."
            recommendation="Add a farm, then run AI Crop Doctor on one field."
            confidence={0}
            severity="info"
            footer={<Button size="sm" variant="emerald">Get started <ArrowUpRight /></Button>}
          />

          <Card>
            <CardHeader><CardTitle>Risk watchlist</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Disease and weather risks for your regions will be tracked here, ranked by urgency.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
