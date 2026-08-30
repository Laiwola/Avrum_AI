import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Consistent page container + vertical rhythm for every screen. */
export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("page-container space-y-6 lg:space-y-8", className)}>{children}</div>
  );
}

export function Section({
  title, description, actions, children, className,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || actions) && (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
          <div className="min-w-0">
            {title && <h2 className="text-section-title">{title}</h2>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
