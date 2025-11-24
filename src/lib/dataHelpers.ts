import type { EventAttributes, EventWithRelations } from "@/db/types/Event";
import type { JobWithRelations } from "@/types/job";
import type { CategorySlug } from "@/types/category";
import { CATEGORIES } from "@/data/categories";
import { getJobById } from "@/features/jobs/api";
import type { LocationAttributes } from "@/db/types/Location";
import type { _UserAttributes } from "@/db/types/_User";

/**
 * Helper to get event with relations (location, category)
 * Uses spread operator similar to parseToJSON pattern
 */
export function getEventWithRelations(event: EventAttributes): EventWithRelations {
  // Extract location from locationId (serialized LocationAttributes from Parse)
  const locationData = event.locationId as unknown as LocationAttributes;
  const location = {
    id: locationData?.id || locationData?.objectId || "unknown",
    name: locationData?.name || "Location TBD",
    address: locationData?.address || "Address TBD",
    longitude: locationData?.longitude || 0,
    latitude: locationData?.latitude || 0,
  };

  // Extract createdBy from createdById (serialized _UserAttributes from Parse)
  const userData = event.createdById as unknown as _UserAttributes;
  const createdBy = userData
    ? {
      id: userData.id || userData.objectId || "unknown",
      name: userData.name,
      avatarUrl: userData.avatarUrl,
    }
    : undefined;

  // Look up category from static data
  const categoryData = CATEGORIES.find((cat) => cat.slug === event.categorySlug);
  const category = categoryData
    ? {
      slug: categoryData.slug,
      name: categoryData.name,
    }
    : {
      slug: (event.categorySlug || "other") as CategorySlug,
      name: "Other",
    };

  // Return with relations, using spread operator like parseToJSON
  return {
    ...event,
    location,
    category,
    createdBy,
    locationId: location.id,
    createdById: userData?.id || userData?.objectId,
  };
}

/**
 * Helper to get job with relations (location, requirements, experience, qualifications)
 */
export async function getJobWithRelations(
  job: JobWithRelations
): Promise<JobWithRelations> {
  if (
    job.location?.id &&
    typeof job.location.longitude === "number" &&
    typeof job.location.latitude === "number"
  ) {
    return job;
  }

  if (!job.id) {
    throw new Error("getJobWithRelations: job has no id");
  }

  const full = await getJobById(job.id);
  if (!full) {
    throw new Error(`Job ${job.id} not found`);
  }

  return full;
}
