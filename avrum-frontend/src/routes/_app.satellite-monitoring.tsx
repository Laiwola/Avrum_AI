import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { MapPinned, RefreshCw, Satellite } from "lucide-react";
import { toast } from "sonner";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageShell, PageHeader, Section, EmptyState, IndexLayerMap } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFields, useFieldPasses, useRefreshImagery } from "@/hooks/use-satellite";
import { fieldSupportsSatellite } from "@/lib/satellite/mock-data";
import { SATELLITE_INDEX_LABEL, type SatelliteIndexType } from "@/lib/satellite/types";

export const Route = createFileRoute("/_app/satellite-monitoring")({
  head: () => ({
    meta: [
      { title: "Satellite Monitoring — AVRUM AI" },
      {
        name: "description",
        content: "Track vegetation, moisture and crop stress indices from satellite imagery.",
      },
      { property: "og:title", content: "Satellite Monitoring — AVRUM AI" },
      {
        property: "og:description",
        content: "Track vegetation, moisture and crop stress indices from satellite imagery.",
      },
    ],
  }),
  component: SatelliteMonitoringPage,
});

const INDEX_OPTIONS: SatelliteIndexType[] = ["ndvi", "ndmi", "stress"];

function SatelliteMonitoringPage() {
  const { data: fields, isLoading: fieldsLoading } = useFields();
  const [selectedFieldId, setSelectedFieldId] = React.useState<string | undefined>(undefined);
  const [activeIndex, setActiveIndex] = React.useState<SatelliteIndexType>("ndvi");

  React.useEffect(() => {
    const firstField = fields?.[0];
    if (!selectedFieldId && firstField) {
      setSelectedFieldId(firstField.id);
    }
  }, [fields, selectedFieldId]);

  const selectedField = fields?.find((f) => f.id === selectedFieldId);
  const { data: passes, isLoading: passesLoading } = useFieldPasses(selectedFieldId);
  const refreshImagery = useRefreshImagery(selectedFieldId);

  const handleRefresh = async () => {
    if (!selectedField) return;
    try {
      await refreshImagery.mutateAsync();
      toast.success(`New satellite pass received for ${selectedField.name}.`);
    } catch {
      toast.error("Couldn't fetch a new satellite pass. Please try again.");
    }
  };

  const latestPass = passes && passes.length > 0 ? passes[passes.length - 1] : undefined;
  const canRefresh = Boolean(selectedField && fieldSupportsSatellite(selectedField));

  const chartData = (passes ?? []).map((pass) => ({
    date: new Date(pass.capturedAt).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    ndvi: Math.round(pass.meanIndices.ndvi * 100),
    ndmi: Math.round(pass.meanIndices.ndmi * 100),
    stress: Math.round(pass.meanIndices.stress * 100),
  }));

  return (
    <PageShell>
      <PageHeader
        title="Satellite Monitoring"
        subtitle="Vegetation, moisture and stress indices tracked from space, field by field."
        crumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Satellite Monitoring" }]}
        actions={
          <Button
            variant="outline"
            onClick={() => void handleRefresh()}
            loading={refreshImagery.isPending}
            disabled={!canRefresh}
          >
            <RefreshCw /> Refresh imagery
          </Button>
        }
      />

      {!fieldsLoading && fields && fields.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-semibold text-muted-foreground" htmlFor="field-select">
            Field
          </label>
          <Select value={selectedFieldId ?? ""} onValueChange={setSelectedFieldId}>
            <SelectTrigger id="field-select" className="w-full sm:w-72">
              <SelectValue placeholder="Select a field" />
            </SelectTrigger>
            <SelectContent>
              {fields.map((field) => (
                <SelectItem key={field.id} value={field.id}>
                  {field.name} · {field.farmName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {!fieldsLoading && (!fields || fields.length === 0) && (
        <EmptyState
          icon={MapPinned}
          title="No fields yet"
          description="Add a farm and a field boundary first — satellite passes are tracked per field."
          tone="info"
          action={
            <Button variant="outline" asChild>
              <Link to="/farms/fields">
                <MapPinned /> Add a field
              </Link>
            </Button>
          }
        />
      )}

      {selectedField && !fieldSupportsSatellite(selectedField) && (
        <EmptyState
          icon={MapPinned}
          title="No boundary saved for this field"
          description={`${selectedField.name} doesn't have a boundary yet. Draw or import one to start receiving satellite passes.`}
          tone="info"
          action={
            <Button variant="outline" asChild>
              <Link to="/farms/fields">
                <MapPinned /> Add boundary
              </Link>
            </Button>
          }
        />
      )}

      {selectedField && fieldSupportsSatellite(selectedField) && (
        <>
          <Section
            title="Index viewer"
            description="NDVI, NDMI and stress layers for the selected field."
            actions={
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                value={activeIndex}
                onValueChange={(value) => value && setActiveIndex(value as SatelliteIndexType)}
              >
                {INDEX_OPTIONS.map((option) => (
                  <ToggleGroupItem
                    key={option}
                    value={option}
                    aria-label={SATELLITE_INDEX_LABEL[option]}
                  >
                    {option.toUpperCase()}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            }
          >
            {latestPass ? (
              <IndexLayerMap
                index={activeIndex}
                grid={latestPass.grids[activeIndex]}
                pass={latestPass}
                fieldName={selectedField.name}
              />
            ) : (
              <EmptyState
                icon={Satellite}
                title={passesLoading ? "Loading imagery…" : "No imagery available yet"}
                description='Run "Refresh imagery" to request the first satellite pass for this field.'
                tone="info"
              />
            )}
          </Section>

          <Section title="Index history">
            {chartData.length > 1 ? (
              <div className="h-72 rounded-xl border border-border bg-card p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" fontSize={12} tickLine={false} />
                    <YAxis unit="%" fontSize={12} tickLine={false} domain={[0, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="ndvi"
                      name="NDVI"
                      stroke="#15803d"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="ndmi"
                      name="NDMI"
                      stroke="#0369a1"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="stress"
                      name="Stress"
                      stroke="#b91c1c"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                icon={Satellite}
                title="No imagery available"
                description="Add a field boundary to begin receiving satellite passes and time-series index history."
                tone="info"
              />
            )}
          </Section>
        </>
      )}
    </PageShell>
  );
}
