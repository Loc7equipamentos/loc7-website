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
      console.error("ERRO SUPABASE:", error);

      alert(
        `Erro ao salvar alteração:\n\n${error.message || "Sem mensagem"}`
      );
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

      <main className="mx-auto max-w-5xl rounded-xl border border-gray-200 bg-white shadow-lg">
        <div className="h-1.5 rounded-t-xl bg-[#b91c1c]" />

        <div className="p-8">
          <header className="mb-8 border-b border-gray-300 pb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-2xl font-black uppercase">
                  Ficha de Cadastro {isPF ? "PF" : "PJ"}
                </h1>
                <p className="text-sm text-gray-500">
                  Controle operacional / análise de cadastro
                </p>
              </div>

              <div className="grid gap-3 md:min-w-[360px]">
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
                    ]}
                  />

                  <SelectField
                    label="Risco"
                    value={data.risk || ""}
                    onChange={(value) => updateField("risk", value)}
                    options={[
                      "Baixo",
                      "Médio",
                      "Alto",
                      "Restrito",
                    ]}
                  />
                </div>

                {saving && (
                  <div className="text-right text-xs text-gray-500">
                    Salvando...
                  </div>
                )}
              </div>
            </div>
          </header>

          <Section title="Dados pessoais">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nome completo" value={form.nomeCompleto} />
              <Field label="CPF" value={form.cpf} />
              <Field label="Data de nascimento" value={form.dataNascimento} />
              <Field label="Nome da mãe" value={form.nomeMae} />
              <Field label="E-mail" value={form.email} />
              <Field label="Telefone" value={form.telefone} />
            </div>
          </Section>
        </div>
      </main>
    </div>
  );
}

/* COMPONENTES */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-6 border p-4 rounded-lg">
      <h2 className="mb-4 font-bold uppercase">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, value }: any) {
  return (
    <div className="border p-3 rounded">
      <div className="text-xs text-gray-500">{label}</div>
      <div>{value || "—"}</div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }: any) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-2 py-2"
      >
        <option value="">—</option>
        {options.map((o: string) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
