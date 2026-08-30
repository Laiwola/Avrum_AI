import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Sparkles } from "lucide-react";

import onboardingPanel from "@/assets/onboarding-panel.jpg";
import { Logo } from "@/components/layout/logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OnboardingStepMeta } from "./onboarding-progress";

/** Split wizard layout: brand/illustration rail + scrollable step column. */
export function OnboardingShell({
  steps,
  current,
  children,
  className,
}: {
  steps: OnboardingStepMeta[];
  current: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="grid min-h-svh bg-background lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <aside className="relative hidden overflow-hidden bg-gradient-ink lg:flex lg:flex-col lg:justify-between lg:p-10">
        <img
          src={onboardingPanel}
          alt="Isometric illustration of farm plots monitored by satellite"
          width={1024}
          height={1536}
          loading="lazy"
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-80"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand/95 via-brand/55 to-brand/25" />

        <div className="relative">
          <Link to="/" className="focus-ring inline-flex rounded-xl">
            <Logo tone="sidebar" />
          </Link>
        </div>

        <div className="relative space-y-6">
          <Badge variant="ai" size="sm">
            <Sparkles /> Farm setup
          </Badge>
          <h2 className="max-w-sm text-display text-sidebar-foreground">
            A few details and your fields go live.
          </h2>

          <ol className="space-y-2.5">
            {steps.map((step, index) => {
              const done = index < current;
              const active = index === current;
              return (
                <li
                  key={step.id}
                  className={cn(
                    "flex items-center gap-2.5 text-sm transition-colors",
                    active
                      ? "font-semibold text-sidebar-foreground"
                      : done
                        ? "text-sidebar-foreground/75"
                        : "text-sidebar-foreground/45",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-full text-2xs font-bold ring-1 transition-colors",
                      done
                        ? "bg-emerald text-emerald-foreground ring-transparent"
                        : active
                          ? "bg-sidebar-accent text-sidebar-foreground ring-sidebar-border"
                          : "text-sidebar-foreground/50 ring-sidebar-border",
                    )}
                  >
                    {done ? <CheckCircle2 className="size-3.5" /> : index + 1}
                  </span>
                  {step.label}
                </li>
              );
            })}
          </ol>
        </div>

        <p className="relative text-2xs font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/50">
          You can change every answer later in settings
        </p>
      </aside>

      <main className={cn("flex flex-col px-4 py-6 sm:px-8 lg:px-12 lg:py-10", className)}>
        <div className="flex items-center justify-between gap-4 lg:hidden">
          <Link to="/" className="focus-ring rounded-xl">
            <Logo />
          </Link>
          <Link
            to="/dashboard"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Skip for now
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col py-6 lg:py-2">{children}</div>
      </main>
    </div>
  );
}
