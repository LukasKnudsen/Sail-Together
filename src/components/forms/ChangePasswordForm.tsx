import { useState } from "react";
import { cn } from "@/lib/utils";
import { Field, FieldLabel, FieldDescription } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useUpdatePassword } from "@/features/profile/hooks";

const MIN_PASSWORD_LENGTH = 8;
const SUCCESS_NOTIFICATION_DELAY = 1500;

// Password Strength Component
type PasswordStrengthProps = {
  password: string;
};

function PasswordStrength({ password }: PasswordStrengthProps) {
  if (password.length === 0) return null;

  const checks = [
    {
      label: "At least ${MIN_PASSWORD_LENGTH} characters",
      test: password.length >= MIN_PASSWORD_LENGTH,
    },
    {
      label: "Contains uppercase letter (recommended)",
      test: /[A-Z]/.test(password),
    },
    {
      label: "Contains number (recommended)",
      test: /[0-9]/.test(password),
    },
    {
      label: "Contains special character (recommended)",
      test: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <div className="mb-2 text-xs font-medium text-gray-700">Password Strength:</div>
      <div className="space-y-1 text-xs">
        {checks.map((check, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-2",
              check.test ? "text-green-600" : "text-gray-400"
            )}
          >
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                check.test ? "bg-green-600" : "bg-gray-400"
              )}
            />
            {check.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// Notification Component
type NotificationProps = {
  type: "error" | "success";
  message: string;
};

function Notification({ type, message }: NotificationProps) {
  if (!message) return null;

  const isError = type === "error";

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "w-full rounded-xl border px-3 py-2 text-center text-sm font-medium",
        isError
          ? "bg-destructive/10 text-destructive border-destructive/20"
          : "border-green-200 bg-green-50 text-green-700"
      )}
    >
      {message}
    </div>
  );
}

// Main Form Component
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
    currentPassword.length > 0 &&
    newPassword.length >= MIN_PASSWORD_LENGTH &&
    confirmPassword.length > 0;

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
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError("New password must be at least ${MIN_PASSWORD_LENGTH} characters long");
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
        }, SUCCESS_NOTIFICATION_DELAY);
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
        <FieldDescription>Must be at least {MIN_PASSWORD_LENGTH} characters long</FieldDescription>
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
      <PasswordStrength password={newPassword} />
      {/* Notifications */}
      <Notification type="error" message={error} />
      <Notification type="success" message={success} />

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
