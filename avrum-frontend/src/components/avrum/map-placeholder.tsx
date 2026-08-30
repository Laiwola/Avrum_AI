import { Map as MapIcon, Layers, Maximize2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function MapPlaceholder({
  label = "Field map", caption = "Geospatial layer will render here", className, height = "h-80",
}: { label?: string; caption?: string; className?: string; height?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-sky-soft/60",
        height,
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div aria-hidden className="absolute -left-10 top-10 size-48 rounded-full bg-emerald/20 blur-2xl" />
      <div aria-hidden className="absolute bottom-0 right-6 size-40 rounded-full bg-sky/20 blur-2xl" />

      <div className="absolute left-4 top-4 flex items-center gap-2">
        <Badge variant="info" size="sm"><Layers /> Layers</Badge>
      </div>
      <div className="absolute right-4 top-4">
        <Button variant="outline" size="icon-sm" aria-label="Expand map"><Maximize2 /></Button>
      </div>

      <div className="relative grid h-full place-items-center px-6 text-center">
        <div>
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-card text-sky shadow-sm">
            <MapIcon className="size-6" />
          </span>
          <p className="mt-3 text-sm font-bold">{label}</p>
          <p className="text-xs text-muted-foreground">{caption}</p>
        </div>
      </div>
    </div>
  );
}
