import * as React from "react";
import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import axios from "axios";
import { CalendarDays, MapPinned, Ruler, Save } from "lucide-react";
import { toast } from "sonner";

import { PageShell, PageHeader, Section, EmptyState } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { apiClient } from "@/lib/api-client";
import type { FieldMapProps } from "@/components/avrum/field-map";

type FieldRecord = {
  _id: string;
  name: string;
  areaHectares: number;
  createdAt?: string;
};

type FieldsResponse = { fields: FieldRecord[] };

function calculatePolygonAreaHectares(polygon: number[][][]): number {
  const ring = polygon[0];
  if (!ring || ring.length < 4) return 0;

  const validLatitudes = ring
    .map((point) => point[1])
    .filter((latitude): latitude is number => typeof latitude === "number");
  const meanLatitude = validLatitudes.length
    ? validLatitudes.reduce((sum, latitude) => sum + latitude, 0) / validLatitudes.length
    : 0;
  const earthRadius = 6_378_137;
  const degreesToRadians = Math.PI / 180;
  const latitudeScale = Math.cos(meanLatitude * degreesToRadians);

  let area = 0;
  for (let index = 0; index < ring.length - 1; index += 1) {
    const first = ring[index];
    const second = ring[index + 1];
    const firstLongitude = first?.[0];
    const firstLatitude = first?.[1];
    const secondLongitude = second?.[0];
    const secondLatitude = second?.[1];

    if (
      typeof firstLongitude !== "number" ||
      typeof firstLatitude !== "number" ||
      typeof secondLongitude !== "number" ||
      typeof secondLatitude !== "number"
    ) {
      continue;
    }

    const firstX = earthRadius * firstLongitude * degreesToRadians * latitudeScale;
    const firstY = earthRadius * firstLatitude * degreesToRadians;
    const secondX = earthRadius * secondLongitude * degreesToRadians * latitudeScale;
    const secondY = earthRadius * secondLatitude * degreesToRadians;
    area += firstX * secondY - secondX * firstY;
  }

  return Math.abs(area / 2) / 10_000;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: unknown } | undefined)?.message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return error instanceof Error && error.message ? error.message : fallback;
}

export const Route = createFileRoute("/_app/farms/fields")({
  head: () => ({
    meta: [
      { title: "Field Boundaries — AVRUM AI" },
      {
        name: "description",
        content: "Draw and import field boundaries used for satellite and soil analysis.",
      },
      { property: "og:title", content: "Field Boundaries — AVRUM AI" },
      {
        property: "og:description",
        content: "Draw and import field boundaries used for satellite and soil analysis.",
      },
    ],
  }),
  component: FieldBoundariesPage,
});

function FieldBoundariesPage() {
  const location = useLocation();

  if (location.pathname !== "/farms/fields") {
    return <Outlet />;
  }

  return <FieldBoundariesContent />;
}

