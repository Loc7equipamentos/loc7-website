import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

type DocumentItem = {
  path: string;
  url: string | null;
  name: string;
};

type AnalysisLogItem = {
  id: string;
  registration_id: string;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  changed_by: string | null;
  change_reason: string | null;
  created_at: string;
};

export default function AdminCadastroFicha() {
  const [location] = useLocation();
  const id = location.split("/admin-panel/cadastro/")[1];
  const [data, setData] = useState<any>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [analysisLogs, setAnalysisLogs] = useState<AnalysisLogItem[]>([]);
  const [internalReferences, setInternalReferences] = useState<any[]>([]);
  const [internalDocuments, setInternalDocuments] = useState<any[]>([]);
  const [internalDocumentFile, setInternalDocumentFile] = useState<File | null>(null);

const [internalDocumentDraft, setInternalDocumentDraft] = useState({
  document_type: "Consulta crédito",
  notes: "",
});

  const [uploadingInternalDocument, setUploadingInternalDocument] = useState(false);
  const [showInternalReferenceForm, setShowInternalReferenceForm] = useState(false);
  const [internalReferenceDraft, setInternalReferenceDraft] = useState({
  company_name: "",
  contact_name: "",
  phone: "",
 
  notes: "",
});
  const [internalNotesDraft, setInternalNotesDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const [editingReferenceId, setEditingReferenceId] = useState<string | null>(null);

const [editingReferenceDraft, setEditingReferenceDraft] = useState({
  company_name: "",
  contact_name: "",
  phone: "",
  notes: "",
});
  
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const { data: userData } = await supabase.auth.getUser();
      setUserEmail(userData?.user?.email || null);

      const { data, error } = await supabase
        .from("rental_registrations")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setData(data);
        setInternalNotesDraft(data.internal_notes || "");
        const docs = await resolveDocuments(
          data.documents || data.form_data?.documents
        );
        setDocuments(docs);
        await loadAnalysisLogs(data.id);
        await loadInternalReferences(data.id);
        await loadInternalDocuments(data.id);
      }
    };

    load();
  }, [id]);

async function saveInternalReference() {
  if (!data?.id) return;

  if (!internalReferenceDraft.company_name.trim()) {
    alert("Informe o nome da empresa da referência interna.");
    return;
  }

  setSaving(true);

  const { error } = await supabase.from("registration_internal_references").insert([
    {
      registration_id: data.id,
      company_name: internalReferenceDraft.company_name.trim(),
      contact_name: internalReferenceDraft.contact_name.trim() || null,
      phone: internalReferenceDraft.phone.trim() || null,
      status: "Não verificada",
      notes: internalReferenceDraft.notes.trim() || null,
      created_by: userEmail || "admin",
    },
  ]);

  if (error) {
    alert(`Erro ao salvar referência interna:\n\n${error.message}`);
    setSaving(false);
    return;
  }

  setInternalReferenceDraft({
    company_name: "",
    contact_name: "",
    phone: "",
    
    notes: "",
  });

  setShowInternalReferenceForm(false);
  await loadInternalReferences(data.id);

  setSaving(false);
}

function startEditInternalReference(ref: any) {
  setEditingReferenceId(ref.id);
  setEditingReferenceDraft({
    company_name: ref.company_name || "",
    contact_name: ref.contact_name || "",
    phone: ref.phone || "",
    notes: ref.notes || "",
  });
  setShowInternalReferenceForm(false);
}

function cancelEditInternalReference() {
  setEditingReferenceId(null);
  setEditingReferenceDraft({
    company_name: "",
    contact_name: "",
    phone: "",
    notes: "",
  });
}

async function saveEditedInternalReference(referenceId: string) {
  if (!editingReferenceDraft.company_name.trim()) {
    alert("Informe o nome da empresa da referência interna.");
    return;
  }

  setSaving(true);

  const { error } = await supabase
    .from("registration_internal_references")
    .update({
      company_name: editingReferenceDraft.company_name.trim(),
      contact_name: editingReferenceDraft.contact_name.trim() || null,
      phone: editingReferenceDraft.phone.trim() || null,
      notes: editingReferenceDraft.notes.trim() || null,
    })
    .eq("id", referenceId);

  if (error) {
    alert(`Erro ao editar referência:\n\n${error.message}`);
    setSaving(false);
    return;
  }

  cancelEditInternalReference();

  if (data?.id) {
    await loadInternalReferences(data.id);
  }

  setSaving(false);
}
  
