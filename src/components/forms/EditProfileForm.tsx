import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Field, FieldLabel, FieldDescription } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useCurrentUserProfile, useUpdateProfile } from "@/features/profile/hooks";
import Parse from "@/lib/parse/client";

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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Clean up preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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

      let finalAvatarUrl = avatarUrl.trim() || undefined;

      // If a file is selected, upload it to Parse first
      if (selectedFile) {
        const parseFile = new Parse.File(selectedFile.name, selectedFile);
        await parseFile.save();
        finalAvatarUrl = parseFile.url() || finalAvatarUrl;
      }

      await update({
        name: name.trim(),
        phone: phone.trim() || undefined,
        avatarUrl: finalAvatarUrl,
        location: location.trim() || undefined,
        about: about.trim() || undefined,
        skills: skillsArray.length > 0 ? skillsArray : undefined,
      });

      // Clear file selection after successful upload
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

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
    
    // Clear file selection and preview
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    setError("");
    setSuccess("");

    if (onCancel) {
      onCancel();
    }
  }

  function handleAvatarClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("Image size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setError("");

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  // Get the avatar URL to display (preview or existing)
  const displayAvatarUrl = previewUrl || avatarUrl || undefined;
  const displayName = name.trim() || profile?.name || "";
  const avatarInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .filter((char) => char)
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

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
      {/* Avatar Upload */}
      <Field>
        <FieldLabel>Profile Picture</FieldLabel>
        <FieldDescription>Click on the avatar to upload a new image from your device</FieldDescription>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleAvatarClick}
            className="relative group cursor-pointer"
            aria-label="Change profile picture"
          >
            <Avatar className="size-24 rounded-full border-2 border-gray-300 group-hover:border-gray-400 transition-colors">
              <AvatarImage src={displayAvatarUrl} alt="Profile avatar" />
              <AvatarFallback className="bg-[#FFC7D6] text-lg font-semibold">
                {avatarInitials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-medium">Change</span>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Profile picture file input"
          />
        </div>
      </Field>

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
