import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type User = {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
};

export default function AdminUsuarios() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setUsers(data);
    }

    setLoading(false);
  }

  async function toggleUser(id: string, current: boolean) {
    await supabase
      .from("admin_users")
      .update({ is_active: !current })
      .eq("id", id);

    fetchUsers();
  }

  async function deleteUser(id: string) {
    const confirmDelete = confirm("Excluir usuário?");
    if (!confirmDelete) return;

    await supabase.from("admin_users").delete().eq("id", id);

    fetchUsers();
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-6">Usuários</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleUser(user.id, user.is_active)}
                  className={`px-3 py-1 rounded text-sm ${
                    user.is_active
                      ? "bg-green-500 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {user.is_active ? "Ativo" : "Inativo"}
                </button>

                <button
                  onClick={() => deleteUser(user.id)}
                  className="px-3 py-1 rounded bg-red-500 text-white text-sm"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
