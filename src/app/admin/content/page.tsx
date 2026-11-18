import { requireAdmin } from "@/lib/auth-guard";
import { getSelfDriveContent } from "@/lib/content";
import { ContentForm } from "@/components/admin/ContentForm";

export default async function AdminContentPage() {
  await requireAdmin();
  const content = await getSelfDriveContent();
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-cream mb-3">Page Content</h1>
      <p className="text-muted text-sm mb-8">Edit the Self-Drive Rental page content. Changes are live immediately.</p>
      <ContentForm content={content} />
    </div>
  );
}
