import { Instagram, Youtube, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[oklch(0.05_0_0)] border-t border-[oklch(0.12_0_0)]">
      <div className="container py-10 grid gap-8 md:grid-cols-3 items-start">

        {/* CONTATO */}
        <div className="flex flex-col gap-2 text-sm text-white/80">
          <p className="text-white font-medium">Contato</p>
          <p>loc7@loc7equipamentos.com.br</p>
          <p>11 99723-7850 / WhatsApp</p>
        </div>

        {/* HORÁRIO */}
        <div className="flex flex-col gap-2 text-sm text-white/80">
          <p className="text-white font-medium">Horário</p>
          <p>Seg-Sex: 08h às 18h</p>
          <p>Sábado: 09h às 12h</p>
          <p className="text-xs text-white/50">Domingo/Feriados: Fechado</p>
        </div>

        {/* REDES */}
        <div className="flex md:justify-end gap-4 items-center">
          <a
            href="https://www.instagram.com/loc7equipamentos"
            target="_blank"
            className="opacity-60 hover:opacity-100 transition"
          >
            <Instagram size={18} />
          </a>

          <a
            href="https://www.youtube.com/@loc7equipamentos"
            target="_blank"
            className="opacity-60 hover:opacity-100 transition"
          >
            <Youtube size={18} />
          </a>

          <a
            href="https://www.linkedin.com/company/loc7equipamentos"
            target="_blank"
            className="opacity-60 hover:opacity-100 transition"
          >
            <Linkedin size={18} />
          </a>
        </div>
      </div>

      {/* LINHA FINAL */}
      <div className="border-t border-[oklch(0.12_0_0)] text-center text-xs text-white/40 py-4">
        © {new Date().getFullYear()} Loc 7 Equipamentos
      </div>
    </footer>
  );
}
