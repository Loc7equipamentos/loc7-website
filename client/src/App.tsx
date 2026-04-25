import { Route, Switch, useLocation } from "wouter";

import Navbar from "./components/Navbar";
import WhatsAppFloat from "./components/WhatsAppFloat";

import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Produto from "./pages/Produto";
import Orcamento from "./pages/Orcamento";

import AdminDashboard from "./pages/AdminDashboard";
import AdminCadastros from "./pages/AdminCadastros";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminLogin from "./pages/AdminLogin";
import AdminProtected from "./components/AdminProtected";

function AdminRouter() {
  const [location] = useLocation();

  if (location === "/admin-panel/usuarios") {
    return (
      <AdminProtected>
        <AdminUsuarios />
      </AdminProtected>
    );
  }

  if (location === "/admin-panel/cadastros") {
    return (
      <AdminProtected>
        <AdminCadastros />
      </AdminProtected>
    );
  }

  return (
    <AdminProtected>
      <AdminDashboard />
    </AdminProtected>
  );
}

export default function App() {
  const [location] = useLocation();

  const isAdminRoute =
    location === "/admin-login" ||
    location === "/admin-panel" ||
    location.startsWith("/admin-panel/");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      {location.startsWith("/admin-panel") ? (
        <AdminRouter />
      ) : (
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/catalogo" component={Catalogo} />
          <Route path="/catalogo/:category" component={Catalogo} />
          <Route path="/equipamentos/:slug" component={Produto} />
          <Route path="/orcamento" component={Orcamento} />
          <Route path="/admin-login" component={AdminLogin} />
        </Switch>
      )}

      {!isAdminRoute && <WhatsAppFloat />}
    </>
  );
}
