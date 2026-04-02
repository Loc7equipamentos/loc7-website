/*
 * LOC 7 — Google Maps Component
 * Light theme map with custom Loc 7 pin marker and bounce animation
 */

export default function MapComponent() {
  return (
    <div className="w-full">
      {/* Map container */}
      <div className="w-full rounded-lg border border-[oklch(0.15_0_0)] overflow-hidden relative">
        {/* Map iframe */}
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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.9516050000003!2d-46.63330232345!3d-23.550500000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8d6c8d8d5%3A0x1234567890abcdef!2sAv.%20Imperatriz%20Leopoldina%2C%20957%20-%20Vila%20Leopoldia%2C%20S%C3%A3o%20Paulo%2C%20SP%2005305-011!5e0!3m2!1spt-BR!2sbr!4v1234567890"
        ></iframe>

        {/* Custom pin marker overlay positioned over the map */}
        <div 
          className="absolute pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
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
                transform: translateY(-16px);
              }
            }
            .pin-bounce {
              animation: bounce 1.5s ease-in-out infinite;
            }
          `}</style>

          <div 
            className="pin-bounce relative flex items-center justify-center cursor-pointer group"
            style={{
              pointerEvents: "auto",
              filter: "drop-shadow(0 0 12px rgba(255, 0, 0, 0.6))"
            }}
          >
            {/* Custom Loc 7 Pin - 30% larger (48px * 1.3 ≈ 62px) */}
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/PINMAPALOC7SITE_e5a2dc07.webp"
              alt="Loc 7 Pin"
              className="w-16 h-16 object-contain drop-shadow-lg"
              style={{
                filter: "drop-shadow(0 0 8px rgba(255, 0, 0, 0.5))"
              }}
            />
          </div>
        </div>
      </div>

      {/* Address section below map */}
      <div className="mt-4 text-center">
        <p className="text-white text-sm font-medium">
          Av. Imperatriz Leopoldina, 957, Vila Leopoldina<br />
          <span className="text-[oklch(0.5_0_0)]">CEP 05305-011 — São Paulo, SP</span>
        </p>
      </div>
    </div>
  );
}
