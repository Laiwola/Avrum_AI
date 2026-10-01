import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { DeveloperSidebar } from "@/components/developer/developer-sidebar";
import { DeveloperHeader } from "@/components/developer/developer-header";
import { developerMobileNavItems } from "@/lib/developer";
import { cn } from "@/lib/utils";

export function DeveloperShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="flex min-h-svh w-full bg-background">
          <DeveloperSidebar />
          <SidebarInset className="min-w-0 bg-background">
            <DeveloperHeader />
            <main className="min-w-0 flex-1 pb-20 md:pb-0">{children}</main>
            <DeveloperBottomNav />
          </SidebarInset>
        </div>
        <Toaster position="top-right" />
      </SidebarProvider>
    </ThemeProvider>
  );
}

function DeveloperBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <ul className="grid grid-cols-5">
        {developerMobileNavItems.map((item) => {
          const active =
            item.to === "/developer" ? pathname === "/developer" : pathname.startsWith(item.to);
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-2xs font-semibold transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-lg transition-colors",
                    active && "bg-primary-soft",
                  )}
                >
                  <item.icon className="size-4.5" />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
