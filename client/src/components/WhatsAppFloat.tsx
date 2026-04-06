/*
 * LOC 7 — WhatsApp Float Component
 * Uses image asset for perfect visual match
 */

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/message/WOIONHHSTABQF1?text=Olá! Gostaria de um orçamento."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 z-50 hover:scale-110 active:scale-95 transition-transform" style={{ right: '-2rem' }}
      title="Posso ajudar?"
    >
      <img
        src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/whatsapp-float-falar-agora_da8656ec.png"
        alt="Posso ajudar? - WhatsApp"
        className="w-auto h-auto drop-shadow-lg hover:drop-shadow-xl transition-all"
        style={{ maxWidth: '280px' }}
      />
    </a>
  );
}
