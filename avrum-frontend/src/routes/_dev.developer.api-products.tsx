import { createFileRoute } from "@tanstack/react-router";
import { Boxes } from "lucide-react";

import { PageShell, PageHeader, Section } from "@/components/avrum";
import { Badge } from "@/components/ui/badge";
import { APIProductCard } from "@/components/developer";
import { apiProducts } from "@/lib/developer";

export const Route = createFileRoute("/_dev/developer/api-products")({
  head: () => ({
    meta: [
      { title: "API Products — AVRUM Intelligence" },
      { name: "description", content: "Explore Avrum's agricultural API catalogue: crop, disease, AI, satellite, soil and spray intelligence endpoints." },
      { property: "og:title", content: "API Products — AVRUM Intelligence" },
      { property: "og:description", content: "The Avrum agricultural intelligence API catalogue." },
    ],
  }),
  component: ApiProductsPage,
});

function ApiProductsPage() {
  return (
    <PageShell>
      <PageHeader
        title="API Products"
        subtitle="Six composable agricultural intelligence products, one authentication model and a shared usage ledger."
        crumbs={[{ label: "Developer" }, { label: "API Products" }]}
        eyebrow={<Badge variant="info" size="sm"><Boxes /> {apiProducts.length} products</Badge>}
      />

      <Section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {apiProducts.map((p) => (
            <div key={p.slug} id={p.slug} className="scroll-mt-24">
              <APIProductCard product={p} />
            </div>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
