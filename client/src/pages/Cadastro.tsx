import { useMemo, useState } from "react";
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

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export default function CadastroPage() {
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState<TipoCadastro>("pf");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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

    const form = e.currentTarget;
    const formData = new FormData(form);

    const email = getFormValue(formData, "email");
    const phone = getFormValue(formData, "telefone");

    const fullName =
      tipo === "pf"
        ? getFormValue(formData, "nomeCompleto")
        : getFormValue(formData, "razaoSocial");

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
        status_internal: "Novo cadastro",
        status_public: "Cadastro recebido",
        risk: "Não avaliado",
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
      form.reset();

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
    } catch (err) {
      console.error("Erro inesperado:", err);
      setError("Erro inesperado ao enviar o cadastro.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-black px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-red-500">
              Cadastro Loc7
            </p>

            <h1 className="mb-3 text-3xl font-bold">
              Cadastro enviado com sucesso
            </h1>

            <p className="mb-6 text-zinc-300">
              Recebemos suas informações. Nossa equipe fará a validação para
              seguir com a locação.
            </p>

            <a
              href="/"
              className="inline-flex rounded-xl bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-700"
            >
              Voltar ao site
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-red-500">
            Loc7 Equipamentos
          </p>

          <h1 className="mb-2 text-4xl font-bold">Cadastro para locação</h1>

          <p className="max-w-3xl text-zinc-300">
            Este cadastro é necessário para liberação de equipamentos. Após o
            envio, nossa equipe fará a validação.
          </p>
        </header>

        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-white">
              Etapa {step} de {TOTAL_STEPS}
            </span>
            <span className="text-sm text-zinc-400">{progress}% concluído</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-red-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <input type="hidden" name="tipoCadastro" value={tipo} />

          {step === 1 && (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-2 text-2xl font-bold">1. Tipo de cadastro</h2>

              <p className="mb-6 text-sm text-zinc-400">
                Escolha se o cadastro será feito como pessoa física ou pessoa
                jurídica.
              </p>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setTipo("pf")}
                  className={`rounded-xl border px-4 py-4 font-semibold transition ${
                    tipo === "pf"
                      ? "border-red-500 bg-red-600 text-white"
                      : "border-white/15 bg-transparent text-zinc-200 hover:bg-white/5"
                  }`}
                >
                  Pessoa Física
                </button>

                <button
                  type="button"
                  onClick={() => setTipo("pj")}
                  className={`rounded-xl border px-4 py-4 font-semibold transition ${
                    tipo === "pj"
                      ? "border-red-500 bg-red-600 text-white"
                      : "border-white/15 bg-transparent text-zinc-200 hover:bg-white/5"
                  }`}
                >
                  Pessoa Jurídica
                </button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-2 text-2xl font-bold">2. Dados principais</h2>

              <p className="mb-6 text-sm text-zinc-400">
                Informe os principais dados de contato para validação da equipe
                Loc7.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {tipo === "pf" ? (
                  <div>
                    <label className="mb-2 block text-sm">Nome completo</label>
                    <input
                      name="nomeCompleto"
                      required
                      className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                      placeholder="Seu nome completo"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="mb-2 block text-sm">Razão social</label>
                    <input
                      name="razaoSocial"
                      required
                      className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                      placeholder="Razão social da empresa"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    placeholder="voce@email.com"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">Telefone</label>
                  <input
                    name="telefone"
                    required
                    value={telefone}
                    onChange={(e) => setTelefone(formatPhone(e.target.value))}
                    className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">Rede social</label>
                  <input
                    name="redeSocial"
                    className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    placeholder="@instagram ou link"
                  />
                </div>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-2 text-2xl font-bold">3. Endereço</h2>

              <p className="mb-6 text-sm text-zinc-400">
                Endereço usado para análise cadastral e conferência de dados.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm">CEP</label>
                  <input
                    name="cep"
                    required
                    value={cep}
                    onChange={(e) => {
                      const formatted = formatCEP(e.target.value);
                      setCep(formatted);

                      if (formatted.replace(/\D/g, "").length === 8) {
                        buscarCep(formatted);
                      }
                    }}
                    className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    placeholder="00000-000"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">UF</label>
                  <input
                    name="uf"
                    required
                    value={uf}
                    onChange={(e) => setUf(e.target.value.toUpperCase())}
                    maxLength={2}
                    className="w-full rounded-xl bg-white px-4 py-3 text-black uppercase outline-none"
                    placeholder="SP"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">Endereço</label>
                  <input
                    name="endereco"
                    required
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    placeholder="Rua / Avenida"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">Número</label>
                  <input
                    name="numero"
                    required
                    className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    placeholder="Número"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">Bairro</label>
                  <input
                    name="bairro"
                    required
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    placeholder="Bairro"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">Cidade</label>
                  <input
                    name="cidade"
                    required
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    placeholder="Cidade"
                  />
                </div>
              </div>
            </section>
          )}

          {step === 4 && tipo === "pf" && (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-2 text-2xl font-bold">4. Pessoa Física</h2>

              <p className="mb-6 text-sm text-zinc-400">
                Dados necessários para análise cadastral de pessoa física.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm">CPF</label>
                  <input
                    name="cpf"
                    required
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    placeholder="000.000.000-00"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">RG</label>
                  <input
                    name="rg"
                    value={rg}
                    onChange={(e) => setRg(formatRG(e.target.value))}
                    className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    placeholder="00.000.000-0"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">
                    Data de nascimento
                  </label>
                  <input
                    type="date"
                    name="dataNascimento"
                    required
                    className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">Nome da mãe</label>
                  <input
                    name="nomeMae"
                    required
                    className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    placeholder="Nome da mãe"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">CNH válida</label>
                  <select
                    name="cnhValida"
                    className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                  >
                    <option value="">Selecione</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm">Ocupação</label>
                  <input
                    name="ocupacao"
                    className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    placeholder="Sua ocupação"
                  />
                </div>
              </div>
            </section>
          )}

          {step === 4 && tipo === "pj" && (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-2 text-2xl font-bold">4. Pessoa Jurídica</h2>

              <p className="mb-6 text-sm text-zinc-400">
                Dados necessários para análise cadastral de pessoa jurídica.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm">CNPJ</label>
                  <input
                    name="cnpj"
                    required
                    value={cnpj}
                    onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                    className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    placeholder="00.000.000/0000-00"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">Responsável</label>
                  <input
                    name="responsavel"
                    required
                    className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    placeholder="Nome do responsável"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">Data de fundação</label>
                  <input
                    type="date"
                    name="dataFundacao"
                    className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">
                    Ramo de atividade
                  </label>
                  <input
                    name="ramoAtividadePj"
                    className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    placeholder="Ramo de atividade"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm">
                    Ocupação / função do solicitante
                  </label>
                  <input
                    name="ocupacaoPj"
                    className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    placeholder="Função do solicitante"
                  />
                </div>
              </div>
            </section>
          )}

          {step === 5 && (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-2 text-2xl font-bold">
                5. Referências comerciais
              </h2>

              <p className="mb-6 text-sm text-zinc-400">
                Informe referências que possam auxiliar a validação. Se não
                tiver todas agora, preencha as principais.
              </p>

              <div className="space-y-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm">Empresa {n}</label>
                      <input
                        name={tipo === "pf" ? `empresa${n}` : `empresa${n}Pj`}
                        className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                        placeholder="Empresa"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm">Contato {n}</label>
                      <input
                        name={
                          tipo === "pf" ? `nomeContato${n}` : `nomeContato${n}Pj`
                        }
                        className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                        placeholder="Nome do contato"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm">
                        Telefone {n}
                      </label>
                      <input
                        name={
                          tipo === "pf"
                            ? `telefoneContato${n}`
                            : `telefoneContato${n}Pj`
                        }
                        className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {step === 6 && (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-2 text-2xl font-bold">6. Revisão e envio</h2>

              <p className="mb-6 text-sm text-zinc-400">
                Confira se os dados estão corretos. Após o envio, a equipe Loc7
                fará a análise e entrará em contato se precisar de informações
                complementares.
              </p>

              <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
                <p className="text-sm text-zinc-200">
                  Nesta etapa, o cadastro será registrado no sistema interno da
                  Loc7. O envio de documentos será implementado na próxima fase
                  com Supabase Storage.
                </p>
              </div>
            </section>
          )}

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1 || loading}
              className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Voltar
            </button>

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={loading}
                className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                Próximo
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
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
