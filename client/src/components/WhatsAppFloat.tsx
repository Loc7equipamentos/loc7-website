/*
 * LOC 7 — WhatsApp Float Component
 */

import { useEffect, useState } from "react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const whatsappLink = getWhatsAppLink({ context: "floating" });

  return (
    <div
      className={`
        fixed bottom-7 right-6 z-50 md:bottom-8 md:right-8
        transition-all duration-700 ease-out
        ${visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}
      `}
    >
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        title="Precisa de ajuda?"
        className="
          relative flex items-center
          bg-black/95
          text-white
          px-5 pr-[58px] py-2.5
          rounded-full
          border border-white/10
          shadow-[0_14px_42px_rgba(0,0,0,0.42)]
          backdrop-blur-sm
          transition-all duration-300
          hover:-translate-y-[2px]
          hover:border-white/20
          hover:shadow-[0_18px_52px_rgba(0,0,0,0.5)]
        "
      >
        <span className="relative z-10 text-sm font-medium tracking-wide leading-none">
          Precisa de ajuda?
        </span>

        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <span className="shine-bar" />
        </span>

        <div
          className="
            absolute -right-4 z-20
            flex h-[56px] w-[56px] items-center justify-center
            rounded-full
            bg-black
            border border-[#25D366]/45
            shadow-[0_10px_30px_rgba(37,211,102,0.22),0_12px_30px_rgba(0,0,0,0.45)]
            transition-all duration-300
          "
        >
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8"
            fill="none"
            stroke="#25D366"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.52 3.48A11.78 11.78 0 0012.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L0 24l6.35-1.66a11.86 11.86 0 005.7 1.46h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.17-1.24-6.15-3.43-8.43z" />
            <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
          </svg>
        </div>
      </a>

      <style>
        {`
          .shine-bar {
            position: absolute;
            top: 0;
            left: -60%;
            width: 60%;
            height: 100%;
            background: linear-gradient(
              120deg,
              transparent 0%,
              rgba(255,255,255,0.13) 50%,
              transparent 100%
            );
            transform: skewX(-20deg);
            animation: shineMove 4.8s linear infinite;
          }

          @keyframes shineMove {
            0% { left: -60%; opacity: 0; }
            10% { opacity: 0.35; }
            60% { left: 120%; opacity: 0.25; }
            100% { left: 120%; opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}
