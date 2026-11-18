import { requireAdmin } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const instant = false;

export default async function AdminDashboard() {
  await requireAdmin();

  const [vehicleCount, enquiryCount, newEnquiries, galleryCount] = await Promise.all([
    prisma.vehicle.count(),
    prisma.enquiry.count(),
    prisma.enquiry.count({ where: { status: "NEW" } }),
    prisma.galleryImage.count(),
  ]);

  const stats = [
    { label: "Vehicles", value: vehicleCount, href: "/admin/vehicles", icon: "🚗" },
    { label: "Total Enquiries", value: enquiryCount, href: "/admin/enquiries", icon: "📩" },
    { label: "New Enquiries", value: newEnquiries, href: "/admin/enquiries", icon: "🔔", highlight: newEnquiries > 0 },
    { label: "Gallery Images", value: galleryCount, href: "/admin/gallery", icon: "🖼️" },
  ];

  const recentEnquiries = await prisma.enquiry.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { vehicle: { select: { name: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-cream mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`bg-charcoal-800 border rounded-xl p-6 hover:border-gold/40 transition-colors ${
              s.highlight ? "border-gold/50 bg-gold/5" : "border-charcoal-700"
            }`}
          >
            <div className="text-3xl mb-3">{s.icon}</div>
            <div className={`font-display text-3xl font-bold mb-1 ${s.highlight ? "text-gold" : "text-cream"}`}>
              {s.value}
            </div>
            <div className="text-muted text-sm">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent enquiries */}
      <div className="bg-charcoal-800 border border-charcoal-700 rounded-xl">
        <div className="px-6 py-4 border-b border-charcoal-700 flex items-center justify-between">
          <h2 className="font-semibold text-cream">Recent Enquiries</h2>
          <Link href="/admin/enquiries" className="text-gold text-xs hover:underline">View all</Link>
        </div>
        {recentEnquiries.length === 0 ? (
          <p className="px-6 py-8 text-muted text-sm">No enquiries yet.</p>
        ) : (
          <ul>
            {recentEnquiries.map((e, i) => (
              <li key={e.id} className={`px-6 py-4 ${i < recentEnquiries.length - 1 ? "border-b border-charcoal-700" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-cream font-medium text-sm">{e.name}</p>
                    <p className="text-muted text-xs mt-0.5">{e.phone}{e.vehicle ? ` · ${e.vehicle.name}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      e.status === "NEW" ? "bg-gold/10 text-gold border-gold/30" :
                      e.status === "CONTACTED" ? "bg-blue-900/30 text-blue-400 border-blue-700/30" :
                      "bg-charcoal-700 text-muted border-charcoal-600"
                    }`}>
                      {e.status}
                    </span>
                    <Link href={`/admin/enquiries/${e.id}`} className="text-xs text-gold hover:underline">View</Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
