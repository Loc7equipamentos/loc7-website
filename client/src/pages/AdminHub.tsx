import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminHub() {
  const [, setLocation] = useLocation();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) return;

      const email = data.session.user.email;

      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("role")
        .eq("email", email)
        .single();

      if (adminUser) {
        setRole(adminUser.role);
      }
    }

    loadUser();
  }, []);

  const isAdmin = role === "Administrador";
  const isOperador = role === "Operador";

  return (
    <div className="min-h-screen bg-[#d6d7da] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 w-full max-w-3xl">

        <p className="text-xs text-gray-500 tracking-widest uppercase">
          LOC7 OPERAÇÕES
        </p>

        <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-6">
          Painel Administrativo
        </h1>

        <p className="text-gray-600 text-sm mb-8">
          Escolha o módulo que deseja acessar
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* CADASTROS → Admin + Operador */}
          {(isAdmin || isOperador) && (
            <button
              onClick={() => setLocation("/admin-panel/cadastros")}
              className="bg-white border border-gray-200 rounded-lg p-6 text-left hover:shadow-md transition"
            >
              <h2 className="font-semibold text-gray-900">Cadastros</h2>
              <p className="text-xs text-gray-500 mt-1">
                Clientes e análise de risco
              </p>
            </button>
          )}

          {/* PRODUTOS → só Admin */}
          {isAdmin && (
            <button
              onClick={() => setLocation("/admin-panel/produtos")}
              className="bg-white border border-gray-200 rounded-lg p-6 text-left hover:shadow-md transition"
            >
              <h2 className="font-semibold text-gray-900">Produtos</h2>
              <p className="text-xs text-gray-500 mt-1">
                Equipamentos e catálogo
              </p>
            </button>
          )}

          {/* USUÁRIOS → só Admin */}
          {isAdmin && (
            <button
              onClick={() => setLocation("/admin-panel/usuarios")}
              className="bg-white border border-gray-200 rounded-lg p-6 text-left hover:shadow-md transition"
            >
              <h2 className="font-semibold text-gray-900">Usuários</h2>
              <p className="text-xs text-gray-500 mt-1">
                Acessos e permissões
              </p>
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
