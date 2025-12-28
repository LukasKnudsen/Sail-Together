import { cn } from "@/lib/utils";

interface EventCardSkeletonProps {
  className?: string;
}

export default function EventCardSkeleton({ className }: EventCardSkeletonProps) {
  return (
    <div
      aria-label="event-card-skeleton"
      className={cn("flex aspect-square w-full flex-col gap-2", className)}
    >
      {/* Image skeleton */}
      <div className="bg-muted size-full animate-pulse rounded-3xl" />

      {/* Text content skeleton */}
      <div className="flex w-full flex-col gap-1 px-1">
        {/* Title skeleton */}
        <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
        {/* Date skeleton */}
        <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
        {/* Location skeleton */}
        <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
      </div>
    </div>
  );
}
