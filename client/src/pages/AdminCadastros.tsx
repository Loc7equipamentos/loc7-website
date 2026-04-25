import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Cadastro = {
  id: string;
  registration_type: string;
  full_name: string;
  company_name: string | null;
  phone: string;
  email: string;
  internal_status: string;
  public_status: string;
  risk_level: string;
  internal_notes: string | null;
  created_at: string;
};

export default function AdminCadastros() {
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  const fetchCadastros = async () => {
    const { data } = await supabase
      .from("rental_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setCadastros(data);
  };

  useEffect(() => {
    fetchCadastros();
  }, []);

  const startEdit = (c: Cadastro) => {
    setEditingId(c.id);
    setForm(c);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  const saveEdit = async () => {
    if (
      (form.risk_level === "perigo" || form.risk_level === "blacklist") &&
      !form.internal_notes
    ) {
      alert("Observação obrigatória para risco crítico");
      return;
    }

    await supabase
      .from("rental_registrations")
      .update(form)
      .eq("id", editingId);

    setEditingId(null);
    fetchCadastros();
  };

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

      {/* ALERTA */}
      {(form.risk_level === "perigo" || form.risk_level === "blacklist") &&
        editingId && (
          <div className="mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
            Observação interna obrigatória para risco Perigo ou Blacklist.
          </div>
        )}

      {/* CARD */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">
            Cadastros recebidos
          </h2>
          <p className="text-sm text-gray-500">
            {cadastros.length} registro(s) no sistema
          </p>
        </div>

        <table className="w-full text-sm">
          <thead className="text-gray-500 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Nome / Empresa</th>
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
            {cadastros.map((c) => {
              const editing = editingId === c.id;

              return (
                <>
                  <tr key={c.id} className="border-b border-gray-100">
                    
                    <td className="px-6 py-4">
                      <div className="font-medium">{c.full_name}</div>
                      <div className="text-xs text-gray-400">{c.email}</div>
                    </td>

                    <td className="px-4 py-4">
                      {c.registration_type?.toUpperCase()}
                    </td>

                    <td className="px-4 py-4">{c.phone}</td>

                    <td className="px-4 py-4">
                      {editing ? (
                        <select
                          value={form.internal_status}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              internal_status: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1"
                        >
                          <option value="received">Recebido</option>
                          <option value="approved">Aprovado</option>
                          <option value="rejected">Reprovado</option>
                        </select>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                          {c.internal_status}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                        {c.public_status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {editing ? (
                        <select
                          value={form.risk_level}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              risk_level: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1"
                        >
                          <option value="normal">Normal</option>
                          <option value="perigo">Perigo</option>
                          <option value="blacklist">Blacklist</option>
                        </select>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs">
                          {c.risk_level}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-gray-500">
                      {new Date(c.created_at).toLocaleDateString("pt-BR")}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {editing ? (
                        <>
                          <button
                            onClick={saveEdit}
                            className="bg-green-600 text-white px-3 py-1 rounded mr-2 text-xs"
                          >
                            Salvar
                          </button>

                          <button
                            onClick={cancelEdit}
                            className="bg-gray-300 px-3 py-1 rounded text-xs"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEdit(c)}
                          className="bg-black text-white px-4 py-2 rounded text-xs"
                        >
                          Editar
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* OBSERVAÇÃO */}
                  {editing && (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 bg-gray-50">
                        <textarea
                          placeholder="Observação interna..."
                          value={form.internal_notes || ""}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              internal_notes: e.target.value,
                            })
                          }
                          className="w-full border rounded p-3 text-sm"
                        />
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
