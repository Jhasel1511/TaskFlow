// src/components/tasks/TaskForm.tsx
// Formulario de creación/edición de tareas con React Hook Form + Zod

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

// ─── Esquema ──────────────────────────────────────────────────────────────────

const taskFormSchema = z
  .object({
    title: z.string().min(1, "El título es requerido").max(200, "El título es muy largo"),
    description: z.string().max(2000, "La descripción es muy larga").optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
    status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
    startDate: z.string().min(1, "La fecha de inicio es requerida"),
    dueDate: z.string().min(1, "La fecha de vencimiento es requerida"),
  })
  .refine((data) => new Date(data.dueDate) >= new Date(data.startDate), {
    message: "La fecha de vencimiento debe ser después de la fecha de inicio",
    path: ["dueDate"],
  });

type TaskFormValues = z.infer<typeof taskFormSchema>;

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface TaskFormProps {
  defaultValues?: Partial<Task>;
  onSubmit: (data: Omit<TaskFormValues, "startDate" | "dueDate"> & { startDate: Date; dueDate: Date }) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
}

// ─── Helpers de campos ────────────────────────────────────────────────────────

function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5"
    >
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-400 mt-1">{message}</p>;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function TaskForm({
  defaultValues,
  onSubmit,
  isLoading,
  onCancel,
  submitLabel = "Crear Tarea",
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      priority: defaultValues?.priority ?? "MEDIUM",
      status: defaultValues?.status ?? "PENDING",
      startDate: defaultValues?.startDate
        ? format(new Date(defaultValues.startDate), "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
      dueDate: defaultValues?.dueDate
        ? format(new Date(defaultValues.dueDate), "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
    },
  });

  const handleFormSubmit = async (values: TaskFormValues) => {
    await onSubmit({
      ...values,
      startDate: new Date(values.startDate),
      dueDate: new Date(values.dueDate),
    });
  };

  const inputClass = cn(
    "w-full px-3.5 py-2.5 rounded-xl text-sm text-foreground",
    "bg-[hsl(var(--input))] border border-[hsl(var(--border))]",
    "focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30",
    "transition-all duration-200 placeholder:text-muted-foreground"
  );

  const selectClass = cn(inputClass, "cursor-pointer appearance-none");

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Título */}
      <div>
        <Label htmlFor="task-title">Título *</Label>
        <input
          id="task-title"
          {...register("title")}
          placeholder="¿Qué necesita hacerse?"
          className={inputClass}
          autoFocus
        />
        <FieldError message={errors.title?.message} />
      </div>

      {/* Descripción */}
      <div>
        <Label htmlFor="task-description">Descripción</Label>
        <textarea
          id="task-description"
          {...register("description")}
          placeholder="Añade más detalles..."
          rows={3}
          className={cn(inputClass, "resize-none")}
        />
        <FieldError message={errors.description?.message} />
      </div>

      {/* Prioridad + Estado */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="task-priority">Prioridad</Label>
          <select id="task-priority" {...register("priority")} className={selectClass}>
            <option value="LOW">🟢 Baja</option>
            <option value="MEDIUM">🟡 Media</option>
            <option value="HIGH">🟠 Alta</option>
            <option value="URGENT">🔴 Urgente</option>
          </select>
          <FieldError message={errors.priority?.message} />
        </div>

        <div>
          <Label htmlFor="task-status">Estado</Label>
          <select id="task-status" {...register("status")} className={selectClass}>
            <option value="PENDING">⏳ Pendiente</option>
            <option value="IN_PROGRESS">🔄 En Progreso</option>
            <option value="COMPLETED">✅ Completada</option>
          </select>
          <FieldError message={errors.status?.message} />
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="task-start-date">Fecha de Inicio</Label>
          <input
            id="task-start-date"
            type="date"
            {...register("startDate")}
            className={inputClass}
          />
          <FieldError message={errors.startDate?.message} />
        </div>

        <div>
          <Label htmlFor="task-due-date">Fecha de Vencimiento</Label>
          <input
            id="task-due-date"
            type="date"
            {...register("dueDate")}
            className={inputClass}
          />
          <FieldError message={errors.dueDate?.message} />
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-muted-foreground bg-[hsl(var(--surface-hover))] hover:text-foreground transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl",
            "text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500",
            "transition-all duration-200 btn-glow disabled:opacity-60 disabled:cursor-not-allowed",
            "active:scale-[0.98]"
          )}
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
