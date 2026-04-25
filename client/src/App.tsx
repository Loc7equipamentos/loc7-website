import { Route, Switch, useLocation } from "wouter";

import Navbar from "./components/Navbar";
import WhatsAppFloat from "./components/WhatsAppFloat";

// Páginas públicas
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Produto from "./pages/Produto";
import Orcamento from "./pages/Orcamento";

// Admin
import AdminDashboard from "./pages/AdminDashboard";
import Cadastros from "./pages/Cadastros";
import AdminLogin from "./pages/AdminLogin";
import AdminProtected from "./components/AdminProtected";

export default function App() {
  const [location] = useLocation();

  // 🔒 Detecta se é rota admin
  const isAdminRoute =
    location.startsWith("/admin-panel") ||
    location.startsWith("/admin-login");

  return (
    <>
      {/* Navbar só no site */}
      {!isAdminRoute && <Navbar />}

      <Switch>
        {/* SITE */}
        <Route path="/" component={Home} />
        <Route path="/catalogo" component={Catalogo} />
        <Route path="/catalogo/:category" component={Catalogo} />
        <Route path="/equipamentos/:slug" component={Produto} />
        <Route path="/orcamento" component={Orcamento} />

        {/* LOGIN ADMIN */}
        <Route path="/admin-login" component={AdminLogin} />

        {/* ADMIN PROTEGIDO */}
        <Route path="/admin-panel">
          <AdminProtected>
            <AdminDashboard />
          </AdminProtected>
        </Route>

        <Route path="/admin-panel/cadastros">
          <AdminProtected>
            <Cadastros />
          </AdminProtected>
        </Route>
      </Switch>

      {/* WhatsApp só no site */}
      {!isAdminRoute && <WhatsAppFloat />}
    </>
  );
}
