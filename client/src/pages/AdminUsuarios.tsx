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
  const [role, setRole] = useState("Administrador");

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
      setPassword("");
      setConfirmPassword("");
      setRole("Administrador");
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
    <div className="min-h-screen bg-[#020617] px-12 py-14">

      {/* HEADLINE (EXATAMENTE COMO GEMINI) */}
      <div className="mb-10">
        <h1 className="text-4xl font-semibold text-white">
          Usuários do Sistema
        </h1>
        <p className="text-gray-400 mt-2">
          Controle de acessos e permissões
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8 max-w-6xl">

        {/* CARD ESQUERDA */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">

          <h2 className="text-xl font-semibold mb-6 text-black">
            Novo Usuário
          </h2>

          <form onSubmit={handleCreateUser} className="space-y-4">

            <div>
              <label className="text-sm text-gray-700">
                Nome completo
              </label>
              <input
                className="w-full mt-1 border rounded-lg p-3 bg-[#f9fafb] text-black placeholder-gray-400 focus:ring-2 focus:ring-black/20"
                placeholder="Ex: João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">
                E-mail corporativo
              </label>
              <input
                className="w-full mt-1 border rounded-lg p-3 bg-[#f9fafb] text-black placeholder-gray-400 focus:ring-2 focus:ring-black/20"
                placeholder="ex: nome@loc7.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">
                Permissão de acesso
              </label>
              <select
                className="w-full mt-1 border rounded-lg p-3 bg-[#f9fafb] text-black focus:ring-2 focus:ring-black/20"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option>Administrador</option>
                <option>Operador</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-700">
                Senha inicial
              </label>
              <input
                type="password"
                className="w-full mt-1 border rounded-lg p-3 bg-[#f9fafb] text-black"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-700">
                Confirmar senha
              </label>
              <input
                type="password"
                className="w-full mt-1 border rounded-lg p-3 bg-[#f9fafb] text-black"
                placeholder="••••••••"
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

        {/* CARD DIREITA */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">

          <h2 className="text-xl font-semibold mb-6 text-black">
            Usuários cadastrados
          </h2>

          {/* HEADER */}
          <div className="grid grid-cols-5 text-sm text-gray-500 mb-4 px-2">
            <span>Nome</span>
            <span>E-mail</span>
            <span>Permissão</span>
            <span>Status</span>
            <span>Ações</span>
          </div>

          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-5 items-center border-t pt-4"
              >
                <div>
                  <p className="font-medium text-black">{user.name}</p>
                  <p className="text-xs text-gray-400">
                    Profissional interno
                  </p>
                </div>

                <span className="text-sm text-black">{user.email}</span>

                <span className="text-sm text-black">{user.role}</span>

                <span
                  className={`text-xs px-3 py-1 rounded-full w-fit ${
                    user.active
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {user.active ? "Ativo" : "Inativo"}
                </span>

                <div className="flex gap-3 text-sm">
                  <button className="underline">Editar</button>
                  <button
                    onClick={() => toggleUser(user)}
                    className="underline"
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
