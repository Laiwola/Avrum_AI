import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Users } from "lucide-react";

import { PageShell, PageHeader, Section, EmptyState } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/_app/admin")({
  head: () => ({
    meta: [
      { title: "Admin — AVRUM AI" },
      { name: "description", content: "Platform operations console for users, model versions, regions and data quality." },
      { property: "og:title", content: "Admin — AVRUM AI" },
      { property: "og:description", content: "Platform operations console for users, model versions, regions and data quality." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <PageShell>
      <PageHeader
        title="Admin"
        subtitle="Platform operations: users, model versions, regions and data quality."
        crumbs={[{ label: "Dashboard", to: "/" }, { label: "Admin" }]}
        actions={
          <Button variant="ai"><Users /> Invite user</Button>
        }
      />
      <Alert>
        <ShieldCheck className="size-4" />
        <AlertTitle>Restricted area</AlertTitle>
        <AlertDescription>
          This console is visible to platform administrators only. Access is enforced server-side once authentication is connected.
        </AlertDescription>
      </Alert>
      <Section title="Operations">
        <EmptyState
          icon={ShieldCheck}
          title="Admin tooling not configured"
          description="User management, model rollout controls and data-quality dashboards will live here."
          action={<Button variant="ai"><Users /> Invite user</Button>}
        />
      </Section>
    </PageShell>
  );
}
