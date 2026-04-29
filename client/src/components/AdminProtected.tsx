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
      setChecking(true);

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

      const role = String(adminUser.role || "").trim();
      const path = location;

      const isAdmin = role === "Administrador";
      const isOperador = role === "Operador";

      if (path.startsWith("/admin-panel/usuarios") && !isAdmin) {
        alert("Sem permissão para acessar usuários.");
        setLocation("/admin-panel");
        return;
      }

      if (path.startsWith("/admin-panel/produtos") && !isAdmin) {
        alert("Sem permissão para acessar produtos.");
        setLocation("/admin-panel");
        return;
      }

      if (path.startsWith("/admin-panel/cadastros") && !isAdmin && !isOperador) {
        alert("Sem permissão para acessar cadastros.");
        setLocation("/admin-panel");
        return;
      }

      setChecking(false);
    }

    check();
  }, [location, setLocation]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Carregando...
      </div>
    );
  }

  return <>{children}</>;
}
