import type { JobWithRelations } from "@/types/job";
import { useJobStore } from "@/store/useJobStore";
import { Link } from "react-router-dom";
import { Media, MediaFallback } from "./ui/media";
import { CalendarDays, Clock, Heart, MapPin, Ship } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface JobsSidebarProps {
  jobs: JobWithRelations[];
  onToggleFavorite?: (jobId: string) => void;
}

export default function JobsSidebar({ jobs, onToggleFavorite }: JobsSidebarProps) {
  const { setHoveredJobId } = useJobStore();
  const handleFavoriteClick = (e: React.MouseEvent, jobId: string) => {
    e.preventDefault();
    onToggleFavorite?.(jobId);
  };

  return (
    <>
      <h2 className="font-medium">{jobs.length} jobs within map area</h2>

      <ul role="list" className="space-y-4">
        {jobs.map((job) => {
          return (
            <li key={job.id} role="listitem">
              <Link
                tabIndex={0}
                to={`/jobs/${job.id}`}
                aria-label={`View job offer for ${job.title}`}
                onMouseEnter={() => setHoveredJobId(job.id)}
                onMouseLeave={() => setHoveredJobId(null)}
                className="flex min-w-0 flex-row gap-2 overflow-hidden hover:cursor-pointer"
              >
                <Media className="size-24 rounded-3xl">
                  <Heart
                    onClick={(e) => handleFavoriteClick(e, job.id)}
                    className={cn(
                      "absolute top-2.5 right-2.5 cursor-pointer transition",
                      job.isFavorite
                        ? "fill-red-500 text-red-500"
                        : "fill-neutral-400 text-neutral-400"
                    )}
                  />
                  <MediaFallback className="bg-neutral-300" />
                </Media>

                <article className="min-w-0 space-y-1">
                  <header>
                    <h2 className="truncate text-lg font-semibold">{job.title}</h2>
                  </header>

                  <dl className="space-y-2 text-sm [&_dd]:truncate [&>div]:flex [&>div]:gap-x-6">
                    <div>
                      <div className="flex min-w-0 items-center gap-1">
                        <dt className="sr-only">Job Type</dt>
                        <Clock className="text-muted-foreground size-5 shrink-0" />
                        <dd>{job.type}</dd>
                      </div>

                      <div className="flex min-w-0 items-center gap-1">
                        <dt className="sr-only">Date</dt>
                        <CalendarDays className="text-muted-foreground size-5 shrink-0" />
                        <dd>
                          <time dateTime={job.date ? new Date(job.date).toISOString() : ""}>
                            {job.date ? format(new Date(job.date), "MMM d, yyyy") : "Date not set"}
                          </time>
                        </dd>
                      </div>
                    </div>

                    <div>
                      <div className="flex min-w-0 items-center gap-1">
                        <dt className="sr-only">Vessel</dt>
                        <Ship className="text-muted-foreground size-5 shrink-0" />
                        <dd>{job.vessel}</dd>
                      </div>

                      <div className="flex min-w-0 items-center gap-1">
                        <dt className="sr-only">Location</dt>
                        <MapPin className="text-muted-foreground size-5 shrink-0" />
                        <dd>{job.location.address}</dd>
                      </div>
                    </div>
                  </dl>
                </article>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
