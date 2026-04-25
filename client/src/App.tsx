/*
 * LOC 7 EQUIPAMENTOS — App Router
 * Cinema Noir Industrial style
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";

import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Orcamento from "./pages/Orcamento";
import Servicos from "./pages/Servicos";
import Contato from "./pages/Contato";
import Blog from "./pages/Blog";
import Portfolio from "./pages/Portfolio";
import Sobre from "./pages/Sobre";
import Cadastro from "./pages/Cadastro";
import RegistrationStatus from "./pages/RegistrationStatus";

import AdminProtected from "./pages/AdminProtected";
import Produto from "./pages/Produto";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[oklch(0.08_0_0)]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* ADMIN — rotas específicas antes das públicas */}
      <Route path="/admin-panel/cadastros">
        <AdminProtected />
      </Route>

      <Route path="/admin-panel">
        <AdminProtected />
      </Route>

      {/* SITE */}
      <Route path="/">
        <Layout>
          <Home />
        </Layout>
      </Route>

      <Route path="/catalogo">
        <Layout>
          <Catalogo />
        </Layout>
      </Route>

      <Route path="/catalogo/:category">
        <Layout>
          <Catalogo />
        </Layout>
      </Route>

      <Route path="/equipamentos/:slug">
        <Layout>
          <Produto />
        </Layout>
      </Route>

      <Route path="/orcamento">
        <Layout>
          <Orcamento />
        </Layout>
      </Route>

      <Route path="/servicos">
        <Layout>
          <Servicos />
        </Layout>
      </Route>

      <Route path="/producao">
        <Layout>
          <Servicos />
        </Layout>
      </Route>

      <Route path="/blog">
        <Layout>
          <Blog />
        </Layout>
      </Route>

      <Route path="/portfolio">
        <Layout>
          <Portfolio />
        </Layout>
      </Route>

      <Route path="/sobre">
        <Layout>
          <Sobre />
        </Layout>
      </Route>

      <Route path="/contato">
        <Layout>
          <Contato />
        </Layout>
      </Route>

      <Route path="/cadastro">
        <Layout>
          <Cadastro />
        </Layout>
      </Route>

      <Route path="/status-cadastro">
        <Layout>
          <RegistrationStatus />
        </Layout>
      </Route>

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <ThemeProvider defaultTheme="light" switchable={false}>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </CartProvider>
    </ErrorBoundary>
  );
}

export default App;
