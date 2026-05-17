import { useDroppable } from "@dnd-kit/core";

import type { Task, TaskStatus } from "@/entities";

import { TaskCard } from "./task-card.ui";

export function TaskColumn({
  tasks,
  title,
  status,
}: {
  tasks: Task[];
  title: string;
  status: TaskStatus;
}) {
  // ---------------------------------------------------------------------------
  // Variables
  // ---------------------------------------------------------------------------

  const filteredTasks = tasks.filter((task) => task.status === status);

  const { setNodeRef } = useDroppable({
    id: status,
    data: {
      status,
      type: "column",
    },
  });

  // ---------------------------------------------------------------------------
  return (
    <div
      ref={setNodeRef}
      className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>

        <span className="text-sm text-zinc-500">{filteredTasks.length}</span>
      </div>

      <div className="min-h-[200px] space-y-3">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
