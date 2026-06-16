// src/lib/auth.ts
// Auth.js v5 (NextAuth) — Google OAuth + Invitado con Prisma Adapter

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
          scope: "openid email profile",
        },
      },
    }),

    Credentials({
      id: "credentials",
      name: "Invitado",
      credentials: {},
      async authorize() {
        const email = "invitado@taskflow.dev";
        try {
          const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
              name: "Usuario Invitado",
              email,
              image: null,
            },
          });
          return { id: user.id, name: user.name, email: user.email, image: user.image };
        } catch {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // Primera vez que inicia sesión: guardar datos en el token
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },

    async session({ session, token }) {
      // Exponer el ID de usuario al cliente
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  trustHost: true,

  debug: process.env.NODE_ENV === "development",
});
