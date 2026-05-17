import { z } from "zod";
import { useState } from "react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTask } from "@/entities/task/api/task-api";
import { FieldError, FieldGroup } from "@/shared/ui/field";
import { createLocalTask, taskPriorities } from "@/entities/task";
import type { Task, TaskDraft } from "@/entities/task/model/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTaskFormSchema } from "../model/create-task-form.schema";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";

import { cn } from "@/shared/lib/utils/tailwind.utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";

type FormValues = z.infer<typeof createTaskFormSchema>;

export function CreateTaskModal() {
  // ---------------------------------------------------------------------------
  // Variables
  // ---------------------------------------------------------------------------

  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  // ---------------------------------------------------------------------------
  // Hooks
  // ---------------------------------------------------------------------------

  const form = useForm<FormValues>({
    resolver: zodResolver(createTaskFormSchema),

    defaultValues: {
      title: "",
      priority: "low",
    },

    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: createTask,

    onMutate: async (draftTask) => {
      await queryClient.cancelQueries({
        queryKey: ["tasks"],
      });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      const optimisticTask = createLocalTask(draftTask);

      queryClient.setQueryData<Task[]>(["tasks"], (old = []) => [
        ...old,
        optimisticTask,
      ]);

      return {
        previousTasks,
      };
    },

    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["tasks"], context?.previousTasks);
    },

    onSuccess: () => {
      form.reset();
      setOpen(false);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });

  // ---------------------------------------------------------------------------
  // Functions
  // ---------------------------------------------------------------------------

  function onSubmit(data: FormValues) {
    const task: TaskDraft = {
      title: data.title,
      status: "todo",
      priority: data.priority,
    };

    mutation.mutate(task);
  }

  // ---------------------------------------------------------------------------
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Task</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup data-invalid={!!form.formState.errors.title}>
            <Input
              placeholder="Enter task title..."
              className={cn(
                "focus-visible:ring-0",

                form.formState.errors.title ? "border border-red-500" : "",
              )}
              {...form.register("title")}
            />

            {form.formState.errors.title && (
              <FieldError
                errors={[form.formState.errors.title]}
                className="text-start text-sm"
              />
            )}
          </FieldGroup>

          <Controller
            name="priority"
            control={form.control}
            render={({ field }) => (
              <FieldGroup>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>

                  <SelectContent>
                    {taskPriorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldGroup>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
