import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton,
  SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/layout/logo";
import { navGroups, type NavItem } from "@/lib/nav";
import { WorkspaceSwitcher } from "@/components/developer/workspace-switcher";

/** Presentation-only role flag — replaced by real auth later. */
const IS_ADMIN = true;

export function AppSidebar() {
  const { state, isMobile } = useSidebar();
  const collapsed = state === "collapsed" && !isMobile;
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string) => pathname.startsWith(to);

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="gap-3 border-b border-sidebar-border px-3 py-3">
        <Link to="/dashboard" className="flex h-9 items-center">
          <Logo showWordmark={!collapsed} tone="sidebar" />
        </Link>
        <WorkspaceSwitcher collapsed={collapsed} />
      </SidebarHeader>

      <SidebarContent className="gap-0 px-2 py-2">
        {navGroups.map((group) => {
          const items = group.items.filter((i) => !i.adminOnly || IS_ADMIN);
          if (!items.length) return null;
          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel className="text-2xs font-bold uppercase tracking-[0.12em] text-sidebar-foreground/50">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <NavRow key={item.label} item={item} active={isActive(item.to)} collapsed={collapsed} pathname={pathname} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed ? (
          <div className="rounded-xl bg-sidebar-accent p-3">
            <p className="text-xs font-bold text-sidebar-accent-foreground">Season 2026 · Wet</p>
            <p className="mt-1 text-2xs text-sidebar-foreground/60">
              Advisory engine active across 4 regions.
            </p>
          </div>
        ) : (
          <Badge variant="ai" size="sm" className="mx-auto">AI</Badge>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function NavRow({
  item, active, collapsed, pathname,
}: { item: NavItem; active: boolean; collapsed: boolean; pathname: string }) {
  const hasChildren = !!item.children?.length;
  const [open, setOpen] = React.useState(active);

  React.useEffect(() => {
    if (active) setOpen(true);
  }, [active]);

  if (!hasChildren || collapsed) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
          <Link to={item.to}>
            <item.icon className="size-4.5" />
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
        {item.badge && !collapsed && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton isActive={active} tooltip={item.label}>
            <item.icon className="size-4.5" />
            <span>{item.label}</span>
            <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children!.map((child) => (
              <SidebarMenuSubItem key={child.to}>
                <SidebarMenuSubButton asChild isActive={pathname === child.to}>
                  <Link to={child.to}>{child.label}</Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
