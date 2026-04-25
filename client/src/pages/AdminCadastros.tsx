import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Registration = {
  id: string;
  full_name: string | null;
  company_name: string | null;
  registration_type: "pf" | "pj";
  phone: string | null;
  internal_status: string;
  public_status: string;
  risk_level: string;
  created_at: string;
};

export default function AdminCadastros({
  onLogout,
}: {
  onLogout: () => void;
}) {
  const [data, setData] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);

    const { data, error } = await supabase
      .from("rental_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar cadastros:", error);
    } else {
      setData(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cadastros</h1>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-white text-black rounded"
        >
          Sair
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-2 text-left">Nome / Empresa</th>
                <th className="p-2">Tipo</th>
                <th className="p-2">Telefone</th>
                <th className="p-2">Status Interno</th>
                <th className="p-2">Status Público</th>
                <th className="p-2">Risco</th>
                <th className="p-2">Data</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-t border-gray-700">
                  <td className="p-2">
                    {item.registration_type === "pf"
                      ? item.full_name
                      : item.company_name}
                  </td>
                  <td className="p-2 text-center">
                    {item.registration_type.toUpperCase()}
                  </td>
                  <td className="p-2 text-center">{item.phone}</td>
                  <td className="p-2 text-center">{item.internal_status}</td>
                  <td className="p-2 text-center">{item.public_status}</td>
                  <td className="p-2 text-center">{item.risk_level}</td>
                  <td className="p-2 text-center">
                    {new Date(item.created_at).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
