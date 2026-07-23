import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

type Props = {
  children: ReactNode;
};

const ADMIN_SESSION_KEY = "loc7_admin_session_confirmed";

export default function AdminProtected({ children }: Props) {
  const [location, setLocation] = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function redirectToLogin() {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);

      await supabase.auth.signOut();

      const redirectUrl = encodeURIComponent(window.location.pathname);
      window.location.href = `/admin-login?redirect=${redirectUrl}`;
    }

    async function check() {
      if (isMounted) {
        setChecking(true);
      }

      const loginConfirmed =
        sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";

      if (!loginConfirmed) {
        await redirectToLogin();
        return;
      }

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        await redirectToLogin();
        return;
      }

      const userEmail = user.email?.trim().toLowerCase();

      if (!userEmail) {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        await supabase.auth.signOut();
        alert("Acesso não autorizado.");
        window.location.href = "/";
        return;
      }

      const { data: adminUser, error } = await supabase
        .from("admin_users")
        .select("*")
        .ilike("email", userEmail)
        .single();

      if (error || !adminUser) {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        await supabase.auth.signOut();
        alert("Acesso não autorizado.");
        window.location.href = "/";
        return;
      }

      if (!adminUser.active) {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        await supabase.auth.signOut();
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

      if (
        path.startsWith("/admin-panel/cadastros") &&
        !isAdmin &&
        !isOperador
      ) {
        alert("Sem permissão para acessar cadastros.");
        setLocation("/admin-panel");
        return;
      }

      if (isMounted) {
        setChecking(false);
      }
    }

    check();

    return () => {
      isMounted = false;
    };
  }, [location, setLocation]);

  if (checking) {
    return null;
  }

  return <>{children}</>;
}
