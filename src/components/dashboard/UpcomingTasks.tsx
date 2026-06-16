// src/components/dashboard/UpcomingTasks.tsx
// Widget de próximas tareas en el panel

import { format, isToday, isTomorrow } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import { PRIORITY_CONFIG } from "@/types";

interface UpcomingTasksProps {
  tasks: Task[];
}

function getDueDateLabel(date: Date): string {
  if (isToday(date)) return "Hoy";
  if (isTomorrow(date)) return "Mañana";
  return format(date, "d MMM", { locale: es });
}

export function UpcomingTasks({ tasks }: UpcomingTasksProps) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-[hsl(var(--border))] h-full">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Próximas Tareas
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Próximos 7 días</p>
        </div>
        <Link
          href="/tasks"
          className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium"
        >
          Ver todas
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Lista de tareas */}
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[hsl(var(--surface-hover))] flex items-center justify-center mb-3">
            <span className="text-2xl">🎉</span>
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            ¡Todo al día!
          </p>
          <p className="text-xs text-muted-foreground">
            No tienes tareas pendientes en los próximos 7 días
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {tasks.map((task) => {
            const priority = PRIORITY_CONFIG[task.priority];
            const dueLabel = getDueDateLabel(new Date(task.dueDate));
            const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

            return (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-[hsl(var(--surface-hover))] hover:bg-[hsl(var(--surface-active))] transition-colors task-card"
              >
                {/* Punto de prioridad */}
                <div
                  className={cn(
                    "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                    task.priority === "URGENT" && "bg-red-400",
                    task.priority === "HIGH" && "bg-orange-400",
                    task.priority === "MEDIUM" && "bg-amber-400",
                    task.priority === "LOW" && "bg-emerald-400"
                  )}
                />

                {/* Info de tarea */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded-md border font-medium",
                        priority.bg,
                        priority.color
                      )}
                    >
                      {priority.label}
                    </span>
                    <span
                      className={cn(
                        "text-xs",
                        isOverdue
                          ? "text-red-400 font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {isOverdue ? "Vencida" : dueLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
