import Parse from "@/lib/parse/client";
import { Job } from "@/db/types/Job";
import { Location } from "@/db/types/Location";
import { JobRequirement } from "@/db/types/JobRequirement";
import { JobExperience } from "@/db/types/JobExperience";
import { JobQualification } from "@/db/types/JobQualification";
import type { _User } from "@/db/types/_User";
import type { JobAttributes } from "@/db/types/Job";
import type { JobSearchFilters } from "@/store/useJobStore";

export interface JobWithRelations extends JobAttributes {
    requirements?: Array<{
        id: string;
        jobId: string;
        requirement: string;
        order: number;
    }>;
    experience?: Array<{
        id: string;
        jobId: string;
        experience: string;
        order: number;
    }>;
    qualifications?: Array<{
        id: string;
        jobId: string;
        qualification: string;
        order: number;
    }>;
}

function parseToJSON<T>(obj: Job): T {
    const json = obj.toJSON();
    return {
        ...json,
        id: obj.id,
        date: obj.get("date"),
        createdAt: obj.get("createdAt"),
        updatedAt: obj.get("updatedAt"),
    } as T;
}

const REGION_MAPPING: Record<string, string[]> = {
    "northern europe": ["denmark", "sweden", "norway", "finland", "iceland", "estonia", "latvia", "lithuania"],
    "uk": ["united kingdom", "england", "scotland", "wales", "northern ireland", "britain"],
    "mediterranean": ["spain", "france", "italy", "greece", "croatia", "malta", "cyprus", "turkey"],
    "caribbean": ["jamaica", "barbados", "bahamas", "antigua", "trinidad", "puerto rico", "virgin islands"],
    "north america": ["usa", "united states", "canada", "mexico"],
    "south america": ["brazil", "argentina", "chile", "peru", "colombia", "venezuela"],
    "pacific": ["australia", "new zealand", "fiji", "tahiti", "polynesia", "micronesia"],
    "atlantic crossing": ["atlantic", "azores", "canary", "cape verde"],
    "asia": ["thailand", "singapore", "malaysia", "indonesia", "philippines", "japan", "china"],
    "africa": ["south africa", "morocco", "egypt", "kenya", "tanzania", "seychelles"],
};

function matchesRegion(address: string, regionSearch: string): boolean {
    const normalizedAddress = address.toLowerCase();
    const normalizedRegion = regionSearch.toLowerCase();

    const countries = REGION_MAPPING[normalizedRegion];
    if (countries) {
        return countries.some(country => normalizedAddress.includes(country));
    }

    return normalizedAddress.includes(normalizedRegion);
}

export async function getJobs(filters?: JobSearchFilters): Promise<JobAttributes[]> {
    const query = new Parse.Query(Job);
    query.include("locationId");
    query.include("createdById");
    query.descending("createdAt");

    if (filters?.position) {
        query.matches("title", new RegExp(filters.position, "i"));
    }

    if (filters?.availability?.from) {
        const fromDate = filters.availability.from;
        const startOfDay = new Date(fromDate);
        startOfDay.setHours(0, 0, 0, 0);
        query.greaterThanOrEqualTo("date", startOfDay);
    }

    if (filters?.availability?.to) {
        const toDate = filters.availability.to;
        const endOfDay = new Date(toDate);
        endOfDay.setHours(23, 59, 59, 999);
        query.lessThanOrEqualTo("date", endOfDay);
    }

    const results = await query.find();
    let jobs = results.map((job) => parseToJSON<JobAttributes>(job));

    if (filters?.name) {
        const searchTerm = filters.name;
        jobs = jobs.filter((job) => {
            const location = job.locationId;
            if (!location) return false;
            const locationName = location.name || "";
            const locationAddress = location.address || "";

            return matchesRegion(locationName, searchTerm) || matchesRegion(locationAddress, searchTerm);
        });
    }

    return jobs;
}

