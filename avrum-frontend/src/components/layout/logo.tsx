import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showWordmark = true,
  tone = "default",
}: {
  className?: string;
  showWordmark?: boolean;
  tone?: "default" | "sidebar";
}) {
  return (
    <span className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-primary to-emerald shadow-sm">
        <Leaf className="size-5 text-primary-foreground" strokeWidth={2.4} />
      </span>
      {showWordmark && (
        <span className="flex min-w-0 flex-col leading-none">
          <span
            className={cn(
              "truncate font-display text-base font-extrabold tracking-tight",
              tone === "sidebar" ? "text-sidebar-foreground" : "text-foreground",
            )}
          >
            AVRUM AI
          </span>
          <span
            className={cn(
              "truncate text-2xs font-semibold uppercase tracking-[0.14em]",
              tone === "sidebar" ? "text-sidebar-foreground/60" : "text-muted-foreground",
            )}
          >
            Agri Intelligence
          </span>
        </span>
      )}
    </span>
  );
}
