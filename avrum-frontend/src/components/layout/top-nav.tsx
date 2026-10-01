import { Globe, Moon, Search, Sun, User, LogOut, Settings2, LifeBuoy } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { NotificationMenu } from "@/components/layout/notification-menu";
import { Logo } from "@/components/layout/logo";
import { useTheme } from "@/components/theme/theme-provider";

export function TopNav() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/85 backdrop-blur-md">
      <div className="grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <SidebarTrigger className="shrink-0" />
          <Separator orientation="vertical" className="hidden h-6 md:block" />
          <Link to="/dashboard" className="md:hidden">
            <Logo showWordmark={false} />
          </Link>
          <div className="relative hidden min-w-0 max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search farms, diseases, advisories…"
              className="pl-9"
              aria-label="Global search"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Search">
            <Search />
          </Button>

          {/* Language switch placeholder */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Language">
                <Globe />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value="en">
                <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="fr">Français</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="ha">Hausa</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="sw">Kiswahili</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme switch placeholder */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>

          <NotificationMenu />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-1 rounded-full focus-ring" aria-label="Account">
                <Avatar className="size-9 border border-border">
                  <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">
                    AD
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="text-sm font-semibold">Adeola Daramola</p>
                <p className="text-xs font-normal text-muted-foreground">Agronomy Lead</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile"><User className="size-4" /> Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings"><Settings2 className="size-4" /> Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/help"><LifeBuoy className="size-4" /> Help Center</Link>
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
