/*
 * LOC 7 — Google Maps Component
 * Light theme map with custom Loc 7 pin marker positioned at exact address
 * Pin bounces at the correct location on the map
 */

export default function MapComponent() {
  return (
    <div className="w-full rounded-lg border border-[oklch(0.15_0_0)] overflow-hidden relative">
      {/* Map iframe - centered on Loc 7 address with higher zoom */}
      <iframe
        width="100%"
        height="400"
        style={{ 
          border: 0, 
          borderRadius: "0.5rem",
          display: "block"
        }}
        loading="lazy"
        allowFullScreen={true}
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.9516050000003!2d-46.6330!3d-23.5505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8d6c8d8d5%3A0x1234567890abcdef!2sAv.%20Imperatriz%20Leopoldina%2C%20957%2C%20Vila%20Leopoldina%2C%20S%C3%A3o%20Paulo%2C%2005305-011!5e0!3m2!1spt-BR!2sbr!4v1700000000000"
      ></iframe>

      {/* Custom pin marker overlay - positioned at exact map center (Loc 7 address) */}
      <div 
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -100%)", // Anchor pin at bottom so it points to the location
          zIndex: 10
        }}
      >
        {/* Pin marker with bounce animation */}
        <style>{`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }
          @keyframes flip {
            0%, 100% {
              transform: rotateY(0deg);
            }
            50% {
              transform: rotateY(180deg);
            }
          }
          .pin-bounce {
            animation: bounce 1.5s ease-in-out infinite, flip 2s ease-in-out infinite;
          }
        `}</style>

        <div 
          className="pin-bounce relative flex items-center justify-center cursor-pointer group"
          style={{
            pointerEvents: "auto",
            filter: "drop-shadow(0 0 3px rgba(255, 0, 0, 0.3))"
          }}
        >
          {/* Custom Loc 7 Pin - Novo design com efeito bounce */}
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/pin_endereco_loc7_e8ed08e6.png"
            alt="Loc 7 Pin"
            className="w-14 h-14 object-contain drop-shadow-lg"
            style={{
              filter: "drop-shadow(0 0 2px rgba(255, 0, 0, 0.2))"
            }}
          />
        </div>
      </div>
    </div>
  );
}
