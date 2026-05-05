import { Instagram, Youtube, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="container py-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr] items-start">

          {/* MARCA */}
          <div>
            <p className="text-[13px] uppercase tracking-[0.22em] text-white/80">
              Loc7 Equipamentos
            </p>

            <p className="mt-3 max-w-[360px] text-sm leading-relaxed text-white/50">
              Locação profissional de equipamentos audiovisuais para cinema,
              foto, broadcast e produções corporativas em São Paulo.
            </p>
          </div>

          {/* CONTATO */}
          <div className="space-y-3 text-sm text-white/65 text-center md:text-left md:mx-auto">
            <p className="text-[12px] uppercase tracking-[0.2em] text-white/85">
              Contato
            </p>

            <p className="flex items-center gap-2">
              <Mail size={15} className="text-white/40" />
              loc7@loc7equipamentos.com.br
            </p>

            <p className="flex items-center gap-2">
              <Phone size={15} className="text-white/40" />
              11 91967-1611 / WhatsApp
            </p>

            <p className="flex items-center gap-2">
              <MapPin size={15} className="text-white/40" />
              Vila Leopoldina · São Paulo
            </p>
          </div>

          {/* HORÁRIO / REDES */}
          <div className="space-y-4 text-sm text-white/65 md:text-right">
            <div>
              <p className="text-[12px] uppercase tracking-[0.2em] text-white/85">
                Atendimento
              </p>

              <p className="mt-3">Seg-Sex: 08h às 18h</p>
              <p>Sábado: 09h às 12h</p>
              <p className="text-xs text-white/40">Domingo/Feriados: Fechado</p>
            </div>

            <div className="flex gap-4 md:justify-end pt-1">
              <a
                href="https://www.instagram.com/loc7equipamentos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/45 transition hover:text-white"
                aria-label="Instagram Loc7"
              >
                <Instagram size={18} />
              </a>

              <a
                href="https://www.youtube.com/@loc7equipamentos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/45 transition hover:text-white"
                aria-label="YouTube Loc7"
              >
                <Youtube size={18} />
              </a>

              <a
                href="https://www.linkedin.com/company/loc7equipamentos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/45 transition hover:text-white"
                aria-label="LinkedIn Loc7"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-2 py-4 text-xs text-white/35 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Loc7 Equipamentos</span>
          <span>Locação audiovisual profissional em São Paulo</span>
        </div>
      </div>
    </footer>
  );
}
