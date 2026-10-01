import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

/** Reusable selectable tile (single or multi select) for wizard choices. */
export function OptionCard({
  icon: Icon,
  label,
  description,
  selected,
  onSelect,
  className,
}: {
  icon?: LucideIcon;
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "focus-ring group relative flex w-full items-start gap-3 rounded-xl border bg-card p-3.5 text-left transition-all duration-150 hover:-translate-y-px hover:shadow-sm",
        selected ? "border-primary bg-primary-soft/40 shadow-sm" : "border-border",
        className,
      )}
    >
      {Icon && (
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-lg transition-colors",
            selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="size-4" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
        )}
      </span>
      <span
        className={cn(
          "mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full border transition-colors",
          selected ? "border-primary bg-primary text-primary-foreground" : "border-border-strong",
        )}
      >
        {selected && <Check className="size-3" />}
      </span>
    </button>
  );
}
