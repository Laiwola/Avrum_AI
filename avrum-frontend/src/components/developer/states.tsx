import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/avrum";
import { cn } from "@/lib/utils";

/** Empty state tuned for developer surfaces (keys, logs, webhooks, teams). */
export function DevEmptyState(props: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
}) {
  return <EmptyState tone="ai" {...props} />;
}

export function DevLoadingState({
  rows = 4, label = "Loading…", className,
}: { rows?: number; label?: string; className?: string }) {
  return (
    <Card className={cn("space-y-4 p-5", className)} aria-busy aria-label={label}>
      <Skeleton className="h-4 w-40" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      ))}
    </Card>
  );
}

export function DevErrorState({
  title = "Something went wrong",
  description = "We couldn't load this data. Retry, or check the status page if the issue persists.",
  onRetry,
  className,
}: { title?: string; description?: string; onRetry?: () => void; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-destructive/40 bg-destructive-soft/40 px-6 py-14 text-center",
        className,
      )}
      role="alert"
    >
      <span className="grid size-14 place-items-center rounded-2xl bg-destructive-soft text-destructive">
        <AlertTriangle className="size-7" />
      </span>
      <h3 className="mt-5 text-section-title">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {onRetry && (
        <Button variant="outline" className="mt-6" onClick={onRetry}>
          <RefreshCw /> Retry
        </Button>
      )}
    </div>
  );
}
