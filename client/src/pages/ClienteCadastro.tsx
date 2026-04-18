import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function ClienteCadastro() {
  const [tipo, setTipo] = useState<"PF" | "PJ">("PF");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<any>({
    email: "",
    phone: "",
    full_name: "",
    cpf: "",
    company_name: "",
    cnpj: "",
    city: "",
    state: "",
    consent: false,
    truth_declaration: false,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    if (!form.phone) {
      alert("Preencha o telefone");
      return;
    }

    if (!form.email) {
      alert("Preencha o email");
      return;
    }

    if (!form.consent || !form.truth_declaration) {
      alert("Você precisa aceitar os termos");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("customer_registrations").insert([
      {
        client_type: tipo,
        email: form.email,
        phone: form.phone,
        full_name: form.full_name,
        cpf: form.cpf,
        company_name: form.company_name,
        cnpj: form.cnpj,
        city: form.city,
        state: form.state,
        consent: form.consent,
        truth_declaration: form.truth_declaration,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Erro ao enviar cadastro");
    } else {
      alert("Cadastro enviado com sucesso!");
      setForm({});
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-6 max-w-xl mx-auto">
      
      {/* TOPO COM COPY MELHORADA */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Liberação de Cadastro para Locação
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Preencha seus dados para liberar sua locação com mais agilidade.
          <br />
          Tempo médio: 2 minutos.
        </p>
      </div>

      {/* Tipo */}
      <div className="mb-6">
        <label className="font-semibold">Tipo de cliente</label>
        <div className="flex gap-4 mt-2">
          <button
            className={`px-4 py-2 border ${
              tipo === "PF" ? "bg-black text-white" : ""
            }`}
            onClick={() => setTipo("PF")}
          >
            Pessoa Física
          </button>

          <button
            className={`px-4 py-2 border ${
              tipo === "PJ" ? "bg-black text-white" : ""
            }`}
            onClick={() => setTipo("PJ")}
          >
            Pessoa Jurídica
          </button>
        </div>
      </div>

      {/* NOME / EMPRESA PRIMEIRO */}
      {tipo === "PF" && (
        <input
          name="full_name"
          placeholder="Nome completo"
          className="w-full border p-3 mb-4 text-base"
          onChange={handleChange}
        />
      )}

      {tipo === "PJ" && (
        <input
          name="company_name"
          placeholder="Razão social"
          className="w-full border p-3 mb-4 text-base"
          onChange={handleChange}
        />
      )}

      {/* TELEFONE */}
      <input
        name="phone"
        placeholder="Telefone (WhatsApp)"
        className="w-full border p-3 mb-4 text-base"
        onChange={handleChange}
      />

      {/* EMAIL */}
      <input
        name="email"
        placeholder="Email"
        className="w-full border p-3 mb-4 text-base"
        onChange={handleChange}
      />

      {/* PF */}
      {tipo === "PF" && (
        <input
          name="cpf"
          placeholder="CPF"
          className="w-full border p-3 mb-4 text-base"
          onChange={handleChange}
        />
      )}

      {/* PJ */}
      {tipo === "PJ" && (
        <input
          name="cnpj"
          placeholder="CNPJ"
          className="w-full border p-3 mb-4 text-base"
          onChange={handleChange}
        />
      )}

      {/* Cidade */}
      <input
        name="city"
        placeholder="Cidade"
        className="w-full border p-3 mb-4 text-base"
        onChange={handleChange}
      />

      {/* Estado */}
      <input
        name="state"
        placeholder="Estado"
        className="w-full border p-3 mb-4 text-base"
        onChange={handleChange}
      />

      {/* Checkboxes */}
      <div className="mb-3">
        <label className="flex gap-2 text-sm">
          <input type="checkbox" name="consent" onChange={handleChange} />
          Aceito o envio dos meus dados para análise de cadastro
        </label>
      </div>

      <div className="mb-4">
        <label className="flex gap-2 text-sm">
          <input
            type="checkbox"
            name="truth_declaration"
            onChange={handleChange}
          />
          Declaro que as informações são verdadeiras
        </label>
      </div>

      {/* TEXTO DE CONFIANÇA */}
      <p className="text-xs text-gray-500 mb-4">
        🔒 Seus dados são utilizados apenas para análise de cadastro e não são
        compartilhados.
      </p>

      {/* BOTÃO */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white py-4 text-base font-semibold"
      >
        {loading
          ? "Enviando..."
          : "Finalizar cadastro e liberar locação"}
      </button>
    </div>
  );
}
