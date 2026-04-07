/**
 * Mapeamento de produtos relacionados para cross-sell
 * Chave = slug do produto principal
 * Valor = array de produtos que combinam bem
 */

export const relacionados: Record<string, Array<{ id: number; name: string; price: number; category: string }>> = {
  // Câmeras
  "sony-fx9": [
    { id: 101, name: "Lente Sony 24-70mm", price: 1200, category: "Lentes" },
    { id: 102, name: "Bateria BP-U70", price: 150, category: "Acessórios" },
    { id: 103, name: "Monitor SmallHD 702", price: 300, category: "Monitores" },
    { id: 104, name: "Cabo SDI 10m", price: 80, category: "Cabos" },
  ],

  "sony-a7v": [
    { id: 105, name: "Lente Sony FE 50mm", price: 800, category: "Lentes" },
    { id: 106, name: "Bateria NP-FZ100", price: 120, category: "Acessórios" },
    { id: 107, name: "Tripé Manfrotto", price: 250, category: "Suportes" },
  ],

  "canon-c300": [
    { id: 108, name: "Lente Canon EF 24-105mm", price: 1500, category: "Lentes" },
    { id: 109, name: "Bateria LP-E6", price: 140, category: "Acessórios" },
    { id: 110, name: "Follow Focus Tilta", price: 550, category: "Movimento" },
  ],

  "red-komodo": [
    { id: 111, name: "Lente RED RF 50mm", price: 2000, category: "Lentes" },
    { id: 112, name: "Bateria V-Mount", price: 180, category: "Acessórios" },
    { id: 113, name: "SSD Redmag 256GB", price: 400, category: "Armazenamento" },
  ],

  "blackmagic-pyxis": [
    { id: 114, name: "Lente EF 24-70mm", price: 1100, category: "Lentes" },
    { id: 115, name: "Bateria V-Mount", price: 180, category: "Acessórios" },
    { id: 116, name: "Cartão CFast 128GB", price: 200, category: "Armazenamento" },
  ],

  // Lentes
  "zeiss-supreme": [
    { id: 117, name: "Matte Box 4x5.65", price: 300, category: "Modificadores" },
    { id: 118, name: "Filtro ND 4x5.65", price: 150, category: "Filtros" },
    { id: 119, name: "Follow Focus Cine", price: 450, category: "Movimento" },
  ],

  "leitz-hektor": [
    { id: 120, name: "Adaptador EF-PL", price: 200, category: "Acessórios" },
    { id: 121, name: "Matte Box 4x5.65", price: 300, category: "Modificadores" },
    { id: 122, name: "Tripé de Lente", price: 180, category: "Suportes" },
  ],

  "dzo-pictor": [
    { id: 123, name: "Matte Box 4x5.65", price: 300, category: "Modificadores" },
    { id: 124, name: "Filtro ND 4x5.65", price: 150, category: "Filtros" },
    { id: 125, name: "Follow Focus Cine", price: 450, category: "Movimento" },
  ],

  // Iluminação
  "aputure-600d": [
    { id: 126, name: "Softbox 2x3m", price: 400, category: "Modificadores" },
    { id: 127, name: "Suporte de Luz", price: 200, category: "Suportes" },
    { id: 128, name: "Cabo DMX 20m", price: 100, category: "Cabos" },
  ],

  "aputure-700x": [
    { id: 129, name: "Softbox 2x3m", price: 400, category: "Modificadores" },
    { id: 130, name: "Suporte de Luz Heavy Duty", price: 300, category: "Suportes" },
    { id: 131, name: "Cabo DMX 20m", price: 100, category: "Cabos" },
  ],

  "godox-600": [
    { id: 132, name: "Softbox 1.5x2m", price: 250, category: "Modificadores" },
    { id: 133, name: "Suporte de Luz", price: 150, category: "Suportes" },
    { id: 134, name: "Bateria Extra", price: 200, category: "Acessórios" },
  ],

  "godox-400": [
    { id: 135, name: "Softbox 1.5x2m", price: 250, category: "Modificadores" },
    { id: 136, name: "Suporte de Luz", price: 150, category: "Suportes" },
    { id: 137, name: "Bateria Extra", price: 150, category: "Acessórios" },
  ],

  // Movimento
  "dji-rs4": [
    { id: 138, name: "Placa L Quick Release", price: 100, category: "Acessórios" },
    { id: 139, name: "Mala de Transporte", price: 250, category: "Armazenamento" },
    { id: 140, name: "Bateria Extra", price: 180, category: "Acessórios" },
  ],

  "tilta-nucleus": [
    { id: 141, name: "Wireless Remote", price: 300, category: "Acessórios" },
    { id: 142, name: "Suporte de Câmera", price: 150, category: "Suportes" },
    { id: 143, name: "Bateria Extra", price: 120, category: "Acessórios" },
  ],

  // Áudio
  "rode-wireless": [
    { id: 144, name: "Microfone Lavalier", price: 200, category: "Áudio" },
    { id: 145, name: "Bateria AA Recarregável", price: 80, category: "Acessórios" },
    { id: 146, name: "Cabo XLR 10m", price: 60, category: "Cabos" },
  ],

  // Monitores
  "smallhd-702": [
    { id: 147, name: "Suporte de Monitor", price: 120, category: "Suportes" },
    { id: 148, name: "Cabo HDMI 10m", price: 70, category: "Cabos" },
    { id: 149, name: "Bateria V-Mount", price: 180, category: "Acessórios" },
  ],
};

/**
 * Função auxiliar para obter produtos relacionados
 */
export function getRelacionados(slug: string) {
  return relacionados[slug] || [];
}
