// src/components/auth/LoginCard.tsx
// Tarjeta de inicio de sesión con Google OAuth y modo invitado

"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export function LoginCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<"google" | "guest" | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setLoadingType("google");
    try {
      await signIn("google", { callbackUrl: "/dashboard", redirect: true });
    } catch {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const handleGuestSignIn = async () => {
    setIsLoading(true);
    setLoadingType("guest");
    try {
      const result = await signIn("credentials", {
        callbackUrl: "/dashboard",
        redirect: false,
      });
      if (result?.url) {
        window.location.href = result.url;
      } else if (result?.error) {
        setIsLoading(false);
        setLoadingType(null);
      }
    } catch {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-8 shadow-2xl">
      {/* Logo y marca */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 shadow-glow mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-1">
          Bienvenido a{" "}
          <span className="gradient-text">TaskFlow</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Tu espacio inteligente de gestión de tareas
        </p>
      </div>

      {/* Características destacadas */}
      <div className="space-y-3 mb-8">
        {[
          { icon: "⚡", text: "Priorización inteligente de tareas" },
          { icon: "📅", text: "Vista de calendario y agenda" },
          { icon: "📊", text: "Análisis de productividad" },
        ].map((item) => (
          <div
            key={item.text}
            className="flex items-center gap-3 text-sm text-muted-foreground"
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Botón de Google */}
      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        id="btn-google-signin"
        className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl
          bg-white text-gray-800 font-semibold text-sm
          hover:bg-gray-50 active:scale-[0.98]
          transition-all duration-200 shadow-md hover:shadow-lg
          disabled:opacity-60 disabled:cursor-not-allowed
          focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
      >
        {isLoading && loadingType === "google" ? (
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        {isLoading && loadingType === "google"
          ? "Iniciando sesión..."
          : "Continuar con Google"}
      </button>

      <div className="relative flex py-4 items-center">
        <div className="flex-grow border-t border-[hsl(var(--border))]"></div>
        <span className="flex-shrink mx-4 text-xs text-muted-foreground">o</span>
        <div className="flex-grow border-t border-[hsl(var(--border))]"></div>
      </div>

      <button
        onClick={handleGuestSignIn}
        disabled={isLoading}
        id="btn-guest-signin"
        className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl
          bg-violet-600/10 text-violet-300 font-semibold text-sm border border-violet-500/20
          hover:bg-violet-600/20 active:scale-[0.98]
          transition-all duration-200 shadow-sm
          disabled:opacity-60 disabled:cursor-not-allowed
          focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
      >
        {isLoading && loadingType === "guest" ? (
          <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          "⚡"
        )}
        {isLoading && loadingType === "guest"
          ? "Entrando..."
          : "Continuar como Invitado (Demo)"}
      </button>

      <p className="text-center text-xs text-muted-foreground mt-6">
        Al iniciar sesión, aceptas nuestros{" "}
        <a href="#" className="text-primary hover:underline">
          Términos de Servicio
        </a>{" "}
        y{" "}
        <a href="#" className="text-primary hover:underline">
          Política de Privacidad
        </a>
      </p>
    </div>
  );
}
