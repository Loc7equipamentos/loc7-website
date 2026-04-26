import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

type AdminProtectedProps = {
  children: React.ReactNode;
};

export default function AdminProtected({ children }: AdminProtectedProps) {
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        const currentPath = window.location.pathname + window.location.search;
        setLocation(`/admin-login?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }

      setLoading(false);
    }

    checkSession();
  }, [setLocation]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07101c]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
      </div>
    );
  }

  return <>{children}</>;
}
