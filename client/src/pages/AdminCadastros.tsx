import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "wouter";

type Cadastro = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  registration_type: string;
  status_internal: string;
  status_public: string;
  risk: string;
  created_at: string;
};

export default function AdminCadastros() {
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);

  useEffect(() => {
    fetchCadastros();
  }, []);

  async function fetchCadastros() {
    const { data } = await supabase
      .from("rental_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setCadastros(data);
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 tracking-widest uppercase">
          LOC7 OPERAÇÕES
        </p>

        <h1 className="text-3xl font-bold text-gray-900 mt-1">
          Cadastros
        </h1>

        <p className="text-gray-600 mt-1 text-sm">
          Análise interna de clientes, risco e liberação de locação.
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">

        <div className="p-4 border-b">
          <p className="text-sm font-semibold text-gray-900">
            Cadastros recebidos
          </p>
          <p className="text-xs text-gray-500">
            {cadastros.length} registro(s) no sistema
          </p>
        </div>

        {/* TABELA */}
        <table className="w-full text-sm">

          <thead className="bg-gray-100 border-b text-xs uppercase text-gray-600">
            <tr>
              <th className="text-left px-4 py-3">Nome / Empresa</th>
              <th className="text-left px-4 py-3">Tipo</th>
              <th className="text-left px-4 py-3">Telefone</th>
              <th className="text-left px-4 py-3">Status Interno</th>
              <th className="text-left px-4 py-3">Status Público</th>
              <th className="text-left px-4 py-3">Risco</th>
              <th className="text-left px-4 py-3">Data</th>
              <th className="text-right px-4 py-3">Ações</th>
            </tr>
          </thead>

          <tbody>

            {cadastros.map((c) => (
              <tr
                key={c.id}
                className="border-b hover:bg-gray-50 transition"
              >
                {/* NOME */}
                <td className="px-4 py-4">
                  <div className="font-semibold text-gray-900">
                    {c.full_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {c.email}
                  </div>
                </td>

                {/* TIPO */}
                <td className="px-4">
                  <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-1 rounded">
                    {c.registration_type?.toUpperCase()}
                  </span>
                </td>

                {/* TELEFONE */}
                <td className="px-4 font-medium text-gray-800">
                  {c.phone}
                </td>

                {/* STATUS INTERNO */}
                <td className="px-4">
                  <span className="text-xs font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    {c.status_internal}
                  </span>
                </td>

                {/* STATUS PUBLICO */}
                <td className="px-4">
                  <span className="text-xs font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    {c.status_public}
                  </span>
                </td>

                {/* RISCO */}
                <td className="px-4">
                  <span className="text-xs font-semibold bg-gray-200 text-gray-800 px-3 py-1 rounded-full">
                    {c.risk}
                  </span>
                </td>

                {/* DATA */}
                <td className="px-4 text-gray-700">
                  {new Date(c.created_at).toLocaleDateString("pt-BR")}
                </td>

                {/* AÇÕES */}
                <td className="px-4 text-right space-x-2">

                  <Link href={`/admin-panel/cadastro/${c.id}`}>
                    <button className="bg-gray-800 text-white text-xs px-3 py-2 rounded-md hover:opacity-90 transition">
                      Ver ficha
                    </button>
                  </Link>

                  <button className="bg-black text-white text-xs px-4 py-2 rounded-md hover:opacity-90 transition">
                    Editar
                  </button>

                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
}
