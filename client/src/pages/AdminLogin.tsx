import { useState } from "react";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [, setLocation] = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (
      email === import.meta.env.VITE_ADMIN_EMAIL &&
      password === import.meta.env.VITE_ADMIN_PASSWORD
    ) {
      localStorage.setItem("admin_auth", "true");
      setLocation("/admin-panel");
    } else {
      alert("Credenciais inválidas");
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center px-4">

      <div className="relative w-full max-w-md">

        {/* PLACA CINZA (fundo deslocado) */}
        <div className="absolute -top-6 -left-6 w-full h-full bg-gray-200 rounded-2xl" />

        {/* CARD PRINCIPAL */}
        <div className="relative bg-white border border-gray-200 rounded-2xl shadow-lg p-8">

          {/* HEADER */}
          <div className="text-center mb-6">
            <h1 className="text-lg tracking-widest font-semibold text-gray-900">
              ACESSO INTERNO
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Controle Operacional Loc7
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-700">
                E-mail Corporativo
              </label>
              <input
                type="email"
                placeholder="nome@loc7.com.br"
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg
                bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* SENHA */}
            <div>
              <label className="text-sm text-gray-700">
                Senha Operacional
              </label>
              <input
                type="password"
                placeholder="••••••"
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg
                bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* BOTÃO */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg
              font-medium hover:bg-gray-800 transition"
            >
              Entrar
            </button>
          </form>

          {/* FOOTER */}
          <div className="text-center text-xs text-gray-400 mt-6">
            © Loc7 • Sistema Interno
          </div>
        </div>

        {/* ÁREA DA LOGO (na placa cinza) */}
        <div className="absolute -top-10 left-4 text-gray-400 text-sm tracking-wide">
          Loc7 Equipamentos
        </div>

      </div>
    </div>
  );
}
