import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (
      email === import.meta.env.VITE_ADMIN_EMAIL &&
      password === import.meta.env.VITE_ADMIN_PASSWORD
    ) {
      localStorage.setItem("admin-auth", "true");
      localStorage.setItem("admin-role", "admin");
      setLocation("/admin-panel");
      return;
    }

    setErrorMsg("Credenciais inválidas");
  }

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center px-4">
      <div className="relative w-full max-w-[470px]">
        {/* placa cinza deslocada */}
        <div className="absolute -top-8 -left-8 h-full w-full rounded-2xl bg-gray-200/80 shadow-sm" />

        {/* card principal */}
        <div className="relative rounded-2xl border border-gray-200 bg-white px-10 py-9 shadow-xl">
          {/* topo */}
          <div className="mb-9 flex items-center justify-center gap-6">
            <img
              src="/logo-loc7.png"
              alt="Loc7 Equipamentos"
              className="h-12 w-auto object-contain"
            />

            <div className="h-12 w-px bg-gray-300" />

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-black">
                ACESSO INTERNO
              </h1>
              <p className="mt-1 text-sm font-medium text-gray-500">
                Controle Operacional Loc7
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-black">
                E-mail Corporativo
              </label>
              <input
                type="email"
                placeholder="nome@loc7.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-black placeholder:text-gray-400 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-black">
                Senha Operacional
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-base text-black placeholder:text-gray-400 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                  aria-label="Mostrar ou ocultar senha"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-black py-3 text-base font-semibold text-white transition hover:bg-gray-900"
            >
              Entrar
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-gray-500">
            © Loc7 Equipamentos • Sistema Interno
          </div>
        </div>
      </div>
    </div>
  );
}
