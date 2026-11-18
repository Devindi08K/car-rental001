import { requireAdmin } from "@/lib/auth-guard";
import { VehicleForm } from "@/components/admin/VehicleForm";

export const instant = false;

export default async function NewVehiclePage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-cream mb-8">Add Vehicle</h1>
      <VehicleForm />
    </div>
  );
}
