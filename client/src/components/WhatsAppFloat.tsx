/*
 * LOC 7 — WhatsApp Float + AI Chatbot Component
 * Fixed bottom-right floating button with chatbot bubble + CTA + Badge
 */

import { useState, useEffect, useRef } from "react";
import { X, Send, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const quickReplies = [
  "Quero alugar uma câmera",
  "Preciso de iluminação",
  "Solicitar orçamento",
  "Ver catálogo completo",
];

const botResponses: Record<string, string> = {
  default: "Olá! Sou o assistente da Loc 7. Como posso ajudar com seu projeto audiovisual? Posso recomendar equipamentos, informar preços ou conectar você com nossa equipe.",
  camera: "Temos câmeras cinema como Sony FX9, RED Komodo, Canon C300 e muito mais. Para qual tipo de produção você precisa? Ficção, documentário, publicidade?",
  lens: "Nossa coleção de lentes inclui sets vintage, anamórficos, primes e zooms. Qual mount você usa? (Sony E, Canon EF/RF, PL?)",
  light: "Para iluminação temos Aputure, Godox, Nanlite e outros. Qual o tamanho do seu set? Estúdio ou externa?",
  budget: "Para solicitar um orçamento, clique no botão do WhatsApp abaixo ou me informe: equipamentos necessários, data de locação e duração do projeto.",
  catalog: "Acesse nosso catálogo completo em /catalogo para ver todos os equipamentos com preços e disponibilidade.",
};

function getBotResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("câmera") || lower.includes("camera")) return botResponses.camera;
  if (lower.includes("lente") || lower.includes("lens")) return botResponses.lens;
  if (lower.includes("luz") || lower.includes("iluminação") || lower.includes("light")) return botResponses.light;
  if (lower.includes("orçamento") || lower.includes("preço") || lower.includes("valor")) return botResponses.budget;
  if (lower.includes("catálogo") || lower.includes("catalogo")) return botResponses.catalog;
  return botResponses.default;
}

export default function WhatsAppFloat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Olá! 👋 Sou o assistente da Loc 7. Como posso ajudar com seu projeto audiovisual?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = (content: string) => {
    if (!content.trim()) return;
    
    const userMsg: Message = { role: "user", content };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getBotResponse(content);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      
      {/* Chat window */}
      {isChatOpen && (
        <div className="w-80 bg-[oklch(0.1_0_0)] border border-[oklch(0.22_0_0)] rounded-lg shadow-2xl shadow-black/70 overflow-hidden animate-fade-in-up">
          {/* Chat header */}
          <div className="bg-[oklch(0.08_0_0)] border-b border-[oklch(0.18_0_0)] p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[oklch(0.45_0.25_25)] rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold" style={{ fontFamily: 'Oswald, sans-serif' }}>Assistente Loc 7</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[oklch(0.5_0_0)] text-xs">Online agora</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-[oklch(0.5_0_0)] hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "bg-[oklch(0.45_0.25_25)] text-white"
                    : "bg-[oklch(0.15_0_0)] text-[oklch(0.85_0_0)] border border-[oklch(0.2_0_0)]"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[oklch(0.15_0_0)] border border-[oklch(0.2_0_0)] rounded-lg px-3 py-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[oklch(0.5_0_0)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-[oklch(0.5_0_0)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-[oklch(0.5_0_0)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          <div className="px-3 pb-2 flex flex-wrap gap-1.5">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => sendMessage(reply)}
                className="text-xs bg-[oklch(0.15_0_0)] border border-[oklch(0.22_0_0)] text-[oklch(0.7_0_0)] hover:border-[oklch(0.45_0.25_25)] hover:text-white px-2 py-1 rounded transition-all"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-[oklch(0.18_0_0)] p-3 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-[oklch(0.15_0_0)] border border-[oklch(0.22_0_0)] text-white text-sm px-3 py-2 rounded focus:outline-none focus:border-[oklch(0.45_0.25_25)] placeholder:text-[oklch(0.4_0_0)]"
            />
            <button
              onClick={() => sendMessage(inputValue)}
              className="w-9 h-9 bg-[oklch(0.45_0.25_25)] hover:bg-[oklch(0.55_0.25_25)] flex items-center justify-center rounded transition-colors"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* WhatsApp link */}
          <div className="border-t border-[oklch(0.18_0_0)] p-3">
            <a
              href="https://wa.me/message/WOIONHHSTABQF1?text=Olá! Vim pelo site e gostaria de um orçamento."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5a] text-white text-sm font-semibold py-2 rounded transition-colors"
              style={{ fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Falar no WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Bubble hint with CTA */}
      {showBubble && !isChatOpen && (
        <div className="chatbot-bubble animate-fade-in-up">
          <p className="text-sm font-medium text-white mb-1">Posso ajudar? 💬</p>
          <p className="text-xs text-[oklch(0.6_0_0)]">Clique para falar com nosso assistente</p>
        </div>
      )}

      {/* Main button with pulse animation and badge */}
      <div className="relative">
        {/* Pulse ring background */}
        <div className="absolute inset-0 w-14 h-14 bg-[#25D366] rounded-full animate-pulse opacity-60" />
        
        {/* Badge with notification */}
        <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
          1
        </div>
        
        <button
          onClick={() => {
            setIsChatOpen(!isChatOpen);
            setShowBubble(false);
          }}
          className="relative w-14 h-14 bg-[#25D366] hover:bg-[#1ebe5a] rounded-full flex items-center justify-center shadow-lg shadow-black/50 transition-all hover:scale-110 active:scale-95 z-10"
        >
          {isChatOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
