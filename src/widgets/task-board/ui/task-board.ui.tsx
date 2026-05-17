import { useEffect, useRef, useState } from "react";

import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { fetchTasks, updateTask } from "@/entities/task/api/task-api";

import {
  statusLabels,
  taskStatuses,
  type Task,
  type TaskStatus,
} from "@/entities";

import { CreateTaskModal } from "@/features/task/create-task/ui/create-task-modal";

import { TaskCard } from "./task-card.ui";
import { TaskColumn } from "./task-column.ui";
import { TaskColumnSkeleton } from "@/entities/task/ui/task-column-skeleton.ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";

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
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | "all">(
    "all",
  );

  const queryClient = useQueryClient();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // ---------------------------------------------------------------------------
  // Fetch data
  // ---------------------------------------------------------------------------

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["tasks"],

    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      fetchTasks({
        pageParam,
        limit: 20,
      }),

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 20) {
        return undefined;
      }

      return allPages.length + 1;
    },
  });

  const allTasks = data?.pages.flatMap((page) => page) ?? [];
  const tasks =
    selectedStatus === "all"
      ? allTasks
      : allTasks.filter((task) => task.status === selectedStatus);

  // ---------------------------------------------------------------------------
  // Infinite scroll
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.5,
      },
    );

    const current = loadMoreRef.current;

    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // ---------------------------------------------------------------------------
  // Mutation
  // ---------------------------------------------------------------------------

  const mutation = useMutation({
    mutationFn: updateTask,

    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({
        queryKey: ["tasks"],
      });

      const previousData = queryClient.getQueryData(["tasks"]);

      queryClient.setQueriesData(
        {
          queryKey: ["tasks"],
        },
        (oldData: any) => {
          if (!oldData?.pages) {
            return oldData;
          }

          return {
            ...oldData,

            pages: oldData.pages.map((page: Task[]) =>
              page.map((task) => {
                if (task.id !== updatedTask.id) {
                  return task;
                }

                return updatedTask;
              }),
            ),
          };
        },
      );

      return {
        previousData,
      };
    },

    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["tasks"], context?.previousData);
    },
  });

  // ---------------------------------------------------------------------------
  // Drag handlers
  // ---------------------------------------------------------------------------

  function handleDragStart(event: DragStartEvent) {
    setActiveTaskId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveTaskId(null);

    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);

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

  // ---------------------------------------------------------------------------
  // Active task
  // ---------------------------------------------------------------------------

  const activeTask = tasks.find((task) => task.id === activeTaskId);

  // ---------------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <main className="min-h-screen bg-zinc-950 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="mb-2 h-8 w-52 animate-pulse rounded bg-zinc-800" />

            <div className="h-4 w-72 animate-pulse rounded bg-zinc-800" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <TaskColumnSkeleton key={index} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-white">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-zinc-900 p-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-red-500/10 text-2xl">
              ⚠
            </div>
          </div>

          <h2 className="mb-2 text-2xl font-bold">Failed to load tasks</h2>

          <p className="mb-6 text-sm text-zinc-400">
            {error instanceof Error
              ? error.message
              : "Something went wrong while fetching tasks."}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
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

            <div className="flex items-center gap-3">
              <Select
                value={selectedStatus}
                onValueChange={(value) =>
                  setSelectedStatus(value as TaskStatus | "all")
                }
              >
                <SelectTrigger className="w-[180px] border-zinc-800 bg-zinc-900 text-white">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  {taskStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {statusLabels[status]}{" "}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <CreateTaskModal />
            </div>
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

          {isFetchingNextPage && (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({
                length: 4,
              }).map((_, index) => (
                <TaskColumnSkeleton key={index} />
              ))}
            </div>
          )}

          <div ref={loadMoreRef} className="flex justify-center py-10">
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2 text-zinc-400">
                <div className="size-5 animate-spin rounded-full border-2 border-zinc-700 border-t-white" />
                Loading more tasks...
              </div>
            ) : hasNextPage ? (
              <p className="text-zinc-500">Scroll to load more</p>
            ) : (
              <p className="text-zinc-500">No more tasks</p>
            )}
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
