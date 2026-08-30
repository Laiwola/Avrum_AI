import type { ReactNode } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { currentProfile, profileFullName } from "@/lib/profile";
import { cn } from "@/lib/utils";

/** Identity banner reused at the top of the profile area. */
export function ProfileIdentityCard({ actions, className }: { actions?: ReactNode; className?: string }) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="h-24 bg-gradient-brand" />
      <CardContent className="flex flex-col gap-4 pt-0 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end">
          <Avatar className="-mt-12 size-20 shrink-0 border-4 border-card shadow-sm">
            <AvatarFallback className="bg-primary text-xl font-bold text-primary-foreground">
              {currentProfile.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-1">

            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-section-title text-foreground">{profileFullName}</h2>
              <Badge variant="ai" size="sm">Verified</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {currentProfile.role} · {currentProfile.organisation}
            </p>
          </div>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2 sm:pb-1">{actions}</div>}
      </CardContent>
    </Card>
  );
}
