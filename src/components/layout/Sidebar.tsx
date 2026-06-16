// src/components/layout/Sidebar.tsx
// Barra lateral plegable con navegación y perfil de usuario

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";

const navItems = [
  {
    label: "Panel",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Tareas",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    label: "Calendario",
    href: "/calendar",
    icon: Calendar,
  },
  {
    label: "Configuración",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
}

export function Sidebar({ userName, userEmail, userImage }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "relative flex flex-col h-full bg-[hsl(var(--surface))] border-r border-[hsl(var(--border))]",
        "sidebar-transition overflow-hidden",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[hsl(var(--border))]">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-glow">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg gradient-text tracking-tight">
            TaskFlow
          </span>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                "transition-all duration-200 group relative",
                isActive
                  ? "bg-violet-500/15 text-violet-400 border border-violet-500/20"
                  : "text-[hsl(var(--foreground-muted))] hover:bg-[hsl(var(--surface-hover))] hover:text-[hsl(var(--foreground))]"
              )}
              title={collapsed ? item.label : undefined}
            >
              {/* Indicador activo */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-violet-400 rounded-r-full" />
              )}

              <Icon
                className={cn(
                  "flex-shrink-0 w-4.5 h-4.5",
                  isActive ? "text-violet-400" : "text-inherit"
                )}
                size={18}
              />

              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}

              {/* Tooltip en estado colapsado */}
              {collapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg shadow-card opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Info de usuario */}
      <div className="px-3 py-4 border-t border-[hsl(var(--border))]">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[hsl(var(--surface-hover))] transition-colors">
          {/* Avatar */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
            {userImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={userImage}
                alt={userName ?? "Usuario"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-semibold">
                {userName?.[0]?.toUpperCase() ?? "U"}
              </span>
            )}
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {userName ?? "Usuario"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userEmail ?? ""}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle colapsar */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="absolute -right-3 top-7 z-10 w-6 h-6 rounded-full bg-[hsl(var(--surface))] border border-[hsl(var(--border))] flex items-center justify-center shadow-sm hover:bg-[hsl(var(--surface-hover))] transition-colors"
        aria-label={collapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-muted-foreground" />
        )}
      </button>
    </aside>
  );
}
