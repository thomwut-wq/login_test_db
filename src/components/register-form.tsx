"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Lock, Mail, User } from "lucide-react";
import { registerAction, type FieldErrors } from "@/app/actions";
import { Button, Field } from "./ui";
import { useToast } from "./toast";

export function RegisterForm({ signIn, onCancel, onSuccess }: { signIn: boolean; onCancel: () => void; onSuccess?: () => void }) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState({ fullName: "", email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const refs = {
    fullName: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
  };
  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [k]: e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(undefined);
    startTransition(async () => {
      const res = await registerAction(values, signIn);
      const fe = res.fieldErrors ?? {};
      setErrors(fe);
      const first = (["fullName", "email", "password"] as const).find((k) => fe[k]);
      if (first) return refs[first].current?.focus();
      if (!res.ok) {
        setFormError(res.error);
        toast("error", res.error ?? "Could not create account");
        return;
      }
      toast("success", signIn ? "Account created — welcome aboard!" : `User ${values.email.trim().toLowerCase()} created`);
      if (signIn) {
        router.push("/dashboard");
        router.refresh();
      } else {
        router.refresh();
        onSuccess?.();
      }
    });
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {formError && (
        <div role="alert" className="animate-fade-in flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
          <AlertCircle className="size-4 shrink-0" aria-hidden />
          {formError}
        </div>
      )}
      <Field ref={refs.fullName} id="fullName" label="Full name" autoComplete="name" placeholder="Jane Cooper" value={values.fullName} onChange={set("fullName")} error={errors.fullName} icon={<User className="size-4" />} />
      <Field ref={refs.email} id="reg-email" label="Email" type="email" inputMode="email" autoComplete="email" placeholder="you@company.com" value={values.email} onChange={set("email")} error={errors.email} icon={<Mail className="size-4" />} />
      <Field ref={refs.password} id="reg-password" label="Password" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={values.password} onChange={set("password")} error={errors.password} icon={<Lock className="size-4" />} />
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={pending} className="sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" loading={pending} className="sm:min-w-36">
          {pending ? "Creating…" : signIn ? "Create account" : "Create user"}
        </Button>
      </div>
    </form>
  );
}
