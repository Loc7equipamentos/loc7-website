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

            {/* WhatsApp direct */}
            <a
              href="https://wa.me/message/WOIONHHSTABQF1?text=Olá! Gostaria de solicitar um orçamento de locação de equipamentos."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#1ebe5a] text-white font-display font-bold uppercase tracking-widest py-4 transition-colors text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Falar no WhatsApp Agora
            </a>
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
