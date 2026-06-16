// src/components/tasks/TaskFilters.tsx
// Barra de filtros para la página de tareas

"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Priority, Status } from "@/types";

export interface TaskFiltersState {
  search: string;
  status: Status | "ALL";
  priority: Priority | "ALL";
}

interface TaskFiltersProps {
  filters: TaskFiltersState;
  onChange: (filters: TaskFiltersState) => void;
}

const statusOptions: { value: Status | "ALL"; label: string }[] = [
  { value: "ALL", label: "Todos los estados" },
  { value: "PENDING", label: "Pendiente" },
  { value: "IN_PROGRESS", label: "En Progreso" },
  { value: "COMPLETED", label: "Completada" },
];

const priorityOptions: { value: Priority | "ALL"; label: string }[] = [
  { value: "ALL", label: "Todas las prioridades" },
  { value: "URGENT", label: "🔴 Urgente" },
  { value: "HIGH", label: "🟠 Alta" },
  { value: "MEDIUM", label: "🟡 Media" },
  { value: "LOW", label: "🟢 Baja" },
];

const selectClass = cn(
  "py-2 pl-3 pr-8 rounded-xl text-sm text-foreground",
  "bg-[hsl(var(--surface))] border border-[hsl(var(--border))]",
  "focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30",
  "transition-all duration-200 cursor-pointer appearance-none"
);

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  const hasActiveFilters =
    filters.search !== "" ||
    filters.status !== "ALL" ||
    filters.priority !== "ALL";

  const clearFilters = () => {
    onChange({ search: "", status: "ALL", priority: "ALL" });
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Búsqueda */}
      <div className="relative flex-1 min-w-[180px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar tareas..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className={cn(
            "w-full pl-9 pr-4 py-2 rounded-xl text-sm",
            "bg-[hsl(var(--surface))] border border-[hsl(var(--border))]",
            "focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30",
            "transition-all duration-200 text-foreground placeholder:text-muted-foreground"
          )}
          aria-label="Buscar tareas"
        />
      </div>

      {/* Filtro de estado */}
      <div className="relative">
        <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <select
          value={filters.status}
          onChange={(e) =>
            onChange({ ...filters, status: e.target.value as Status | "ALL" })
          }
          className={cn(selectClass, "pl-8")}
          aria-label="Filtrar por estado"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro de prioridad */}
      <select
        value={filters.priority}
        onChange={(e) =>
          onChange({ ...filters, priority: e.target.value as Priority | "ALL" })
        }
        className={selectClass}
        aria-label="Filtrar por prioridad"
      >
        {priorityOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Limpiar filtros */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground bg-[hsl(var(--surface-hover))] hover:bg-[hsl(var(--surface-active))] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Limpiar
        </button>
      )}
    </div>
  );
}
