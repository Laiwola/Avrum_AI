import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * OAuth entry points. Email is the only live method today, so the provider
 * buttons render disabled — flip `enabled` per provider when a backend
 * provider is configured.
 */
export type OAuthProvider = {
  id: "google" | "apple" | "microsoft";
  label: string;
  icon: ReactNode;
  enabled?: boolean;
};

const GoogleMark = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
    <path
      fill="currentColor"
      d="M21.35 11.1H12v2.9h5.35c-.25 1.5-1.8 4.4-5.35 4.4A5.9 5.9 0 1 1 15.9 8l2.2-2.1A9 9 0 1 0 21.35 11.1Z"
    />
  </svg>
);

const AppleMark = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
    <path
      fill="currentColor"
      d="M16.4 12.9c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.7-1.8-3.3-1.8-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7 1.4 0 1.8.7 3 .7 1.2 0 2-1.1 2.8-2.2.6-.9.9-1.8 1-1.9-.1 0-2.4-.9-2.4-3.5ZM14.3 5.7c.6-.8 1-1.8.9-2.9-.9.1-2 .6-2.7 1.4-.6.7-1 1.8-.9 2.8 1 .1 2-.5 2.7-1.3Z"
    />
  </svg>
);

const MicrosoftMark = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
    <path fill="currentColor" d="M3 3h8.5v8.5H3V3Zm9.5 0H21v8.5h-8.5V3ZM3 12.5h8.5V21H3v-8.5Zm9.5 0H21V21h-8.5v-8.5Z" />
  </svg>
);

export const oauthProviders: OAuthProvider[] = [
  { id: "google", label: "Google", icon: <GoogleMark /> },
  { id: "apple", label: "Apple", icon: <AppleMark /> },
  { id: "microsoft", label: "Microsoft", icon: <MicrosoftMark /> },
];

export function OAuthProviders({
  label = "Or continue with",
  providers = oauthProviders,
  className,
}: {
  label?: string;
  providers?: OAuthProvider[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-2xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {providers.map((p) => (
          <Button
            key={p.id}
            type="button"
            variant="outline"
            size="default"
            className="px-2 text-xs"
            disabled={!p.enabled}
            title={p.enabled ? `Continue with ${p.label}` : `${p.label} sign-in coming soon`}
          >
            {p.icon}
            <span className="truncate">{p.label}</span>
          </Button>
        ))}
      </div>

      <p className="text-center text-2xs text-muted-foreground">
        Single sign-on providers arrive after email authentication goes live.
      </p>
    </div>
  );
}
