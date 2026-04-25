import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

type AdminProtectedProps = {
  children: ReactNode;
};

export default function AdminProtected({ children }: AdminProtectedProps) {
  const [location, setLocation] = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!data.session) {
        const redirectTo = encodeURIComponent(location);
        setLocation(`/admin-login?redirect=${redirectTo}`);
        return;
      }

      setChecking(false);
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, [location, setLocation]);

  if (checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Carregando painel...
      </div>
    );
  }

  return <>{children}</>;
}
