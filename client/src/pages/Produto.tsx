import { useState } from "react";

export default function Produto() {
  const produto = "RED Komodo 6K S35";

  const [itens, setItens] = useState<string[]>([]);

  const sugestoes = [
    "Lente 35mm",
    "Monitor externo",
    "Tripé",
    "Iluminação",
    "Kit de áudio",
  ];

  const toggleItem = (item: string) => {
    if (itens.includes(item)) {
      setItens(itens.filter((i) => i !== item));
    } else {
      setItens([...itens, item]);
    }
  };

  const gerarMensagem = () => {
    let mensagem = `Olá! Quero alugar:\n\n${produto}\n`;

    if (itens.length > 0) {
      mensagem += `\nItens adicionais:\n`;
      itens.forEach((item) => {
        mensagem += `- ${item}\n`;
      });
    }

    const url = `https://wa.me/5511919671611?text=${encodeURIComponent(
      mensagem
    )}`;

    window.location.href = url;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* 🔹 TOPO */}
      <div className="grid md:grid-cols-2 gap-10 mb-10">

        {/* IMAGEM */}
        <div>
          <div className="bg-gray-200 h-[400px] flex items-center justify-center rounded-md">
            Imagem do Produto
          </div>
        </div>

        {/* INFO */}
        <div>
          <p className="text-sm text-gray-500 mb-2">
            Home / Câmeras / RED
          </p>

          <h1 className="text-3xl font-bold mb-4">
            {produto}
          </h1>

          <p className="text-gray-700 mb-6">
            Câmera digital compacta de cinema com qualidade profissional para produções exigentes.
          </p>

          <button
            onClick={gerarMensagem}
            className="bg-black text-white px-6 py-3 rounded-md"
          >
            Falar com especialista
          </button>
        </div>
      </div>

      {/* 🔹 KIT LOC7 */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">
          Kit Loc7 incluso
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Kit preparado para evitar retrabalho no set
        </p>

        <ul className="grid grid-cols-2 gap-2 text-sm">
          <li>• 4x baterias</li>
          <li>• carregador</li>
          <li>• mídia</li>
          <li>• cabos essenciais</li>
          <li>• case de transporte</li>
        </ul>
      </div>

      {/* 🔥 MINI CARRINHO */}
      <div className="mb-10 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">
          Monte seu setup
        </h3>

        <div className="flex flex-wrap gap-2 mb-6">
          {sugestoes.map((item) => (
            <button
              key={item}
              onClick={() => toggleItem(item)}
              className={`px-3 py-2 border rounded-md text-sm ${
                itens.includes(item)
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              {itens.includes(item) ? "✓ " : ""} {item}
            </button>
          ))}
        </div>

        <div className="bg-gray-100 p-4 rounded-md">
          <p className="text-sm font-medium mb-2">Seu setup</p>
          <p className="text-sm mb-2">{produto}</p>

          {itens.map((item) => (
            <p key={item} className="text-sm text-gray-700">
              + {item}
            </p>
          ))}

          <button
            onClick={gerarMensagem}
            className="w-full mt-4 bg-black text-white py-3 rounded-md"
          >
            Falar com especialista
          </button>
        </div>
      </div>

      {/* 🔹 DESCRIÇÃO */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Sobre este equipamento
        </h2>

        <p className="text-gray-700">
          Equipamento ideal para produções audiovisuais profissionais, oferecendo alta qualidade de imagem e flexibilidade em diferentes cenários de captação.
        </p>
      </div>

      {/* 🔹 IDEAL PARA */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Ideal para
        </h2>

        <ul className="grid grid-cols-2 gap-2 text-sm">
          <li>• publicidade</li>
          <li>• documentário</li>
          <li>• conteúdo premium</li>
          <li>• multicâmera</li>
        </ul>
      </div>

      {/* 🔹 ESPECIFICAÇÕES */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Especificações técnicas
        </h2>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <p><strong>Sensor:</strong> Super 35</p>
          <p><strong>Resolução:</strong> 6K</p>
          <p><strong>Montagem:</strong> RF</p>
          <p><strong>Mídia:</strong> SSD</p>
        </div>
      </div>

      {/* 🔹 PRODUÇÃO */}
      <div className="mb-10 bg-gray-100 p-6 rounded-md">
        <h2 className="text-lg font-semibold mb-2">
          Precisa de mais do que o equipamento?
        </h2>

        <p className="text-sm text-gray-700 mb-4">
          Também atuamos com equipe e produção completa para projetos audiovisuais.
        </p>

        <button
          onClick={gerarMensagem}
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          Falar sobre produção
        </button>
      </div>

      {/* 🔹 CTA FINAL */}
      <div className="text-center">
        <button
          onClick={gerarMensagem}
          className="bg-black text-white px-6 py-3 rounded-md"
        >
          Falar com especialista
        </button>
      </div>

    </div>
  );
}
