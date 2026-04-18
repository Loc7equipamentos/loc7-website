import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function ClienteCadastro() {
  const [tipo, setTipo] = useState<"PF" | "PJ">("PF");
  const [loading, setLoading] = useState(false);
  const [produto, setProduto] = useState<string | null>(null);

  const [form, setForm] = useState<any>({
    email: "",
    phone: "",
    full_name: "",
    company_name: "",
    consent: false,
  });

  // 🔥 CAPTURA PRODUTO DA URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prod = params.get("produto");
    if (prod) {
      setProduto(decodeURIComponent(prod));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.phone) {
      alert("Informe seu WhatsApp");
      return;
    }

    if (tipo === "PF" && !form.full_name) {
      alert("Informe seu nome");
      return;
    }

    if (tipo === "PJ" && !form.company_name) {
      alert("Informe a empresa");
      return;
    }

    if (!form.consent) {
      alert("Confirme o envio dos dados");
      return;
    }

    setLoading(true);

    const payload = {
      client_type: tipo,
      phone: form.phone,
      full_name: tipo === "PF" ? form.full_name : null,
      company_name: tipo === "PJ" ? form.company_name : null,
      email: form.email || null,
      status: "lead",
      product_interest: produto || null,
    };

    await supabase.from("customer_registrations").insert([payload]);

    setLoading(false);

    // 🔥 MENSAGEM INTELIGENTE
    let mensagem = "";

    if (produto) {
      mensagem =
        tipo === "PF"
          ? `Olá! Tenho interesse em alugar: ${produto}. Meu nome é ${form.full_name}.`
          : `Olá! Tenho interesse em alugar: ${produto}. Empresa: ${form.company_name}.`;
    } else {
      mensagem =
        tipo === "PF"
          ? `Olá! Acabei de iniciar um atendimento no site. Meu nome é ${form.full_name}.`
          : `Olá! Acabei de iniciar um atendimento no site pela empresa ${form.company_name}.`;
    }

    const whatsappUrl = `https://wa.me/5511919671611?text=${encodeURIComponent(
      mensagem
    )}`;

    window.location.href = whatsappUrl;
  };

  return (
    <div className="min-h-screen bg-white text-black px-6 py-10 max-w-md mx-auto">

      {/* TOPO */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold leading-tight mb-3">
          Fale com um especialista Loc 7
        </h1>

        <p className="text-sm text-gray-600 leading-relaxed">
          Deixe seus dados e continue seu atendimento pelo WhatsApp.
          <br />
          Leva menos de 1 minuto.
        </p>
      </div>

      {/* 🔥 MOSTRA PRODUTO SE EXISTIR */}
      {produto && (
        <div className="mb-6 p-3 border border-gray-200 rounded-md bg-gray-50 text-sm">
          Interesse em: <strong>{produto}</strong>
        </div>
      )}

      {/* TIPO */}
      <div className="mb-6">
        <label className="block font-semibold mb-3">Você é:</label>

        <div className="flex gap-3">
          <button
            type="button"
            className={`px-5 py-3 border text-sm font-medium rounded-md ${
              tipo === "PF"
                ? "bg-black text-white"
                : "bg-white text-black border-gray-300"
            }`}
            onClick={() => setTipo("PF")}
          >
            Pessoa Física
          </button>

          <button
            type="button"
            className={`px-5 py-3 border text-sm font-medium rounded-md ${
              tipo === "PJ"
                ? "bg-black text-white"
                : "bg-white text-black border-gray-300"
            }`}
            onClick={() => setTipo("PJ")}
          >
            Empresa
          </button>
        </div>
      </div>

      {/* NOME / EMPRESA */}
      {tipo === "PF" && (
        <input
          name="full_name"
          placeholder="Seu nome"
          value={form.full_name}
          className="w-full border border-gray-300 rounded-md p-3 mb-4"
          onChange={handleChange}
        />
      )}

      {tipo === "PJ" && (
        <input
          name="company_name"
          placeholder="Nome da empresa"
          value={form.company_name}
          className="w-full border border-gray-300 rounded-md p-3 mb-4"
          onChange={handleChange}
        />
      )}

      {/* WHATSAPP */}
      <input
        name="phone"
        placeholder="WhatsApp"
        value={form.phone}
        className="w-full border border-gray-300 rounded-md p-3 mb-4"
        onChange={handleChange}
      />

      {/* EMAIL */}
      <input
        name="email"
        placeholder="Email (opcional)"
        value={form.email}
        className="w-full border border-gray-300 rounded-md p-3 mb-5"
        onChange={handleChange}
      />

      {/* CONSENT */}
      <div className="mb-4">
        <label className="flex gap-2 text-sm">
          <input type="checkbox" name="consent" onChange={handleChange} />
          Aceito o envio dos meus dados para contato
        </label>
      </div>

      <p className="text-xs text-gray-500 mb-5">
        🔒 Seus dados são usados apenas para atendimento.
      </p>

      {/* BOTÃO */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white py-4 font-semibold rounded-md"
      >
        {loading ? "Conectando..." : "Falar com especialista agora"}
      </button>
    </div>
  );
}
