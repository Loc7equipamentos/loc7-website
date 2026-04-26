import { Route, Switch, useLocation } from "wouter";

import Navbar from "./components/Navbar";
import WhatsAppFloat from "./components/WhatsAppFloat";

import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Produto from "./pages/Produto";
import Orcamento from "./pages/Orcamento";
import CadastroPage from "./pages/Cadastro"; // ✅ CORRETO (Cadastro.tsx)

import AdminDashboard from "./pages/AdminDashboard";
import AdminCadastros from "./pages/AdminCadastros";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminLogin from "./pages/AdminLogin";
import AdminProtected from "./components/AdminProtected";

export default function App() {
  const [location] = useLocation();

  const isAdminRoute =
    location === "/admin-login" ||
    location.startsWith("/admin-panel");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Switch>
        {/* SITE */}
        <Route path="/" component={Home} />
        <Route path="/catalogo" component={Catalogo} />
        <Route path="/catalogo/:category" component={Catalogo} />
        <Route path="/equipamentos/:slug" component={Produto} />
        <Route path="/orcamento" component={Orcamento} />
        <Route path="/cadastro-locacao" component={CadastroPage} /> {/* ✅ NOVO */}

        {/* LOGIN */}
        <Route path="/admin-login" component={AdminLogin} />

        {/* 🔥 ORDEM CORRETA (ESPECÍFICAS PRIMEIRO) */}
        <Route path="/admin-panel/usuarios">
          <AdminProtected>
            <AdminUsuarios />
          </AdminProtected>
        </Route>

        <Route path="/admin-panel/cadastros">
          <AdminProtected>
            <AdminCadastros />
          </AdminProtected>
        </Route>

        <Route path="/admin-panel">
          <AdminProtected>
            <AdminDashboard />
          </AdminProtected>
        </Route>
      </Switch>

      {!isAdminRoute && <WhatsAppFloat />}
    </>
  );
}
