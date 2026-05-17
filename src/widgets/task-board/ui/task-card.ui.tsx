import { useDraggable } from "@dnd-kit/core";
import { TaskCardActions, type Task } from "@/entities";
import { TaskPriorityBadge } from "@/entities/task/ui/task-priority-badge.ui";
import { DateUtils } from "@/shared/lib/utils/date.utils";
import { cn } from "@/shared/lib/utils/tailwind.utils";
import { GripVertical, MessageSquare, Paperclip } from "lucide-react";

export function TaskCard({
  task,
  onDelete,
  onEdit,
}: {
  task: Task;
  onEdit(task: Task): void;
  onDelete: (task: Task) => void;
}) {
  // ---------------------------------------------------------------------------
  // Variables
  // ---------------------------------------------------------------------------
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: {
        type: "task",
        task,
      },
    });

  // ---------------------------------------------------------------------------
  // Styles
  // ---------------------------------------------------------------------------

  const style = transform
    ? {
        transform: `translate3d(
          ${transform.x}px,
          ${transform.y}px,
          0
        )`,
      }
    : undefined;

  // ---------------------------------------------------------------------------
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex touch-action-none cursor-grab flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3 active:cursor-grabbing",
        isDragging && "opacity-30",
      )}
    >
      {/* --------------------------------------------------------------------------- */}
      {/* TITLE */}
      {/* --------------------------------------------------------------------------- */}

      <div className="cursor-grab active:cursor-grabbing">
        <GripVertical
          {...attributes}
          {...listeners}
          className="size-4 cursor-grab mb-4 text-zinc-500"
        />
        <h3 className="line-clamp-2 font-medium"> {task.title} </h3>{" "}
      </div>

      {/* --------------------------------------------------------------------------- */}
      {/* DATE CONTAINER */}
      {/* --------------------------------------------------------------------------- */}

      <div className="flex items-center justify-between gap-2.5">
        <p className="text-sm text-rose-400">
          {DateUtils.getDate(new Date(task.createdAt))}{" "}
          {DateUtils.getTime(new Date(task.createdAt))}
        </p>
        <TaskCardActions onDelete={onDelete} onEdit={onEdit} task={task} />
      </div>

      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          {/* --------------------------------------------------------------------------- */}
          {/* COMMENT  */}
          {/* --------------------------------------------------------------------------- */}
          <div className="flex items-center gap-1">
            <MessageSquare size={16} />

            <span>{task.commentsCount}</span>
          </div>

          {/* --------------------------------------------------------------------------- */}
          {/* ATTACHMENTS */}
          {/* --------------------------------------------------------------------------- */}

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
