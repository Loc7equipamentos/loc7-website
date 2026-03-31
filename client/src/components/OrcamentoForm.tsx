/*
 * LOC 7 — Formulário de Orçamento
 * Captura dados do cliente e envia para WhatsApp
 * Com seletor de categorias e busca de equipamentos
 */

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Check, Search, X } from "lucide-react";
import { toast } from "sonner";

const CATEGORIAS_EQUIPAMENTOS = [
  { id: "cameras", label: "📷 Câmeras", icon: "📷" },
  { id: "lentes", label: "🔍 Lentes", icon: "🔍" },
  { id: "iluminacao", label: "💡 Iluminação", icon: "💡" },
  { id: "audio", label: "🎤 Áudio", icon: "🎤" },
  { id: "monitores", label: "📺 Monitores", icon: "📺" },
  { id: "movimento", label: "🎬 Movimento", icon: "🎬" },
  { id: "wireless", label: "📡 Wireless", icon: "📡" },
  { id: "modificadores", label: "🎨 Modificadores", icon: "🎨" },
  { id: "maquinaria", label: "⚙️ Maquinaria", icon: "⚙️" },
  { id: "outro", label: "🔧 Outro", icon: "🔧" },
];

const EQUIPAMENTOS_SUGERIDOS = [
  { nome: "RED Komodo", categoria: "cameras" },
  { nome: "Sony FX9", categoria: "cameras" },
  { nome: "Canon R5C", categoria: "cameras" },
  { nome: "Zeiss Prime Set", categoria: "lentes" },
  { nome: "Cooke Anamorphic", categoria: "lentes" },
  { nome: "Sigma Art Lenses", categoria: "lentes" },
  { nome: "Aputure 600D", categoria: "iluminacao" },
  { nome: "Kino Flo", categoria: "iluminacao" },
  { nome: "Dedolight", categoria: "iluminacao" },
  { nome: "Sennheiser Wireless", categoria: "audio" },
  { nome: "Rode Microphone", categoria: "audio" },
  { nome: "Shure Lavalier", categoria: "audio" },
  { nome: "SmallHD Monitor", categoria: "monitores" },
  { nome: "Atomos Ninja", categoria: "monitores" },
  { nome: "Blackmagic Video Assist", categoria: "monitores" },
  { nome: "Steadicam", categoria: "movimento" },
  { nome: "Gimbal DJI", categoria: "movimento" },
  { nome: "Dolly System", categoria: "movimento" },
  { nome: "Wireless Follow Focus", categoria: "wireless" },
  { nome: "Wireless Video Transmitter", categoria: "wireless" },
  { nome: "Wireless Lens Control", categoria: "wireless" },
  { nome: "Matte Box", categoria: "modificadores" },
  { nome: "Follow Focus", categoria: "modificadores" },
  { nome: "Lens Filters", categoria: "modificadores" },
  { nome: "Crane", categoria: "maquinaria" },
  { nome: "Jib Arm", categoria: "maquinaria" },
  { nome: "Slider", categoria: "maquinaria" },
];

