import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUserProfile } from "@/features/profile/hooks";

export default function UserProfileView() {
  const navigate = useNavigate();
  const { profile, isLoading } = useCurrentUserProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
        <span className="text-muted-foreground ml-2 text-sm">Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="border-destructive/20 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <Button onClick={() => navigate("/profile/edit")}>Edit Profile</Button>
      </div>

      {/* Profile Card */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name || profile.username}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/96";
                }}
              />
            ) : (
              <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center text-3xl font-semibold">
                {(profile.name || profile.username).charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{profile.name || profile.username}</h2>
            <p className="text-muted-foreground">@{profile.username}</p>

            {profile.rating !== undefined && (
              <div className="mt-2 flex items-center gap-1">
                <span className="text-lg">⭐</span>
                <span className="font-medium">{profile.rating.toFixed(1)}</span>
                <span className="text-muted-foreground text-sm">rating</span>
              </div>
            )}
          </div>
        </div>

        {/* About */}
        {profile.about && (
          <div className="mt-6">
            <h3 className="text-muted-foreground mb-2 text-sm font-semibold">About</h3>
            <p className="text-sm">{profile.about}</p>
          </div>
        )}

        {/* Contact Info */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {profile.email && (
            <div>
              <h3 className="text-muted-foreground mb-1 text-sm font-semibold">Email</h3>
              <p className="text-sm">{profile.email}</p>
            </div>
          )}

          {profile.phone && (
            <div>
              <h3 className="text-muted-foreground mb-1 text-sm font-semibold">Phone</h3>
              <p className="text-sm">{profile.phone}</p>
            </div>
          )}

          {profile.location && (
            <div>
              <h3 className="text-muted-foreground mb-1 text-sm font-semibold">Location</h3>
              <p className="text-sm">📍 {profile.location}</p>
            </div>
          )}

          {profile.role && (
            <div>
              <h3 className="text-muted-foreground mb-1 text-sm font-semibold">Role</h3>
              <p className="text-sm capitalize">{profile.role}</p>
            </div>
          )}
        </div>

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="mt-6">
            <h3 className="text-muted-foreground mb-2 text-sm font-semibold">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Member Since */}
        {profile.joinedDate && (
          <div className="mt-6 border-t pt-6">
            <p className="text-muted-foreground text-sm">
              Member since{" "}
              {new Date(profile.joinedDate).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
