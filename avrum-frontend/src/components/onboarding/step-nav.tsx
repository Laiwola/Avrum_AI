import { ArrowLeft, ArrowRight, Check, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Sticky footer controls: Back · Save & continue · Continue. */
export function StepNav({
  onBack,
  onContinue,
  onSaveAndContinue,
  backDisabled,
  continueDisabled,
  continueLabel = "Continue",
  isLast,
  className,
}: {
  onBack: () => void;
  onContinue: () => void;
  onSaveAndContinue?: (() => void) | undefined;
  backDisabled?: boolean;
  continueDisabled?: boolean;
  continueLabel?: string;
  isLast?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky bottom-0 mt-8 flex flex-col-reverse gap-2 border-t border-border bg-background/90 pb-2 pt-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <Button variant="ghost" size="lg" onClick={onBack} disabled={backDisabled}>
        <ArrowLeft /> Back
      </Button>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {onSaveAndContinue && !isLast && (
          <Button variant="outline" size="lg" onClick={onSaveAndContinue} disabled={continueDisabled}>
            <Save /> Save &amp; continue
          </Button>
        )}
        <Button variant="ai" size="lg" onClick={onContinue} disabled={continueDisabled}>
          {continueLabel}
          {isLast ? <Check /> : <ArrowRight />}
        </Button>
      </div>
    </div>
  );
}
