import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { supabase } from "@/lib/supabase";

export default function AdminCadastroFicha() {
  const [, params] = useRoute("/admin-cadastro/:id");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!params?.id) return;

    const load = async () => {
      const { data, error } = await supabase
        .from("rental_registrations")
        .select("*")
        .eq("id", params.id)
        .single();

      if (!error && data) {
        setData(data);
      }
    };

    load();
  }, [params]);

  if (!data) {
    return <div className="p-6">Carregando...</div>;
  }

  const f = data.form_data || {};

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white text-black">
      <h1 className="text-2xl font-bold mb-6">Ficha de Cadastro</h1>

      {/* DADOS PRINCIPAIS */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2">Dados Principais</h2>
        <p><strong>Nome:</strong> {data.full_name}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Telefone:</strong> {data.phone}</p>
        <p><strong>Tipo:</strong> {data.registration_type}</p>
      </div>

      {/* DOCUMENTO */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2">Documento</h2>
        <p><strong>CPF/CNPJ:</strong> {f.cpf || f.cnpj}</p>
      </div>

      {/* ENDEREÇO */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2">Endereço</h2>
        <p>{f.endereco}</p>
        <p>{f.cidade} - {f.uf}</p>
        <p>CEP: {f.cep}</p>
      </div>

      {/* REFERÊNCIAS */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2">Referências</h2>

        {f.referencias?.map((ref: any, i: number) => (
          <div key={i} className="mb-2">
            <p><strong>Empresa:</strong> {ref.empresa}</p>
            <p><strong>Contato:</strong> {ref.nome}</p>
            <p><strong>Telefone:</strong> {ref.telefone}</p>
          </div>
        ))}
      </div>

      {/* BOTÃO PDF */}
      <button
        onClick={() => window.print()}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Imprimir / Gerar PDF
      </button>
    </div>
  );
}
