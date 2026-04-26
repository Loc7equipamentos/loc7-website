import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, Trash2 } from "lucide-react";

type AdminUser = {
  id: string;
  email: string;
  name?: string | null;
  role: "Administrador" | "Operador" | string;
  active: boolean;
  created_at?: string;
};

export default function AdminUsuarios() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Operador",
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
      setError(`Erro ao carregar usuários: ${error.message}`);
      setLoading(false);
      return;
    }

    setUsers(data || []);
    setLoading(false);
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.role) {
      setError("Preencha nome, e-mail, senha e permissão.");
      return;
    }

    setSaving(true);
    setError("");

    const token = await getToken();

    const { data, error } = await supabase.functions.invoke("create-admin-user", {
      body: {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (error) {
      setError(error.message || "Erro ao criar usuário.");
      setSaving(false);
      return;
    }

    if (data?.success === false) {
      setError(data?.error || "Erro ao criar usuário.");
      setSaving(false);
      return;
    }

    setForm({
      name: "",
      email: "",
      password: "",
      role: "Operador",
    });

    setSaving(false);
    await loadUsers();
  }

  async function toggleUser(user: AdminUser) {
    setError("");

    const { error } = await supabase
      .from("admin_users")
      .update({ active: !user.active })
      .eq("id", user.id);

    if (error) {
      setError(`Erro ao alterar status do usuário: ${error.message}`);
      return;
    }

    await loadUsers();
  }

  async function deleteUser(user: AdminUser) {
    const ok = confirm(`Excluir completamente o usuário ${user.email}?`);
    if (!ok) return;

    setError("");

    const token = await getToken();

    const { data, error } = await supabase.functions.invoke("delete-admin-user", {
      body: {
        user_id: user.id,
        email: user.email,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (error) {
      setError(error.message || "Erro ao excluir usuário.");
      return;
    }

    if (data?.success === false) {
      setError(data?.error || "Erro ao excluir usuário.");
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
          <h1 className="text-5xl font-semibold text-white">
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
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-black placeholder:text-gray-400 outline-none focus:border-black"
                  required
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
                  <option value="Administrador">Administrador</option>
                  <option value="Operador">Operador</option>
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
              <table className="w-full min-w-[820px] text-sm">
                <thead>
                  <tr className="bg-gray-100 text-center text-black">
                    <th className="px-4 py-3 font-bold">Nome</th>
                    <th className="px-4 py-3 font-bold">E-mail</th>
                    <th className="px-4 py-3 font-bold">Permissão</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                    <th className="px-4 py-3 font-bold">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        Carregando usuários...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        Nenhum usuário cadastrado.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-200 text-center"
                      >
                        <td className="px-4 py-4">
                          <p className="font-bold text-black">
                            {user.name || "Sem nome"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Profissional interno
                          </p>
                        </td>

                        <td className="px-4 py-4 text-black">{user.email}</td>

                        <td className="px-4 py-4 text-black">
                          {user.role || "Operador"}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              user.active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.active ? "Ativo" : "Inativo"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-4">
                            <button
                              onClick={() => toggleUser(user)}
                              className="text-sm underline"
                            >
                              {user.active ? "Desativar" : "Reativar"}
                            </button>

                            <button
                              onClick={() => deleteUser(user)}
                              className="text-red-600 hover:opacity-70"
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
          </section>
        </div>
      </div>
    </div>
  );
}
