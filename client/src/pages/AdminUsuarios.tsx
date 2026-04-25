import { useState } from "react";

type Role = "admin" | "operador";

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
      role: "admin",
      active: true,
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "operador" as Role,
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
      role: "operador",
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Usuários do Sistema
          </h1>
          <p className="text-gray-500">
            Controle de acessos e permissões
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="font-semibold mb-4">Novo Usuário</h2>

          <form onSubmit={handleAddUser} className="grid md:grid-cols-3 gap-4">
            
            <input
              type="text"
              placeholder="Nome"
              className="border rounded-lg p-3"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="border rounded-lg p-3"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />

            <select
              className="border rounded-lg p-3"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as Role })
              }
            >
              <option value="operador">Operador</option>
              <option value="admin">Administrador</option>
            </select>

            <button
              type="submit"
              className="col-span-3 bg-black text-white py-3 rounded-lg font-semibold hover:opacity-90"
            >
              Criar Usuário
            </button>
          </form>
        </div>

        {/* LISTA */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold mb-4">Usuários Cadastrados</h2>

          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between border rounded-lg p-4"
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

                <button
                  onClick={() => toggleActive(user.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    user.active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.active ? "Ativo" : "Inativo"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
