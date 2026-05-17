import { useState } from "react";

import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchTasks, updateTask } from "@/entities/task/api/task-api";

import type { Task, TaskStatus } from "@/entities";

import { Button } from "@/shared/ui/button";

import { TaskCard } from "./task-card.ui";
import { TaskColumn } from "./task-column.ui";
import { CreateTaskModal } from "@/features/task/create-task/ui/create-task-modal";

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
  // Variables
  // ---------------------------------------------------------------------------
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // ---------------------------------------------------------------------------
  // Fetch data
  // ---------------------------------------------------------------------------

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const mutation = useMutation({
    mutationFn: updateTask,
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({
        queryKey: ["tasks"],
      });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (old = []) =>
        old.map((task) => {
          if (task.id !== updatedTask.id) {
            return task;
          }
          return updatedTask;
        }),
      );

      return { previousTasks };
    },

    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["tasks"], context?.previousTasks);
    },
  });

  function handleDragStart(event: DragStartEvent) {
    setActiveTaskId(event.active.id as string);
  }

  // ---------------------------------------------------------------------------
  // Functions
  // ---------------------------------------------------------------------------

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveTaskId(null);

    if (!over) return;

    const activeTask = data.find((task) => task.id === active.id);

    if (!activeTask) return;

    let newStatus: TaskStatus;

    const overData = over.data.current;

    if (overData?.type === "task") {
      newStatus = overData.task.status;
    } else if (overData?.type === "column") {
      newStatus = overData.status;
    } else {
      return;
    }

    if (activeTask.status === newStatus) {
      return;
    }

    mutation.mutate({
      ...activeTask,
      status: newStatus,
    });
  }

  const activeTask = data.find((task) => task.id === activeTaskId);

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
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="min-h-screen bg-zinc-950 p-6 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Task Board</h1>

              <p className="text-zinc-400">
                Manage your tasks without losing your sanity.
              </p>
            </div>

            <CreateTaskModal />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {columns.map((column) => (
              <TaskColumn
                key={column.status}
                tasks={data}
                title={column.title}
                status={column.status}
              />
            ))}
          </div>
        </div>
      </main>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-2 opacity-90">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
