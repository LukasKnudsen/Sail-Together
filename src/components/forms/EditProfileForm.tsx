import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Field, FieldLabel, FieldDescription } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useCurrentUserProfile, useUpdateProfile } from "@/features/profile/hooks";

type EditProfileFormProps = React.ComponentProps<"form"> & {
  onCancel?: () => void;
  onSaved?: () => void;
};

export default function EditProfileForm({
  className,
  onCancel,
  onSaved,
  ...props
}: EditProfileFormProps) {
  const { profile, isLoading: isLoadingProfile } = useCurrentUserProfile();
  const { update, isLoading: isUpdating } = useUpdateProfile();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [skillsInput, setSkillsInput] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
      setAvatarUrl(profile.avatarUrl || "");
      setLocation(profile.location || "");
      setAbout(profile.about || "");
      setSkillsInput(profile.skills?.join(", ") || "");
    }
  }, [profile]);

  const isFormValid = name.trim().length > 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isFormValid || isUpdating) return;

    setError("");
    setSuccess("");

    try {
      // Parse skills from comma-separated string
      const skillsArray = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await update({
        name: name.trim(),
        phone: phone.trim() || undefined,
        avatarUrl: avatarUrl.trim() || undefined,
        location: location.trim() || undefined,
        about: about.trim() || undefined,
        skills: skillsArray.length > 0 ? skillsArray : undefined,
      });

      setSuccess("Profile updated successfully!");

      if (onSaved) {
        setTimeout(() => {
          onSaved();
        }, 1500);
      }
    } catch (err: any) {
      console.error("Error updating profile:", err);
      const message = err instanceof Error ? err.message : "Failed to update profile";
      setError(message);
    }
  }

  function handleCancelClick() {
    // Reset to original values
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
      setAvatarUrl(profile.avatarUrl || "");
      setLocation(profile.location || "");
      setAbout(profile.about || "");
      setSkillsInput(profile.skills?.join(", ") || "");
    }
    setError("");
    setSuccess("");

    if (onCancel) {
      onCancel();
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
        <span className="text-muted-foreground ml-2 text-sm">Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border p-4 text-center">
        Failed to load profile. Please try again.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6 py-4", className)} {...props}>
      {/* Avatar URL */}
      <Field>
        <FieldLabel htmlFor="avatarUrl">Profile Picture URL</FieldLabel>
        <FieldDescription>Enter a URL to your profile picture</FieldDescription>
        <Input
          id="avatarUrl"
          type="url"
          placeholder="https://example.com/avatar.jpg"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
        />
      </Field>

      {/* Avatar Preview */}
      {avatarUrl && (
        <div className="flex justify-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-gray-200">
            <img
              src={avatarUrl}
              alt="Avatar preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/96";
              }}
            />
          </div>
        </div>
      )}

      {/* Name */}
      <Field>
        <FieldLabel htmlFor="name">Full Name *</FieldLabel>
        <FieldDescription>Your display name on the platform</FieldDescription>
        <Input
          id="name"
          type="text"
          required
          placeholder="Jack Sparrow"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Field>

      {/* Username (Read-only) */}
      <Field>
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <FieldDescription>Your username cannot be changed</FieldDescription>
        <Input id="username" type="text" value={profile.username} disabled className="bg-muted" />
      </Field>

      {/* Email (Read-only - should be changed via separate flow) */}
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <FieldDescription>To change your email, use account settings</FieldDescription>
        <Input id="email" type="email" value={profile.email} disabled className="bg-muted" />
      </Field>

      {/* Phone */}
      <Field>
        <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
        <FieldDescription>Your contact phone number</FieldDescription>
        <Input
          id="phone"
          type="tel"
          placeholder="+45 12 34 56 78"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </Field>

      {/* Location */}
      <Field>
        <FieldLabel htmlFor="location">Location</FieldLabel>
        <FieldDescription>Where are you based?</FieldDescription>
        <Input
          id="location"
          type="text"
          placeholder="Copenhagen, Denmark"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </Field>

      {/* About */}
      <Field>
        <FieldLabel htmlFor="about">About</FieldLabel>
        <FieldDescription>Tell us about yourself and your experience</FieldDescription>
        <textarea
          id="about"
          placeholder="Brief bio or description..."
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-32 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
      </Field>

      {/* Skills */}
      <Field>
        <FieldLabel htmlFor="skills">Skills</FieldLabel>
        <FieldDescription>
          Enter your skills separated by commas (e.g., Navigation, Engineering, Fishing)
        </FieldDescription>
        <Input
          id="skills"
          type="text"
          placeholder="Navigation, Engineering, Fishing"
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
        />
      </Field>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="bg-destructive/10 text-destructive border-destructive/20 w-full rounded-xl border px-3 py-2 text-center text-sm font-medium"
        >
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div
          role="alert"
          aria-live="polite"
          className="w-full rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-center text-sm font-medium text-green-700"
        >
          {success}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          size="lg"
          variant="secondary"
          className="flex-1"
          onClick={handleCancelClick}
        >
          Cancel
        </Button>

        <Button type="submit" size="lg" className="flex-1" disabled={!isFormValid || isUpdating}>
          {isUpdating && <Spinner />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
