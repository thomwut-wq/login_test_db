"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ChevronDown, Loader2, LogOut, UserRound } from "lucide-react";
import { logoutAction } from "@/app/actions";
import { initials } from "./ui";

export function UserMenu({ name, email, onProfile }: { name: string | null; email: string; onProfile: () => void }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const item = "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Open user menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex cursor-pointer items-center gap-2 rounded-full p-1 pr-2 transition-colors duration-150 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-semibold text-white ring-2 ring-white">
          {initials(name, email)}
        </span>
        <ChevronDown className={`size-4 text-slate-500 transition-transform duration-150 ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <div role="menu" className="animate-scale-in absolute right-0 z-40 mt-2 w-64 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
          <div className="border-b border-slate-100 px-3 py-2.5">
            <p className="truncate text-sm font-medium text-slate-900">{name || "Unnamed user"}</p>
            <p className="truncate text-xs text-slate-500">{email}</p>
          </div>
          <div className="pt-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onProfile();
              }}
              className={`${item} text-slate-700 hover:bg-slate-100`}
            >
              <UserRound className="size-4" aria-hidden /> Profile
            </button>
            <button
              type="button"
              role="menuitem"
              disabled={pending}
              onClick={() => startTransition(() => logoutAction())}
              className={`${item} text-rose-600 hover:bg-rose-50`}
            >
              {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <LogOut className="size-4" aria-hidden />}
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
