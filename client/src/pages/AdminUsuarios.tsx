import { useState } from "react";

type Role = "Administrador" | "Operador";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
};

export default function AdminUsuarios() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Administrador",
      email: "admin@loc7.com.br",
      role: "Administrador",
      active: true,
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Operador" as Role,
  });

  function handleAddUser(e: React.FormEvent) {
    e.preventDefault();

    const newUser: User = {
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      role: form.role,
      active: true,
    };

    setUsers((prev) => [...prev, newUser]);

    setForm({
      name: "",
      email: "",
      role: "Operador",
    });
  }

  function toggleActive(id: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, active: !u.active } : u
      )
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-6">

        {/* CARD FORM */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Novo Usuário
          </h2>

          <form onSubmit={handleAddUser} className="space-y-4">
            
            <div>
              <label className="text-sm text-gray-600">
                Nome completo
              </label>
              <input
                type="text"
                placeholder="Ex: João Silva"
                className="w-full mt-1 border rounded-lg p-3"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                E-mail corporativo
              </label>
              <input
                type="email"
                placeholder="ex: nome@loc7.com.br"
                className="w-full mt-1 border rounded-lg p-3"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Permissão de acesso
              </label>
              <select
                className="w-full mt-1 border rounded-lg p-3"
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as Role })
                }
              >
                <option>Administrador</option>
                <option>Operador</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:opacity-90"
            >
              Criar Usuário
            </button>
          </form>
        </div>

        {/* CARD LISTA */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Usuários cadastrados
          </h2>

          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="border rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user.role}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      user.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.active ? "Ativo" : "Inativo"}
                  </span>

                  <button
                    onClick={() => toggleActive(user.id)}
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    {user.active ? "Desativar" : "Reativar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
