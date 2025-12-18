import useSWR from "swr";
import { getCurrentUser } from "@/lib/parse/auth";
import { getJobs } from "@/features/jobs/api";
import { useToggleJobFavorite } from "@/features/jobs/useToggleJobFavorite";
import type { JobAttributes } from "@/db/types/Job";
import CardMedia from "@/components/CardMedia";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

function formatJobDate(date: Date | string | undefined): string {
    if (!date) return "Date TBD";
    try {
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return "Invalid date";
        return format(d, "do MMM yyyy");
    } catch {
        return "Date TBD";
    }
}

export default function Listings() {
    const user = getCurrentUser();
    const { data, isLoading, error } = useSWR<JobAttributes[]>("jobs", getJobs, {
        revalidateIfStale: true,
        dedupingInterval: 10 * 60 * 1000,
    });

    const toggleFavorite = useToggleJobFavorite("jobs");
    const jobs = (data ?? []).filter((j: any) => {
        const ownerId =
            j?.createdById?.objectId ??
            j?.createdById;
        return ownerId === user?.id;
    });

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Your Listings</h1>
                <p className="text-muted-foreground mt-2">
                    {jobs.length > 0
                        ? `You have ${jobs.length} listing${jobs.length === 1 ? "" : "s"}`
                        : "No listings yet"}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {isLoading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="aspect-square w-full animate-pulse rounded-3xl bg-muted" />
                    ))
                ) : error ? (
                    <div className="text-destructive col-span-full">
                        Error loading listings: {error.message} </div>
                ) : jobs.length > 0 ? (
                    jobs.map((job) => {
                        const loc = job.locationId as any;
                        return (
                            <Link key={job.id} to={`/jobs/${job.id}/edit`}>
                                <div
                                    aria-label="listing-card"
                                    className={cn("flex aspect-square w-full flex-col gap-2")}
                                >
                                    <CardMedia
                                        isFavorite={job.isFavorite ?? false}
                                        onFavoriteClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite?.(job.id);
                                        }}
                                        src={job.imageUrl}
                                    />

                                    <div className="flex w-full flex-col gap-1 px-1">
                                        <h3 className="truncate font-semibold leading-tight">{job.title}</h3>
                                        <p className="text-muted-foreground truncate text-sm leading-none">
                                            {job.type} · {formatJobDate(job.date)}
                                        </p>
                                        <p className="text-muted-foreground truncate text-sm leading-none">
                                            {loc?.name ?? loc?.address ?? "Location not specified"}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="text-muted-foreground col-span-full py-12 text-center">
                        <p className="text-lg">No listings yet</p>
                        <p className="mt-2 text-sm">Start adding listings to see them here!</p>
                    </div>
                )}
            </div>
        </main>
    );
}