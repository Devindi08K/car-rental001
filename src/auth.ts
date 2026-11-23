import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  assertLoginAllowed,
  clientIpFromHeaders,
  failureDelay,
  recordLoginFailure,
  recordLoginSuccess,
} from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validators";

class LoginLocked extends CredentialsSignin {
  code = "locked";
}

const dummyHash = bcrypt.hashSync("royalroute-placeholder-password", 12);
const sessionSeconds = 60 * 60 * 2;
const secure = process.env.NODE_ENV === "production";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: sessionSeconds, updateAge: 30 * 60 },
  jwt: { maxAge: sessionSeconds },
  pages: { signIn: "/admin/login", error: "/admin/login" },
  useSecureCookies: secure,
  cookies: {
    sessionToken: {
      name: secure ? "__Secure-authjs.session-token" : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure,
      },
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, request) => {
        const parsed = loginSchema.safeParse(credentials);
        const email = parsed.success ? parsed.data.email : "invalid@example.com";
        const password = parsed.success ? parsed.data.password : "invalid";
        const ip = clientIpFromHeaders(request.headers);

        try {
          const gate = await assertLoginAllowed(email, ip);
          if (!gate.ok) {
            await failureDelay(gate.failures);
            throw new LoginLocked();
          }

          const admin = parsed.success
            ? await prisma.adminUser.findUnique({ where: { email } })
            : null;
          const hash = admin?.passwordHash ?? dummyHash;
          const matches = await bcrypt.compare(password, hash);

          if (!parsed.success || !admin || !matches) {
            await recordLoginFailure(email, ip);
            const again = await assertLoginAllowed(email, ip);
            await failureDelay(again.failures);
            return null;
          }

          await recordLoginSuccess(email, ip);
          return { id: admin.id, email: admin.email, name: "Administrator" };
        } catch (error) {
          if (error instanceof CredentialsSignin) throw error;
          console.error("login_failed", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.email) token.email = user.email.toLowerCase();
      if (user?.id) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.email = typeof token.email === "string" ? token.email : "";
        session.user.id = token.sub ?? "";
      }
      return session;
    },
  },
});
