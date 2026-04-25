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
    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        setLocation(`/admin-login?redirect=${encodeURIComponent(location)}`);
        return;
      }

      setChecking(false);
    }

    checkSession();
    // 🔥 NÃO depende de location
  }, []); 

  if (checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Carregando painel...
      </div>
    );
  }

  return <>{children}</>;
}
