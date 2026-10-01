import { createFileRoute } from "@tanstack/react-router";
import { BellRing, Mail, MessageSquare, Smartphone, Bug, SprayCan, Satellite, Save } from "lucide-react";
import { toast } from "sonner";

import { SettingsCard, SettingsField, SettingsRow, SettingsRowGroup } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_app/profile/notifications")({
  head: () => ({
    meta: [
      { title: "Notification Settings — AVRUM AI" },
      { name: "description", content: "Choose which disease alerts, spray windows and satellite updates reach you, and by which channel." },
      { property: "og:title", content: "Notification Settings — AVRUM AI" },
      { property: "og:description", content: "Control disease alerts, spray windows and satellite updates by channel." },
    ],
  }),
  component: NotificationSettingsPage,
});

function NotificationSettingsPage() {
  return (
    <div className="space-y-6">
      <SettingsCard
        title="Channels"
        description="Where AVRUM AI sends your advisories."
        icon={BellRing}
      >
        <SettingsRowGroup>
          <SettingsRow icon={Mail} title="Email" description="Daily digests and detailed advisory reports." control={<Switch defaultChecked />} />
          <SettingsRow icon={MessageSquare} title="SMS" description="Short, urgent alerts — works without data." control={<Switch defaultChecked />} />
          <SettingsRow icon={MessageSquare} title="WhatsApp" description="Rich alerts with images and treatment steps." control={<Switch />} />
          <SettingsRow icon={Smartphone} title="Push notifications" description="Real-time alerts on the AVRUM mobile app." control={<Switch defaultChecked />} />
        </SettingsRowGroup>
      </SettingsCard>

      <SettingsCard
        title="Alert types"
        description="Pick the intelligence that matters to your operation."
        icon={Bug}
        tone="ai"
      >
        <SettingsRowGroup>
          <SettingsRow icon={Bug} title="Disease outbreaks" description="Regional outbreak warnings and risk escalations." control={<Switch defaultChecked />} />
          <SettingsRow icon={SprayCan} title="Spray windows" description="Weather-safe application windows for your fields." control={<Switch defaultChecked />} />
          <SettingsRow icon={Satellite} title="Satellite passes" description="New imagery and vegetation index changes." control={<Switch defaultChecked />} />
          <SettingsRow icon={BellRing} title="Product updates" description="New AVRUM AI features and improvements." control={<Switch />} />
        </SettingsRowGroup>
      </SettingsCard>

      <SettingsCard
        title="Delivery schedule"
        description="Control frequency and quiet hours so alerts arrive when you can act."
        icon={BellRing}
        tone="info"
        contentClassName="grid gap-4 sm:grid-cols-2"
        footer={<Button variant="ai" onClick={() => toast.success("Notification preferences saved")}><Save /> Save preferences</Button>}
      >
        <SettingsField label="Digest frequency">
          <Select defaultValue="daily">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">Real time</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </SettingsField>
        <SettingsField label="Minimum severity" hint="Alerts below this level are collected in your digest.">
          <Select defaultValue="moderate">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All alerts</SelectItem>
              <SelectItem value="moderate">Moderate and above</SelectItem>
              <SelectItem value="high">High and critical only</SelectItem>
            </SelectContent>
          </Select>
        </SettingsField>
        <SettingsField label="Quiet hours start">
          <Select defaultValue="21">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20:00</SelectItem>
              <SelectItem value="21">21:00</SelectItem>
              <SelectItem value="22">22:00</SelectItem>
            </SelectContent>
          </Select>
        </SettingsField>
        <SettingsField label="Quiet hours end">
          <Select defaultValue="6">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="5">05:00</SelectItem>
              <SelectItem value="6">06:00</SelectItem>
              <SelectItem value="7">07:00</SelectItem>
            </SelectContent>
          </Select>
        </SettingsField>
      </SettingsCard>
    </div>
  );
}
