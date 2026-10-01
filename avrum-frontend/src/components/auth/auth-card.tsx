import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Centered card used by every auth screen. */
export function AuthCard({
  title,
  description,
  icon: Icon,
  eyebrow,
  children,
  footer,
  className,
}: {
  title: string;
  description?: ReactNode;
  icon?: LucideIcon;
  eyebrow?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full max-w-md", className)}>
      <div className="surface-panel p-6 sm:p-8">
        <div className="space-y-3">
          {Icon && (
            <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
              <Icon className="size-5" />
            </span>
          )}
          {eyebrow}
          <div className="space-y-1.5">
            <h1 className="text-page-title text-foreground">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>

        {children && <div className="mt-6">{children}</div>}
      </div>

      {footer && <div className="mt-5 text-center text-sm text-muted-foreground">{footer}</div>}
    </div>
  );
}
