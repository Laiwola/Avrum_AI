import { useEffect, useState } from "react";
import { Check, CloudUpload } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Autosave placeholder — simulates a draft save whenever `signal` changes.
 * No API calls; wiring happens when the backend lands.
 */
export function AutosaveIndicator({ signal, className }: { signal: unknown; className?: string }) {
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    setSaving(true);
    const timer = setTimeout(() => {
      setSaving(false);
      setSavedAt(new Date());
    }, 700);
    return () => clearTimeout(timer);
  }, [signal]);

  return (
    <p
      aria-live="polite"
      className={cn("inline-flex items-center gap-1.5 text-2xs text-muted-foreground", className)}
    >
      {saving ? (
        <>
          <CloudUpload className="size-3.5 animate-pulse text-primary" /> Saving draft…
        </>
      ) : (
        <>
          <Check className="size-3.5 text-emerald" /> Draft saved
          {savedAt &&
            ` · ${savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
        </>
      )}
    </p>
  );
}
