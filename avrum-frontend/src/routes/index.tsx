import { createFileRoute } from "@tanstack/react-router";

import {
  Faq,
  FeaturesGrid,
  Hero,
  HowItWorks,
  Newsletter,
  ProductsSection,
  SiteFooter,
  SiteHeader,
  Stats,
  Testimonials,
  TrustedBy,
} from "@/components/marketing";
import { Toaster } from "@/components/ui/sonner";

const TITLE = "AVRUM AI — AI-Powered Agricultural Intelligence";
const DESCRIPTION =
  "AVRUM AI turns crop photos, satellite passes and soil data into timed field decisions: disease diagnosis, spray windows, yield risk and soil plans in one platform.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <TrustedBy />
        <FeaturesGrid />
        <ProductsSection />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <Faq />
        <Newsletter />
      </main>
      <SiteFooter />
      <Toaster position="top-right" />
    </div>
  );
}
