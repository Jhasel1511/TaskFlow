// src/components/tasks/TaskDialog.tsx
// Modal de diálogo para el formulario de tareas

"use client";

import { X } from "lucide-react";
import { TaskForm } from "./TaskForm";
import type { Task, TaskFormData } from "@/types";

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  onSubmit: (data: TaskFormData) => Promise<void>;
  isLoading?: boolean;
  defaultDate?: Date;
}

export function TaskDialog({
  open,
  onClose,
  task,
  onSubmit,
  isLoading,
  defaultDate,
}: TaskDialogProps) {
  if (!open) return null;

  const isEditing = !!task;

  const defaultValues = task ?? (defaultDate
    ? { startDate: defaultDate, dueDate: defaultDate }
    : undefined);

  return (
    <>
      {/* Fondo oscuro */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg glass-card rounded-2xl border border-[hsl(var(--border))] shadow-2xl animate-scale-in">
          {/* Encabezado */}
          <div className="flex items-center justify-between p-6 pb-0">
            <div>
              <h2 className="text-base font-bold text-foreground">
                {isEditing ? "Editar Tarea" : "Nueva Tarea"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isEditing
                  ? "Actualiza los detalles de la tarea"
                  : "Agrega una nueva tarea a tu lista"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-[hsl(var(--surface-hover))] text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Cerrar diálogo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Formulario */}
          <div className="p-6">
            <TaskForm
              defaultValues={defaultValues as Partial<Task>}
              onSubmit={onSubmit}
              onCancel={onClose}
              isLoading={isLoading}
              submitLabel={isEditing ? "Guardar Cambios" : "Crear Tarea"}
            />
          </div>
        </div>
      </div>
    </>
  );
}
