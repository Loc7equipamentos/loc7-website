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

export default function App() {
  const [location] = useLocation();

  const isAdminRoute =
    location === "/admin-login" ||
    location === "/admin-panel" ||
    location.startsWith("/admin-panel/");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Switch>
        <Route path="/" component={Home} />
        <Route path="/catalogo" component={Catalogo} />
        <Route path="/catalogo/:category" component={Catalogo} />
        <Route path="/equipamentos/:slug" component={Produto} />
        <Route path="/orcamento" component={Orcamento} />

        <Route path="/admin-login" component={AdminLogin} />
        <Route path="/admin-panel" component={AdminDashboard} />
        <Route path="/admin-panel/cadastros" component={AdminCadastros} />
        <Route path="/admin-panel/usuarios" component={AdminUsuarios} />
      </Switch>

      {!isAdminRoute && <WhatsAppFloat />}
    </>
  );
}
