import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { AlertCircle, CheckCircle2, FileImage, History, Stethoscope, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PageShell, PageHeader, Section, EmptyState } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { UploadZone, AIInsightCard } from "@/components/avrum";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";

const CROP_OPTIONS = ["maize", "cassava", "rice", "tomato", "pepper"] as const;
type Crop = (typeof CROP_OPTIONS)[number];

type DiagnosisResult = {
  crop: string;
  healthStatus: "healthy" | "diseased" | "unknown";
  disease: { name: string | null; confidence: number };
  observations: string[];
  agronomistAdvice: {
    overview: string;
    symptoms: string[];
    causes: string[];
    treatment: string[];
    prevention: string[];
    severity: string;
    recommendedAction: string;
  };
};

type UploadResponse = { success: boolean; data: { key: string; image_url: string } };
type DiagnosisResponse = { success: boolean; data: DiagnosisResult };
type AnalysisState = "idle" | "uploading" | "analyzing";

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
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [crop, setCrop] = React.useState<Crop>("tomato");
  const [analysisState, setAnalysisState] = React.useState<AnalysisState>("idle");
  const [diagnosis, setDiagnosis] = React.useState<DiagnosisResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileSelected = (nextFile: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(nextFile.type)) {
      setError("Please upload a JPEG, PNG, or WebP image.");
      return;
    }
    if (nextFile.size > 10 * 1024 * 1024) {
      setError("Please choose an image smaller than 10 MB.");
      return;
    }
    setFile(nextFile);
    setDiagnosis(null);
    setError(null);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setDiagnosis(null);
    setError(null);
  };

  const analyzeCrop = async () => {
    if (!file) {
      setError("Please upload a crop image first.");
      return;
    }
    setAnalysisState("uploading");
    setError(null);
    setDiagnosis(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const uploadResponse = await apiClient.post<UploadResponse>("/api/diagnosis/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploadData = uploadResponse.data.data;
      if (!uploadData?.key || !uploadData.image_url) throw new Error("Upload response was incomplete");

      setAnalysisState("analyzing");
      const diagnosisResponse = await apiClient.post<DiagnosisResponse>("/api/diagnosis", {
        crop,
        image_url: uploadData.image_url,
        image_key: uploadData.key,
      });
      setDiagnosis(diagnosisResponse.data.data);
      setAnalysisState("idle");
    } catch {
      setAnalysisState("idle");
      const message = "Unable to analyze this image. Please try again.";
      setError(message);
      toast.error(message);
    }
  };

  const confidence = diagnosis ? Math.round(diagnosis.disease.confidence * 100) : 0;
  const isHealthy = diagnosis?.healthStatus === "healthy";
  const isBusy = analysisState !== "idle";

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
            {!file ? (
              <UploadZone title="Upload crop image" description="Drag and drop, or browse. JPEG, PNG, or WebP up to 10 MB." onFileSelected={handleFileSelected} />
            ) : (
              <div className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="grid gap-5 sm:grid-cols-[9rem_minmax(0,1fr)]">
                  <img src={previewUrl ?? undefined} alt="Selected crop" className="aspect-square w-full rounded-lg object-cover" />
                  <div className="min-w-0 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <FileImage className="size-5 shrink-0 text-emerald" />
                        <div className="min-w-0"><p className="truncate text-sm font-bold">{file.name}</p><p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(1)} MB</p></div>
                      </div>
                      <Button type="button" variant="ghost" size="icon-sm" onClick={handleRemoveFile} disabled={isBusy} aria-label="Remove image"><Trash2 /></Button>
                    </div>
                    <label className="block space-y-1.5 text-sm font-semibold" htmlFor="crop-type">Crop type
                      <select id="crop-type" value={crop} onChange={(e) => setCrop(e.target.value as Crop)} disabled={isBusy} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none focus:ring-3 focus:ring-ring/25">
                        {CROP_OPTIONS.map((option) => <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>)}
                      </select>
                    </label>
                  </div>
                </div>
                <Button type="button" variant="ai" size="lg" block onClick={() => void analyzeCrop()} loading={isBusy}>
                  {analysisState === "uploading" ? "Uploading crop image..." : analysisState === "analyzing" ? "Analyzing crop..." : "Analyze crop"}
                </Button>
              </div>
            )}
            {error && <div role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive-soft p-3 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" /><span>{error}</span></div>}
          </Section>
          <Section title="Diagnosis result">
            {!diagnosis ? <EmptyState icon={Stethoscope} title="No diagnosis yet" description="Upload an image to run the crop disease model and receive a confidence-scored result." tone="ai" /> : (
              <div className="space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div><div className="flex items-center gap-2">{isHealthy ? <CheckCircle2 className="size-5 text-success" /> : <AlertCircle className="size-5 text-destructive" />}<Badge variant={isHealthy ? "success" : "danger"}>{isHealthy ? "Healthy" : diagnosis.healthStatus === "diseased" ? "Diseased" : "Needs review"}</Badge></div><h3 className="mt-3 text-2xl font-bold">{isHealthy ? "No obvious disease detected" : diagnosis.disease.name ?? "Disease detected"}</h3><p className="mt-1 text-sm text-muted-foreground">{diagnosis.crop.charAt(0).toUpperCase() + diagnosis.crop.slice(1)} crop · {confidence}% confidence</p></div>
                  <div className="rounded-lg bg-emerald-soft px-4 py-3 text-right"><p className="text-overline text-emerald">Model confidence</p><p className="mt-1 text-2xl font-bold text-emerald">{confidence}%</p></div>
                </div>
                <DetailList title="Key observations" items={diagnosis.observations} />
                <div className="grid gap-5 md:grid-cols-2">
                  <AdviceBlock title="Overview" text={diagnosis.agronomistAdvice.overview} />
                  {!isHealthy && <><DetailList title="Symptoms" items={diagnosis.agronomistAdvice.symptoms} /><DetailList title="Causes" items={diagnosis.agronomistAdvice.causes} /><DetailList title="Treatment" items={diagnosis.agronomistAdvice.treatment} /></>}
                  <DetailList title="Prevention" items={diagnosis.agronomistAdvice.prevention} />
                  <AdviceBlock title="Recommended action" text={diagnosis.agronomistAdvice.recommendedAction} /><AdviceBlock title="Severity" text={diagnosis.agronomistAdvice.severity} />
                </div>
              </div>
            )}
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

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return <div className="space-y-2"><h4 className="text-sm font-bold">{title}</h4><ul className="space-y-1.5 text-sm text-muted-foreground">{items.map((item) => <li key={item} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald" />{item}</li>)}</ul></div>;
}

function AdviceBlock({ title, text }: { title: string; text: string }) {
  return <div className="space-y-2"><h4 className="text-sm font-bold">{title}</h4><p className="text-sm leading-relaxed text-muted-foreground">{text}</p></div>;
}
