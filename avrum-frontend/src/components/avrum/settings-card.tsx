import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Tone = "default" | "ai" | "info" | "warning" | "danger";

const toneClass: Record<Tone, string> = {
  default: "bg-primary-soft text-primary",
  ai: "bg-emerald-soft text-emerald",
  info: "bg-sky-soft text-sky",
  warning: "bg-warning-soft text-warning-foreground",
  danger: "bg-destructive-soft text-destructive",
};

/**
 * Reusable settings container. Used across every profile / account screen so
 * headers, spacing and footers stay identical everywhere.
 */
export function SettingsCard({
  title, description, icon: Icon, tone = "default", badge, footer, children, className, contentClassName,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  tone?: Tone;
  badge?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex-row items-start gap-3 space-y-0">
        {Icon && (
          <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", toneClass[tone])}>
            <Icon className="size-5" />
          </span>
        )}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>{title}</CardTitle>
            {badge}
          </div>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent className={cn(contentClassName)}>{children}</CardContent>
      {footer && (
        <CardFooter className="flex-wrap justify-end gap-2 border-t border-border bg-surface/60 p-5 sm:p-6">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

/** A labelled row with a control on the right — the standard settings line item. */
export function SettingsRow({
  title, description, control, icon: Icon, className,
}: {
  title: string;
  description?: string;
  control?: ReactNode;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {Icon && <Icon className="mt-0.5 size-4.5 shrink-0 text-muted-foreground" />}
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {control && <div className="flex shrink-0 items-center gap-2">{control}</div>}
    </div>
  );
}

/** Vertical stack of SettingsRow items with hairline dividers. */
export function SettingsRowGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("divide-y divide-border", className)}>{children}</div>;
}

/** Label + control + optional hint, used inside settings forms. */
export function SettingsField({
  label, hint, htmlFor, children, className,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
      >
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
