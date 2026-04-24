// client/src/lib/whatsapp.ts

export type WhatsAppContext =
  | "floating"
  | "product_reserve"
  | "product_question"
  | "product_special"
  | "catalog"
  | "category";

const PHONE = "5511919671611";

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
      message = productName
        ? `Olá! Quero reservar o equipamento: ${productName}.`
        : "Olá! Quero reservar um equipamento da Loc7.";
      break;

    case "product_question":
      message = productName
        ? `Olá! Tenho dúvidas sobre o equipamento: ${productName}. Podem me ajudar com kit, compatibilidade e disponibilidade?`
        : "Olá! Tenho dúvidas sobre um equipamento da Loc7. Podem me ajudar com kit, compatibilidade e disponibilidade?";
      break;

    case "product_special":
      message = productName
        ? `Olá! Vi que este item tem condições diferenciadas: ${productName}. Gostaria de entender melhor.`
        : "Olá! Vi que alguns itens têm condições diferenciadas. Gostaria de entender melhor.";
      break;

    case "catalog":
      message =
        "Olá! Estou navegando pelo catálogo da Loc7 e preciso de ajuda para montar um setup.";
      break;

    case "category":
      message = category
        ? `Olá! Estou vendo equipamentos de ${category} e preciso de ajuda para escolher o melhor setup.`
        : "Olá! Estou vendo o catálogo da Loc7 e preciso de ajuda para escolher o melhor setup.";
      break;

    default:
      message =
        "Olá! Estou no site da Loc7 e gostaria de mais informações.";
  }

  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
}
