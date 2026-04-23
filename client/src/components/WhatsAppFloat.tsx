/*
 * LOC 7 — WhatsApp Float Component (Refined Plug Style)
 */

export default function WhatsAppFloat() {
  const message = encodeURIComponent(
    "Olá! Estou no site da Loc7 e preciso de ajuda para encontrar os equipamentos ideais."
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={`https://wa.me/message/WOIONHHSTABQF1?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Precisa de ajuda?"
        className="
          relative flex items-center
          bg-[oklch(0.12_0_0)]
          text-white
          px-5 pr-12 py-2.5
          rounded-full
          border border-white/10
          shadow-[0_8px_24px_rgba(0,0,0,0.25)]
          transition-all duration-300
          hover:-translate-y-0.5
          hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]
        "
      >
        {/* TEXTO */}
        <span className="text-sm font-medium tracking-wide">
          Precisa de ajuda?
        </span>

        {/* ÍCONE PLUG (MAIOR) */}
        <div
          className="
            absolute
            -right-4
            w-12 h-12
            rounded-full
            bg-[oklch(0.12_0_0)]
            border border-white/10
            flex items-center justify-center
            shadow-[0_8px_20px_rgba(0,0,0,0.4)]
          "
        >
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6"
            fill="none"
            stroke="#25D366"
            strokeWidth="1.8"
          >
            <path d="M20.52 3.48A11.78 11.78 0 0012.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L0 24l6.35-1.66a11.86 11.86 0 005.7 1.46h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.17-1.24-6.15-3.43-8.43z" />
            <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
          </svg>
        </div>
      </a>
    </div>
  );
}
