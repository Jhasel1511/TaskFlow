// src/app/layout.tsx
// Root layout — wraps entire app with providers

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "TaskFlow — Gestor de Tareas Inteligente",
    template: "%s | TaskFlow",
  },
  description:
    "TaskFlow es un gestor de tareas SaaS inteligente con integración de calendario, gestión de prioridades y potentes análisis de productividad.",
  keywords: ["gestor de tareas", "productividad", "SaaS", "calendario", "todo"],
  authors: [{ name: "TaskFlow" }],
  openGraph: {
    title: "TaskFlow — Gestor de Tareas Inteligente",
    description: "Gestiona tus tareas de forma inteligente con TaskFlow",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
