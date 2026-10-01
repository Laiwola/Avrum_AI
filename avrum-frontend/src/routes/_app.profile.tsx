import { createFileRoute, Outlet } from "@tanstack/react-router";

import { PageShell, PageHeader } from "@/components/avrum";
import { ProfileNav } from "@/components/profile";

export const Route = createFileRoute("/_app/profile")({
  component: ProfileLayout,
});

function ProfileLayout() {
  return (
    <PageShell>
      <PageHeader
        title="Profile & Account"
        subtitle="Manage your identity, security, preferences and everything tied to your AVRUM AI account."
        crumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Profile" }]}
      />
      <ProfileNav />
      {/* Required: nested profile routes render here. */}
      <Outlet />
    </PageShell>
  );
}
