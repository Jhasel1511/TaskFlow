// src/components/layout/Navbar.tsx
// Barra de navegación superior con breadcrumb, búsqueda, tema y menú de usuario

"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import {
  Search,
  Sun,
  Moon,
  Monitor,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const routeLabels: Record<string, string> = {
  "/dashboard": "Panel de Control",
  "/tasks": "Tareas",
  "/calendar": "Calendario",
  "/settings": "Configuración",
};

interface NavbarProps {
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
  onNewTask?: () => void;
}

export function Navbar({ userName, userEmail, userImage, onNewTask }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Fix hydration mismatch — only render theme UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const pageTitle = routeLabels[pathname] ?? "TaskFlow";

  const themeOptions = [
    { label: "Claro", value: "light", icon: Sun },
    { label: "Oscuro", value: "dark", icon: Moon },
    { label: "Sistema", value: "system", icon: Monitor },
  ];

  const ThemeIcon = !mounted
    ? Monitor
    : theme === "dark"
    ? Moon
    : theme === "light"
    ? Sun
    : Monitor;

  return (
    <header className="h-16 flex items-center px-6 gap-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))/0.8] backdrop-blur-md sticky top-0 z-30">
      {/* Título de página / breadcrumb */}
      <div className="flex items-center gap-2 flex-1">
        <h2 className="text-sm font-semibold text-foreground">{pageTitle}</h2>
      </div>

      {/* Barra de búsqueda */}
      <div
        className={cn(
          "relative flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all duration-200",
          "bg-[hsl(var(--surface))] w-56",
          searchFocused
            ? "border-violet-500/50 w-72 shadow-glow"
            : "border-[hsl(var(--border))]"
        )}
      >
        <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          placeholder="Buscar tareas..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground flex-1 text-sm"
          aria-label="Buscar tareas"
        />
        <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground border border-[hsl(var(--border))] rounded">
          ⌘K
        </kbd>
      </div>

      {/* Botón Nueva Tarea */}
      <button
        onClick={onNewTask}
        id="navbar-new-task-btn"
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all duration-200 btn-glow shadow-glow"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Nueva Tarea</span>
      </button>

      {/* Notificaciones */}
      <button
        className="relative p-2 rounded-xl hover:bg-[hsl(var(--surface-hover))] transition-colors text-muted-foreground hover:text-foreground"
        aria-label="Notificaciones"
      >
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-400 rounded-full" />
      </button>

      {/* Cambio de tema — solo se renderiza tras mount para evitar hidratación */}
      <div className="relative">
        <button
          onClick={() => setThemeMenuOpen((prev) => !prev)}
          className="p-2 rounded-xl hover:bg-[hsl(var(--surface-hover))] transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Cambiar tema"
          aria-expanded={themeMenuOpen}
          suppressHydrationWarning
        >
          <ThemeIcon className="w-4 h-4" />
        </button>

        {themeMenuOpen && mounted && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setThemeMenuOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-40 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl shadow-card z-50 py-1 animate-scale-in">
              {themeOptions.map(({ label, value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => {
                    setTheme(value);
                    setThemeMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors",
                    theme === value
                      ? "text-violet-400 bg-violet-500/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-hover))]"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  {theme === value && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Menú de usuario */}
      <div className="relative">
        <button
          onClick={() => setUserMenuOpen((prev) => !prev)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[hsl(var(--surface-hover))] transition-colors"
          aria-label="Menú de usuario"
          aria-expanded={userMenuOpen}
        >
          <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center flex-shrink-0">
            {userImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={userImage}
                alt={userName ?? "Usuario"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-xs font-semibold">
                {userName?.[0]?.toUpperCase() ?? "U"}
              </span>
            )}
          </div>
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
              userMenuOpen && "rotate-180"
            )}
          />
        </button>

        {userMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setUserMenuOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-52 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl shadow-card z-50 py-1.5 animate-scale-in">
              {/* Info de usuario */}
              <div className="px-3 py-2.5 border-b border-[hsl(var(--border))] mb-1">
                <p className="text-sm font-semibold text-foreground truncate">
                  {userName ?? "Usuario"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {userEmail ?? ""}
                </p>
              </div>

              {[
                { label: "Perfil", icon: User, href: "/settings" },
                { label: "Configuración", icon: Settings, href: "/settings" },
              ].map(({ label, icon: Icon, href }) => (
                <button
                  key={label}
                  onClick={() => {
                    router.push(href);
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-hover))] transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}

              <div className="border-t border-[hsl(var(--border))] mt-1 pt-1">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
