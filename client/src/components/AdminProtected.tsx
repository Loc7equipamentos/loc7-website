import { ReactNode, useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

type Props = {
  children: ReactNode;
};

const ADMIN_SESSION_KEY = "loc7_admin_session_confirmed";

export default function AdminProtected({ children }: Props) {
  const [location, setLocation] = useLocation();
  const [checking, setChecking] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function redirectToLogin() {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      await supabase.auth.signOut();

      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `/admin-login?redirect=${encodeURIComponent(currentPath)}`;
    }

    async function check() {
      if (isMounted) {
        setChecking(true);
      }

      const sessionConfirmed =
        sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";

      if (!sessionConfirmed) {
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
        .select("role, active")
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
        (path.startsWith("/admin-panel/cadastros") ||
          path.startsWith("/admin-panel/cadastro/")) &&
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

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);

    try {
      await supabase.auth.signOut();
    } finally {
      window.location.href = "/admin-login";
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07101c]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        aria-label="Sair do painel administrativo"
        title="Sair do painel administrativo"
        className="fixed right-4 top-4 z-[100] inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-md transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 md:right-6 md:top-6"
      >
        <LogOut size={17} aria-hidden="true" />
        <span>{loggingOut ? "Saindo..." : "Sair"}</span>
      </button>

      {children}
    </>
  );
}