async function deleteInternalReference(referenceId: string) {
  if (!confirm("Deseja remover esta referência interna?")) {
    return;
  }

  const { error } = await supabase
    .from("registration_internal_references")
    .delete()
    .eq("id", referenceId);

  if (error) {
    alert(`Erro ao remover referência:\n\n${error.message}`);
    return;
  }

  if (data?.id) {
    await loadInternalReferences(data.id);
  }
}
  
async function loadInternalReferences(registrationId: string) {
  const { data, error } = await supabase
    .from("registration_internal_references")
    .select("*")
    .eq("registration_id", registrationId)
    .order("created_at", { ascending: false });

  if (!error && data) {
    setInternalReferences(data);
  }
}

async function loadInternalDocuments(registrationId: string) {
  const { data, error } = await supabase
    .from("registration_internal_documents")
    .select("*")
    .eq("registration_id", registrationId)
    .order("created_at", { ascending: false });

  if (!error && data) {
    setInternalDocuments(data);
  }
}

async function uploadInternalDocument() {
  if (!data?.id) return;

  if (!internalDocumentFile) {
    alert("Selecione um documento interno.");
    return;
  }

  setUploadingInternalDocument(true);

  const extension = internalDocumentFile.name.split(".").pop();

  const filename = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${extension}`;

  const storagePath = `${data.id}/${filename}`;

  const { error: uploadError } = await supabase.storage
    .from("internal-documents")
    .upload(storagePath, internalDocumentFile);

  if (uploadError) {
    alert(`Erro no upload:\n\n${uploadError.message}`);
    setUploadingInternalDocument(false);
    return;
  }

  const { error: insertError } = await supabase
    .from("registration_internal_documents")
    .insert([
      {
        registration_id: data.id,
        document_type: internalDocumentDraft.document_type,
        notes: internalDocumentDraft.notes || null,
        file_path: storagePath,
        uploaded_by: userEmail || "admin",
      },
    ]);

  if (insertError) {
    alert(`Erro ao salvar documento:\n\n${insertError.message}`);
    setUploadingInternalDocument(false);
    return;
  }

  setInternalDocumentFile(null);

  setInternalDocumentDraft({
    document_type: "Consulta crédito",
    notes: "",
  });

  await loadInternalDocuments(data.id);

  setUploadingInternalDocument(false);
}
  
  async function loadAnalysisLogs(registrationId: string) {
    const { data, error } = await supabase
      .from("registration_analysis_logs")
      .select("*")
      .eq("registration_id", registrationId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (!error && data) {
      setAnalysisLogs(data as AnalysisLogItem[]);
    }
  }

  async function resolveDocuments(rawDocuments: unknown): Promise<DocumentItem[]> {
    const paths = normalizeDocuments(rawDocuments);

    if (!paths.length) return [];

    const resolved = await Promise.all(
      paths.map(async (path) => {
        const { data } = await supabase.storage
          .from("documents")
          .createSignedUrl(path, 60 * 60);

        return {
          path,
          url: data?.signedUrl || null,
          name: getDocumentName(path),
        };
      })
    );

    return resolved;
  }

  async function updateField(field: string, value: string) {
    if (!data?.id) return;

    const oldValue = data[field] || "";
    const newValue = value || "";

    if (String(oldValue) === String(newValue)) return;

    // REGRA OPERACIONAL:
    // A documentação manda na liberação do cadastro.
    // Se a documentação não estiver aprovada, o cadastro não pode ser liberado.
    if (field === "internal_status" && newValue === "Liberado") {
      if (data.document_status !== "aprovado") {
        alert("Não é possível liberar este cadastro. A documentação ainda não está aprovada.");
        return;
      }
    }

    setSaving(true);

    const updatePayload: Record<string, string> = {
      [field]: newValue,
    };

    if (field === "internal_status") {
      if (
        newValue === "Recebido" ||
        newValue === "Em análise" ||
        newValue === "Pendente documentação" ||
        newValue === "Recusado interno"
      ) {
        updatePayload.public_status = "Em análise";
      }

      if (newValue === "Liberado") {
        updatePayload.public_status = "Aprovado";
      }
    }

    // Se a documentação sair de aprovado, o cadastro não pode continuar liberado.
    if (field === "document_status" && newValue !== "aprovado") {
      if (data.internal_status === "Liberado") {
        updatePayload.internal_status = "Em análise";
        updatePayload.public_status = "Em análise";
      }
    }

    const { error } = await supabase
      .from("rental_registrations")
      .update(updatePayload)
      .eq("id", data.id);

    if (!error) {
      const { data: currentUserData } = await supabase.auth.getUser();
      const actorEmail = currentUserData?.user?.email || userEmail || "admin";

      const logsToInsert = Object.entries(updatePayload)
        .filter(([changedField, changedValue]) => {
          return String(data[changedField] || "") !== String(changedValue || "");
        })
        .map(([changedField, changedValue]) => ({
          registration_id: data.id,
          field_name: changedField,
          old_value: String(data[changedField] || ""),
          new_value: String(changedValue || ""),
          changed_by: actorEmail,
          change_reason: getDefaultChangeReason(changedField),
        }));

      if (logsToInsert.length > 0) {
        const { error: logError } = await supabase
          .from("registration_analysis_logs")
          .insert(logsToInsert);

        if (logError) {
          alert(
            `Alteração salva, mas houve erro ao registrar o log:\n\n${
              logError.message || "Erro desconhecido"
            }`
          );
        }
      }

      setData((prev: any) => ({ ...prev, ...updatePayload }));
      await loadAnalysisLogs(data.id);
    } else {
      alert(`Erro ao salvar alteração:\n\n${error.message || "Erro desconhecido"}`);
    }

    setSaving(false);
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 text-gray-800">
        Carregando ficha...
      </div>
    );
  }

  const form = data.form_data || {};
  const isPF = data.registration_type === "pf";

  return (
    <div className="min-h-screen bg-[#f3f4f6] px-4 py-8 text-gray-900 print:bg-white print:p-0">
      <div className="mx-auto mb-5 flex max-w-5xl items-center justify-between no-print">
        <Link href="/admin-panel/cadastros">
          <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50">
            ← Voltar para lista
          </button>
        </Link>

        <button
          onClick={() => window.print()}
          className="rounded-md bg-black px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
        >
          Imprimir / PDF
        </button>
      </div>

      <main className="mx-auto max-w-5xl rounded-xl border border-gray-200 bg-white shadow-lg print:max-w-none print:rounded-none print:border-0 print:shadow-none">
        <div className="h-1.5 rounded-t-xl bg-[#b91c1c] print:hidden" />

        <div className="p-8 print:p-6">
          <header className="mb-8 border-b border-gray-300 pb-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-gray-950">
                  Ficha de Cadastro {isPF ? "PF" : "PJ"}
                </h1>

                <p className="mt-1 text-sm font-medium text-gray-600">
                  Controle operacional / análise de cadastro
                </p>

                <p className="mt-2 text-xs font-medium text-gray-600">
                  Data: {formatDate(data.created_at)}
                </p>
              </div>

              <div className="no-print grid gap-3 md:min-w-[430px]">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <SelectField
                    label="Status interno"
                    value={data.internal_status || ""}
                    tone={getStatusTone(data.internal_status)}
                    onChange={(value) => updateField("internal_status", value)}
                    options={[
                      "Recebido",
                      "Em análise",
                      "Liberado",
                      "Recusado interno",
                      "Pendente documentação",
                    ]}
                  />

                  <label>
                    <span className="text-xs font-black uppercase text-gray-600">
                      Status público
                    </span>
                    <div
                      className={`w-full mt-1 rounded-md border px-3 py-2 text-xs font-bold ${getStatusTone(
                        data.public_status
                      )}`}
                    >
                      {data.public_status || "—"}
                    </div>
                  </label>

                  <SelectField
                    label="Risco"
                    value={data.risk_level || ""}
                    tone={getRiskTone(data.risk_level)}
                    onChange={(value) => updateField("risk_level", value)}
                    options={["Baixo", "Médio", "Alto", "Restrito"]}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <label>
                    <span className="text-xs font-black uppercase text-gray-600">
                      Status documental
                    </span>
                    <select
                      value={data.document_status || "pendente"}
                      onChange={(e) => updateField("document_status", e.target.value)}
                      className={`w-full mt-1 rounded-md border px-3 py-2 text-xs font-bold ${getDocumentStatusTone(
                        data.document_status
                      )}`}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="incompleto">Incompleto</option>
                      <option value="em_analise">Em análise</option>
                      <option value="aprovado">Aprovado</option>
                      <option value="reprovado">Reprovado</option>
                    </select>
                  </label>
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                  <Pill label="Interno" value={data.internal_status} tone={getStatusTone(data.internal_status)} />
                  <Pill label="Público" value={data.public_status} tone={getStatusTone(data.public_status)} />
                  <Pill label="Risco" value={data.risk_level} tone={getRiskTone(data.risk_level)} />
                  <Pill label="Doc." value={formatDocumentStatusLabel(data.document_status)} tone={getDocumentStatusTone(data.document_status)} />
                </div>

                {saving && (
                  <div className="text-right text-xs font-semibold text-gray-600">
                    Salvando...
                  </div>
                )}
              </div>

              <div className="hidden print:block text-sm text-gray-900">
                <div>Status interno: {data.internal_status || "—"}</div>
                <div>Status público: {data.public_status || "—"}</div>
                <div>Risco: {data.risk_level || "—"}</div>
                <div>Status documental: {formatDocumentStatusLabel(data.document_status)}</div>
              </div>
            </div>
          </header>

          <Section title={isPF ? "Dados pessoais" : "Dados da empresa"}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {isPF ? (
                <>
                  <Field label="Nome completo" value={form.nomeCompleto} />
                  <Field label="CPF" value={form.cpf} />
                  <Field label="Data de nascimento" value={form.dataNascimento} />
                  <Field label="Nome da mãe" value={form.nomeMae} />
                  <Field label="E-mail" value={form.email} />
                  <Field label="Telefone" value={form.telefone} />
                </>
              ) : (
                <>
                  <Field label="Razão social" value={form.razaoSocial} />
                  <Field label="CNPJ" value={form.cnpj} />
                  <Field label="Responsável" value={form.responsavel || form.nomeResponsavel} />
                  <Field label="E-mail" value={form.email} />
                  <Field label="Telefone" value={form.telefone} />
                </>
              )}
            </div>
          </Section>
<Section title="Documentos enviados">
            {documents.length > 0 ? (
              <div className="space-y-3">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800">
                  Documento recebido: {documents.length} arquivo{documents.length > 1 ? "s" : ""}.
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {documents.map((doc, index) => (
                    <div
                      key={`${doc.path}-${index}`}
                      className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-gray-500">
                          {"Documento " + (index + 1)}
                        </div>
                        <div className="mt-1 text-sm font-semibold text-gray-950 truncate">
                          {doc.name}
                        </div>
                        <div className="mt-1 text-xs text-gray-400 truncate print:block">
                          {doc.path}
                        </div>
                      </div>

                      {doc.url ? (
                        <div className="no-print flex flex-col md:flex-row md:items-center gap-2">
                          <button
                            onClick={() => {
                              if (!doc.url) return;
                              window.open(doc.url, "_blank", "noopener,noreferrer");
                            }}
                            className="inline-flex min-w-[150px] items-center justify-center whitespace-nowrap rounded-md border border-gray-900 bg-gray-900 px-4 py-2 text-sm font-bold text-white"
                          >
                            Abrir documento
                          </button>

                          <button
                            type="button"
                            onClick={async () => {
                              if (!doc.url) return;

                              const response = await fetch(doc.url);
                              const blob = await response.blob();

                              const url = window.URL.createObjectURL(blob);

                              const a = document.createElement("a");
                              a.href = url;
                              a.download = `${getDisplayId(data.display_id, data.id)}_DOC${index + 1}.${getFileExtension(doc.name)}`;

                              document.body.appendChild(a);
                              a.click();

                              a.remove();
                              window.URL.revokeObjectURL(url);
                            }}
                            className="inline-flex min-w-[86px] items-center justify-center whitespace-nowrap rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                          >
                            Baixar
                          </button>
                        </div>
                      ) : (
                        <div className="rounded-md border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold text-orange-800">
                          Link indisponível
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
                Nenhum documento vinculado a este cadastro.
              </div>
            )}
          </Section>

          <Section title="Endereço">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="CEP" value={form.cep} />
              <Field label="Endereço" value={form.endereco} className="md:col-span-2" />
              <Field label="Número" value={form.numero} />
              <Field label="Complemento" value={form.complemento} />
              <Field label="Bairro" value={form.bairro} />
              <Field label="Cidade" value={form.cidade} />
              <Field label="UF" value={form.uf} />
            </div>
          </Section>

          <Section title="Referências comerciais">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[1, 2, 3].map((n) => {
                const empresa = form[`empresa${n}`] || form[`empresa${n}Pj`];
                const contato = form[`nomeContato${n}`] || form[`nomeContato${n}Pj`];
                const telefone = form[`telefoneContato${n}`] || form[`telefoneContato${n}Pj`];

                if (!empresa && !contato && !telefone) return null;

                return (
                  <div key={n} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="mb-2 text-xs font-black uppercase tracking-wide text-[#b91c1c]">
                      Referência {n}
                    </div>
                    <div className="text-base font-black text-gray-950">
                      {empresa || "Empresa não informada"}
                    </div>
                    <div className="mt-2 text-sm font-medium text-gray-800">
                      <strong>Contato:</strong> {contato || "—"}
                    </div>
                    <div className="text-sm font-medium text-gray-800">
                      <strong>Telefone:</strong> {telefone || "—"}
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          <div className="no-print">
            <Section title="Referências comerciais internas">
                            <div className="mb-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowInternalReferenceForm((current) => !current)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-800 hover:bg-gray-50"
                >
                  {showInternalReferenceForm ? "Cancelar" : "Nova referência interna"}
                </button>
              </div>

              {showInternalReferenceForm && (
                <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                   <input
  value={internalReferenceDraft.company_name}
  onChange={(e) =>
    setInternalReferenceDraft((prev) => ({
      ...prev,
      company_name: e.target.value,
    }))
  }
  className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 outline-none focus:border-[#b91c1c]"
  placeholder="Empresa"
/>

<input
  value={internalReferenceDraft.contact_name}
  onChange={(e) =>
    setInternalReferenceDraft((prev) => ({
      ...prev,
      contact_name: e.target.value,
    }))
  }
  className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 outline-none focus:border-[#b91c1c]"
  placeholder="Contato"
/>

<input
  value={internalReferenceDraft.phone}
  onChange={(e) =>
    setInternalReferenceDraft((prev) => ({
      ...prev,
      phone: formatPhone(e.target.value),
    }))
  }
  className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 outline-none focus:border-[#b91c1c]"
  placeholder="Telefone"
/>


<textarea
  value={internalReferenceDraft.notes}
  onChange={(e) =>
    setInternalReferenceDraft((prev) => ({
      ...prev,
      notes: e.target.value,
    }))
  }
  className="min-h-[78px] rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-900 outline-none focus:border-[#b91c1c] md:col-span-2"
  placeholder="Observação interna"
/>
                  </div>

                  <div className="mt-3 flex justify-end">
                   <button
  type="button"
  onClick={saveInternalReference}
  className="rounded-md bg-black px-4 py-2 text-xs font-bold text-white hover:bg-gray-800"
>
                      Salvar referência
                    </button>
                  </div>
                </div>
              )}
              {internalReferences.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {internalReferences.map((ref) => (
                    <div
                      key={ref.id}
                      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                    >
                     
                      <div className="text-base font-black text-gray-950">
                        {ref.company_name || "Empresa não informada"}
                      </div>

                      <div className="mt-2 text-sm font-medium text-gray-800">
                        <strong>Contato:</strong> {ref.contact_name || "—"}
                      </div>

                      <div className="text-sm font-medium text-gray-800">
                        <strong>Telefone:</strong> {ref.phone || "—"}
                      </div>

                      {ref.notes && (
                        <div className="mt-3 rounded-md border border-gray-200 bg-gray-50 p-3 text-xs font-medium text-gray-700">
                          {ref.notes}
                        </div>
                      )}

<div className="mt-4 flex justify-end">
  <button
    type="button"
    onClick={() => deleteInternalReference(ref.id)}
    className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-bold text-red-700 transition hover:bg-red-100"
  >
    Excluir referência
  </button>
</div>
                      
                      <div className="mt-3 text-[11px] font-medium text-gray-400">
                        {formatDate(ref.created_at)}
                        {ref.created_by ? ` · ${ref.created_by}` : ""}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-700">
                  Nenhuma referência interna registrada.
                </div>
              )}
            </Section>
          </div>
          
          <Section title="Observações internas">
            <textarea
              className="no-print min-h-[120px] w-full rounded-lg border border-gray-300 bg-white p-4 text-sm font-medium text-gray-900 outline-none focus:border-[#b91c1c]"
              value={internalNotesDraft}
              onChange={(e) => setInternalNotesDraft(e.target.value)}
              onBlur={(e) => updateField("internal_notes", e.target.value)}
              placeholder="Adicione observações internas..."
            />

            <div className="hidden print:block rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-900">
              {data.internal_notes || "Sem observações internas registradas"}
            </div>
          </Section>

          <div className="no-print">
 <Section title="Documentos internos da análise">
  {internalDocuments.length > 0 ? (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {internalDocuments.map((doc) => (
        <div
          key={doc.id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="mb-2 text-xs font-black uppercase tracking-wide text-[#b91c1c]">
            {doc.document_type || "Documento interno"}
          </div>

          <div className="break-all text-sm font-semibold text-gray-950">
            {doc.file_path || "Arquivo não informado"}
          </div>

          {doc.notes && (
            <div className="mt-3 rounded-md border border-gray-200 bg-gray-50 p-3 text-xs font-medium text-gray-700">
              {doc.notes}
            </div>
          )}

          <div className="mt-3 text-[11px] font-medium text-gray-400">
            {formatDate(doc.created_at)}
            {doc.uploaded_by ? ` • ${doc.uploaded_by}` : ""}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-700">
      Nenhum documento interno anexado.
    </div>
  )}

  <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <select
        value={internalDocumentDraft.document_type}
        onChange={(e) =>
          setInternalDocumentDraft((prev) => ({
            ...prev,
            document_type: e.target.value,
          }))
        }
        className="h-[44px] rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-900 outline-none focus:border-[#b91c1c]"
      >
        <option>Consulta crédito</option>
        <option>Contrato social</option>
        <option>Comprovante adicional</option>
        <option>Documento operacional</option>
        <option>Outros</option>
      </select>

     <label className="flex h-[44px] cursor-pointer items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition hover:border-[#b91c1c] hover:bg-gray-50">
  <span className="truncate">
    {internalDocumentFile
      ? internalDocumentFile.name
      : "Selecionar documento interno"}
  </span>

  <span className="ml-3 rounded-md bg-black px-3 py-1 text-xs font-bold text-white">
    Procurar
  </span>

  <input
    type="file"
    accept=".pdf,.jpg,.jpeg,.png"
    onChange={(e) =>
      setInternalDocumentFile(e.target.files?.[0] || null)
    }
    className="hidden"
  />
</label>
    </div>

    <textarea
      value={internalDocumentDraft.notes}
      onChange={(e) =>
        setInternalDocumentDraft((prev) => ({
          ...prev,
          notes: e.target.value,
        }))
      }
      placeholder="Observações internas do documento"
      className="mt-3 min-h-[90px] w-full rounded-md border border-gray-300 bg-white p-3 text-sm font-medium text-gray-900 outline-none focus:border-[#b91c1c]"
    />

    <div className="mt-3 flex justify-end">
      <button
        type="button"
        onClick={uploadInternalDocument}
        disabled={!internalDocumentFile || uploadingInternalDocument}
        className="rounded-md bg-black px-4 py-2 text-xs font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {uploadingInternalDocument
          ? "Enviando..."
          : "Enviar documento"}
      </button>
    </div>
  </div>
</Section>
</div>
          
          <div className="no-print">
            <Section title="Última alteração">
              {analysisLogs.length > 0 ? (
                <div className="max-w-3xl rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-xs font-black uppercase tracking-wide text-[#b91c1c]">
                        {getFieldLabel(analysisLogs[0].field_name)}
                      </div>

                      <div className="mt-2 text-sm font-semibold text-gray-900">
                        {formatLogValue(analysisLogs[0].old_value)} → {formatLogValue(analysisLogs[0].new_value)}
                      </div>

                      {analysisLogs[0].change_reason && (
                        <div className="mt-1 text-xs font-medium text-gray-500">
                          Motivo: {analysisLogs[0].change_reason}
                        </div>
                      )}
                    </div>

                    <div className="text-left text-xs font-medium text-gray-500 md:text-right">
                      <div>{formatDate(analysisLogs[0].created_at)}</div>
                      <div>Por: {analysisLogs[0].changed_by || "admin"}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl rounded-lg border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-700">
                  Nenhuma alteração registrada ainda.
                </div>
              )}
            </Section>
          </div>

          <footer className="mt-8 border-t border-gray-300 pt-4 text-xs font-medium text-gray-600">
            <div>ID do cadastro: {getDisplayId(data.display_id, data.id)}</div>
            <div>Documento gerado pelo sistema interno LOC7</div>
          </footer>
        </div>
      </main>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}

function normalizeDocuments(rawDocuments: unknown): string[] {
  if (Array.isArray(rawDocuments)) {
    return rawDocuments.filter(
      (item): item is string => typeof item === "string" && item.trim() !== ""
    );
  }

  if (typeof rawDocuments === "string") {
    try {
      const parsed = JSON.parse(rawDocuments);

      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item): item is string => typeof item === "string" && item.trim() !== ""
        );
      }
    } catch {
      return rawDocuments.trim() ? [rawDocuments] : [];
    }
  }

  return [];
}

function getDefaultChangeReason(field: string) {
  if (field === "internal_notes") return "Atualização de observação interna";
  if (field === "document_status") return "Alteração de status documental";
  return "Alteração de campo operacional";
}

function getFieldLabel(field: string) {
  if (field === "internal_status") return "Status interno";
  if (field === "public_status") return "Status público";
  if (field === "risk_level") return "Risco";
  if (field === "internal_notes") return "Observações internas";
  if (field === "document_status") return "Status documental";

  return field;
}

function formatLogValue(value?: string | null) {
  const cleanValue = String(value || "").trim();
  return cleanValue || "—";
}

function getDocumentStatus(documents: DocumentItem[], isPF: boolean) {
  const count = documents.length;

  if (isPF) {
    if (count === 0) {
      return {
        label: "Incompleto",
        tone: "border-red-300 bg-red-50 text-red-800",
        missing: ["Documento de identificação (RG ou CNH)"],
      };
    }

    if (count === 1) {
      return {
        label: "Pendente documentação",
        tone: "border-orange-300 bg-orange-50 text-orange-800",
        missing: ["Comprovante de residência"],
      };
    }

    return {
      label: "Completo",
      tone: "border-green-300 bg-green-50 text-green-800",
      missing: [],
    };
  }

  if (count <= 1) {
    return {
      label: "Incompleto",
      tone: "border-red-300 bg-red-50 text-red-800",
      missing: ["Cartão CNPJ", "Documento do responsável"],
    };
  }

  if (count === 2) {
    return {
      label: "Pendente documentação",
      tone: "border-orange-300 bg-orange-50 text-orange-800",
      missing: ["Contrato social"],
    };
  }

  return {
    label: "Completo",
    tone: "border-green-300 bg-green-50 text-green-800",
    missing: [],
  };
}

function formatDocumentStatusLabel(value?: string) {
  const v = normalize(value);

  if (v === "pendente") return "Pendente";
  if (v === "incompleto") return "Incompleto";
  if (v === "em_analise") return "Em análise";
  if (v === "aprovado") return "Aprovado";
  if (v === "reprovado") return "Reprovado";

  return value || "—";
}

function getDocumentStatusTone(value?: string) {
  const v = normalize(value);

  if (v === "aprovado") return "border-green-300 bg-green-50 text-green-800";
  if (v === "em_analise") return "border-yellow-300 bg-yellow-50 text-yellow-800";
  if (v === "incompleto") return "border-orange-300 bg-orange-50 text-orange-800";
  if (v === "reprovado") return "border-red-300 bg-red-50 text-red-800";
  if (v === "pendente") return "border-gray-300 bg-gray-50 text-gray-800";

  return "border-gray-300 bg-white text-gray-900";
}

function getDocumentName(path: string) {
  const parts = path.split("/");
  return parts[parts.length - 1] || path;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-4 rounded-lg border border-gray-200 bg-[#fafafa] p-4">
      <h2 className="mb-4 border-l-4 border-[#b91c1c] pl-3 text-lg font-black uppercase text-gray-950">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, value, className = "" }: any) {
  return (
    <div className={`rounded-md border border-gray-200 bg-white px-3 py-2 ${className}`}>
      <div className="text-[10px] font-bold uppercase text-gray-500 tracking-wide">{label}</div>
      <div className="text-sm font-semibold text-gray-950 leading-tight">{value || "—"}</div>
    </div>
  );
}

function SelectField({ label, value, options, onChange, tone }: any) {
  return (
    <label>
      <span className="text-xs font-black uppercase text-gray-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full mt-1 rounded-md border px-3 py-2 text-xs font-bold ${tone}`}
      >
        <option value="">—</option>
        {options.map((o: string) => (
          <option key={o} value={o}>
            {formatSelectOptionLabel(o)}
          </option>
        ))}
      </select>
    </label>
  );
}

