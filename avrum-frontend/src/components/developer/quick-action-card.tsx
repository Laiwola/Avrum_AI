import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Link, type LinkProps } from "@tanstack/react-router";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function QuickActionCard({
  icon: Icon, title, description, to, onClick, badge, tone = "default", className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  to?: LinkProps["to"];
  onClick?: () => void;
  badge?: ReactNode;
  tone?: "default" | "ai" | "info";
  className?: string;
}) {
  const toneClass = {
    default: "bg-primary-soft text-primary",
    ai: "bg-emerald-soft text-emerald",
    info: "bg-sky-soft text-sky",
  }[tone];

  const body = (
    <Card
      className={cn(
        "group h-full cursor-pointer p-5 transition-all hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", toneClass)}>
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm font-bold">
            {title} {badge}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
    </Card>
  );

  if (to) return <Link to={to} className="focus-ring block rounded-xl">{body}</Link>;
  return (
    <button type="button" onClick={onClick} className="focus-ring block w-full rounded-xl text-left">
      {body}
    </button>
  );
}
