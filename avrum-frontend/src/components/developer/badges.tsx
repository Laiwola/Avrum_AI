import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { ApiStatus } from "@/lib/developer";

/** HTTP method + path chip used across playground, logs and API product cards. */
export function EndpointBadge({
  method, path, className,
}: { method: "GET" | "POST" | "PUT" | "DELETE"; path: string; className?: string }) {
  const tone = {
    GET: "bg-sky-soft text-sky",
    POST: "bg-emerald-soft text-emerald",
    PUT: "bg-warning-soft text-warning-foreground",
    DELETE: "bg-destructive-soft text-destructive",
  }[method];

  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-2 rounded-lg border border-border bg-muted/50 px-2 py-1",
        className,
      )}
    >
      <span className={cn("rounded-md px-1.5 py-0.5 text-2xs font-bold tracking-wide", tone)}>
        {method}
      </span>
      <code className="truncate font-mono text-xs text-muted-foreground">{path}</code>
    </span>
  );
}

const statusMap: Record<ApiStatus, { label: string; variant: "success" | "ai" | "info" | "muted" }> = {
  stable: { label: "Stable", variant: "success" },
  beta: { label: "Beta", variant: "ai" },
  preview: { label: "Preview", variant: "info" },
  "coming-soon": { label: "Coming soon", variant: "muted" },
};

export function StatusBadge({
  status, size = "sm", className,
}: { status: ApiStatus; size?: "sm" | "default"; className?: string }) {
  const s = statusMap[status];
  return (
    <Badge variant={s.variant} size={size} className={className}>
      <span
        className={cn(
          "size-1.5 rounded-full",
          status === "coming-soon" ? "bg-muted-foreground" : "bg-current",
        )}
      />
      {s.label}
    </Badge>
  );
}
