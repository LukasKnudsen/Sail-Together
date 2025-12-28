import LoginForm from "@/components/forms/auth/LoginForm";
import { Container } from "@/components/ui/container";

export default function LoginPage() {
  return (
    <Container>
      <LoginForm className="mx-auto w-full max-w-md" />
    </Container>
  );
}
