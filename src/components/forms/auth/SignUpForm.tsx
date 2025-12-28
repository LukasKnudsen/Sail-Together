import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/parse/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Field, FieldLabel, FieldDescription, FieldError } from "../../ui/field";
import { Spinner } from "@/components/ui/spinner";

export default function SignUpForm({ className, ...props }: React.ComponentProps<"form">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [isSubmited, setIsSubmited] = useState(false);

  const trimmedName = fullName.trim();
  const hasName = trimmedName.length > 0;

  const nameHasEdgeSpaces = fullName.startsWith(" ") || fullName.endsWith(" ");
  const namePatternInvalid =
    trimmedName.length >= 2 && !/^[A-Za-zÀ-ÖØ-öø-ÿ'’ -]{2,50}$/.test(trimmedName);
  const nameInvalid = nameHasEdgeSpaces || namePatternInvalid;

  const trimmedUsername = username.trim().toLowerCase();
  const hasUsername = trimmedUsername.length > 0;

  const usernameInvalid = hasUsername && !/^[a-z0-9._-]{3,20}$/.test(trimmedUsername);
  const usernameHasSpaces = hasUsername && (username.startsWith(" ") || username.endsWith(" "));

  const hasPassword = password.length > 0;
  const hasConfirmPassword = confirmPassword.length > 0;

  const passwordTooShort = hasPassword && password.length < 8;
  const passwordHasSpaces = hasPassword && (password.startsWith(" ") || password.endsWith(" "));
  const passwordMismatch = hasPassword && hasConfirmPassword && confirmPassword !== password;

  const isFormInvalid =
    !hasUsername ||
    !hasPassword ||
    !hasConfirmPassword ||
    !hasName ||
    nameInvalid ||
    usernameInvalid ||
    usernameHasSpaces ||
    passwordMismatch ||
    passwordTooShort ||
    passwordHasSpaces;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isSubmited) return;
    if (isFormInvalid) return;

    setAuthMessage("");
    setIsSubmited(true);

    try {
      await signUp({ username, password, name: fullName });
      setAuthMessage("Account created! You can now log in.");
    } catch (err: any) {
      setAuthMessage("Error:" + err.message);
    } finally {
      setIsSubmited(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground">Fill in the form below to create your account</p>
      </div>

      <Field data-invalid={Boolean(nameInvalid)}>
        <FieldLabel htmlFor="name">Full Name</FieldLabel>
        <Input
          id="name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          aria-invalid={Boolean(nameInvalid)}
          required
        />
        <FieldError
          errors={
            [
              nameHasEdgeSpaces && { message: "Name cannot start or end with spaces." },
              namePatternInvalid && {
                message: "Full name should contain only letters and spaces.",
              },
            ].filter(Boolean) as { message?: string }[]
          }
        />
      </Field>

      <Field data-invalid={Boolean(usernameInvalid)}>
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-invalid={Boolean(usernameInvalid)}
          required
        />
        <FieldDescription>Choose a unique username for your account.</FieldDescription>
        <FieldError
          errors={
            [
              usernameHasSpaces && { message: "Username cannot start or end with spaces." },
              usernameInvalid && {
                message: "Use 3–20 characters: lowercase letters, numbers, dots, or underscores.",
              },
            ].filter(Boolean) as { message?: string }[]
          }
        />
      </Field>

      <Field data-invalid={Boolean(passwordTooShort || passwordHasSpaces)}>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={Boolean(passwordTooShort)}
          required
        />
        <FieldDescription>Must be at least 8 characters long.</FieldDescription>
        <FieldError
          errors={
            [
              passwordHasSpaces && { message: "Password cannot start or end with spaces." },
              passwordTooShort && { message: "Password must be at least 8 characters long." },
            ].filter(Boolean) as { message?: string }[]
          }
        />
      </Field>

      <Field data-invalid={Boolean(passwordMismatch)}>
        <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          aria-invalid={Boolean(passwordMismatch)}
          required
        />
        <FieldError>{passwordMismatch && "Passwords do not match."}</FieldError>
      </Field>

      <Button type="submit" disabled={isSubmited}>
        {isSubmited && <Spinner />}
        Create Account
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-primary underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>

      {authMessage && (
        <div
          role="alert"
          aria-live="polite"
          className={cn(
            "borer w-full rounded-xl px-3 py-2 text-center text-sm font-medium",
            authMessage.startsWith("Error")
              ? "bg-destructive/10 text-destructive border-destructive/20"
              : "border-green-200 bg-green-50 text-green-700"
          )}
        >
          {authMessage}
        </div>
      )}
    </form>
  );
}
