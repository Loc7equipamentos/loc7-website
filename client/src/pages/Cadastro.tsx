import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type TipoCadastro = "pf" | "pj";

const TOTAL_STEPS = 6;

type FormState = {
  tipo: TipoCadastro;
  nomeCompleto: string;
  razaoSocial: string;
  email: string;
  telefone: string;
  cep: string;
  uf: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  nomeMae: string;
  cnhValida: string;
  ocupacao: string;
  cnpj: string;
  responsavel: string;
};

function formatPhone(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function formatDate(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2");
}

export default function CadastroPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<FormState>({
    tipo: "pf",
    nomeCompleto: "",
    razaoSocial: "",
    email: "",
    telefone: "",
    cep: "",
    uf: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    cpf: "",
    rg: "",
    dataNascimento: "",
    nomeMae: "",
    cnhValida: "",
    ocupacao: "",
    cnpj: "",
    responsavel: "",
  });

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const progress = useMemo(() => {
    return Math.round((step / TOTAL_STEPS) * 100);
  }, [step]);

  function nextStep() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    setLoading(true);

    const { error } = await supabase.from("rental_registrations").insert([
      {
        full_name:
          form.tipo === "pf" ? form.nomeCompleto : form.razaoSocial,
        email: form.email,
        phone: form.telefone,
        registration_type: form.tipo,
        status_internal: "Novo cadastro",
        status_public: "Cadastro recebido",
        risk: "Não avaliado",
      },
    ]);

    setLoading(false);

    if (!error) setSuccess(true);
  }

  if (success) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white">
        Cadastro enviado com sucesso
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-6">Cadastro Loc7</h1>

        {/* PROGRESS */}
        <div className="mb-6">
          Etapa {step} de {TOTAL_STEPS} ({progress}%)
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <button onClick={() => update("tipo", "pf")}>Pessoa Física</button>
            <button onClick={() => update("tipo", "pj")}>Pessoa Jurídica</button>
            <button onClick={nextStep}>Próximo</button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <input
              placeholder="Nome"
              value={form.nomeCompleto}
              onChange={(e) => update("nomeCompleto", e.target.value)}
            />

            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />

            <input
              placeholder="Telefone"
              value={form.telefone}
              onChange={(e) =>
                update("telefone", formatPhone(e.target.value))
              }
            />

            <button onClick={prevStep}>Voltar</button>
            <button onClick={nextStep}>Próximo</button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <input
              placeholder="CEP"
              value={form.cep}
              onChange={(e) => update("cep", e.target.value)}
            />

            <button onClick={prevStep}>Voltar</button>
            <button onClick={nextStep}>Próximo</button>
          </div>
        )}

        {/* STEP 4 PF */}
        {step === 4 && form.tipo === "pf" && (
          <div>
            <input
              placeholder="CPF"
              value={form.cpf}
              onChange={(e) => update("cpf", e.target.value)}
            />

            <input
              placeholder="Data nascimento"
              value={form.dataNascimento}
              onChange={(e) =>
                update("dataNascimento", formatDate(e.target.value))
              }
            />

            <button onClick={prevStep}>Voltar</button>
            <button onClick={nextStep}>Próximo</button>
          </div>
        )}

        {/* STEP 4 PJ */}
        {step === 4 && form.tipo === "pj" && (
          <div>
            <input
              placeholder="CNPJ"
              value={form.cnpj}
              onChange={(e) => update("cnpj", e.target.value)}
            />

            <button onClick={prevStep}>Voltar</button>
            <button onClick={nextStep}>Próximo</button>
          </div>
        )}

        {/* FINAL */}
        {step === 6 && (
          <div>
            <button onClick={prevStep}>Voltar</button>
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
