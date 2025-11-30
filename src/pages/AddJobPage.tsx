import { useNavigate } from "react-router-dom";
import { mutate } from "swr";
import AddJobForm from "@/components/forms/AddJobForm";

export default function AddJobPage() {
    const navigate = useNavigate();

    return (
        <main className="container mx-auto max-w-4xl px-4 py-6">
            <h1 className="mb-4 text-2xl font-semibold">Add Job</h1>
            <AddJobForm
                onSuccess={() => {
                    mutate("jobs");
                    navigate("/");
                }}
                onCancel={() => navigate("/")}
            />
        </main>
    );
}