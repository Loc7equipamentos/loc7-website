import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";

const ADMIN_SESSION_KEY = "loc7_admin_session_confirmed";

export default function AdminLogin() {
  const initialRedirect =
    new URLSearchParams(window.location.search).get("redirect") || "/admin-panel";

  const [redirectPath] = useState(initialRedirect);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    supabase.auth.signOut();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    sessionStorage.removeItem(ADMIN_SESSION_KEY);

    const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

console.log("SUPABASE LOGIN:", error, data);

if (error || !data.session) {
  alert(error?.message || "Erro desconhecido");
  setError(error?.message || "E-mail ou senha inválidos.");
  setLoading(false);
  return;
}

    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    window.location.href = redirectPath;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl">
        <h1 className="mb-6 text-center text-2xl font-black tracking-tight text-black">
          Acesso Interno Loc7
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            className="w-full border rounded-lg px-4 py-2 text-black placeholder:text-gray-400 bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              className="w-full border rounded-lg px-4 py-2 pr-10 text-black placeholder:text-gray-400 bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="absolute right-3 top-2.5 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
