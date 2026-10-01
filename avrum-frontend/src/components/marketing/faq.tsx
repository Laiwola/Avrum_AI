import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/marketing/section-heading";

const faqs = [
  {
    q: "Which crops and diseases are supported today?",
    a: "Maize, rice, cassava, tomato, cocoa, wheat and soybean, covering 48 diseases and major nutrient deficiencies. New crops are added each quarter from partner-labelled field data.",
  },
  {
    q: "Does it work without reliable internet?",
    a: "Yes. Photos and field notes are captured offline and queued; diagnosis runs as soon as any signal returns. Advisories are cached on device and can also be delivered by SMS or WhatsApp.",
  },
  {
    q: "How accurate is the AI, and who checks it?",
    a: "Diagnosis holds 94% top-1 accuracy on held-out field sets. Every high-severity advisory is reviewed by a certified agronomist before it reaches a farmer, and model confidence is always shown.",
  },
  {
    q: "Where does the satellite and weather data come from?",
    a: "Sentinel-2 and Landsat imagery for vegetation and moisture indices, combined with high-resolution regional weather forecasts. Field boundaries you draw are matched to tiles automatically.",
  },
  {
    q: "Who owns the farm data?",
    a: "The farmer or cooperative does. Data is stored per-tenant, never sold, and used to improve models only in aggregated, de-identified form — with an opt-out.",
  },
  {
    q: "Can it integrate with our existing systems?",
    a: "Yes. There is a REST API and webhook layer for diagnoses, advisories and field records, plus CSV export for cooperatives and funds running their own reporting.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="section-block bg-surface/60">
      <div className="marketing-container">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title={
              <>
                Questions from <span className="text-gradient-brand">the field</span>
              </>
            }
            description="Everything agronomy teams ask before rolling AVRUM AI out to a region."
          />

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-sm font-bold sm:text-base">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
