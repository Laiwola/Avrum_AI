import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AuthShell } from "@/components/auth";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <ThemeProvider>
      <AuthShell>
        {/* Required: nested auth routes render here. */}
        <Outlet />
      </AuthShell>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}
