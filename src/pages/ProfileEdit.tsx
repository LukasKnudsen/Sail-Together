import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { useCurrentUserProfile } from "@/features/profile/hooks";
import EditProfileForm from "@/components/forms/EditProfileForm";
import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";

type TabType = "profile" | "password" | "account";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { profile, isLoading } = useCurrentUserProfile();
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  function handleProfileSaved() {
    console.log("Profile saved successfully");
  }

  function handlePasswordChanged() {
    console.log("Password changed successfully");
  }

  function handleCancel() {
    navigate(-1);
  }

  if (isLoading) {
    return (
      <Container className="container mx-auto max-w-3xl p-2">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="flex items-center gap-2">
            <Spinner />
            <span className="text-muted-foreground">Loading profile...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container className="container mx-auto max-w-3xl p-2">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="border-destructive/20 bg-destructive/10 rounded-lg border p-6 text-center">
            <h2 className="text-destructive mb-2 text-lg font-semibold">Unable to Load Profile</h2>
            <p className="text-destructive/80 mb-4 text-sm">Please try logging in again.</p>
            <Button onClick={() => navigate("/login")}>Go to Login</Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="container mx-auto max-w-3xl p-2">
      <article className="flex flex-col gap-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/profile")}
          className="w-fit gap-2"
        >
          <ArrowLeft className="size-4" />
          Back to Profile
        </Button>

        {/* Profile Header - Centered like Profile.tsx */}
        <header className="flex flex-col items-center gap-2">
          <Avatar className="size-24 rounded-3xl bg-[#FFC7D6]">
            {profile.avatarUrl ? (
              <AvatarImage src={profile.avatarUrl} alt={profile.name || profile.username} />
            ) : (
              <AvatarFallback className="text-2xl">
                {(profile.name || profile.username).charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>

          <h1 className="text-2xl font-bold">{profile.name || profile.username}</h1>
          <p className="text-muted-foreground font-semibold">@{profile.username}</p>
        </header>

        {/* Tabs Navigation */}
        <nav className="border-b">
          <div className="flex justify-center gap-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={cn(
                "border-b-2 pb-3 text-sm font-medium transition-colors",
                activeTab === "profile"
                  ? "border-blue-500 text-blue-500"
                  : "text-muted-foreground hover:text-foreground border-transparent"
              )}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={cn(
                "border-b-2 pb-3 text-sm font-medium transition-colors",
                activeTab === "password"
                  ? "border-blue-500 text-blue-500"
                  : "text-muted-foreground hover:text-foreground border-transparent"
              )}
            >
              Password & Security
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={cn(
                "border-b-2 pb-3 text-sm font-medium transition-colors",
                activeTab === "account"
                  ? "border-blue-500 text-blue-500"
                  : "text-muted-foreground hover:text-foreground border-transparent"
              )}
            >
              Account Settings
            </button>
          </div>
        </nav>

        {/* Tab Content */}
        <section className="space-y-2">
          {activeTab === "profile" && (
            <div>
              <h2 className="mb-4 text-xl font-semibold">Edit Profile</h2>
              <EditProfileForm onSaved={handleProfileSaved} onCancel={handleCancel} />
            </div>
          )}

          {activeTab === "password" && (
            <div>
              <h2 className="mb-2 text-xl font-semibold">Change Password</h2>
              <p className="text-muted-foreground mb-4 text-sm">
                Choose a strong password to keep your account secure
              </p>
              <ChangePasswordForm onChanged={handlePasswordChanged} onCancel={handleCancel} />
            </div>
          )}

          {activeTab === "account" && (
            <div>
              <h2 className="mb-4 text-xl font-semibold">Account Settings</h2>

              {/* Account Info Section */}
              <div className="space-y-6">
                {/* Email */}
                <div>
                  <h3 className="mb-1 text-sm font-semibold">Email Address</h3>
                  <p className="text-muted-foreground mb-2">{profile.email}</p>
                  <Button variant="outline" size="sm" disabled>
                    Change Email (Coming Soon)
                  </Button>
                </div>

                {/* Username */}
                <div>
                  <h3 className="mb-1 text-sm font-semibold">Username</h3>
                  <p className="text-muted-foreground mb-2">@{profile.username}</p>
                  <p className="text-muted-foreground text-xs">Username cannot be changed</p>
                </div>

                {/* Account Stats Card */}
                <div className="bg-muted/50 rounded-2xl border p-4">
                  <h3 className="mb-3 text-sm font-semibold">Account Information</h3>
                  <div className="space-y-2 text-sm">
                    {profile.role && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Role:</span>
                        <span className="font-medium capitalize">{profile.role}</span>
                      </div>
                    )}
                    {profile.rating !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rating:</span>
                        <span className="font-medium">⭐ {profile.rating.toFixed(1)}</span>
                      </div>
                    )}
                    {profile.joinedDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Member Since:</span>
                        <span className="font-medium">
                          {new Date(profile.joinedDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills Display */}
                {profile.skills && profile.skills.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold">Your Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Danger Zone */}
                <div className="border-destructive/20 bg-destructive/5 rounded-2xl border p-4">
                  <h3 className="text-destructive mb-2 text-sm font-semibold">Danger Zone</h3>
                  <p className="text-muted-foreground mb-3 text-xs">
                    These actions are permanent and cannot be undone
                  </p>
                  <Button variant="destructive" size="sm" disabled>
                    Delete Account (Coming Soon)
                  </Button>
                </div>
              </div>
            </div>
          )}
        </section>
      </article>
    </Container>
  );
}
