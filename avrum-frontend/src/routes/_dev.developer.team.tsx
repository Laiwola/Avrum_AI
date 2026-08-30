import { createFileRoute } from "@tanstack/react-router";
import { UserPlus, Users } from "lucide-react";

import { PageShell, PageHeader, Section, DataTable, type Column } from "@/components/avrum";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/_dev/developer/team")({
  head: () => ({
    meta: [
      { title: "Team — AVRUM Intelligence" },
      { name: "description", content: "Invite engineers, agronomists and operators to your Avrum developer organisation and manage their access." },
      { property: "og:title", content: "Team — AVRUM Intelligence" },
      { property: "og:description", content: "Manage members and roles in your Avrum developer organisation." },
    ],
  }),
  component: TeamPage,
});

type Member = { id: string; name: string; email: string; role: string; status: "Active" | "Invited" };

const members: Member[] = [
  { id: "1", name: "Adeola Daramola", email: "adeola@avrumlabs.io", role: "Owner", status: "Active" },
  { id: "2", name: "Ibrahim Sule", email: "ibrahim@avrumlabs.io", role: "Admin", status: "Active" },
  { id: "3", name: "Grace Mwangi", email: "grace@avrumlabs.io", role: "Developer", status: "Active" },
  { id: "4", name: "Tunde Bakare", email: "tunde@avrumlabs.io", role: "Billing", status: "Invited" },
];

const columns: Column<Member>[] = [
  {
    key: "name",
    header: "Member",
    cell: (r) => (
      <span className="flex items-center gap-3">
        <Avatar className="size-8 border border-border">
          <AvatarFallback className="bg-primary-soft text-2xs font-bold text-primary">
            {r.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <span className="min-w-0">
          <span className="block truncate font-semibold">{r.name}</span>
          <span className="block truncate text-xs text-muted-foreground">{r.email}</span>
        </span>
      </span>
    ),
  },
  { key: "role", header: "Role", cell: (r) => <Badge variant="muted" size="sm">{r.role}</Badge> },
  {
    key: "status",
    header: "Status",
    cell: (r) => <Badge variant={r.status === "Active" ? "success" : "warning"} size="sm">{r.status}</Badge>,
    align: "right",
  },
];

function TeamPage() {
  return (
    <PageShell>
      <PageHeader
        title="Team"
        subtitle="Control who can create keys, view logs and manage billing in your developer organisation."
        crumbs={[{ label: "Developer" }, { label: "Team" }]}
        eyebrow={<Badge variant="info" size="sm"><Users /> Avrum Labs</Badge>}
        actions={<Button variant="ai"><UserPlus /> Invite member</Button>}
      />

      <Section title="Members">
        <DataTable columns={columns} data={members} getRowKey={(r) => r.id} />
      </Section>
    </PageShell>
  );
}
