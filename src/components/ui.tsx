"use client";

import { forwardRef, useEffect } from "react";
import { Loader2, X } from "lucide-react";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
};

export function Button({ variant = "primary", loading, className = "", children, disabled, ...props }: ButtonProps) {
  const styles = {
    primary: "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800",
    secondary: "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900",
    danger: "bg-rose-600 text-white shadow-sm hover:bg-rose-700",
  }[variant];
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${focusRing} ${styles} ${className}`}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
};

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { id, label, error, icon, trailing, className = "", ...props },
  ref,
) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block cursor-pointer text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        {icon && <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">{icon}</span>}
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`block h-10 w-full rounded-lg border bg-white text-sm text-slate-900 shadow-sm transition-colors duration-150 placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 ${
            icon ? "pl-10" : "pl-3"
          } ${trailing ? "pr-10" : "pr-3"} ${
            error
              ? "border-rose-300 focus-visible:border-rose-400 focus-visible:ring-rose-200"
              : "border-slate-200 hover:border-slate-300 focus-visible:border-indigo-400 focus-visible:ring-indigo-200"
          }`}
          {...props}
        />
        {trailing && <span className="absolute inset-y-0 right-1.5 flex items-center">{trailing}</span>}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
});

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        tabIndex={-1}
        onClick={onClose}
        className="animate-fade-in absolute inset-0 cursor-default bg-slate-900/40 backdrop-blur-sm"
      />
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="animate-scale-in relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id="modal-title" className="text-lg font-semibold text-slate-900">{title}</h2>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className={`cursor-pointer rounded-lg p-1 text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600 ${focusRing}`}
          >
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" width={32} height={32} alt="" className="size-8 rounded-lg" />
      <span className="text-base font-semibold tracking-tight text-slate-900">LoginTest</span>
    </span>
  );
}

export function initials(name: string | null, email: string) {
  const source = name?.trim() || email.split("@")[0];
  const parts = source.split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? parts[0]?.[1] ?? "")).toUpperCase();
}
