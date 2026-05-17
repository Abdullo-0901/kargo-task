import { Button } from "@/shared/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { Task } from "../model/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function TaskCardActions({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          size="icon"
          variant="ghost"
          className="size-8 text-zinc-400 hover:bg-zinc-800 hover:text-white"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="border-zinc-800 bg-zinc-900 text-white"
      >
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          className="cursor-pointer"
        >
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task);
          }}
          className="cursor-pointer text-red-400 focus:text-red-400"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
