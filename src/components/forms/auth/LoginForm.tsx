import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import { Field, FieldLabel } from "../../ui/field";
import { Input } from "../../ui/input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logIn } from "@/lib/parse/auth";
import { Spinner } from "@/components/ui/spinner";

export default function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [isSubmited, setIsSubmited] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isSubmited) return;

    setAuthMessage("");
    setIsSubmited(true);

    try {
      await logIn({ username, password });
      navigate("/");
    } catch (err: any) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Login failed. Please check your username and password.";
      setAuthMessage(message);
    } finally {
      setIsSubmited(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Enter your username below to login to your account</p>
      </div>

      <Field>
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (authMessage) setAuthMessage("");
          }}
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (authMessage) setAuthMessage("");
          }}
          required
        />
      </Field>

      <Button type="submit" disabled={isSubmited}>
        {isSubmited && <Spinner />}
        Login
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Link to="/signup" className="text-primary underline-offset-2 hover:underline">
          Sign up
        </Link>
      </p>

      {authMessage && (
        <div
          role="alert"
          aria-live="polite"
          className="bg-destructive/10 text-destructive border-destructive/20 w-full rounded-xl border px-3 py-2 text-center text-sm font-medium"
        >
          {authMessage}
        </div>
      )}
    </form>
  );
}
