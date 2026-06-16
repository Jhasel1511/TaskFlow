// src/hooks/useTasks.ts
// Client-side hook for task data with optimistic UI updates

"use client";

import { useState, useCallback } from "react";
import type { Task } from "@/types";
import {
  createTaskAction,
  updateTaskAction,
  deleteTaskAction,
  toggleTaskAction,
} from "@/actions/taskActions";
import type { TaskFormData } from "@/types";

interface UseTasksOptions {
  initialTasks?: Task[];
}

export function useTasks({ initialTasks = [] }: UseTasksOptions = {}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Create ──────────────────────────────────────────────────────────────────

  const createTask = useCallback(async (formData: TaskFormData) => {
    setIsLoading(true);
    setError(null);

    // Optimistic: add a temporary task
    const tempId = `temp-${Date.now()}`;
    const optimisticTask: Task = {
      id: tempId,
      ...formData,
      completed: formData.status === "COMPLETED",
      userId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks((prev) => [optimisticTask, ...prev]);

    const result = await createTaskAction(formData);

    if (result.success) {
      // Replace temp with real ID from server
      setTasks((prev) =>
        prev.map((t) =>
          t.id === tempId ? { ...t, id: result.data.id } : t
        )
      );
    } else {
      // Rollback
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      setError(result.error);
    }

    setIsLoading(false);
    return result;
  }, []);

  // ─── Update ──────────────────────────────────────────────────────────────────

  const updateTask = useCallback(
    async (taskId: string, data: Partial<TaskFormData>) => {
      setIsLoading(true);
      setError(null);

      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...data } : t))
      );

      const result = await updateTaskAction(taskId, data);

      if (!result.success) {
        setError(result.error);
        // Note: in production you'd rollback here with the old value
      }

      setIsLoading(false);
      return result;
    },
    []
  );

  // ─── Toggle Complete ─────────────────────────────────────────────────────────

  const toggleTask = useCallback(async (taskId: string) => {
    // Optimistic toggle
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completed: !t.completed,
              status: !t.completed ? "COMPLETED" : "PENDING",
            }
          : t
      )
    );

    const result = await toggleTaskAction(taskId);

    if (!result.success) {
      // Rollback
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                completed: !t.completed,
                status: !t.completed ? "COMPLETED" : "PENDING",
              }
            : t
        )
      );
      setError(result.error);
    }

    return result;
  }, []);

  // ─── Delete ──────────────────────────────────────────────────────────────────

  const deleteTask = useCallback(async (taskId: string) => {
    const original = tasks.find((t) => t.id === taskId);

    // Optimistic remove
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    const result = await deleteTaskAction(taskId);

    if (!result.success) {
      // Rollback
      if (original) {
        setTasks((prev) => [...prev, original]);
      }
      setError(result.error);
    }

    return result;
  }, [tasks]);

  return {
    tasks,
    setTasks,
    isLoading,
    error,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
  };
}
