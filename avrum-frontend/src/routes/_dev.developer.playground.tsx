import { createFileRoute } from "@tanstack/react-router";
import { Play, TerminalSquare } from "lucide-react";

import { PageShell, PageHeader, Section } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { EndpointBadge, DevEmptyState } from "@/components/developer";
import { apiProducts } from "@/lib/developer";

const defaultProduct = apiProducts[0]!;

export const Route = createFileRoute("/_dev/developer/playground")({
  head: () => ({
    meta: [
      { title: "API Playground — AVRUM Intelligence" },
      { name: "description", content: "Compose and test requests against Avrum's agricultural intelligence APIs before writing a line of code." },
      { property: "og:title", content: "API Playground — AVRUM Intelligence" },
      { property: "og:description", content: "Compose and test Avrum agricultural API requests interactively." },
    ],
  }),
  component: PlaygroundPage,
});

function PlaygroundPage() {
  return (
    <PageShell>
      <PageHeader
        title="API Playground"
        subtitle="Compose a request, pick an environment and inspect the response — no code required."
        crumbs={[{ label: "Developer" }, { label: "API Playground" }]}
        eyebrow={<Badge variant="ai" size="sm">Beta</Badge>}
        actions={<Button variant="ai" disabled><Play /> Send request</Button>}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Section title="Request">
          <Card className="space-y-4 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>API product</Label>
                <Select defaultValue={defaultProduct.slug}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {apiProducts.map((p) => (
                      <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Environment</Label>
                <Select defaultValue="sandbox">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox">Sandbox</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Endpoint</Label>
              <EndpointBadge
                method={defaultProduct.endpoint.method}
                path={defaultProduct.endpoint.path}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pg-body">Request body</Label>
              <Textarea
                id="pg-body"
                rows={10}
                className="font-mono text-xs"
                defaultValue={`{
  "latitude": 9.0765,
  "longitude": 7.3986,
  "crop": "maize",
  "season": "2026-wet"
}`}
              />
            </div>
          </Card>
        </Section>

        <Section title="Response">
          <DevEmptyState
            icon={TerminalSquare}
            title="No response yet"
            description="Live execution is not connected in this phase. Once enabled, responses, headers and latency will appear here."
          />
        </Section>
      </div>
    </PageShell>
  );
}
