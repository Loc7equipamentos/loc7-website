import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
};

export default function AdminUsuarios() {
  const [users, setUsers] = useState<User[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Operador");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  async function loadUsers() {
    const { data } = await supabase.from("admin_users").select("*");
    if (data) setUsers(data);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 4) {
      setError("Senha muito curta");
      return;
    }

    const { error } = await supabase.from("admin_users").insert([
      {
        name,
        email,
        role,
        active: true,
      },
    ]);

    if (error) {
      setError(error.message);
    } else {
      setName("");
      setEmail("");
      setRole("Operador");
      setPassword("");
      setConfirmPassword("");
      loadUsers();
    }
  }

  async function toggleUser(user: User) {
    await supabase
      .from("admin_users")
      .update({ active: !user.active })
      .eq("id", user.id);

    loadUsers();
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-10">
      <div className="grid grid-cols-2 gap-10 w-full max-w-6xl">

        {/* FORM */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-black">Novo Usuário</h2>

          <form onSubmit={handleCreateUser} className="space-y-4">

            <div>
              <label className="text-sm text-gray-700">Nome completo</label>
              <input
                className="w-full border rounded-lg p-3 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20"
                placeholder="Ex: João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">E-mail corporativo</label>
              <input
                className="w-full border rounded-lg p-3 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20"
                placeholder="ex: nome@loc7.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Permissão de acesso</label>
              <select
                className="w-full border rounded-lg p-3 bg-white text-black focus:outline-none focus:ring-2 focus:ring-black/20"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option>Administrador</option>
                <option>Operador</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-700">Senha inicial</label>
              <input
                type="password"
                className="w-full border rounded-lg p-3 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20"
                placeholder="Digite uma senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">Confirmar senha</label>
              <input
                type="password"
                className="w-full border rounded-lg p-3 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20"
                placeholder="Repita a senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <p className="text-xs text-gray-400">
              A senha será utilizada quando o login real for ativado.
            </p>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">
              Criar Usuário
            </button>
          </form>
        </div>

        {/* LISTA */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-black">
            Usuários cadastrados
          </h2>

          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="border p-4 rounded-xl flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-black">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400">{user.role}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      user.active
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.active ? "Ativo" : "Inativo"}
                  </span>

                  <button
                    onClick={() => toggleUser(user)}
                    className="text-sm underline"
                  >
                    {user.active ? "Desativar" : "Reativar"}
                  </button>
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <p className="text-gray-400 text-sm">
                Nenhum usuário cadastrado ainda.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
