import { requireAdmin } from "@/lib/auth-guard";
import { notFound } from "next/navigation";
import { VehicleForm } from "@/components/admin/VehicleForm";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export const instant = false;

export default async function EditVehiclePage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-cream mb-8">Edit Vehicle</h1>
      <VehicleForm vehicle={vehicle} />
    </div>
  );
}
