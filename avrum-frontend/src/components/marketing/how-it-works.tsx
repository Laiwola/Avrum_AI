import { Camera, Cpu, Send, Sprout } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";

type Step = { icon: LucideIcon; step: string; title: string; description: string };

const steps: Step[] = [
  {
    icon: Camera,
    step: "01",
    title: "Capture the field",
    description:
      "Snap a leaf, draw a boundary or sync a sensor. Uploads queue offline and send when signal returns.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "Models fuse the signals",
    description:
      "Vision, satellite indices, weather and soil chemistry run together — not as isolated scores.",
  },
  {
    icon: Send,
    step: "03",
    title: "Get a timed advisory",
    description:
      "One clear action with dosage, window and cost — delivered in-app, by SMS or WhatsApp.",
  },
  {
    icon: Sprout,
    step: "04",
    title: "Track the outcome",
    description:
      "Yield and recovery feed back into the model, so next season's advice is measurably better.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-block">
      <div className="marketing-container">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              Four steps from photo to <span className="text-gradient-brand">field action</span>
            </>
          }
          description="Designed for an agronomist with 400 farmers — and a smallholder with one phone."
        />

        <ol className="relative mt-14 grid gap-4 lg:grid-cols-4">
          <span
            aria-hidden
            className="absolute left-0 right-0 top-[2.6rem] hidden h-px bg-gradient-brand opacity-30 lg:block"
          />
          {steps.map((s) => (
            <li key={s.step} className="relative">
              <div className="flex flex-col">
                <span className="relative grid size-14 place-items-center rounded-2xl border border-border bg-card shadow-sm">
                  <s.icon className="size-6 text-emerald" />
                  <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-gradient-brand text-2xs font-bold text-primary-foreground">
                    {s.step}
                  </span>
                </span>
                <h3 className="mt-5 text-section-title">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
