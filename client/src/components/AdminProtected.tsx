import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

export default function AdminProtected({
  children,
}: {
  children: React.ReactNode;
}) {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLocation("/admin-login");
        return;
      }

      const { data } = await supabase
        .from("admin_users")
        .select("active")
        .eq("email", user.email)
        .single();

      if (!data || !data.active) {
        await supabase.auth.signOut();
        setLocation("/admin-login");
        return;
      }

      setLoading(false);
    }

    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Verificando acesso...
      </div>
    );
  }

  return <>{children}</>;
}
