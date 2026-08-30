import { createFileRoute } from "@tanstack/react-router";
import { Stethoscope, History } from "lucide-react";

import { PageShell, PageHeader, Section, EmptyState } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { UploadZone, AIInsightCard } from "@/components/avrum";

export const Route = createFileRoute("/_app/crop-doctor")({
  head: () => ({
    meta: [
      { title: "AI Crop Doctor — AVRUM AI" },
      { name: "description", content: "Upload a crop photo for instant AI diagnosis, severity scoring and a treatment plan." },
      { property: "og:title", content: "AI Crop Doctor — AVRUM AI" },
      { property: "og:description", content: "Upload a crop photo for instant AI diagnosis, severity scoring and a treatment plan." },
    ],
  }),
  component: CropDoctorPage,
});

function CropDoctorPage() {
  return (
    <PageShell>
      <PageHeader
        title="AI Crop Doctor"
        subtitle="Upload a crop photo and get an instant diagnosis, severity score and treatment plan."
        crumbs={[{ label: "Dashboard", to: "/" }, { label: "AI Crop Doctor" }]}
        actions={
          <Button variant="outline"><History /> Diagnosis history</Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="Upload crop image" description="Clear, close-up leaf photos give the most accurate result.">
            <UploadZone />
          </Section>
          <Section title="Diagnosis result">
            <EmptyState
              icon={Stethoscope}
              title="No diagnosis yet"
              description="Upload one or more images to run the crop disease model and receive a confidence-scored result."
              tone="ai"
            />
          </Section>
        </div>
        <div className="space-y-6">
          <AIInsightCard
            title="How diagnosis works"
            insight="Images are analysed for lesion pattern, colour distribution and leaf structure, then matched against regional disease prevalence."
            recommendation="Capture 3 photos per affected plant for best accuracy."
            confidence={0}
          />
        </div>
      </div>
    </PageShell>
  );
}
