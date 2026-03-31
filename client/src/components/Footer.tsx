/*
 * LOC 7 — Footer Component
 * Cinema Noir Industrial style + Filmhouse structure
 * 3 columns: Contact | Hours | Social Media
 */

import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[oklch(0.05_0_0)] border-t border-[oklch(0.15_0_0)]">
      {/* Main footer */}
      <div className="container py-16">
        {/* Logo centered */}
        <div className="flex justify-center mb-12">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/logo-Loc-7-para-google_4_b32d3981.jpg"
            alt="Loc 7 Rental House"
            className="h-20 w-auto"
          />
          <p className="text-center text-[oklch(0.6_0_0)] text-sm mt-2" style={{ fontFamily: 'Oswald, sans-serif', letterSpacing: '0.05em' }}>RENTAL HOUSE</p>
        </div>

        {/* 3 Columns - Filmhouse style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 border-b border-[oklch(0.15_0_0)] pb-12">
          
          {/* Column 1: CONTATO */}
          <div>
            <h4 
              className="font-bold text-white uppercase tracking-wider text-sm mb-6 pb-2 border-b border-[#00FF00]"
              style={{ fontFamily: 'Oswald, sans-serif', letterSpacing: '0.1em', color: '#00FF00' }}
            >
              Contato
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="text-[#00FF00]">📧</span>
                <a 
                  href="mailto:loc7@loc7equipamentos.com.br" 
                  className="text-[oklch(0.6_0_0)] hover:text-white text-sm transition-colors"
                >
                  loc7@loc7equipamentos.com.br
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#00FF00]">📱</span>
                <a 
                  href="tel:+5511997237850" 
                  className="text-[oklch(0.6_0_0)] hover:text-white text-sm transition-colors"
                >
                  11 99723-7850 / WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: HORÁRIO DE ATENDIMENTO */}
          <div>
            <h4 
              className="font-bold text-white uppercase tracking-wider text-sm mb-6 pb-2 border-b border-[#00FF00]"
              style={{ fontFamily: 'Oswald, sans-serif', letterSpacing: '0.1em', color: '#00FF00' }}
            >
              Horário de Atendimento
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="text-[oklch(0.6_0_0)]">
                <strong className="text-white">Online:</strong> das 08h às 18h
              </li>
              <li className="text-[oklch(0.6_0_0)]">
                <strong className="text-white">Seg-Sex:</strong> das 08h às 18h
              </li>
              <li className="text-[oklch(0.6_0_0)]">
                <strong className="text-white">Sábado:</strong> das 09h às 12h
              </li>
              <li className="text-[oklch(0.4_0_0)] text-xs">
                Domingo/Feriados: Fechado
              </li>
            </ul>
          </div>

          {/* Column 3: REDES SOCIAIS */}
          <div>
            <h4 
              className="font-bold text-white uppercase tracking-wider text-sm mb-6 pb-2 border-b border-[#00FF00]"
              style={{ fontFamily: 'Oswald, sans-serif', letterSpacing: '0.1em', color: '#00FF00' }}
            >
              Redes Sociais
            </h4>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/loc7equipamentos" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] flex items-center justify-center hover:border-[#00FF00] hover:text-[#00FF00] transition-all text-[oklch(0.6_0_0)]"
                title="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                </svg>
              </a>
              <a 
                href="https://www.facebook.com/Loc7Equipamentos" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] flex items-center justify-center hover:border-[#00FF00] hover:text-[#00FF00] transition-all text-[oklch(0.6_0_0)]"
                title="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://www.youtube.com/@loc7equipamentos" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-[oklch(0.12_0_0)] border border-[oklch(0.2_0_0)] flex items-center justify-center hover:border-[#00FF00] hover:text-[#00FF00] transition-all text-[oklch(0.6_0_0)]"
                title="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="text-center mb-8">
          <p className="text-[oklch(0.6_0_0)] text-sm">
            📍 Av. Imperatriz Leopoldina, 957 — Sala 1611, Vila Leopoldia<br />
            <span className="text-[oklch(0.4_0_0)] text-xs">São Paulo, SP — CEP: 05305-011</span>
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[oklch(0.12_0_0)]">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[oklch(0.35_0_0)] text-xs">
            © {new Date().getFullYear()} Loc 7 Equipamentos. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs text-[oklch(0.35_0_0)]">
            <Link href="/" className="hover:text-white transition-colors">
              Política de Privacidade
            </Link>
            <span>|</span>
            <Link href="/" className="hover:text-white transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
