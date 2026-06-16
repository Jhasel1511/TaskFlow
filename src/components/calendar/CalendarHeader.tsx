// src/components/calendar/CalendarHeader.tsx
// Calendar navigation header with month/week/day view toggle

"use client";

import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalendarView } from "@/types";

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onDateChange: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
}

const views: { value: CalendarView; label: string }[] = [
  { value: "month", label: "Mes" },
  { value: "week", label: "Semana" },
  { value: "day", label: "Día" },
];

export function CalendarHeader({
  currentDate,
  view,
  onDateChange,
  onViewChange,
}: CalendarHeaderProps) {
  const navigatePrev = () => {
    if (view === "month") onDateChange(subMonths(currentDate, 1));
    else if (view === "week") onDateChange(subWeeks(currentDate, 1));
    else onDateChange(subDays(currentDate, 1));
  };

  const navigateNext = () => {
    if (view === "month") onDateChange(addMonths(currentDate, 1));
    else if (view === "week") onDateChange(addWeeks(currentDate, 1));
    else onDateChange(addDays(currentDate, 1));
  };

  const navigateToday = () => onDateChange(new Date());

  const getTitle = () => {
    if (view === "month") return format(currentDate, "MMMM yyyy", { locale: es });
    if (view === "week") return `Semana del ${format(currentDate, "d MMM yyyy", { locale: es })}`;
    return format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      {/* Title + Nav */}
      <div className="flex items-center gap-3">
        <button
          onClick={navigateToday}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground bg-[hsl(var(--surface-hover))] hover:bg-[hsl(var(--surface-active))] transition-colors"
        >
          <CalendarDays className="w-3.5 h-3.5" />
          Hoy
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={navigatePrev}
            className="p-1.5 rounded-lg hover:bg-[hsl(var(--surface-hover))] text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={navigateNext}
            className="p-1.5 rounded-lg hover:bg-[hsl(var(--surface-hover))] text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <h2 className="text-base font-bold text-foreground">{getTitle()}</h2>
      </div>

      {/* View toggle */}
      <div className="flex items-center bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-xl p-1 gap-1">
        {views.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onViewChange(value)}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
              view === value
                ? "bg-violet-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
