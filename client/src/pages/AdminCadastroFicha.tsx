import { useEffect, useState, type ReactNode } from "react";
import { Link, useRoute } from "wouter";
import { supabase } from "@/lib/supabase";

export default function AdminCadastroFicha() {
  const [, params] = useRoute("/admin-panel/cadastro/:id");
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!params?.id) return;

    const load = async () => {
      const { data, error } = await supabase
        .from("rental_registrations")
        .select("*")
        .eq("id", params.id)
        .single();

      if (!error && data) setData(data);
    };

    load();
  }, [params]);

  async function updateField(field: string, value: string) {
    if (!data?.id) return;

    setSaving(true);

    const { error } = await supabase
      .from("rental_registrations")
      .update({ [field]: value })
      .eq("id", data.id);

    if (!error) {
      setData((prev: any) => ({ ...prev, [field]: value }));
    } else {
      alert("Erro ao salvar alteração.");
    }

    setSaving(false);
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 text-gray-700">
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
          <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
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
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight">
                  Ficha de Cadastro {isPF ? "PF" : "PJ"}
                </h1>
                <p className="mt-1 text-sm font-medium text-gray-500">
                  Controle operacional / análise de cadastro
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Data: {formatDate(data.created_at)}
                </p>
              </div>

              <div className="grid gap-3 no-print md:min-w-[360px]">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <SelectField
                    label="Status interno"
                    value={data.status_internal || ""}
                    onChange={(value) => updateField("status_internal", value)}
                    options={[
                      "Recebido",
                      "Em análise",
                      "Liberado",
                      "Recusado interno",
                      "Pendente documentação",
                    ]}
                  />

                  <SelectField
                    label="Status público"
                    value={data.status_public || ""}
                    onChange={(value) => updateField("status_public", value)}
                    options={[
                      "Recebido",
                      "Em análise",
                      "Liberado",
                      "Pendente contato",
                    ]}
                  />

                  <SelectField
                    label="Risco"
                    value={data.risk || ""}
                    onChange={(value) => updateField("risk", value)}
                    options={["Baixo", "Médio", "Alto", "Restrito"]}
                  />
                </div>

                {saving && (
                  <div className="text-right text-xs font-semibold text-gray-500">
                    Salvando...
                  </div>
                )}
              </div>

              <div className="hidden print:block text-sm">
                <div>Status interno: {data.status_internal || "—"}</div>
                <div>Status público: {data.status_public || "—"}</div>
                <div>Risco: {data.risk || "—"}</div>
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
                  <Field label="Responsável" value={form.nomeResponsavel} />
                  <Field label="E-mail" value={form.email} />
                  <Field label="Telefone" value={form.telefone} />
                </>
              )}
            </div>
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
            {Array.isArray(form.referencias) && form.referencias.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {form.referencias.map((ref: any, index: number) => (
                  <div key={index} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="mb-2 text-xs font-bold uppercase text-[#b91c1c]">
                      Referência {index + 1}
                    </div>
                    <div className="text-base font-bold">
                      {ref.empresa || "Empresa não informada"}
                    </div>
                    <div className="mt-2 text-sm">
                      <strong>Contato:</strong> {ref.nome || "—"}
                    </div>
                    <div className="text-sm">
                      <strong>Telefone:</strong> {ref.telefone || "—"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 bg-white p-5 text-sm text-gray-500">
                Nenhuma referência cadastrada
              </div>
            )}
          </Section>

          <Section title="Observações internas">
            <textarea
              className="no-print min-h-[120px] w-full rounded-lg border border-gray-200 bg-white p-4 text-sm outline-none focus:border-[#b91c1c]"
              value={data.internal_notes || ""}
              onChange={(e) =>
                setData((prev: any) => ({
                  ...prev,
                  internal_notes: e.target.value,
                }))
              }
              onBlur={(e) => updateField("internal_notes", e.target.value)}
              placeholder="Adicione observações internas sobre análise, contato, documentação ou restrições..."
            />

            <div className="hidden print:block rounded-lg border border-gray-200 bg-white p-4 text-sm">
              {data.internal_notes || "Sem observações internas registradas"}
            </div>
          </Section>

          <footer className="mt-8 border-t border-gray-300 pt-4 text-xs text-gray-500">
            <div>ID do cadastro: {data.id}</div>
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

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-6 rounded-xl border border-gray-200 bg-[#fafafa] p-5 shadow-sm print:bg-white print:shadow-none">
      <h2 className="mb-4 border-l-4 border-[#b91c1c] pl-3 text-lg font-bold uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, value, className = "" }: any) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 ${className}`}>
      <div className="text-xs font-bold uppercase text-gray-500">{label}</div>
      <div className="text-sm font-semibold">{value || "—"}</div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-bold uppercase text-gray-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-[#b91c1c]"
      >
        <option value="">—</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function formatDate(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleString("pt-BR");
}
