import { requireAdmin } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatLkr, categoryLabel, statusLabel } from "@/lib/format";
import { toggleVehicleStatus, deleteVehicle, moveVehicle } from "@/server/vehicle-actions";

export const instant = false;
import { DeleteVehicleButton } from "@/components/admin/DeleteVehicleButton";

export default async function AdminVehiclesPage() {
  await requireAdmin();
  const vehicles = await prisma.vehicle.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-cream">Vehicles</h1>
        <Link
          href="/admin/vehicles/new"
          className="bg-gold text-charcoal font-semibold px-5 py-2.5 rounded-lg hover:bg-gold-dark transition-colors text-sm"
        >
          + Add Vehicle
        </Link>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-20 text-muted">
          No vehicles yet. <Link href="/admin/vehicles/new" className="text-gold hover:underline">Add one.</Link>
        </div>
      ) : (
        <div className="bg-charcoal-800 border border-charcoal-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-charcoal-700 text-xs text-muted uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left hidden md:table-cell">Category</th>
                <th className="px-5 py-3 text-left hidden lg:table-cell">Price/day</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v, i) => (
                <tr key={v.id} className="border-b border-charcoal-700 last:border-0 hover:bg-charcoal-700/30">
                  <td className="px-5 py-3">
                    <div className="text-cream font-medium">{v.name}</div>
                    <div className="text-muted text-xs">{v.slug}</div>
                  </td>
                  <td className="px-5 py-3 text-muted hidden md:table-cell">{categoryLabel(v.category)}</td>
                  <td className="px-5 py-3 text-muted hidden lg:table-cell">{formatLkr(v.pricePerDay)}</td>
                  <td className="px-5 py-3">
                    {/* Toggle status — passes id via hidden input */}
                    <form action={toggleVehicleStatus}>
                      <input type="hidden" name="id" value={v.id} />
                      <button
                        type="submit"
                        className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors cursor-pointer ${
                          v.status === "AVAILABLE"
                            ? "bg-green-900/30 text-green-400 border-green-700/40 hover:bg-green-800/40"
                            : "bg-red-900/30 text-red-400 border-red-700/40 hover:bg-red-800/40"
                        }`}
                        title="Click to toggle"
                      >
                        {statusLabel(v.status)}
                      </button>
                    </form>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {i > 0 && (
                        <form action={moveVehicle}>
                          <input type="hidden" name="id" value={v.id} />
                          <input type="hidden" name="direction" value="up" />
                          <button type="submit" title="Move up" className="text-muted hover:text-gold text-xs px-1.5">▲</button>
                        </form>
                      )}
                      {i < vehicles.length - 1 && (
                        <form action={moveVehicle}>
                          <input type="hidden" name="id" value={v.id} />
                          <input type="hidden" name="direction" value="down" />
                          <button type="submit" title="Move down" className="text-muted hover:text-gold text-xs px-1.5">▼</button>
                        </form>
                      )}
                      <Link href={`/admin/vehicles/${v.id}/edit`} className="text-gold hover:underline text-xs">Edit</Link>
                      <Link href={`/vehicles/${v.slug}`} target="_blank" className="text-muted hover:text-gold text-xs">↗</Link>
                      <form action={deleteVehicle}>
                        <input type="hidden" name="id" value={v.id} />
                        <DeleteVehicleButton name={v.name} />
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
