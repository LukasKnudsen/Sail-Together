// React hooks wrapping the API calls
import { useState, useCallback, useEffect } from "react";
import {
    createJob,
    createJobRequirement,
    createJobExperience,
    createJobQualification,
    createLocation,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    toggleJobFavorite,
} from "./api";
import type { JobWithRelations } from "@/types/job";

export function useCreateJob() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async ({
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
    }) => {
        setIsLoading(true);
        setError(null);
        try {
            const jobId = await createJob({
                title,
                type,
                date,
                vessel,
                description,
                locationId,
                isFavorite,
            });
            return jobId;
        } catch (err: any) {
            const message = err instanceof Error ? err.message : "Failed to create job";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { create, isLoading, error };
}

export function useCreateLocation() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async ({
        name,
        address,
        longitude,
        latitude,
    }: {
        name: string;
        address: string;
        longitude: number;
        latitude: number;
    }) => {
        setIsLoading(true);
        setError(null);
        try {
            const locationId = await createLocation({ name, address, longitude, latitude });
            return locationId;
        } catch (err: any) {
            const message = err instanceof Error ? err.message : "Failed to create location";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { create, isLoading, error };
}

export function useCreateJobDetails() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createDetails = async (
        jobId: string,
        {
            requirements = [],
            experience = [],
            qualifications = [],
        }: {
            requirements?: Array<{ text: string }>;
            experience?: Array<{ text: string }>;
            qualifications?: Array<{ text: string }>;
        }
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            await Promise.all([
                ...requirements
                    .filter((r) => r.text.trim())
                    .map((r, i) => createJobRequirement(jobId, r.text.trim(), i)),
                ...experience
                    .filter((e) => e.text.trim())
                    .map((e, i) => createJobExperience(jobId, e.text.trim(), i)),
                ...qualifications
                    .filter((q) => q.text.trim())
                    .map((q, i) => createJobQualification(jobId, q.text.trim(), i)),
            ]);
        } catch (err: any) {
            const message = err instanceof Error ? err.message : "Failed to create job details";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { createDetails, isLoading, error };
}

export function useJobs() {
    const [jobs, setJobs] = useState<JobWithRelations[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchJobs = async (limit?: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const results = await getJobs(limit);
            setJobs(results);
            return results;
        } catch (err: any) {
            const message = err instanceof Error ? err.message : "Failed to fetch jobs";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { jobs, fetchJobs, isLoading, error };
}

export function useJob(id: string) {
    const [job, setJob] = useState<JobWithRelations | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchJob = useCallback(async () => {
        if (!id) return;

        setIsLoading(true);
        setError(null);
        try {
            const result = await getJobById(id);
            setJob(result);
            return result;
        } catch (err: any) {
            const message = err instanceof Error ? err.message : "Failed to fetch job";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    // Auto-fetch on mount or when id changes
    useEffect(() => {
        fetchJob();
    }, [fetchJob]);

    return { job, fetchJob, isLoading, error };
}

export function useUpdateJob() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = async (
        id: string,
        data: {
            title?: string;
            type?: "Permanent" | "Contract" | "Seasonal" | "Temporary";
            date?: Date;
            vessel?: string;
            description?: string;
            isFavorite?: boolean;
        }
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            await updateJob(id, data);
        } catch (err: any) {
            const message = err instanceof Error ? err.message : "Failed to update job";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { update, isLoading, error };
}

export function useDeleteJob() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteJobById = async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await deleteJob(id);
        } catch (err: any) {
            const message = err instanceof Error ? err.message : "Failed to delete job";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { deleteJobById, isLoading, error };
}

export function useToggleFavorite() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggle = async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const newStatus = await toggleJobFavorite(id);
            return newStatus;
        } catch (err: any) {
            const message = err instanceof Error ? err.message : "Failed to toggle favorite";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { toggle, isLoading, error };
}