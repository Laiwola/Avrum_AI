import {
  LayoutDashboard, TerminalSquare, Boxes, KeyRound, BarChart3, BookOpen,
  ScrollText, Webhook, Users, CreditCard, Settings, Sprout, Bug, Sparkles,
  Satellite, FlaskConical, SprayCan, type LucideIcon,
} from "lucide-react";

export type DevNavItem = { label: string; to: string; icon: LucideIcon; badge?: string };
export type DevNavGroup = { label: string; items: DevNavItem[] };

export const developerNavGroups: DevNavGroup[] = [
  {
    label: "Build",
    items: [
      { label: "Overview", to: "/developer", icon: LayoutDashboard },
      { label: "API Playground", to: "/developer/playground", icon: TerminalSquare, badge: "Beta" },
      { label: "API Products", to: "/developer/api-products", icon: Boxes },
      { label: "API Keys", to: "/developer/api-keys", icon: KeyRound },
    ],
  },
  {
    label: "Operate",
    items: [
      { label: "Usage", to: "/developer/usage", icon: BarChart3 },
      { label: "Documentation", to: "/developer/docs", icon: BookOpen },
      { label: "Logs", to: "/developer/logs", icon: ScrollText },
      { label: "Webhooks", to: "/developer/webhooks", icon: Webhook },
    ],
  },
  {
    label: "Organization",
    items: [
      { label: "Team", to: "/developer/team", icon: Users },
      { label: "Billing", to: "/developer/billing", icon: CreditCard },
      { label: "Settings", to: "/developer/settings", icon: Settings },
    ],
  },
];

export const developerMobileNavItems: DevNavItem[] = [
  { label: "Overview", to: "/developer", icon: LayoutDashboard },
  { label: "Playground", to: "/developer/playground", icon: TerminalSquare },
  { label: "APIs", to: "/developer/api-products", icon: Boxes },
  { label: "Keys", to: "/developer/api-keys", icon: KeyRound },
  { label: "Usage", to: "/developer/usage", icon: BarChart3 },
];

export type ApiStatus = "stable" | "beta" | "preview" | "coming-soon";

export type ApiProduct = {
  slug: string;
  name: string;
  description: string;
  status: ApiStatus;
  icon: LucideIcon;
  tone: "default" | "ai" | "info" | "warning";
  capabilities: string[];
  endpoint: { method: "GET" | "POST"; path: string };
  requests: string;
};

/** Mock catalogue — no backend wired yet. */
export const apiProducts: ApiProduct[] = [
  {
    slug: "crop-intelligence",
    name: "Crop Intelligence",
    description:
      "Crop growth stages, yield outlook and field-level agronomic scoring for any coordinate or boundary.",
    status: "stable",
    icon: Sprout,
    tone: "default",
    capabilities: ["Growth stage detection", "Yield forecasting", "Crop calendar generation"],
    endpoint: { method: "POST", path: "/v1/crop/analyze" },
    requests: "128,400",
  },
  {
    slug: "disease-intelligence",
    name: "Disease Intelligence",
    description:
      "Regional outbreak signals, disease risk scoring and a structured pathogen knowledge base.",
    status: "stable",
    icon: Bug,
    tone: "warning",
    capabilities: ["Outbreak risk scoring", "Pathogen lookup", "Regional alerts"],
    endpoint: { method: "GET", path: "/v1/disease/risk" },
    requests: "96,210",
  },
  {
    slug: "agricultural-ai",
    name: "Agricultural AI",
    description:
      "Multimodal agronomy models: crop image diagnosis, advisory generation and natural language answers.",
    status: "beta",
    icon: Sparkles,
    tone: "ai",
    capabilities: ["Image diagnosis", "Advisory generation", "Agronomy Q&A"],
    endpoint: { method: "POST", path: "/v1/ai/diagnose" },
    requests: "204,873",
  },
  {
    slug: "satellite-intelligence",
    name: "Satellite Intelligence",
    description:
      "NDVI, moisture and canopy indices derived from multi-source satellite passes over your fields.",
    status: "beta",
    icon: Satellite,
    tone: "info",
    capabilities: ["NDVI time series", "Field change detection", "Cloud-free composites"],
    endpoint: { method: "GET", path: "/v1/satellite/ndvi" },
    requests: "61,905",
  },
  {
    slug: "soil-intelligence",
    name: "Soil Intelligence",
    description:
      "Soil texture, pH, organic carbon and nutrient estimates with fertiliser recommendation logic.",
    status: "preview",
    icon: FlaskConical,
    tone: "default",
    capabilities: ["Soil property estimates", "Nutrient gap analysis", "Fertiliser plans"],
    endpoint: { method: "GET", path: "/v1/soil/profile" },
    requests: "18,442",
  },
  {
    slug: "spray-intelligence",
    name: "Spray Intelligence",
    description:
      "Weather-aware spray windows, drift risk and product suitability for protection programmes.",
    status: "coming-soon",
    icon: SprayCan,
    tone: "info",
    capabilities: ["Spray window scoring", "Drift risk", "Product suitability"],
    endpoint: { method: "POST", path: "/v1/spray/windows" },
    requests: "—",
  },
];

export type ApiActivity = {
  id: string;
  method: "GET" | "POST";
  path: string;
  status: number;
  latency: string;
  key: string;
  time: string;
};

export const recentApiActivity: ApiActivity[] = [
  { id: "1", method: "POST", path: "/v1/ai/diagnose", status: 200, latency: "412 ms", key: "prod_live_a91", time: "12s ago" },
  { id: "2", method: "GET", path: "/v1/satellite/ndvi", status: 200, latency: "186 ms", key: "prod_live_a91", time: "48s ago" },
  { id: "3", method: "POST", path: "/v1/crop/analyze", status: 200, latency: "233 ms", key: "sandbox_7f2", time: "2m ago" },
  { id: "4", method: "GET", path: "/v1/disease/risk", status: 429, latency: "38 ms", key: "sandbox_7f2", time: "5m ago" },
  { id: "5", method: "GET", path: "/v1/soil/profile", status: 200, latency: "147 ms", key: "prod_live_a91", time: "9m ago" },
  { id: "6", method: "POST", path: "/v1/ai/diagnose", status: 500, latency: "1.2 s", key: "prod_live_a91", time: "14m ago" },
];

export const gettingStartedSteps = [
  { id: "account", title: "Create your developer account", description: "Your workspace is ready to build with.", done: true },
  { id: "key", title: "Generate a sandbox API key", description: "Sandbox keys are free and rate limited to 1,000 requests/day.", done: true },
  { id: "call", title: "Make your first API call", description: "Try the Crop Intelligence endpoint from the playground.", done: false },
  { id: "webhook", title: "Register a webhook", description: "Receive outbreak and advisory events in real time.", done: false },
  { id: "prod", title: "Request production access", description: "Move from sandbox to live traffic once verified.", done: false },
];
