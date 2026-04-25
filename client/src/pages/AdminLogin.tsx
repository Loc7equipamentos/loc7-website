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
    <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center px-4">
      
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-8">

        {/* HEADER */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-black">
            Admin Loc7
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            acesso restrito • operação interna
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@loc7.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-black 
              text-gray-900 placeholder-gray-400 bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* SENHA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-black 
              text-gray-900 placeholder-gray-400 bg-white"
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
            Entrar no painel
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-6 text-center text-xs text-gray-400">
          Sistema interno Loc7 • acesso monitorado
        </div>
      </div>
    </div>
  );
}
