import { cn } from "@/lib/utils";
import { Field, FieldDescription, FieldLabel, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import MapWithGeocoder from "../map/MapWithGeocoder";
import { useState } from "react";
import { createJob, createLocation, createJobRequirement, createJobExperience, createJobQualification } from "@/features/jobs/api";
import { Spinner } from "../ui/spinner";
import type { JobType } from "@/types/job";
import { getCurrentUser } from "@/lib/parse/auth";

interface LocationData {
    name: string;
    address: string;
    longitude: number;
    latitude: number;
}

const JOB_TYPES: Array<{ id: JobType; label: string }> = [
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

export default function AddJobForm({ className, ...props }: React.ComponentProps<"form">) {
    const [title, setTitle] = useState("");
    const [vessel, setVessel] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState<LocationData | null>(null);
    const [jobType, setJobType] = useState<JobType | null>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [requirements, setRequirements] = useState<string[]>([""]);
    const [experience, setExperience] = useState<string[]>([""]);
    const [qualifications, setQualifications] = useState<string[]>([""]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Validation
    const hasTitle = title.trim().length > 0;
    const hasVessel = vessel.trim().length > 0;
    const hasLocation = location !== null;
    const hasJobType = jobType !== null;
    const hasStartDate = startDate !== "";
    const isValidDateRange = !endDate || !startDate || new Date(startDate) <= new Date(endDate);

    const isFormValid =
        hasTitle && hasVessel && hasLocation && hasJobType && hasStartDate && isValidDateRange;

    const addListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter((prev) => [...prev, ""]);
    };

    const updateListItem = (
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        index: number,
        value: string
    ) => {
        setter((prev) => prev.map((item, i) => (i === index ? value : item)));
    };

    const removeListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
        setter((prev) => prev.filter((_, i) => i !== index));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!isFormValid || isSubmitting) return;

        const currentUser = getCurrentUser();
        if (!currentUser) {
            setError("You must be logged in to create a job");
            return;
        }

        setError("");
        setSuccess("");
        setIsSubmitting(true);

        try {
            // Create location first
            if (!location) {
                throw new Error("Location is required");
            }

            const locationId = await createLocation({
                name: location.name,
                address: location.address,
                longitude: location.longitude,
                latitude: location.latitude,
            });

            // Create job
            if (!jobType) {
                throw new Error("Job type is required");
            }

            const jobId = await createJob({
                title: title.trim(),
                type: jobType,
                date: new Date(startDate),
                vessel: vessel.trim(),
                description: description.trim() || undefined,
                locationId,
                isFavorite: false,
            });

            // Create requirements, experience, and qualifications
            await Promise.all([
                ...requirements
                    .filter((r) => r.trim())
                    .map((r, i) => createJobRequirement(jobId, r.trim(), i)),
                ...experience
                    .filter((e) => e.trim())
                    .map((e, i) => createJobExperience(jobId, e.trim(), i)),
                ...qualifications
                    .filter((q) => q.trim())
                    .map((q, i) => createJobQualification(jobId, q.trim(), i)),
            ]);

            setSuccess("Job created successfully!");

            // Reset form
            setTitle("");
            setVessel("");
            setDescription("");
            setLocation(null);
            setJobType(null);
            setStartDate("");
            setEndDate("");
            setRequirements([""]);
            setExperience([""]);
            setQualifications([""]);
        } catch (err: any) {
            const message = err instanceof Error ? err.message : "Failed to create job";
            setError(message);
            console.error("Error creating job:", err);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className={cn("flex flex-col gap-8 py-4", className)} {...props}>
            <Field>
                <FieldLabel htmlFor="title">What position are you hiring for?</FieldLabel>
                <FieldDescription>Select or enter the role you're looking to fill.</FieldDescription>
                <select
                    id="title"
                    className={cn(
                        "border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs",
                        "placeholder:text-muted-foreground focus-visible:ring-ring/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:outline-none",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                >
                    <option value="">Select a position</option>
                    {POSITIONS.map((pos) => (
                        <option key={pos} value={pos}>
                            {pos}
                        </option>
                    ))}
                </select>
                {!hasTitle && <FieldError errors={[{ message: "Please select a position" }]} />}
            </Field>

            <Field>
                <FieldLabel htmlFor="vessel">What type of vessel?</FieldLabel>
                <FieldDescription>Select the vessel type for this position.</FieldDescription>
                <select
                    id="vessel"
                    className={cn(
                        "border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs",
                        "placeholder:text-muted-foreground focus-visible:ring-ring/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:outline-none",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                    value={vessel}
                    onChange={(e) => setVessel(e.target.value)}
                    required
                >
                    <option value="">Select a vessel type</option>
                    {VESSEL_TYPES.map((v) => (
                        <option key={v} value={v}>
                            {v}
                        </option>
                    ))}
                </select>
                {!hasVessel && <FieldError errors={[{ message: "Please select a vessel type" }]} />}
            </Field>

            <Field>
                <FieldLabel htmlFor="jobType">What type of employment is this?</FieldLabel>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {JOB_TYPES.map((type) => (
                        <Button
                            key={type.id}
                            type="button"
                            variant={jobType === type.id ? "default" : "outline"}
                            className="py-8"
                            onClick={() => setJobType(type.id)}
                        >
                            {type.label}
                        </Button>
                    ))}
                </div>
                {!hasJobType && <FieldError errors={[{ message: "Please select a job type" }]} />}
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
                        "placeholder:text-muted-foreground focus-visible:ring-ring/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:outline-none",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                    placeholder="e.g. Daily maintenance, watch keeping, guest service..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="place">Where will the crew join the vessel?</FieldLabel>
                <FieldDescription>Add the marina, harbor, or meeting point on the map.</FieldDescription>
                <MapWithGeocoder onLocationSelect={(loc) => setLocation(loc)} value={location} />
                {!hasLocation && (
                    <FieldError errors={[{ message: "Please select a location on the map" }]} />
                )}
            </Field>

            <Field>
                <FieldLabel htmlFor="startDate">When should the crew join?</FieldLabel>
                <FieldDescription>Select the join date for this position.</FieldDescription>
                <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
                {!hasStartDate && <FieldError errors={[{ message: "Start date is required" }]} />}
            </Field>

            <Field>
                <FieldLabel htmlFor="endDate">When should the crew disembark? (Optional)</FieldLabel>
                <FieldDescription>Leave blank for permanent positions.</FieldDescription>
                <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                />
                {!isValidDateRange && (
                    <FieldError errors={[{ message: "End date cannot be earlier than start date" }]} />
                )}
            </Field>

            <Field>
                <FieldLabel>Requirements (Optional)</FieldLabel>
                <FieldDescription>Add specific requirements for this position.</FieldDescription>
                {requirements.map((req, index) => (
                    <div key={index} className="flex gap-2">
                        <Input
                            placeholder="e.g. STCW, ENG1"
                            value={req}
                            onChange={(e) => updateListItem(setRequirements, index, e.target.value)}
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => removeListItem(setRequirements, index)}
                            disabled={requirements.length === 1}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addListItem(setRequirements)}>
                    Add requirement
                </Button>
            </Field>

            <Field>
                <FieldLabel>Experience (Optional)</FieldLabel>
                <FieldDescription>Specify experience requirements.</FieldDescription>
                {experience.map((exp, index) => (
                    <div key={index} className="flex gap-2">
                        <Input
                            placeholder="e.g. 3+ years on yachts"
                            value={exp}
                            onChange={(e) => updateListItem(setExperience, index, e.target.value)}
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => removeListItem(setExperience, index)}
                            disabled={experience.length === 1}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addListItem(setExperience)}>
                    Add experience
                </Button>
            </Field>

            <Field>
                <FieldLabel>Qualifications (Optional)</FieldLabel>
                <FieldDescription>List required qualifications.</FieldDescription>
                {qualifications.map((qual, index) => (
                    <div key={index} className="flex gap-2">
                        <Input
                            placeholder="e.g. Food hygiene, Tanker endorsement"
                            value={qual}
                            onChange={(e) => updateListItem(setQualifications, index, e.target.value)}
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => removeListItem(setQualifications, index)}
                            disabled={qualifications.length === 1}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addListItem(setQualifications)}>
                    Add qualification
                </Button>
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
                    size={"lg"}
                    variant={"secondary"}
                    className="flex-1"
                    onClick={() => {
                        setTitle("");
                        setVessel("");
                        setDescription("");
                        setLocation(null);
                        setJobType(null);
                        setStartDate("");
                        setEndDate("");
                        setRequirements([""]);
                        setExperience([""]);
                        setQualifications([""]);
                        setError("");
                        setSuccess("");
                    }}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    size={"lg"}
                    className="flex-1"
                    disabled={!isFormValid || isSubmitting}
                >
                    {isSubmitting && <Spinner />}
                    Create Job
                </Button>
            </div>
        </form>
    );
}