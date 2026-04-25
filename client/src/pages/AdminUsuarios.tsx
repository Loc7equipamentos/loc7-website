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

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Administrador" as AdminUserRole,
  });

  async function loadUsers() {
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      console.error("Erro ao carregar usuários", err);
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
      await createAdminUser(form);

      setForm({
        name: "",
        email: "",
        role: "Administrador",
      });

      loadUsers();
    } catch (err) {
      console.error("Erro ao criar usuário", err);
    }
  }

  async function toggleActive(user: AdminUser) {
    try {
      await updateAdminUserStatus(user.id, !user.active);
      loadUsers();
    } catch (err) {
      console.error("Erro ao atualizar status", err);
    }
  }

  return (
    <div className="min-h-screen bg-[#07111f] px-6 py-16 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">

        {/* FORM */}
        <section className="bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="text-2xl font-extrabold text-black mb-5">
            Novo Usuário
          </h2>

          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Nome completo
              </label>
              <input
                type="text"
                placeholder="Ex: João Silva"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full h-11 rounded-md border border-gray-300 px-3"
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
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full h-11 rounded-md border border-gray-300 px-3"
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
                  setForm({
                    ...form,
                    role: e.target.value as AdminUserRole,
                  })
                }
                className="w-full h-11 rounded-md border border-gray-300 px-3"
              >
                <option value="Administrador">Administrador</option>
                <option value="Operador">Operador</option>
              </select>
            </div>

            <button className="w-full h-12 bg-black text-white rounded-md font-bold">
              Criar Usuário
            </button>
          </form>
        </section>

        {/* LISTA */}
        <section className="bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="text-2xl font-extrabold text-black mb-5">
            Usuários cadastrados
          </h2>

          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-black text-sm">
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">E-mail</th>
                    <th className="px-4 py-3">Permissão</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="px-4 py-4">
                        <p className="font-bold">{user.name}</p>
                      </td>

                      <td className="px-4 py-4 text-sm">
                        {user.email}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        {user.role}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            user.active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.active ? "Ativo" : "Inativo"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm">
                        <button className="underline mr-4">
                          Editar
                        </button>

                        <button
                          onClick={() => toggleActive(user)}
                          className="underline"
                        >
                          {user.active
                            ? "Desativar"
                            : "Reativar"}
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
