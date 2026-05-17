import { z } from "zod";

export const editTaskFormSchema = z.object({
  title: z.string().min(3),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["todo", "in-progress", "review", "done"]),
});

export type EditTaskFormValues = z.infer<typeof editTaskFormSchema>;
