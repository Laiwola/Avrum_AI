import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const TONES = {
  primary: "from-primary/15 to-emerald/10 text-primary",
  emerald: "from-emerald/20 to-sky/10 text-emerald",
  sky: "from-sky/20 to-emerald/10 text-sky",
  warning: "from-warning/25 to-warning/5 text-warning-foreground",
} as const;

/** Large decorative medallion used on confirmation / status auth screens. */
export function AuthIllustration({
  icon: Icon,
  tone = "primary",
  className,
}: {
  icon: LucideIcon;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return (
    <div className={cn("relative mx-auto grid size-28 place-items-center", className)}>
      <span
        className={cn(
          "absolute inset-0 rounded-full bg-linear-to-br opacity-90 blur-[2px]",
          TONES[tone],
        )}
      />
      <span className="absolute inset-3 rounded-full border border-border-strong/50" />
      <span className="absolute inset-6 rounded-full bg-card shadow-sm" />
      <Icon className={cn("relative size-10", TONES[tone].split(" ").at(-1))} strokeWidth={1.6} />
    </div>
  );
}
