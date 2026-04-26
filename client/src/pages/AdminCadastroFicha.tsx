import { useEffect, useState, type ReactNode } from "react";
import { Link, useRoute } from "wouter";
import { supabase } from "@/lib/supabase";

const logoCandidates = [
  "/logo.png",
  "/loc7-logo.png",
  "/logo-loc7.png",
  "/images/logo.png",
];

export default function AdminCadastroFicha() {
  const [, params] = useRoute("/admin-panel/cadastro/:id");
  const [data, setData] = useState<any>(null);
  const [logoIndex, setLogoIndex] = useState(0);

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

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 text-gray-700">
        Carregando ficha...
      </div>
    );
  }

  const form = data.form_data || {};
  const isPF = data.registration_type === "pf";
  const logoSrc = logoCandidates[logoIndex];

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
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                {logoIndex < logoCandidates.length ? (
                  <img
                    src={logoSrc}
                    alt="Loc7 Equipamentos"
                    className="h-16 max-w-[180px] object-contain"
                    onError={() => setLogoIndex((i) => i + 1)}
                  />
                ) : (
                  <div className="text-4xl font-black tracking-tight">
                    Loc<span className="text-[#b91c1c]">7</span>
                  </div>
                )}

                <div>
                  <h1 className="text-2xl font-black uppercase tracking-tight">
                    Ficha de Cadastro {isPF ? "PF" : "PJ"}
                  </h1>
                  <p className="mt-1 text-sm font-medium text-gray-500">
                    Controle operacional / análise de cadastro
                  </p>
                </div>
              </div>

              <div className="grid gap-2 text-sm md:text-right">
                <div>
                  <span className="font-semibold text-gray-500">Data: </span>
                  {formatDate(data.created_at)}
                </div>
                <div className="flex gap-2 md:justify-end">
                  <Badge label="Status" value={data.status_public || "—"} />
                  <Badge label="Risco" value={data.risk || "—"} />
                </div>
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
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-3 text-xs font-black uppercase tracking-wide text-[#b91c1c]">
                      Referência {index + 1}
                    </div>
                    <div className="text-base font-black text-gray-900">
                      {ref.empresa || "Empresa não informada"}
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      <strong>Contato:</strong> {ref.nome || "—"}
                    </div>
                    <div className="text-sm text-gray-700">
                      <strong>Telefone:</strong> {ref.telefone || "—"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 bg-white p-5 text-sm font-medium text-gray-500">
                Nenhuma referência cadastrada
              </div>
            )}
          </Section>

          <Section title="Observações internas">
            <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-700">
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
          main { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-6 rounded-xl border border-gray-200 bg-[#fafafa] p-5 shadow-sm print:break-inside-avoid print:bg-white print:shadow-none">
      <h2 className="mb-4 border-l-4 border-[#b91c1c] pl-3 text-lg font-black uppercase tracking-tight text-gray-900">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  className = "",
}: {
  label: string;
  value?: any;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm ${className}`}>
      <div className="mb-1 text-[11px] font-black uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className="text-base font-semibold text-gray-900">
        {value || "—"}
      </div>
    </div>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
      <span className="text-gray-500">{label}: </span>
      {value}
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleString("pt-BR");
}
