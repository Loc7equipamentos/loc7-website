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
        setLocation(`/admin-login?redirect=${encodeURIComponent(location)}`);
        return;
      }

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
