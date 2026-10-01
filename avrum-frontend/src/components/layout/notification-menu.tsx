import { Bell, AlertTriangle, Satellite, Sprout } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const items = [
  { icon: AlertTriangle, tone: "danger" as const, title: "High blight risk detected", meta: "Ilorin · Field B · 12m ago" },
  { icon: Satellite, tone: "info" as const, title: "New satellite pass available", meta: "NDVI refreshed · 2h ago" },
  { icon: Sprout, tone: "ai" as const, title: "Spray window opens tomorrow", meta: "Maize · 06:00–10:00 · 5h ago" },
];

export function NotificationMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive ring-2 ring-card" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-bold">Notifications</p>
          <Badge variant="danger" size="sm">3 new</Badge>
        </div>
        <ScrollArea className="max-h-72">
          <ul className="divide-y">
            {items.map((n) => (
              <li key={n.title} className="flex gap-3 px-4 py-3 transition-colors hover:bg-muted/60">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted">
                  <n.icon className="size-4 text-muted-foreground" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{n.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{n.meta}</p>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <div className="border-t p-2">
          <Button asChild variant="ghost" size="sm" block>
            <Link to="/notifications">View all notifications</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
