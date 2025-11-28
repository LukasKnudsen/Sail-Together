import type { ReactNode } from "react";

interface EventGridProps {
  title: string;
  count?: number;
  children?: ReactNode;
  className?: string;
  gridClassName?: string;
}

export default function EventGrid({
  title,
  count,
  children,
  className,
  gridClassName = "grid grid-cols-2 gap-4 lg:grid-cols-3",
}: EventGridProps) {
  if (!children) {
    return null;
  }

  const displayTitle = count !== undefined ? `${count} ${title}` : title;

  return (
    <div className={className}>
      <h2 className="pb-4 font-medium">{displayTitle}</h2>
      <div className={gridClassName}>{children}</div>
    </div>
  );
}
