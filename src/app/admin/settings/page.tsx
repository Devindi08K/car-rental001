import { requireAdmin } from "@/lib/auth-guard";
import { getSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const instant = false;

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSettings();
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-cream mb-8">Site Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
