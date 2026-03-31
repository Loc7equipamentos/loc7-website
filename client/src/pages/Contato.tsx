/*
 * LOC 7 — Contato Page
 * Cinema Noir Industrial style
 * Contact form + Google Maps + WhatsApp + Info
 */

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

export default function Contato() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    equipment: "",
    date: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate form submission
    await new Promise(r => setTimeout(r, 1500));
    setSubmitted(true);
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)]">
      {/* Header */}
      <div className="bg-[oklch(0.06_0_0)] border-b border-[oklch(0.15_0_0)] py-10">
        <div className="container">
          <span className="loc7-section-title text-lg">FALE CONOSCO</span>
          <div className="loc7-red-line" />
          <p className="text-[oklch(0.5_0_0)] text-sm mt-3">
            Entre em contato para orçamentos e informações
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Contact info */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="font-display font-bold text-white text-xl uppercase tracking-wide mb-6">
                INFORMAÇÕES DE CONTATO
              </h2>
              
              <div className="space-y-5">
                {[
                  {
                    icon: MapPin,
                    title: "Localização",
                    content: "Av. Imperatriz Leopoldina, 957\nSala 1611, Vila Leopoldia\nSão Paulo, SP — CEP: 05305-011",
                  },
                  {
                    icon: Phone,
                    title: "Telefone / WhatsApp",
                    content: "11 99723-7850",
                    link: "https://wa.me/5511997237850",
                  },
                  {
                    icon: Mail,
                    title: "E-mail",
                    content: "loc7@loc7equipamentos.com.br",
                    link: "mailto:loc7@loc7equipamentos.com.br",
                  },
                  {
                    icon: Clock,
                    title: "Horário de Atendimento",
                    content: "Seg–Sex: 09h–18h\nSáb: 09h–13h\nOnline: 09h–21h",
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex gap-4 p-4 bg-[oklch(0.1_0_0)] border border-[oklch(0.18_0_0)]">
                      <div className="w-10 h-10 border border-[oklch(0.45_0.25_25)] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[oklch(0.45_0.25_25)]" />
                      </div>
                      <div>
                        <p className="font-display font-semibold text-white text-xs uppercase tracking-widest mb-1">{item.title}</p>
                        {item.link ? (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[oklch(0.6_0_0)] text-sm hover:text-white transition-colors whitespace-pre-line">
                            {item.content}
                          </a>
                        ) : (
                          <p className="text-[oklch(0.6_0_0)] text-sm whitespace-pre-line">{item.content}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>


          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-[oklch(0.85_0_0)] border border-[oklch(0.8_0_0)] p-12 text-center">
                <CheckCircle className="w-16 h-16 text-[oklch(0.45_0.25_25)] mx-auto mb-4" />
                <h3 className="font-display font-bold text-[oklch(0.2_0_0)] text-2xl uppercase tracking-wide mb-3">
                  MENSAGEM ENVIADA!
                </h3>
                <p className="text-[oklch(0.4_0_0)] mb-6">
                  Obrigado pelo contato! Nossa equipe retornará em até 24 horas úteis.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="loc7-btn-outline text-sm"
                >
                  Enviar Nova Mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[oklch(0.85_0_0)] border border-[oklch(0.8_0_0)] p-8">
                <h2 className="font-display font-bold text-[oklch(0.2_0_0)] text-xl uppercase tracking-wide mb-6">
                  SOLICITAR ORÇAMENTO
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {[
                    { name: "name", label: "Nome Completo *", type: "text", required: true },
                    { name: "email", label: "E-mail *", type: "email", required: true },
                    { name: "phone", label: "Telefone / WhatsApp *", type: "tel", required: true },
                    { name: "company", label: "Empresa / Produtora", type: "text", required: false },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-[oklch(0.3_0_0)] text-xs uppercase tracking-widest font-display font-semibold mb-2">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name as keyof typeof formData]}
                        onChange={handleChange}
                        required={field.required}
                        className="w-full bg-white border border-[oklch(0.7_0_0)] text-[oklch(0.2_0_0)] px-4 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.25_25)] placeholder:text-[oklch(0.5_0_0)] transition-colors"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[oklch(0.3_0_0)] text-xs uppercase tracking-widest font-display font-semibold mb-2">
                      Assunto *
                    </label>
                      <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-white border border-[oklch(0.7_0_0)] text-[oklch(0.2_0_0)] px-4 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.25_25)] transition-colors"
                    >
                      <option value="">Selecione...</option>
                      <option value="orcamento">Solicitar Orçamento</option>
                      <option value="disponibilidade">Verificar Disponibilidade</option>
                      <option value="duvida">Dúvida sobre Equipamento</option>
                      <option value="parceria">Parceria Comercial</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[oklch(0.3_0_0)] text-xs uppercase tracking-widest font-display font-semibold mb-2">
                      Data de Locação
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full bg-white border border-[oklch(0.7_0_0)] text-[oklch(0.2_0_0)] px-4 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.25_25)] transition-colors"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-[oklch(0.6_0_0)] text-xs uppercase tracking-widest font-display font-semibold mb-2">
                    Equipamentos de Interesse
                  </label>
                    <input
                    type="text"
                    name="equipment"
                    value={formData.equipment}
                    onChange={handleChange}
                    placeholder="Ex: Sony FX9, Zeiss Prime Set, Aputure 600d..."
                    className="w-full bg-white border border-[oklch(0.7_0_0)] text-[oklch(0.2_0_0)] px-4 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.25_25)] placeholder:text-[oklch(0.5_0_0)] transition-colors"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-[oklch(0.6_0_0)] text-xs uppercase tracking-widest font-display font-semibold mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Descreva seu projeto, necessidades e qualquer informação relevante..."
                    className="w-full bg-white border border-[oklch(0.7_0_0)] text-[oklch(0.2_0_0)] px-4 py-3 text-sm focus:outline-none focus:border-[oklch(0.45_0.25_25)] placeholder:text-[oklch(0.5_0_0)] resize-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="loc7-btn-primary w-full flex items-center justify-center gap-2 text-base py-4 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Mensagem
                    </>
                  )}
                </button>
                
                <p className="text-[oklch(0.5_0_0)] text-xs mt-4 text-center">
                  Ao enviar, você concorda com nossa{" "}
                  <a href="/politica-privacidade" className="text-[oklch(0.45_0.25_25)] hover:text-white transition-colors">
                    Política de Privacidade
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}
