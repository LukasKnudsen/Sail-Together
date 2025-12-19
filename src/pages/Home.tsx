import useSWR from "swr";
import TwoColumnLayout from "@/components/layouts/TwoColumnLayout";
import JobList from "@/components/JobList";
import JobCard from "@/components/JobCard";
import JobCardSkeleton from "@/components/JobCardSkeleton";
import { getJobs } from "@/features/jobs/api";
import { useToggleJobFavorite } from "@/features/jobs/useToggleJobFavorite";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import Map from "@/components/map/Map";
import { jobsToGeoJSON } from "@/lib/jobsToGeoJSON";
import { useJobStore } from "@/store/useJobStore";

export default function Home() {
  const searchFilters = useJobStore((state) => state.searchFilters);
  const swrKey = useMemo(
    () => ["jobs", searchFilters],
    [searchFilters]
  );

  const { data, isLoading, error } = useSWR(
    swrKey,
    () => getJobs(searchFilters),
    {
      dedupingInterval: 10 * 60 * 1000,
      revalidateIfStale: true,
    }
  );

  const toggleFavorite = useToggleJobFavorite(swrKey);
  const mapData = useMemo(() => jobsToGeoJSON(data ?? []), [data]);

  return (
    <>
      <main>
        <TwoColumnLayout
          sidebar={
            <JobList title="jobs within map area" count={data?.length} isLoading={isLoading}>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <li key={i}>
                    <JobCardSkeleton />
                  </li>
                ))
              ) : error ? (
                <li className="text-destructive">Error loading jobs: {String(error.message ?? error)}</li>
              ) : data && data.length > 0 ? (
                data.map((job) => (
                  <li key={job.id}>
                    <Link to={`/jobs/${job.id}`} aria-label={`View job offer for ${job.title}`}>
                      <JobCard job={job} onToggleFavorite={toggleFavorite} />
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground">No jobs found</li>
              )}
            </JobList>
          }
          map={<Map jobs={mapData} />}
        />
      </main>
    </>
  );
}
