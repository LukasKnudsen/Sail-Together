import type { JobWithRelations } from "@/types/job";
import type { GenericFeature, GenericFeatureCollection } from "@/types/map";

function jobToFeature(job: JobWithRelations): GenericFeature {
  if (!job.location?.longitude || !job.location?.latitude) {
    throw new Error(`Job ${job.id} missing valid location coordinates`);
  }

  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [job.location.longitude, job.location.latitude],
    },
    properties: {
      id: job.id,
      title: job.title,
    },
  };
}

export function jobsToGeoJSON(jobs: JobWithRelations[]): GenericFeatureCollection {
  return {
    type: "FeatureCollection",
    features: jobs
      .filter((job) => job.location?.longitude && job.location?.latitude)
      .map((job) => {
        try {
          return jobToFeature(job);
        } catch (err) {
          console.warn(`Failed to convert job ${job.id} to GeoJSON feature:`, err);
          return null;
        }
      })
      .filter((feature): feature is GenericFeature => feature !== null),
  };
}
