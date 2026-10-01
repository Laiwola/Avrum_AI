import type { ReactNode } from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function FilterPanel({
  children, onReset, title = "Filters", className,
}: { children: ReactNode; onReset?: () => void; title?: string; className?: string }) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
          <p className="truncate text-sm font-bold">{title}</p>
        </div>
        {onReset && (
          <Button variant="ghost" size="xs" onClick={onReset}>
            <RotateCcw /> Reset
          </Button>
        )}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">{children}</div>
    </Card>
  );
}

export function FilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
