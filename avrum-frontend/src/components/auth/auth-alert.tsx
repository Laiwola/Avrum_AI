import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

import { cn } from "@/lib/utils";

const TONES = {
  info: { wrap: "border-sky/30 bg-sky-soft text-sky", icon: Info },
  success: { wrap: "border-emerald/30 bg-emerald-soft text-emerald", icon: CheckCircle2 },
  error: { wrap: "border-destructive/30 bg-destructive-soft text-destructive", icon: AlertTriangle },
} as const;

/** Form-level status message, matching the app's soft-token treatment. */
export function AuthAlert({
  tone = "info",
  children,
  className,
}: {
  tone?: keyof typeof TONES;
  children: ReactNode;
  className?: string;
}) {
  const { wrap, icon: Icon } = TONES[tone];

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("flex items-start gap-2.5 rounded-xl border p-3 text-xs font-medium", wrap, className)}
    >
      <Icon className="mt-px size-4 shrink-0" />
      <span className="min-w-0">{children}</span>
    </div>
  );
}
