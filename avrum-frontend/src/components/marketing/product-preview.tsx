import {
  Activity,
  Droplets,
  Leaf,
  Satellite,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

/**
 * In-product preview rendered with real design-system tokens instead of a
 * screenshot, so it stays accurate as the platform evolves.
 */
export function ProductPreview() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-x-8 -top-6 bottom-8 rounded-[2.5rem] bg-gradient-brand opacity-15 blur-3xl"
      />

      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-premium">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-3">
          <span className="size-2.5 rounded-full bg-destructive/60" />
          <span className="size-2.5 rounded-full bg-warning/70" />
          <span className="size-2.5 rounded-full bg-success/70" />
          <span className="ml-3 truncate rounded-md bg-card px-2.5 py-1 text-2xs font-semibold text-muted-foreground">
            app.avrum.ai/dashboard
          </span>
          <Badge variant="ai" size="sm" className="ml-auto hidden sm:inline-flex">
            <Sparkles /> Live inference
          </Badge>
        </div>

        <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Fields", value: "1,284", icon: Leaf, tone: "bg-primary-soft text-primary" },
                { label: "Health", value: "92", icon: Activity, tone: "bg-emerald-soft text-emerald" },
                { label: "Passes", value: "36", icon: Satellite, tone: "bg-sky-soft text-sky" },
                { label: "Spray", value: "8", icon: Droplets, tone: "bg-warning-soft text-warning-foreground" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-background p-3">
                  <span className={`grid size-7 place-items-center rounded-lg ${s.tone}`}>
                    <s.icon className="size-3.5" />
                  </span>
                  <p className="mt-2 font-display text-lg font-bold tabular-nums">{s.value}</p>
                  <p className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* NDVI-style band chart */}
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold">Canopy vigour · NDVI</p>
                <Badge variant="success" size="sm">
                  <TrendingUp /> +6.4%
                </Badge>
              </div>
              <div className="mt-4 flex h-28 items-end gap-1.5">
                {[38, 44, 41, 52, 58, 55, 64, 71, 68, 77, 82, 79, 88, 92].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}%`, animationDelay: `${i * 45}ms` }}
                    className="animate-rise flex-1 rounded-t-sm bg-gradient-brand opacity-90"
                  />
                ))}
              </div>
            </div>

            {/* advisory queue */}
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold">Today's advisories</p>
                <Badge variant="muted" size="sm">
                  4 open
                </Badge>
              </div>
              <ul className="mt-3 divide-y divide-border">
                {[
                  { field: "Block 04 · Maize", action: "Spray fungicide", when: "In 18h", tone: "danger" as const, level: "High" },
                  { field: "Block 11 · Rice", action: "Nitrogen top-up", when: "Thu", tone: "warning" as const, level: "Medium" },
                  { field: "Block 02 · Cassava", action: "Scout for mosaic", when: "Fri", tone: "info" as const, level: "Watch" },
                  { field: "Block 07 · Tomato", action: "Irrigation hold", when: "Sat", tone: "success" as const, level: "Low" },
                ].map((a) => (
                  <li key={a.field} className="flex items-center gap-3 py-2.5">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-bold">{a.action}</span>
                      <span className="block truncate text-2xs text-muted-foreground">
                        {a.field}
                      </span>
                    </span>
                    <Badge variant={a.tone} size="sm">
                      {a.level}
                    </Badge>
                    <span className="w-12 shrink-0 text-right text-2xs font-semibold tabular-nums text-muted-foreground">
                      {a.when}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>


          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl border border-sky/30 bg-sky-soft/50 p-4">
              <div aria-hidden className="field-grid absolute inset-0 opacity-70" />
              <div
                aria-hidden
                className="animate-sweep absolute inset-y-0 w-1/3 bg-gradient-sheen opacity-60"
              />
              <div className="relative">
                <p className="text-overline text-sky">Satellite tile · S2-L2A</p>
                <p className="mt-1 text-sm font-bold">Kaduna · Block 04</p>
                <div className="mt-4 grid grid-cols-4 gap-1">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <span
                      key={i}
                      className="aspect-square rounded-sm bg-emerald"
                      style={{ opacity: 0.25 + ((i * 37) % 10) / 13 }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-emerald/30 bg-card p-4">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-lg bg-gradient-brand">
                  <Sparkles className="size-3.5 text-primary-foreground" />
                </span>
                <p className="text-xs font-bold">Diagnosis complete</p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Maize leaf blight detected on 3 of 12 sampled plots. Fungicide window opens in 18
                hours.
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                <span className="block h-full w-[94%] rounded-full bg-gradient-brand" />
              </div>
              <p className="mt-1.5 text-2xs font-semibold text-muted-foreground">
                94% model confidence
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 p-3">
              <ShieldCheck className="size-4 shrink-0 text-emerald" />
              <p className="text-2xs font-semibold text-muted-foreground">
                Agronomist-reviewed advisories
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
