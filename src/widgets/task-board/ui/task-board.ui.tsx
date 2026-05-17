import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "@/entities/task/api/task-api";
import { Button } from "@/shared/ui/button";
import type { TaskStatus } from "@/entities";
import { TaskColumn } from "./task-column.ui";

const columns: {
  title: string;
  status: TaskStatus;
}[] = [
  {
    title: "Todo",
    status: "todo",
  },
  {
    title: "In Progress",
    status: "in-progress",
  },
  {
    title: "Review",
    status: "review",
  },
  {
    title: "Done",
    status: "done",
  },
];

export function TaskBoard() {
  // ---------------------------------------------------------------------------
  // Fetch data
  // ---------------------------------------------------------------------------

  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        Loading tasks...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-red-500">
        Failed to load tasks.
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  return (
    <main className="min-h-screen bg-zinc-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Task Board</h1>

            <p className="text-zinc-400">
              Manage your tasks without losing your sanity.
            </p>
          </div>

          <Button>Create Task</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((column) => (
            <TaskColumn
              key={column.status}
              tasks={tasks}
              title={column.title}
              status={column.status}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
