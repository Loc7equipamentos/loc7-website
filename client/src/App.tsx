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

function getPageSEO(location: string) {
  if (location === "/") {
    return {
      title:
        "Loc7 Equipamentos | Locação de equipamentos audiovisuais em São Paulo",
      description:
        "Locadora profissional de equipamentos audiovisuais em São Paulo. Câmeras, lentes, iluminação, áudio, broadcast e produção.",
    };
  }

  if (location === "/catalogo") {
    return {
      title: "Catálogo de Equipamentos | Loc7 Equipamentos",
      description:
        "Explore o catálogo profissional da Loc7 com equipamentos para cinema, broadcast, fotografia, iluminação e produção audiovisual.",
    };
  }

  if (location.startsWith("/catalogo/")) {
    return {
      title: "Equipamentos para Locação | Loc7 Equipamentos",
      description:
        "Equipamentos profissionais para locação audiovisual em São Paulo.",
    };
  }

  if (location === "/orcamento") {
    return {
      title: "Solicitar Orçamento | Loc7 Equipamentos",
      description:
        "Solicite um orçamento para locação de equipamentos audiovisuais profissionais.",
    };
  }

  if (location === "/cadastro-locacao") {
    return {
      title: "Cadastro para Locação | Loc7 Equipamentos",
      description:
        "Realize seu cadastro para locação de equipamentos audiovisuais na Loc7.",
    };
  }

  if (location.startsWith("/status-cadastro")) {
    return {
      title: "Status do Cadastro | Loc7 Equipamentos",
      description:
        "Acompanhe o status do seu cadastro de locação na Loc7 Equipamentos.",
    };
  }

  if (location === "/admin-login") {
    return {
      title: "Login Administrativo | Loc7",
      description: "Área administrativa interna da Loc7.",
    };
  }

  if (location.startsWith("/admin-panel")) {
    return {
      title: "Painel Administrativo | Loc7",
      description: "Painel interno administrativo da Loc7.",
    };
  }

  if (location.startsWith("/equipamentos/")) {
    return {
      title: document.title,
      description:
        "Equipamento audiovisual profissional disponível para locação na Loc7.",
    };
  }

  return {
    title: "Página não encontrada | Loc7 Equipamentos",
    description:
      "A página acessada não existe ou foi removida da Loc7 Equipamentos.",
  };
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

    const seo = getPageSEO(location);

    document.title = seo.title;

    let metaDescription = document.querySelector(
      'meta[name="description"]'
    );

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute("content", seo.description);
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
