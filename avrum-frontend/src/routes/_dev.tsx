import { createFileRoute, Outlet } from "@tanstack/react-router";

import { DeveloperShell } from "@/components/developer/developer-shell";

export const Route = createFileRoute("/_dev")({
  component: DeveloperLayout,
});

function DeveloperLayout() {
  return (
    <DeveloperShell>
      <Outlet />
    </DeveloperShell>
  );
}
