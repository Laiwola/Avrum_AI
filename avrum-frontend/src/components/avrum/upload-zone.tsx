import * as React from "react";
import { UploadCloud, ImagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function UploadZone({
  title = "Upload crop images",
  description = "Drag and drop, or browse. JPG or PNG up to 10 MB.",
  className,
  compact = false,
}: {
  title?: string;
  description?: string;
  className?: string;
  compact?: boolean;
}) {
  const [dragging, setDragging] = React.useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
      }}
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border-strong bg-card/60 text-center transition-colors",
        compact ? "px-4 py-8" : "px-6 py-14",
        dragging && "border-emerald bg-emerald-soft/40",
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-2xl bg-emerald-soft text-emerald">
        {dragging ? <ImagePlus className="size-6" /> : <UploadCloud className="size-6" />}
      </span>
      <p className="mt-4 text-sm font-bold">{title}</p>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>
      <Button variant="outline" size="sm" className="mt-4">Browse files</Button>
    </div>
  );
}
