import { z } from "zod";

export const createTaskFormSchema = z.object({
  title: z.string().min(3, "Title is required").max(50, "Max 50 characters"),
  priority: z.enum(["low", "medium", "high"]),
});

export type CreateTaskFormValues = z.infer<typeof createTaskFormSchema>;
