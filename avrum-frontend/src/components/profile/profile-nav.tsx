import { Link, useRouterState } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { profileSections } from "@/lib/profile";
import { cn } from "@/lib/utils";

/** Horizontal, scrollable sub-navigation for the profile / account area. */
export function ProfileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav aria-label="Profile sections" className="-mx-1 overflow-x-auto pb-1">
      <ul className="flex w-max min-w-full items-center gap-1 px-1">
        {profileSections.map((section) => {
          const active = section.to === "/profile" ? pathname === "/profile" : pathname.startsWith(section.to);
          return (
            <li key={section.to}>
              <Link
                to={section.to}
                className={cn(
                  "focus-ring inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "bg-primary-soft text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <section.icon className="size-4" />
                {section.label}
                {section.badge && <Badge variant="muted" size="sm">{section.badge}</Badge>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
