import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { JobAttributes } from "@/db/types/Job";
import CardMedia from "./CardMedia";
import { MapPin, Ship, Clock, CalendarDays } from "lucide-react";

function formatJobDate(date: Date | string | undefined): string {
    if (!date) return "Date TBD";
    try {
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return "Invalid date";
        return `${format(d, "do MMM yyyy")}`;
    } catch {
        return "Date TBD";
    }
}

export default function JobCard({
    job,
    className,
    onToggleFavorite,
    ...props
}: React.ComponentProps<"div"> & {
    job: JobAttributes;
    onToggleFavorite?: (id: string) => void;
}) {
    const loc = job.locationId as any;

    return (
        <div
            aria-label="job-card"
            className={cn("flex w-full items-center gap-3", className)}
            {...props}
        >
            <div className="relative shrink-0">
                <CardMedia
                    isFavorite={job.isFavorite ?? false}
                    onFavoriteClick={(e) => {
                        e.preventDefault();
                        onToggleFavorite?.(job.id);
                    }}
                    className="size-28 rounded-3xl"
                />
            </div>

            <article className="space-y-1.5">
                <h3 className="truncate font-semibold leading-tight">{job.title}</h3>
                <dl className="space-y-2 space-x-2 text-base [&_dd]:truncate [&>div]:flex [&>div]:gap-x-6">
                    <div className="flex-1 space-y-1">
                        <div className="flex flex-col gap-1.5">
                            <p className="text-muted-foreground flex items-center gap-2 truncate leading-5">
                                <Clock className="inline size-4" /> {job.type}
                            </p>
                            <p className="text-muted-foreground flex items-center gap-2 truncate leading-5">
                                <CalendarDays className="inline size-4" /> {formatJobDate(job.date)}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <p className="text-muted-foreground flex items-center gap-2 truncate leading-5">
                                <Ship className="inline size-4" /> {job.vessel}
                            </p>
                            <p className="text-muted-foreground flex items-center gap-2 truncate leading-5">
                                <MapPin className="inline size-4" /> {loc?.name ?? loc?.address ?? "Location not specified"}
                            </p>
                        </div>
                    </div>
                </dl>
            </article>
        </div>
    );
}