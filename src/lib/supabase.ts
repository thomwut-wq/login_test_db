import { createClient } from "@supabase/supabase-js";

export const USERS_TABLE = "login_test_db_dhhp_users";

export type PublicUser = {
  id: string;
  email: string;
  full_name: string | null;
  is_seed: boolean;
  created_at: string;
};

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function listUsers(): Promise<PublicUser[]> {
  const { data, error } = await getSupabase()
    .from(USERS_TABLE)
    .select("id, email, full_name, is_seed, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
