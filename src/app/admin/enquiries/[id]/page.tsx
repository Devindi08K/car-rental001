import { requireAdmin } from "@/lib/auth-guard";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { label } from "@/lib/format";
import { updateEnquiryStatus, deleteEnquiry } from "@/server/enquiry-actions";
import { DeleteEnquiryButton } from "@/components/admin/DeleteEnquiryButton";

type Props = { params: Promise<{ id: string }> };

export default async function EnquiryDetailPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const enquiry = await prisma.enquiry.findUnique({
    where: { id },
    include: { vehicle: { select: { name: true, slug: true } } },
  });
  if (!enquiry) notFound();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/enquiries" className="text-muted hover:text-gold text-sm">← Back</Link>
        <h1 className="font-display text-3xl font-bold text-cream">Enquiry</h1>
      </div>

      <div className="bg-charcoal-800 border border-charcoal-700 rounded-xl p-6 space-y-5">
        <dl className="grid grid-cols-2 gap-5">
          <div>
            <dt className="text-xs text-muted uppercase tracking-wide mb-1">Name</dt>
            <dd className="text-cream">{enquiry.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted uppercase tracking-wide mb-1">Phone</dt>
            <dd className="text-cream">
              <a href={`tel:${enquiry.phone}`} className="hover:text-gold">{enquiry.phone}</a>
            </dd>
          </div>
          {enquiry.email && (
            <div>
              <dt className="text-xs text-muted uppercase tracking-wide mb-1">Email</dt>
              <dd className="text-cream">
                <a href={`mailto:${enquiry.email}`} className="hover:text-gold">{enquiry.email}</a>
              </dd>
            </div>
          )}
          <div>
            <dt className="text-xs text-muted uppercase tracking-wide mb-1">Status</dt>
            <dd>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                enquiry.status === "NEW" ? "bg-gold/10 text-gold border-gold/30" :
                enquiry.status === "CONTACTED" ? "bg-blue-900/30 text-blue-400 border-blue-700/30" :
                "bg-charcoal-700 text-muted border-charcoal-600"
              }`}>{label(enquiry.status)}</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted uppercase tracking-wide mb-1">Vehicle</dt>
            <dd className="text-cream">
              {enquiry.vehicle ? (
                <Link href={`/vehicles/${enquiry.vehicle.slug}`} target="_blank" className="hover:text-gold">
                  {enquiry.vehicle.name}
                </Link>
              ) : "Not specified"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted uppercase tracking-wide mb-1">Date</dt>
            <dd className="text-cream">{new Date(enquiry.createdAt).toLocaleString("en-GB")}</dd>
          </div>
        </dl>

        <div>
          <dt className="text-xs text-muted uppercase tracking-wide mb-2">Message</dt>
          <div className="bg-charcoal-700 rounded-lg p-4 text-cream text-sm leading-relaxed whitespace-pre-wrap">
            {enquiry.message}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-6">
        {enquiry.status !== "CONTACTED" && (
          <form action={updateEnquiryStatus.bind(null, enquiry.id, "CONTACTED")}>
            <button type="submit" className="bg-blue-700 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
              Mark Contacted
            </button>
          </form>
        )}
        {enquiry.status !== "CLOSED" && (
          <form action={updateEnquiryStatus.bind(null, enquiry.id, "CLOSED")}>
            <button type="submit" className="bg-charcoal-700 hover:bg-charcoal-600 text-muted hover:text-cream px-5 py-2 rounded-lg text-sm font-medium transition-colors">
              Close Enquiry
            </button>
          </form>
        )}
        <form action={updateEnquiryStatus.bind(null, enquiry.id, "NEW")}>
          <button type="submit" className="border border-gold text-gold px-5 py-2 rounded-lg text-sm font-medium hover:bg-gold hover:text-charcoal transition-colors">
            Reset to New
          </button>
        </form>
        <form action={deleteEnquiry.bind(null, enquiry.id)}>
          <DeleteEnquiryButton detail />
        </form>
      </div>
    </div>
  );
}
