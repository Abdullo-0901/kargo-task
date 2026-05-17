import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Task } from "@/entities";
import { updateTask } from "@/entities/task/api/task-api";
import {
  priorityLabels,
  statusLabels,
  taskPriorities,
  taskStatuses,
} from "@/entities/task";

import { Button } from "@/shared/ui/button";

import { Input } from "@/shared/ui/input";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import {
  editTaskFormSchema,
  type EditTaskFormValues,
} from "../model/edit-task-form.schema";

export function EditTaskModal({
  open,
  task,
  onOpenChange,
}: {
  open: boolean;
  task: Task | null;
  onOpenChange: (open: boolean) => void;
}) {
  // ---------------------------------------------------------------------------
  // hooks
  // ---------------------------------------------------------------------------

  const form = useForm<EditTaskFormValues>({
    resolver: zodResolver(editTaskFormSchema),

    defaultValues: {
      title: "",
      priority: "low",
      status: "todo",
    },
  });

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!task) return;

    form.reset({
      title: task.title,
      priority: task.priority,
      status: task.status,
    });
  }, [task, form]);

  // ---------------------------------------------------------------------------
  // Mutattions
  // ---------------------------------------------------------------------------

  const mutation = useMutation({
    mutationFn: updateTask,

    onSuccess: () => {
      onOpenChange(false);
    },
  });

  // ---------------------------------------------------------------------------
  // Functions
  // ---------------------------------------------------------------------------

  function onSubmit(values: EditTaskFormValues) {
    if (!task) return;

    mutation.mutate({
      ...task,
      title: values.title,
      priority: values.priority,
      status: values.status,
    });
  }

  // ---------------------------------------------------------------------------
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-800 bg-zinc-950 text-white">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...form.register("title")}
            placeholder="Task title"
            className="border-zinc-800 bg-zinc-900"
          />

          <div className="flex justify-between">
            <Controller
              control={form.control}
              name="priority"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="border-zinc-800 bg-zinc-900">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {taskPriorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priorityLabels[priority]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="border-zinc-800 bg-zinc-900">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {taskStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {statusLabels[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
