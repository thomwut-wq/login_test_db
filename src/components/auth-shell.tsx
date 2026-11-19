import { ShieldCheck, Database, Zap } from "lucide-react";
import { Logo } from "./ui";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <section className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="animate-fade-up w-full max-w-sm">
          <Logo className="mb-10" />
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
      <aside className="relative hidden overflow-hidden bg-indigo-600 lg:flex lg:items-center lg:justify-center">
        <div className="absolute -right-24 -top-24 size-96 rounded-full bg-indigo-500/60 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 -left-16 size-96 rounded-full bg-violet-500/50 blur-3xl" aria-hidden />
        <div className="relative max-w-md px-10 text-white">
          <h2 className="animate-fade-up text-3xl font-semibold leading-tight tracking-tight">Sign in once. Your data lives safely in Postgres.</h2>
          <ul className="mt-10 space-y-5">
            {[
              { icon: ShieldCheck, title: "Hashed with bcrypt", text: "Passwords are hashed in the database, never stored in the browser." },
              { icon: Database, title: "Powered by Supabase", text: "Every account is a row in a Supabase PostgreSQL table." },
              { icon: Zap, title: "httpOnly sessions", text: "Signed, server-only cookies keep your session secure." },
            ].map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="animate-fade-up flex gap-4" style={{ animationDelay: `${120 + i * 80}ms` }}>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="mt-0.5 text-sm text-indigo-100">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </main>
  );
}
