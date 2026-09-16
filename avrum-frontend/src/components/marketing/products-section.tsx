import { Link } from "@tanstack/react-router";

import {
  ArrowUpRight,
  BellRing,
  Bug,
  CloudSun,
  FlaskConical,
  Languages,
  LineChart,
  Radar,
  Satellite,
  ShieldCheck,
  Smartphone,
  SprayCan,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";

import { Badge } from "@/components/ui/badge";

type Product = {
  icon: LucideIcon;
  name: string;
  tagline: string;
  points: string[];
  to:
    | "/crop-doctor"
    | "/disease-intelligence"
    | "/spray-recommendation"
    | "/satellite-monitoring"
    | "/soil-intelligence";
  tone: string;
  accent: string;
};

const products: Product[] = [
  {
    icon: Stethoscope,
    name: "AI Crop Doctor",
    tagline: "Photo in, diagnosis out",
    points: [
      "Disease detection",
      "Severity scoring",
      "Treatment guidance",
    ],
    to: "/crop-doctor",
    tone: "bg-emerald-soft text-emerald",
    accent: "group-hover:border-emerald/40",
  },
  {
    icon: Bug,
    name: "Disease Intelligence",
    tagline: "Regional outbreak radar",
    points: [
      "Outbreak mapping",
      "Spread forecasts",
      "Disease alerts",
    ],
    to: "/disease-intelligence",
    tone: "bg-destructive-soft text-destructive",
    accent: "group-hover:border-destructive/40",
  },
  {
    icon: SprayCan,
    name: "Spray Recommendation",
    tagline: "The right chemical, the right hour",
    points: [
      "Weather-based windows",
      "Dosage guidance",
      "Safety timing",
    ],
    to: "/spray-recommendation",
    tone: "bg-warning-soft text-warning-foreground",
    accent: "group-hover:border-warning/40",
  },
  {
    icon: Satellite,
    name: "Satellite Monitoring",
    tagline: "Every field, every pass",
    points: [
      "Crop health monitoring",
      "Stress detection",
      "Change alerts",
    ],
    to: "/satellite-monitoring",
    tone: "bg-sky-soft text-sky",
    accent: "group-hover:border-sky/40",
  },
  {
    icon: FlaskConical,
    name: "Soil Intelligence",
    tagline: "Nutrients, mapped and modelled",
    points: [
      "NPK & pH mapping",
      "Fertiliser planning",
      "Carbon baseline",
    ],
    to: "/soil-intelligence",
    tone: "bg-primary-soft text-primary",
    accent: "group-hover:border-primary/40",
  },
];

type PlatformFeature = {
  icon: LucideIcon;
  title: string;
};

const platformFeatures: PlatformFeature[] = [
  {
    icon: Sparkles,
    title: "AI built for African crops",
  },
  {
    icon: Radar,
    title: "Disease early warning",
  },
  {
    icon: CloudSun,
    title: "Weather-aware spray advice",
  },
  {
    icon: LineChart,
    title: "Yield & loss forecasting",
  },
  {
    icon: Languages,
    title: "Local-language advisories",
  },
  {
    icon: Smartphone,
    title: "Works on low bandwidth",
  },
  {
    icon: BellRing,
    title: "Action alerts",
  },
  {
    icon: ShieldCheck,
    title: "Agronomist verified",
  },
];

export function ProductsSection() {
  return (
    <section id="products" className="section-block bg-surface/60">
      <div className="marketing-container">
        <SectionHeading
          eyebrow="Five flagship products"
          title={
            <>
              A full agronomy stack,{" "}
              <span className="text-gradient-brand">
                not a single model
              </span>
            </>
          }
          description="Each product ships standalone and gets sharper when the others are switched on."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link
              key={p.name}
              to={p.to}
              className={`card-premium focus-ring group flex flex-col p-6 ${p.accent}`}
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`grid size-11 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${p.tone}`}
                  >
                    <p.icon className="size-5" />
                  </span>

                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>

                <h3 className="mt-5 text-section-title">{p.name}</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {p.tagline}
                </p>
              </div>

              <ul className="mt-5 space-y-2">
                {p.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2 text-xs font-semibold"
                  >
                    <span className="size-1.5 rounded-full bg-gradient-brand" />
                    <span className="text-muted-foreground">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>

              {p.name === "AI Crop Doctor" && (
                <Badge variant="ai" size="sm" className="mt-6 w-fit">
                  Most used
                </Badge>
              )}
            </Link>
          ))}
        </div>

        <div
          className="relative mt-8 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="flex w-max animate-marquee gap-3">
            {[...platformFeatures, ...platformFeatures].map(
              (feature, index) => (
                <div
                  key={`${feature.title}-${index}`}
                  aria-hidden={index >= platformFeatures.length}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  <feature.icon className="size-4 shrink-0 text-primary" />
                  <span className="whitespace-nowrap">
                    {feature.title}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}