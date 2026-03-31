/*
 * LOC 7 — Formulário de Orçamento
 * Captura dados do cliente e envia para WhatsApp
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

export default function OrcamentoForm() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    equipamentos: "",
    dataInicio: "",
    dataFim: "",
    observacoes: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validar campos obrigatórios
    if (!formData.nome || !formData.telefone || !formData.equipamentos) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      setIsLoading(false);
      return;
    }

    // Montar mensagem para WhatsApp
    const mensagem = `
*SOLICITAÇÃO DE ORÇAMENTO - LOC 7*

*Dados do Cliente:*
Nome: ${formData.nome}
Email: ${formData.email}
Telefone: ${formData.telefone}
Empresa: ${formData.empresa || "N/A"}

*Detalhes do Pedido:*
Equipamentos: ${formData.equipamentos}
Data Início: ${formData.dataInicio || "N/A"}
Data Fim: ${formData.dataFim || "N/A"}

*Observações:*
${formData.observacoes || "Nenhuma"}

---
Enviado via formulário do site
    `.trim();

    // Codificar mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);

    // Link do WhatsApp
    const whatsappLink = `https://wa.me/message/WOIONHHSTABQF1?text=${mensagemCodificada}`;

    // Abrir WhatsApp
    window.open(whatsappLink, "_blank");

    // Limpar formulário
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      empresa: "",
      equipamentos: "",
      dataInicio: "",
      dataFim: "",
      observacoes: "",
    });

    toast.success("Redirecionando para WhatsApp...");
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-[oklch(0.08_0_0)] rounded-lg border border-[oklch(0.15_0_0)]">
      <h2 className="text-2xl font-bold text-white mb-2 font-oswald uppercase">
        Solicite seu Orçamento
      </h2>
      <p className="text-[oklch(0.7_0_0)] mb-6">
        Preencha o formulário abaixo e envie direto para nosso WhatsApp
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Linha 1: Nome e Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Nome *
            </label>
            <Input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Seu nome completo"
              className="bg-[oklch(0.12_0_0)] border-[oklch(0.2_0_0)] text-white placeholder:text-[oklch(0.5_0_0)]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Email
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              className="bg-[oklch(0.12_0_0)] border-[oklch(0.2_0_0)] text-white placeholder:text-[oklch(0.5_0_0)]"
            />
          </div>
        </div>

        {/* Linha 2: Telefone e Empresa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Telefone *
            </label>
            <Input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(11) 9999-9999"
              className="bg-[oklch(0.12_0_0)] border-[oklch(0.2_0_0)] text-white placeholder:text-[oklch(0.5_0_0)]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Empresa
            </label>
            <Input
              type="text"
              name="empresa"
              value={formData.empresa}
              onChange={handleChange}
              placeholder="Nome da empresa (opcional)"
              className="bg-[oklch(0.12_0_0)] border-[oklch(0.2_0_0)] text-white placeholder:text-[oklch(0.5_0_0)]"
            />
          </div>
        </div>

        {/* Equipamentos */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Equipamentos Desejados *
          </label>
          <Textarea
            name="equipamentos"
            value={formData.equipamentos}
            onChange={handleChange}
            placeholder="Ex: 2x RED Komodo, 3x Lentes Zeiss, 1x Kit de Iluminação..."
            className="bg-[oklch(0.12_0_0)] border-[oklch(0.2_0_0)] text-white placeholder:text-[oklch(0.5_0_0)] min-h-24"
            required
          />
        </div>

        {/* Linha 3: Datas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Data de Início
            </label>
            <Input
              type="date"
              name="dataInicio"
              value={formData.dataInicio}
              onChange={handleChange}
              className="bg-[oklch(0.12_0_0)] border-[oklch(0.2_0_0)] text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Data de Fim
            </label>
            <Input
              type="date"
              name="dataFim"
              value={formData.dataFim}
              onChange={handleChange}
              className="bg-[oklch(0.12_0_0)] border-[oklch(0.2_0_0)] text-white"
            />
          </div>
        </div>

        {/* Observações */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Observações Adicionais
          </label>
          <Textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            placeholder="Alguma informação importante que devemos saber?"
            className="bg-[oklch(0.12_0_0)] border-[oklch(0.2_0_0)] text-white placeholder:text-[oklch(0.5_0_0)] min-h-20"
          />
        </div>

        {/* Botão de Envio */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#25D366] hover:bg-[#20ba58] text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 uppercase font-oswald tracking-wider"
        >
          <MessageCircle size={20} />
          {isLoading ? "Enviando..." : "Enviar para WhatsApp"}
        </Button>

        <p className="text-xs text-[oklch(0.6_0_0)] text-center">
          * Campos obrigatórios. Você será redirecionado para o WhatsApp para confirmar o envio.
        </p>
      </form>
    </div>
  );
}
