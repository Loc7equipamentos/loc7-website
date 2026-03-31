/*
 * LOC 7 — Google Maps Component
 * Embedded dark theme map with location marker
 */

export default function MapComponent() {
  return (
    <div className="w-full rounded-lg border border-[oklch(0.15_0_0)] overflow-hidden">
      <iframe
        width="100%"
        height="400"
        style={{ 
          border: 0, 
          borderRadius: "0.5rem",
          filter: "invert(1) hue-rotate(180deg)"
        }}
        loading="lazy"
        allowFullScreen={true}
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.9516050000003!2d-46.63330232345!3d-23.550500000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8d6c8d8d5%3A0x1234567890abcdef!2sAv.%20Imperatriz%20Leopoldina%2C%20957%20-%20Vila%20Leopoldia%2C%20S%C3%A3o%20Paulo%2C%20SP%2005305-011!5e0!3m2!1spt-BR!2sbr!4v1234567890"
      ></iframe>
    </div>
  );
}
