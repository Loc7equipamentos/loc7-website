import { Route, Switch, useLocation } from "wouter";

import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Produto from "./pages/Produto";
import Orcamento from "./pages/Orcamento";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

import Navbar from "./components/Navbar";
import { CartProvider } from "./contexts/CartContext";

export default function App() {
  const [location] = useLocation();

  const isAdmin = location.startsWith("/admin-panel");

  return (
    <CartProvider>
      {!isAdmin && <Navbar />}

      <Switch>
        <Route path="/" component={Home} />
        <Route path="/catalogo/:category" component={Catalogo} />
        <Route path="/equipamentos/:slug" component={Produto} />
        <Route path="/orcamento" component={Orcamento} />

        <Route path="/admin-panel" component={AdminDashboard} />

        <Route component={NotFound} />
      </Switch>
    </CartProvider>
  );
}
