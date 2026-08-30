import { Link, useRouterState } from "@tanstack/react-router";
import { Check, ChevronsUpDown, Code2, Sprout } from "lucide-react";

import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const workspaces = [
  {
    id: "farmer" as const,
    name: "Farmer Workspace",
    description: "Farms, advisories and field intelligence",
    to: "/dashboard",
    icon: Sprout,
  },
  {
    id: "developer" as const,
    name: "Developer Workspace",
    description: "APIs, keys, usage and logs",
    to: "/developer",
    icon: Code2,
  },
];

export function WorkspaceSwitcher({
  tone = "sidebar",
  collapsed = false,
  className,
}: {
  tone?: "sidebar" | "surface";
  collapsed?: boolean;
  className?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeId = pathname.startsWith("/developer") ? "developer" : "farmer";
  const active = workspaces.find((w) => w.id === activeId)!;
  const ActiveIcon = active.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Switch workspace"
          className={cn(
            "focus-ring flex w-full items-center gap-2.5 rounded-xl border p-2 text-left transition-colors",
            tone === "sidebar"
              ? "border-sidebar-border bg-sidebar-accent/60 text-sidebar-foreground hover:bg-sidebar-accent"
              : "border-border bg-card text-foreground hover:bg-muted",
            collapsed && "justify-center",
            className,
          )}
        >
          <span
            className={cn(
              "grid size-7 shrink-0 place-items-center rounded-lg",
              activeId === "developer"
                ? "bg-linear-to-br from-sky to-emerald text-primary-foreground"
                : "bg-linear-to-br from-primary to-emerald text-primary-foreground",
            )}
          >
            <ActiveIcon className="size-4" />
          </span>
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block text-2xs font-bold uppercase tracking-[0.12em]",
                    tone === "sidebar" ? "text-sidebar-foreground/55" : "text-muted-foreground",
                  )}
                >
                  Workspace
                </span>
                <span className="block truncate text-sm font-bold">{active.name}</span>
              </span>
              <ChevronsUpDown className="size-4 shrink-0 opacity-60" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Switch workspace</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.map((w) => (
          <DropdownMenuItem key={w.id} asChild className="gap-2.5 py-2">
            <Link to={w.to}>
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-foreground">
                <w.icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{w.name}</span>
                <span className="block truncate text-2xs text-muted-foreground">{w.description}</span>
              </span>
              {w.id === activeId && <Check className="size-4 text-emerald" />}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
