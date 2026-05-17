import { Skeleton } from "@/shared/ui/skeleton";

export function TaskCardSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <Skeleton className="h-5 w-3/4 bg-zinc-800" />

      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20 bg-zinc-800" />
        <Skeleton className="h-4 w-16 bg-zinc-800" />
      </div>
    </div>
  );
}
