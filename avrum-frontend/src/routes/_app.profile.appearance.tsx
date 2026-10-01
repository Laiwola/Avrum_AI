import { createFileRoute } from "@tanstack/react-router";
import { Palette, Sun, Moon, Type, Sparkles, LayoutGrid } from "lucide-react";

import { SettingsCard, SettingsRow, SettingsRowGroup } from "@/components/avrum";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/profile/appearance")({
  head: () => ({
    meta: [
      { title: "Appearance — AVRUM AI" },
      { name: "description", content: "Choose your AVRUM AI theme, interface density, text size and motion preferences." },
      { property: "og:title", content: "Appearance — AVRUM AI" },
      { property: "og:description", content: "Theme, interface density, text size and motion preferences." },
    ],
  }),
  component: AppearancePage,
});

function AppearancePage() {
  const { theme, toggleTheme } = useTheme();

  const options = [
    { value: "light" as const, label: "Light", description: "Bright fields, high contrast outdoors.", icon: Sun },
    { value: "dark" as const, label: "Dark", description: "Easier on the eyes at night.", icon: Moon },
  ];

  return (
    <div className="space-y-6">
      <SettingsCard
        title="Theme"
        description="Applies immediately and is remembered on this device."
        icon={Palette}
        tone="ai"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const active = theme === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  if (!active) toggleTheme();
                }}
                aria-pressed={active}
                className={cn(
                  "focus-ring flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                  active
                    ? "border-emerald bg-emerald-soft"
                    : "border-border bg-card hover:border-border-strong hover:bg-accent/50",
                )}
              >
                <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", active ? "bg-emerald text-emerald-foreground" : "bg-muted text-muted-foreground")}>
                  <option.icon className="size-5" />
                </span>
                <span className="min-w-0 space-y-0.5">
                  <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    {option.label}
                    {active && <Badge variant="ai" size="sm">Active</Badge>}
                  </span>
                  <span className="block text-sm text-muted-foreground">{option.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </SettingsCard>

      <SettingsCard
        title="Layout & density"
        description="Tune how much information fits on each screen."
        icon={LayoutGrid}
        tone="info"
      >
        <SettingsRowGroup>
          <SettingsRow
            icon={LayoutGrid}
            title="Interface density"
            description="Comfortable spacing, or compact for data-heavy screens."
            control={
              <Select defaultValue="comfortable">
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                </SelectContent>
              </Select>
            }
          />
          <SettingsRow
            icon={Type}
            title="Text size"
            description="Larger text improves readability in bright field conditions."
            control={
              <Select defaultValue="default">
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="xlarge">Extra large</SelectItem>
                </SelectContent>
              </Select>
            }
          />
          <SettingsRow
            title="Sidebar starts collapsed"
            description="Give charts and maps more horizontal room."
            control={<Switch />}
          />
        </SettingsRowGroup>
      </SettingsCard>

      <SettingsCard
        title="Motion & accessibility"
        description="Reduce animation or increase contrast for easier reading."
        icon={Sparkles}
      >
        <SettingsRowGroup>
          <SettingsRow title="Reduce motion" description="Disable transitions and animated charts." control={<Switch />} />
          <SettingsRow title="High contrast" description="Stronger borders and text contrast throughout." control={<Switch />} />
        </SettingsRowGroup>
      </SettingsCard>
    </div>
  );
}
