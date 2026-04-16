import { Route, Switch, useLocation } from "wouter";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Produto from "./pages/Produto";
import Orcamento from "./pages/Orcamento";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

import Navbar from "./components/Navbar";
import { CartProvider } from "./contexts/CartContext";

const ADMIN_PASSWORD = "loc7admin2026";
const ADMIN_SESSION_KEY = "loc7_admin_authenticated";

function AdminProtectedRoute() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedAuth = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      setIsAuthenticated(true);
      setError("");
      return;
    }

    setError("Senha incorreta.");
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
    setPassword("");
    setError("");
    setLocation("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md border border-[oklch(0.18_0_0)] bg-[oklch(0.08_0_0)] rounded-2xl p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold mb-2">Acesso ao Painel</h1>
            <p className="text-sm text-gray-400">
              Digite a senha para acessar o admin da Loc7.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                className="w-full px-4 py-3 rounded-lg bg-black border border-[oklch(0.18_0_0)] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            {error && (
              <div className="text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-4 py-3 rounded-lg bg-white text-black font-semibold hover:opacity-90 transition"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="text-white text-sm font-medium">
            Painel protegido
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:opacity-90 transition"
          >
            Sair
          </button>
        </div>
      </div>

      <AdminDashboard />
    </div>
  );
}

export default function App() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin-panel");

  return (
    <CartProvider>
      {!isAdmin && <Navbar />}

      <Switch>
        <Route path="/" component={Home} />
        <Route path="/catalogo" component={Catalogo} />
        <Route path="/catalogo/:category" component={Catalogo} />
        <Route path="/equipamentos/:slug" component={Produto} />
        <Route path="/orcamento" component={Orcamento} />
        <Route path="/admin-panel" component={AdminProtectedRoute} />
        <Route component={NotFound} />
      </Switch>
    </CartProvider>
  );
}
