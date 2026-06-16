// src/types/index.ts
// Tipos principales de TypeScript para TaskFlow

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type Status = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: Priority;
  status: Status;
  completed: boolean;
  startDate: Date;
  dueDate: Date;
  googleEventId?: string | null;
  userId: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  startDate: Date;
  dueDate: Date;
}

export interface DashboardStats {
  pending: number;
  completed: number;
  overdue: number;
  today: number;
}

export interface WeeklyProductivity {
  day: string;
  completed: number;
  created: number;
}

export type CalendarView = "month" | "week" | "day";

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  priority: Priority;
  status: Status;
  completed: boolean;
}

// Configuración de prioridades
export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; bg: string }
> = {
  LOW: {
    label: "Baja",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/30",
  },
  MEDIUM: {
    label: "Media",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/30",
  },
  HIGH: {
    label: "Alta",
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/30",
  },
  URGENT: {
    label: "Urgente",
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/30",
  },
};

export const STATUS_CONFIG: Record<
  Status,
  { label: string; color: string; bg: string }
> = {
  PENDING: {
    label: "Pendiente",
    color: "text-slate-400",
    bg: "bg-slate-400/10 border-slate-400/30",
  },
  IN_PROGRESS: {
    label: "En Progreso",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/30",
  },
  COMPLETED: {
    label: "Completada",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/30",
  },
};
