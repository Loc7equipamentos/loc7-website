import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";

import Navbar from "./components/Navbar";
import WhatsAppFloat from "./components/WhatsAppFloat";
import Footer from "./components/Footer"; // ← ADICIONADO

import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Produto from "./pages/Produto";
import Orcamento from "./pages/Orcamento";
import CadastroPage from "./pages/Cadastro";
import StatusCadastro from "./pages/StatusCadastro";

import AdminDashboard from "./pages/AdminDashboard";
import AdminCadastros from "./pages/AdminCadastros";
import AdminCadastroFicha from "./pages/AdminCadastroFicha";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminLogin from "./pages/AdminLogin";
import AdminHub from "./pages/AdminHub";

import AdminProtected from "./components/AdminProtected";

function AdminPanelRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/admin-panel/cadastros");
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
      Redirecionando para o painel de cadastros...
    </div>
  );
}

export default function App() {
  const [location] = useLocation();

  const isAdminRoute =
    location === "/admin-login" || location.startsWith("/admin-panel");

  const isCleanRoute =
    location === "/cadastro-locacao" ||
    location.startsWith("/status-cadastro");

  const hasPublicNavbar = !isAdminRoute && !isCleanRoute;

  return (
    <>
      {hasPublicNavbar && <Navbar />}

      <div className={hasPublicNavbar ? "lg:pt-[150px]" : ""}>
        <Switch>
          {/* SITE */}
          <Route path="/" component={Home} />
          <Route path="/catalogo" component={Catalogo} />
          <Route path="/catalogo/:category" component={Catalogo} />
          <Route path="/equipamentos/:slug" component={Produto} />
          <Route path="/orcamento" component={Orcamento} />
          <Route path="/cadastro-locacao" component={CadastroPage} />
          <Route path="/status-cadastro/:id" component={StatusCadastro} />

          {/* LOGIN */}
          <Route path="/admin-login" component={AdminLogin} />

          {/* ADMIN */}
          <Route path="/admin-panel/usuarios">
            <AdminProtected>
              <AdminUsuarios />
            </AdminProtected>
          </Route>

          <Route path="/admin-panel/produtos">
            <AdminProtected>
              <AdminDashboard />
            </AdminProtected>
          </Route>

          <Route path="/admin-panel/cadastros">
            <AdminProtected>
              <AdminCadastros />
            </AdminProtected>
          </Route>

          <Route path="/admin-panel/cadastro/:id">
            <AdminProtected>
              <AdminCadastroFicha />
            </AdminProtected>
          </Route>

          <Route path="/admin-panel">
            <AdminProtected>
              <AdminHub />
            </AdminProtected>
          </Route>
        </Switch>
      </div>

      {/* FOOTER ADICIONADO */}
      {hasPublicNavbar && <Footer />}

      {hasPublicNavbar && <WhatsAppFloat />}
    </>
  );
}
