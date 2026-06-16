// src/components/calendar/CalendarView.tsx
// Full calendar grid with month/week/day views

"use client";

import { useState, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  format,
  startOfDay,
  addHours,
} from "date-fns";
import { es } from "date-fns/locale";
import { CalendarHeader } from "./CalendarHeader";
import { DayCell } from "./DayCell";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import type { Task, CalendarView as CalendarViewType, CalendarEvent, TaskFormData } from "@/types";

interface CalendarViewProps {
  tasks: Task[];
  onCreateTask: (data: TaskFormData) => Promise<void>;
  isLoading?: boolean;
}

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function CalendarView({ tasks, onCreateTask, isLoading }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarViewType>("month");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Convert tasks to calendar events
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return tasks.map((t) => ({
      id: t.id,
      title: t.title,
      date: new Date(t.dueDate),
      priority: t.priority,
      status: t.status,
      completed: t.completed,
    }));
  }, [tasks]);

  // ─── Month view days ──────────────────────────────────────────────────────

  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  // ─── Week view days ───────────────────────────────────────────────────────

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  // ─── Event lookup ─────────────────────────────────────────────────────────

  const getEventsForDay = (date: Date) =>
    calendarEvents.filter((e) => isSameDay(e.date, date));

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  const handleCreateTask = async (data: TaskFormData) => {
    await onCreateTask(data);
    setDialogOpen(false);
    setSelectedDate(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onDateChange={setCurrentDate}
        onViewChange={setView}
      />

      {/* Month View */}
      {view === "month" && (
        <div className="glass-card rounded-2xl border border-[hsl(var(--border))] overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-[hsl(var(--border))]">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day cells grid */}
          <div className="grid grid-cols-7">
            {monthDays.map((day) => (
              <DayCell
                key={day.toISOString()}
                date={day}
                currentMonth={currentDate}
                events={getEventsForDay(day)}
                onDayClick={handleDayClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Week View */}
      {view === "week" && (
        <div className="glass-card rounded-2xl border border-[hsl(var(--border))] overflow-hidden">
          <div className="grid grid-cols-7 border-b border-[hsl(var(--border))]">
            {weekDays.map((day) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentDay = isSameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => handleDayClick(day)}
                  className="p-3 border-r border-[hsl(var(--border))] last:border-r-0 cursor-pointer hover:bg-[hsl(var(--surface-hover))] transition-colors min-h-[200px]"
                >
                  <div className="text-center mb-3">
                    <p className="text-xs text-muted-foreground uppercase">
                      {format(day, "EEE", { locale: es })}
                    </p>
                    <p
                      className={`text-lg font-bold mt-0.5 w-9 h-9 flex items-center justify-center mx-auto rounded-full ${
                        isCurrentDay
                          ? "bg-violet-600 text-white"
                          : "text-foreground"
                      }`}
                    >
                      {format(day, "d")}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="text-[10px] px-2 py-1 rounded-lg bg-violet-500/15 text-violet-300 font-medium truncate"
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Day View */}
      {view === "day" && (
        <div className="glass-card rounded-2xl border border-[hsl(var(--border))] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">
              {format(currentDate, "EEEE, d 'de' MMMM", { locale: es })}
            </h3>
            <button
              onClick={() => handleDayClick(currentDate)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all"
            >
              + Agregar Tarea
            </button>
          </div>

          {getEventsForDay(currentDate).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-4xl mb-3">📅</p>
              <p className="text-sm font-medium">Sin tareas para este día</p>
              <p className="text-xs mt-1">Haz clic en &quot;Agregar Tarea&quot; para crear una</p>
            </div>
          ) : (
            <div className="space-y-3">
              {getEventsForDay(currentDate).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-4 rounded-xl bg-[hsl(var(--surface-hover))] border border-[hsl(var(--border))]"
                >
                  <div
                    className={`w-2 h-8 rounded-full flex-shrink-0 ${
                      event.priority === "URGENT"
                        ? "bg-red-400"
                        : event.priority === "HIGH"
                        ? "bg-orange-400"
                        : event.priority === "MEDIUM"
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        event.completed
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {event.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {event.priority} · {event.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create task dialog */}
      <TaskDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedDate(null);
        }}
        onSubmit={handleCreateTask}
        isLoading={isLoading}
        defaultDate={selectedDate ?? undefined}
      />
    </div>
  );
}
