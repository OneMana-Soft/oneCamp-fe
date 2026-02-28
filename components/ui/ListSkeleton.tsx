import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/helpers/cn";

interface ListSkeletonProps {
  rows?: number;
  className?: string;
  showAvatar?: boolean;
}

export function ListSkeleton({ rows = 5, className, showAvatar = true }: ListSkeletonProps) {
  return (
    <div className={cn("w-full space-y-4 p-4", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          {showAvatar && <Skeleton className="h-10 w-10 rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton className={cn("h-4", i % 2 === 0 ? "w-[80%]" : "w-[60%]")} />
            <Skeleton className={cn("h-3", i % 3 === 0 ? "w-[40%]" : "w-[50%]")} />
          </div>
        </div>
      ))}
    </div>
  );
}
