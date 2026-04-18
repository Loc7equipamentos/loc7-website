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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.phone) {
      alert("Preencha o WhatsApp");
      return;
    }

    if (!form.email) {
      alert("Preencha o email");
      return;
    }

    if (tipo === "PF" && !form.full_name) {
      alert("Preencha o nome completo");
      return;
    }

    if (tipo === "PF" && !form.cpf) {
      alert("Preencha o CPF");
      return;
    }

    if (tipo === "PJ" && !form.company_name) {
      alert("Preencha a razão social");
      return;
    }

    if (tipo === "PJ" && !form.cnpj) {
      alert("Preencha o CNPJ");
      return;
    }

    if (!form.consent || !form.truth_declaration) {
      alert("Você precisa aceitar os termos");
      return;
    }

    setLoading(true);

    const payload = {
      client_type: tipo,
      email: form.email || null,
      phone: form.phone || null,
      full_name: tipo === "PF" ? form.full_name || null : null,
      cpf: tipo === "PF" ? form.cpf || null : null,
      company_name: tipo === "PJ" ? form.company_name || null : null,
      cnpj: tipo === "PJ" ? form.cnpj || null : null,
      city: form.city || null,
      state: form.state || null,
      consent: !!form.consent,
      truth_declaration: !!form.truth_declaration,
    };

    const { error } = await supabase
      .from("customer_registrations")
      .insert([payload]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Erro ao enviar cadastro");
      return;
    }

    const whatsappUrl =
      "https://wa.me/5511919671611?text=Cadastro%20enviado!%20Quero%20finalizar%20minha%20loca%C3%A7%C3%A3o.";

    window.location.href = whatsappUrl;
  };

  return (
    <div className="min-h-screen bg-white text-black px-6 py-10 max-w-md mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold leading-tight mb-3">
          Liberação de Cadastro para Locação
        </h1>

        <p className="text-sm text-gray-600 leading-relaxed">
          Preencha seus dados para liberar sua locação com mais agilidade.
          <br />
          Tempo médio: 2 minutos.
        </p>

        <p className="text-xs text-green-600 font-medium mt-2">
          ✔ Cadastro rápido • ✔ Sem burocracia • ✔ Atendimento prioritário
        </p>
      </div>

      <div className="mb-6">
        <label className="block font-semibold mb-3">Tipo de cliente</label>

        <div className="flex gap-3">
          <button
            type="button"
            className={`px-5 py-3 border text-sm font-medium rounded-md transition ${
              tipo === "PF"
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-300 hover:border-black"
            }`}
            onClick={() => setTipo("PF")}
          >
            Pessoa Física
          </button>

          <button
            type="button"
            className={`px-5 py-3 border text-sm font-medium rounded-md transition ${
              tipo === "PJ"
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-300 hover:border-black"
            }`}
            onClick={() => setTipo("PJ")}
          >
            Pessoa Jurídica
          </button>
        </div>
      </div>

      {tipo === "PF" && (
        <input
          name="full_name"
          placeholder="Nome completo"
          value={form.full_name}
          className="w-full border border-gray-300 rounded-md p-3 mb-4 text-base focus:outline-none focus:ring-2 focus:ring-black"
          onChange={handleChange}
        />
      )}

      {tipo === "PJ" && (
        <input
          name="company_name"
          placeholder="Razão social"
          value={form.company_name}
          className="w-full border border-gray-300 rounded-md p-3 mb-4 text-base focus:outline-none focus:ring-2 focus:ring-black"
          onChange={handleChange}
        />
      )}

      <input
        name="phone"
        placeholder="WhatsApp (principal contato)"
        value={form.phone}
        className="w-full border border-gray-300 rounded-md p-3 mb-4 text-base focus:outline-none focus:ring-2 focus:ring-black"
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        className="w-full border border-gray-300 rounded-md p-3 mb-4 text-base focus:outline-none focus:ring-2 focus:ring-black"
        onChange={handleChange}
      />

      {tipo === "PF" && (
        <input
          name="cpf"
          placeholder="CPF"
          value={form.cpf}
          className="w-full border border-gray-300 rounded-md p-3 mb-4 text-base focus:outline-none focus:ring-2 focus:ring-black"
          onChange={handleChange}
        />
      )}

      {tipo === "PJ" && (
        <input
          name="cnpj"
          placeholder="CNPJ"
          value={form.cnpj}
          className="w-full border border-gray-300 rounded-md p-3 mb-4 text-base focus:outline-none focus:ring-2 focus:ring-black"
          onChange={handleChange}
        />
      )}

      <input
        name="city"
        placeholder="Cidade"
        value={form.city}
        className="w-full border border-gray-300 rounded-md p-3 mb-4 text-base focus:outline-none focus:ring-2 focus:ring-black"
        onChange={handleChange}
      />

      <input
        name="state"
        placeholder="Estado"
        value={form.state}
        className="w-full border border-gray-300 rounded-md p-3 mb-5 text-base focus:outline-none focus:ring-2 focus:ring-black"
        onChange={handleChange}
      />

      <div className="mb-3">
        <label className="flex items-start gap-2 text-sm leading-relaxed">
          <input
            type="checkbox"
            name="consent"
            checked={form.consent}
            onChange={handleChange}
            className="mt-1"
          />
          <span>Aceito o envio dos meus dados para análise de cadastro</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="flex items-start gap-2 text-sm leading-relaxed">
          <input
            type="checkbox"
            name="truth_declaration"
            checked={form.truth_declaration}
            onChange={handleChange}
            className="mt-1"
          />
          <span>Declaro que as informações são verdadeiras</span>
        </label>
      </div>

      <p className="text-xs text-gray-600 mb-5 leading-relaxed bg-gray-50 border border-gray-200 p-3 rounded-md">
        🔒 Seus dados são utilizados apenas para análise de cadastro e não são
        compartilhados.
      </p>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white py-4 text-base font-semibold rounded-md hover:opacity-90 transition disabled:opacity-60"
      >
        {loading ? "Enviando..." : "Liberar meu cadastro agora"}
      </button>
    </div>
  );
}
