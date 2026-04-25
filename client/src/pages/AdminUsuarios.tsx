import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  async function loadUsers() {
    const { data } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });

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
      return;
    }

    setName("");
    setEmail("");
    setRole("Administrador");
    setPassword("");
    setConfirmPassword("");
    loadUsers();
  }

  async function toggleUser(user: User) {
    await supabase
      .from("admin_users")
      .update({ active: !user.active })
      .eq("id", user.id);

    loadUsers();
  }

  return (
    <div className="min-h-screen bg-[#020617] px-5 py-7 lg:px-10 lg:py-8">
      <div className="mx-auto w-full max-w-[1240px]">
        <header className="mb-6">
          <h1 className="text-[34px] lg:text-[42px] font-extrabold text-white">
            Usuários do Sistema
          </h1>
          <p className="text-slate-400">
            Controle de acessos e permissões
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[390px_1fr]">
          {/* FORM */}
          <section className="rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-5 text-[24px] font-extrabold text-black">
              Novo Usuário
            </h2>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-black">
                  Nome completo
                </label>
                <input
                  className="h-11 w-full rounded-md border px-3"
                  placeholder="Ex: João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-black">
                  E-mail corporativo
                </label>
                <input
                  className="h-11 w-full rounded-md border px-3"
                  placeholder="ex: nome@loc7.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-black">
                  Permissão de acesso
                </label>
                <select
                  className="h-11 w-full rounded-md border px-3"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option>Administrador</option>
                  <option>Operador</option>
                </select>
              </div>

              {/* SENHA */}
              <div className="relative">
                <label className="text-sm font-semibold text-black">
                  Senha inicial
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="h-11 w-full rounded-md border px-3 pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* CONFIRMAR */}
              <div className="relative">
                <label className="text-sm font-semibold text-black">
                  Confirmar senha
                </label>
                <input
                  type={showConfirm ? "text" : "password"}
                  className="h-11 w-full rounded-md border px-3 pr-10"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <p className="text-xs text-slate-500">
                A senha será utilizada quando o login real for ativado.
              </p>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button className="h-12 w-full bg-black text-white rounded-md font-bold">
                Criar Usuário
              </button>
            </form>
          </section>

          {/* LISTA */}
          <section className="rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-5 text-[24px] font-extrabold text-black">
              Usuários cadastrados
            </h2>

            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center border-b pb-3"
                >
                  <div>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        user.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
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
                <p className="text-sm text-gray-500">
                  Nenhum usuário cadastrado ainda.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
