import { Route, Switch, useLocation } from "wouter";
import { CartProvider } from "./contexts/CartContext";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Produto from "./pages/Produto";
import Orcamento from "./pages/Orcamento";
import Producao from "./pages/Producao";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import AdminProtected from "./pages/AdminProtected"; // ✅ IMPORT CORRETO (TOPO)

function AppContent() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin-panel");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {!isAdmin && <Navbar />}

      <Switch>
        <Route path="/" component={Home} />
        <Route path="/catalogo" component={Catalogo} />
        <Route path="/catalogo/:category" component={Catalogo} />
        <Route path="/equipamentos/:slug" component={Produto} />
        <Route path="/orcamento" component={Orcamento} />
        <Route path="/producao" component={Producao} />

        {/* 🔒 ADMIN PROTEGIDO */}
        <Route path="/admin-panel" component={AdminProtected} />

        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
