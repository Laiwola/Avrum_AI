import { Check } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export type OnboardingStepMeta = { id: string; label: string; short: string };

/** Horizontal progress bar + compact step ticker used at the top of the wizard. */
export function OnboardingProgress({
  steps,
  current,
  className,
}: {
  steps: OnboardingStepMeta[];
  current: number;
  className?: string;
}) {
  const percent = Math.round(((current + 1) / steps.length) * 100);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-2xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Step {current + 1} of {steps.length} · {steps[current]?.short}
        </p>
        <p className="text-2xs font-semibold text-primary">{percent}% complete</p>
      </div>

      <Progress value={percent} className="h-1.5" />

      <ol className="hidden flex-wrap gap-1.5 md:flex">
        {steps.map((step, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <li
              key={step.id}
              aria-current={active ? "step" : undefined}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-2xs font-semibold transition-colors",
                active && "border-transparent bg-primary-soft text-primary",
                done && "border-transparent bg-emerald-soft text-emerald",
                !active && !done && "border-border text-muted-foreground",
              )}
            >
              {done ? <Check className="size-3" /> : <span>{index + 1}</span>}
              {step.short}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
