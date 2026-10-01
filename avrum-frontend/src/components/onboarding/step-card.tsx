import type { ComponentType, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** Consistent heading + body wrapper for every wizard step. */
export function StepCard({
  icon: Icon,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  icon?: LucideIcon | ComponentType<{ className?: string }>;
  eyebrow?: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("animate-fade-in space-y-6", className)}>
      <header className="space-y-2">
        {eyebrow}
        <div className="flex items-start gap-3">
          {Icon && (
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <Icon className="size-5" />
            </span>
          )}
          <div className="min-w-0">
            <h1 className="text-section-title">{title}</h1>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
