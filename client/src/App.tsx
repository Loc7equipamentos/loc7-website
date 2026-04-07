/*
 * LOC 7 EQUIPAMENTOS — App Router
 * Cinema Noir Industrial style
 * All routes + global layout (Navbar + Footer + WhatsApp)
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

import AdminPanel from "./pages/AdminPanel";
import Produto from "./pages/Produto";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[oklch(0.08_0_0)]">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Layout><Home /></Layout>} />
      <Route path="/catalogo" component={() => <Layout><Catalogo /></Layout>} />
      <Route path="/catalogo/:category" component={() => <Layout><Catalogo /></Layout>} />
      <Route path="/equipamentos/:slug" component={() => <Layout><Produto /></Layout>} />
      <Route path="/orcamento" component={() => <Layout><Orcamento /></Layout>} />
      <Route path="/servicos" component={() => <Layout><Servicos /></Layout>} />
      <Route path="/producao" component={() => <Layout><Servicos /></Layout>} />
      <Route path="/blog" component={() => <Layout><Blog /></Layout>} />
      <Route path="/portfolio" component={() => <Layout><Portfolio /></Layout>} />
      <Route path="/sobre" component={() => <Layout><Sobre /></Layout>} />
      <Route path="/contato" component={() => <Layout><Contato /></Layout>} />
      <Route path="/cadastro" component={() => <Layout><Cadastro /></Layout>} />

      <Route path="/admin-panel" component={() => <AdminPanel />} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <ThemeProvider defaultTheme="dark">
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
