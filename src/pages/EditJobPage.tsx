import { useParams, useNavigate } from "react-router-dom";
import useSWR, { mutate } from "swr";
import { getJobById } from "../features/jobs/api";
import EditJobForm from "../components/forms/EditJobForm";

export default function EditJobPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const { data: job} = useSWR(jobId ? `job-${jobId}` : null, () =>
    getJobById(jobId!)
  );

  const handleSuccess = () => {
    mutate(`job-${jobId}`);
    navigate(`/jobs/${jobId}`);
  };

  const handleCancel = () => {  
    navigate(`/jobs/${jobId}`);
  };

  if (!job) {
    return <div className="col-span-full py-12 text-center">Loading...</div>;
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold">Edit Job: {job.title}</h1>
      <EditJobForm job={job} onSuccess={handleSuccess} onCancel={handleCancel} />
    </main>
  );
}