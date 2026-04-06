/*
 * LOC 7 EQUIPAMENTOS — App Router
 * Cinema Noir Industrial style
 * All routes + global layout (Navbar + Footer + WhatsApp)
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import Home from "./pages/Home";
import Servicos from "./pages/Servicos";
import Contato from "./pages/Contato";
import Blog from "./pages/Blog";
import Portfolio from "./pages/Portfolio";
import Sobre from "./pages/Sobre";
import Cadastro from "./pages/Cadastro";
import Admin from "./pages/Admin";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[oklch(0.08_0_0)]">
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router>
            <Layout>
              <Route path="/" component={Home} />
              <Route path="/servicos" component={Servicos} />
              <Route path="/producao" component={Servicos} />
              <Route path="/blog" component={Blog} />
              <Route path="/portfolio" component={Portfolio} />
              <Route path="/sobre" component={Sobre} />
              <Route path="/contato" component={Contato} />
              <Route path="/cadastro" component={Cadastro} />
              <Route path="/admin" component={Admin} />
              <Route path="/404" component={NotFound} />
              <Route component={NotFound} />
            </Layout>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
