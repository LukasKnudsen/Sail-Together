import { Navigate, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Events from "@/pages/Events";
import Profile from "@/pages/Profile";
import Explore from "@/pages/Explore";
import NotFound from "@/pages/NotFound";
import JobPage from "@/pages/JobPage";
import RootLayout from "@/layouts/RootLayout";
import WizardLayout from "@/layouts/WizardLayout";
import AddListingWizard from "@/pages/add-listing/AddListingWizard";
import SignUpPage from "@/pages/auth/SignUp";
import LoginPage from "@/pages/auth/Login";
import GuestRoute from "@/components/GuestRoute";
import AuthLayout from "@/layouts/AuthLayout";
import ProfileEdit from "./pages/ProfileEdit";

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs/:jobId" element={<JobPage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <SignUpPage />
            </GuestRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
      </Route>

      <Route element={<WizardLayout />}>
        <Route path="/add-listing">
          <Route index element={<Navigate to="1" replace />} />
          <Route path=":step" element={<AddListingWizard />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
