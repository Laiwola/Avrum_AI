import {
  BellRing,
  CloudSun,
  Languages,
  LineChart,
  Radar,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Badge } from "@/components/ui/badge";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  tone: string;
  badge?: string;
  span?: boolean;
};

const features: Feature[] = [
  {
    icon: Sparkles,
    title: "Vision models tuned on African crops",
    description:
      "2.4M labelled leaf images across maize, cassava, rice, cocoa and tomato — diagnosis in under four seconds, offline-tolerant.",
    tone: "bg-emerald-soft text-emerald",
    badge: "Core AI",
    span: true,
  },
  {
    icon: Radar,
    title: "Outbreak early warning",
    description: "Regional disease pressure modelled from every diagnosis on the network.",
    tone: "bg-destructive-soft text-destructive",
  },
  {
    icon: CloudSun,
    title: "Weather-aware spray windows",
    description: "Rain, wind and humidity fused into a go / no-go window per field.",
    tone: "bg-warning-soft text-warning-foreground",
  },
  {
    icon: LineChart,
    title: "Yield & loss forecasting",
    description: "Season-long projections that update with every satellite pass.",
    tone: "bg-sky-soft text-sky",
  },
  {
    icon: Languages,
    title: "Advisories in local languages",
    description: "English, French, Hausa and Kiswahili — voice notes included.",
    tone: "bg-primary-soft text-primary",
  },
  {
    icon: Smartphone,
    title: "Built for low bandwidth",
    description: "Queued uploads and cached advisories keep working on 2G.",
    tone: "bg-emerald-soft text-emerald",
  },
  {
    icon: BellRing,
    title: "Action alerts, not dashboards",
    description: "Push, SMS and WhatsApp alerts the moment risk crosses threshold.",
    tone: "bg-sky-soft text-sky",
  },
  {
    icon: ShieldCheck,
    title: "Agronomist in the loop",
    description: "Certified reviewers validate every high-severity advisory before it ships.",
    tone: "bg-primary-soft text-primary",
    badge: "Verified",
  },
];

export function FeaturesGrid() {
  return (
    <section id="platform" className="section-block">
      <div className="marketing-container">
        <SectionHeading
          eyebrow="The platform"
          title={
            <>
              One intelligence layer for <span className="text-gradient-brand">every decision</span>
            </>
          }
          description="Field data comes in from phones, satellites and sensors. Decisions come out — ranked, explained and timed."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.title}
              className={`card-premium group p-6 ${f.span ? "lg:col-span-2" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${f.tone}`}
                >
                  <f.icon className="size-5" />
                </span>
                {f.badge && (
                  <Badge variant="muted" size="sm">
                    {f.badge}
                  </Badge>
                )}
              </div>
              <h3 className="mt-5 text-section-title">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
