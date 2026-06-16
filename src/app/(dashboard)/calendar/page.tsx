// src/app/(dashboard)/calendar/page.tsx
// Calendar page

import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetchTasksAction } from "@/actions/taskActions";
import { CalendarPageClient } from "@/components/calendar/CalendarPageClient";

export const metadata: Metadata = {
  title: "Calendario",
  description: "Visualiza y gestiona tareas en tu calendario",
};

export default async function CalendarPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const tasks = await fetchTasksAction();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Calendario</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visualiza y programa tus tareas
        </p>
      </div>

      <CalendarPageClient initialTasks={tasks as any} />
    </div>
  );
}
