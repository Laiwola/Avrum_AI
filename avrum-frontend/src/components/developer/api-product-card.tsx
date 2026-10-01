import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EndpointBadge, StatusBadge } from "@/components/developer/badges";
import type { ApiProduct } from "@/lib/developer";
import { cn } from "@/lib/utils";

export function APIProductCard({ product, className }: { product: ApiProduct; className?: string }) {
  const toneClass = {
    default: "bg-primary-soft text-primary",
    ai: "bg-emerald-soft text-emerald",
    info: "bg-sky-soft text-sky",
    warning: "bg-warning-soft text-warning-foreground",
  }[product.tone];

  const disabled = product.status === "coming-soon";

  return (
    <Card className={cn("flex h-full flex-col gap-4 p-5 transition-shadow hover:shadow-md", className)}>
      <div className="flex items-start justify-between gap-3">
        <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", toneClass)}>
          <product.icon className="size-5.5" />
        </span>
        <StatusBadge status={product.status} />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-section-title">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </div>

      <ul className="space-y-1.5">
        {product.capabilities.map((c) => (
          <li key={c} className="flex items-center gap-2 text-xs font-medium text-foreground/80">
            <Check className="size-3.5 shrink-0 text-emerald" />
            {c}
          </li>
        ))}
      </ul>

      <EndpointBadge method={product.endpoint.method} path={product.endpoint.path} className="w-fit max-w-full" />

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
        <p className="min-w-0">
          <span className="block text-2xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
            Requests · 30d
          </span>
          <span className="block truncate font-display text-sm font-bold tabular-nums">
            {product.requests}
          </span>
        </p>
        {disabled ? (
          <Button variant="outline" size="sm" disabled>Coming soon</Button>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <Link to="/developer/api-products" hash={product.slug}>
              Explore API <ArrowUpRight />
            </Link>
          </Button>
        )}
      </div>
    </Card>
  );
}
