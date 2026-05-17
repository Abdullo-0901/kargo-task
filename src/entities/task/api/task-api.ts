import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

import {
  createLocalTask,
  normalizeJsonPlaceholderTask,
} from "../lib/normalize-task";

import type { JsonPlaceholderTodo, Task, TaskDraft } from "../model/types";

export async function fetchTasks(): Promise<Task[]> {
  try {
    const data = await apiClient<JsonPlaceholderTodo[]>(API_ENDPOINTS.todos);

    return data.map(normalizeJsonPlaceholderTask);
  } catch (error) {
    console.error(error);

    throw new Error("Failed to fetch tasks");
  }
}

export async function createTask(draft: TaskDraft): Promise<Task> {
  await apiClient(API_ENDPOINTS.todos, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      completed: draft.status === "done",
      title: draft.title,
      userId: 1,
    }),
  });

  return createLocalTask(draft);
}

export async function updateTask(task: Task): Promise<Task> {
  if (task.source === "local") return task;

  await apiClient(`${API_ENDPOINTS.todos}/${task.apiId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      completed: task.status === "done",
      title: task.title,
    }),
  });

  return task;
}

export async function deleteTask(task: Task): Promise<void> {
  if (task.source === "local") return;

  await apiClient(`${API_ENDPOINTS.todos}/${task.apiId}`, {
    method: "DELETE",
  });
}
