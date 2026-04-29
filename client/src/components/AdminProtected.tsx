import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

type Props = {
  children: ReactNode;
};

export default function AdminProtected({ children }: Props) {
  const [, setLocation] = useLocation();
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

      // 🔍 Verifica na tabela admin_users
      const { data: adminUser, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", userEmail)
        .single();

      if (error || !adminUser) {
        // ❌ Usuário não autorizado
        alert("Acesso não autorizado.");
        window.location.href = "/";
        return;
      }

      if (!adminUser.active) {
        // ❌ Usuário desativado
        alert("Usuário inativo.");
        window.location.href = "/";
        return;
      }

      // ✅ Tudo ok
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
