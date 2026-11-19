"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { loginAction, type FieldErrors } from "@/app/actions";
import { Button, Field } from "./ui";
import { useToast } from "./toast";

const DEMO = [
  { label: "Admin", email: "admin@test.com", password: "admin1234" },
  { label: "Demo", email: "demo@test.com", password: "demo1234" },
];

export function LoginForm() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(undefined);
    startTransition(async () => {
      const res = await loginAction(email, password);
      setErrors(res.fieldErrors ?? {});
      if (res.fieldErrors?.email) return emailRef.current?.focus();
      if (res.fieldErrors?.password) return passwordRef.current?.focus();
      if (!res.ok) {
        setFormError(res.error);
        toast("error", res.error ?? "Sign in failed");
        return passwordRef.current?.select();
      }
      toast("success", "Welcome back! Signed in successfully.");
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <>
      <form onSubmit={submit} noValidate className="space-y-4">
        {formError && (
          <div role="alert" className="animate-fade-in flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
            <AlertCircle className="size-4 shrink-0" aria-hidden />
            {formError}
          </div>
        )}
        <Field
          ref={emailRef}
          id="email"
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          icon={<Mail className="size-4" />}
        />
        <Field
          ref={passwordRef}
          id="password"
          label="Password"
          type={show ? "text" : "password"}
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          icon={<Lock className="size-4" />}
          trailing={
            <button
              type="button"
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => setShow((s) => !s)}
              className="cursor-pointer rounded-md p-1.5 text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
        />
        <Button type="submit" loading={pending} className="w-full">
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="rounded font-medium text-indigo-600 transition-colors duration-150 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
          Create one
        </Link>
      </p>

      <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white/60 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Demo accounts</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {DEMO.map((d) => (
            <button
              key={d.email}
              type="button"
              onClick={() => {
                setEmail(d.email);
                setPassword(d.password);
                setErrors({});
                setFormError(undefined);
              }}
              className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-left shadow-sm transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <span className="block text-sm font-medium text-slate-900">{d.label}</span>
              <span className="block truncate text-xs text-slate-500">{d.email}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
