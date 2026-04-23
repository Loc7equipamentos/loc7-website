import { Route, Switch, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

// Páginas
import Home from "@/pages/Home";
import Catalogo from "@/pages/Catalogo";
import Produto from "@/pages/Produto";
import Orcamento from "@/pages/Orcamento";
import Producao from "@/pages/Producao";
import AdminDashboard from "@/pages/AdminDashboard";

export default function App() {
  const [location] = useLocation();

  const isAdmin = location.startsWith("/admin-panel");

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR (fora do admin) */}
      {!isAdmin && <Navbar />}

      {/* CONTEÚDO */}
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/catalogo" component={Catalogo} />
          <Route path="/catalogo/:category" component={Catalogo} />
          <Route path="/equipamentos/:slug" component={Produto} />
          <Route path="/orcamento" component={Orcamento} />
          <Route path="/producao" component={Producao} />
          <Route path="/admin-panel" component={AdminDashboard} />
        </Switch>
      </main>

      {/* FOOTER (fora do admin) */}
      {!isAdmin && <Footer />}

      {/* WHATSAPP FLOAT (fora do admin) */}
      {!isAdmin && <WhatsAppFloat />}
    </div>
  );
}
