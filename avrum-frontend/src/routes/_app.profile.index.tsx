import { createFileRoute, Link } from "@tanstack/react-router";
import {
  PencilLine, ShieldCheck, MapPin, Mail, Phone, Building2, Clock, CalendarDays,
  ArrowUpRight, BadgeCheck, Sprout,
} from "lucide-react";

import { SettingsCard, SettingsRow, SettingsRowGroup, StatCard, AIInsightCard } from "@/components/avrum";
import { ProfileIdentityCard } from "@/components/profile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { currentProfile } from "@/lib/profile";

export const Route = createFileRoute("/_app/profile/")({
  head: () => ({
    meta: [
      { title: "Profile Overview — AVRUM AI" },
      { name: "description", content: "Your AVRUM AI identity, contact details, farm role and account health in one overview." },
      { property: "og:title", content: "Profile Overview — AVRUM AI" },
      { property: "og:description", content: "Your AVRUM AI identity, contact details, farm role and account health." },
    ],
  }),
  component: ProfileOverviewPage,
});

function ProfileOverviewPage() {
  return (
    <div className="space-y-6">
      <ProfileIdentityCard
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/profile/security"><ShieldCheck /> Security</Link>
            </Button>
            <Button variant="ai" asChild>
              <Link to="/profile/edit"><PencilLine /> Edit profile</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Profile completeness" value="72%" icon={BadgeCheck} tone="ai" trend="up" trendLabel="3 fields left" />
        <StatCard label="Farms managed" value={0} icon={Sprout} trendLabel="No farms added yet" trend="flat" />
        <StatCard label="Member since" value={currentProfile.memberSince} icon={CalendarDays} />
        <StatCard label="Security score" value="Good" icon={ShieldCheck} tone="info" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <SettingsCard
            title="Contact details"
            description="How AVRUM AI and your cooperative reach you."
            icon={Mail}
            footer={
              <Button variant="outline" size="sm" asChild>
                <Link to="/profile/edit">Edit details</Link>
              </Button>
            }
          >
            <SettingsRowGroup>
              <SettingsRow icon={Mail} title="Email address" description={currentProfile.email} control={<Badge variant="success" size="sm">Verified</Badge>} />
              <SettingsRow icon={Phone} title="Phone number" description={currentProfile.phone} control={<Badge variant="warning" size="sm">Unverified</Badge>} />
              <SettingsRow icon={Building2} title="Organisation" description={currentProfile.organisation} />
              <SettingsRow icon={MapPin} title="Location" description={currentProfile.location} />
              <SettingsRow icon={Clock} title="Timezone" description={currentProfile.timezone} />
            </SettingsRowGroup>
          </SettingsCard>

          <SettingsCard title="About" description="Shown to teammates in your cooperative." icon={PencilLine}>
            <p className="text-sm text-muted-foreground">{currentProfile.bio}</p>
          </SettingsCard>
        </div>

        <div className="space-y-6">
          <SettingsCard
            title="Complete your profile"
            description="Finish these steps to improve advisory accuracy."
            icon={BadgeCheck}
            tone="ai"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground">72% complete</span>
                  <span className="text-muted-foreground">3 of 11</span>
                </div>
                <Progress value={72} />
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>· Verify your phone number</li>
                <li>· Add a profile photo</li>
                <li>· Enable two-factor authentication</li>
              </ul>
              <Button variant="emerald" size="sm" block asChild>
                <Link to="/profile/edit">Continue setup <ArrowUpRight /></Link>
              </Button>
            </div>
          </SettingsCard>

          <AIInsightCard
            title="Personalise your advisories"
            insight="Your language and region are set, but no farms are linked to this profile yet."
            recommendation="Add a farm so AVRUM AI can tailor spray windows and disease alerts to your fields."
            confidence={0}
            severity="info"
            footer={
              <Button size="sm" variant="outline" asChild>
                <Link to="/farms">Go to My Farms <ArrowUpRight /></Link>
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
