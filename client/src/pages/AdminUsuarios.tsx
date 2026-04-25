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

      const response = await fetch(
        "https://hmmxxvurfvrdvlkfbbah.supabase.co/functions/v1/create-admin-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Erro ao criar usuário");
        return;
      }

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      loadUsers();
    } catch {
      setError("Erro inesperado");
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
    const confirmDelete = confirm(`Excluir ${user.name}?`);
    if (!confirmDelete) return;

    try {
      setDeletingId(user.id);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;

      await fetch(
        "https://hmmxxvurfvrdvlkfbbah.supabase.co/functions/v1/delete-admin-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: user.id }),
        }
      );

      loadUsers();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] px-5 py-7 lg:px-10 lg:py-8">
      <div className="mx-auto w-full max-w-[1240px]">
        <header className="mb-6">
          <h1 className="text-[34px] font-extrabold text-white">
            Usuários do Sistema
          </h1>
          <p className="text-slate-400">
            Controle de acessos e permissões
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[390px_1fr]">
          
          {/* FORM */}
          <section className="bg-white p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">Novo Usuário</h2>

            <form onSubmit={handleCreateUser} className="space-y-3">

              <input
                className="w-full border p-2 rounded"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className="w-full border p-2 rounded"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <select
                className="w-full border p-2 rounded"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option>Administrador</option>
                <option>Operador</option>
              </select>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border p-2 rounded pr-10"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full border p-2 rounded pr-10"
                  placeholder="Confirmar senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button className="w-full bg-black text-white p-3 rounded">
                {saving ? "Criando..." : "Criar Usuário"}
              </button>
            </form>
          </section>

          {/* LISTA */}
          <section className="bg-white p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">Usuários cadastrados</h2>

            <div className="grid grid-cols-[1.3fr_2fr_1fr_0.7fr_1.8fr] font-bold text-sm mb-2">
              <span>Nome</span>
              <span>Email</span>
              <span>Permissão</span>
              <span>Status</span>
              <span>Ações</span>
            </div>

            {users.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-[1.3fr_2fr_1fr_0.7fr_1.8fr] py-3 border-b"
              >
                <span>{user.name}</span>
                <span>{user.email}</span>
                <span>{user.role}</span>
                <span>{user.active ? "Ativo" : "Inativo"}</span>

                <div className="flex gap-3">
                  <button>Editar</button>
                  <button onClick={() => toggleUser(user)}>
                    {user.active ? "Desativar" : "Reativar"}
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => deleteUser(user)}
                  >
                    {deletingId === user.id ? "..." : "Excluir"}
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
