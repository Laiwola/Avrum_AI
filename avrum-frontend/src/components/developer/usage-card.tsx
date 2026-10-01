import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Quota / consumption card for the Usage and Billing surfaces. */
export function UsageCard({
  title, description, used, limit, unit = "requests", period = "This month", tone = "default", className,
}: {
  title: string;
  description?: string;
  used: number;
  limit: number;
  unit?: string;
  period?: string;
  tone?: "default" | "ai" | "info" | "warning";
  className?: string;
}) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const badgeVariant = pct >= 90 ? "danger" : pct >= 70 ? "warning" : tone === "ai" ? "ai" : "info";

  return (
    <Card className={cn("space-y-4 p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold">{title}</p>
          {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        </div>
        <Badge variant={badgeVariant} size="sm">{pct}%</Badge>
      </div>

      <Progress value={pct} className="h-2" />

      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold tabular-nums">
          {used.toLocaleString()} / {limit.toLocaleString()} {unit}
        </span>
        <span className="text-muted-foreground">{period}</span>
      </div>
    </Card>
  );
}
