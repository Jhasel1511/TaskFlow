// src/components/dashboard/ProductivityChart.tsx
// Gráfica de productividad semanal con Recharts

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { WeeklyProductivity } from "@/types";

interface ProductivityChartProps {
  data: WeeklyProductivity[];
}

// Tooltip personalizado para la gráfica
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-card rounded-xl px-4 py-3 border border-[hsl(var(--border))] shadow-card">
      <p className="text-xs font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-semibold text-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export function ProductivityChart({ data }: ProductivityChartProps) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-[hsl(var(--border))]">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Productividad Semanal
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tareas creadas vs completadas — últimos 7 días
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-violet-500" />
            <span>Creadas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span>Completadas</span>
          </div>
        </div>
      </div>

      {/* Gráfica */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          barSize={12}
          barGap={4}
          margin={{ top: 0, right: 0, bottom: 0, left: -20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "hsl(var(--surface-hover))", radius: 4 } as object}
          />
          <Bar
            dataKey="created"
            name="Creadas"
            fill="#8b5cf6"
            radius={[4, 4, 0, 0]}
            opacity={0.9}
          />
          <Bar
            dataKey="completed"
            name="Completadas"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            opacity={0.9}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
