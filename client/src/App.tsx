```tsx
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

const SITE_URL = "https://loc7-website-iota.vercel.app";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-loc7.jpg?v=1`;

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
  const noIndexRoutes =
    location === "/admin-login" ||
    location.startsWith("/admin-panel") ||
    location === "/cadastro-locacao" ||
    location.startsWith("/status-cadastro");

  const robots = noIndexRoutes
    ? "noindex,nofollow"
    : "index,follow";

  if (location === "/") {
    return {
      title:
        "Loc7 Equipamentos | Locação de equipamentos audiovisuais em São Paulo",
      description:
        "Locadora profissional de equipamentos audiovisuais em São Paulo. Câmeras, lentes, iluminação, áudio, broadcast e produção.",
      robots,
    };
  }

  if (location === "/catalogo") {
    return {
      title: "Catálogo de Equipamentos | Loc7 Equipamentos",
      description:
        "Explore o catálogo profissional da Loc7 com equipamentos para cinema, broadcast, fotografia, iluminação e produção audiovisual.",
      robots,
    };
  }

  if (location.startsWith("/catalogo/")) {
    return {
      title: "Equipamentos para Locação | Loc7 Equipamentos",
      description:
        "Equipamentos profissionais para locação audiovisual em São Paulo.",
      robots,
    };
  }

  if (location === "/orcamento") {
    return {
      title: "Solicitar Orçamento | Loc7 Equipamentos",
      description:
        "Solicite um orçamento para locação de equipamentos audiovisuais profissionais.",
      robots,
    };
  }

  if (location === "/cadastro-locacao") {
    return {
      title: "Cadastro para Locação | Loc7 Equipamentos",
      description:
        "Realize seu cadastro para locação de equipamentos audiovisuais na Loc7.",
      robots,
    };
  }

  if (location.startsWith("/status-cadastro")) {
    return {
      title: "Status do Cadastro | Loc7 Equipamentos",
      description:
        "Acompanhe o status do seu cadastro de locação na Loc7 Equipamentos.",
      robots,
    };
  }

  if (location === "/admin-login") {
    return {
      title: "Login Administrativo | Loc7",
      description: "Área administrativa interna da Loc7.",
      robots,
    };
  }

  if (location.startsWith("/admin-panel")) {
    return {
      title: "Painel Administrativo | Loc7",
      description: "Painel interno administrativo da Loc7.",
      robots,
    };
  }

  if (location.startsWith("/equipamentos/")) {
    return {
      title: document.title,
      description:
        "Equipamento audiovisual profissional disponível para locação na Loc7.",
      robots,
    };
  }

  return {
    title: "Página não encontrada | Loc7 Equipamentos",
    description:
      "A página acessada não existe ou foi removida da Loc7 Equipamentos.",
    robots: "noindex,nofollow",
  };
}

function updateMetaProperty(
  selector: string,
  attribute: string,
  value: string
) {
  let tag = document.querySelector(selector);

  if (!tag) {
    tag = document.createElement("meta");

    const match = selector.match(/"(.*)"/);

    if (match?.[1]) {
      tag.setAttribute(attribute, match[1]);
    }

    document.head.appendChild(tag);
  }

  tag.setAttribute("content", value);
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

    let robotsMeta = document.querySelector(
      'meta[name="robots"]'
    );

    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.setAttribute("name", "robots");
      document.head.appendChild(robotsMeta);
    }

    robotsMeta.setAttribute("content", seo.robots);

    const canonicalUrl = `${SITE_URL}${location}`;

    let canonical = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute("href", canonicalUrl);

    updateMetaProperty(
      'meta[property="og:title"]',
      "property",
      seo.title
    );

    updateMetaProperty(
      'meta[property="og:description"]',
      "property",
      seo.description
    );

    updateMetaProperty(
      'meta[property="og:type"]',
      "property",
      "website"
    );

    updateMetaProperty(
      'meta[property="og:url"]',
      "property",
      canonicalUrl
    );

    updateMetaProperty(
      'meta[property="og:image"]',
      "property",
      DEFAULT_OG_IMAGE
    );

    updateMetaProperty(
      'meta[name="twitter:card"]',
      "name",
      "summary_large_image"
    );

    updateMetaProperty(
      'meta[name="twitter:title"]',
      "name",
      seo.title
    );

    updateMetaProperty(
      'meta[name="twitter:description"]',
      "name",
      seo.description
    );

    updateMetaProperty(
      'meta[name="twitter:image"]',
      "name",
      DEFAULT_OG_IMAGE
    );
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
```
