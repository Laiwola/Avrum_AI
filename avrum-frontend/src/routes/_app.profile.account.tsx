import { createFileRoute, Link } from "@tanstack/react-router";
import { IdCard, Mail, Phone, Users, Download, Trash2, LogOut, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { SettingsCard, SettingsRow, SettingsRowGroup } from "@/components/avrum";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { currentProfile } from "@/lib/profile";

export const Route = createFileRoute("/_app/profile/account")({
  head: () => ({
    meta: [
      { title: "Account Settings — AVRUM AI" },
      { name: "description", content: "Manage your AVRUM AI account: email, phone, organisation membership, data export and account deletion." },
      { property: "og:title", content: "Account Settings — AVRUM AI" },
      { property: "og:description", content: "Email, phone, organisation membership, data export and account deletion." },
    ],
  }),
  component: AccountSettingsPage,
});

function AccountSettingsPage() {
  return (
    <div className="space-y-6">
      <SettingsCard
        title="Account identity"
        description="The credentials that identify your AVRUM AI account."
        icon={IdCard}
      >
        <SettingsRowGroup>
          <SettingsRow
            icon={Mail}
            title="Email address"
            description={currentProfile.email}
            control={
              <>
                <Badge variant="success" size="sm">Verified</Badge>
                <Button variant="outline" size="sm" asChild><Link to="/profile/edit">Change</Link></Button>
              </>
            }
          />
          <SettingsRow
            icon={Phone}
            title="Phone number"
            description={currentProfile.phone}
            control={
              <>
                <Badge variant="warning" size="sm">Unverified</Badge>
                <Button variant="outline" size="sm" onClick={() => toast.info("Verification code sent", { description: "Check your SMS messages." })}>
                  Verify
                </Button>
              </>
            }
          />
          <SettingsRow
            icon={IdCard}
            title="Account ID"
            description="avrum-usr-8f42c1"
            control={<Badge variant="muted" size="sm">Read only</Badge>}
          />
        </SettingsRowGroup>
      </SettingsCard>

      <SettingsCard
        title="Organisation"
        description="Your membership and role within a cooperative or agribusiness."
        icon={Users}
        tone="info"
      >
        <SettingsRowGroup>
          <SettingsRow title={currentProfile.organisation} description={`${currentProfile.role} · 12 members`} control={<Badge variant="info" size="sm">Active</Badge>} />
          <SettingsRow
            title="Leave organisation"
            description="You will lose access to shared farms and advisories."
            control={<Button variant="outline" size="sm"><LogOut /> Leave</Button>}
          />
        </SettingsRowGroup>
      </SettingsCard>

      <SettingsCard
        title="Your data"
        description="Export everything AVRUM AI holds about your account and farms."
        icon={Download}
      >
        <SettingsRowGroup>
          <SettingsRow
            title="Export account data"
            description="A machine-readable archive of your profile, farms, diagnoses and advisories."
            control={
              <Button variant="outline" size="sm" onClick={() => toast.success("Export requested", { description: "We'll email you a download link shortly." })}>
                <Download /> Request export
              </Button>
            }
          />
        </SettingsRowGroup>
      </SettingsCard>

      <SettingsCard
        title="Danger zone"
        description="Irreversible actions that affect your entire account."
        icon={ShieldAlert}
        tone="danger"
      >
        <SettingsRowGroup>
          <SettingsRow
            title="Delete account"
            description="Permanently removes your profile, farms, field boundaries and diagnosis history."
            control={
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm"><Trash2 /> Delete account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete your AVRUM AI account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This cannot be undone. All farms, field boundaries, diagnoses and advisory
                      history tied to this account will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => toast.error("Account deletion is not available yet.")}>
                      Delete permanently
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            }
          />
        </SettingsRowGroup>
      </SettingsCard>
    </div>
  );
}
