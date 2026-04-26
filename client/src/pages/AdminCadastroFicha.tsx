import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { supabase } from "@/lib/supabase";

export default function AdminCadastroFicha() {
  const [, params] = useRoute("/admin-panel/cadastro/:id");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!params?.id) return;

    const load = async () => {
      const { data, error } = await supabase
        .from("rental_registrations")
        .select("*")
        .eq("id", params.id)
        .single();

      if (!error && data) {
        setData(data);
      }
    };

    load();
  }, [params]);

  if (!data) {
    return <div className="p-6">Carregando...</div>;
  }

  const form = data.form_data || {};
  const isPF = data.registration_type === "pf";

  return (
    <div className="min-h-screen bg-gray-100 p-6 print:bg-white">
      {/* TOPO */}
      <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center no-print">
        <Link href="/admin-panel/cadastros">
          <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            ← Voltar
          </button>
        </Link>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-black text-white rounded hover:opacity-80"
        >
          Imprimir / PDF
        </button>
      </div>

      {/* CARD PRINCIPAL */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8 print:shadow-none print:p-0">
        {/* HEADER */}
        <div className="mb-6 border-b pb-4">
          <h1 className="text-xl font-bold">LOC7 EQUIPAMENTOS</h1>
          <h2 className="text-lg mt-1">
            Ficha de Cadastro {isPF ? "PF" : "PJ"}
          </h2>

          <div className="text-sm text-gray-500 mt-2">
            Data: {new Date(data.created_at).toLocaleString()}
          </div>

          <div className="flex gap-4 mt-2 text-sm">
            <span>Status: {data.status_public || "—"}</span>
            <span>Risco: {data.risk || "—"}</span>
          </div>
        </div>

        {/* DADOS PRINCIPAIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {isPF ? (
            <>
              <Field label="Nome completo" value={form.nomeCompleto} />
              <Field label="CPF" value={form.cpf} />
              <Field label="Data de nascimento" value={form.dataNascimento} />
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
        </div>

        {/* ENDEREÇO */}
        <Section title="Endereço">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="CEP" value={form.cep} />
            <Field label="UF" value={form.uf} />
            <Field label="Cidade" value={form.cidade} />
            <Field label="Bairro" value={form.bairro} />
            <Field label="Endereço" value={form.endereco} />
            <Field label="Número" value={form.numero} />
            <Field label="Complemento" value={form.complemento} />
          </div>
        </Section>

        {/* REFERÊNCIAS */}
        <Section title="Referências Comerciais">
          {form.referencias && form.referencias.length > 0 ? (
            <div className="space-y-4">
              {form.referencias.map((ref: any, i: number) => (
                <div
                  key={i}
                  className="border p-4 rounded bg-gray-50"
                >
                  <div className="font-semibold">
                    {ref.empresa || "Empresa não informada"}
                  </div>
                  <div className="text-sm">
                    Contato: {ref.nome || "—"}
                  </div>
                  <div className="text-sm">
                    Telefone: {ref.telefone || "—"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              Nenhuma referência cadastrada
            </div>
          )}
        </Section>

        {/* OBSERVAÇÕES */}
        <Section title="Observações Internas">
          <div className="text-sm">
            {data.internal_notes || "Sem observações internas registradas"}
          </div>
        </Section>

        {/* RODAPÉ */}
        <div className="mt-8 pt-4 border-t text-xs text-gray-500">
          <div>ID do cadastro: {data.id}</div>
          <div>Documento gerado pelo sistema interno Loc7</div>
        </div>
      </div>

      {/* PRINT STYLE */}
      <style>
        {`
          @media print {
            .no-print {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
}

/* COMPONENTES AUXILIARES */

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium">
        {value || "—"}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h3 className="text-md font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}
