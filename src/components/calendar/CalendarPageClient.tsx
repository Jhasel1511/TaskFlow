// src/components/calendar/CalendarPageClient.tsx
// Client wrapper for the calendar page (handles mutations)

"use client";

import { CalendarView } from "./CalendarView";
import { useTasks } from "@/hooks/useTasks";
import type { Task } from "@/types";

interface CalendarPageClientProps {
  initialTasks: Task[];
}

export function CalendarPageClient({ initialTasks }: CalendarPageClientProps) {
  const { tasks, createTask, isLoading } = useTasks({ initialTasks });

  const handleCreateTask = async (data: Parameters<typeof createTask>[0]) => {
    await createTask(data);
  };

  return (
    <CalendarView
      tasks={tasks}
      onCreateTask={handleCreateTask}
      isLoading={isLoading}
    />
  );
}
