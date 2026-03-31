/*
 * LOC 7 — Google Maps Component
 * Dark theme map with location marker
 */

import { useEffect, useRef } from "react";

export default function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const googleRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Coordenadas da Loc 7: Av. Imperatriz Leopoldina, 957, Vila Leopoldia, São Paulo
    const location = { lat: -23.5505, lng: -46.6333 };

    // Criar mapa com tema escuro
    if (!window.google) {
      console.error('Google Maps API não carregada');
      return;
    }
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      zoom: 15,
      center: location,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#263c3f" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b9080" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9ca5b3" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#746855" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#1f2835" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#f3751ff" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#2f3948" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }],
        },
      ],
    });

    // Adicionar marcador com cor vermelha (Loc 7 brand color)
    new window.google.maps.Marker({
      position: location,
      map: mapInstance.current,
      title: "Loc 7 Equipamentos",
      icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    });

    // Info window com detalhes da empresa
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="color: #fff; background: #0a0a0a; padding: 12px; border-radius: 4px; font-family: 'Oswald', sans-serif;">
          <h3 style="margin: 0 0 8px 0; color: #FF0000; font-size: 16px;">LOC 7 EQUIPAMENTOS</h3>
          <p style="margin: 4px 0; font-size: 12px;">Av. Imperatriz Leopoldina, 957</p>
          <p style="margin: 4px 0; font-size: 12px;">Sala 1611, Vila Leopoldia</p>
          <p style="margin: 4px 0; font-size: 12px;">São Paulo, SP - 05305-011</p>
          <p style="margin: 8px 0 0 0; font-size: 11px; color: #888;">Seg-Sex: 08h-18h | Sab: 09h-12h</p>
        </div>
      `,
    });

    const marker = new window.google.maps.Marker({
      position: location,
      map: mapInstance.current,
      visible: false,
    });

    infoWindow.open(mapInstance.current, marker);

  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full h-96 rounded-lg border border-[oklch(0.15_0_0)] overflow-hidden"
      style={{ minHeight: "400px" }}
    />
  );
}
