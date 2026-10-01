import {
  LayoutDashboard, Sprout, Stethoscope, Bug, SprayCan, Satellite, FlaskConical,
  Bell, Settings, LifeBuoy, ShieldCheck, UserRound, type LucideIcon,
} from "lucide-react";


export type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
  adminOnly?: boolean;
  children?: { label: string; to: string }[];
};

export type NavGroup = { label: string; items: NavItem[] };

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
      {
        label: "My Farms",
        to: "/farms",
        icon: Sprout,
        children: [
          { label: "All Farms", to: "/farms" },
          { label: "Field Boundaries", to: "/farms/fields" },
          { label: "Crop Calendar", to: "/farms/calendar" },
        ],
      },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "AI Crop Doctor", to: "/crop-doctor", icon: Stethoscope, badge: "AI" },
      {
        label: "Disease Intelligence",
        to: "/disease-intelligence",
        icon: Bug,
        children: [
          { label: "Outbreak Map", to: "/disease-intelligence" },
          { label: "Disease Library", to: "/disease-intelligence/library" },
        ],
      },
      { label: "Spray Recommendation", to: "/spray-recommendation", icon: SprayCan },
      { label: "Satellite Monitoring", to: "/satellite-monitoring", icon: Satellite },
      { label: "Soil Intelligence", to: "/soil-intelligence", icon: FlaskConical },
    ],
  },
  {
    label: "Workspace",
    items: [
      { label: "Notifications", to: "/notifications", icon: Bell, badge: "3" },
      {
        label: "Profile",
        to: "/profile",
        icon: UserRound,
        children: [
          { label: "Overview", to: "/profile" },
          { label: "Edit Profile", to: "/profile/edit" },
          { label: "Account", to: "/profile/account" },
          { label: "Security", to: "/profile/security" },
          { label: "Notifications", to: "/profile/notifications" },
          { label: "Language", to: "/profile/language" },
          { label: "Appearance", to: "/profile/appearance" },
          { label: "Subscription", to: "/profile/subscription" },
          { label: "Devices", to: "/profile/devices" },
          { label: "Activity Log", to: "/profile/activity" },
        ],
      },
      { label: "Settings", to: "/settings", icon: Settings },
      { label: "Help Center", to: "/help", icon: LifeBuoy },
      { label: "Admin", to: "/admin", icon: ShieldCheck, adminOnly: true },

    ],
  },
];

export const mobileNavItems: NavItem[] = [
  { label: "Home", to: "/dashboard", icon: LayoutDashboard },
  { label: "Farms", to: "/farms", icon: Sprout },
  { label: "Doctor", to: "/crop-doctor", icon: Stethoscope },
  { label: "Satellite", to: "/satellite-monitoring", icon: Satellite },
  { label: "Alerts", to: "/notifications", icon: Bell },
];
