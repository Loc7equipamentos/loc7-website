import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    localStorage.setItem("loc7_admin_logged", "true");
    setLocation("/admin-panel");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      
      {/* FUNDO */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />

      {/* CARD */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            ACESSO INTERNO
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Controle Operacional Loc7
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-600">
              E-mail Corporativo
            </label>
            <input
              type="email"
              placeholder="ex: nome@loc7.com.br"
              className="w-full mt-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* SENHA */}
          <div>
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-600">
                Senha Operacional
              </label>

              {/* RECUPERAR SENHA */}
              <button
                type="button"
                className="text-xs text-gray-500 hover:text-black transition"
                onClick={() => alert("Fluxo de recuperação será implementado")}
              >
                Esqueci a senha
              </button>
            </div>

            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* ÍCONE OLHO */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* BOTÃO */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Entrar
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © Loc7 Equipamentos • Sistema Interno
        </p>
      </div>
    </div>
  );
}
