import SignUpForm from "@/components/forms/auth/SignUpForm";
import { Container } from "@/components/ui/container";

export default function SignUpPage() {
  return (
    <Container>
      <SignUpForm className="mx-auto w-full max-w-md" />
    </Container>
  );
}
