import { useEffect, useMemo, useState } from "react";
import { useRoute } from "wouter";
import { supabase } from "@/lib/supabase";

type StatusType = "received" | "processing" | "approved" | "rejected";

export default function StatusCadastro() {
  const [, params] = useRoute("/status-cadastro/:id");

  const [status, setStatus] = useState<StatusType>("received");
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;

    const load = async () => {
      const { data } = await supabase
        .from("rental_registrations")
        .select("public_status, created_at")
        .eq("id", params.id)
        .single();

      if (data) {
        setStatus(normalizeStatus(data.public_status));
        setCreatedAt(data.created_at);
      }

      setLoading(false);
    };

    load();
  }, [params]);

  const progress = useMemo(() => {
    switch (status) {
      case "received":
        return 25;
      case "processing":
        return 60;
      case "approved":
        return 100;
      case "rejected":
        return 100;
      default:
        return 25;
    }
  }, [status]);

  const statusInfo = getStatusInfo(status);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
        <p className="text-sm text-gray-500">Carregando status...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f4f6] px-4 py-12 text-zinc-900">
      <div className="mx-auto max-w-2xl">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">
            Loc7 Equipamentos
          </p>
          <h1 className="text-3xl font-semibold">
            Status do seu cadastro
          </h1>
        </div>

        {/* CARD */}
        <div className="bg-white border border-black/10 rounded-2xl p-8 shadow-sm">

          {/* STATUS */}
          <div className="mb-6 text-center">
            <p className={`text-lg font-semibold ${statusInfo.color}`}>
              {statusInfo.label}
            </p>
            <p className="text-sm text-zinc-600 mt-2">
              {statusInfo.message}
            </p>
          </div>

          {/* PROGRESSO */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-zinc-500 mb-2">
              <span>Recebido</span>
              <span>Em análise</span>
              <span>Conclusão</span>
            </div>

            <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* INFO */}
          <div className="grid gap-4 text-sm text-zinc-600">
            {createdAt && (
              <div>
                <span className="font-medium text-zinc-800">
                  Data de envio:
                </span>{" "}
                {formatDate(createdAt)}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}

/* ========================= */
/* HELPERS */
/* ========================= */

function normalizeStatus(status?: string): StatusType {
  const s = (status || "").toLowerCase();

  if (s.includes("approved")) return "approved";
  if (s.includes("rejected")) return "rejected";
  if (s.includes("processing")) return "processing";

  return "received";
}

function getStatusInfo(status: StatusType) {
  switch (status) {
    case "approved":
      return {
        label: "Cadastro aprovado",
        message: "Seu cadastro foi aprovado. Você já pode locar equipamentos.",
        color: "text-green-600",
      };

    case "rejected":
      return {
        label: "Cadastro não aprovado",
        message: "Nossa equipe entrará em contato para orientações.",
        color: "text-red-600",
      };

    case "processing":
      return {
        label: "Em análise",
        message: "Estamos analisando seus dados.",
        color: "text-orange-500",
      };

    default:
      return {
        label: "Cadastro recebido",
        message: "Recebemos sua ficha e iniciamos a análise.",
        color: "text-zinc-700",
      };
  }
}
