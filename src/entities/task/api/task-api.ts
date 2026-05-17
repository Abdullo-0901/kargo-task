import {
  createLocalTask,
  normalizeDummyJsonTask,
  normalizeJsonPlaceholderTask,
} from "../lib/normalize-task";
import type {
  DummyJsonResponse,
  JsonPlaceholderTodo,
  Task,
  TaskDraft,
} from "../model/types";

const dummyJsonUrl = "https://dummyjson.com/todos";
const jsonPlaceholderUrl = "https://jsonplaceholder.typicode.com/todos";

export async function fetchTasks(): Promise<Task[]> {
  const [dummyResponse, placeholderResponse] = await Promise.all([
    fetch(dummyJsonUrl),
    fetch(jsonPlaceholderUrl),
  ]);

  if (!dummyResponse.ok || !placeholderResponse.ok) {
    throw new Error("Failed to load tasks from public APIs.");
  }

  const dummyData = (await dummyResponse.json()) as DummyJsonResponse;
  const placeholderData =
    (await placeholderResponse.json()) as JsonPlaceholderTodo[];

  return [
    ...dummyData.todos.map(normalizeDummyJsonTask),
    ...placeholderData.slice(0, 60).map(normalizeJsonPlaceholderTask),
  ];
}

export async function createTask(draft: TaskDraft): Promise<Task> {
  await fetch(`${dummyJsonUrl}/add`, {
    body: JSON.stringify({
      completed: draft.status === "done",
      todo: draft.title,
      userId: 1,
    }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  return createLocalTask(draft);
}

export async function updateTask(task: Task): Promise<Task> {
  if (task.source === "local") return task;

  await fetch(getMutationUrl(task), {
    body: JSON.stringify({
      completed: task.status === "done",
      title: task.title,
      todo: task.title,
    }),
    headers: { "Content-Type": "application/json" },
    method: "PUT",
  });

  return task;
}

export async function deleteTask(task: Task): Promise<void> {
  if (task.source === "local") return;

  await fetch(getMutationUrl(task), {
    method: "DELETE",
  });
}

function getMutationUrl(task: Task): string {
  if (task.source === "jsonplaceholder") {
    return `${jsonPlaceholderUrl}/${task.apiId}`;
  }

  return `${dummyJsonUrl}/${task.apiId}`;
}
