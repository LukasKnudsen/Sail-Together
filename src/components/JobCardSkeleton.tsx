import { cn } from "@/lib/utils";

interface JobCardSkeletonProps {
  className?: string;
}

export default function JobCardSkeleton({ className }: JobCardSkeletonProps) {
  return (
    <div
      aria-label="job-card-skeleton"
      className={cn("flex w-full items-center gap-3", className)}
    >
      {/* Image skeleton */}
      <div className="bg-muted size-28 shrink-0 animate-pulse rounded-3xl" />
      {/* Text content skeleton */}
      
      <article className="flex-1 space-y-1.5">
        {/* Title skeleton */}
        <div className="bg-muted h-5 w-3/4 animate-pulse rounded" />
        {/* Info rows skeleton */}
        <div className="space-y-1">
          <div className="flex flex-col gap-1.5">
            {/* Type skeleton */}
            <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
            {/* Date skeleton */}
            <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
          </div>
          <div className="flex flex-col gap-1.5">
            {/* Vessel skeleton */}
            <div className="bg-muted h-4 w-3/5 animate-pulse rounded" />
            {/* Location skeleton */}
            <div className="bg-muted h-4 w-4/5 animate-pulse rounded" />
          </div>
        </div>
      </article>
    </div>
  );
}

