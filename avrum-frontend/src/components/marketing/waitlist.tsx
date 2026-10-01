import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Waitlist() {
  const waitlistFormUrl = import.meta.env["VITE_WAITLIST_FORM_URL"] || "";

  const handleJoinWaitlist = () => {
    if (waitlistFormUrl) {
      window.location.href = waitlistFormUrl;
    }
  };

  return (
    <section className="section-block">
      <div className="marketing-container">
        <div className="halo relative isolate overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 shadow-premium sm:px-12">
          <div
            aria-hidden
            className="animate-float-slow absolute -right-16 -top-16 size-64 rounded-full bg-primary/10 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-20 -left-10 size-56 rounded-full bg-emerald/20 blur-3xl"
          />

          <div className="relative mx-auto max-w-xl text-center">
            <Badge variant="ai" size="sm" className="mx-auto">
              <Sparkles /> Early access
            </Badge>
            <h2 className="mt-5 text-page-title lg:text-display">
              Join the <span className="text-gradient-brand">Avrum waitlist</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Be among the first to access Avrum AI when it becomes available. Limited early access
              for farmers and agricultural organizations.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                variant="ai"
                size="lg"
                onClick={handleJoinWaitlist}
                disabled={!waitlistFormUrl}
              >
                Join the waitlist <ArrowRight />
              </Button>
            </div>

            <p className="mt-4 text-2xs font-semibold text-muted-foreground">
              Takes 2 minutes · We'll notify you when early access is available
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
