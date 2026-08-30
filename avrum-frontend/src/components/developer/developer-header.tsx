import { BookOpen, LogOut, Moon, Search, Settings2, Sun, User } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationMenu } from "@/components/layout/notification-menu";
import { Logo } from "@/components/layout/logo";
import { WorkspaceSwitcher } from "@/components/developer/workspace-switcher";
import { useTheme } from "@/components/theme/theme-provider";

export function DeveloperHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur-md">
      <div className="grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <SidebarTrigger className="shrink-0" />
          <Separator orientation="vertical" className="hidden h-6 md:block" />
          <Link to="/developer" className="md:hidden">
            <Logo showWordmark={false} />
          </Link>
          <div className="hidden w-56 shrink-0 lg:block">
            <WorkspaceSwitcher tone="surface" />
          </div>
          <div className="relative hidden min-w-0 max-w-sm flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search endpoints, docs, logs…"
              className="pl-9"
              aria-label="Developer search"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Search">
            <Search />
          </Button>

          <Button variant="outline" size="sm" className="hidden sm:inline-flex" asChild>
            <Link to="/developer/docs"><BookOpen /> Docs</Link>
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>

          <NotificationMenu />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-1 rounded-full focus-ring" aria-label="Developer account">
                <Avatar className="size-9 border border-border">
                  <AvatarFallback className="bg-linear-to-br from-sky to-emerald text-xs font-bold text-primary-foreground">
                    AD
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>
                <p className="text-sm font-semibold">Adeola Daramola</p>
                <p className="text-xs font-normal text-muted-foreground">Developer · Avrum Labs</p>
                <Badge variant="ai" size="sm" className="mt-2">Sandbox</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile"><User className="size-4" /> Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/developer/settings"><Settings2 className="size-4" /> Developer settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/developer/docs"><BookOpen className="size-4" /> Documentation</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive"><LogOut className="size-4" /> Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
