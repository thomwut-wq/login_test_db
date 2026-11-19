import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { RegisterPageForm } from "./register-page-form";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <AuthShell title="Create your account" subtitle="It takes less than a minute. No email verification needed.">
      <RegisterPageForm />
    </AuthShell>
  );
}
