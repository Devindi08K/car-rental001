"use server";

import { AuthError, CredentialsSignin } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signIn, signOut } from "@/auth";
import { loginSchema } from "@/lib/validators";

export type LoginState = { error?: string };

function locked(error: unknown) {
  if (error instanceof CredentialsSignin && error.code === "locked") return true;
  if (error instanceof AuthError && error.cause instanceof CredentialsSignin) {
    return error.cause.code === "locked";
  }
  return false;
}

export async function loginAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Invalid email or password." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/admin",
    });
    return {};
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (locked(error)) return { error: "Too many attempts. Please try again later." };
    if (!(error instanceof AuthError) && !(error instanceof CredentialsSignin)) {
      console.error("login_action_failed", error);
    }
    return { error: "Invalid email or password." };
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
