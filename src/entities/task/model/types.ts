export type TaskStatus = "todo" | "in-progress" | "review" | "done";

export type TaskPriority = "low" | "medium" | "high";

export type TaskSource = "jsonplaceholder" | "local";

export type Task = {
  id: string;
  apiId: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  userId: number;
  commentsCount: number;
  attachmentsCount: number;
  source: TaskSource;
};

export type TaskDraft = {
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
};

export type TaskFilters = {
  search: string;
  status: "all" | TaskStatus;
  priority: "all" | TaskPriority;
};

export type JsonPlaceholderTodo = {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
};
