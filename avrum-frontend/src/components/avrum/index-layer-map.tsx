import * as React from "react";
import { Layers, Maximize2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { IndexGrid, SatelliteIndexType, SatellitePass } from "@/lib/satellite/types";
import { SATELLITE_INDEX_LABEL } from "@/lib/satellite/types";

/** Low → high color ramps per index. Stress is inverted (high = bad = red). */
const RAMPS: Record<SatelliteIndexType, [string, string]> = {
  ndvi: ["#fde68a", "#15803d"], // pale yellow -> deep green
  ndmi: ["#fee2e2", "#0369a1"], // pale red -> deep blue
  stress: ["#dcfce7", "#b91c1c"], // pale green -> deep red
};

function lerpColor(a: string, b: string, t: number) {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  const r = Math.round(pa.r + (pb.r - pa.r) * t);
  const g = Math.round(pa.g + (pb.g - pa.g) * t);
  const bl = Math.round(pa.b + (pb.b - pa.b) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

function hexToRgb(hex: string) {
  const v = hex.replace("#", "");
  return {
    r: parseInt(v.substring(0, 2), 16),
    g: parseInt(v.substring(2, 4), 16),
    b: parseInt(v.substring(4, 6), 16),
  };
}

function IndexGridCells({ grid, index }: { grid: IndexGrid; index: SatelliteIndexType }) {
  const [low, high] = RAMPS[index];
  return (
    <div className="grid h-full w-full" style={{ gridTemplateRows: `repeat(${grid.rows}, 1fr)` }}>
      {Array.from({ length: grid.rows }).map((_, row) => (
        <div
          key={row}
          className="grid w-full"
          style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)` }}
        >
          {Array.from({ length: grid.cols }).map((__, col) => {
            const value = grid.values[row * grid.cols + col] ?? 0;
            return (
              <div
                key={col}
                title={`${SATELLITE_INDEX_LABEL[index]}: ${(value * 100).toFixed(0)}%`}
                style={{ backgroundColor: lerpColor(low, high, value) }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function IndexLayerMap({
  index,
  grid,
  pass,
  fieldName,
  className,
  height = "h-80 sm:h-[28rem]",
}: {
  index: SatelliteIndexType;
  grid: IndexGrid;
  pass: SatellitePass;
  fieldName: string;
  className?: string;
  height?: string;
}) {
  const [low, high] = RAMPS[index];
  const mean = pass.meanIndices[index];
  const [expanded, setExpanded] = React.useState(false);
  const capturedLabel = new Date(pass.capturedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card",
        height,
        className,
      )}
    >
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
        <Badge variant="info" size="sm">
          <Layers /> {SATELLITE_INDEX_LABEL[index]}
        </Badge>
      </div>
      <div className="absolute right-4 top-4 z-10">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Expand map"
          onClick={() => setExpanded(true)}
        >
          <Maximize2 />
        </Button>
      </div>

      <IndexGridCells grid={grid} index={index} />

      <div className="absolute inset-x-4 bottom-4 z-10 flex flex-wrap items-end justify-between gap-3">
        <div className="rounded-lg bg-card/90 px-3 py-2 shadow-sm backdrop-blur-sm">
          <p className="text-xs font-bold">{fieldName}</p>
          <p className="text-xs text-muted-foreground">Pass captured {capturedLabel}</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-card/90 px-3 py-2 shadow-sm backdrop-blur-sm">
          <span
            className="h-2 w-16 rounded-full"
            style={{ background: `linear-gradient(90deg, ${low}, ${high})` }}
          />
          <span className="text-xs font-semibold tabular-nums">{Math.round(mean * 100)}% avg</span>
        </div>
      </div>

      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {fieldName} · {SATELLITE_INDEX_LABEL[index]}
            </DialogTitle>
            <DialogDescription>
              Pass captured {capturedLabel} · {Math.round(mean * 100)}% field average
            </DialogDescription>
          </DialogHeader>
          <div className="relative h-[28rem] overflow-hidden rounded-xl border border-border">
            <IndexGridCells grid={grid} index={index} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
