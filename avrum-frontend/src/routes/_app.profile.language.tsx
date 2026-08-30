import { createFileRoute } from "@tanstack/react-router";
import { Languages, Globe, Ruler, CalendarDays, Save } from "lucide-react";
import { toast } from "sonner";

import { SettingsCard, SettingsField, SettingsRow, SettingsRowGroup } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/profile/language")({
  head: () => ({
    meta: [
      { title: "Language & Region — AVRUM AI" },
      { name: "description", content: "Set your interface language, region, measurement units and date format for AVRUM AI." },
      { property: "og:title", content: "Language & Region — AVRUM AI" },
      { property: "og:description", content: "Interface language, region, measurement units and date format." },
    ],
  }),
  component: LanguagePage,
});

const languages = [
  { value: "en", label: "English", note: "Default" },
  { value: "fr", label: "Français", note: "Francophone West Africa" },
  { value: "ha", label: "Hausa", note: "Northern Nigeria, Niger" },
  { value: "sw", label: "Kiswahili", note: "East Africa" },
  { value: "yo", label: "Yorùbá", note: "South-West Nigeria" },
];

function LanguagePage() {
  return (
    <div className="space-y-6">
      <SettingsCard
        title="Interface language"
        description="Applies to the dashboard, advisories and notification text."
        icon={Languages}
      >
        <RadioGroup defaultValue="en" className="grid gap-3 sm:grid-cols-2">
          {languages.map((lang) => (
            <Label
              key={lang.value}
              htmlFor={`lang-${lang.value}`}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors",
                "hover:border-border-strong hover:bg-accent/50 has-[:checked]:border-emerald has-[:checked]:bg-emerald-soft",
              )}
            >
              <RadioGroupItem value={lang.value} id={`lang-${lang.value}`} />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground">{lang.label}</span>
                <span className="block text-xs text-muted-foreground">{lang.note}</span>
              </span>
            </Label>
          ))}
        </RadioGroup>
      </SettingsCard>

      <SettingsCard
        title="Region & formats"
        description="How dates, numbers and measurements are displayed."
        icon={Globe}
        tone="info"
        contentClassName="grid gap-4 sm:grid-cols-2"
        footer={<Button variant="ai" onClick={() => toast.success("Language and region saved")}><Save /> Save preferences</Button>}
      >
        <SettingsField label="Region">
          <Select defaultValue="ng">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ng">Nigeria</SelectItem>
              <SelectItem value="gh">Ghana</SelectItem>
              <SelectItem value="ke">Kenya</SelectItem>
              <SelectItem value="tz">Tanzania</SelectItem>
            </SelectContent>
          </Select>
        </SettingsField>
        <SettingsField label="Timezone">
          <Select defaultValue="lagos">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="lagos">Africa/Lagos (GMT+1)</SelectItem>
              <SelectItem value="accra">Africa/Accra (GMT)</SelectItem>
              <SelectItem value="nairobi">Africa/Nairobi (GMT+3)</SelectItem>
            </SelectContent>
          </Select>
        </SettingsField>
        <SettingsField label="Date format">
          <Select defaultValue="dmy">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="dmy">31/12/2026</SelectItem>
              <SelectItem value="mdy">12/31/2026</SelectItem>
              <SelectItem value="iso">2026-12-31</SelectItem>
            </SelectContent>
          </Select>
        </SettingsField>
        <SettingsField label="First day of week">
          <Select defaultValue="mon">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="mon">Monday</SelectItem>
              <SelectItem value="sun">Sunday</SelectItem>
            </SelectContent>
          </Select>
        </SettingsField>
      </SettingsCard>

      <SettingsCard
        title="Measurement units"
        description="Used across field areas, rainfall, temperature and spray volumes."
        icon={Ruler}
      >
        <SettingsRowGroup>
          <SettingsRow
            icon={Ruler}
            title="Area"
            description="Hectares instead of acres."
            control={<Switch defaultChecked />}
          />
          <SettingsRow
            icon={CalendarDays}
            title="Temperature"
            description="Celsius instead of Fahrenheit."
            control={<Switch defaultChecked />}
          />
          <SettingsRow
            icon={Ruler}
            title="Rainfall"
            description="Millimetres instead of inches."
            control={<Switch defaultChecked />}
          />
          <SettingsRow
            title="Auto-detect from device"
            description="Match units and language to your device settings on next sign-in."
            control={<Badge variant="muted" size="sm">Off</Badge>}
          />
        </SettingsRowGroup>
      </SettingsCard>
    </div>
  );
}
