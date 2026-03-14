import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyMagicLinkToken } from "@/lib/magic-link";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
}

const config: NextAuthConfig = {
  providers: [
    Credentials({
      id: "magic-link",
      name: "Magic Link",
      credentials: {
        token: { type: "text" },
      },
      async authorize(credentials) {
        const token = credentials?.token as string;
        if (!token) return null;

        const result = await verifyMagicLinkToken(token);
        if (!result?.email) return null;

        return {
          id: result.email,
          email: result.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.email) {
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
