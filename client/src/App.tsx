import { Route, Switch } from "wouter";

import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Produto from "./pages/Produto";
import Orcamento from "./pages/Orcamento";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

import Navbar from "./components/Navbar";

export default function App() {
  return (
    <>
      <Navbar />

      <Switch>
        <Route path="/" component={Home} />
        <Route path="/catalogo/:category" component={Catalogo} />
        <Route path="/equipamentos/:slug" component={Produto} />
        <Route path="/orcamento" component={Orcamento} />

        <Route path="/admin-panel" component={AdminDashboard} />

        <Route component={NotFound} />
      </Switch>
    </>
  );
}
