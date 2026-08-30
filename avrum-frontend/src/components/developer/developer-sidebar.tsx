import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Code2 } from "lucide-react";

import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton,
  SidebarMenuItem, SidebarRail, useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/layout/logo";
import { WorkspaceSwitcher } from "@/components/developer/workspace-switcher";
import { developerNavGroups } from "@/lib/developer";

export function DeveloperSidebar() {
  const { state, isMobile } = useSidebar();
  const collapsed = state === "collapsed" && !isMobile;
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string) =>
    to === "/developer" ? pathname === "/developer" : pathname.startsWith(to);

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="gap-3 border-b border-sidebar-border px-3 py-3">
        <Link to="/developer" className="flex h-9 items-center">
          <Logo showWordmark={!collapsed} tone="sidebar" />
        </Link>
        <WorkspaceSwitcher collapsed={collapsed} />
      </SidebarHeader>

      <SidebarContent className="gap-0 px-2 py-2">
        {developerNavGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-2xs font-bold uppercase tracking-[0.12em] text-sidebar-foreground/50">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={isActive(item.to)} tooltip={item.label}>
                      <Link to={item.to}>
                        <item.icon className="size-4.5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.badge && !collapsed && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed ? (
          <div className="rounded-xl bg-sidebar-accent p-3">
            <p className="flex items-center gap-1.5 text-xs font-bold text-sidebar-accent-foreground">
              <Code2 className="size-3.5" /> Sandbox environment
            </p>
            <p className="mt-1 text-2xs text-sidebar-foreground/60">
              1,000 requests/day. Request production access from Settings.
            </p>
            <Link
              to="/developer/docs"
              className="mt-2 inline-flex items-center gap-1.5 text-2xs font-bold text-sidebar-primary-foreground/90 underline-offset-4 hover:underline"
            >
              <BookOpen className="size-3.5" /> API reference
            </Link>
          </div>
        ) : (
          <Badge variant="ai" size="sm" className="mx-auto">API</Badge>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
