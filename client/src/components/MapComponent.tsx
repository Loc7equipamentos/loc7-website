/*
 * LOC 7 — Google Maps Component
 * Light theme map with custom Loc 7 logo marker overlay
 */

export default function MapComponent() {
  return (
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

      {/* Custom marker overlay positioned over the map */}
      <div 
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10
        }}
      >
        {/* Marker container with Loc 7 logo */}
        <div 
          className="relative flex items-center justify-center cursor-pointer group"
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: "white",
            border: "4px solid #FF0000",
            borderRadius: "50%",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
            transition: "all 0.3s ease",
            pointerEvents: "auto"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.15)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(255, 0, 0, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.4)";
          }}
        >
          {/* Loc 7 Logo */}
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663498586106/dhUfJ7vWmzfPeKJDMH9fdB/logo-Loc-7-para-google_4_b32d3981.jpg"
            alt="Loc 7 Logo"
            className="w-10 h-10 object-contain"
          />

          {/* Tooltip on hover */}
          <div 
            className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 text-xs font-semibold px-3 py-2 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            style={{
              backgroundColor: "white",
              border: "2px solid #FF0000",
              borderRadius: "6px"
            }}
          >
            Loc 7 Equipamentos
            {/* Arrow pointing down */}
            <div 
              className="absolute top-full left-1/2 transform -translate-x-1/2"
              style={{
                width: "0",
                height: "0",
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "6px solid #FF0000"
              }}
            ></div>
          </div>
        </div>

        {/* Info card below marker (visible by default) */}
        <div 
          className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 bg-white rounded shadow-lg p-3 text-xs text-gray-700 whitespace-nowrap pointer-events-auto"
          style={{
            border: "2px solid #FF0000",
            minWidth: "220px"
          }}
        >
          <p className="font-bold text-gray-800 mb-1">Loc 7 Equipamentos</p>
          <p className="text-gray-600 text-xs mb-1">Av. Imperatriz Leopoldina, 957</p>
          <p className="text-gray-600 text-xs mb-2">Sala 1611, Vila Leopoldia</p>
          <p className="text-gray-600 text-xs mb-2">São Paulo, SP - CEP: 05305-011</p>
          <div className="border-t border-gray-200 pt-2 text-xs">
            <p className="text-gray-700"><strong>Seg-Sex:</strong> 08h às 18h</p>
            <p className="text-gray-700"><strong>Sábado:</strong> 09h às 12h</p>
          </div>
        </div>
      </div>
    </div>
  );
}
