// src/components/settings/ProfileForm.tsx
// User profile display (read-only for Google OAuth users)

"use client";

import { signOut } from "next-auth/react";
import { LogOut, Mail, User } from "lucide-react";

interface ProfileFormProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function ProfileForm({ name, email, image }: ProfileFormProps) {
  return (
    <div className="space-y-6">
      {/* Avatar section */}
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-400 to-purple-700 flex items-center justify-center flex-shrink-0 shadow-glow">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={name ?? "User"} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-white">
              {name?.[0]?.toUpperCase() ?? "U"}
            </span>
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">{name ?? "User"}</h3>
          <p className="text-sm text-muted-foreground">{email}</p>
          <p className="text-xs text-violet-400 mt-1 font-medium">
            Sesión iniciada con Google
          </p>
        </div>
      </div>

      {/* Read-only fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Nombre Completo
          </label>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[hsl(var(--surface))] border border-[hsl(var(--border))] text-sm text-foreground">
            <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {name ?? "—"}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Correo Electrónico
          </label>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[hsl(var(--surface))] border border-[hsl(var(--border))] text-sm text-foreground">
            <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {email ?? "—"}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        La información del perfil se gestiona a través de tu cuenta de Google.
      </p>

      {/* Sign out */}
      <div className="pt-2 border-t border-[hsl(var(--border))]">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 border border-red-500/20 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión de TaskFlow
        </button>
      </div>
    </div>
  );
}
