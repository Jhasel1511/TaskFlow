// src/components/dashboard/StatsCards.tsx
// Tarjetas de resumen del panel — Pendientes, Completadas, Vencidas, Hoy

import { CheckCircle2, Clock, AlertTriangle, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/types";

const statConfig = [
  {
    key: "pending" as const,
    label: "Pendientes",
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    glow: "hover:shadow-amber-500/10",
  },
  {
    key: "completed" as const,
    label: "Completadas",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    glow: "hover:shadow-emerald-500/10",
  },
  {
    key: "overdue" as const,
    label: "Vencidas",
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    glow: "hover:shadow-red-500/10",
  },
  {
    key: "today" as const,
    label: "Para Hoy",
    icon: CalendarClock,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    glow: "hover:shadow-blue-500/10",
  },
];

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
      {statConfig.map(({ key, label, icon: Icon, color, bg, border, glow }) => (
        <div
          key={key}
          className={cn(
            "relative glass-card rounded-2xl p-5 cursor-default",
            "transition-all duration-300 hover:-translate-y-0.5",
            `hover:shadow-lg ${glow}`,
            "border"
          )}
          style={{ borderColor: `hsl(var(--border))` }}
        >
          {/* Icono */}
          <div className={cn("inline-flex p-2.5 rounded-xl mb-4", bg, border, "border")}>
            <Icon className={cn("w-5 h-5", color)} />
          </div>

          {/* Valor */}
          <div className="space-y-1">
            <p className={cn("text-3xl font-bold tracking-tight", color)}>
              {stats[key]}
            </p>
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
          </div>

          {/* Decoración de esquina */}
          <div
            className={cn(
              "absolute top-3 right-3 w-8 h-8 rounded-full opacity-20 blur-sm",
              bg.replace("/10", "/40")
            )}
          />
        </div>
      ))}
    </div>
  );
}