function Pill({ label, value, tone }: any) {
  return (
    <div className={`px-3 py-1 text-xs font-bold rounded-full border ${tone}`}>
      {label}: {value || "—"}
    </div>
  );
}

function formatSelectOptionLabel(value: string) {
  if (value === "em_analise") return "Em análise";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getStatusTone(value?: string) {
  const v = normalize(value);

  if (v.includes("liberado")) return "border-green-300 bg-green-50 text-green-800";
  if (v.includes("pendente documentacao")) return "border-orange-300 bg-orange-50 text-orange-800";
  if (v.includes("analise")) return "border-yellow-300 bg-yellow-50 text-yellow-800";
  if (v.includes("recusado")) return "border-red-300 bg-red-50 text-red-800";
  if (v.includes("recebido") || v.includes("pendente")) return "border-gray-300 bg-gray-50 text-gray-800";

  return "border-gray-300 bg-white text-gray-900";
}

function getRiskTone(value?: string) {
  const v = normalize(value);

  if (v.includes("baixo")) return "border-green-300 bg-green-50 text-green-800";
  if (v.includes("medio")) return "border-yellow-300 bg-yellow-50 text-yellow-800";
  if (v.includes("alto")) return "border-red-300 bg-red-50 text-red-800";
  if (v.includes("restrito")) return "border-gray-900 bg-gray-900 text-white";

  return "border-gray-300 bg-white text-gray-900";
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function normalize(value?: string) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function formatDate(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleString("pt-BR");
}

function getDisplayId(displayId?: string, id?: string) {
  if (displayId) return displayId;

  if (!id) return "—";

  const short = id.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `LOC7-${short}`;
}

function getFileExtension(filename: string) {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop() : "file";
}
