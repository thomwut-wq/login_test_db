import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/login-form";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getSessionUser()) redirect("/dashboard");
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your account to continue.">
      <LoginForm />
    </AuthShell>
  );
}
