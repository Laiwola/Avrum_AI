import { Badge } from "@/components/ui/badge";
import { EndpointBadge } from "@/components/developer/badges";
import type { ApiActivity } from "@/lib/developer";
import { cn } from "@/lib/utils";

export function APIActivityRow({ item, className }: { item: ApiActivity; className?: string }) {
  const ok = item.status >= 200 && item.status < 300;
  const variant = ok ? "success" : item.status >= 500 ? "danger" : "warning";

  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40",
        className,
      )}
    >
      <div className="min-w-0 space-y-1">
        <EndpointBadge method={item.method} path={item.path} className="max-w-full" />
        <p className="truncate text-2xs text-muted-foreground">
          key <code className="font-mono">{item.key}</code> · {item.time}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden text-xs font-semibold tabular-nums text-muted-foreground sm:inline">
          {item.latency}
        </span>
        <Badge variant={variant} size="sm">{item.status}</Badge>
      </div>
    </div>
  );
}
