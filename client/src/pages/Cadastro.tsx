"use client"

import { useState } from "react"

type TipoCadastro = "pf" | "pj"

function formatCPF(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
}

function formatCNPJ(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
}

function formatRG(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 9)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1})$/, "$1-$2")
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11)

  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
  }

  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
}

function formatCEP(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, "$1-$2")
}

export default function CadastroPage() {
  const [tipo, setTipo] = useState<TipoCadastro>("pf")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [telefone, setTelefone] = useState("")
  const [cpf, setCpf] = useState("")
  const [cnpj, setCnpj] = useState("")
  const [rg, setRg] = useState("")
  const [cep, setCep] = useState("")
  const [endereco, setEndereco] = useState("")
  const [bairro, setBairro] = useState("")
  const [cidade, setCidade] = useState("")
  const [uf, setUf] = useState("")

  async function buscarCep(value: string) {
    const clean = value.replace(/\D/g, "")
    if (clean.length !== 8) return

    try {
      const response = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
      const data = await response.json()

      if (!data.erro) {
        setEndereco(data.logradouro || "")
        setBairro(data.bairro || "")
        setCidade(data.localidade || "")
        setUf(data.uf || "")
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch("https://formspree.io/f/mreojwrr", {
        method: "POST",
        body: formData,
      })

      const rawText = await response.text()
      console.log("FORM RESPONSE STATUS:", response.status)
      console.log("FORM RESPONSE BODY:", rawText)

      if (!response.ok) {
        setError(`Erro ao enviar. Status: ${response.status}. Veja o console.`)
        return
      }

      setSuccess(true)
      form.reset()
    } catch (err) {
      console.error("ERRO DE REDE:", err)
      setError("Erro de conexão ao enviar o formulário.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-black text-white pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h1 className="text-3xl font-bold mb-3">Cadastro enviado com sucesso</h1>
            <p className="text-zinc-300 mb-6">
              Recebemos suas informações. Nossa equipe fará a validação para seguir com a locação.
            </p>
            <a
              href="/"
              className="inline-flex rounded-xl bg-red-600 px-5 py-3 font-semibold hover:bg-red-700 transition"
            >
              Voltar ao site
            </a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Cadastro para locação</h1>
          <p className="text-zinc-300">
            Este cadastro é necessário para liberação de equipamentos. Após o envio, nossa equipe fará a validação.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/5 p-4">
          <p className="text-sm text-zinc-200">
            Envie os documentos no próprio formulário para agilizar a aprovação.
          </p>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8">
          <input type="hidden" name="tipoCadastro" value={tipo} />

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold mb-4">1. Tipo de cadastro</h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTipo("pf")}
                className={`rounded-xl border px-4 py-3 font-medium transition ${
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
                className={`rounded-xl border px-4 py-3 font-medium transition ${
                  tipo === "pj"
                    ? "border-red-500 bg-red-600 text-white"
                    : "border-white/15 bg-transparent text-zinc-200 hover:bg-white/5"
                }`}
              >
                Pessoa Jurídica
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold mb-4">2. Dados principais</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Nome completo</label>
                <input
                  name="nomeCompleto"
                  required
                  className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                  placeholder="voce@email.com"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Telefone</label>
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
                <label className="block text-sm mb-2">Rede social</label>
                <input
                  name="redeSocial"
                  className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                  placeholder="@instagram ou link"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold mb-4">3. Endereço</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">CEP</label>
                <input
                  name="cep"
                  required
                  value={cep}
                  onChange={(e) => {
                    const formatted = formatCEP(e.target.value)
                    setCep(formatted)
                    if (formatted.replace(/\D/g, "").length === 8) {
                      buscarCep(formatted)
                    }
                  }}
                  className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                  placeholder="00000-000"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">UF</label>
                <input
                  name="uf"
                  required
                  value={uf}
                  onChange={(e) => setUf(e.target.value.toUpperCase())}
                  maxLength={2}
                  className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none uppercase"
                  placeholder="SP"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Endereço</label>
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
                <label className="block text-sm mb-2">Número</label>
                <input
                  name="numero"
                  required
                  className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                  placeholder="Número"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Bairro</label>
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
                <label className="block text-sm mb-2">Cidade</label>
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

          {tipo === "pf" && (
            <>
              <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-semibold mb-4">4. Pessoa Física</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">CPF</label>
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
                    <label className="block text-sm mb-2">RG</label>
                    <input
                      name="rg"
                      value={rg}
                      onChange={(e) => setRg(formatRG(e.target.value))}
                      className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                      placeholder="00.000.000-0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Data de nascimento</label>
                    <input
                      type="date"
                      name="dataNascimento"
                      required
                      className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Nome da mãe</label>
                    <input
                      name="nomeMae"
                      required
                      className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                      placeholder="Nome da mãe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">CNH válida</label>
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
                    <label className="block text-sm mb-2">Ocupação</label>
                    <input
                      name="ocupacao"
                      className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                      placeholder="Sua ocupação"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-semibold mb-4">5. Referências comerciais</h2>

                <div className="space-y-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm mb-2">{`Empresa ${n}`}</label>
                        <input
                          name={`empresa${n}`}
                          className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                          placeholder="Empresa"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2">{`Contato ${n}`}</label>
                        <input
                          name={`nomeContato${n}`}
                          className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                          placeholder="Nome do contato"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2">{`Telefone ${n}`}</label>
                        <input
                          name={`telefoneContato${n}`}
                          className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-semibold mb-4">6. Documentos</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">RG ou CNH</label>
                    <input
                      type="file"
                      name="documentoIdentidadePf"
                      required
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="block w-full text-sm text-zinc-200 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">CPF</label>
                    <input
                      type="file"
                      name="documentoCpfPf"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="block w-full text-sm text-zinc-200 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-black"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2">Comprovante de residência</label>
                    <input
                      type="file"
                      name="comprovanteResidenciaPf"
                      required
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="block w-full text-sm text-zinc-200 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-black"
                    />
                  </div>
                </div>
              </section>
            </>
          )}

          {tipo === "pj" && (
            <>
              <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-semibold mb-4">4. Pessoa Jurídica</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Razão social</label>
                    <input
                      name="razaoSocial"
                      required
                      className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                      placeholder="Razão social"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">CNPJ</label>
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
                    <label className="block text-sm mb-2">Responsável</label>
                    <input
                      name="responsavel"
                      required
                      className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                      placeholder="Nome do responsável"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Data de fundação</label>
                    <input
                      type="date"
                      name="dataFundacao"
                      className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Ramo de atividade</label>
                    <input
                      name="ramoAtividadePj"
                      className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                      placeholder="Ramo de atividade"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Ocupação / função</label>
                    <input
                      name="ocupacaoPj"
                      className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                      placeholder="Função do solicitante"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-semibold mb-4">5. Referências comerciais</h2>

                <div className="space-y-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm mb-2">{`Empresa ${n}`}</label>
                        <input
                          name={`empresa${n}Pj`}
                          className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                          placeholder="Empresa"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2">{`Contato ${n}`}</label>
                        <input
                          name={`nomeContato${n}Pj`}
                          className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                          placeholder="Nome do contato"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2">{`Telefone ${n}`}</label>
                        <input
                          name={`telefoneContato${n}Pj`}
                          className="w-full rounded-xl bg-white px-4 py-3 text-black outline-none"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-semibold mb-4">6. Documentos</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Contrato social ou estatuto</label>
                    <input
                      type="file"
                      name="contratoSocial"
                      required
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="block w-full text-sm text-zinc-200 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">CNPJ</label>
                    <input
                      type="file"
                      name="documentoCnpj"
                      required
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="block w-full text-sm text-zinc-200 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-black"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2">Comprovante de residência do responsável</label>
                    <input
                      type="file"
                      name="comprovanteResidenciaPj"
                      required
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="block w-full text-sm text-zinc-200 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-black"
                    />
                  </div>
                </div>
              </section>
            </>
          )}

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-red-600 px-6 py-4 font-bold text-white hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar cadastro"}
          </button>
        </form>
      </div>
    </main>
  )
}
