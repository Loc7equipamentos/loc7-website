import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, Trash2 } from "lucide-react";

type AdminUser = {
  id: string;
  email: string;
  full_name?: string | null;
  role: "admin" | "operador" | string;
  is_active: boolean;
  created_at?: string;
};

export default function AdminUsuarios() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "operador",
  });

  async function getToken() {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  }

  async function loadUsers() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError("Erro ao carregar usuários.");
      setLoading(false);
      return;
    }

    setUsers(data || []);
    setLoading(false);
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault();

    if (!form.email || !form.password || !form.role) {
      setError("Preencha e-mail, senha e permissão.");
      return;
    }

    setSaving(true);
    setError("");

    const token = await getToken();

    const { error } = await supabase.functions.invoke("create-admin-user", {
      body: {
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        full_name: form.full_name.trim() || null,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (error) {
      setError("Erro ao criar usuário.");
      setSaving(false);
      return;
    }

    setForm({
      full_name: "",
      email: "",
      password: "",
      role: "operador",
    });

    setSaving(false);
    await loadUsers();
  }

  async function toggleUser(user: AdminUser) {
    setError("");

    const { error } = await supabase
      .from("admin_users")
      .update({ is_active: !user.is_active })
      .eq("id", user.id);

    if (error) {
      setError("Erro ao alterar status.");
      return;
    }

    await loadUsers();
  }

  async function deleteUser(user: AdminUser) {
    const ok = confirm(`Excluir usuário ${user.email}?`);
    if (!ok) return;

    const token = await getToken();

    const { error } = await supabase.functions.invoke("delete-admin-user", {
      body: {
        user_id: user.id,
        email: user.email,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (error) {
      setError("Erro ao excluir.");
      return;
    }

    await loadUsers();
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="min-h-screen bg-[#07101c] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-5xl font-bold text-white">
          Usuários do Sistema
        </h1>
        <p className="mb-10 text-xl text-white/60">
          Controle de acessos e permissões
        </p>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          {/* FORM */}
          <div className="rounded-2xl bg-white p-7 shadow-2xl">
            <h2 className="mb-6 text-3xl font-bold">Novo Usuário</h2>

            <form onSubmit={createUser} className="space-y-4">
              <input
                type="text"
                placeholder="Nome completo"
                value={form.full_name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, full_name: e.target.value }))
                }
                className="w-full rounded-lg border px-3 py-2"
              />

              <input
                type="email"
                placeholder="E-mail corporativo"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full rounded-lg border px-3 py-2"
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="w-full rounded-lg border px-3 py-2 pr-10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <select
                value={form.role}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, role: e.target.value }))
                }
                className="w-full rounded-lg border px-3 py-2"
              >
                <option value="admin">Administrador</option>
                <option value="operador">Operador</option>
              </select>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <button className="w-full rounded-lg bg-black py-3 text-white font-bold">
                {saving ? "Criando..." : "Criar Usuário"}
              </button>
            </form>
          </div>

          {/* TABELA */}
          <div className="rounded-2xl bg-white p-7 shadow-2xl">
            <h2 className="mb-6 text-3xl font-bold">
              Usuários cadastrados
            </h2>

            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-center">
                  <th className="py-3">Nome</th>
                  <th className="py-3">E-mail</th>
                  <th className="py-3">Permissão</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Ações</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6">
                      Carregando...
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b text-center">
                      <td className="py-4">
                        {user.full_name || "Sem nome"}
                      </td>

                      <td className="py-4">{user.email}</td>

                      <td className="py-4">
                        {user.role === "admin"
                          ? "Administrador"
                          : "Operador"}
                      </td>

                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            user.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.is_active ? "Ativo" : "Inativo"}
                        </span>
                      </td>

                      <td className="py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => toggleUser(user)}
                            className="text-sm underline"
                          >
                            {user.is_active ? "Desativar" : "Reativar"}
                          </button>

                          {/* LIXEIRA */}
                          <button
                            onClick={() => deleteUser(user)}
                            className="flex h-8 w-8 items-center justify-center text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
