"use client";

import { useMemo, useState, useTransition } from "react";
import { CalendarDays, Clock, Mail, Plus, Search, ShieldCheck, Trash2, UserPlus, Users } from "lucide-react";
import type { PublicUser } from "@/lib/supabase";
import { formatDate, formatShortDate } from "@/lib/format";
import { deleteUserAction } from "@/app/actions";
import { Button, Logo, Modal, initials } from "@/components/ui";
import { UserMenu } from "@/components/user-menu";
import { RegisterForm } from "@/components/register-form";
import { useToast } from "@/components/toast";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function Badge({ tone, children }: { tone: "indigo" | "emerald" | "slate"; children: React.ReactNode }) {
  const styles = {
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    slate: "bg-slate-100 text-slate-600 ring-slate-500/20",
  }[tone];
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${styles}`}>{children}</span>;
}

function Avatar({ user, size = "md" }: { user: PublicUser; size?: "md" | "lg" }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 font-semibold text-white ${size === "lg" ? "size-14 text-lg" : "size-9 text-xs"}`}>
      {initials(user.full_name, user.email)}
    </span>
  );
}

function StatusBadges({ user, me }: { user: PublicUser; me: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {user.id === me && <Badge tone="indigo">You</Badge>}
      {user.is_seed ? <Badge tone="slate">Demo</Badge> : <Badge tone="emerald">Active</Badge>}
    </div>
  );
}

