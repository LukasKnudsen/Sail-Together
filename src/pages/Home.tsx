import { useEffect, useCallback } from "react";
import SearchJobs from "@/components/searchbar/SearchJobs";
import JobsSidebar from "@/components/JobsSidebar";
import { useJobs, useToggleFavorite } from "@/features/jobs/hooks";
//import { jobsToGeoJSON } from "@/lib/jobsToGeoJSON";
//import Map from "@/components/map/Map";
import AddJobForm from "@/components/forms/AddJobForm";

export default function Home() {
  const { jobs, fetchJobs, isLoading, error } = useJobs();
  const { toggle } = useToggleFavorite();

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleFavorite = useCallback(
    async (jobId: string) => {
      try {
        await toggle(jobId);
        await fetchJobs();
      } catch (err) {
        console.error("Failed to toggle favorite:", err);
      }
    },
    [toggle, fetchJobs]
  );

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p>Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <>
      <SearchJobs />

      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
        <aside className="flex flex-col gap-4">
          <JobsSidebar jobs={jobs} onToggleFavorite={handleToggleFavorite} />
        </aside>

        <section>
          <div className="sticky top-14 h-[calc(100dvh-56px-16px-48px-16px)] py-6">
            {/* <Map jobs={jobsGeoJSON} /> */}

            {/* TEMPORARY DEV PANEL */}
            <div className="rounded-xl border-3 border-orange-500 p-4">
              <p className="text-xl font-bold text-orange-500 uppercase">Dev Panel</p>
              <AddJobForm />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