function FieldBoundariesContent() {
  const [FieldMap, setFieldMap] = React.useState<React.ComponentType<FieldMapProps> | null>(null);
  const [mapError, setMapError] = React.useState<string | null>(null);
  const [fields, setFields] = React.useState<FieldRecord[]>([]);
  const [fieldsLoading, setFieldsLoading] = React.useState(true);
  const [fieldsError, setFieldsError] = React.useState<string | null>(null);
  const [fieldName, setFieldName] = React.useState("");
  const [coordinates, setCoordinates] = React.useState<number[][][] | null>(null);
  const [resetKey, setResetKey] = React.useState(0);
  const [saving, setSaving] = React.useState(false);

  const areaHectares = coordinates ? calculatePolygonAreaHectares(coordinates) : 0;

  const loadFields = React.useCallback(async () => {
    setFieldsLoading(true);
    setFieldsError(null);
    try {
      const response = await apiClient.get<FieldsResponse>("/api/v1/fields");
      setFields(response.data.fields ?? []);
    } catch (error) {
      setFieldsError(getErrorMessage(error, "Unable to load saved fields."));
    } finally {
      setFieldsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let mounted = true;
    void import("@/components/avrum/field-map")
      .then((module) => {
        if (mounted) setFieldMap(() => module.FieldMap);
      })
      .catch(() => {
        if (mounted)
          setMapError("The field map could not be loaded. Refresh the page and try again.");
      });

    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    void loadFields();
  }, [loadFields]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = fieldName.trim();
    const ring = coordinates?.[0];
    const isClosed = Boolean(
      ring &&
      ring.length >= 4 &&
      ring[0]?.[0] === ring[ring.length - 1]?.[0] &&
      ring[0]?.[1] === ring[ring.length - 1]?.[1],
    );

    if (!trimmedName) {
      toast.error("Enter a field name.");
      return;
    }
    if (!coordinates || !isClosed) {
      toast.error("Draw a valid closed polygon before saving.");
      return;
    }
    if (areaHectares <= 0) {
      toast.error("The field area must be greater than zero.");
      return;
    }

    setSaving(true);
    try {
      await apiClient.post("/api/v1/fields", {
        name: trimmedName,
        coordinates,
      });
      toast.success("Field saved successfully.");
      setFieldName("");
      setCoordinates(null);
      setResetKey((value) => value + 1);
      await loadFields();
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to save the field."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell>
      <PageHeader
        title="Field Boundaries"
        subtitle="Draw, import and verify the geometry that powers satellite and soil intelligence."
        crumbs={[
          { label: "Dashboard", to: "/" },
          { label: "My Farms", to: "/farms" },
          { label: "Field Boundaries" },
        ]}
      />
      <Section
        title="Create a field"
        description="Search for the farm, draw its boundary, then name and save the field."
      >
        {mapError ? (
          <Alert variant="destructive">
            <AlertTitle>Map unavailable</AlertTitle>
            <AlertDescription>{mapError}</AlertDescription>
          </Alert>
        ) : FieldMap ? (
          <FieldMap onPolygonChange={setCoordinates} resetKey={resetKey} />
        ) : (
          <div className="flex h-[500px] items-center justify-center rounded-xl border border-border bg-muted text-sm text-muted-foreground">
            Loading map…
          </div>
        )}

        <form
          onSubmit={handleSave}
          className="grid gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end"
        >
          <div className="space-y-1.5">
            <Label htmlFor="field-name">Field name</Label>
            <Input
              id="field-name"
              value={fieldName}
              onChange={(event) => setFieldName(event.target.value)}
              placeholder="e.g. North maize field"
              maxLength={120}
            />
          </div>
          <div className="rounded-lg bg-emerald-soft px-4 py-2.5 text-sm">
            <p className="flex items-center gap-2 font-semibold text-emerald">
              <Ruler className="size-4" /> Area
            </p>
            <p className="mt-0.5 tabular-nums text-foreground">{areaHectares.toFixed(2)} ha</p>
          </div>
          <Button
            type="submit"
            variant="ai"
            loading={saving}
            disabled={!coordinates || areaHectares <= 0}
          >
            <Save /> Save field
          </Button>
        </form>
      </Section>
      <Section title="Saved boundaries">
        {fieldsLoading ? (
          <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Loading saved fields…
          </div>
        ) : fieldsError ? (
          <Alert variant="destructive">
            <AlertTitle>Could not load fields</AlertTitle>
            <AlertDescription className="flex flex-wrap items-center gap-3">
              <span>{fieldsError}</span>
              <Button type="button" variant="outline" size="sm" onClick={() => void loadFields()}>
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        ) : fields.length === 0 ? (
          <EmptyState
            icon={MapPinned}
            title="No boundaries saved"
            description="Draw a field boundary above to begin monitoring its crop health."
            tone="info"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {fields.map((field) => (
              <Link
                key={field._id}
                to="/farms/fields/$fieldId/vegetation"
                params={{ fieldId: field._id }}
                className="group block focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/25"
              >
                <Card className="h-full transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                  <CardHeader>
                    <CardTitle>{field.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Ruler className="size-4 text-emerald" /> {field.areaHectares.toFixed(2)}{" "}
                      hectares
                    </p>
                    {field.createdAt && (
                      <p className="flex items-center gap-2">
                        <CalendarDays className="size-4" /> Created{" "}
                        {new Date(field.createdAt).toLocaleDateString()}
                      </p>
                    )}
                    <span className="inline-flex items-center text-xs font-semibold text-primary group-hover:underline">
                      View vegetation data
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </PageShell>
  );
}
