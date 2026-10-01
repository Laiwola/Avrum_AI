import { Check, Circle, Rocket } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type GettingStartedStep = {
  id: string;
  title: string;
  description: string;
  done: boolean;
};

export function GettingStartedCard({
  steps, className,
}: { steps: GettingStartedStep[]; className?: string }) {
  const done = steps.filter((s) => s.done).length;
  const pct = Math.round((done / steps.length) * 100);

  return (
    <Card className={cn("space-y-5 p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-primary to-emerald">
            <Rocket className="size-4.5 text-primary-foreground" />
          </span>
          <div className="min-w-0">
            <p className="text-section-title">Getting started</p>
            <p className="text-xs text-muted-foreground">Ship your first integration</p>
          </div>
        </div>
        <Badge variant="ai" size="sm">{done}/{steps.length}</Badge>
      </div>

      <Progress value={pct} className="h-2" />

      <ol className="space-y-3">
        {steps.map((step) => (
          <li key={step.id} className="flex gap-3">
            <span
              className={cn(
                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border",
                step.done
                  ? "border-transparent bg-emerald text-emerald-foreground"
                  : "border-border-strong text-muted-foreground",
              )}
            >
              {step.done ? <Check className="size-3" /> : <Circle className="size-2 fill-current" />}
            </span>
            <div className="min-w-0">
              <p
                className={cn(
                  "text-sm font-semibold",
                  step.done && "text-muted-foreground line-through",
                )}
              >
                {step.title}
              </p>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
