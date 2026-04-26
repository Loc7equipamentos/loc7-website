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
      alert("Erro ao salvar alteração");
    }

    setSaving(false);
  }

  if (!data) {
    return <div className="p-6">Carregando...</div>;
  }

  const form = data.form_data || {};
  const isPF = data.registration_type === "pf";

  return (
    <div className="min-h-screen bg-[#f3f4f6] px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* TOPO */}
        <div className="mb-5 flex justify-between no-print">
          <Link href="/admin-panel/cadastros">
            <button className="border px-4 py-2 rounded">
              ← Voltar
            </button>
          </Link>

          <button
            onClick={() => window.print()}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Imprimir
          </button>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-xl border shadow">

          {/* HEADER */}
          <div className="border-b p-6">
            <div className="flex justify-between items-start flex-wrap gap-4">

              <div>
                <h1 className="text-2xl font-bold">
                  Ficha de Cadastro {isPF ? "PF" : "PJ"}
                </h1>
                <p className="text-sm text-gray-500">
                  {new Date(data.created_at).toLocaleString("pt-BR")}
                </p>
              </div>

              {/* STATUS */}
              <div className="grid grid-cols-3 gap-3 min-w-[300px]">

                <SelectField
                  label="Status interno"
                  value={data.status_internal || ""}
                  onChange={(v) => updateField("status_internal", v)}
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
                  onChange={(v) => updateField("status_public", v)}
                  options={[
                    "Recebido",
                    "Em análise",
                    "Liberado",
                  ]}
                />

                <SelectField
                  label="Risco"
                  value={data.risk || ""}
                  onChange={(v) => updateField("risk", v)}
                  options={[
                    "Baixo",
                    "Médio",
                    "Alto",
                    "Restrito",
                  ]}
                />

              </div>

            </div>

            {saving && (
              <div className="text-xs text-gray-500 mt-2">
                Salvando...
              </div>
            )}
          </div>

          {/* DADOS */}
          <Section title={isPF ? "Dados pessoais" : "Dados da empresa"}>
            <Grid>
              {isPF ? (
                <>
                  <Field label="Nome completo" value={form.nomeCompleto} />
                  <Field label="CPF" value={form.cpf} />
                  <Field label="Data nascimento" value={form.dataNascimento} />
                  <Field label="Nome da mãe" value={form.nomeMae} />
                  <Field label="Email" value={form.email} />
                  <Field label="Telefone" value={form.telefone} />
                </>
              ) : (
                <>
                  <Field label="Razão social" value={form.razaoSocial} />
                  <Field label="CNPJ" value={form.cnpj} />
                  <Field label="Responsável" value={form.nomeResponsavel} />
                  <Field label="Email" value={form.email} />
                  <Field label="Telefone" value={form.telefone} />
                </>
              )}
            </Grid>
          </Section>

          {/* ENDEREÇO */}
          <Section title="Endereço">
            <Grid>
              <Field label="CEP" value={form.cep} />
              <Field label="Endereço" value={form.endereco} />
              <Field label="Número" value={form.numero} />
              <Field label="Complemento" value={form.complemento} />
              <Field label="Cidade" value={form.cidade} />
              <Field label="UF" value={form.uf} />
            </Grid>
          </Section>

          {/* OBS */}
          <Section title="Observações internas">
            <textarea
              className="w-full border rounded p-3"
              value={data.internal_notes || ""}
              onChange={(e) =>
                setData({ ...data, internal_notes: e.target.value })
              }
              onBlur={(e) =>
                updateField("internal_notes", e.target.value)
              }
            />
          </Section>

        </div>
      </div>
    </div>
  );
}

/* COMPONENTES */

function Section({ title, children }: any) {
  return (
    <div className="p-6 border-b">
      <h2 className="font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Grid({ children }: any) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {children}
    </div>
  );
}

function Field({ label, value }: any) {
  return (
    <div className="border rounded p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium">{value || "—"}</div>
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
        className="w-full border rounded px-2 py-2 text-sm"
      >
        <option value="">—</option>
        {options.map((o: string) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
