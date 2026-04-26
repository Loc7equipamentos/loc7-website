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
      setError("Erro ao alterar status do usuário.");
      return;
    }

    await loadUsers();
  }

  async function deleteUser(user: AdminUser) {
    const ok = confirm(`Excluir completamente o usuário ${user.email}?`);
    if (!ok) return;

    setError("");

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
      setError("Erro ao excluir usuário.");
      return;
    }

    await loadUsers();
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="min-h-screen bg-[#07101c] px-6 py-10 text-black">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12">
          <h1 className="text-5xl font-bold tracking-tight text-white">
            Usuários do Sistema
          </h1>
          <p className="mt-3 text-2xl text-white/55">
            Controle de acessos e permissões
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          <section className="rounded-2xl bg-white p-7 shadow-2xl">
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-black">
              Novo Usuário
            </h2>

            <form onSubmit={createUser} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-bold text-black">
                  Nome completo
                </label>
                <input
                  type="text"
                  placeholder="Ex: João Silva"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, full_name: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-black placeholder:text-gray-400 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-black">
                  E-mail corporativo
                </label>
                <input
                  type="email"
                  placeholder="ex: nome@loc7.com.br"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-black placeholder:text-gray-400 outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-black">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha provisória"
                    value={form.password}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-black placeholder:text-gray-400 outline-none focus:border-black"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2.5 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-black">
                  Permissão de acesso
                </label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-black outline-none focus:border-black"
                >
                  <option value="admin">Administrador</option>
                  <option value="operador">Operador</option>
                </select>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="mt-2 w-full rounded-lg bg-black py-3 text-sm font-bold text-white transition hover:scale-[1.01] hover:brightness-110 disabled:opacity-60"
              >
                {saving ? "Criando..." : "Criar Usuário"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl bg-white p-7 shadow-2xl">
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-black">
              Usuários cadastrados
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead>
                  <tr className="bg-gray-100 text-black">
                    <th className="px-4 py-3 font-bold">Nome</th>
                    <th className="px-4 py-3 font-bold">E-mail</th>
                    <th className="px-4 py-3 font-bold">Permissão</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                    <th className="px-4 py-3 text-right font-bold">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        Carregando usuários...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        Nenhum usuário cadastrado.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-200">
                        <td className="px-4 py-4 align-middle">
                          <p className="font-bold text-black">
                            {user.full_name || "Sem nome"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Profissional interno
                          </p>
                        </td>

                        <td className="px-4 py-4 align-middle text-black">
                          {user.email}
                        </td>

                        <td className="px-4 py-4 align-middle text-black">
                          {user.role === "admin" ? "Administrador" : "Operador"}
                        </td>

                        <td className="px-4 py-4 align-middle">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              user.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.is_active ? "Ativo" : "Inativo"}
                          </span>
                        </td>

                        <td className="px-4 py-4 align-middle">
                          <div className="flex items-center justify-end gap-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleUser(user)}
                              className="text-sm font-medium text-black underline underline-offset-2 transition hover:opacity-70"
                            >
                              {user.is_active ? "Desativar" : "Reativar"}
                            </button>

                            <button
                              onClick={() => deleteUser(user)}
                              className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold text-white transition hover:bg-red-700"
                            >
                              <Trash2 size={14} />
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
