import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Twitter } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { Badge } from "@/components/ui/badge";

const columns: { title: string; links: { label: string; to?: string; href?: string }[] }[] = [
  {
    title: "Products",
    links: [
      { label: "AI Crop Doctor", to: "/crop-doctor" },
      { label: "Disease Intelligence", to: "/disease-intelligence" },
      { label: "Spray Recommendation", to: "/spray-recommendation" },
      { label: "Satellite Monitoring", to: "/satellite-monitoring" },
      { label: "Soil Intelligence", to: "/soil-intelligence" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "My Farms", to: "/farms" },
      { label: "Crop Calendar", to: "/farms/calendar" },
      { label: "Settings", to: "/settings" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Impact", href: "#impact" },
      { label: "FAQ", href: "#faq" },
      { label: "Help Center", to: "/help" },
    ],
  },
];

const socials = [
  { icon: Twitter, label: "X", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface/70">
      <div className="marketing-container py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Agricultural intelligence for the next billion tonnes. Built with agronomists, for
              farmers who decide today.
            </p>
            <Badge variant="ai" size="sm" className="mt-5">
              Season 2026 · Wet
            </Badge>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className="text-overline text-muted-foreground">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.to ? (
                        <Link
                          to={l.to}
                          className="focus-ring rounded text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {l.label}
                        </Link>
                      ) : (
                        <a
                          href={l.href}
                          className="focus-ring rounded text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {l.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AVRUM AI. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="focus-ring grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <s.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
