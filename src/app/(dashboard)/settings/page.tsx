// src/app/(dashboard)/settings/page.tsx
// Settings page — theme, profile, account

import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { ProfileForm } from "@/components/settings/ProfileForm";

export const metadata: Metadata = {
  title: "Configuración",
  description: "Gestiona tu cuenta y preferencias de TaskFlow",
};

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-[hsl(var(--border))]">
      <div className="mb-5">
        <h2 className="text-base font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  );
}

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { name, email, image } = session.user;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestiona tu cuenta y preferencias de la aplicación
        </p>
      </div>

      {/* Profile section */}
      <SettingsSection
        title="Perfil"
        description="Tu información de cuenta de Google"
      >
        <ProfileForm name={name} email={email} image={image} />
      </SettingsSection>

      {/* Theme section */}
      <SettingsSection
        title="Apariencia"
        description="Personaliza cómo se ve TaskFlow en tu dispositivo"
      >
        <ThemeToggle />
      </SettingsSection>

      {/* About section */}
      <SettingsSection title="Acerca de TaskFlow" description="Versión e información">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>Versión</span>
            <span className="text-foreground font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>Stack</span>
            <span className="text-foreground font-medium">
              Next.js 15 + Prisma + Supabase
            </span>
          </div>
          <div className="flex justify-between">
            <span>Google Calendar</span>
            <span className="text-amber-400 font-medium">Próximamente</span>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}
