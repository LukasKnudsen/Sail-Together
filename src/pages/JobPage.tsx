import { useState, useMemo, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Heart, Clock, CalendarDays, Ship, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Media, MediaFallback } from "@/components/ui/media";
import BaseMap from "@/components/map/BaseMap";
import { jobsToGeoJSON } from "@/lib/jobsToGeoJSON";
import ShareJob from "@/components/modals/ShareJob";
import ApplyJob from "@/components/modals/ApplyJob";
import { useJob } from "@/features/jobs/hooks";
import { format } from "date-fns";

export default function JobPage() {
  const [applyOpen, setApplyOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const { jobId } = useParams<{ jobId: string }>();
  const { job, isLoading } = useJob(jobId || "");

  const mapData = useMemo(() => {
    if (
      !job ||
      !job.location ||
      typeof job.location.longitude !== "number" ||
      typeof job.location.latitude !== "number"
    )
      return null;

    return jobsToGeoJSON([job]);
  }, [job]);

  useEffect(() => {
    if (!isLoading) {
      setInitialLoad(false);
    }
  }, [isLoading]);

  if (isLoading || initialLoad) {
    return (
      <Container className="container mx-auto max-w-6xl p-2">
        <div className="flex h-[50vh] items-center justify-center">
          <p>Loading job details...</p>
        </div>
      </Container>
    );
  }

  if (!initialLoad && !isLoading && (!job || !jobId)) {
    return <Navigate to="/404" replace />;
  }

  if (!job) {
    return null;
  }

  return (
    <Container className="container mx-auto max-w-6xl p-2">
      <article className="space-y-8">
        <header className="flex flex-row gap-2.5">
          <Media className="hidden size-24 rounded-3xl md:block">
            <Heart
              className={`absolute top-2.5 right-2.5 cursor-pointer transition ${job.isFavorite ? "fill-red-500 text-red-500" : "fill-neutral-400 text-neutral-400"
                }`}
            />
            <MediaFallback className="bg-neutral-300" />
          </Media>

          <div data-slot="job-summary" className="flex flex-col justify-center gap-0.5">
            <h1 className="text-2xl font-semibold">{job.title}</h1>

            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 [&>dd]:flex [&>dd]:items-center [&>dd]:gap-1">
              <dt className="sr-only">Type</dt>
              <dd>
                <Clock className="text-muted-foreground size-5" />
                {job.type}
              </dd>

              <dt className="sr-only">Posted</dt>
              <dd>
                <CalendarDays className="text-muted-foreground size-5" />
                {job.date ? format(new Date(job.date), "MMM d, yyyy") : "Date not set"}
              </dd>

              <dt className="sr-only">Vessel</dt>
              <dd>
                <Ship className="text-muted-foreground size-5" />
                {job.vessel}
              </dd>

              <dt className="sr-only">Location</dt>
              <dd>
                <MapPin className="text-muted-foreground size-5" />
                {job.location?.name ?? "Unknown location"}
              </dd>
            </dl>
          </div>

          <div data-slot="actions" className="ml-auto flex flex-row gap-2">
            <ShareJob job={job} shareOpen={shareOpen} setShareOpen={setShareOpen} />
            <ApplyJob job={job} applyOpen={applyOpen} setApplyOpen={setApplyOpen} />
          </div>
        </header>

        <section>
          <h2 className="text-xl font-semibold">Job description</h2>
          <p>{job.description || "No description provided."}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Requirements</h2>
          {job.requirements && job.requirements.length > 0 ? (
            <ul className="list-inside list-disc">
              {job.requirements.map((req) => (
                <li key={req.id}>{req.requirement}</li>
              ))}
            </ul>
          ) : (
            <p>No requirements listed.</p>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold">Experience</h2>
          {job.experience && job.experience.length > 0 ? (
            <ul className="list-inside list-disc">
              {job.experience.map((exp) => (
                <li key={exp.id}>{exp.experience}</li>
              ))}
            </ul>
          ) : (
            <p>No specific experience requirements listed.</p>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold">Essential Qualifications</h2>
          {job.qualifications && job.qualifications.length > 0 ? (
            <ul className="grid list-inside list-disc grid-cols-1 md:grid-cols-2">
              {job.qualifications.map((qual) => (
                <li key={qual.id}>{qual.qualification}</li>
              ))}
            </ul>
          ) : (
            <p>No qualifications listed.</p>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold">Where you'll be working</h2>
          <div
            aria-label="Map of job location"
            className="my-4 h-60 w-full overflow-hidden rounded-3xl"
          >
            {mapData ? (
              <BaseMap data={mapData} />
            ) : (
              <div className="bg-secondary text-muted-foreground flex h-full w-full items-center justify-center">
                Map not available
              </div>
            )}
          </div>
          <p>{job.location?.name ?? "Location not specified"}</p>
          {job.location?.address && (
            <p className="text-muted-foreground text-sm">{job.location.address}</p>
          )}
        </section>
      </article>
    </Container>
  );
}
