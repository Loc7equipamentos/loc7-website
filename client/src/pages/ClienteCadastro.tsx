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
    if (!form.email || !form.phone) {
      alert("Preencha email e telefone");
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
      <h1 className="text-2xl font-bold mb-6">Cadastro de Cliente</h1>

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

      {/* Email */}
      <input
        name="email"
        placeholder="Email"
        className="w-full border p-2 mb-4"
        onChange={handleChange}
      />

      {/* Telefone */}
      <input
        name="phone"
        placeholder="Telefone"
        className="w-full border p-2 mb-4"
        onChange={handleChange}
      />

      {/* PF */}
      {tipo === "PF" && (
        <>
          <input
            name="full_name"
            placeholder="Nome completo"
            className="w-full border p-2 mb-4"
            onChange={handleChange}
          />

          <input
            name="cpf"
            placeholder="CPF"
            className="w-full border p-2 mb-4"
            onChange={handleChange}
          />
        </>
      )}

      {/* PJ */}
      {tipo === "PJ" && (
        <>
          <input
            name="company_name"
            placeholder="Razão social"
            className="w-full border p-2 mb-4"
            onChange={handleChange}
          />

          <input
            name="cnpj"
            placeholder="CNPJ"
            className="w-full border p-2 mb-4"
            onChange={handleChange}
          />
        </>
      )}

      {/* Cidade */}
      <input
        name="city"
        placeholder="Cidade"
        className="w-full border p-2 mb-4"
        onChange={handleChange}
      />

      {/* Estado */}
      <input
        name="state"
        placeholder="Estado"
        className="w-full border p-2 mb-4"
        onChange={handleChange}
      />

      {/* Checkboxes */}
      <div className="mb-4">
        <label className="flex gap-2">
          <input type="checkbox" name="consent" onChange={handleChange} />
          Aceito envio de dados
        </label>
      </div>

      <div className="mb-6">
        <label className="flex gap-2">
          <input
            type="checkbox"
            name="truth_declaration"
            onChange={handleChange}
          />
          Declaro que as informações são verdadeiras
        </label>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white py-3"
      >
        {loading ? "Enviando..." : "Enviar cadastro"}
      </button>
    </div>
  );
}
