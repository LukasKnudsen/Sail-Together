import { cn } from "@/lib/utils";
import { Field, FieldDescription, FieldLabel, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import MapWithGeocoder from "../map/MapWithGeocoder";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob, updateJob, deleteJob } from "@/features/jobs/api";
import { Spinner } from "../ui/spinner";
import type { Job } from "@/db/types/Job";
import type { JobWithRelations } from "@/features/jobs/api";

export type LocationData = {
    name: string;
    address: string;
    longitude: number;
    latitude: number;
};

export type JobFormState = {
    title: string;
    vessel: string;
    description?: string;
    location: LocationData | null;
    jobType: Job["type"] | null;
    startDate: string;
    endDate?: string;
    requirements: string[];
    experience: string[];
    qualifications: string[];
    imageFile?: File | null;
};

const JOB_TYPES: Array<{ id: Job["type"]; label: string }> = [
    { id: "Permanent", label: "Permanent" },
    { id: "Contract", label: "Contract" },
    { id: "Seasonal", label: "Seasonal" },
    { id: "Temporary", label: "Temporary" },
];

const POSITIONS = [
    "Captain",
    "First Mate",
    "Deckhand",
    "Engineer",
    "Steward/Stewardess",
    "Chef",
] as const;

const VESSEL_TYPES = [
    "Sailing yacht",
    "Catamaran",
    "Motor yacht",
    "Racing boat",
    "Charter boat",
    "Workboat/Commercial",
] as const;

export type JobFormProps = React.ComponentProps<"form"> & {
    mode: "create" | "edit";
    job?: JobWithRelations;
    onSuccess?: () => void;
    onCancel?: () => void;
    submitLabel?: string;
    successMessage?: string;
    stripEmptyArraysOnCreate?: boolean;
};

