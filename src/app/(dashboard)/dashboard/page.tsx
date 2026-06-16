// src/app/(dashboard)/dashboard/page.tsx
// Panel principal — estadísticas, gráfica y próximas tareas

import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  fetchDashboardStatsAction,
  fetchWeeklyProductivityAction,
  fetchUpcomingTasksAction,
} from "@/actions/taskActions";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ProductivityChart } from "@/components/dashboard/ProductivityChart";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const metadata: Metadata = {
  title: "Panel de Control",
  description: "Tu resumen de productividad en TaskFlow",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Obtener todos los datos en paralelo
  const [stats, weeklyData, upcoming] = await Promise.all([
    fetchDashboardStatsAction(),
    fetchWeeklyProductivityAction(),
    fetchUpcomingTasksAction(),
  ]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const firstName = session.user.name?.split(" ")[0] ?? "allí";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {greeting()}, {firstName} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })} · Aquí está tu resumen
          </p>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <StatsCards stats={stats} />

      {/* Gráfica + Próximas tareas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductivityChart data={weeklyData} />
        </div>
        <div className="lg:col-span-1">
          <UpcomingTasks tasks={upcoming as any} />
        </div>
      </div>
    </div>
  );
}
