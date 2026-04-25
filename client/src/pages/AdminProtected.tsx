import { useState, useEffect } from "react";
import { Lock, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";

import AdminDashboard from "./AdminDashboard";
import AdminCadastros from "./AdminCadastros";

type UserRole =
  | "owner"
  | "admin"
  | "registration_analyst"
  | "sales"
  | "product_manager";

export default function AdminProtected() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>("admin");

  const [location] = useLocation();

  const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const currentPage = location.startsWith("/admin-panel/cadastros")
    ? "cadastros"
    : "dashboard";

  useEffect(() => {
    if (!correctPassword) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    const savedAuth = localStorage.getItem("admin-auth");
    const savedRole =
      (localStorage.getItem("admin-role") as UserRole) || "admin";

    if (savedAuth === "true") {
      setIsAuthenticated(true);
      setUserRole(savedRole);
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, [correctPassword]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!correctPassword) {
      setError("Admin indisponível — senha não configurada");
      return;
    }

    if (!password.trim()) {
      setError("Digite a senha");
      return;
    }

    if (password === correctPassword) {
      localStorage.setItem("admin-auth", "true");
      localStorage.setItem("admin-role", "admin");
      setIsAuthenticated(true);
      setPassword("");
    } else {
      setError("Senha incorreta");
      setPassword("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    localStorage.removeItem("admin-role");
    window.location.href = "/";
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // SEM SENHA CONFIGURADA
  if (!correctPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="bg-red-900/20 border border-red-700 rounded-xl p-8 text-center text-red-200">
          <AlertTriangle className="mx-auto mb-4" />
          <h1 className="text-xl font-bold">Admin indisponível</h1>
          <p className="text-sm mt-2">
            Senha não configurada no ambiente
          </p>
        </div>
      </div>
    );
  }

  // LOGIN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <form
          onSubmit={handleLogin}
          className="bg-gray-900 p-8 rounded-xl w-full max-w-sm"
        >
          <div className="flex justify-center mb-6 text-white">
            <Lock />
          </div>

          <h1 className="text-white text-xl text-center mb-6">
            Painel Admin
          </h1>

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-white mb-4"
          />

          {error && (
            <div className="text-red-400 text-sm mb-3">{error}</div>
          )}

          <button className="w-full bg-white text-black p-3 rounded font-semibold">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  // ADMIN COM MENU
  return (
    <div className="min-h-screen bg-gray-100 text-black">
      
      {/* MENU SUPERIOR */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 flex justify-between items-center">
        
        <div className="flex gap-3">

          <button
            onClick={() => (window.location.href = "/admin-panel")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              currentPage === "dashboard"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Produtos
          </button>

          <button
            onClick={() =>
              (window.location.href = "/admin-panel/cadastros")
            }
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              currentPage === "cadastros"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Cadastros
          </button>

        </div>

        <button
          onClick={handleLogout}
          className="text-sm font-semibold text-gray-500 hover:text-black"
        >
          Sair
        </button>
      </div>

      {/* CONTEÚDO */}
      <div className="p-6">
        {currentPage === "cadastros" ? (
          <AdminCadastros onLogout={handleLogout} />
        ) : (
          <AdminDashboard onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}
