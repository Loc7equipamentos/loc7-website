/*
 * LOC 7 — Footer Component
 * Cinema Noir Industrial style
 * Dark footer with contact info, hours, social links
 */

import { Link } from "wouter";
import { MapPin, Phone, Mail, Clock, Instagram, Youtube, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[oklch(0.05_0_0)] border-t border-[oklch(0.15_0_0)]">
      {/* Main footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/logo-Loc-7-para-google_4_b32d3981.jpg"
                alt="Loc 7 Equipamentos"
                className="h-16 w-auto mb-4"
              />
            </div>
            <p className="text-[oklch(0.55_0_0)] text-sm leading-relaxed mb-6">
              Locadora de equipamentos audiovisuais profissionais em São Paulo. Câmeras, lentes, iluminação e muito mais para sua produção.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/loc7equipamentos/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] flex items-center justify-center hover:border-[oklch(0.45_0.25_25)] hover:text-[oklch(0.45_0.25_25)] transition-all text-[oklch(0.6_0_0)]"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@loc7equipamentos"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] flex items-center justify-center hover:border-[oklch(0.45_0.25_25)] hover:text-[oklch(0.45_0.25_25)] transition-all text-[oklch(0.6_0_0)]"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/Loc7Equipamentos"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] flex items-center justify-center hover:border-[oklch(0.45_0.25_25)] hover:text-[oklch(0.45_0.25_25)] transition-all text-[oklch(0.6_0_0)]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/loc7equipamentos"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] flex items-center justify-center hover:border-[oklch(0.45_0.25_25)] hover:text-[oklch(0.45_0.25_25)] transition-all text-[oklch(0.6_0_0)]"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display font-semibold text-white uppercase tracking-widest text-sm mb-6 pb-2 border-b border-[oklch(0.18_0_0)]">
              Navegação
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "Catálogo", href: "/catalogo" },
                { name: "Blog", href: "/blog" },
                { name: "Portfólio", href: "/portfolio" },
                { name: "Sobre Nós", href: "/sobre" },
                { name: "Contato", href: "/contato" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[oklch(0.55_0_0)] hover:text-white text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-[oklch(0.45_0.25_25)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold text-white uppercase tracking-widest text-sm mb-6 pb-2 border-b border-[oklch(0.18_0_0)]">
              Categorias
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Câmeras", href: "/catalogo/cameras" },
                { name: "Lentes", href: "/catalogo/lentes" },
                { name: "Iluminação", href: "/catalogo/iluminacao" },
                { name: "Áudio", href: "/catalogo/audio" },
                { name: "Monitores", href: "/catalogo/monitores" },
                { name: "Movimento", href: "/catalogo/movimento" },
                { name: "Wireless", href: "/catalogo/wireless" },
              ].map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={cat.href}
                    className="text-[oklch(0.55_0_0)] hover:text-white text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-[oklch(0.45_0.25_25)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white uppercase tracking-widest text-sm mb-6 pb-2 border-b border-[oklch(0.18_0_0)]">
              Contato
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[oklch(0.45_0.25_25)] mt-0.5 shrink-0" />
                <span className="text-[oklch(0.55_0_0)] text-sm">
                  Av. Imperatriz Leopoldina, 957<br />
                  <span className="text-[oklch(0.4_0_0)] text-xs">Sala 1611, Vila Leopoldia, São Paulo — CEP: 05305-011</span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[oklch(0.45_0.25_25)] shrink-0" />
                <a href="tel:+5511999999999" className="text-[oklch(0.55_0_0)] hover:text-white text-sm transition-colors">
                  +55 (11) 99999-9999
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[oklch(0.45_0.25_25)] shrink-0" />
                <a href="mailto:contato@loc7equipamentos.com.br" className="text-[oklch(0.55_0_0)] hover:text-white text-sm transition-colors">
                  contato@loc7equipamentos.com.br
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[oklch(0.45_0.25_25)] mt-0.5 shrink-0" />
                <div className="text-[oklch(0.55_0_0)] text-sm">
                  <p>Seg–Sex: 09h–18h</p>
                  <p>Sáb: 09h–13h</p>
                  <p className="text-[oklch(0.4_0_0)] text-xs mt-1">Online: 09h–21h</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[oklch(0.12_0_0)]">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[oklch(0.35_0_0)] text-xs font-mono-price">
            © {new Date().getFullYear()} Loc 7 Equipamentos. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs text-[oklch(0.35_0_0)]">
            <Link href="/politica-privacidade" className="hover:text-white transition-colors">
              Política de Privacidade
            </Link>
            <span>|</span>
            <Link href="/termos-uso" className="hover:text-white transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
