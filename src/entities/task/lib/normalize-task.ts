import { taskPriorities, taskStatuses } from "../model/constants";
import type {
  DummyJsonTodo,
  JsonPlaceholderTodo,
  Task,
  TaskDraft,
  TaskSource,
  TaskStatus,
} from "../model/types";

export function normalizeDummyJsonTask(todo: DummyJsonTodo): Task {
  return buildApiTask({
    apiId: todo.id,
    completed: todo.completed,
    source: "dummyjson",
    title: todo.todo,
    userId: todo.userId,
  });
}

export function normalizeJsonPlaceholderTask(todo: JsonPlaceholderTodo): Task {
  return buildApiTask({
    apiId: todo.id,
    completed: todo.completed,
    source: "jsonplaceholder",
    title: todo.title,
    userId: todo.userId,
  });
}

export function createLocalTask(draft: TaskDraft): Task {
  const apiId = Date.now();

  return {
    apiId,
    attachmentsCount: apiId % 4,
    commentsCount: (apiId % 6) + 1,
    createdAt: new Date().toISOString(),
    id: `local-${apiId}`,
    priority: draft.priority,
    source: "local",
    status: draft.status,
    title: draft.title.trim(),
    userId: (apiId % 8) + 1,
  };
}

function buildApiTask({
  apiId,
  completed,
  source,
  title,
  userId,
}: {
  apiId: number;
  completed: boolean;
  source: Exclude<TaskSource, "local">;
  title: string;
  userId: number;
}): Task {
  return {
    apiId,
    attachmentsCount: (apiId + userId) % 5,
    commentsCount: ((apiId * 3 + userId) % 9) + 1,
    createdAt: new Date(Date.now() - apiId * 86_400_000).toISOString(),
    id: `${source}-${apiId}`,
    priority: taskPriorities[(apiId + userId) % taskPriorities.length],
    source,
    status: resolveStatus(apiId, completed),
    title,
    userId,
  };
}

function resolveStatus(id: number, completed: boolean): TaskStatus {
  if (completed) return "done";

  return taskStatuses[id % (taskStatuses.length - 1)];
}
