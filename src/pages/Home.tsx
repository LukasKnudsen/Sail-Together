import useSWR from "swr";
import TwoColumnLayout from "@/components/layouts/TwoColumnLayout";
import JobList from "@/components/JobList";
import JobCard from "@/components/JobCard";
import { getJobs } from "@/features/jobs/api";

export default function Home() {
  const { data, isLoading, error } = useSWR("jobs", getJobs, {
    dedupingInterval: 10 * 60 * 1000,
    revalidateIfStale: true,
  });

  return (
    <>
      <main>
        <TwoColumnLayout
          sidebar={
            <JobList title="jobs within map area" count={data?.length} isLoading={isLoading}>
              {isLoading ? (
                <div className="flex h-[50vh] items-center justify-center">
                  <p>Loading jobs...</p>
                </div>
              ) : error ? (
                <li className="text-destructive">Error loading jobs: {String(error.message ?? error)}</li>
              ) : data && data.length > 0 ? (
                data.map((job) => (
                  <li key={job.id}>
                    <JobCard job={job} />
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground">No jobs found</li>
              )}
            </JobList>
          }
          map={<div className="bg-muted size-full rounded-3xl" />}
        />
      </main>
    </>
  );
}
