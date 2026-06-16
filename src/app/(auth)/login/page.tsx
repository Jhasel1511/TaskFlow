// src/app/(auth)/login/page.tsx
// Página de inicio de sesión premium con Google OAuth

import type { Metadata } from "next";
import { LoginCard } from "@/components/auth/LoginCard";

export const metadata: Metadata = {
  title: "Iniciar Sesión",
  description: "Inicia sesión en tu cuenta de TaskFlow",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[hsl(222,47%,5%)]">
      {/* Orbes de fondo animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[80px]" />
      </div>

      {/* Patrón de cuadrícula */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        }}
      />

      {/* Tarjeta de inicio de sesión */}
      <div className="relative z-10 w-full max-w-md px-4 animate-fade-in">
        <LoginCard />
      </div>
    </main>
  );
}
