import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface EventGridProps {
  title: string;
  count?: number;
  children?: ReactNode;
  className?: string;
  gridClassName?: string;
  isLoading?: boolean;
}

export default function EventGrid({
  title,
  count,
  children,
  className,
  gridClassName,
  isLoading = false,
}: EventGridProps) {
  if (!children) {
    return null;
  }

  const displayTitle = count !== undefined ? `${count} ${title}` : title;

  return (
    <div className={className}>
      {isLoading ? (
        <div className="bg-muted mb-4 h-6 w-48 animate-pulse rounded" />
      ) : (
        <h2 className="pb-4 font-medium">{displayTitle}</h2>
      )}
      <div className={cn("grid grid-cols-2 gap-4 lg:grid-cols-3", gridClassName)}>{children}</div>
    </div>
  );
}
