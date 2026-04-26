import { useMemo, useState } from "react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";

type TipoCadastro = "pf" | "pj";

const TOTAL_STEPS = 6;

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

export default function CadastroPage() {
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState<TipoCadastro>("pf");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formState, setFormState] = useState<Record<string, string>>({});

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

  function nextStep() {
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
      };

      const { error: insertError } = await supabase
        .from("rental_registrations")
        .insert([payload]);

      if (insertError) {
        console.error("Erro Supabase:", insertError);
        setError(`Erro ao salvar cadastro: ${insertError.message}`);
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
  return (
    <main className="min-h-screen bg-zinc-900 px-4 py-16 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <div className="rounded-3xl bg-white p-10 md:p-12 text-center shadow-[0_30px_80px_rgba(0,0,0,0.45)]">

          {/* HEADER COM CHECK + TEXTO */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-2xl text-emerald-600 font-bold">✔</span>
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-emerald-700">
              Cadastro recebido
            </p>
          </div>

          {/* TÍTULO */}
          <h1 className="text-3xl md:text-4xl font-semibold text-zinc-950 mb-4 leading-tight">
            Cadastro concluído com sucesso.
          </h1>

          {/* SUB */}
          <p className="text-zinc-600 mb-6">
            Seu cadastro foi enviado para análise da equipe Loc7.
          </p>

          {/* STATUS */}
          <div className="mb-8 inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
            Status: Em validação
          </div>

          {/* LISTA ORGANIZADA */}
          <ul className="text-left text-zinc-600 space-y-3 mb-10 text-sm md:text-base max-w-md mx-auto">
            <li className="flex gap-2">
              <span>•</span>
              <span>Nossa equipe irá validar seus dados para dar sequência ao processo de locação.</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Você receberá uma atualização por WhatsApp e/ou e-mail.</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Fique atento aos canais informados no cadastro.</span>
            </li>
            <li className="flex gap-2 text-zinc-500">
              <span>•</span>
              <span>Caso necessário, entraremos em contato diretamente com você.</span>
            </li>
          </ul>

          {/* CTA */}
          <Link
            href="/"
            className="inline-flex rounded-xl bg-zinc-950 px-8 py-3 font-semibold text-white transition hover:scale-[1.03] hover:bg-black"
          >
            Voltar ao site
          </Link>

          {/* FOOT MELHORADO */}
          <p className="mt-6 text-sm text-zinc-500">
            Em caso de dúvidas, nossa equipe entrará em contato em breve.
          </p>

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
              updateForm(target.name, target.value);
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

              <div className="space-y-6">
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
                          onChange={(e) =>
                            updateForm(telefoneName, e.target.value)
                          }
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
                6. Revisão e envio
              </h2>

              <p className="mb-6 text-sm text-zinc-600">
                Confira se os dados estão corretos. Após o envio, a equipe Loc7
                fará a análise e entrará em contato se precisar de informações
                complementares.
              </p>

              <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                <p className="text-sm text-zinc-700">
                  Nesta etapa, o cadastro será registrado no sistema interno da
                  Loc7. O envio de documentos será implementado na próxima fase
                  com Supabase Storage.
                </p>
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
                onClick={nextStep}
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