export default function JobForm({
    className,
    mode,
    job,
    onSuccess,
    onCancel,
    submitLabel,
    successMessage,
    stripEmptyArraysOnCreate = true,
    ...props
}: JobFormProps) {
    const navigate = useNavigate();
    const [form, setForm] = useState<JobFormState>({
        title: "",
        vessel: "",
        description: undefined,
        location: null,
        jobType: null,
        startDate: "",
        endDate: undefined,
        requirements: [""],
        experience: [""],
        qualifications: [""],
        imageFile: null,
    });
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (mode === "edit" && job) {
            const jobDate = job.date instanceof Date ? job.date : new Date(job.date);
            const location = job.locationId
                ? {
                    name: job.locationId.name || "",
                    address: job.locationId.address || "",
                    longitude: job.locationId.longitude || 0,
                    latitude: job.locationId.latitude || 0,
                }
                : null;

            setForm({
                title: job.title || "",
                vessel: job.vessel || "",
                description: job.description || undefined,
                location,
                jobType: job.type || null,
                startDate: jobDate.toISOString().split("T")[0],
                endDate: undefined,
                requirements:
                    job.requirements && job.requirements.length > 0
                        ? job.requirements.map((r) => r.requirement)
                        : [""],
                experience:
                    job.experience && job.experience.length > 0
                        ? job.experience.map((e) => e.experience)
                        : [""],
                qualifications:
                    job.qualifications && job.qualifications.length > 0
                        ? job.qualifications.map((q) => q.qualification)
                        : [""],
                imageFile: null,
            });
        }
    }, [mode, job]);

    const updateField = <K extends keyof JobFormState>(key: K, value: JobFormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const resetForm = () => {
        setForm({
            title: "",
            vessel: "",
            description: undefined,
            location: null,
            jobType: null,
            startDate: "",
            endDate: undefined,
            requirements: [""],
            experience: [""],
            qualifications: [""],
            imageFile: null,
        });
        setTouched({});
        setError(null);
        setSuccess(null);
    };

    const addListItem = (key: "requirements" | "experience" | "qualifications") => {
        setForm((prev) => ({ ...prev, [key]: [...prev[key], ""] }));
    };

    const updateListItem = (
        key: "requirements" | "experience" | "qualifications",
        index: number,
        value: string
    ) => {
        setForm((prev) => ({
            ...prev,
            [key]: prev[key].map((item, i) => (i === index ? value : item)),
        }));
    };

    const removeListItem = (key: "requirements" | "experience" | "qualifications", index: number) => {
        setForm((prev) => {
            const filtered = prev[key].filter((_, i) => i !== index);
            return {
                ...prev,
                [key]: filtered.length === 0 ? [""] : filtered,
            };
        });
    };

    const validateForm = (): string | null => {
        if (!form.title.trim()) return "Position is required";
        if (!form.vessel.trim()) return "Vessel type is required";
        if (!form.location) return "Location is required";
        if (!form.jobType) return "Job type is required";
        if (!form.startDate) return "Start date is required";
        if (form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
            return "End date cannot be earlier than start date";
        }
        return null;
    };

    const handleCancel = () => {
        if (mode === "create") {
            resetForm();
        } else {
            setError(null);
            setSuccess(null);
        }
        onCancel?.();
        navigate("/");
    };

    const handleDelete = async () => {
        if (mode !== "edit" || !job) return;
        const confirmed = window.confirm("Are you sure you want to delete this job?");
        if (!confirmed) return;

        setError(null);
        setSuccess(null);
        setIsDeleting(true);
        try {
            await deleteJob(job.id);
            setSuccess("Job deleted successfully!");
            resetForm();
            onSuccess?.();
            navigate("/", { replace: true });
            window.location.reload();
        } catch (err: any) {
            setError(err instanceof Error ? err.message : "Failed to delete job");
            console.error("Error deleting job:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        setTouched({
            title: true,
            vessel: true,
            jobType: true,
            location: true,
            startDate: true,
        });

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);
        try {
            const filteredRequirements = form.requirements.map((r) => r.trim()).filter(Boolean);
            const filteredExperience = form.experience.map((r) => r.trim()).filter(Boolean);
            const filteredQualifications = form.qualifications.map((r) => r.trim()).filter(Boolean);

            const basePayload = {
                title: form.title.trim(),
                type: form.jobType!,
                date: new Date(form.startDate),
                vessel: form.vessel.trim(),
                description: form.description?.trim() || undefined,
                location: form.location!,
                imageUrl: form.imageFile || undefined,
                requirements: filteredRequirements,
                experiences: filteredExperience,
                qualifications: filteredQualifications,
            };

            if (mode === "create") {
                const createPayload = stripEmptyArraysOnCreate
                    ? {
                        ...basePayload,
                        requirements: filteredRequirements.length ? filteredRequirements : undefined,
                        experiences: filteredExperience.length ? filteredExperience : undefined,
                        qualifications: filteredQualifications.length ? filteredQualifications : undefined,
                        isFavorite: false,
                    }
                    : { ...basePayload, isFavorite: false };

                await createJob(createPayload as any);
                setSuccess(successMessage || "Job created successfully!");
                onSuccess?.();
                navigate("/");
                resetForm();
            } else {
                await updateJob(job!.id, basePayload as any);
                setSuccess(successMessage || "Job updated successfully!");
                onSuccess?.();
                navigate("/");
            }
        } catch (err: any) {
            setError(err instanceof Error ? err.message : mode === "create" ? "Failed to create job" : "Failed to update job");
            console.error(mode === "create" ? "Error creating job:" : "Error updating job:", err);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className={cn("flex flex-col gap-8 py-4", className)} {...props}>
            <Field>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <FieldLabel htmlFor="title">What position are you hiring for?</FieldLabel>
                        <FieldDescription>Select or enter the role you're looking to fill.</FieldDescription>
                    </div>
                    {mode === "edit" && job && (
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isSubmitting || isDeleting}
                            className="whitespace-nowrap"
                        >
                            {isDeleting && <Spinner />}
                            Delete Job
                        </Button>
                    )}
                </div>
                <select
                    id="title"
                    className={cn(
                        "border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs",
                        "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, title: true }))}
                    required
                >
                    <option value="">Select a position</option>
                    {POSITIONS.map((pos) => (
                        <option key={pos} value={pos}>
                            {pos}
                        </option>
                    ))}
                </select>
                {touched.title && !form.title.trim() && (
                    <FieldError errors={[{ message: "Please select a position" }]} />
                )}
            </Field>

            <Field>
                <FieldLabel htmlFor="vessel">What type of vessel?</FieldLabel>
                <FieldDescription>Select the vessel type for this position.</FieldDescription>
                <select
                    id="vessel"
                    className={cn(
                        "border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs",
                        "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                    value={form.vessel}
                    onChange={(e) => updateField("vessel", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, vessel: true }))}
                    required
                >
                    <option value="">Select a vessel type</option>
                    {VESSEL_TYPES.map((v) => (
                        <option key={v} value={v}>
                            {v}
                        </option>
                    ))}
                </select>
                {touched.vessel && !form.vessel.trim() && (
                    <FieldError errors={[{ message: "Please select a vessel type" }]} />
                )}
            </Field>

            <Field>
                <FieldLabel htmlFor="jobType">What type of employment is this?</FieldLabel>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {JOB_TYPES.map((type) => (
                        <Button
                            key={type.id}
                            type="button"
                            variant={form.jobType === type.id ? "default" : "outline"}
                            className="py-8"
                            onClick={() => updateField("jobType", type.id)}
                            onBlur={() => setTouched((t) => ({ ...t, jobType: true }))}
                        >
                            {type.label}
                        </Button>
                    ))}
                </div>
                {touched.jobType && !form.jobType && (
                    <FieldError errors={[{ message: "Please select a job type" }]} />
                )}
            </Field>

            <Field>
                <FieldLabel htmlFor="description">Job description</FieldLabel>
                <FieldDescription>
                    Describe the role, daily duties, onboard vibe, or anything crew should know.
                </FieldDescription>
                <textarea
                    id="description"
                    className={cn(
                        "border-input flex min-h-[120px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs",
                        "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                    placeholder="e.g. Daily maintenance, watch keeping, guest service..."
                    value={form.description || ""}
                    onChange={(e) => updateField("description", e.target.value || undefined)}
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="place">Location</FieldLabel>
                <FieldDescription>Select where crew will join the vessel.</FieldDescription>
                <MapWithGeocoder
                    onLocationSelect={(loc) =>
                        updateField("location", {
                            name: loc.name,
                            address: loc.address,
                            longitude: loc.longitude,
                            latitude: loc.latitude,
                        })
                    }
                    value={form.location}
                />
                {touched.location && !form.location && (
                    <FieldError errors={[{ message: "Please select a location on the map" }]} />
                )}
            </Field>

            <Field>
                <FieldLabel htmlFor="startDate">When should the crew join?</FieldLabel>
                <FieldDescription>Select the join date for this position.</FieldDescription>
                <Input
                    id="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => updateField("startDate", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, startDate: true }))}
                    required
                />
                {touched.startDate && !form.startDate && (
                    <FieldError errors={[{ message: "Start date is required" }]} />
                )}
            </Field>

            <Field>
                <FieldLabel htmlFor="endDate">When should the crew disembark? (Optional)</FieldLabel>
                <FieldDescription>Leave blank for permanent positions.</FieldDescription>
                <Input
                    id="endDate"
                    type="date"
                    value={form.endDate || ""}
                    onChange={(e) => updateField("endDate", e.target.value || undefined)}
                    min={form.startDate || undefined}
                />
                {form.endDate && form.startDate && new Date(form.endDate) < new Date(form.startDate) && (
                    <FieldError errors={[{ message: "End date cannot be earlier than start date" }]} />
                )}
            </Field>

            <Field>
                <FieldLabel>Requirements (Optional)</FieldLabel>
                <FieldDescription>Add specific requirements for this position.</FieldDescription>
                {form.requirements.map((req, index) => (
                    <div key={index} className="flex gap-2">
                        <Input
                            placeholder="e.g. STCW, ENG1"
                            value={req}
                            onChange={(e) => updateListItem("requirements", index, e.target.value)}
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => removeListItem("requirements", index)}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addListItem("requirements")}>
                    Add requirement
                </Button>
            </Field>

            <Field>
                <FieldLabel>Experience (Optional)</FieldLabel>
                <FieldDescription>Specify experience requirements.</FieldDescription>
                {form.experience.map((exp, index) => (
                    <div key={index} className="flex gap-2">
                        <Input
                            placeholder="e.g. 3+ years on yachts"
                            value={exp}
                            onChange={(e) => updateListItem("experience", index, e.target.value)}
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => removeListItem("experience", index)}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addListItem("experience")}>
                    Add experience
                </Button>
            </Field>

            <Field>
                <FieldLabel>Qualifications (Optional)</FieldLabel>
                <FieldDescription>List required qualifications.</FieldDescription>
                {form.qualifications.map((qual, index) => (
                    <div key={index} className="flex gap-2">
                        <Input
                            placeholder="e.g. Food hygiene, Tanker endorsement"
                            value={qual}
                            onChange={(e) => updateListItem("qualifications", index, e.target.value)}
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => removeListItem("qualifications", index)}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addListItem("qualifications")}>
                    Add qualification
                </Button>
            </Field>

            <Field>
                <FieldLabel htmlFor="image">Vessel Photo (Optional)</FieldLabel>
                <Input
                    id="image"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="border-2 border-dashed"
                    onChange={(e) => updateField("imageFile", e.target.files?.[0] || null)}
                />
                {form.imageFile && (
                    <p className="text-sm text-muted-foreground">Selected: {form.imageFile.name}</p>
                )}
                {mode === "edit" && job?.imageUrl && !form.imageFile && (
                    <p className="text-sm text-muted-foreground">Current image: {job.imageUrl}</p>
                )}
            </Field>

            {error && (
                <div
                    role="alert"
                    aria-live="polite"
                    className="bg-destructive/10 text-destructive border-destructive/20 w-full rounded-xl border px-3 py-2 text-center text-sm font-medium"
                >
                    {error}
                </div>
            )}

            {success && (
                <div
                    role="alert"
                    aria-live="polite"
                    className="w-full rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-center text-sm font-medium text-green-700"
                >
                    {success}
                </div>
            )}

            <div className="flex gap-2">
                <Button
                    type="button"
                    size="lg"
                    variant="secondary"
                    className="flex-1"
                    onClick={handleCancel}
                >
                    Cancel
                </Button>

                <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting && <Spinner />}
                    {submitLabel || (mode === "create" ? "Create Job" : "Update Job")}
                </Button>
            </div>
        </form>
    );
}
