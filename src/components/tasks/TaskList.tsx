// src/components/tasks/TaskList.tsx
// Lista de tareas filtrable y agrupada con acciones CRUD

"use client";

import { useState, useMemo } from "react";
import { Plus, ClipboardList } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { TaskFilters, type TaskFiltersState } from "./TaskFilters";
import { TaskDialog } from "./TaskDialog";
import { useTasks } from "@/hooks/useTasks";
import type { Task, TaskFormData } from "@/types";

interface TaskListProps {
  initialTasks: Task[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const { tasks, createTask, updateTask, toggleTask, deleteTask, isLoading } =
    useTasks({ initialTasks });

  const [filters, setFilters] = useState<TaskFiltersState>({
    search: "",
    status: "ALL",
    priority: "ALL",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // ─── Lista filtrada derivada ────────────────────────────────────────────────

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (
        filters.search &&
        !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !task.description?.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.status !== "ALL" && task.status !== filters.status) {
        return false;
      }
      if (filters.priority !== "ALL" && task.priority !== filters.priority) {
        return false;
      }
      return true;
    });
  }, [tasks, filters]);

  // ─── Tareas agrupadas ──────────────────────────────────────────────────────

  const groupedTasks = useMemo(() => {
    const pending = filteredTasks.filter((t) => !t.completed);
    const completed = filteredTasks.filter((t) => t.completed);
    return { pending, completed };
  }, [filteredTasks]);

  // ─── Manejadores ──────────────────────────────────────────────────────────

  const handleSubmit = async (formData: TaskFormData) => {
    if (editingTask) {
      await updateTask(editingTask.id, formData);
    } else {
      await createTask(formData);
    }
    setDialogOpen(false);
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-5">
      {/* Barra de herramientas */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1">
          <TaskFilters filters={filters} onChange={setFilters} />
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          id="task-list-new-btn"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all duration-200 btn-glow shadow-glow flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nueva Tarea
        </button>
      </div>

      {/* Estado vacío */}
      {filteredTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--surface-hover))] flex items-center justify-center mb-4">
            <ClipboardList className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-base font-semibold text-foreground mb-2">
            {filters.search || filters.status !== "ALL" || filters.priority !== "ALL"
              ? "Ninguna tarea coincide con los filtros"
              : "Aún no tienes tareas"}
          </p>
          <p className="text-sm text-muted-foreground max-w-sm">
            {filters.search || filters.status !== "ALL" || filters.priority !== "ALL"
              ? "Intenta ajustar tu búsqueda o filtros"
              : "Crea tu primera tarea para comenzar con TaskFlow"}
          </p>
          {tasks.length === 0 && (
            <button
              onClick={() => setDialogOpen(true)}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Crear tu primera tarea
            </button>
          )}
        </div>
      )}

      {/* Tareas activas */}
      {groupedTasks.pending.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Activas · {groupedTasks.pending.length}
          </h3>
          <div className="space-y-2.5 stagger-children">
            {groupedTasks.pending.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onEdit={handleEdit}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </section>
      )}

      {/* Tareas completadas */}
      {groupedTasks.completed.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Completadas · {groupedTasks.completed.length}
          </h3>
          <div className="space-y-2.5 stagger-children">
            {groupedTasks.completed.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onEdit={handleEdit}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </section>
      )}

      {/* Diálogo Crear/Editar */}
      <TaskDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        task={editingTask}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
