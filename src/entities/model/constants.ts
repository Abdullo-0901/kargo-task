import type { TaskPriority, TaskStatus } from "./types";

export const taskStatuses: TaskStatus[] = [
  "todo",
  "in-progress",
  "review",
  "done",
];

export const taskPriorities: TaskPriority[] = ["low", "medium", "high"];

export const statusLabels: Record<TaskStatus, string> = {
  done: "Done",
  "in-progress": "In Progress",
  review: "Review",
  todo: "Todo",
};

export const priorityLabels: Record<TaskPriority, string> = {
  high: "High",
  low: "Low",
  medium: "Medium",
};
