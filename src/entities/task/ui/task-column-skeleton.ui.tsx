import { TaskCardSkeleton } from "./task-card-skeleton.ui";

export function TaskColumnSkeleton() {
  return (
    <div className="rounded-2xl bg-zinc-900 p-4">
      <div className="mb-4 h-6 w-32 rounded bg-zinc-800" />

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <TaskCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
