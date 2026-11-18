import { AdminNav } from "@/components/admin/AdminNav";
import { connection } from "next/server";
import { Suspense } from "react";

export const instant = false;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await connection();
  return (
    <div className="min-h-screen bg-charcoal flex flex-col lg:flex-row">
      <AdminNav />
      <Suspense fallback={<main className="flex-1 p-6 lg:p-10"><div className="h-8 w-48 animate-pulse bg-charcoal-700" /></main>}>
        <main className="flex-1 p-6 lg:p-10 overflow-auto">{children}</main>
      </Suspense>
    </div>
  );
}
