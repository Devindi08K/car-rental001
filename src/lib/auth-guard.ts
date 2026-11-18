import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function requireAdmin() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  const admin = email ? await prisma.adminUser.findUnique({ where: { email } }) : null;
  if (!admin) redirect("/admin/login");
  return admin;
}