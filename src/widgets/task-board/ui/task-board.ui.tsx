import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "@/entities/api/task-api";
import { Button } from "@/shared/ui/button";
import type { TaskStatus } from "@/entities";

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
          {columns.map((column) => {
            const filteredTasks = tasks.filter(
              (task) => task.status === column.status,
            );

            return (
              <div
                key={column.status}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  {/* ----------------------------------------------------------------------- */}
                  {/* TITLE */}
                  {/* ----------------------------------------------------------------------- */}

                  <h2 className="text-lg font-semibold">{column.title}</h2>

                  {/* ----------------------------------------------------------------------- */}
                  {/* LENGTH */}
                  {/* ----------------------------------------------------------------------- */}

                  <span className="text-sm text-zinc-500">
                    {filteredTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-xl border border-zinc-800 bg-zinc-950 p-3"
                    >
                      <h3 className="mb-1 font-medium">{task.title}</h3>

                      <p className="text-sm text-zinc-400">
                        Priority: {task.priority}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
