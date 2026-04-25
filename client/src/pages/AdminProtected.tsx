import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Cadastro = {
  id: string;
  registration_type: string;
  full_name: string;
  company_name: string | null;
  phone: string;
  internal_status: string;
  public_status: string;
  risk_level: string;
  created_at: string;
  email?: string;
};

export default function AdminCadastros() {
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCadastros = async () => {
    const { data, error } = await supabase
      .from("rental_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCadastros(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCadastros();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="mb-6">
        <div className="text-xs uppercase text-gray-500 tracking-widest">
          LOC7 OPERAÇÕES
        </div>

        <h1 className="text-3xl font-bold mt-1">Cadastros</h1>

        <p className="text-gray-500 mt-1">
          Análise interna de clientes, risco e liberação de locação.
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">
            Cadastros recebidos
          </h2>
          <p className="text-sm text-gray-500">
            {cadastros.length} registro(s) no sistema
          </p>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-500 border-b border-gray-100">
              <tr className="text-left">
                <th className="px-6 py-3">Nome / Empresa</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3">Status Interno</th>
                <th className="px-4 py-3">Status Público</th>
                <th className="px-4 py-3">Risco</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400">
                    Carregando...
                  </td>
                </tr>
              )}

              {!loading && cadastros.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400">
                    Nenhum cadastro encontrado
                  </td>
                </tr>
              )}

              {cadastros.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">
                      {c.full_name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {c.email || ""}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">
                      {c.registration_type?.toUpperCase()}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-gray-700">
                    {c.phone}
                  </td>

                  <td className="px-4 py-4">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                      {c.internal_status}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                      {c.public_status}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs">
                      {c.risk_level}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-gray-500">
                    {new Date(c.created_at).toLocaleDateString("pt-BR")}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button className="px-4 py-2 bg-black text-white rounded-lg text-xs font-semibold hover:opacity-90">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
