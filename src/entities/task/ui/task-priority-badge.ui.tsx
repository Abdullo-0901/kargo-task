import { cn } from "@/shared/lib/utils/tailwind.utils";
import type { TaskPriority } from "@/entities/task/model/types";
import { StringUtils } from "@/shared/lib/utils/capitailize.utils";

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  const variants = {
    low: "bg-emerald-500/10 text-emerald-400",
    medium: "bg-amber-500/10 text-amber-400",
    high: "bg-rose-500/10 text-rose-400",
  };

  return (
    <div
      className={cn(
        "rounded-full px-2 py-1 text-xs font-medium",
        variants[priority as keyof typeof variants],
      )}
    >
      {StringUtils.capitalize(priority)}
    </div>
  );
}
