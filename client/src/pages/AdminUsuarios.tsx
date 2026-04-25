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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

    if (password.length < 6) {
      setError("Senha muito curta. Use no mínimo 6 caracteres.");
      return;
    }

    try {
      setSaving(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;

      if (!token) {
        setError("Usuário não autenticado. Faça login novamente.");
        return;
      }

      const response = await fetch(
        "https://hmmxxvurfvrdvlkfbbah.supabase.co/functions/v1/create-admin-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            role,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result?.error || "Erro ao criar usuário.");
        return;
      }

      setName("");
      setEmail("");
      setRole("Administrador");
      setPassword("");
      setConfirmPassword("");

      await loadUsers();
    } catch {
      setError("Erro inesperado ao criar usuário.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleUser(user: User) {
    await supabase
      .from("admin_users")
      .update({ active: !user.active })
      .eq("id", user.id);

    loadUsers();
  }

  async function deleteUser(user: User) {
    setError("");

    const confirmed = window.confirm(
      `Excluir definitivamente o usuário ${user.name}?\n\nIsso remove o usuário do Supabase Auth e da tabela admin_users.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(user.id);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;

      if (!token) {
        setError("Usuário não autenticado. Faça login novamente.");
        return;
      }

      if (session.user?.email === user.email) {
        setError("Você não pode excluir o próprio usuário logado.");
        return;
      }

      const response = await fetch(
        "https://hmmxxvurfvrdvlkfbbah.supabase.co/functions/v1/delete-admin-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: user.id,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result?.error || "Erro ao excluir usuário.");
        return;
      }

      await loadUsers();
    } catch {
      setError("Erro inesperado ao excluir usuário.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] px-5 py-7 lg:px-10 lg:py-8">
      <div className="mx-auto w-full max-w-[1240px]">
        <header className="mb-6">
          <h1 className="text-[34px] leading-tight font-extrabold tracking-[-0.03em] text-white lg:text-[42px]">
            Usuários do Sistema
          </h1>
          <p className="mt-1 text-base text-slate-400">
            Controle de acessos e permissões
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[390px_1fr]">
          <section className="rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-5 text-[24px] font-extrabold tracking-[-0.02em] text-black">
              Novo Usuário
            </h2>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-black">
                  Nome completo
                </label>
                <input
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/20"
                  placeholder="Ex: João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-black">
                  E-mail corporativo
                </label>
                <input
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/20"
                  placeholder="ex: nome@loc7.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-black">
                  Permissão de acesso
                </label>
                <select
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-black focus:outline-none focus:ring-2 focus:ring-black/20"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option>Administrador</option>
                  <option>Operador</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-black">
                  Senha inicial
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/20"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-black"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-black">
                  Confirmar senha
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black/20"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-black"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                A senha será criada no Supabase Auth e vinculada ao usuário.
              </p>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                disabled={saving}
                className="h-12 w-full rounded-md bg-black font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Criando..." : "Criar Usuário"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-5 text-[24px] font-extrabold tracking-[-0.02em] text-black">
              Usuários cadastrados
            </h2>

            <div className="hidden rounded-md bg-slate-100 px-5 py-3 text-sm font-bold text-black lg:grid lg:grid-cols-[1.4fr_2fr_1.15fr_0.75fr_1.15fr]">
              <span>Nome</span>
              <span>E-mail</span>
              <span>Permissão</span>
              <span>Status</span>
              <span>Ações</span>
            </div>

            <div className="mt-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="grid gap-3 border-b border-slate-200 py-4 text-black lg:grid-cols-[1.4fr_2fr_1.15fr_0.75fr_1.15fr] lg:items-center"
                >
                  <div>
                    <p className="font-bold text-black">{user.name}</p>
                    <p className="text-xs text-slate-500">
                      Profissional interno
                    </p>
                  </div>

                  <p className="break-all text-sm text-black">{user.email}</p>

                  <p className="text-sm text-black">{user.role}</p>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                      user.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.active ? "Ativo" : "Inativo"}
                  </span>

                  <div className="flex gap-3 text-sm text-black">
                    <button className="underline">Editar</button>
                    <button
                      onClick={() => toggleUser(user)}
                      className="underline"
                    >
                      {user.active ? "Desativar" : "Reativar"}
                    </button>
                    <button
                      onClick={() => deleteUser(user)}
                      disabled={deletingId === user.id}
                      className="text-red-600 underline disabled:opacity-50"
                    >
                      {deletingId === user.id ? "Excluindo..." : "Excluir"}
                    </button>
                  </div>
                </div>
              ))}

              {users.length === 0 && (
                <p className="text-sm text-slate-500">
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