export async function getJobById(id: string): Promise<JobWithRelations | null> {
    const query = new Parse.Query(Job);
    query.include("locationId");
    query.include("createdById");

    try {
        const job = await query.get(id);

        const requirementsQuery = new Parse.Query(JobRequirement);
        requirementsQuery.equalTo("jobId", job);
        requirementsQuery.ascending("order");
        const requirementsResults = await requirementsQuery.find();
        const requirements = requirementsResults.map((r) => ({
            id: r.id,
            jobId: job.id,
            requirement: r.requirement,
            order: r.order,
        }));

        const experiencesQuery = new Parse.Query(JobExperience);
        experiencesQuery.equalTo("jobId", job);
        experiencesQuery.ascending("order");
        const experiencesResults = await experiencesQuery.find();
        const experience = experiencesResults.map((e) => ({
            id: e.id,
            jobId: job.id,
            experience: e.experience,
            order: e.order,
        }));

        const qualificationsQuery = new Parse.Query(JobQualification);
        qualificationsQuery.equalTo("jobId", job);
        qualificationsQuery.ascending("order");
        const qualificationsResults = await qualificationsQuery.find();
        const qualifications = qualificationsResults.map((q) => ({
            id: q.id,
            jobId: job.id,
            qualification: q.qualification,
            order: q.order,
        }));

        const baseJob = parseToJSON<JobAttributes>(job);

        return {
            ...baseJob,
            requirements,
            experience,
            qualifications,
        } as JobWithRelations;
    } catch (err: any) {
        console.error("Failed to fetch job:", err.message);
        return null;
    }
}

export async function createJob({
    title,
    description,
    date,
    type,
    vessel,
    imageUrl,
    location,
    isFavorite,
    requirements,
    experiences,
    qualifications,
}: {
    title: string;
    description?: string;
    date: Date;
    type: string;
    vessel: string;
    imageUrl?: File | string;
    location: {
        name: string;
        address: string;
        longitude: number;
        latitude: number;
    };
    isFavorite?: boolean;
    requirements?: string[];
    experiences?: string[];
    qualifications?: string[];
}): Promise<Job> {
    const currentUser = Parse.User.current() as _User | null;
    if (!currentUser) {
        throw new Error("User must be logged in to create a job");
    }

    const locationObj = new Location();
    locationObj.name = location.name;
    locationObj.address = location.address;
    locationObj.longitude = location.longitude;
    locationObj.latitude = location.latitude;
    await locationObj.save();

    let finalImageUrl: string | undefined;
    if (imageUrl) {
        if (imageUrl instanceof File) {
            const parseFile = new Parse.File(imageUrl.name, imageUrl);
            await parseFile.save();
            finalImageUrl = parseFile.url();
        } else {
            finalImageUrl = imageUrl;
        }
    }

    const job = new Job();
    job.title = title;
    job.date = date;
    job.type = type;
    job.vessel = vessel;
    job.locationId = locationObj;
    job.createdById = currentUser;

    if (description) job.description = description;
    if (finalImageUrl) job.imageUrl = finalImageUrl;
    if (isFavorite !== undefined) job.isFavorite = isFavorite;

    await job.save();

    if (requirements && requirements.length > 0) {
        const requirementObjs = requirements.map((req, index) => {
            const requirementObj = new JobRequirement();
            requirementObj.jobId = job;
            requirementObj.requirement = req;
            requirementObj.order = index;
            return requirementObj;
        });
        await Parse.Object.saveAll(requirementObjs);
    }

    if (experiences && experiences.length > 0) {
        const experienceObjs = experiences.map((exp, index) => {
            const experienceObj = new JobExperience();
            experienceObj.jobId = job;
            experienceObj.experience = exp;
            experienceObj.order = index;
            return experienceObj;
        });
        await Parse.Object.saveAll(experienceObjs);
    }

    if (qualifications && qualifications.length > 0) {
        const qualificationObjs = qualifications.map((qual, index) => {
            const qualificationObj = new JobQualification();
            qualificationObj.jobId = job;
            qualificationObj.qualification = qual;
            qualificationObj.order = index;
            return qualificationObj;
        });
        await Parse.Object.saveAll(qualificationObjs);
    }

    return job as Job;
}

export async function toggleJobFavorite(id: string): Promise<boolean> {
    const query = new Parse.Query(Job);

    try {
        const job = await query.get(id);
        const newStatus = !job.isFavorite;
        job.isFavorite = newStatus;
        await job.save();
        return newStatus;
    } catch (err: any) {
        console.error("Failed to toggle favorite:", err.message);
        throw err;
    }
}