export function DashboardView({ me, users, now }: { me: PublicUser; users: PublicUser[]; now: number }) {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<PublicUser | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<PublicUser | null>(null);
  const [deleting, startDelete] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? users.filter((u) => u.email.includes(q) || u.full_name?.toLowerCase().includes(q)) : users;
  }, [users, query]);

  const newThisWeek = users.filter((u) => now - new Date(u.created_at).getTime() < WEEK_MS).length;
  const kpis = [
    { label: "Registered users", value: users.length, icon: Users, tone: "bg-indigo-50 text-indigo-600" },
    { label: "New this week", value: newThisWeek, icon: UserPlus, tone: "bg-emerald-50 text-emerald-600" },
    { label: "Demo accounts", value: users.filter((u) => u.is_seed).length, icon: ShieldCheck, tone: "bg-amber-50 text-amber-600" },
  ];

  function doDelete() {
    if (!confirmDelete) return;
    const target = confirmDelete;
    startDelete(async () => {
      const res = await deleteUserAction(target.id);
      if (!res.ok) return toast("error", res.error ?? "Delete failed");
      toast("success", `Deleted ${target.email}`);
      setConfirmDelete(null);
      setSelected(null);
    });
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo />
          <UserMenu name={me.full_name} email={me.email} onProfile={() => setSelected(me)} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <section className="animate-fade-up flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
          <Avatar user={me} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-slate-500">Signed in as</p>
            <h1 className="truncate text-xl font-semibold tracking-tight text-slate-900">{me.full_name || me.email}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-500">
              <span className="flex min-w-0 items-center gap-1.5"><Mail className="size-4 shrink-0" aria-hidden /><span className="truncate">{me.email}</span></span>
              <span className="flex items-center gap-1.5"><CalendarDays className="size-4" aria-hidden />Member since {formatShortDate(me.created_at)}</span>
            </div>
          </div>
          <StatusBadges user={me} me={me.id} />
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {kpis.map(({ label, value, icon: Icon, tone }, i) => (
            <div key={label} className="animate-fade-up rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-md" style={{ animationDelay: `${80 + i * 60}ms` }}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <span className={`flex size-9 items-center justify-center rounded-lg ${tone}`}><Icon className="size-5" aria-hidden /></span>
              </div>
              <p className="mt-3 text-3xl font-semibold tabular-nums tracking-tight text-slate-900">{value.toLocaleString("en-US")}</p>
            </div>
          ))}
        </section>

        <section className="animate-fade-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" style={{ animationDelay: "260ms" }}>
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Registered users</h2>
              <p className="text-sm text-slate-500">All accounts stored in Supabase. Click a row for details.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label htmlFor="search" className="sr-only">Search users</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
                <input
                  id="search"
                  type="search"
                  placeholder="Search by name or email"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm shadow-sm transition-colors duration-150 placeholder:text-slate-400 hover:border-slate-300 focus:outline-none focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-200 sm:w-64"
                />
              </div>
              <Button onClick={() => setAdding(true)}><Plus className="size-4" aria-hidden />Add user</Button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><Users className="size-7" aria-hidden /></span>
              <p className="mt-4 font-medium text-slate-900">{users.length ? "No users match your search" : "No users yet"}</p>
              <p className="mt-1 text-sm text-slate-500">{users.length ? "Try a different name or email." : "Create the first account to get started."}</p>
            </div>
          ) : (
            <div className="max-h-[28rem] overflow-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="sticky top-0 z-10 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500 shadow-[inset_0_-1px_0] shadow-slate-200">
                  <tr>
                    <th scope="col" className="px-5 py-3">User</th>
                    <th scope="col" className="px-5 py-3">Status</th>
                    <th scope="col" className="px-5 py-3">Created</th>
                    <th scope="col" className="px-5 py-3 text-right"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((u, i) => (
                    <tr
                      key={u.id}
                      tabIndex={0}
                      onClick={() => setSelected(u)}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSelected(u))}
                      className="animate-fade-up group cursor-pointer transition-colors duration-150 hover:bg-indigo-50/60 focus-visible:bg-indigo-50/60 focus-visible:outline-none"
                      style={{ animationDelay: `${300 + i * 40}ms` }}
                    >
                      <td className="px-5 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar user={u} />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-900 group-hover:text-indigo-700">{u.full_name || "—"}</p>
                            <p className="truncate text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3"><StatusBadges user={u} me={me.id} /></td>
                      <td className="whitespace-nowrap px-5 py-3 tabular-nums text-slate-500">{formatDate(u.created_at)}</td>
                      <td className="px-5 py-3 text-right">
                        {!u.is_seed && u.id !== me.id && (
                          <button
                            type="button"
                            aria-label={`Delete ${u.email}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDelete(u);
                            }}
                            className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors duration-150 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add a new user" description="The account is saved to Supabase and can sign in immediately.">
        <RegisterForm signIn={false} onCancel={() => setAdding(false)} onSuccess={() => setAdding(false)} />
      </Modal>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="User details">
        {selected && (
          <div>
            <div className="flex items-center gap-4">
              <Avatar user={selected} size="lg" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">{selected.full_name || "Unnamed user"}</p>
                <p className="truncate text-sm text-slate-500">{selected.email}</p>
              </div>
            </div>
            <dl className="mt-6 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Status</dt><dd><StatusBadges user={selected} me={me.id} /></dd></div>
              <div className="flex justify-between gap-4"><dt className="flex items-center gap-1.5 text-slate-500"><Clock className="size-4" aria-hidden />Created</dt><dd className="tabular-nums text-slate-900">{formatDate(selected.created_at)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">User ID</dt><dd className="min-w-0 truncate font-mono text-xs text-slate-600">{selected.id}</dd></div>
            </dl>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              {!selected.is_seed && selected.id !== me.id && (
                <Button variant="danger" onClick={() => setConfirmDelete(selected)} className="sm:mr-auto"><Trash2 className="size-4" aria-hidden />Delete</Button>
              )}
              <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => !deleting && setConfirmDelete(null)} title="Delete user?" description={confirmDelete ? `${confirmDelete.email} will be permanently removed from Supabase. This cannot be undone.` : undefined}>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => setConfirmDelete(null)} disabled={deleting}>Cancel</Button>
          <Button variant="danger" onClick={doDelete} loading={deleting}>{deleting ? "Deleting…" : "Delete user"}</Button>
        </div>
      </Modal>
    </div>
  );
}
