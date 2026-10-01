import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function AIInsightCard({
  title, insight, confidence, recommendation, footer, severity = "info", className,
}: {
  title: string;
  insight: string;
  confidence?: number;
  recommendation?: string;
  footer?: ReactNode;
  severity?: "info" | "advisory" | "critical";
  className?: string;
}) {
  const map = {
    info: { badge: "info" as const, label: "Insight", ring: "border-sky/30" },
    advisory: { badge: "warning" as const, label: "Advisory", ring: "border-warning/40" },
    critical: { badge: "danger" as const, label: "Critical", ring: "border-destructive/40" },
  }[severity];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm",
        map.ring,
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-emerald-soft blur-2xl"
      />
      <div className="relative space-y-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-linear-to-br from-primary to-emerald">
              <Sparkles className="size-4 text-primary-foreground" />
            </span>
            <h3 className="truncate text-section-title">{title}</h3>
          </div>
          <Badge variant={map.badge} size="sm">{map.label}</Badge>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">{insight}</p>

        {recommendation && (
          <div className="rounded-lg bg-emerald-soft/60 p-3">
            <p className="text-overline text-emerald">Recommended action</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{recommendation}</p>
          </div>
        )}

        {typeof confidence === "number" && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span>Model confidence</span>
              <span className="tabular-nums text-foreground">{confidence}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-linear-to-r from-primary to-emerald"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        )}

        {footer && <div className="flex flex-wrap items-center gap-2 pt-1">{footer}</div>}
      </div>
    </div>
  );
}
