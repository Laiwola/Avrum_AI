import { Activity, Globe2, Sprout, Timer } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Stat = { icon: LucideIcon; value: string; label: string; caption: string };

const stats: Stat[] = [
  { icon: Sprout, value: "1.2M", label: "Hectares monitored", caption: "Across 11 countries" },
  { icon: Activity, value: "94%", label: "Diagnostic accuracy", caption: "Validated on held-out sets" },
  { icon: Timer, value: "3.8s", label: "Median diagnosis time", caption: "From upload to advisory" },
  { icon: Globe2, value: "38%", label: "Avg. loss reduction", caption: "Reported by cooperatives" },
];

export function Stats() {
  return (
    <section id="impact" className="relative isolate overflow-hidden bg-gradient-ink">
      <div aria-hidden className="field-grid absolute inset-0 opacity-[0.12]" />
      <div
        aria-hidden
        className="animate-float-slow absolute -right-24 -top-16 size-80 rounded-full bg-emerald/25 blur-3xl"
      />

      <div className="marketing-container section-block relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-overline text-sidebar-foreground/60">Measured impact</p>
          <h2 className="mt-3 text-page-title text-sidebar-foreground lg:text-display">
            Intelligence that shows up in the harvest
          </h2>
        </div>

        <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-sidebar-border bg-sidebar-accent/40 p-6 backdrop-blur-sm transition-colors hover:bg-sidebar-accent/70"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-emerald/15">
                <s.icon className="size-5 text-emerald" />
              </span>
              <dd className="mt-5 text-metric text-sidebar-foreground">{s.value}</dd>
              <dt className="mt-1 text-sm font-bold text-sidebar-foreground">{s.label}</dt>
              <p className="mt-1 text-xs text-sidebar-foreground/60">{s.caption}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
