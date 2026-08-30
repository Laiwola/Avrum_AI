import { useMemo, useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  Bell,
  Building2,
  Cloud,
  Compass,
  Crosshair,
  Globe,
  Landmark,
  Languages,
  Leaf,
  MapPin,
  PartyPopper,
  PencilRuler,
  Ruler,
  Satellite,
  Sparkles,
  Sprout,
  Stethoscope,
  Tractor,
  Upload,
  User,
  Users,
  Wheat,
} from "lucide-react";

import { AuthField } from "@/components/auth";
import { MapPlaceholder } from "@/components/avrum";
import {
  AutosaveIndicator,
  OnboardingProgress,
  OnboardingShell,
  OptionCard,
  StepCard,
  StepNav,
  type OnboardingStepMeta,
} from "@/components/onboarding";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { onboardingService } from "@/lib/auth-service";
import { useAuth } from "@/components/auth/auth-provider";

const TITLE = "Set up your farm — AVRUM AI";
const DESCRIPTION =
  "Guided onboarding for new farmers: add your details, your first farm, crops, boundary, location and alert preferences.";

const STEPS: OnboardingStepMeta[] = [
  { id: "welcome", label: "Welcome to AVRUM AI", short: "Welcome" },
  { id: "user-type", label: "Select user type", short: "User type" },
  { id: "personal", label: "Personal information", short: "Personal" },
  { id: "farm-info", label: "Farming background", short: "Farming" },
  { id: "first-farm", label: "Add your first farm", short: "First farm" },
  { id: "crops", label: "Choose crops", short: "Crops" },
  { id: "boundary", label: "Draw farm boundary", short: "Boundary" },
  { id: "location", label: "Location", short: "Location" },
  { id: "language", label: "Preferred language", short: "Language" },
  { id: "notifications", label: "Notification preferences", short: "Alerts" },
  { id: "finish", label: "Finish setup", short: "Finish" },
];

const USER_TYPES = [
  { id: "smallholder", icon: Sprout, label: "Smallholder farmer", description: "I farm my own land, up to 5 hectares." },
  { id: "commercial", icon: Tractor, label: "Commercial farmer", description: "I run large or multi-site operations." },
  { id: "agronomist", icon: Stethoscope, label: "Agronomist / extension", description: "I advise farmers across many fields." },
  { id: "cooperative", icon: Users, label: "Cooperative / agribusiness", description: "I manage a group of member farms." },
];

const FARMING_TYPES = [
  { id: "crop", icon: Wheat, label: "Crop farming", description: "Arable, cereals, tubers, vegetables." },
  { id: "mixed", icon: Leaf, label: "Mixed farming", description: "Crops alongside livestock." },
  { id: "orchard", icon: Sprout, label: "Orchard / plantation", description: "Tree crops and perennials." },
  { id: "greenhouse", icon: Building2, label: "Protected cultivation", description: "Greenhouse or shade-net." },
];

const CROPS = [
  "Maize", "Rice", "Cassava", "Tomato", "Cocoa", "Yam",
  "Sorghum", "Soybean", "Pepper", "Groundnut", "Wheat", "Plantain",
];

const LANGUAGES = [
  { id: "en", label: "English", description: "Default advisory language." },
  { id: "ha", label: "Hausa", description: "Advisories and alerts in Hausa." },
  { id: "yo", label: "Yorùbá", description: "Advisories and alerts in Yorùbá." },
  { id: "ig", label: "Igbo", description: "Advisories and alerts in Igbo." },
  { id: "fr", label: "Français", description: "For francophone regions." },
  { id: "sw", label: "Kiswahili", description: "For East African regions." },
];

const NOTIFICATIONS = [
  { id: "disease", icon: Stethoscope, label: "Disease outbreak alerts", copy: "When pressure rises near your fields." },
  { id: "spray", icon: Cloud, label: "Spray window advisories", copy: "Weather-safe application timing." },
  { id: "satellite", icon: Satellite, label: "Satellite pass summaries", copy: "Vigour and stress after each pass." },
  { id: "market", icon: Landmark, label: "Market & input prices", copy: "Weekly price movement digest." },
];

