import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label, value, unit, icon: Icon, trend, trendLabel, tone = "default", className,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "flat";
  trendLabel?: string;
  tone?: "default" | "ai" | "info" | "warning" | "danger";
  className?: string;
}) {
  const toneClass = {
    default: "bg-primary-soft text-primary",
    ai: "bg-emerald-soft text-emerald",
    info: "bg-sky-soft text-sky",
    warning: "bg-warning-soft text-warning-foreground",
    danger: "bg-destructive-soft text-destructive",
  }[tone];

  const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
  const trendClass =
    trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground";

  return (
    <Card className={cn("p-5 transition-shadow hover:shadow-md", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-overline text-muted-foreground">{label}</p>
        {Icon && (
          <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", toneClass)}>
            <Icon className="size-4.5" />
          </span>
        )}
      </div>
      <p className="mt-3 flex items-baseline gap-1">
        <span className="text-metric">{value}</span>
        {unit && <span className="text-sm font-semibold text-muted-foreground">{unit}</span>}
      </p>
      {trend && (
        <p className={cn("mt-2 flex items-center gap-1 text-xs font-semibold", trendClass)}>
          <TrendIcon className="size-3.5" />
          {trendLabel}
        </p>
      )}
    </Card>
  );
}
