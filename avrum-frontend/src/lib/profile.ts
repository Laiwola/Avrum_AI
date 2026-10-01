import {
  UserRound, PencilLine, IdCard, ShieldCheck, BellRing, Languages, Palette,
  CreditCard, MonitorSmartphone, History, type LucideIcon,
} from "lucide-react";

export type ProfileSection = {
  label: string;
  to: string;
  icon: LucideIcon;
  description: string;
  badge?: string;
};

/** Sub-navigation for the profile / account area. */
export const profileSections: ProfileSection[] = [
  { label: "Overview", to: "/profile", icon: UserRound, description: "Your identity, farm role and account health at a glance." },
  { label: "Edit Profile", to: "/profile/edit", icon: PencilLine, description: "Update your name, photo, contact details and bio." },
  { label: "Account", to: "/profile/account", icon: IdCard, description: "Email, phone, organisation and account lifecycle." },
  { label: "Security", to: "/profile/security", icon: ShieldCheck, description: "Password, two-factor authentication and active sessions." },
  { label: "Notifications", to: "/profile/notifications", icon: BellRing, description: "Choose which advisories reach you and how." },
  { label: "Language", to: "/profile/language", icon: Languages, description: "Interface language, region, units and date format." },
  { label: "Appearance", to: "/profile/appearance", icon: Palette, description: "Theme, density and motion preferences." },
  { label: "Subscription", to: "/profile/subscription", icon: CreditCard, description: "Plan, usage and billing.", badge: "Soon" },
  { label: "Devices", to: "/profile/devices", icon: MonitorSmartphone, description: "Devices signed in to your AVRUM AI account.", badge: "Soon" },
  { label: "Activity Log", to: "/profile/activity", icon: History, description: "A record of every action on your account.", badge: "Soon" },
];

/** Presentation-only profile record — replaced by real account data later. */
export const currentProfile = {
  firstName: "Adeola",
  lastName: "Daramola",
  initials: "AD",
  role: "Agronomy Lead",
  organisation: "Sunrise Agro Cooperative",
  email: "adeola.daramola@sunriseagro.com",
  phone: "+234 800 000 0000",
  location: "Ibadan, Oyo State, Nigeria",
  language: "English",
  timezone: "Africa/Lagos (GMT+1)",
  memberSince: "March 2026",
  bio: "Leading agronomy for a 12-member cooperative across maize, cassava and cowpea rotations.",
};

export const profileFullName = `${currentProfile.firstName} ${currentProfile.lastName}`;
