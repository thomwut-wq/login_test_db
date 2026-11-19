"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabase } from "@/lib/supabase";
import { createSession, destroySession, getSessionUserId } from "@/lib/session";

export type FieldErrors = Partial<Record<"email" | "password" | "fullName", string>>;
export type ActionResult = { ok: boolean; error?: string; fieldErrors?: FieldErrors };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function loginAction(email: string, password: string): Promise<ActionResult> {
  const fieldErrors: FieldErrors = {};
  if (!EMAIL_RE.test(email.trim())) fieldErrors.email = "Enter a valid email address";
  if (!password) fieldErrors.password = "Password is required";
  if (Object.keys(fieldErrors).length) return { ok: false, fieldErrors };

  const { data, error } = await getSupabase().rpc("login_test_db_dhhp_login", {
    p_email: email,
    p_password: password,
  });
  if (error) return { ok: false, error: "Could not reach the server. Please try again." };
  const user = Array.isArray(data) ? data[0] : null;
  if (!user) return { ok: false, error: "Invalid email or password" };

  await createSession(user.id);
  return { ok: true };
}

export async function registerAction(
  input: { email: string; password: string; fullName: string },
  signIn: boolean,
): Promise<ActionResult> {
  const fieldErrors: FieldErrors = {};
  if (!input.fullName.trim()) fieldErrors.fullName = "Full name is required";
  if (!EMAIL_RE.test(input.email.trim())) fieldErrors.email = "Enter a valid email address";
  if (input.password.length < 8) fieldErrors.password = "Password must be at least 8 characters";
  if (Object.keys(fieldErrors).length) return { ok: false, fieldErrors };

  const { data, error } = await getSupabase().rpc("login_test_db_dhhp_register", {
    p_email: input.email,
    p_password: input.password,
    p_full_name: input.fullName,
  });
  if (error) {
    if (error.code === "23505") return { ok: false, fieldErrors: { email: error.message } };
    return { ok: false, error: error.message };
  }
  const user = Array.isArray(data) ? data[0] : null;
  if (!user) return { ok: false, error: "Registration failed" };

  if (signIn) await createSession(user.id);
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteUserAction(targetId: string): Promise<ActionResult> {
  const actorId = await getSessionUserId();
  if (!actorId) return { ok: false, error: "Your session has expired. Please sign in again." };
  const { error } = await getSupabase().rpc("login_test_db_dhhp_delete_user", {
    p_actor_id: actorId,
    p_target_id: targetId,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
