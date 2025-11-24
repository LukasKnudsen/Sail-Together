import Parse from "@/lib/parse/client";
import type { Job, JobWithRelations } from "@/types/job";

export async function getJobs(limit = 1000): Promise<JobWithRelations[]> {
    const query = new Parse.Query("Job");
    query.include("locationId");
    query.include("createdById");
    query.descending("createdAt");
    query.limit(limit);

    try {
        const results = await query.find();
        return results.map((obj) => {
            const loc = obj.get("locationId");
            return {
                id: obj.id || "",
                title: obj.get("title"),
                type: obj.get("type"),
                date: obj.get("date"),
                vessel: obj.get("vessel"),
                isFavorite: obj.get("isFavorite") ?? false,
                description: obj.get("description"),
                location: loc
                    ? {
                        id: loc.id || "",
                        name: loc.get("name"),
                        address: loc.get("address"),
                        longitude: loc.get("longitude"),
                        latitude: loc.get("latitude"),
                    }
                    : { id: "", name: "", address: "", longitude: 0, latitude: 0 },
                requirements: [],
                experience: [],
                qualifications: [],
                createdAt: obj.get("createdAt"),
                updatedAt: obj.get("updatedAt"),
                createdBy: obj.get("createdById")
                    ? {
                        id: obj.get("createdById").id,
                        name: obj.get("createdById").get("name") || obj.get("createdById").get("username"),
                        avatarUrl: obj.get("createdById").get("avatarUrl"),
                    }
                    : undefined,
            } as JobWithRelations;
        });
    } catch (err: any) {
        console.error("Failed to fetch jobs:", err.message);
        throw err;
    }
}

export async function getJobById(id: string): Promise<JobWithRelations | null> {
    const query = new Parse.Query("Job");
    query.include("locationId");
    query.include("createdById");

    try {
        const obj = await query.get(id);

        const [requirements, experience, qualifications] = await Promise.all([
            getJobRequirements(id),
            getJobExperience(id),
            getJobQualifications(id),
        ]);

        const loc = obj.get("locationId");

        return {
            id: obj.id || "",
            title: obj.get("title"),
            type: obj.get("type"),
            date: obj.get("date"),
            vessel: obj.get("vessel"),
            isFavorite: obj.get("isFavorite") ?? false,
            description: obj.get("description"),
            location: loc
                ? {
                    id: loc.id || "",
                    name: loc.get("name"),
                    address: loc.get("address"),
                    longitude: loc.get("longitude"),
                    latitude: loc.get("latitude"),
                }
                : { id: "", name: "", address: "", longitude: 0, latitude: 0 },
            requirements,
            experience,
            qualifications,
            createdAt: obj.get("createdAt"),
            updatedAt: obj.get("updatedAt"),
            createdBy: obj.get("createdById")
                ? {
                    id: obj.get("createdById").id,
                    name: obj.get("createdById").get("name") || obj.get("createdById").get("username"),
                    avatarUrl: obj.get("createdById").get("avatarUrl"),
                }
                : undefined,
        };
    } catch (err: any) {
        console.error("Failed to fetch job:", err.message);
        return null;
    }
}

export async function getJobRequirements(
    jobId: string
): Promise<Array<{ id: string; requirement: string; order: number; jobId: string }>> {
    const query = new Parse.Query("JobRequirement");

    const jobPointer = Parse.Object.extend("Job").createWithoutData(jobId);
    query.equalTo("jobId", jobPointer);
    query.ascending("order");

    try {
        const results = await query.find();
        return results.map((r) => ({
            id: r.id || "",
            jobId,
            requirement: r.get("requirement") || "",
            order: Number(r.get("order")) || 0,
        }));
    } catch (err: any) {
        console.error("Failed to fetch job requirements:", err.message);
        return [];
    }
}

export async function getJobExperience(
    jobId: string
): Promise<Array<{ id: string; experience: string; order: number; jobId: string }>> {
    const query = new Parse.Query("JobExperience");

    const jobPointer = Parse.Object.extend("Job").createWithoutData(jobId);
    query.equalTo("jobId", jobPointer);
    query.ascending("order");

    try {
        const results = await query.find();
        return results.map((e) => ({
            id: e.id || "",
            jobId,
            experience: e.get("experience") || "",
            order: Number(e.get("order")) || 0,
        }));
    } catch (err: any) {
        console.error("Failed to fetch job experience:", err.message);
        return [];
    }
}

export async function getJobQualifications(
    jobId: string
): Promise<Array<{ id: string; qualification: string; order: number; jobId: string }>> {
    const query = new Parse.Query("JobQualification");

    const jobPointer = Parse.Object.extend("Job").createWithoutData(jobId);
    query.equalTo("jobId", jobPointer);
    query.ascending("order");

    try {
        const results = await query.find();
        return results.map((q) => ({
            id: q.id || "",
            jobId,
            qualification: q.get("qualification") || "",
            order: Number(q.get("order")) || 0,
        }));
    } catch (err: any) {
        console.error("Failed to fetch job qualifications:", err.message);
        return [];
    }
}

