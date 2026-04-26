import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, Trash2 } from "lucide-react";

type AdminUser = {
  id: string;
  email: string;
  full_name?: string | null;
  role: "admin" | "operador" | string;
  is_active: boolean;
  created_at?: string;
};

export default function AdminUsuarios() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "operador",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);

    const { data } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setUsers(data);

    setLoading(false);
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);

    const { error } = await supabase.from("admin_users").insert([
      {
        email: form.email,
        full_name: form.full_name,
        role: form.role,
        is_active: true,
      },
    ]);

    if (!error) {
      setForm({
        full_name: "",
        email: "",
        password: "",
        role: "operador",
      });
      fetchUsers();
    }

    setSaving(false);
  }

  async function handleToggleStatus(user: AdminUser) {
    await supabase
      .from("admin_users")
      .update({ is_active: !user.is_active })
      .eq("id", user.id);

    fetchUsers();
  }

  async function handleDelete(user: AdminUser) {
    if (!confirm("Deseja excluir este usuário?")) return;

    await supabase.from("admin_users").delete().eq("id", user.id);

    fetchUsers();
  }

  return (
    <div className="min-h-screen bg-[#020617] px-10 py-14 text-white">
      
      {/* 🔥 TÍTULO — ÚNICA ALTERAÇÃO FOI AQUI */}
      <div className="mb-12">
        <h1 className="text-[56px] font-semibold text-white leading-tight">
          Usuários do Sistema
        </h1>
        <p className="text-gray-400 mt-2">
          Controle de acessos e permissões
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        
        {/* CARD ESQUERDA */}
        <div className="bg-white rounded-2xl p-6 text-black">
          <h2 className="text-xl font-semibold mb-4">
            Novo Usuário
          </h2>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <input
              type="text"
              placeholder="Nome completo"
              className="w-full border rounded-lg px-4 py-2"
              value={form.full_name}
              onChange={(e) =>
                setForm({ ...form, full_name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="E-mail corporativo"
              className="w-full border rounded-lg px-4 py-2"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                className="w-full border rounded-lg px-4 py-2 pr-10"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <button
                type="button"
                className="absolute right-3 top-2.5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <select
              className="w-full border rounded-lg px-4 py-2"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="admin">Administrador</option>
              <option value="operador">Operador</option>
            </select>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-black text-white py-2 rounded-lg"
            >
              {saving ? "Criando..." : "Criar Usuário"}
            </button>
          </form>
        </div>

        {/* CARD DIREITA */}
        <div className="bg-white rounded-2xl p-6 text-black">
          <h2 className="text-xl font-semibold mb-4">
            Usuários cadastrados
          </h2>

          <div className="grid grid-cols-5 text-sm font-semibold text-gray-500 border-b pb-2">
            <div>Nome</div>
            <div>E-mail</div>
            <div>Permissão</div>
            <div>Status</div>
            <div className="text-right">Ações</div>
          </div>

          {users.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-5 items-center text-sm py-4 border-b"
            >
              <div>
                {user.full_name || "Sem nome"}
              </div>

              <div>{user.email}</div>

              <div className="capitalize">{user.role}</div>

              <div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    user.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {user.is_active ? "Ativo" : "Inativo"}
                </span>
              </div>

              <div className="flex justify-end items-center gap-4">
                <button
                  onClick={() => handleToggleStatus(user)}
                  className="text-sm underline"
                >
                  {user.is_active ? "Desativar" : "Reativar"}
                </button>

                <button
                  onClick={() => handleDelete(user)}
                  className="text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
