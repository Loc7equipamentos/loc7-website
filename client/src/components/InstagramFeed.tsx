/*
 * LOC 7 — Instagram Feed Component
 * Exibe embed do Instagram com posts recentes
 */

import { useEffect } from "react";
import { Instagram } from "lucide-react";

export default function InstagramFeed() {
  useEffect(() => {
    // Carregar script do Instagram
    if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    } else {
      const script = document.createElement("script");
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="py-16 bg-[oklch(0.06_0_0)]">
      <div className="container">
        <div className="mb-10">
          <span className="loc7-section-title text-base">INSTAGRAM LOC 7</span>
          <div className="loc7-red-line" />
          <p className="text-[oklch(0.5_0_0)] text-sm mt-3">
            Acompanhe nossos últimos equipamentos e produções
          </p>
        </div>

        {/* Instagram Embed */}
        <div className="flex justify-center">
          <iframe
            src="https://www.instagram.com/loc7equipamentos/embed"
            width="320"
            height="500"
            frameBorder="0"
            scrolling="no"
            allowTransparency={true}
            className="rounded-lg"
          />
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <a
            href="https://www.instagram.com/loc7equipamentos/"
            target="_blank"
            rel="noopener noreferrer"
            className="loc7-btn-outline inline-flex items-center gap-2"
          >
            <Instagram className="w-4 h-4" />
            Seguir no Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
