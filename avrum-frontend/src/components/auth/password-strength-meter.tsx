import { Check, Circle } from "lucide-react";

import { getPasswordStrength } from "@/lib/auth-validation";
import { cn } from "@/lib/utils";

const TONES = {
  1: { bar: "bg-destructive", text: "text-destructive" },
  2: { bar: "bg-warning", text: "text-warning-foreground" },
  3: { bar: "bg-sky", text: "text-sky" },
  4: { bar: "bg-emerald", text: "text-emerald" },
} as const;

/** Four-segment strength meter plus the rules still outstanding. */
export function PasswordStrengthMeter({
  value,
  showRules = true,
  className,
}: {
  value: string;
  showRules?: boolean;
  className?: string;
}) {
  const { score, label, rules } = getPasswordStrength(value);
  const tone = score === 0 ? null : TONES[score];

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1" aria-hidden="true">
          {[1, 2, 3, 4].map((step) => (
            <span
              key={step}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-200",
                tone && score >= step ? tone.bar : "bg-muted",
              )}
            />
          ))}
        </div>
        <span
          className={cn(
            "w-14 shrink-0 text-right text-2xs font-bold uppercase tracking-[0.08em]",
            tone ? tone.text : "text-muted-foreground",
          )}
          aria-live="polite"
        >
          {score === 0 ? "—" : label}
        </span>
      </div>

      {showRules && (
        <ul className="grid gap-1 sm:grid-cols-2">
          {rules.map((rule) => (
            <li
              key={rule.label}
              className={cn(
                "flex items-center gap-1.5 text-xs transition-colors",
                rule.met ? "text-emerald" : "text-muted-foreground",
              )}
            >
              {rule.met ? (
                <Check className="size-3.5 shrink-0" />
              ) : (
                <Circle className="size-3 shrink-0" />
              )}
              {rule.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
