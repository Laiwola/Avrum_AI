import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Satellite, ShieldCheck, Sparkles } from "lucide-react";

import authPanel from "@/assets/auth-panel.jpg";
import { Logo } from "@/components/layout/logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const highlights = [
  { icon: Sparkles, label: "AI crop diagnosis", copy: "Photo to disease verdict in seconds." },
  { icon: Satellite, label: "Satellite monitoring", copy: "Field-level vigour on every pass." },
  { icon: ShieldCheck, label: "Advisory you can act on", copy: "Timed spray and soil decisions." },
];

/** Split auth layout: illustration panel + centered card column. */
export function AuthShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="grid min-h-svh bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <aside className="relative hidden overflow-hidden bg-gradient-ink lg:flex lg:flex-col lg:justify-between lg:p-10">
        <img
          src={authPanel}
          alt="Aerial illustration of monitored crop fields with satellite scan lines"
          width={1024}
          height={1536}
          loading="lazy"
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-90"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand/90 via-brand/45 to-transparent" />

        <div className="relative">
          <Link to="/" className="focus-ring inline-flex rounded-xl">
            <Logo tone="sidebar" />
          </Link>
        </div>

        <div className="relative space-y-8">
          <div className="space-y-3">
            <Badge variant="ai" size="sm">
              <Sparkles /> Agri intelligence platform
            </Badge>
            <h2 className="max-w-md text-display text-sidebar-foreground">
              Every field decision, backed by evidence.
            </h2>
            <p className="max-w-md text-sm text-sidebar-foreground/70">
              Sign in to diagnose crops, track outbreak pressure and plan spray windows across every
              farm you manage.
            </p>
          </div>

          <ul className="space-y-4">
            {highlights.map(({ icon: Icon, label, copy }) => (
              <li key={label} className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sidebar-accent/70 text-emerald ring-1 ring-sidebar-border">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-sidebar-foreground">
                    {label}
                  </span>
                  <span className="block text-xs text-sidebar-foreground/65">{copy}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-2xs font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/50">
          Season 2026 · Advisory engine active across 4 regions
        </p>
      </aside>

      <main className={cn("flex flex-col px-4 py-8 sm:px-8 lg:px-12 lg:py-10", className)}>
        <div className="flex items-center justify-between gap-4 lg:hidden">
          <Link to="/" className="focus-ring rounded-xl">
            <Logo />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-8 lg:py-4">{children}</div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <Link
            to="/"
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> Back to avrum.ai
          </Link>
          <p className="text-xs text-muted-foreground">
            Need help?{" "}
            <Link to="/help" className="font-semibold text-primary hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
