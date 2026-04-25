import { useState, useEffect } from "react";
import { Lock, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";

import AdminDashboard from "./AdminDashboard";
import AdminCadastros from "./AdminCadastros";

export default function AdminProtected() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [location] = useLocation();

  const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const currentPage = location.startsWith("/admin-panel/cadastros")
    ? "cadastros"
    : "dashboard";

  useEffect(() => {
    const savedAuth = localStorage.getItem("admin-auth");

    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === correctPassword) {
      localStorage.setItem("admin-auth", "true");
      setIsAuthenticated(true);
    } else {
      setError("Senha incorreta");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    window.location.href = "/";
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  // LOGIN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <form className="bg-white p-8 rounded-xl shadow w-full max-w-sm">
          <div className="flex justify-center mb-6 text-gray-700">
            <Lock />
          </div>

          <h1 className="text-xl text-center mb-6 font-semibold">
            Painel Admin
          </h1>

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded border mb-4"
          />

          {error && (
            <div className="text-red-500 text-sm mb-3">{error}</div>
          )}

          <button className="w-full bg-black text-white p-3 rounded font-semibold">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  // ADMIN
  return (
    <div className="min-h-screen bg-gray-100 text-black">
      
      {/* MENU */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 flex justify-between items-center">
        
        <div className="flex gap-3">

          <button
            onClick={() => (window.location.href = "/admin-panel")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentPage === "dashboard"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Produtos
          </button>

          <button
            onClick={() =>
              (window.location.href = "/admin-panel/cadastros")
            }
            className={`px-4 py-2 rounded-lg font-semibold ${
              currentPage === "cadastros"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Cadastros
          </button>

        </div>

        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-black"
        >
          Sair
        </button>
      </div>

      {/* CONTEÚDO */}
      <div className="p-6">
        {currentPage === "cadastros" ? (
          <AdminCadastros />
        ) : (
          <AdminDashboard />
        )}
      </div>
    </div>
  );
}
