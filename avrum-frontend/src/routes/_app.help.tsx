import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy, MessageCircle } from "lucide-react";

import { PageShell, PageHeader, Section, EmptyState } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/avrum";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/_app/help")({
  head: () => ({
    meta: [
      { title: "Help Center — AVRUM AI" },
      { name: "description", content: "Find guides, FAQs and support contacts for the AVRUM AI platform." },
      { property: "og:title", content: "Help Center — AVRUM AI" },
      { property: "og:description", content: "Find guides, FAQs and support contacts for the AVRUM AI platform." },
    ],
  }),
  component: HelpCenterPage,
});

function HelpCenterPage() {
  return (
    <PageShell>
      <PageHeader
        title="Help Center"
        subtitle="Guides, answers and direct support for getting the most out of AVRUM AI."
        crumbs={[{ label: "Dashboard", to: "/" }, { label: "Help Center" }]}
        actions={
          <Button variant="ai"><MessageCircle /> Contact support</Button>
        }
      />
      <Section title="Frequently asked" actions={<SearchBox placeholder="Search help articles…" className="sm:w-72" />}>
        <Accordion type="single" collapsible className="surface-panel px-4">
          <AccordionItem value="a">
            <AccordionTrigger>How accurate is AI Crop Doctor?</AccordionTrigger>
            <AccordionContent>
              Every diagnosis returns a confidence score. Low-confidence results are routed for agronomist review before any treatment is recommended.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Does AVRUM AI work offline?</AccordionTrigger>
            <AccordionContent>
              Core advisories are designed for low-bandwidth use and cache locally, so you can review guidance in the field without a stable connection.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="c">
            <AccordionTrigger>Which crops are supported?</AccordionTrigger>
            <AccordionContent>
              Coverage begins with maize, cassava, rice, tomato and cocoa, and expands as regional datasets are validated.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>
      <Section title="Still need help?">
        <EmptyState
          icon={LifeBuoy}
          title="Talk to an agronomist"
          description="Support is available in English, French, Hausa and Kiswahili during planting and harvest seasons."
          action={<Button variant="ai"><MessageCircle /> Contact support</Button>}
        />
      </Section>
    </PageShell>
  );
}
