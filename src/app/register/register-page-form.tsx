"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RegisterForm } from "@/components/register-form";

export function RegisterPageForm() {
  const router = useRouter();
  return (
    <>
      <RegisterForm signIn onCancel={() => router.push("/")} />
      <p className="mt-6 text-center text-sm text-slate-500">
        Already registered?{" "}
        <Link href="/" className="rounded font-medium text-indigo-600 transition-colors duration-150 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
          Sign in
        </Link>
      </p>
    </>
  );
}
