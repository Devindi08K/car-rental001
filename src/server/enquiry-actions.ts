"use server";

import { requireAdmin } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type EnquiryStatus = "NEW" | "CONTACTED" | "CLOSED";

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;
  try {
    await prisma.enquiry.update({ where: { id }, data: { status } });
    revalidatePath("/admin/enquiries");
    revalidatePath(`/admin/enquiries/${id}`);
    revalidatePath("/admin");
  } catch (err) {
    console.error("[updateEnquiryStatus]", err);
  }
}

export async function deleteEnquiry(id: string): Promise<void> {
  const admin = await requireAdmin();
  if (!admin) return;
  try {
    await prisma.enquiry.delete({ where: { id } });
    revalidatePath("/admin/enquiries");
    revalidatePath(`/admin/enquiries/${id}`);
    revalidatePath("/admin");
  } catch (err) {
    console.error("[deleteEnquiry]", err);
  }
}
