import { useState } from "react";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [, setLocation] = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    localStorage.setItem("loc7_admin_logged", "true");
    setLocation("/admin-panel");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      
      {/* FUNDO SUAVE (cinza corporativo) */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />

      {/* CARD */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            ACESSO INTERNO
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Controle Operacional Loc7
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          <div>
            <label className="text-sm text-gray-600">
              E-mail Corporativo
            </label>
            <input
              type="email"
              placeholder="ex: nome@loc7.com.br"
              className="w-full mt-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Senha Operacional
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Entrar
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © Loc7 Equipamentos • Sistema Interno
        </p>
      </div>
    </div>
  );
}
