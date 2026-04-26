import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { supabase } from "@/lib/supabase";

export default function AdminCadastroFicha() {
  const [, params] = useRoute("/admin-panel/cadastro/:id");
  const [, setLocation] = useLocation();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!params?.id) return;

    async function load() {
      const { data, error } = await supabase
        .from("rental_registrations")
        .select("*")
        .eq("id", params.id)
        .single();

      if (!error && data) setData(data);
    }

    load();
  }, [params]);

  if (!data) return <div className="p-6">Carregando...</div>;

  const f = data.form_data || {};
  const referencias = f.referencias || [];

  return (
    <div className="min-h-screen bg-neutral-950 py-8 px-4 print:bg-white print:p-0">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-card { box-shadow: none !important; border: none !important; }
          body { background: white !important; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto no-print mb-4 flex justify-between">
        <button
          onClick={() => setLocation("/admin-panel/cadastros")}
          className="text-sm text-gray-300 hover:text-white"
        >
          ← Voltar para lista
        </button>

        <button
          onClick={() => window.print()}
          className="bg-white text-black px-4 py-2 rounded text-sm font-semibold"
        >
          Imprimir / Gerar PDF
        </button>
      </div>

      <div className="print-card max-w-5xl mx-auto bg-white text-black rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-black text-white px-8 py-6">
          <p className="text-xs tracking-[0.25em] uppercase text-gray-400">
            LOC7 Equipamentos
          </p>
          <h1 className="text-3xl font-bold mt-2">Ficha de Cadastro</h1>
          <p className="text-sm text-gray-300 mt-1">
            Análise administrativa para locação de equipamentos
          </p>
        </div>

        <div className="px-8 py-6 border-b grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <Info label="Status interno" value={data.status_internal || "em análise"} />
          <Info label="Status público" value={data.status_public || "em análise"} />
          <Info label="Risco" value={data.risk || "normal"} />
          <Info
            label="Data"
            value={data.created_at ? new Date(data.created_at).toLocaleDateString("pt-BR") : "-"}
          />
        </div>

        <Section title="Dados principais">
          <Grid>
            <Info label="Nome / Razão Social" value={data.full_name || f.nomeCompleto || f.razaoSocial} />
            <Info label="Tipo" value={data.registration_type?.toUpperCase()} />
            <Info label="E-mail" value={data.email || f.email} />
            <Info label="Telefone" value={data.phone || f.telefone} />
          </Grid>
        </Section>

        <Section title="Documentos">
          <Grid>
            <Info label="CPF" value={f.cpf} />
            <Info label="CNPJ" value={f.cnpj} />
            <Info label="Data de nascimento" value={f.dataNascimento} />
            <Info label="Nome da mãe" value={f.nomeMae} />
            <Info label="Responsável" value={f.nomeResponsavel} />
          </Grid>
        </Section>

        <Section title="Endereço">
          <Grid>
            <Info label="CEP" value={f.cep} />
            <Info label="UF" value={f.uf} />
            <Info label="Cidade" value={f.cidade} />
            <Info label="Bairro" value={f.bairro} />
            <Info label="Endereço" value={f.endereco} />
            <Info label="Número" value={f.numero} />
            <Info label="Complemento" value={f.complemento} />
          </Grid>
        </Section>

        <Section title="Referências comerciais">
          {referencias.length > 0 ? (
            <div className="space-y-4">
              {referencias.map((ref: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <p className="font-semibold mb-2">Referência {index + 1}</p>
                  <Grid>
                    <Info label="Empresa" value={ref.empresa} />
                    <Info label="Contato" value={ref.nome} />
                    <Info label="Telefone" value={ref.telefone} />
                  </Grid>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nenhuma referência cadastrada.</p>
          )}
        </Section>

        <Section title="Observações internas">
          <div className="min-h-[90px] border rounded-lg p-4 bg-gray-50 text-sm text-gray-600">
            {data.internal_notes || "Sem observações internas registradas."}
          </div>
        </Section>

        <div className="px-8 py-6 border-t text-xs text-gray-500 flex justify-between">
          <span>Documento gerado pelo sistema interno Loc7.</span>
          <span>ID: {data.id}</span>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="px-8 py-6 border-b">
      <h2 className="text-lg font-bold mb-4 text-gray-900">{title}</h2>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function Info({ label, value }: { label: string; value?: any }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value || "-"}</p>
    </div>
  );
}
