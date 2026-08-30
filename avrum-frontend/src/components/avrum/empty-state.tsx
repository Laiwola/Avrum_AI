import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon, title, description, action, secondaryAction, className, tone = "default",
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
  tone?: "default" | "ai" | "info";
}) {
  const toneClass = {
    default: "bg-primary-soft text-primary",
    ai: "bg-emerald-soft text-emerald",
    info: "bg-sky-soft text-sky",
  }[tone];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-card/60 px-6 py-14 text-center",
        className,
      )}
    >
      <span className={cn("grid size-14 place-items-center rounded-2xl", toneClass)}>
        <Icon className="size-7" />
      </span>
      <h3 className="mt-5 text-section-title">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
