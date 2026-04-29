import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

type Props = {
  children: ReactNode;
};

export default function AdminProtected({ children }: Props) {
  const [location, setLocation] = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        const redirectUrl = encodeURIComponent(window.location.pathname);
        window.location.href = `/admin-login?redirect=${redirectUrl}`;
        return;
      }

      const userEmail = data.session.user.email;

      const { data: adminUser, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", userEmail)
        .single();

      if (error || !adminUser) {
        alert("Acesso não autorizado.");
        window.location.href = "/";
        return;
      }

      if (!adminUser.active) {
        alert("Usuário inativo.");
        window.location.href = "/";
        return;
      }

      const role = adminUser.role;

      const path = window.location.pathname;

      // 🔒 CONTROLE DE PERMISSÃO

      // Usuários → só Administrador
      if (path.includes("/admin-panel/usuarios")) {
        if (role !== "Administrador") {
          alert("Sem permissão para acessar usuários.");
          window.location.href = "/admin-panel";
          return;
        }
      }

      // Produtos → só Administrador
      if (path.includes("/admin-panel/produtos")) {
        if (role !== "Administrador") {
          alert("Sem permissão para acessar produtos.");
          window.location.href = "/admin-panel";
          return;
        }
      }

      // Cadastros → Admin + Operador (liberado)

      setChecking(false);
    }

    check();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Carregando...
      </div>
    );
  }

  return <>{children}</>;
}
