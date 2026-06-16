// src/proxy.ts
// Protección de rutas — redirige usuarios no autenticados a /login
// (Next.js 16 usa "proxy" en vez de "middleware")

import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Usar la instancia de auth del config Edge (sin PrismaAdapter)
export const { auth: middleware } = NextAuth(authConfig);

export default middleware;

// Aplicar a todas las rutas excepto assets estáticos e internals de Next.js
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