export async function createLocation({
    name,
    address,
    longitude,
    latitude,
}: {
    name: string;
    address: string;
    longitude: number;
    latitude: number;
}): Promise<string> {
    const Location = Parse.Object.extend("Location");
    const location = new Location();
    location.set("name", name);
    location.set("address", address);
    location.set("longitude", longitude);
    location.set("latitude", latitude);

    try {
        const saved = await location.save();
        return saved.id || "";
    } catch (err: any) {
        console.error("Failed to create location:", err.message);
        throw err;
    }
}

export async function createJob({
    title,
    type,
    date,
    vessel,
    description,
    locationId,
    isFavorite = false,
}: {
    title: string;
    type: "Permanent" | "Contract" | "Seasonal" | "Temporary";
    date: Date;
    vessel: string;
    description?: string;
    locationId: string;
    isFavorite?: boolean;
}): Promise<string> {
    const Job = Parse.Object.extend("Job");
    const job = new Job();

    const currentUser = Parse.User.current();
    if (!currentUser) {
        throw new Error("User must be logged in to create a job");
    }

    const locationPointer = Parse.Object.extend("Location").createWithoutData(locationId);

    job.set("title", title);
    job.set("type", type);
    job.set("date", date);
    job.set("vessel", vessel);
    job.set("locationId", locationPointer);
    job.set("isFavorite", isFavorite);
    job.set("createdById", currentUser);

    if (description) job.set("description", description);

    try {
        const saved = await job.save();
        return saved.id || "";
    } catch (err: any) {
        console.error("Failed to create job:", err.message);
        throw err;
    }
}

export async function createJobRequirement(
    jobId: string,
    requirement: string,
    order = 0
): Promise<string> {
    const Requirement = Parse.Object.extend("JobRequirement");
    const req = new Requirement();

    const jobPointer = Parse.Object.extend("Job").createWithoutData(jobId);

    req.set("jobId", jobPointer);
    req.set("requirement", requirement);
    req.set("order", order);

    try {
        const saved = await req.save();
        return saved.id || "";
    } catch (err: any) {
        console.error("Failed to create job requirement:", err.message);
        throw err;
    }
}

export async function createJobExperience(
    jobId: string,
    experience: string,
    order = 0
): Promise<string> {
    const Experience = Parse.Object.extend("JobExperience");
    const exp = new Experience();

    const jobPointer = Parse.Object.extend("Job").createWithoutData(jobId);

    exp.set("jobId", jobPointer);
    exp.set("experience", experience);
    exp.set("order", order);

    try {
        const saved = await exp.save();
        return saved.id || "";
    } catch (err: any) {
        console.error("Failed to create job experience:", err.message);
        throw err;
    }
}

export async function createJobQualification(
    jobId: string,
    qualification: string,
    order = 0
): Promise<string> {
    const Qualification = Parse.Object.extend("JobQualification");
    const qual = new Qualification();

    const jobPointer = Parse.Object.extend("Job").createWithoutData(jobId);

    qual.set("jobId", jobPointer);
    qual.set("qualification", qualification);
    qual.set("order", order);

    try {
        const saved = await qual.save();
        return saved.id || "";
    } catch (err: any) {
        console.error("Failed to create job qualification:", err.message);
        throw err;
    }
}

export async function updateJob(
    id: string,
    data: Partial<Omit<Job, "id" | "locationId">>
): Promise<void> {
    const query = new Parse.Query("Job");

    try {
        const job = await query.get(id);

        if (data.title) job.set("title", data.title);
        if (data.type) job.set("type", data.type);
        if (data.date) job.set("date", new Date(data.date));
        if (data.vessel) job.set("vessel", data.vessel);
        if (data.isFavorite !== undefined) job.set("isFavorite", data.isFavorite);
        if (data.description !== undefined) job.set("description", data.description);

        await job.save();
    } catch (err: any) {
        console.error("Failed to update job:", err.message);
        throw err;
    }
}

export async function deleteJob(id: string): Promise<void> {
    const query = new Parse.Query("Job");

    try {
        const job = await query.get(id);
        await job.destroy();
    } catch (err: any) {
        console.error("Failed to delete job:", err.message);
        throw err;
    }
}

export async function toggleJobFavorite(id: string): Promise<boolean> {
    const query = new Parse.Query("Job");

    try {
        const job = await query.get(id);
        const newStatus = !job.get("isFavorite");
        job.set("isFavorite", newStatus);
        await job.save();
        return newStatus;
    } catch (err: any) {
        console.error("Failed to toggle favorite:", err.message);
        throw err;
    }
}