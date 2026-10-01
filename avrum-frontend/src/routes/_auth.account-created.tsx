import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, PartyPopper, Sprout, Stethoscope, Satellite } from "lucide-react";

import { AuthCard, AuthIllustration } from "@/components/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TITLE = "Account created — AVRUM AI";
const DESCRIPTION =
  "Your AVRUM AI account is active. Add your first farm, run AI Crop Doctor and start receiving field advisories.";

const nextSteps = [
  { icon: Sprout, label: "Add your first farm", copy: "Draw field boundaries and set crops." },
  { icon: Stethoscope, label: "Run AI Crop Doctor", copy: "Upload a leaf photo for a diagnosis." },
  { icon: Satellite, label: "Enable satellite passes", copy: "Track vigour and stress weekly." },
];

export const Route = createFileRoute("/_auth/account-created")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountCreatedPage,
});

function AccountCreatedPage() {
  return (
    <AuthCard
      eyebrow={
        <Badge variant="success" size="sm">
          Email verified
        </Badge>
      }
      title="Your account is ready"
      description="Welcome to AVRUM AI. Here's the fastest path to your first field advisory."
      footer={
        <>
          Prefer to explore first?{" "}
          <Link to="/" className="font-semibold text-primary hover:underline">
            Visit the home page
          </Link>
        </>
      }
    >
      <div className="space-y-6">
        <AuthIllustration icon={PartyPopper} tone="emerald" />

        <ul className="space-y-3">
          {nextSteps.map(({ icon: Icon, label, copy }) => (
            <li key={label} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-soft text-emerald">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground">{label}</span>
                <span className="block text-xs text-muted-foreground">{copy}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="space-y-2">
          <Button variant="ai" size="lg" block asChild>
            <Link to="/onboarding">
              Start farm setup <ArrowRight />
            </Link>
          </Button>
          <Button variant="outline" size="lg" block asChild>
            <Link to="/">Skip to home</Link>
          </Button>
        </div>
      </div>
    </AuthCard>
  );
}