type Draft = {
  userType: string;
  firstName: string;
  lastName: string;
  phone: string;
  experience: string;
  farmingType: string;
  farmName: string;
  farmSize: string;
  sizeUnit: string;
  ownership: string;
  crops: string[];
  boundaryNote: string;
  country: string;
  state: string;
  town: string;
  language: string;
  channel: string;
  alerts: string[];
};

const INITIAL_DRAFT: Draft = {
  userType: "",
  firstName: "",
  lastName: "",
  phone: "",
  experience: "",
  farmingType: "",
  farmName: "",
  farmSize: "",
  sizeUnit: "hectares",
  ownership: "",
  crops: [],
  boundaryNote: "",
  country: "",
  state: "",
  town: "",
  language: "en",
  channel: "push",
  alerts: ["disease", "spray"],
};

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OnboardingPage,
});

function OnboardingPage() {
  return (
    <ThemeProvider>
      <OnboardingWizard />
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}

function OnboardingWizard() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(INITIAL_DRAFT);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const toggle = (key: "crops" | "alerts", value: string) =>
    setDraft((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value)
        : [...prev[key], value],
    }));

  // Auto-save draft when it changes
  useEffect(() => {
    const saveTimer = setTimeout(async () => {
      if (step > 0 && step < STEPS.length - 1) {
        setIsSaving(true);
        try {
          await onboardingService.saveDraft({
            step,
            data: draft,
          });
          setLastSaved(new Date());
        } catch (error) {
          const axiosError = error as AxiosError<any>;
          console.error("Failed to save draft:", axiosError);
        } finally {
          setIsSaving(false);
        }
      }
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [draft, step]);

  const isLast = step === STEPS.length - 1;

  const canContinue = useMemo(() => {
    switch (STEPS[step]?.id) {
      case "user-type":
        return Boolean(draft.userType);
      case "personal":
        return Boolean(draft.firstName.trim() && draft.lastName.trim());
      case "farm-info":
        return Boolean(draft.farmingType);
      case "first-farm":
        return Boolean(draft.farmName.trim() && draft.farmSize.trim());
      case "crops":
        return draft.crops.length > 0;
      case "location":
        return Boolean(draft.country && draft.state.trim());
      default:
        return true;
    }
  }, [step, draft]);

  const goBack = () => {
    if (step === 0) return;
    setStep((value) => value - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goNext = async () => {
    if (isLast) {
      // Complete onboarding
      try {
        const response = await onboardingService.complete({
          draft,
          data: draft,
        });
        setUser(response.user);
        toast.success("Setup complete", { description: "Your workspace is ready." });
        void navigate({ to: "/dashboard" });
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        toast.error("Failed to complete onboarding", {
          description: axiosError.response?.data?.message || "Please try again",
        });
      }
      return;
    }
    setStep((value) => value + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveAndContinue = async () => {
    // Save current step before continuing
    try {
      await onboardingService.saveDraft({
        step,
        data: draft,
      });
      setLastSaved(new Date());
      toast.success("Progress saved", { description: "You can resume this setup anytime." });
      goNext();
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      toast.error("Failed to save progress", {
        description: axiosError.response?.data?.message || "Please try again",
      });
    }
  };

  return (
    <OnboardingShell steps={STEPS} current={step}>
      <OnboardingProgress steps={STEPS} current={step} className="mb-8" />

      <div key={STEPS[step]?.id} className="flex-1">
        {step === 0 && <WelcomeStep />}

        {step === 1 && (
          <StepCard
            icon={Users}
            title="Which best describes you?"
            description="We tailor advisories, units and dashboards to your role."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {USER_TYPES.map((type) => (
                <OptionCard
                  key={type.id}
                  icon={type.icon}
                  label={type.label}
                  description={type.description}
                  selected={draft.userType === type.id}
                  onSelect={() => set("userType", type.id)}
                />
              ))}
            </div>
          </StepCard>
        )}

        {step === 2 && (
          <StepCard
            icon={User}
            title="Personal information"
            description="Used on advisories, reports and field notes you share."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <AuthField id="firstName" label="First name">
                <Input
                  id="firstName"
                  value={draft.firstName}
                  placeholder="Amara"
                  onChange={(event) => set("firstName", event.target.value)}
                />
              </AuthField>
              <AuthField id="lastName" label="Last name">
                <Input
                  id="lastName"
                  value={draft.lastName}
                  placeholder="Okafor"
                  onChange={(event) => set("lastName", event.target.value)}
                />
              </AuthField>
              <AuthField
                id="phone"
                label="Phone number"
                optional
                hint="Used for SMS advisories when data is unavailable."
                className="sm:col-span-2"
              >
                <Input
                  id="phone"
                  type="tel"
                  value={draft.phone}
                  placeholder="+234 800 000 0000"
                  onChange={(event) => set("phone", event.target.value)}
                />
              </AuthField>
            </div>
          </StepCard>
        )}

        {step === 3 && (
          <StepCard
            icon={Tractor}
            title="Tell us about your farming"
            description="This calibrates recommendation depth and default field metrics."
          >
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {FARMING_TYPES.map((type) => (
                  <OptionCard
                    key={type.id}
                    icon={type.icon}
                    label={type.label}
                    description={type.description}
                    selected={draft.farmingType === type.id}
                    onSelect={() => set("farmingType", type.id)}
                  />
                ))}
              </div>

              <AuthField id="experience" label="Years of farming experience" optional>
                <Select value={draft.experience} onValueChange={(value) => set("experience", value)}>
                  <SelectTrigger id="experience">
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-2">Less than 2 years</SelectItem>
                    <SelectItem value="3-5">3 – 5 years</SelectItem>
                    <SelectItem value="6-10">6 – 10 years</SelectItem>
                    <SelectItem value="10+">More than 10 years</SelectItem>
                  </SelectContent>
                </Select>
              </AuthField>
            </div>
          </StepCard>
        )}

        {step === 4 && (
          <StepCard
            icon={Sprout}
            eyebrow={<Badge variant="ai" size="sm"><Sparkles /> First farm</Badge>}
            title="Add your first farm"
            description="You can add more farms and split them into fields later."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <AuthField id="farmName" label="Farm name" className="sm:col-span-2">
                <Input
                  id="farmName"
                  value={draft.farmName}
                  placeholder="Ogun Valley Farm"
                  onChange={(event) => set("farmName", event.target.value)}
                />
              </AuthField>
              <AuthField id="farmSize" label="Farm size">
                <Input
                  id="farmSize"
                  inputMode="decimal"
                  value={draft.farmSize}
                  placeholder="12.5"
                  onChange={(event) => set("farmSize", event.target.value)}
                />
              </AuthField>
              <AuthField id="sizeUnit" label="Unit">
                <Select value={draft.sizeUnit} onValueChange={(value) => set("sizeUnit", value)}>
                  <SelectTrigger id="sizeUnit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hectares">Hectares</SelectItem>
                    <SelectItem value="acres">Acres</SelectItem>
                    <SelectItem value="plots">Plots</SelectItem>
                  </SelectContent>
                </Select>
              </AuthField>
              <AuthField id="ownership" label="Ownership" optional className="sm:col-span-2">
                <Select value={draft.ownership} onValueChange={(value) => set("ownership", value)}>
                  <SelectTrigger id="ownership">
                    <SelectValue placeholder="Select ownership type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owned">Owned</SelectItem>
                    <SelectItem value="leased">Leased</SelectItem>
                    <SelectItem value="family">Family land</SelectItem>
                    <SelectItem value="managed">Managed for a client</SelectItem>
                  </SelectContent>
                </Select>
              </AuthField>
            </div>
          </StepCard>
        )}

        {step === 5 && (
          <StepCard
            icon={Wheat}
            title="Which crops do you grow?"
            description="Select all that apply — disease models load per crop."
          >
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {CROPS.map((crop) => (
                <OptionCard
                  key={crop}
                  label={crop}
                  selected={draft.crops.includes(crop)}
                  onSelect={() => toggle("crops", crop)}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {draft.crops.length} selected · you can refine crop varieties per field later.
            </p>
          </StepCard>
        )}

        {step === 6 && (
          <StepCard
            icon={PencilRuler}
            eyebrow={<Badge variant="muted" size="sm">Coming soon</Badge>}
            title="Draw your farm boundary"
            description="Trace your field on the map so satellite passes align to your land."
          >
            <div className="space-y-4">
              <MapPlaceholder
                label="Boundary drawing tool"
                caption="Interactive polygon drawing arrives with the mapping release."
              />
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="lg" disabled>
                  <PencilRuler /> Start drawing
                </Button>
                <Button variant="outline" size="lg" disabled>
                  <Upload /> Upload KML / shapefile
                </Button>
                <Button variant="ghost" size="lg" disabled>
                  <Crosshair /> Use current position
                </Button>
              </div>
              <AuthField
                id="boundaryNote"
                label="Describe your boundary"
                optional
                hint="Landmarks help our team verify your field outline."
              >
                <Textarea
                  id="boundaryNote"
                  rows={3}
                  value={draft.boundaryNote}
                  placeholder="Bordered by the river to the north and the access road to the east."
                  onChange={(event) => set("boundaryNote", event.target.value)}
                />
              </AuthField>
            </div>
          </StepCard>
        )}

        {step === 7 && (
          <StepCard
            icon={MapPin}
            title="Where is your farm?"
            description="Location drives weather, satellite tiles and outbreak proximity."
          >
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <AuthField id="country" label="Country">
                  <Select value={draft.country} onValueChange={(value) => set("country", value)}>
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ng">Nigeria</SelectItem>
                      <SelectItem value="gh">Ghana</SelectItem>
                      <SelectItem value="ke">Kenya</SelectItem>
                      <SelectItem value="tz">Tanzania</SelectItem>
                      <SelectItem value="za">South Africa</SelectItem>
                    </SelectContent>
                  </Select>
                </AuthField>
                <AuthField id="state" label="State / region">
                  <Input
                    id="state"
                    value={draft.state}
                    placeholder="Ogun"
                    onChange={(event) => set("state", event.target.value)}
                  />
                </AuthField>
                <AuthField id="town" label="Town / nearest landmark" optional className="sm:col-span-2">
                  <Input
                    id="town"
                    value={draft.town}
                    placeholder="Abeokuta"
                    onChange={(event) => set("town", event.target.value)}
                  />
                </AuthField>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3.5">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Compass className="size-4 text-sky" /> Prefer precise coordinates?
                </span>
                <Button variant="outline" size="sm" disabled>
                  <Crosshair /> Detect my location
                </Button>
              </div>
            </div>
          </StepCard>
        )}

        {step === 8 && (
          <StepCard
            icon={Languages}
            title="Preferred language"
            description="Advisories, alerts and reports are delivered in this language."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {LANGUAGES.map((language) => (
                <OptionCard
                  key={language.id}
                  icon={Globe}
                  label={language.label}
                  description={language.description}
                  selected={draft.language === language.id}
                  onSelect={() => set("language", language.id)}
                />
              ))}
            </div>
          </StepCard>
        )}

        {step === 9 && (
          <StepCard
            icon={Bell}
            title="Notification preferences"
            description="Choose what we send you. Everything is adjustable in settings."
          >
            <div className="space-y-5">
              <ul className="space-y-2.5">
                {NOTIFICATIONS.map(({ id, icon: Icon, label, copy }) => (
                  <li
                    key={id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-soft text-emerald">
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-foreground">{label}</span>
                      <span className="block text-xs text-muted-foreground">{copy}</span>
                    </span>
                    <Switch
                      checked={draft.alerts.includes(id)}
                      onCheckedChange={() => toggle("alerts", id)}
                      aria-label={label}
                    />
                  </li>
                ))}
              </ul>

              <AuthField id="channel" label="Preferred channel">
                <Select value={draft.channel} onValueChange={(value) => set("channel", value)}>
                  <SelectTrigger id="channel">
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="push">In-app push</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </AuthField>
            </div>
          </StepCard>
        )}

        {step === 10 && <FinishStep draft={draft} />}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <AutosaveIndicator signal={isSaving ? new Date() : lastSaved} />
        {!isLast && (
          <Link
            to="/dashboard"
            className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Skip setup
          </Link>
        )}
      </div>

      <StepNav
        onBack={goBack}
        onContinue={goNext}
        onSaveAndContinue={step > 0 ? saveAndContinue : undefined}
        backDisabled={step === 0}
        continueDisabled={!canContinue}
        continueLabel={isLast ? "Finish setup" : step === 0 ? "Get started" : "Continue"}
        isLast={isLast}
      />
    </OnboardingShell>
  );
}

function WelcomeStep() {
  const highlights = [
    { icon: Stethoscope, label: "AI Crop Doctor", copy: "Photo-to-diagnosis in seconds." },
    { icon: Satellite, label: "Satellite monitoring", copy: "Field vigour on every pass." },
    { icon: Ruler, label: "Field-level advisory", copy: "Spray and soil timing that fits your land." },
  ];

  return (
    <StepCard
      icon={Sparkles}
      eyebrow={<Badge variant="ai" size="sm"><Sparkles /> 3 minutes</Badge>}
      title="Welcome to AVRUM AI"
      description="Let's set up your farm profile so your first advisory lands today."
    >
      <ul className="grid gap-3 sm:grid-cols-3">
        {highlights.map(({ icon: Icon, label, copy }) => (
          <li key={label} className="rounded-xl border border-border bg-surface p-4">
            <span className="grid size-9 place-items-center rounded-lg bg-emerald-soft text-emerald">
              <Icon className="size-4" />
            </span>
            <p className="mt-3 text-sm font-semibold text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">{copy}</p>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground">
        Your answers are saved as you go — leave anytime and pick up where you stopped.
      </p>
    </StepCard>
  );
}

function FinishStep({ draft }: { draft: Draft }) {
  const summary = [
    { label: "Role", value: USER_TYPES.find((type) => type.id === draft.userType)?.label ?? "—" },
    { label: "Name", value: [draft.firstName, draft.lastName].filter(Boolean).join(" ") || "—" },
    { label: "Farm", value: draft.farmName || "—" },
    {
      label: "Size",
      value: draft.farmSize ? `${draft.farmSize} ${draft.sizeUnit}` : "—",
    },
    { label: "Crops", value: draft.crops.length ? draft.crops.join(", ") : "—" },
    {
      label: "Location",
      value: [draft.town, draft.state].filter(Boolean).join(", ") || "—",
    },
    { label: "Language", value: LANGUAGES.find((l) => l.id === draft.language)?.label ?? "—" },
    { label: "Alerts", value: `${draft.alerts.length} enabled · ${draft.channel}` },
  ];

  return (
    <StepCard
      icon={PartyPopper}
      eyebrow={<Badge variant="success" size="sm">Ready</Badge>}
      title="You're all set"
      description="Review your setup, then open your dashboard to see your first insights."
    >
      <dl className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
        {summary.map((item) => (
          <div key={item.label} className="bg-card p-3.5">
            <dt className="text-2xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {item.label}
            </dt>
            <dd className="mt-1 truncate text-sm font-semibold text-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>
    </StepCard>
  );
}