export async function updateJob(
    id: string,
    {
        title,
        description,
        date,
        type,
        vessel,
        imageUrl,
        location,
        isFavorite,
        requirements,
        experiences,
        qualifications,
    }: {
        title?: string;
        description?: string;
        date?: Date;
        type?: string;
        vessel?: string;
        imageUrl?: File | string;
        location?: {
            name: string;
            address: string;
            longitude: number;
            latitude: number;
        };
        isFavorite?: boolean;
        requirements?: string[];
        experiences?: string[];
        qualifications?: string[];
    }
): Promise<Job> {
    const currentUser = Parse.User.current() as _User | null;
    if (!currentUser) {
        throw new Error("User must be logged in to update a job");
    }

    const query = new Parse.Query(Job);
    query.include("locationId");
    query.include("createdById");

    try {
        const job = await query.get(id);

        const createdById = job.get("createdById");
        if (createdById?.id !== currentUser.id) {
            throw new Error("Only the job creator can update this job");
        }

        if (title !== undefined) job.title = title;
        if (description !== undefined) job.description = description;
        if (date !== undefined) job.date = date;
        if (type !== undefined) job.type = type;
        if (vessel !== undefined) job.vessel = vessel;
        if (isFavorite !== undefined) job.isFavorite = isFavorite;

        if (imageUrl !== undefined) {
            if (imageUrl instanceof File) {
                const parseFile = new Parse.File(imageUrl.name, imageUrl);
                await parseFile.save();
                job.imageUrl = parseFile.url();
            } else {
                job.imageUrl = imageUrl;
            }
        }

        if (location !== undefined) {
            const locationObj = new Location();
            locationObj.name = location.name;
            locationObj.address = location.address;
            locationObj.longitude = location.longitude;
            locationObj.latitude = location.latitude;
            await locationObj.save();
            job.locationId = locationObj;
        }

        await job.save();

        if (requirements !== undefined) {
            const existingRequirementsQuery = new Parse.Query(JobRequirement);
            existingRequirementsQuery.equalTo("jobId", job);
            const existingRequirements = await existingRequirementsQuery.find();
            await Parse.Object.destroyAll(existingRequirements);

            if (requirements.length > 0) {
                const requirementObjs = requirements.map((req, index) => {
                    const requirementObj = new JobRequirement();
                    requirementObj.jobId = job;
                    requirementObj.requirement = req;
                    requirementObj.order = index;
                    return requirementObj;
                });
                await Parse.Object.saveAll(requirementObjs);
            }
        }

        if (experiences !== undefined) {
            const existingExperiencesQuery = new Parse.Query(JobExperience);
            existingExperiencesQuery.equalTo("jobId", job);
            const existingExperiences = await existingExperiencesQuery.find();
            await Parse.Object.destroyAll(existingExperiences);

            if (experiences.length > 0) {
                const experienceObjs = experiences.map((exp, index) => {
                    const experienceObj = new JobExperience();
                    experienceObj.jobId = job;
                    experienceObj.experience = exp;
                    experienceObj.order = index;
                    return experienceObj;
                });
                await Parse.Object.saveAll(experienceObjs);
            }
        }

        if (qualifications !== undefined) {
            const existingQualificationsQuery = new Parse.Query(JobQualification);
            existingQualificationsQuery.equalTo("jobId", job);
            const existingQualifications = await existingQualificationsQuery.find();
            await Parse.Object.destroyAll(existingQualifications);

            if (qualifications.length > 0) {
                const qualificationObjs = qualifications.map((qual, index) => {
                    const qualificationObj = new JobQualification();
                    qualificationObj.jobId = job;
                    qualificationObj.qualification = qual;
                    qualificationObj.order = index;
                    return qualificationObj;
                });
                await Parse.Object.saveAll(qualificationObjs);
            }
        }

        return job as Job;
    } catch (err: any) {
        console.error("Failed to update job:", err.message);
        throw err;
    }
}

export async function deleteJob(id: string): Promise<void> {
    const currentUser = Parse.User.current() as _User | null;
    if (!currentUser) {
        throw new Error("User must be logged in to delete a job");
    }

    const query = new Parse.Query(Job);
    query.include("locationId");
    query.include("createdById");

    try {
        const job = await query.get(id);

        const createdById = job.get("createdById");
        if (createdById?.id !== currentUser.id) {
            throw new Error("Only the job creator can delete this job");
        }

        const requirementsQuery = new Parse.Query(JobRequirement);
        requirementsQuery.equalTo("jobId", job);
        const requirements = await requirementsQuery.find();
        if (requirements.length > 0) {
            await Parse.Object.destroyAll(requirements);
        }

        const experiencesQuery = new Parse.Query(JobExperience);
        experiencesQuery.equalTo("jobId", job);
        const experiences = await experiencesQuery.find();
        if (experiences.length > 0) {
            await Parse.Object.destroyAll(experiences);
        }

        const qualificationsQuery = new Parse.Query(JobQualification);
        qualificationsQuery.equalTo("jobId", job);
        const qualifications = await qualificationsQuery.find();
        if (qualifications.length > 0) {
            await Parse.Object.destroyAll(qualifications);
        }

        await job.destroy();
    } catch (err: any) {
        console.error("Failed to delete job:", err.message);
        throw err;
    }
}