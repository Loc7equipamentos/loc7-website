import { useEffect, useMemo, useState } from "react";
import { useRoute } from "wouter";
import { supabase } from "@/lib/supabase";

type StatusType = "received" | "processing" | "approved" | "rejected";

const WHATSAPP_NUMBER = "5511919671611";

export default function StatusCadastro() {
  const [, params] = useRoute("/status-cadastro/:id");

  const [status, setStatus] = useState<StatusType>("received");
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [displayId, setDisplayId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const cadastroId = displayId || params?.id || "";

  useEffect(() => {
    if (!params?.id) return;

    const load = async () => {
      const { data } = await supabase
        .from("rental_registrations")
        .select("public_status, created_at, display_id")
        .eq("id", params.id)
        .single();

      if (data) {
        setStatus(normalizeStatus(data.public_status));
        setCreatedAt(data.created_at);
        setDisplayId(
          data.display_id ||
            `LOC7-${params.id.replace(/-/g, "").slice(0, 6).toUpperCase()}`
        );
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

  const whatsappMessage =
    status === "approved"
      ? `Olá, meu cadastro na Loc7 foi aprovado.%0A%0AID: ${cadastroId}%0A%0AGostaria de dar continuidade na minha reserva.`
      : `Olá, finalizei meu cadastro na Loc7.%0A%0AID: ${cadastroId}%0A%0AGostaria de tirar uma dúvida ou acompanhar o processo.`;

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

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
      <div className="flex min-h-screen items-center justify-center bg-[#f3f4f6]">
        <p className="text-sm text-gray-500">Carregando status...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f4f6] px-4 py-12 text-zinc-900">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
            Loc7 Equipamentos
          </p>
          <h1 className="text-3xl font-semibold">Status do seu cadastro</h1>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <p className={`text-lg font-semibold ${statusInfo.color}`}>
              {statusInfo.label}
            </p>
            <p className="mt-2 text-sm text-zinc-600">{statusInfo.message}</p>
          </div>

          <div className="mb-8">
            <div className="mb-2 flex justify-between text-xs text-zinc-500">
              <span>Recebido</span>
              <span>Em análise</span>
              <span>Conclusão</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
              <div
                className="h-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

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

          <div className="mt-8 border-t border-zinc-200 pt-6 text-center">
            {status === "approved" ? (
              <>
                <p className="mb-4 text-sm text-zinc-600">
                  Seu cadastro foi aprovado. Agora você já pode falar com nosso
                  time para dar continuidade à sua reserva.
                </p>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-black md:w-auto"
                >
                  Falar com nosso time sobre sua reserva
                </a>
              </>
            ) : status === "rejected" ? (
              <p className="text-sm text-zinc-500">
                Caso precise de orientação, entre em contato com a equipe Loc7
                pelo canal em que iniciou o atendimento.
              </p>
            ) : (
              <>
                <p className="mb-4 text-sm text-zinc-600">
                  Aguarde a validação do seu cadastro por aqui. Se precisar de
                  ajuda ou tiver alguma dúvida, você também pode falar com nosso
                  time.
                </p>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 md:w-auto"
                >
                  Falar com nosso time
                </a>
              </>
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
  const s = String(status || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (s.includes("liberado")) return "approved";
  if (s.includes("aprovado")) return "approved";

  if (s.includes("recusado")) return "rejected";
  if (s.includes("reprovado")) return "rejected";

  if (s.includes("analise")) return "processing";
  if (s.includes("processing")) return "processing";
  if (s.includes("pendente")) return "processing";

  return "received";
}

function getStatusInfo(status: StatusType) {
  switch (status) {
    case "approved":
      return {
        label: "Cadastro aprovado",
        message:
          "Sua ficha foi validada. Você já pode avançar com a reserva dos equipamentos junto ao nosso time.",
        color: "text-green-600",
      };

    case "rejected":
      return {
        label: "Cadastro não aprovado",
        message:
          "Nossa equipe poderá orientá-lo sobre os próximos passos, caso necessário.",
        color: "text-red-600",
      };

    case "processing":
      return {
        label: "Em análise",
        message:
          "Sua ficha está sendo avaliada pela nossa equipe para validação dos dados.",
        color: "text-orange-500",
      };

    default:
      return {
        label: "Cadastro recebido",
        message:
          "Sua ficha foi registrada e será encaminhada para validação pela equipe Loc7.",
        color: "text-zinc-700",
      };
  }
}
