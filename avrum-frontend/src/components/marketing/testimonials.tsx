import { Quote, Star } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    quote:
      "We used to lose two weeks confirming an outbreak. AVRUM flagged cassava mosaic across four cooperatives in a single afternoon, and the spray window it gave us actually held.",
    name: "Dr. Ngozi Eze",
    role: "Head of Agronomy, Sahel Grain Collective",
    initials: "NE",
    metric: "31% fewer crop losses",
  },
  {
    quote:
      "The advisories arrive in Hausa as a voice note. That single detail is why 900 of our farmers actually use it — no training required.",
    name: "Ibrahim Suleiman",
    role: "Extension Lead, Kaduna Farmer Union",
    initials: "IS",
    metric: "900 active farmers",
  },
  {
    quote:
      "It behaves like a real data platform, not a demo. Satellite indices, soil chemistry and diagnosis history line up per field — our fund finally has defensible numbers.",
    name: "Amara Boateng",
    role: "Portfolio Director, GreenDelta Capital",
    initials: "AB",
    metric: "12 portfolio estates",
  },
];

export function Testimonials() {
  return (
    <section className="section-block">
      <div className="marketing-container">
        <SectionHeading
          eyebrow="Field-tested"
          title={
            <>
              Trusted where the stakes are{" "}
              <span className="text-gradient-brand">a whole season</span>
            </>
          }
          description="Agronomists, cooperatives and agri-funds using AVRUM AI in production today."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="card-premium flex flex-col p-6">
              <div className="flex items-center justify-between">
                <Quote className="size-6 text-emerald/40" />
                <span className="flex items-center gap-0.5" aria-label="5 out of 5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-warning text-warning" />
                  ))}
                </span>
              </div>

              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                {t.quote}
              </blockquote>

              <p className="mt-5 w-fit rounded-lg bg-emerald-soft/60 px-2.5 py-1 text-2xs font-bold uppercase tracking-wider text-emerald">
                {t.metric}
              </p>

              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-5">
                <Avatar className="size-9 border border-border">
                  <AvatarFallback className="bg-primary-soft text-2xs font-bold text-primary">
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{t.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
