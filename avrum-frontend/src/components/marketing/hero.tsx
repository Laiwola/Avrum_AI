import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductPreview } from "@/components/marketing/product-preview";

export function Hero() {
  return (
    <section id="top" className="halo relative isolate overflow-hidden">
      <div aria-hidden className="field-grid absolute inset-0 -z-10 opacity-60" />
      <div
        aria-hidden
        className="animate-float-slow absolute -left-24 top-24 -z-10 size-72 rounded-full bg-emerald/20 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-float-slow absolute -right-20 top-8 -z-10 size-80 rounded-full bg-sky/20 blur-3xl [animation-delay:1.6s]"
      />

      <div className="marketing-container pb-16 pt-14 lg:pb-24 lg:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="animate-rise mx-auto gap-2 border-emerald/30 bg-card/80 py-1 backdrop-blur"
          >
            <Sparkles className="text-emerald" />
            Agronomy foundation models · Season 2026
          </Badge>

          <h1 className="animate-rise mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl [animation-delay:80ms]">
            AI-powered agriculture,
            <br className="hidden sm:block" />{" "}
            <span className="text-gradient-brand">from satellite to soil</span>
          </h1>

          <p className="animate-rise mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg [animation-delay:160ms]">
            AVRUM AI turns crop photos, satellite passes and soil data into decisions farmers can
            act on today — disease diagnosis, spray timing and yield risk, in one intelligence
            layer.
          </p>

          <div className="animate-rise mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row [animation-delay:240ms]">
            <Button variant="ai" size="lg" asChild>
              <Link to="/dashboard">
                Start free diagnosis <ArrowRight />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#how-it-works">
                <PlayCircle /> See how it works
              </a>
            </Button>
          </div>

          <p className="animate-rise mt-5 text-xs font-semibold text-muted-foreground [animation-delay:300ms]">
            No credit card · 3 free field diagnoses · Works on 2G
          </p>
        </div>

        <div className="animate-rise mt-14 lg:mt-18 [animation-delay:380ms]">
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}
