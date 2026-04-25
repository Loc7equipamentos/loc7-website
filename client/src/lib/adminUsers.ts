import { supabase } from "./supabase";

export type AdminUserRole = "Administrador" | "Operador";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  active: boolean;
  created_at: string;
};

export async function getAdminUsers() {
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as AdminUser[];
}

export async function createAdminUser(user: {
  name: string;
  email: string;
  role: AdminUserRole;
}) {
  const { error } = await supabase.from("admin_users").insert([user]);

  if (error) throw error;
}

export async function updateAdminUserStatus(id: string, active: boolean) {
  const { error } = await supabase
    .from("admin_users")
    .update({ active })
    .eq("id", id);

  if (error) throw error;
}
