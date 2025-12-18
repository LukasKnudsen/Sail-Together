import JobForm from "./JobForm";
import type { JobFormProps } from "./JobForm";
import type { JobWithRelations } from "@/features/jobs/api";

export default function EditJobForm({
    job,
    ...props
}: Omit<JobFormProps, "mode" | "job"> & { job: JobWithRelations }) {
    return (
        <JobForm
            mode="edit"
            job={job}
            submitLabel="Update Job"
            successMessage="Job updated successfully!"
            stripEmptyArraysOnCreate={false}
            {...props}
        />
    );
}