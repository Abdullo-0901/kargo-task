import { SearchIcon } from "lucide-react";
import { memo, useEffect, useState, type ChangeEvent } from "react";
import {
  priorityLabels,
  taskPriorities,
  taskStatuses,
  statusLabels,
} from "@/entities/index";

import type {
  TaskFilters as TaskFiltersValue,
  TaskPriority,
  TaskStatus,
} from "@/entities/index";

import {
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";

type TaskFiltersProps = {
  filters: TaskFiltersValue;
  onChange: (filters: TaskFiltersValue) => void;
};

export const TaskFilters = memo(function TaskFilters({
  filters,
  onChange,
}: TaskFiltersProps) {
  const [search, setSearch] = useState(filters.search);

  useEffect(() => {
    if (search === filters.search) return;

    const timeoutId = window.setTimeout(() => {
      onChange({ ...filters, search });
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [filters, onChange, search]);

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
  }

  return (
    <section className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_220px]">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          aria-label="Search tasks"
          className="pl-9"
          onChange={handleSearchChange}
          placeholder="Search by title"
          value={search}
        />
      </div>

      <Select
        onValueChange={(status) =>
          onChange({ ...filters, status: status as "all" | TaskStatus })
        }
        value={filters.status}
      >
        <SelectTrigger aria-label="Filter by status">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="p-1">
            <SelectItem value="all">All statuses</SelectItem>
            {taskStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {statusLabels[status]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        onValueChange={(priority) =>
          onChange({ ...filters, priority: priority as "all" | TaskPriority })
        }
        value={filters.priority}
      >
        <SelectTrigger aria-label="Filter by priority">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="p-1">
            <SelectItem value="all">All priorities</SelectItem>
            {taskPriorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priorityLabels[priority]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </section>
  );
});
