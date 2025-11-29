import Parse from "@/lib/parse/client";
import { Job } from "@/db/types/Job";
import { Location } from "@/db/types/Location";
import { JobRequirement } from "@/db/types/JobRequirement";
import { JobExperience } from "@/db/types/JobExperience";
import { JobQualification } from "@/db/types/JobQualification";
import type { _User } from "@/db/types/_User";
import type { JobAttributes } from "@/db/types/Job";

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

export async function getJobs(): Promise<JobAttributes[]> {
    const query = new Parse.Query(Job);
    query.include("locationId");
    query.include("createdById");
    query.descending("createdAt");

    const results = await query.find();
    return results.map((job) => parseToJSON<JobAttributes>(job));
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