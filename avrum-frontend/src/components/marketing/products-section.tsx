import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Bug, FlaskConical, Satellite, SprayCan, Stethoscope } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Badge } from "@/components/ui/badge";

type Product = {
  icon: LucideIcon;
  name: string;
  tagline: string;
  points: string[];
  to: "/crop-doctor" | "/disease-intelligence" | "/spray-recommendation" | "/satellite-monitoring" | "/soil-intelligence";
  tone: string;
  accent: string;
};

const products: Product[] = [
  {
    icon: Stethoscope,
    name: "AI Crop Doctor",
    tagline: "Photo in, diagnosis out",
    points: ["48 crop diseases", "Severity scoring", "Treatment plan"],
    to: "/crop-doctor",
    tone: "bg-emerald-soft text-emerald",
    accent: "group-hover:border-emerald/40",
  },
  {
    icon: Bug,
    name: "Disease Intelligence",
    tagline: "Regional outbreak radar",
    points: ["Live outbreak map", "Spread forecasts", "Disease library"],
    to: "/disease-intelligence",
    tone: "bg-destructive-soft text-destructive",
    accent: "group-hover:border-destructive/40",
  },
  {
    icon: SprayCan,
    name: "Spray Recommendation",
    tagline: "The right chemical, the right hour",
    points: ["Weather-gated windows", "Dosage calculator", "Re-entry safety"],
    to: "/spray-recommendation",
    tone: "bg-warning-soft text-warning-foreground",
    accent: "group-hover:border-warning/40",
  },
  {
    icon: Satellite,
    name: "Satellite Monitoring",
    tagline: "Every field, every pass",
    points: ["NDVI & moisture", "Stress detection", "Change alerts"],
    to: "/satellite-monitoring",
    tone: "bg-sky-soft text-sky",
    accent: "group-hover:border-sky/40",
  },
  {
    icon: FlaskConical,
    name: "Soil Intelligence",
    tagline: "Nutrients, mapped and modelled",
    points: ["NPK & pH mapping", "Fertiliser plans", "Carbon baseline"],
    to: "/soil-intelligence",
    tone: "bg-primary-soft text-primary",
    accent: "group-hover:border-primary/40",
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
              A full agronomy stack, <span className="text-gradient-brand">not a single model</span>
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
                <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
              </div>

              <ul className="mt-5 space-y-2">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-xs font-semibold">
                    <span className="size-1.5 rounded-full bg-gradient-brand" />
                    <span className="text-muted-foreground">{pt}</span>
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
      </div>
    </section>
  );
}
