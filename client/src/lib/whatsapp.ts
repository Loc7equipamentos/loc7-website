// client/src/lib/whatsapp.ts

export type WhatsAppContext =
  | "floating"
  | "product_reserve"
  | "product_question"
  | "product_special"
  | "catalog"
  | "category";

const PHONE = "5511919671611"; // Trocar depois pelo número real da Loc7

export function getWhatsAppLink({
  context,
  productName,
  category,
}: {
  context: WhatsAppContext;
  productName?: string;
  category?: string;
}) {
  let message = "";

  switch (context) {
    case "floating":
      message =
        "Olá! Estou no site da Loc7 e preciso de ajuda para encontrar equipamentos para uma produção.";
      break;

    case "product_reserve":
      message = `Olá! Quero reservar o equipamento: ${productName}.`;
      break;

    case "product_question":
      message = `Olá! Tenho dúvidas sobre o equipamento: ${productName}. Podem me ajudar com kit, compatibilidade e disponibilidade?`;
      break;

    case "product_special":
      message = `Olá! Vi que este item foi selecionado para condições diferenciadas: ${productName}. Gostaria de entender melhor.`;
      break;

    case "catalog":
      message =
        "Olá! Estou navegando pelo catálogo da Loc7 e preciso de ajuda para montar um setup.";
      break;

    case "category":
      message = `Olá! Estou vendo equipamentos de ${category} e preciso de ajuda para escolher o melhor setup.`;
      break;

    default:
      message =
        "Olá! Estou no site da Loc7 e gostaria de mais informações.";
  }

  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
}
