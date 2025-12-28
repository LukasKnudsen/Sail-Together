import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface JobListProps {
    title: string;
    count?: number;
    children?: ReactNode;
    className?: string;
    listClassName?: string;
    isLoading?: boolean;
}

export default function JobList({
    title,
    count,
    children,
    className,
    listClassName,
    isLoading = false,
}: JobListProps) {
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
            <ul className={cn("flex flex-col gap-4", listClassName)}>{children}</ul>
        </div>
    );
}