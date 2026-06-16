// src/components/calendar/DayCell.tsx
// Individual day cell in the monthly calendar grid

"use client";

import { isToday, isSameMonth, format } from "date-fns";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/types";

interface DayCellProps {
  date: Date;
  currentMonth: Date;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
}

const priorityDotClass: Record<string, string> = {
  URGENT: "bg-red-400",
  HIGH: "bg-orange-400",
  MEDIUM: "bg-amber-400",
  LOW: "bg-emerald-400",
};

export function DayCell({ date, currentMonth, events, onDayClick }: DayCellProps) {
  const isCurrentDay = isToday(date);
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const maxVisible = 2;
  const overflow = events.length - maxVisible;

  return (
    <div
      onClick={() => onDayClick(date)}
      className={cn(
        "relative min-h-[100px] p-2 border-b border-r border-[hsl(var(--border))] cursor-pointer group",
        "hover:bg-[hsl(var(--surface-hover))] transition-colors duration-150",
        !isCurrentMonth && "opacity-40"
      )}
    >
      {/* Day number */}
      <div className="flex items-center justify-between mb-1.5">
        <span
          className={cn(
            "text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full",
            isCurrentDay
              ? "bg-violet-600 text-white"
              : "text-foreground group-hover:text-violet-400 transition-colors"
          )}
        >
          {format(date, "d")}
        </span>

        {/* Add task on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDayClick(date);
          }}
          className="opacity-0 group-hover:opacity-100 p-0.5 rounded-md hover:bg-violet-500/20 text-muted-foreground hover:text-violet-400 transition-all"
          aria-label={`Add task on ${format(date, "MMM d")}`}
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Events */}
      <div className="space-y-1">
        {events.slice(0, maxVisible).map((event) => (
          <div
            key={event.id}
            className={cn(
              "flex items-center gap-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium truncate",
              event.completed
                ? "opacity-50 line-through text-muted-foreground bg-[hsl(var(--surface-hover))]"
                : "bg-violet-500/15 text-violet-300"
            )}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full flex-shrink-0",
                priorityDotClass[event.priority]
              )}
            />
            <span className="truncate">{event.title}</span>
          </div>
        ))}

        {/* Overflow indicator */}
        {overflow > 0 && (
          <div className="text-[10px] text-muted-foreground px-1.5 font-medium">
            +{overflow} more
          </div>
        )}
      </div>
    </div>
  );
}
