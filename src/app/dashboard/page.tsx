import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { listUsers } from "@/lib/supabase";
import { DashboardView } from "./dashboard-view";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const me = await getSessionUser();
  if (!me) redirect("/");
  const users = await listUsers();
  const now = Date.now();
  return <DashboardView me={me} users={users} now={now} />;
}
