import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { supabase } from "@/lib/supabase";

export default function StatusCadastro() {
  const [, params] = useRoute("/status-cadastro/:id");

  const [status, setStatus] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;

    const load = async () => {
      const { data, error } = await supabase
        .from("rental_registrations")
        .select("public_status, created_at")
        .eq("id", params.id)
        .single();

      if (!error && data) {
        setStatus(data.public_status);
        setCreatedAt(data.created_at);
      }
    };

    load();
  }, [params]);

  const { label, message, color } = getStatusInfo(status);

  function formatDate(date?: string | null) {
    if (!date) return "";

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] px-4">
      <div className="bg-white border rounded-xl shadow-lg p-8 max-w-md w-full text-center">

        <h1 className="text-xl font-bold text-gray-900 mb-4">
          Status do seu cadastro
        </h1>

        <div className={`text-lg font-bold mb-3 ${color}`}>
          {label}
        </div>

        <p className="text-sm text-gray-600 mb-6">
          {message}
        </p>

        {createdAt && (
          <p className="text-xs text-gray-400">
            Enviado em {formatDate(createdAt)}
          </p>
        )}

      </div>
    </div>
  );
}

function getStatusInfo(status?: string | null) {
  const s = (status || "").toLowerCase();

  if (s.includes("liberado") || s.includes("approved")) {
    return {
      label: "Cadastro aprovado",
      message: "Seu cadastro foi aprovado. Você já pode locar equipamentos.",
      color: "text-green-600",
    };
  }

  if (s.includes("pendente")) {
    return {
      label: "Pendente contato",
      message: "Nossa equipe precisa falar com você. Em breve entraremos em contato.",
      color: "text-orange-500",
    };
  }

  if (s.includes("processing") || s.includes("analise")) {
    return {
      label: "Em análise",
      message: "Estamos analisando suas informações. Em breve retornaremos.",
      color: "text-yellow-500",
    };
  }

  return {
    label: "Cadastro recebido",
    message: "Recebemos sua ficha e estamos iniciando a análise.",
    color: "text-gray-600",
  };
}
