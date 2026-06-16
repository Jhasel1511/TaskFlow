// src/actions/taskActions.ts
// Server Actions for task CRUD — validated with Zod, session-protected

"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  getDashboardStats,
  getWeeklyProductivity,
  getUpcomingTasks,
  getTasksByUser,
  getTasksInRange,
} from "@/services/taskService";

// ─── Validation Schemas ───────────────────────────────────────────────────────

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(2000).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
  startDate: z.date(),
  dueDate: z.date(),
});

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Get the current session user ID or throw */
async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

/** Standard action result type */
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// ─── Query Actions ────────────────────────────────────────────────────────────

export async function fetchTasksAction() {
  const userId = await requireUserId();
  return getTasksByUser(userId);
}

export async function fetchDashboardStatsAction() {
  const userId = await requireUserId();
  return getDashboardStats(userId);
}

export async function fetchWeeklyProductivityAction() {
  const userId = await requireUserId();
  return getWeeklyProductivity(userId);
}

export async function fetchUpcomingTasksAction() {
  const userId = await requireUserId();
  return getUpcomingTasks(userId);
}

export async function fetchTasksInRangeAction(start: Date, end: Date) {
  const userId = await requireUserId();
  return getTasksInRange(userId, start, end);
}

// ─── Mutation Actions ─────────────────────────────────────────────────────────

export async function createTaskAction(
  formData: z.infer<typeof taskSchema>
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireUserId();
    const validated = taskSchema.parse(formData);

    if (validated.dueDate < validated.startDate) {
      return { success: false, error: "Due date must be after start date" };
    }

    const task = await createTask(userId, validated);
    revalidatePath("/dashboard");
    revalidatePath("/tasks");
    revalidatePath("/calendar");

    return { success: true, data: { id: task.id } };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0]?.message || "Validation failed" };
    }
    return { success: false, error: "Failed to create task" };
  }
}

export async function updateTaskAction(
  taskId: string,
  formData: Partial<z.infer<typeof taskSchema>>
): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    await updateTask(taskId, userId, formData);

    revalidatePath("/dashboard");
    revalidatePath("/tasks");
    revalidatePath("/calendar");

    return { success: true, data: undefined };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update task",
    };
  }
}

export async function deleteTaskAction(taskId: string): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    await deleteTask(taskId, userId);

    revalidatePath("/dashboard");
    revalidatePath("/tasks");
    revalidatePath("/calendar");

    return { success: true, data: undefined };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete task",
    };
  }
}

export async function toggleTaskAction(taskId: string): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    await toggleTaskCompletion(taskId, userId);

    revalidatePath("/dashboard");
    revalidatePath("/tasks");

    return { success: true, data: undefined };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update task",
    };
  }
}
