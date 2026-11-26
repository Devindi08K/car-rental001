import { requireAdmin } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { label } from "@/lib/format";
import { updateEnquiryStatus, deleteEnquiry } from "@/server/enquiry-actions";
import { DeleteEnquiryButton } from "@/components/admin/DeleteEnquiryButton";

export const instant = false;

export default async function AdminEnquiriesPage() {
  await requireAdmin();
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { vehicle: { select: { name: true, slug: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-cream mb-8">Enquiries</h1>
      {enquiries.length === 0 ? (
        <p className="text-muted py-16 text-center">No enquiries yet.</p>
      ) : (
        <div className="overflow-x-auto bg-charcoal-800 border border-charcoal-700 rounded-xl">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-charcoal-700 text-xs text-muted uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left">From</th>
                <th className="px-5 py-3 text-left hidden md:table-cell">Vehicle</th>
                <th className="px-5 py-3 text-left hidden lg:table-cell">Date</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((e) => (
                <tr key={e.id} className="border-b border-charcoal-700 last:border-0 hover:bg-charcoal-700/30">
                  <td className="px-5 py-3">
                    <p className="text-cream font-medium">{e.name}</p>
                    <p className="text-muted text-xs">{e.phone}</p>
                    {e.email && <p className="text-muted text-xs">{e.email}</p>}
                  </td>
                  <td className="px-5 py-3 text-muted hidden md:table-cell">
                    {e.vehicle ? (
                      <Link href={`/vehicles/${e.vehicle.slug}`} target="_blank" className="hover:text-gold">
                        {e.vehicle.name}
                      </Link>
                    ) : "—"}
                  </td>
                  <td className="px-5 py-3 text-muted text-xs hidden lg:table-cell">
                    {new Date(e.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      e.status === "NEW" ? "bg-gold/10 text-gold border-gold/30" :
                      e.status === "CONTACTED" ? "bg-blue-900/30 text-blue-400 border-blue-700/30" :
                      "bg-charcoal-700 text-muted border-charcoal-600"
                    }`}>{label(e.status)}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/admin/enquiries/${e.id}`} className="text-gold hover:underline text-xs">View</Link>
                      {e.status !== "CONTACTED" && (
                        <form action={updateEnquiryStatus.bind(null, e.id, "CONTACTED")}>
                          <button type="submit" className="text-blue-400 hover:underline text-xs">Mark Contacted</button>
                        </form>
                      )}
                      {e.status !== "CLOSED" && (
                        <form action={updateEnquiryStatus.bind(null, e.id, "CLOSED")}>
                          <button type="submit" className="text-muted hover:text-cream text-xs">Close</button>
                        </form>
                      )}
                      <form action={deleteEnquiry.bind(null, e.id)}>
                        <DeleteEnquiryButton />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
