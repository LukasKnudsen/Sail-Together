import { getCurrentUser } from "@/lib/parse/auth";
import { Navigate } from "react-router-dom";

export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const user = getCurrentUser();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
