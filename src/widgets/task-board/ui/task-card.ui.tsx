import type { Task } from "@/entities";
import { TaskPriorityBadge } from "@/entities/task/ui/task-priority-badge";
import { DateUtils } from "@/shared/lib/utils/date.utils";
import { MessageSquare, Paperclip } from "lucide-react";

export function TaskCard({ task }: { task: Task }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3 ">
      <h3 className="mb-2 font-medium">{task.title}</h3>

      <div className="flex gap-2.5 items-center justify-between">
        <p className="text-sm text-rose-400">
          {DateUtils.getDate(new Date(task.createdAt))}{" "}
          {DateUtils.getTime(new Date(task.createdAt))}
        </p>
      </div>

      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <MessageSquare size={16} />
            <span>{task.commentsCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Paperclip size={18} />
            <span>{task.attachmentsCount}</span>
          </div>
        </div>
        <TaskPriorityBadge priority={task.priority} />
      </div>
    </div>
  );
}
