import { useState } from "react";
import { cn } from "@/lib/utils";
import { Field, FieldLabel, FieldDescription } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useUpdatePassword } from "@/features/profile/hooks";

type ChangePasswordFormProps = React.ComponentProps<"form"> & {
  onCancel?: () => void;
  onChanged?: () => void;
};

export default function ChangePasswordForm({
  className,
  onCancel,
  onChanged,
  ...props
}: ChangePasswordFormProps) {
  const { update, isLoading } = useUpdatePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isFormValid =
    currentPassword.length > 0 && newPassword.length >= 8 && confirmPassword.length > 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isFormValid || isLoading) return;

    setError("");
    setSuccess("");

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    // Validate new password is different
    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    // Validate password strength
    if (newPassword.length < 8) {
      setError("New password must be at least 6 characters long");
      return;
    }

    try {
      await update(currentPassword, newPassword);

      setSuccess("Password changed successfully!");

      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      if (onChanged) {
        setTimeout(() => {
          onChanged();
        }, 1500);
      }
    } catch (err: any) {
      console.error("Error changing password:", err);
      const message = err instanceof Error ? err.message : "Failed to change password";
      setError(message);
    }
  }

  function handleCancelClick() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");

    if (onCancel) {
      onCancel();
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6 py-4", className)} {...props}>
      {/* Current Password */}
      <Field>
        <FieldLabel htmlFor="currentPassword">Current Password *</FieldLabel>
        <FieldDescription>Enter your current password to verify your identity</FieldDescription>
        <Input
          id="currentPassword"
          type="password"
          required
          placeholder="Enter current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
        />
      </Field>

      {/* New Password */}
      <Field>
        <FieldLabel htmlFor="newPassword">New Password *</FieldLabel>
        <FieldDescription>Must be at least 8 characters long</FieldDescription>
        <Input
          id="newPassword"
          type="password"
          required
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
        />
      </Field>

      {/* Confirm New Password */}
      <Field>
        <FieldLabel htmlFor="confirmPassword">Confirm New Password *</FieldLabel>
        <FieldDescription>Re-enter your new password</FieldDescription>
        <Input
          id="confirmPassword"
          type="password"
          required
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />
      </Field>

      {/* Password Strength Indicator */}
      {newPassword.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="mb-2 text-xs font-medium text-gray-700">Password Strength:</div>
          <div className="space-y-1 text-xs">
            <div
              className={cn(
                "flex items-center gap-2",
                newPassword.length >= 8 ? "text-green-600" : "text-gray-400"
              )}
            >
              <div
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  newPassword.length >= 8 ? "bg-green-600" : "bg-gray-400"
                )}
              />
              At least 8 characters
            </div>
            <div
              className={cn(
                "flex items-center gap-2",
                /[A-Z]/.test(newPassword) ? "text-green-600" : "text-gray-400"
              )}
            >
              <div
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  /[A-Z]/.test(newPassword) ? "bg-green-600" : "bg-gray-400"
                )}
              />
              Contains uppercase letter (recommended)
            </div>
            <div
              className={cn(
                "flex items-center gap-2",
                /[0-9]/.test(newPassword) ? "text-green-600" : "text-gray-400"
              )}
            >
              <div
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  /[0-9]/.test(newPassword) ? "bg-green-600" : "bg-gray-400"
                )}
              />
              Contains number (recommended)
            </div>
            <div
              className={cn(
                "flex items-center gap-2",
                /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "text-green-600" : "text-gray-400"
              )}
            >
              <div
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "bg-green-600" : "bg-gray-400"
                )}
              />
              Contains special character (recommended)
            </div>
          </div>
        </div>
      )}

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

        <Button type="submit" size="lg" className="flex-1" disabled={!isFormValid || isLoading}>
          {isLoading && <Spinner />}
          Change Password
        </Button>
      </div>
    </form>
  );
}
