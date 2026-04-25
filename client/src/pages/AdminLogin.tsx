import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const [, setLocation] = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError("E-mail ou senha inválidos.");
        return;
      }

      const { data: adminUser, error: userError } = await supabase
        .from("admin_users")
        .select("id, email, role, active")
        .eq("email", email.trim())
        .single();

      if (userError || !adminUser) {
        await supabase.auth.signOut();
        setError("Usuário sem permissão administrativa.");
        return;
      }

      if (!adminUser.active) {
        await supabase.auth.signOut();
        setError("Usuário inativo. Fale com o administrador.");
        return;
      }

      localStorage.setItem("loc7_admin_logged", "true");
      localStorage.setItem("loc7_admin_email", adminUser.email);
      localStorage.setItem("loc7_admin_role", adminUser.role);

      setLocation("/admin-panel");
    } catch {
      setError("Erro ao entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            ACESSO INTERNO
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Controle Operacional Loc7
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">
              E-mail Corporativo
            </label>
            <input
              type="email"
              placeholder="ex: nome@loc7.com.br"
              className="w-full mt-1 border border-gray-300 rounded-lg p-3 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-600">
                Senha Operacional
              </label>

              <button
                type="button"
                className="text-xs text-gray-500 hover:text-black transition"
                onClick={() => alert("Fluxo de recuperação será implementado")}
              >
                Esqueci a senha
              </button>
            </div>

            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg p-3 pr-10 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          © Loc7 Equipamentos • Sistema Interno
        </p>
      </div>
    </div>
  );
}
