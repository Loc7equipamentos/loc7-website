import { useEffect, useState } from "react";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUserStatus,
  AdminUser,
  AdminUserRole,
} from "@/lib/adminUsers";

export default function AdminUsuarios() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Administrador" as AdminUserRole,
  });

  async function loadUsers() {
    try {
      setError("");
      setLoading(true);
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      await createAdminUser({
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
      });

      setForm({
        name: "",
        email: "",
        role: "Administrador",
      });

      await loadUsers();
    } catch (err: any) {
      setError(err?.message || "Erro ao criar usuário.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(user: AdminUser) {
    try {
      setError("");
      await updateAdminUserStatus(user.id, !user.active);
      await loadUsers();
    } catch (err: any) {
      setError(err?.message || "Erro ao atualizar status.");
    }
  }

  return (
    <div className="min-h-screen bg-[#07111f] px-6 py-16 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
        <section className="bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="text-2xl font-extrabold text-black mb-5">
            Novo Usuário
          </h2>

          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Nome completo
              </label>
              <input
                type="text"
                placeholder="Ex: João Silva"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-11 rounded-md border border-gray-300 px-3 text-black bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                E-mail corporativo
              </label>
              <input
                type="email"
                placeholder="ex: nome@loc7.com.br"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full h-11 rounded-md border border-gray-300 px-3 text-black bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Permissão de acesso
              </label>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as AdminUserRole })
                }
                className="w-full h-11 rounded-md border border-gray-300 px-3 text-black bg-white focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="Administrador">Administrador</option>
                <option value="Operador">Operador</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full h-12 bg-black text-white rounded-md font-bold hover:scale-[1.01] hover:brightness-110 transition disabled:opacity-60"
            >
              {saving ? "Criando..." : "Criar Usuário"}
            </button>
          </form>
        </section>

        <section className="bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="text-2xl font-extrabold text-black mb-5">
            Usuários cadastrados
          </h2>

          {loading ? (
            <p className="text-black">Carregando...</p>
          ) : users.length === 0 ? (
            <p className="text-sm text-gray-500">
              Nenhum usuário cadastrado ainda.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-black text-sm">
                    <th className="px-4 py-3 rounded-l-md font-bold">Nome</th>
                    <th className="px-4 py-3 font-bold">E-mail</th>
                    <th className="px-4 py-3 font-bold">Permissão</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                    <th className="px-4 py-3 rounded-r-md font-bold">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-200">
                      <td className="px-4 py-4">
                        <p className="font-bold text-black">{user.name}</p>
                        <p className="text-xs text-gray-500">
                          Profissional interno
                        </p>
                      </td>

                      <td className="px-4 py-4 text-sm text-black">
                        {user.email}
                      </td>

                      <td className="px-4 py-4 text-sm text-black">
                        {user.role}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            user.active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.active ? "Ativo" : "Inativo"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm">
                        <button className="text-black underline mr-4">
                          Editar
                        </button>

                        <button
                          onClick={() => toggleActive(user)}
                          className="text-black underline"
                        >
                          {user.active ? "Desativar" : "Reativar"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
