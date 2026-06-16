// src/app/(dashboard)/tasks/page.tsx
// Tasks page — loads tasks server-side and renders the interactive list

import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetchTasksAction } from "@/actions/taskActions";
import { TaskList } from "@/components/tasks/TaskList";

export const metadata: Metadata = {
  title: "Tareas",
  description: "Gestiona todas tus tareas en un solo lugar",
};

export default async function TasksPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const tasks = await fetchTasksAction();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tareas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {tasks.length} {tasks.length !== 1 ? "tareas" : "tarea"} en total
        </p>
      </div>

      {/* Interactive task list */}
      <TaskList initialTasks={tasks as any} />
    </div>
  );
}
