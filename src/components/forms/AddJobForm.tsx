import JobForm from "./JobForm";
import type { JobFormProps } from "./JobForm";

export default function AddJobForm(props: Omit<JobFormProps, "mode">) {
    return (
        <JobForm
            mode="create"
            submitLabel="Create Job"
            successMessage="Job created successfully!"
            stripEmptyArraysOnCreate={true}
            {...props}
        />
    );
}