export default function OrcamentoForm() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    categorias: [] as string[],
    equipamentos: "",
    dataInicio: "",
    dataFim: "",
    observacoes: "",
  });

  const [buscaEquipamentos, setBuscaEquipamentos] = useState("");
  const [equipamentosSelecionados, setEquipamentosSelecionados] = useState<
    string[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar equipamentos baseado na busca
  const equipamentosFiltrados = useMemo(() => {
    if (!buscaEquipamentos.trim()) return [];

    return EQUIPAMENTOS_SUGERIDOS.filter((eq) =>
      eq.nome.toLowerCase().includes(buscaEquipamentos.toLowerCase())
    ).slice(0, 8); // Limitar a 8 sugestões
  }, [buscaEquipamentos]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleCategoria = (categoriaId: string) => {
    setFormData((prev) => ({
      ...prev,
      categorias: prev.categorias.includes(categoriaId)
        ? prev.categorias.filter((id) => id !== categoriaId)
        : [...prev.categorias, categoriaId],
    }));
  };

  const adicionarEquipamento = (equipamento: string) => {
    if (!equipamentosSelecionados.includes(equipamento)) {
      setEquipamentosSelecionados((prev) => [...prev, equipamento]);
      setBuscaEquipamentos("");
    }
  };

  const removerEquipamento = (equipamento: string) => {
    setEquipamentosSelecionados((prev) =>
      prev.filter((eq) => eq !== equipamento)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validar campos obrigatórios
    if (!formData.nome || !formData.telefone) {
      toast.error("Por favor, preencha nome e telefone");
      setIsLoading(false);
      return;
    }

    if (
      formData.categorias.length === 0 &&
      equipamentosSelecionados.length === 0 &&
      !formData.equipamentos
    ) {
      toast.error(
        "Por favor, selecione categorias, equipamentos ou descreva suas necessidades"
      );
      setIsLoading(false);
      return;
    }

    // Montar lista de categorias selecionadas
    const categoriasTexto = formData.categorias
      .map((id) => {
        const categoria = CATEGORIAS_EQUIPAMENTOS.find((c) => c.id === id);
        return categoria?.label || id;
      })
      .join(", ");

    // Montar lista de equipamentos selecionados
    const equipamentosTexto =
      equipamentosSelecionados.length > 0
        ? equipamentosSelecionados.join(", ")
        : "Nenhum";

    // Montar mensagem para WhatsApp
    const mensagem = `
*SOLICITAÇÃO DE ORÇAMENTO - LOC 7*

*Dados do Cliente:*
Nome: ${formData.nome}
Email: ${formData.email}
Telefone: ${formData.telefone}
Empresa: ${formData.empresa || "N/A"}

*Categorias de Interesse:*
${categoriasTexto || "Não especificadas"}

*Equipamentos Selecionados:*
${equipamentosTexto}

*Observações Adicionais:*
${formData.equipamentos || "Nenhuma"}

*Período de Locação:*
Data Início: ${formData.dataInicio || "N/A"}
Data Fim: ${formData.dataFim || "N/A"}

*Notas:*
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
      categorias: [],
      equipamentos: "",
      dataInicio: "",
      dataFim: "",
      observacoes: "",
    });
    setEquipamentosSelecionados([]);
    setBuscaEquipamentos("");

    toast.success("Redirecionando para WhatsApp...");
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-[oklch(0.08_0_0)] rounded-lg border border-[oklch(0.15_0_0)]">
      <h2 className="text-2xl font-bold text-white mb-2 font-oswald uppercase">
        Solicite seu Orçamento
      </h2>
      <p className="text-[oklch(0.7_0_0)] mb-6">
        Preencha o formulário abaixo e envie direto para nosso WhatsApp
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Seletor de Categorias */}
        <div>
          <label className="block text-sm font-semibold text-white mb-3">
            Categorias de Equipamentos *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {CATEGORIAS_EQUIPAMENTOS.map((categoria) => (
              <button
                key={categoria.id}
                type="button"
                onClick={() => toggleCategoria(categoria.id)}
                className={`p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                  formData.categorias.includes(categoria.id)
                    ? "border-[#FF0000] bg-[oklch(0.15_0_0)]"
                    : "border-[oklch(0.2_0_0)] bg-[oklch(0.12_0_0)] hover:border-[oklch(0.3_0_0)]"
                }`}
              >
                <span className="text-sm font-semibold text-white text-left flex-1">
                  {categoria.label}
                </span>
                {formData.categorias.includes(categoria.id) && (
                  <Check size={16} className="text-[#FF0000] flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Busca de Equipamentos */}
        <div>
          <label className="block text-sm font-semibold text-white mb-3">
            Buscar Equipamentos Específicos
          </label>
          <div className="relative">
            <div className="flex items-center bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] rounded-lg px-4 py-3">
              <Search size={18} className="text-[oklch(0.5_0_0)] mr-2" />
              <input
                type="text"
                value={buscaEquipamentos}
                onChange={(e) => setBuscaEquipamentos(e.target.value)}
                placeholder="Ex: RED, Zeiss, Aputure..."
                className="flex-1 bg-transparent text-white placeholder:text-[oklch(0.5_0_0)] outline-none"
              />
            </div>

            {/* Sugestões de Equipamentos */}
            {buscaEquipamentos && equipamentosFiltrados.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] rounded-lg z-10 max-h-64 overflow-y-auto">
                {equipamentosFiltrados.map((eq) => (
                  <button
                    key={eq.nome}
                    type="button"
                    onClick={() => adicionarEquipamento(eq.nome)}
                    className="w-full text-left px-4 py-2 hover:bg-[oklch(0.15_0_0)] text-white text-sm transition-colors border-b border-[oklch(0.15_0_0)] last:border-b-0"
                  >
                    {eq.nome}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Equipamentos Selecionados */}
          {equipamentosSelecionados.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {equipamentosSelecionados.map((eq) => (
                <div
                  key={eq}
                  className="bg-[#FF0000] text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                >
                  {eq}
                  <button
                    type="button"
                    onClick={() => removerEquipamento(eq)}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Observações Adicionais */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Observações Adicionais
          </label>
          <Textarea
            name="equipamentos"
            value={formData.equipamentos}
            onChange={handleChange}
            placeholder="Descreva suas necessidades específicas, quantidades, prazos, etc..."
            className="bg-[oklch(0.12_0_0)] border-[oklch(0.2_0_0)] text-white placeholder:text-[oklch(0.5_0_0)] min-h-20"
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

        {/* Notas Finais */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Notas Finais
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
          className="w-full bg-[#FF0000] hover:bg-[#cc0000] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 uppercase font-oswald tracking-wider"
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
