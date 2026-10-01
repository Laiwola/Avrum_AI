import { createFileRoute, Link } from "@tanstack/react-router";
import { UserRound, Camera, Save, RotateCcw, Building2, MapPin } from "lucide-react";
import { toast } from "sonner";

import { SettingsCard, SettingsField } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { currentProfile } from "@/lib/profile";

export const Route = createFileRoute("/_app/profile/edit")({
  head: () => ({
    meta: [
      { title: "Edit Profile — AVRUM AI" },
      { name: "description", content: "Update your name, profile photo, contact details, role and bio on AVRUM AI." },
      { property: "og:title", content: "Edit Profile — AVRUM AI" },
      { property: "og:description", content: "Update your name, profile photo, contact details, role and bio." },
    ],
  }),
  component: EditProfilePage,
});

function EditProfilePage() {
  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        toast.success("Profile updated", { description: "Your changes have been saved." });
      }}
    >
      <SettingsCard
        title="Profile photo"
        description="A clear headshot helps teammates recognise you. PNG or JPG, up to 2 MB."
        icon={Camera}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Avatar className="size-20 border border-border">
            <AvatarFallback className="bg-primary text-xl font-bold text-primary-foreground">
              {currentProfile.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm"><Camera /> Upload photo</Button>
            <Button type="button" variant="ghost" size="sm" className="text-destructive">Remove</Button>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Personal details"
        description="Your name and how you're described across AVRUM AI."
        icon={UserRound}
        contentClassName="grid gap-4 sm:grid-cols-2"
      >
        <SettingsField label="First name" htmlFor="first-name">
          <Input id="first-name" defaultValue={currentProfile.firstName} />
        </SettingsField>
        <SettingsField label="Last name" htmlFor="last-name">
          <Input id="last-name" defaultValue={currentProfile.lastName} />
        </SettingsField>
        <SettingsField label="Email address" htmlFor="email" hint="Changing this requires re-verification.">
          <Input id="email" type="email" defaultValue={currentProfile.email} />
        </SettingsField>
        <SettingsField label="Phone number" htmlFor="phone" hint="Used for SMS and WhatsApp advisories.">
          <Input id="phone" type="tel" defaultValue={currentProfile.phone} />
        </SettingsField>
        <SettingsField label="Role" className="sm:col-span-1">
          <Select defaultValue="agronomy-lead">
            <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="farmer">Farmer</SelectItem>
              <SelectItem value="agronomy-lead">Agronomy Lead</SelectItem>
              <SelectItem value="extension-officer">Extension Officer</SelectItem>
              <SelectItem value="cooperative-manager">Cooperative Manager</SelectItem>
              <SelectItem value="researcher">Researcher</SelectItem>
            </SelectContent>
          </Select>
        </SettingsField>
        <SettingsField label="Primary crop">
          <Select defaultValue="maize">
            <SelectTrigger><SelectValue placeholder="Select a crop" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="maize">Maize</SelectItem>
              <SelectItem value="cassava">Cassava</SelectItem>
              <SelectItem value="cowpea">Cowpea</SelectItem>
              <SelectItem value="rice">Rice</SelectItem>
              <SelectItem value="tomato">Tomato</SelectItem>
            </SelectContent>
          </Select>
        </SettingsField>
        <SettingsField label="About" htmlFor="bio" className="sm:col-span-2" hint="Up to 280 characters.">
          <Textarea id="bio" rows={4} defaultValue={currentProfile.bio} />
        </SettingsField>
      </SettingsCard>

      <SettingsCard
        title="Organisation & location"
        description="Helps AVRUM AI localise advisories and benchmark your region."
        icon={Building2}
        contentClassName="grid gap-4 sm:grid-cols-2"
        footer={
          <>
            <Button type="reset" variant="ghost"><RotateCcw /> Reset</Button>
            <Button type="submit" variant="ai"><Save /> Save changes</Button>
          </>
        }
      >
        <SettingsField label="Organisation" htmlFor="org">
          <Input id="org" defaultValue={currentProfile.organisation} />
        </SettingsField>
        <SettingsField label="Country">
          <Select defaultValue="ng">
            <SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ng">Nigeria</SelectItem>
              <SelectItem value="gh">Ghana</SelectItem>
              <SelectItem value="ke">Kenya</SelectItem>
              <SelectItem value="tz">Tanzania</SelectItem>
              <SelectItem value="ci">Côte d'Ivoire</SelectItem>
            </SelectContent>
          </Select>
        </SettingsField>
        <SettingsField label="State / Region" htmlFor="region" className="sm:col-span-2">
          <Input id="region" defaultValue="Oyo State" />
        </SettingsField>
        <p className="flex items-center gap-2 text-xs text-muted-foreground sm:col-span-2">
          <MapPin className="size-3.5" />
          Field-level boundaries are managed in{" "}
          <Link to="/farms/fields" className="font-semibold text-primary underline-offset-4 hover:underline">
            Field Boundaries
          </Link>
          .
        </p>
      </SettingsCard>
    </form>
  );
}
