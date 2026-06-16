// src/lib/auth.config.ts
// Configuración Edge-compatible de Auth.js (sin Prisma Adapter / Node APIs)
// Usada SOLO por el proxy (middleware) para verificar sesiones JWT

import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authConfig: NextAuthConfig = {
  providers: [
    // Solo declarar los providers en Edge (sin lógica Node.js)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // Solo lógica de redirección — sin DB aquí (Edge runtime)
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith("/login");
      const isOnApi = nextUrl.pathname.startsWith("/api/auth");

      if (isOnLogin || isOnApi) return true;
      if (isLoggedIn) return true;
      return false; // Redirigir a /login
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  trustHost: true,
};
