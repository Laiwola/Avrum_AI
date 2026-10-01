import { createFileRoute } from "@tanstack/react-router";
import { Settings, Save } from "lucide-react";

import { PageShell, PageHeader, Section, EmptyState } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AVRUM AI" },
      { name: "description", content: "Manage your profile, farm defaults, language, units and notification preferences." },
      { property: "og:title", content: "Settings — AVRUM AI" },
      { property: "og:description", content: "Manage your profile, farm defaults, language, units and notification preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <PageShell>
      <PageHeader
        title="Settings"
        subtitle="Profile, farm defaults, language, units and notification preferences."
        crumbs={[{ label: "Dashboard", to: "/" }, { label: "Settings" }]}
        actions={
          <Button variant="ai"><Save /> Save changes</Button>
        }
      />
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>Personal details</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Full name</Label>
                <Input placeholder="Adeola Daramola" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone number</Label>
                <Input placeholder="+234 800 000 0000" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>About</Label>
                <Textarea placeholder="Tell us about your farming operation…" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preferences">
          <EmptyState icon={Settings} title="Preferences coming next" description="Language, measurement units and regional defaults will be configured here." />
        </TabsContent>
        <TabsContent value="notifications">
          <EmptyState icon={Settings} title="Notification channels" description="Choose which alerts arrive by SMS, WhatsApp, email or push." tone="info" />
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
