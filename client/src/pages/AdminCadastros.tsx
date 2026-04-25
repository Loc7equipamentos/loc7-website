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

function internalStatusLabel(status: InternalStatus) {
  return internalStatusOptions.find((item) => item.value === status)?.label || status;
}

function riskLabel(risk: RiskLevel) {
  return riskOptions.find((item) => item.value === risk)?.label || risk;
}

function publicStatusBadge(status: PublicStatus) {
  if (status === "approved") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  return "bg-amber-50 text-amber-700 border-amber-200";
}

function riskBadge(risk: RiskLevel) {
  if (risk === "normal") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (risk === "attention") return "bg-amber-50 text-amber-700 border-amber-200";
  if (risk === "danger") return "bg-red-50 text-red-700 border-red-200";
  return "bg-zinc-900 text-white border-zinc-900";
}

function internalStatusBadge(status: InternalStatus) {
  if (status === "approved") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "analyzing") return "bg-blue-50 text-blue-700 border-blue-200";
  if (status === "pending") return "bg-amber-50 text-amber-700 border-amber-200";
  if (status === "rejected") return "bg-red-50 text-red-700 border-red-200";
  if (status === "blocked") return "bg-zinc-900 text-white border-zinc-900";
  return "bg-gray-100 text-gray-800 border-gray-300";
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
    <div className="min-h-screen bg-gray-100 text-black p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Loc7 Operações
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-black">
            Cadastros
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Análise interna de clientes, risco e liberação de locação.
          </p>
        </div>

        <button
          onClick={onLogout}
          className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Sair
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600 shadow-sm">
          Carregando cadastros...
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600 shadow-sm">
          Nenhum cadastro encontrado.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-white px-4 py-3">
            <div className="text-sm font-semibold text-black">
              Cadastros recebidos
            </div>
            <div className="text-xs text-gray-500">
              {data.length} registro{data.length === 1 ? "" : "s"} no sistema
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-xs font-bold uppercase tracking-wide text-gray-700">
                <tr>
                  <th className="p-3 text-left">Nome / Empresa</th>
                  <th className="p-3 text-left">Tipo</th>
                  <th className="p-3 text-left">Telefone</th>
                  <th className="p-3 text-left">Status interno</th>
                  <th className="p-3 text-left">Status público</th>
                  <th className="p-3 text-left">Risco</th>
                  <th className="p-3 text-left">Data</th>
                  <th className="p-3 text-left">Ações</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item, index) => {
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
                    <tr
                      key={item.id}
                      className={`border-t border-gray-200 transition ${
                        isEditing
                          ? "bg-gray-50"
                          : index % 2 === 0
                            ? "bg-white hover:bg-gray-50"
                            : "bg-gray-50/60 hover:bg-gray-100"
                      }`}
                    >
                      <td className="p-3 align-top">
                        <div className="font-bold text-black">{displayName}</div>
                        {item.email && (
                          <div className="mt-1 text-xs font-medium text-gray-600">
                            {item.email}
                          </div>
                        )}
                      </td>

                      <td className="p-3 align-top">
                        <span className="inline-flex rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-bold uppercase text-gray-800">
                          {item.registration_type}
                        </span>
                      </td>

                      <td className="p-3 align-top font-semibold text-gray-800">
                        {item.phone || "-"}
                      </td>

                      <td className="p-3 align-top">
                        {isEditing ? (
                          <select
                            value={editInternalStatus}
                            onChange={(e) =>
                              setEditInternalStatus(e.target.value as InternalStatus)
                            }
                            className="rounded-lg border border-gray-300 bg-white px-2 py-2 font-semibold text-black outline-none focus:ring-2 focus:ring-black/10"
                          >
                            {internalStatusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${internalStatusBadge(
                              item.internal_status
                            )}`}
                          >
                            {internalStatusLabel(item.internal_status)}
                          </span>
                        )}
                      </td>

                      <td className="p-3 align-top">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${publicStatusBadge(
                            previewPublicStatus
                          )}`}
                        >
                          {previewPublicStatus === "approved"
                            ? "Aprovado"
                            : "Em análise"}
                        </span>
                      </td>

                      <td className="p-3 align-top">
                        {isEditing ? (
                          <select
                            value={editRiskLevel}
                            onChange={(e) =>
                              setEditRiskLevel(e.target.value as RiskLevel)
                            }
                            className="rounded-lg border border-gray-300 bg-white px-2 py-2 font-semibold text-black outline-none focus:ring-2 focus:ring-black/10"
                          >
                            {riskOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${riskBadge(
                              item.risk_level
                            )}`}
                          >
                            {riskLabel(item.risk_level)}
                          </span>
                        )}
                      </td>

                      <td className="p-3 align-top font-semibold text-gray-700">
                        {formatDate(item.created_at)}
                      </td>

                      <td className="p-3 align-top">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEdit(item.id)}
                              disabled={savingId === item.id}
                              className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-60"
                            >
                              {savingId === item.id ? "Salvando..." : "Salvar"}
                            </button>

                            <button
                              onClick={cancelEdit}
                              disabled={savingId === item.id}
                              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-gray-800 transition hover:bg-gray-100 disabled:opacity-60"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(item)}
                            className="rounded-lg bg-black px-3 py-2 text-sm font-bold text-white transition hover:bg-gray-800"
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
          </div>

          {editingId && (
            <div className="border-t border-gray-200 bg-gray-100 p-4">
              <label className="mb-2 block text-sm font-bold text-black">
                Observação interna
                {(editRiskLevel === "danger" || editRiskLevel === "blacklist") && (
                  <span className="text-red-600"> *</span>
                )}
              </label>

              <textarea
                value={editInternalNotes}
                onChange={(e) => setEditInternalNotes(e.target.value)}
                rows={4}
                placeholder="Anotações internas da equipe Loc7..."
                className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-black/10"
              />

              <p className="mt-2 text-xs font-medium text-gray-600">
                Informação interna. O cliente não visualiza risco, reprovação ou
                observações.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
