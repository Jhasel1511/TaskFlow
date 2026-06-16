// src/services/taskService.ts
// Server-side task CRUD service using Prisma

import { prisma } from "@/lib/prisma";
import type { TaskFormData, DashboardStats, WeeklyProductivity } from "@/types";
import { startOfDay, endOfDay, subDays, format } from "date-fns";
import { es } from "date-fns/locale";

// ─── Fetch ────────────────────────────────────────────────────────────────────

/**
 * Get all tasks for a specific user, ordered by due date ascending.
 */
export async function getTasksByUser(userId: string) {
  return prisma.task.findMany({
    where: { userId },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  });
}

/**
 * Get a single task by ID, ensuring it belongs to the given user.
 */
export async function getTaskById(taskId: string, userId: string) {
  return prisma.task.findFirst({
    where: { id: taskId, userId },
  });
}

/**
 * Get tasks for a specific date range (used by calendar view).
 */
export async function getTasksInRange(
  userId: string,
  start: Date,
  end: Date
) {
  return prisma.task.findMany({
    where: {
      userId,
      OR: [
        { startDate: { gte: start, lte: end } },
        { dueDate: { gte: start, lte: end } },
      ],
    },
    orderBy: { dueDate: "asc" },
  });
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

/**
 * Calculate summary statistics for the dashboard cards.
 */
export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const [pending, completed, overdue, today] = await Promise.all([
    // Pending = not completed
    prisma.task.count({
      where: { userId, completed: false },
    }),
    // Completed tasks
    prisma.task.count({
      where: { userId, completed: true },
    }),
    // Overdue = not completed and dueDate is in the past
    prisma.task.count({
      where: {
        userId,
        completed: false,
        dueDate: { lt: todayStart },
      },
    }),
    // Today = tasks due today
    prisma.task.count({
      where: {
        userId,
        dueDate: { gte: todayStart, lte: todayEnd },
      },
    }),
  ]);

  return { pending, completed, overdue, today };
}

/**
 * Get weekly productivity data for the chart (last 7 days).
 */
export async function getWeeklyProductivity(
  userId: string
): Promise<WeeklyProductivity[]> {
  const days: WeeklyProductivity[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const [completed, created] = await Promise.all([
      prisma.task.count({
        where: {
          userId,
          completed: true,
          updatedAt: { gte: dayStart, lte: dayEnd },
        },
      }),
      prisma.task.count({
        where: {
          userId,
          createdAt: { gte: dayStart, lte: dayEnd },
        },
      }),
    ]);

    const dayLabel = format(date, "EEE", { locale: es });
    days.push({
      day: dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1),
      completed,
      created,
    });
  }

  return days;
}

/**
 * Get upcoming tasks (not completed, due in next 7 days).
 */
export async function getUpcomingTasks(userId: string) {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return prisma.task.findMany({
    where: {
      userId,
      completed: false,
      dueDate: { gte: now, lte: nextWeek },
    },
    orderBy: { dueDate: "asc" },
    take: 5,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * Create a new task for a user.
 */
export async function createTask(userId: string, data: TaskFormData) {
  return prisma.task.create({
    data: {
      ...data,
      userId,
      completed: data.status === "COMPLETED",
    },
  });
}

/**
 * Update an existing task, verifying ownership.
 */
export async function updateTask(
  taskId: string,
  userId: string,
  data: Partial<TaskFormData & { completed: boolean }>
) {
  // Ensure the task belongs to this user
  const existing = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!existing) {
    throw new Error("Task not found or access denied");
  }

  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...data,
      // Auto-set completed flag when status changes
      ...(data.status === "COMPLETED" && { completed: true }),
      ...(data.status && data.status !== "COMPLETED" && { completed: false }),
    },
  });
}

/**
 * Toggle the completed state of a task.
 */
export async function toggleTaskCompletion(taskId: string, userId: string) {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) throw new Error("Task not found or access denied");

  return prisma.task.update({
    where: { id: taskId },
    data: {
      completed: !task.completed,
      status: !task.completed ? "COMPLETED" : "PENDING",
    },
  });
}

/**
 * Delete a task, verifying ownership.
 */
export async function deleteTask(taskId: string, userId: string) {
  const existing = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!existing) throw new Error("Task not found or access denied");

  return prisma.task.delete({ where: { id: taskId } });
}
