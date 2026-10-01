import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, Info, MapPinned, Ruler, Sparkles, TrendingUp } from "lucide-react";
import { format } from "date-fns";

import { PageHeader, PageShell, Section } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { apiClient } from "@/lib/api-client";
import type { VegetationMapResponse } from "@/components/avrum/field-map";
import { VegetationMap } from "@/components/avrum/field-map";

export const Route = createFileRoute("/_app/farms/fields/$fieldId/vegetation")({
  head: () => ({
    meta: [
      { title: "Vegetation Monitoring — AVRUM AI" },
      {
        name: "description",
        content: "Satellite vegetation monitoring for your field.",
      },
      { property: "og:title", content: "Vegetation Monitoring — AVRUM AI" },
      {
        property: "og:description",
        content: "Satellite vegetation monitoring for your field.",
      },
    ],
  }),
  component: FieldVegetationPage,
});

function getVegetationHealth(ndvi: number | null): "Good" | "Moderate" | "Low" {
  if (typeof ndvi !== "number" || Number.isNaN(ndvi)) return "Low";
  if (ndvi > 0.6) return "Good";
  if (ndvi >= 0.3) return "Moderate";
  return "Low";
}

function formatNdvi(ndvi: number | null) {
  if (typeof ndvi !== "number" || Number.isNaN(ndvi)) return "Unavailable";
  return ndvi.toFixed(2);
}

function formatObservationDate(date: string | null) {
  if (!date) return "Unavailable";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Unavailable";
  return format(parsed, "MMM d, yyyy");
}

function FieldVegetationPage() {
  const { fieldId } = Route.useParams();
  const [data, setData] = useState<VegetationMapResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVegetation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<VegetationMapResponse>(
        `/api/v1/fields/${fieldId}/vegetation/map`,
      );
      setData(response.data.data ?? null);
    } catch (loadError) {
      const message =
        loadError instanceof Error && loadError.message
          ? loadError.message
          : "Vegetation data could not be loaded.";
      setError(
        message.includes("401") || message.includes("Unauthorized")
          ? "Your session expired. Please sign in again to view field vegetation."
          : "Vegetation data could not be loaded right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [fieldId]);

  useEffect(() => {
    void loadVegetation();
  }, [loadVegetation]);

  const fieldName = data?.field.name ?? "Field";
  const ndvi = data?.vegetation.ndvi ?? null;
  const observationDate = data?.vegetation.date ?? null;
  const mapImage = data?.map.image ?? null;
  const mapBounds = data?.map.bounds ?? null;

  const vegetationStatus = useMemo(() => getVegetationHealth(ndvi), [ndvi]);

  const summaryCards = [
    {
      label: "Field Area",
      value:
        data?.field.areaHectares != null
          ? `${data.field.areaHectares.toFixed(2)} hectares`
          : "Unavailable",
      icon: Ruler,
      tone: "default",
    },
    {
      label: "Vegetation Health",
      value: typeof ndvi === "number" ? vegetationStatus : "Unavailable",
      icon: TrendingUp,
      tone: "ai",
    },
    {
      label: "NDVI",
      value: formatNdvi(ndvi),
      icon: Sparkles,
      tone: "info",
    },
    {
      label: "Observation Date",
      value: formatObservationDate(observationDate),
      secondary: observationDate ? "Latest available" : undefined,
      icon: MapPinned,
      tone: "warning",
    },
  ];

  return (
    <PageShell>
      <PageHeader
        title={fieldName}
        subtitle="Satellite-based vegetation analysis for this field."
        crumbs={[
          { label: "Dashboard", to: "/" },
          { label: "My Farms", to: "/farms" },
          { label: "Field Boundaries", to: "/farms/fields" },
          { label: fieldName },
        ]}
        eyebrow={
          <Badge variant="ai" size="sm">
            Vegetation Monitoring
          </Badge>
        }
      />

      {loading && !data ? (
        <Section>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="h-32 animate-pulse bg-muted/60" />
            ))}
          </div>
          <div className="h-[450px] rounded-2xl border border-border bg-muted/60 animate-pulse" />
        </Section>
      ) : null}

      {!loading && error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Vegetation data unavailable</AlertTitle>
          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <Button type="button" variant="outline" size="sm" onClick={() => void loadVegetation()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!loading && !error && data && (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map(({ label, value, icon: Icon, tone, secondary }) => (
              <Card key={label} className="border border-border bg-card shadow-sm">
                <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
                  <div className="space-y-1">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-foreground">{value}</p>
                    {secondary && <p className="text-xs text-muted-foreground">{secondary}</p>}
                  </div>
                  <div
                    className={[
                      "grid size-10 place-items-center rounded-xl border",
                      tone === "default" && "bg-primary-soft text-primary border-primary/20",
                      tone === "ai" && "bg-emerald-soft text-emerald border-emerald/20",
                      tone === "info" && "bg-sky-soft text-sky border-sky/20",
                      tone === "warning" &&
                        "bg-warning-soft text-warning-foreground border-warning/20",
                    ].join(" ")}
                  >
                    <Icon className="size-4" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Section>
            <div className="rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4">
              <div className="relative">
                <VegetationMap
                  imageUrl={mapImage}
                  bounds={mapBounds}
                  heightClassName="h-[450px] sm:h-[520px]"
                />

                <div className="pointer-events-none absolute right-4 top-4 w-[220px] rounded-xl border border-border bg-card/90 p-3 shadow-md backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Vegetation Signal
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-foreground">
                    <li className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full bg-emerald" /> High
                      </span>
                      <span className="text-muted-foreground">NDVI &gt; 0.60</span>
                    </li>
                    <li className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full bg-yellow-400" /> Moderate
                      </span>
                      <span className="text-muted-foreground">0.30 – 0.60</span>
                    </li>
                    <li className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full bg-red-500" /> Low
                      </span>
                      <span className="text-muted-foreground">NDVI &lt; 0.30</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Section>

          <Section>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
              <Card className="border border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle>About this vegetation layer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
                  <p>
                    This map shows satellite-derived vegetation signals (NDVI) for your field.
                    Changes over time can help identify areas that may need attention, such as
                    stress, low vegetation or irregular growth.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border bg-sky-soft/60 shadow-sm">
                <CardContent className="flex h-full items-start gap-3 p-5">
                  <div className="grid size-8 shrink-0 place-items-center rounded-full bg-sky text-sky-foreground">
                    <Info className="size-4" />
                  </div>
                  <div className="space-y-1 text-sm text-foreground">
                    <p className="font-semibold">This is a vegetation signal,</p>
                    <p className="text-muted-foreground">not a disease diagnosis.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Section>
        </>
      )}

      {!loading && !error && !data && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Map data unavailable</AlertTitle>
          <AlertDescription>
            The vegetation layer for this field is not available right now.
          </AlertDescription>
        </Alert>
      )}

      {!loading && data && (
        <div className="text-sm text-muted-foreground">
          <Link to="/farms/fields" className="font-semibold text-primary hover:underline">
            ← Back to field boundaries
          </Link>
        </div>
      )}
    </PageShell>
  );
}
