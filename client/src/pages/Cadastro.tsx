import { useMemo, useState, useEffect } from "react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";

type TipoCadastro = "pf" | "pj";

const TOTAL_STEPS = 6;
const MAX_DOCUMENT_SIZE_MB = 10;

function formatCPF(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatCNPJ(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function formatRG(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 9)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1})$/, "$1-$2");
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

function formatCEP(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function formatDateBR(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2");
}


function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}
export default function CadastroPage() {
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState<TipoCadastro>("pf");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
  setSuccess(false);
}, []);
  const [cadastroId, setCadastroId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [formState, setFormState] = useState<Record<string, string>>({});
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);

  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [rg, setRg] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");

  const progress = useMemo(() => {
    return Math.round((step / TOTAL_STEPS) * 100);
  }, [step]);

  function updateForm(name: string, value: string) {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function buscarCep(value: string) {
    const clean = value.replace(/\D/g, "");
    if (clean.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setEndereco(data.logradouro || "");
        setBairro(data.bairro || "");
        setCidade(data.localidade || "");
        setUf(data.uf || "");

        updateForm("endereco", data.logradouro || "");
        updateForm("bairro", data.bairro || "");
        updateForm("cidade", data.localidade || "");
        updateForm("uf", data.uf || "");
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
    }
  }
  async function uploadDocuments(registrationId: string) {
  if (documentFiles.length === 0) return [];

  const uploadedPaths: string[] = [];

  for (const documentFile of documentFiles) {
    const safeFileName =
      sanitizeFileName(documentFile.name) || `documento-${Date.now()}`;

    const storagePath = `${registrationId}/${Date.now()}-${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(storagePath, documentFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    uploadedPaths.push(storagePath);
  }

  return uploadedPaths;
}
function validateStep(step: number, formState: any, tipo: string): { valid: boolean; message?: string } {
  if (step === 1) {
    if (!tipo) {
      return { valid: false, message: "Selecione o tipo de cadastro (PF ou PJ)." };
    }
  }

  if (step === 2) {
    const nome = tipo === "pf" ? formState.nomeCompleto : formState.razaoSocial;

    if (!nome?.trim()) {
      return { valid: false, message: "Preencha o nome ou razão social." };
    }

    if (!formState.email?.trim()) {
      return { valid: false, message: "Preencha o e-mail antes de continuar." };
    }

    if (!formState.telefone?.trim()) {
      return { valid: false, message: "Informe um telefone válido." };
    }
  }

  if (step === 3) {
    if (!formState.cep?.trim()) return { valid: false, message: "Preencha o CEP antes de avançar." };
    if (!formState.uf?.trim()) return { valid: false, message: "Informe o estado (UF)." };
    if (!formState.cidade?.trim()) return { valid: false, message: "Informe a cidade." };
    if (!formState.endereco?.trim()) return { valid: false, message: "Informe o endereço." };
    if (!formState.numero?.trim()) return { valid: false, message: "Informe o número." };
    if (!formState.bairro?.trim()) return { valid: false, message: "Informe o bairro." };
  }

  if (step === 4 && tipo === "pf") {
    if (!formState.cpf?.trim()) return { valid: false, message: "Informe o CPF." };
    if (!formState.dataNascimento?.trim()) return { valid: false, message: "Informe a data de nascimento." };
    if (!formState.nomeMae?.trim()) return { valid: false, message: "Informe o nome da mãe." };
  }

  if (step === 4 && tipo === "pj") {
    if (!formState.cnpj?.trim()) return { valid: false, message: "Informe o CNPJ." };
    if (!formState.responsavel?.trim()) return { valid: false, message: "Informe o nome do responsável." };
  }

  if (step === 5) {
   const refs = tipo === "pf"
  ? [
      { empresa: formState.empresa1, contato: formState.nomeContato1, telefone: formState.telefoneContato1 },
      { empresa: formState.empresa2, contato: formState.nomeContato2, telefone: formState.telefoneContato2 },
      { empresa: formState.empresa3, contato: formState.nomeContato3, telefone: formState.telefoneContato3 },
    ]
  : [
      { empresa: formState.empresa1Pj, contato: formState.nomeContato1Pj, telefone: formState.telefoneContato1Pj },
      { empresa: formState.empresa2Pj, contato: formState.nomeContato2Pj, telefone: formState.telefoneContato2Pj },
      { empresa: formState.empresa3Pj, contato: formState.nomeContato3Pj, telefone: formState.telefoneContato3Pj },
    ];

    const validRefs = refs.filter(
      (r) => r.empresa?.trim() && r.contato?.trim() && r.telefone?.trim()
    );

    if (validRefs.length < 1) {
      return {
        valid: false,
        message: "Preencha pelo menos uma referência comercial completa (empresa, contato e telefone)."
      };
    }
  }

  return { valid: true };
}
  function nextStep() {
  const result = validateStep(step, formState, tipo);

  if (!result.valid) {
    setError(result.message || "Erro de validação");
    return;
  }

  setError("");
  setStep((current) => Math.min(current + 1, TOTAL_STEPS));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

  function prevStep() {
    setError("");
    setStep((current) => Math.max(current - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
if (documentFiles.length === 0) {
  setError("Envie o documento obrigatório para concluir o cadastro.");
  return;
}
    setLoading(true);
    setError("");

    const email = formState.email || "";
    const phone = formState.telefone || "";

    const fullName =
      tipo === "pf"
        ? formState.nomeCompleto || ""
        : formState.razaoSocial || "";

    if (!fullName) {
      setError("Preencha o nome completo ou razão social.");
      setStep(2);
      setLoading(false);
      return;
    }

    if (!email) {
      setError("Preencha o e-mail.");
      setStep(2);
      setLoading(false);
      return;
    }

    if (!phone) {
      setError("Preencha o telefone.");
      setStep(2);
      setLoading(false);
      return;
    }

    try {
    const payload = {
  full_name: fullName,
  email,
  phone,
  registration_type: tipo,
  form_data: formState,
};

     const { data: insertData, error: insertError } = await supabase
  .from("rental_registrations")
  .insert([payload])
  .select()
  .single();

      if (insertError) {
        console.error("Erro Supabase:", insertError);
        setError(`Erro ao salvar cadastro: ${insertError.message}`);
        setLoading(false);
        return;
      }
if (!insertData?.id) {
  setError("Cadastro salvo, mas não foi possível obter o ID do registro.");
  setLoading(false);
  return;
}

setCadastroId(insertData.id);


      const documentPaths = await uploadDocuments(insertData.id);

const updatedFormData = {
  ...formState,
  documents: documentPaths,
};

const { error: updateError } = await supabase
  .from("rental_registrations")
  .update({
    form_data: updatedFormData,
    documents: documentPaths,
  })
  .eq("id", insertData.id);

if (updateError) {
  console.error("Erro ao salvar documentos no cadastro:", updateError);
  setError(
    "Cadastro recebido, mas houve erro ao vincular os documentos. Entre em contato com a Loc7."
  );
  setLoading(false);
  return;
}
      setSuccess(true);

      setStep(1);
      setTelefone("");
      setCpf("");
      setCnpj("");
      setRg("");
      setCep("");
      setEndereco("");
      setBairro("");
      setCidade("");
      setUf("");
      setTipo("pf");
      setFormState({});
     setDocumentFiles([]);
    } catch (err) {
      console.error("Erro inesperado:", err);
      setError("Erro inesperado ao enviar o cadastro.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-zinc-950 outline-none transition focus:border-zinc-900 focus:bg-white focus:ring-2 focus:ring-zinc-900/10";

  const labelClass = "mb-2 block text-sm font-medium text-zinc-700";

  const sectionClass =
    "rounded-2xl border border-black/10 bg-white p-6 shadow-sm";

if (success) {
  const whatsappLink = `https://wa.me/5511919671611?text=Olá! Acabei de concluir meu cadastro no site da LOC7 e gostaria de falar com um especialista.`;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#111214] px-4 py-16 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_42%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative w-full max-w-xl animate-[fadeIn_0.7s_ease-out] text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
          <span className="text-3xl text-emerald-400">✓</span>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-emerald-400">
          Cadastro recebido
        </p>

        <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
          Tudo certo. Seu cadastro está em análise.
        </h1>

        <p className="mt-4 text-sm text-zinc-400 md:text-base">
          Agora você já pode falar com um especialista e agilizar sua locação.
        </p>

        <div className="mt-6 inline-flex items-center rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-sm text-orange-300">
          Status: Em validação
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-xs rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Falar com especialista no WhatsApp
          </a>

          <a
            href={`/status-cadastro/${cadastroId}`}
            className="text-sm text-zinc-400 underline hover:text-white"
          >
            Acompanhar status do cadastro
          </a>
        </div>
      </div>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-[#d6d7da] px-4 py-10 text-zinc-900">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-zinc-600">
            Loc7 Equipamentos
          </p>

          <h1 className="mb-2 text-4xl font-semibold text-zinc-950">
            Cadastro para locação
          </h1>

          <p className="mx-auto max-w-3xl text-zinc-600">
            Este cadastro é necessário para liberação de equipamentos. Após o
            envio, nossa equipe fará a validação.
          </p>
        </header>

        <div className="mb-8 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-zinc-700">
              Etapa{" "}
              <span className="font-semibold text-orange-600">{step}</span> de{" "}
              {TOTAL_STEPS}
            </span>

            <span className="text-sm text-zinc-500">{progress}% concluído</span>
          </div>

          <div className="relative flex items-center">
            <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-zinc-300" />

            <div
              className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-emerald-600 transition-all duration-500 ease-out"
              style={{
                width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%`,
              }}
            />

            <div className="relative z-10 flex w-full items-center justify-between">
              {Array.from({ length: TOTAL_STEPS }).map((_, index) => {
                const currentStep = index + 1;
                const isCompleted = currentStep < step;
                const isCurrent = currentStep === step;

                return (
                  <div
                    key={currentStep}
                    className={`flex h-3 w-3 items-center justify-center rounded-full transition-all duration-300 ${
                      isCompleted
                        ? "bg-emerald-600"
                        : isCurrent
                          ? "scale-110 border-2 border-orange-500 bg-white"
                          : "border-2 border-zinc-300 bg-white"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          onChange={(e) => {
            const target = e.target as HTMLInputElement | HTMLSelectElement;

            if (target.name && target.type !== "file") {
              if (target.name.toLowerCase().includes("telefone")) {
  updateForm(target.name, formatPhone(target.value));
} else {
  updateForm(target.name, target.value);
}
            }
          }}
          className="space-y-8"
        >
          <input type="hidden" name="tipoCadastro" value={tipo} readOnly />

          {step === 1 && (
            <section className={sectionClass}>
              <h2 className="mb-2 text-2xl font-semibold text-zinc-950">
                1. Tipo de cadastro
              </h2>

              <p className="mb-6 text-sm text-zinc-600">
                Escolha se o cadastro será feito como pessoa física ou pessoa
                jurídica.
              </p>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setTipo("pf")}
                  className={`rounded-xl border px-4 py-4 font-semibold transition ${
                    tipo === "pf"
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : "border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50"
                  }`}
                >
                  Pessoa Física
                </button>

                <button
                  type="button"
                  onClick={() => setTipo("pj")}
                  className={`rounded-xl border px-4 py-4 font-semibold transition ${
                    tipo === "pj"
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : "border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50"
                  }`}
                >
                  Pessoa Jurídica
                </button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className={sectionClass}>
              <h2 className="mb-2 text-2xl font-semibold text-zinc-950">
                2. Dados principais
              </h2>

              <p className="mb-6 text-sm text-zinc-600">
                Informe os principais dados de contato para validação da equipe
                Loc7.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {tipo === "pf" ? (
                  <div>
                    <label className={labelClass}>Nome completo</label>
                    <input
                      name="nomeCompleto"
                      required
                      value={formState.nomeCompleto || ""}
                      onChange={(e) =>
                        updateForm("nomeCompleto", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Seu nome completo"
                    />
                  </div>
                ) : (
                  <div>
                    <label className={labelClass}>Razão social</label>
                    <input
                      name="razaoSocial"
                      required
                      value={formState.razaoSocial || ""}
                      onChange={(e) =>
                        updateForm("razaoSocial", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Razão social da empresa"
                    />
                  </div>
                )}

                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formState.email || ""}
                    onChange={(e) => updateForm("email", e.target.value)}
                    className={inputClass}
                    placeholder="voce@email.com"
                  />
                </div>

                <div>
                  <label className={labelClass}>Telefone</label>
                  <input
                    name="telefone"
                    required
                    value={telefone}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      setTelefone(formatted);
                      updateForm("telefone", formatted);
                    }}
                    className={inputClass}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className={labelClass}>Rede social</label>
                  <input
                    name="redeSocial"
                    value={formState.redeSocial || ""}
                    onChange={(e) => updateForm("redeSocial", e.target.value)}
                    className={inputClass}
                    placeholder="@instagram ou link"
                  />
                </div>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className={sectionClass}>
              <h2 className="mb-2 text-2xl font-semibold text-zinc-950">
                3. Endereço
              </h2>

              <p className="mb-6 text-sm text-zinc-600">
                Endereço usado para análise cadastral e conferência de dados.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>CEP</label>
                  <input
                    name="cep"
                    required
                    value={cep}
                    onChange={(e) => {
                      const formatted = formatCEP(e.target.value);
                      setCep(formatted);
                      updateForm("cep", formatted);

                      if (formatted.replace(/\D/g, "").length === 8) {
                        buscarCep(formatted);
                      }
                    }}
                    className={inputClass}
                    placeholder="00000-000"
                  />
                </div>

                <div>
                  <label className={labelClass}>UF</label>
                  <input
                    name="uf"
                    required
                    value={uf}
                    onChange={(e) => {
                      const upper = e.target.value.toUpperCase();
                      setUf(upper);
                      updateForm("uf", upper);
                    }}
                    maxLength={2}
                    className={inputClass}
                    placeholder="SP"
                  />
                </div>

                <div>
                  <label className={labelClass}>Endereço</label>
                  <input
                    name="endereco"
                    required
                    value={endereco}
                    onChange={(e) => {
                      setEndereco(e.target.value);
                      updateForm("endereco", e.target.value);
                    }}
                    className={inputClass}
                    placeholder="Rua / Avenida"
                  />
                </div>

                <div>
                  <label className={labelClass}>Número</label>
                  <input
                    name="numero"
                    required
                    value={formState.numero || ""}
                    onChange={(e) => updateForm("numero", e.target.value)}
                    className={inputClass}
                    placeholder="Número"
                  />
                </div>
<div>
  <label className={labelClass}>Complemento</label>
  <input
    name="complemento"
    value={formState.complemento || ""}
    onChange={(e) => updateForm("complemento", e.target.value)}
    className={inputClass}
    placeholder="Apto, sala, bloco..."
  />
</div>
                <div>
                  <label className={labelClass}>Bairro</label>
                  <input
                    name="bairro"
                    required
                    value={bairro}
                    onChange={(e) => {
                      setBairro(e.target.value);
                      updateForm("bairro", e.target.value);
                    }}
                    className={inputClass}
                    placeholder="Bairro"
                  />
                </div>

                <div>
                  <label className={labelClass}>Cidade</label>
                  <input
                    name="cidade"
                    required
                    value={cidade}
                    onChange={(e) => {
                      setCidade(e.target.value);
                      updateForm("cidade", e.target.value);
                    }}
                    className={inputClass}
                    placeholder="Cidade"
                  />
                </div>
              </div>
            </section>
          )}

          {step === 4 && tipo === "pf" && (
            <section className={sectionClass}>
              <h2 className="mb-2 text-2xl font-semibold text-zinc-950">
                4. Pessoa Física
              </h2>

              <p className="mb-6 text-sm text-zinc-600">
                Dados necessários para análise cadastral de pessoa física.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>CPF</label>
                  <input
                    name="cpf"
                    required
                    value={cpf}
                    onChange={(e) => {
                      const formatted = formatCPF(e.target.value);
                      setCpf(formatted);
                      updateForm("cpf", formatted);
                    }}
                    className={inputClass}
                    placeholder="000.000.000-00"
                  />
                </div>

                <div>
                  <label className={labelClass}>RG</label>
                  <input
                    name="rg"
                    value={rg}
                    onChange={(e) => {
                      const formatted = formatRG(e.target.value);
                      setRg(formatted);
                      updateForm("rg", formatted);
                    }}
                    className={inputClass}
                    placeholder="00.000.000-0"
                  />
                </div>

                <div>
                  <label className={labelClass}>Data de nascimento</label>
                  <input
                    name="dataNascimento"
                    required
                    value={formState.dataNascimento || ""}
                    onChange={(e) => {
                      const formatted = formatDateBR(e.target.value);
                      updateForm("dataNascimento", formatted);
                    }}
                    className={inputClass}
                    placeholder="DD/MM/AAAA"
                  />
                </div>

                <div>
                  <label className={labelClass}>Nome da mãe</label>
                  <input
                    name="nomeMae"
                    required
                    value={formState.nomeMae || ""}
                    onChange={(e) => updateForm("nomeMae", e.target.value)}
                    className={inputClass}
                    placeholder="Nome da mãe"
                  />
                </div>

                <div>
                  <label className={labelClass}>CNH válida</label>
                  <select
                    name="cnhValida"
                    value={formState.cnhValida || ""}
                    onChange={(e) => updateForm("cnhValida", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Selecione</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Ocupação</label>
                  <input
                    name="ocupacao"
                    value={formState.ocupacao || ""}
                    onChange={(e) => updateForm("ocupacao", e.target.value)}
                    className={inputClass}
                    placeholder="Sua ocupação"
                  />
                </div>
              </div>
            </section>
          )}

          {step === 4 && tipo === "pj" && (
            <section className={sectionClass}>
              <h2 className="mb-2 text-2xl font-semibold text-zinc-950">
                4. Pessoa Jurídica
              </h2>

              <p className="mb-6 text-sm text-zinc-600">
                Dados necessários para análise cadastral de pessoa jurídica.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>CNPJ</label>
                  <input
                    name="cnpj"
                    required
                    value={cnpj}
                    onChange={(e) => {
                      const formatted = formatCNPJ(e.target.value);
                      setCnpj(formatted);
                      updateForm("cnpj", formatted);
                    }}
                    className={inputClass}
                    placeholder="00.000.000/0000-00"
                  />
                </div>

                <div>
                  <label className={labelClass}>Responsável</label>
                  <input
                    name="responsavel"
                    required
                    value={formState.responsavel || ""}
                    onChange={(e) => updateForm("responsavel", e.target.value)}
                    className={inputClass}
                    placeholder="Nome do responsável"
                  />
                </div>

                <div>
                  <label className={labelClass}>Data de fundação</label>
                  <input
                    type="date"
                    name="dataFundacao"
                    value={formState.dataFundacao || ""}
                    onChange={(e) =>
                      updateForm("dataFundacao", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Ramo de atividade</label>
                  <input
                    name="ramoAtividadePj"
                    value={formState.ramoAtividadePj || ""}
                    onChange={(e) =>
                      updateForm("ramoAtividadePj", e.target.value)
                    }
                    className={inputClass}
                    placeholder="Ramo de atividade"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>
                    Ocupação / função do solicitante
                  </label>
                  <input
                    name="ocupacaoPj"
                    value={formState.ocupacaoPj || ""}
                    onChange={(e) => updateForm("ocupacaoPj", e.target.value)}
                    className={inputClass}
                    placeholder="Função do solicitante"
                  />
                </div>
              </div>
            </section>
          )}

          {step === 5 && (
            <section className={sectionClass}>
              <h2 className="mb-2 text-2xl font-semibold text-zinc-950">
                5. Referências comerciais
              </h2>

              <p className="mb-6 text-sm text-zinc-600">
                Informe referências que possam auxiliar a validação. Se não
                tiver todas agora, preencha as principais.
              </p>

              <div className="space-y-5 md:space-y-4">
                {[1, 2, 3].map((n) => {
                  const empresaName =
                    tipo === "pf" ? `empresa${n}` : `empresa${n}Pj`;
                  const contatoName =
                    tipo === "pf" ? `nomeContato${n}` : `nomeContato${n}Pj`;
                  const telefoneName =
                    tipo === "pf"
                      ? `telefoneContato${n}`
                      : `telefoneContato${n}Pj`;

                  return (
                    <div key={n} className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className={labelClass}>Empresa {n}</label>
                        <input
                          name={empresaName}
                          value={formState[empresaName] || ""}
                          onChange={(e) =>
                            updateForm(empresaName, e.target.value)
                          }
                          className={inputClass}
                          placeholder="Empresa"
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Contato {n}</label>
                        <input
                          name={contatoName}
                          value={formState[contatoName] || ""}
                          onChange={(e) =>
                            updateForm(contatoName, e.target.value)
                          }
                          className={inputClass}
                          placeholder="Nome do contato"
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Telefone {n}</label>
                        <input
                          name={telefoneName}
                          value={formState[telefoneName] || ""}
                          onChange={(e) => {
  const formatted = formatPhone(e.target.value);
  updateForm(telefoneName, formatted);
}}
                          className={inputClass}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {step === 6 && (
            <section className={sectionClass}>
              <h2 className="mb-2 text-2xl font-semibold text-zinc-950">
                6. Envie seus documentos
              </h2>

             <p className="mb-6 text-sm text-zinc-600">
  Envie os documentos obrigatórios para análise do cadastro.
</p>

<div className="rounded-xl border border-red-200 bg-red-50 p-4">
  <p className="text-sm text-zinc-700">
    O envio dos documentos é obrigatório para concluir o cadastro.
    Sem o envio, não será possível dar sequência na análise.
  </p>
</div>

              <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <label className={labelClass}>
                 Documento obrigatório para análise cadastral
                </label>

                <input
  type="file"
  multiple
  name="documentoCadastro"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={(e) => {
                   const files = Array.from(e.target.files || []);

if (files.length === 0) {
  setDocumentFiles([]);
  return;
}

for (const file of files) {
  const fileSizeMb = file.size / 1024 / 1024;

  if (fileSizeMb > MAX_DOCUMENT_SIZE_MB) {
    setDocumentFiles([]);
    e.target.value = "";
    setError(
      `Um dos arquivos excede o limite de ${MAX_DOCUMENT_SIZE_MB}MB.`
    );
    return;
  }
}

setError("");
setDocumentFiles(files);
                  }}
                  className="block w-full cursor-pointer rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-700 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-black"
                />

                <p className="mt-3 text-xs leading-relaxed text-zinc-500">
                  PF: RG ou CNH, comprovante de endereço. PJ: documento do
                  responsável, contrato social ou CNPJ. Formatos aceitos: PDF,
                  JPG, PNG ou WebP até {MAX_DOCUMENT_SIZE_MB}MB.
                </p>

               {documentFiles[0] && (
                  <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
                    Arquivo selecionado: {documentFiles[0].name}
                  </p>
                )}
              </div>
            </section>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-zinc-300 pt-6 md:flex-row md:items-center md:justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1 || loading}
              className="rounded-xl border border-zinc-300 px-6 py-3 font-semibold text-zinc-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Voltar
            </button>

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={(e) => {
  e.preventDefault();
  e.stopPropagation();
  nextStep();
}}
                disabled={loading}
                className="rounded-xl bg-zinc-950 px-6 py-3 font-bold text-white transition hover:bg-black disabled:opacity-50"
              >
                Próximo
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-zinc-950 px-6 py-3 font-bold text-white transition hover:bg-black disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Enviar cadastro"}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
