import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";

import Navbar from "./components/Navbar";
import WhatsAppFloat from "./components/WhatsAppFloat";
import Footer from "./components/Footer";

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
import NotFound from "./pages/NotFound";

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

function setMetaDescription(content: string) {
  let tag = document.head.querySelector(
    'meta[name="description"]'
  ) as HTMLMetaElement | null;

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", "description");
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

function getPageTitle(location: string) {
  if (location === "/") {
    return "Loc7 Equipamentos | Locação de equipamentos audiovisuais em São Paulo";
  }

  if (location === "/catalogo") {
    return "Catálogo de Equipamentos | Loc7 Equipamentos";
  }

  if (location.startsWith("/catalogo/")) {
    return "Equipamentos para Locação | Loc7 Equipamentos";
  }

  if (location === "/orcamento") {
    return "Solicitar Orçamento | Loc7 Equipamentos";
  }

  if (location === "/cadastro-locacao") {
    return "Cadastro para Locação | Loc7 Equipamentos";
  }

  if (location.startsWith("/status-cadastro")) {
    return "Status do Cadastro | Loc7 Equipamentos";
  }

  if (location === "/admin-login") {
    return "Login Administrativo | Loc7";
  }

  if (location.startsWith("/admin-panel")) {
    return "Painel Administrativo | Loc7";
  }

  if (location.startsWith("/equipamentos/")) {
    return document.title;
  }

  return "Página não encontrada | Loc7 Equipamentos";
}

function getPageDescription(location: string) {
  if (location === "/") {
    return "Locação profissional de equipamentos audiovisuais em São Paulo para cinema, foto, broadcast e produções corporativas.";
  }

  if (location === "/catalogo") {
    return "Catálogo de equipamentos audiovisuais para locação: câmeras, lentes, iluminação, áudio, monitores, transmissão e acessórios profissionais.";
  }

  if (location.startsWith("/catalogo/")) {
    return "Equipamentos profissionais para locação em São Paulo com suporte técnico especializado para produções audiovisuais.";
  }

  if (location === "/orcamento") {
    return "Solicite orçamento para locação de equipamentos audiovisuais profissionais com atendimento especializado da Loc7.";
  }

  if (location === "/cadastro-locacao") {
    return "Cadastro para locação de equipamentos audiovisuais profissionais na Loc7.";
  }

  if (location.startsWith("/status-cadastro")) {
    return "Acompanhe o status do seu cadastro de locação na Loc7.";
  }

  if (location === "/admin-login" || location.startsWith("/admin-panel")) {
    return "Área administrativa interna da Loc7.";
  }

  return "A página acessada não foi encontrada. Continue navegando pelo catálogo de equipamentos audiovisuais da Loc7.";
}

export default function App() {
  const [location] = useLocation();

  const isAdminRoute =
    location === "/admin-login" || location.startsWith("/admin-panel");

  const isCleanRoute =
    location === "/cadastro-locacao" ||
    location.startsWith("/status-cadastro");

  const hasPublicNavbar = !isAdminRoute && !isCleanRoute;

  useEffect(() => {
    if (location.startsWith("/equipamentos/")) return;

    document.title = getPageTitle(location);
    setMetaDescription(getPageDescription(location));
  }, [location]);

  return (
    <>
      {hasPublicNavbar && <Navbar />}

      <div className={hasPublicNavbar ? "lg:pt-[150px]" : ""}>
        <Switch>
          {/* SITE */}
          <Route path="/" component={Home} />
          <Route path="/catalogo" component={Catalogo} />
          <Route path="/catalogo/:category" component={Catalogo} />
          <Route path="/equipamentos/:category/:slug" component={Produto} />
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

          {/* GLOBAL 404 */}
          <Route component={NotFound} />
        </Switch>
      </div>

      {hasPublicNavbar && <Footer />}
      {hasPublicNavbar && <WhatsAppFloat />}
    </>
  );
}
