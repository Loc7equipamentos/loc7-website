import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type RegistrationType = "pf" | "pj";
type InternalStatus =
  | "received"
  | "analyzing"
  | "pending"
  | "approved"
  | "rejected"
  | "blocked";
type PublicStatus = "processing" | "approved";
type RiskLevel = "normal" | "attention" | "danger" | "blacklist";

type Registration = {
  id: string;
  registration_type: RegistrationType;
  full_name: string | null;
  company_name: string | null;
  document_number: string | null;
  phone: string | null;
  email: string | null;
  internal_status: InternalStatus;
  public_status: PublicStatus;
  risk_level: RiskLevel;
  internal_notes: string | null;
  created_at: string;
};

const internalStatusOptions: { value: InternalStatus; label: string }[] = [
  { value: "received", label: "Recebido" },
  { value: "analyzing", label: "Em análise" },
  { value: "pending", label: "Pendente" },
  { value: "approved", label: "Aprovado" },
  { value: "rejected", label: "Rejeitado" },
  { value: "blocked", label: "Bloqueado" },
];

const riskOptions: { value: RiskLevel; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "attention", label: "Atenção" },
  { value: "danger", label: "Perigo" },
  { value: "blacklist", label: "Blacklist" },
];

function getPublicStatusFromInternal(status: InternalStatus): PublicStatus {
  return status === "approved" ? "approved" : "processing";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

export default function AdminCadastros({ onLogout }: { onLogout: () => void }) {
  const [data, setData] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [editInternalStatus, setEditInternalStatus] =
    useState<InternalStatus>("received");
  const [editRiskLevel, setEditRiskLevel] = useState<RiskLevel>("normal");
  const [editInternalNotes, setEditInternalNotes] = useState("");

  async function fetchData() {
    setLoading(true);
    setError("");

    const { data: registrations, error } = await supabase
      .from("rental_registrations")
      .select(
        "id, registration_type, full_name, company_name, document_number, phone, email, internal_status, public_status, risk_level, internal_notes, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar cadastros:", error);
      setError("Erro ao carregar cadastros.");
      setData([]);
    } else {
      setData((registrations || []) as Registration[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  function startEdit(item: Registration) {
    setEditingId(item.id);
    setEditInternalStatus(item.internal_status || "received");
    setEditRiskLevel(item.risk_level || "normal");
    setEditInternalNotes(item.internal_notes || "");
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditInternalStatus("received");
    setEditRiskLevel("normal");
    setEditInternalNotes("");
    setError("");
  }

  async function saveEdit(id: string) {
    setError("");

    if (
      (editRiskLevel === "danger" || editRiskLevel === "blacklist") &&
      !editInternalNotes.trim()
    ) {
      setError("Observação interna obrigatória para risco Perigo ou Blacklist.");
      return;
    }

    const nextPublicStatus = getPublicStatusFromInternal(editInternalStatus);

    setSavingId(id);

    const { error } = await supabase
      .from("rental_registrations")
      .update({
        internal_status: editInternalStatus,
        public_status: nextPublicStatus,
        risk_level: editRiskLevel,
        internal_notes: editInternalNotes.trim() || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Erro ao salvar cadastro:", error);
      setError("Erro ao salvar cadastro.");
      setSavingId(null);
      return;
    }

    setData((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              internal_status: editInternalStatus,
              public_status: nextPublicStatus,
              risk_level: editRiskLevel,
              internal_notes: editInternalNotes.trim() || null,
            }
          : item
      )
    );

    setSavingId(null);
    cancelEdit();
  }

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)] text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Cadastros</h1>
          <p className="text-sm text-white/50 mt-1">
            Análise interna de clientes e liberação de locação
          </p>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 bg-white text-black rounded hover:bg-white/90"
        >
          Sair
        </button>
      </div>

      {error && (
        <div className="mb-4 border border-red-500/40 bg-red-500/10 text-red-200 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-white/70">Carregando...</p>
      ) : data.length === 0 ? (
        <div className="border border-white/10 bg-white/5 rounded p-6 text-white/60">
          Nenhum cadastro encontrado.
        </div>
      ) : (
        <div className="overflow-x-auto border border-white/10 rounded">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-3 text-left">Nome / Empresa</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Telefone</th>
                <th className="p-3 text-left">Status Interno</th>
                <th className="p-3 text-left">Status Público</th>
                <th className="p-3 text-left">Risco</th>
                <th className="p-3 text-left">Data</th>
                <th className="p-3 text-left">Ações</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => {
                const displayName =
                  item.registration_type === "pj"
                    ? item.company_name || item.full_name || "Empresa sem nome"
                    : item.full_name || "Cliente sem nome";

                const isEditing = editingId === item.id;
                const previewPublicStatus =
                  isEditing && editInternalStatus
                    ? getPublicStatusFromInternal(editInternalStatus)
                    : item.public_status;

                return (
                  <tr key={item.id} className="border-t border-white/10">
                    <td className="p-3 align-top">
                      <div className="font-medium">{displayName}</div>
                      {item.email && (
                        <div className="text-xs text-white/45 mt-1">{item.email}</div>
                      )}
                    </td>

                    <td className="p-3 align-top uppercase">
                      {item.registration_type}
                    </td>

                    <td className="p-3 align-top">{item.phone || "-"}</td>

                    <td className="p-3 align-top">
                      {isEditing ? (
                        <select
                          value={editInternalStatus}
                          onChange={(e) =>
                            setEditInternalStatus(e.target.value as InternalStatus)
                          }
                          className="bg-black border border-white/20 rounded px-2 py-2 text-white"
                        >
                          {internalStatusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        item.internal_status
                      )}
                    </td>

                    <td className="p-3 align-top">
                      <span
                        className={
                          previewPublicStatus === "approved"
                            ? "text-emerald-300"
                            : "text-amber-300"
                        }
                      >
                        {previewPublicStatus}
                      </span>
                    </td>

                    <td className="p-3 align-top">
                      {isEditing ? (
                        <select
                          value={editRiskLevel}
                          onChange={(e) =>
                            setEditRiskLevel(e.target.value as RiskLevel)
                          }
                          className="bg-black border border-white/20 rounded px-2 py-2 text-white"
                        >
                          {riskOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        item.risk_level
                      )}
                    </td>

                    <td className="p-3 align-top">{formatDate(item.created_at)}</td>

                    <td className="p-3 align-top">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(item.id)}
                            disabled={savingId === item.id}
                            className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 disabled:opacity-60"
                          >
                            {savingId === item.id ? "Salvando..." : "Salvar"}
                          </button>

                          <button
                            onClick={cancelEdit}
                            disabled={savingId === item.id}
                            className="px-3 py-2 bg-white/10 text-white rounded hover:bg-white/20 disabled:opacity-60"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(item)}
                          className="px-3 py-2 bg-white text-black rounded hover:bg-white/90"
                        >
                          Editar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {editingId && (
            <div className="border-t border-white/10 bg-white/5 p-4">
              <label className="block text-sm font-medium mb-2">
                Observação interna
                {(editRiskLevel === "danger" || editRiskLevel === "blacklist") && (
                  <span className="text-red-300"> *</span>
                )}
              </label>

              <textarea
                value={editInternalNotes}
                onChange={(e) => setEditInternalNotes(e.target.value)}
                rows={4}
                placeholder="Anotações internas da equipe Loc7..."
                className="w-full bg-black border border-white/20 rounded p-3 text-white placeholder:text-white/30"
              />

              <p className="text-xs text-white/40 mt-2">
                Esta informação é interna. O cliente não visualiza risco, reprovação
                ou observações.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
