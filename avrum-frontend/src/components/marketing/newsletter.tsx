import * as React from "react";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [done, setDone] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }
    setDone(true);
    toast.success("You're on the list", {
      description: "Season briefings land in your inbox every second Tuesday.",
    });
  };

  return (
    <section className="section-block">
      <div className="marketing-container">
        <div className="halo relative isolate overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 shadow-premium sm:px-12">
          <div
            aria-hidden
            className="animate-float-slow absolute -right-16 -top-16 size-64 rounded-full bg-emerald/20 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-20 -left-10 size-56 rounded-full bg-sky/15 blur-3xl"
          />

          <div className="relative mx-auto max-w-xl text-center">
            <Badge variant="ai" size="sm" className="mx-auto">
              <Mail /> Season briefing
            </Badge>
            <h2 className="mt-5 text-page-title lg:text-display">
              Get the <span className="text-gradient-brand">agronomy intelligence</span> brief
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Fortnightly outbreak signals, spray-window shifts and model release notes. Written for
              agronomists — no fluff, no selling.
            </p>

            {done ? (
              <p className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-soft/60 px-4 py-3 text-sm font-bold text-emerald">
                <CheckCircle2 className="size-4" /> Subscribed — see you Tuesday.
              </p>
            ) : (
              <form
                onSubmit={submit}
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <Input
                  id="newsletter-email"
                  type="email"
                  placeholder="you@farmgroup.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
                <Button type="submit" variant="ai" size="lg" className="shrink-0">
                  Subscribe <ArrowRight />
                </Button>
              </form>
            )}

            <p className="mt-4 text-2xs font-semibold text-muted-foreground">
              One email every two weeks. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
