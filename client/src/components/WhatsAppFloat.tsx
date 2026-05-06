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
        fixed bottom-[88px] right-5 z-50 md:bottom-10 md:right-8
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
          px-4 pr-[54px] py-2 md:px-5 md:pr-[58px] md:py-2.5
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
        <span className="relative z-10 text-[13px] md:text-sm font-medium tracking-wide leading-none">
          Precisa de ajuda?
        </span>

        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <span className="shine-bar" />
        </span>

        <div
          className="
            absolute -right-4 z-20
            flex h-[52px] w-[52px] md:h-[56px] md:w-[56px] items-center justify-center
            rounded-full
            bg-black
            border border-[#25D366]/45
            shadow-[0_6px_16px_rgba(0,0,0,0.26)]
            transition-all duration-300
          "
        >
          <svg
            viewBox="0 0 32 32"
            className="h-7 w-7 md:h-8 md:w-8"
            fill="#25D366"
            aria-hidden="true"
          >
            <path d="M16.02 3.2C9 3.2 3.3 8.9 3.3 15.9c0 2.25.6 4.45 1.72 6.38L3.2 28.8l6.68-1.75a12.66 12.66 0 0 0 6.14 1.56h.01c7.02 0 12.72-5.7 12.72-12.7 0-3.4-1.32-6.6-3.72-9A12.62 12.62 0 0 0 16.02 3.2Zm0 23.25h-.01a10.5 10.5 0 0 1-5.35-1.46l-.38-.23-3.96 1.04 1.06-3.86-.25-.4a10.47 10.47 0 0 1-1.6-5.64c0-5.78 4.7-10.48 10.5-10.48 2.8 0 5.43 1.1 7.4 3.07a10.42 10.42 0 0 1 3.07 7.41c0 5.78-4.7 10.47-10.48 10.47Zm5.75-7.85c-.32-.16-1.86-.92-2.15-1.02-.29-.1-.5-.16-.7.16-.21.32-.81 1.02-1 1.23-.18.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.7-1.7-.96-2.33-.25-.61-.51-.52-.7-.53h-.6c-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.67 0 1.57 1.15 3.1 1.31 3.31.16.21 2.26 3.45 5.47 4.84.76.33 1.36.53 1.82.68.77.24 1.47.21 2.02.13.62-.09 1.86-.76 2.12-1.5.26-.73.26-1.36.18-1.5-.08-.13-.29-.21-.61-.37Z" />
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
