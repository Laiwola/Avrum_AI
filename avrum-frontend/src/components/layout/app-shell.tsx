import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="flex min-h-svh w-full bg-background">
          <AppSidebar />
          <SidebarInset className="min-w-0 bg-background">
            <TopNav />
            <main className="min-w-0 flex-1 pb-20 md:pb-0">{children}</main>
            <MobileBottomNav />
          </SidebarInset>
        </div>
        <Toaster position="top-right" />
      </SidebarProvider>
    </ThemeProvider>
  );
}
