// src/components/tasks/TaskCard.tsx
// Tarjeta individual de tarea con acciones inline

"use client";

import { useState } from "react";
import { format, isPast, isToday } from "date-fns";
import { es } from "date-fns/locale";
import {
  Check,
  Pencil,
  Trash2,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/types";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const priority = PRIORITY_CONFIG[task.priority];
  const status = STATUS_CONFIG[task.status];
  const dueDate = new Date(task.dueDate);
  const isOverdue = isPast(dueDate) && !task.completed;
  const isDueToday = isToday(dueDate);

  const handleDelete = async () => {
    setDeleting(true);
    onDelete(task.id);
  };

  return (
    <div
      className={cn(
        "relative glass-card rounded-xl p-4 border task-card",
        task.completed
          ? "opacity-60 border-[hsl(var(--border))]"
          : isOverdue
          ? "border-red-500/30 hover:border-red-500/50"
          : "border-[hsl(var(--border))] hover:border-violet-500/30",
        deleting && "opacity-30 pointer-events-none"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox de completado */}
        <button
          onClick={() => onToggle(task.id)}
          className={cn(
            "flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
            task.completed
              ? "bg-emerald-500 border-emerald-500"
              : "border-[hsl(var(--border-strong))] hover:border-emerald-500"
          )}
          aria-label={task.completed ? "Marcar incompleta" : "Marcar completa"}
        >
          {task.completed && <Check className="w-3 h-3 text-white stroke-[3]" />}
        </button>

        {/* Contenido de la tarea */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                "text-sm font-semibold text-foreground leading-snug",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </h3>

            {/* Menú de acciones */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setMenuOpen((p) => !p)}
                className="p-1 rounded-lg hover:bg-[hsl(var(--surface-hover))] text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Opciones de tarea"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-40 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl shadow-card z-50 py-1 animate-scale-in">
                    <button
                      onClick={() => {
                        onEdit(task);
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--surface-hover))] transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Editar tarea
                    </button>
                    <button
                      onClick={() => {
                        handleDelete();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Descripción */}
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Fila de meta */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {/* Badge de prioridad */}
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border",
                priority.bg,
                priority.color
              )}
            >
              {priority.label}
            </span>

            {/* Badge de estado */}
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border",
                status.bg,
                status.color
              )}
            >
              {status.label}
            </span>

            {/* Fecha de vencimiento */}
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs ml-auto",
                isOverdue
                  ? "text-red-400 font-medium"
                  : isDueToday
                  ? "text-amber-400 font-medium"
                  : "text-muted-foreground"
              )}
            >
              <Calendar className="w-3 h-3" />
              {isOverdue
                ? `Vencida · ${format(dueDate, "d MMM", { locale: es })}`
                : isDueToday
                ? "Vence hoy"
                : format(dueDate, "d MMM yyyy", { locale: es })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
