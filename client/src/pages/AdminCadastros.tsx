import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "wouter";

type Cadastro = {
  id: string;
  display_id?: string | null;
  full_name: string;
  email: string;
  phone: string;
  registration_type: string;
  internal_status: string;
  public_status: string;
  risk_level: string;
  created_at: string;
};

export default function AdminCadastros() {
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [search, setSearch] = useState("");
  const [statusInternalFilter, setStatusInternalFilter] = useState("Todos");
  const [statusPublicFilter, setStatusPublicFilter] = useState("Todos");
  const [riskFilter, setRiskFilter] = useState("Todos");

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("rental_registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setCadastros(data);
      }
    };

    load();

    const interval = setInterval(load, 5000);

    return () => clearInterval(interval);
  }, []);

  async function fetchCadastros() {
    const { data } = await supabase
      .from("rental_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setCadastros(data);
  }

  const filteredCadastros = useMemo(() => {
    const normalizedSearch = normalize(search);

    return cadastros.filter((c) => {
      const matchSearch =
        !normalizedSearch ||
        normalize(c.full_name).includes(normalizedSearch) ||
        normalize(c.email).includes(normalizedSearch) ||
        normalize(c.phone).includes(normalizedSearch) ||
        normalize(c.registration_type).includes(normalizedSearch) ||
        normalize(c.display_id).includes(normalizedSearch);

      const matchInternal =
        statusInternalFilter === "Todos" ||
        c.internal_status === statusInternalFilter;

      const matchPublic =
        statusPublicFilter === "Todos" ||
        c.public_status === statusPublicFilter;

      const matchRisk =
        riskFilter === "Todos" ||
        c.risk_level === riskFilter;

      return matchSearch && matchInternal && matchPublic && matchRisk;
    });
  }, [
    cadastros,
    search,
    statusInternalFilter,
    statusPublicFilter,
    riskFilter,
  ]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-xs text-gray-500 tracking-widest uppercase">
            LOC7 OPERAÇÕES
          </p>

          <h1 className="text-3xl font-black text-gray-900 mt-1">
            Cadastros
          </h1>

          <p className="text-gray-600 mt-1 text-sm">
            Análise interna de clientes, risco e liberação de locação.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <p className="text-sm font-semibold text-gray-900">
              Cadastros recebidos
            </p>

            <p className="text-xs text-gray-500">
              {filteredCadastros.length} de {cadastros.length} registro(s)
            </p>
          </div>

          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <label className="md:col-span-2">
                <span className="mb-1 block text-[11px] font-black uppercase tracking-wide text-gray-600">
                  Buscar
                </span>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Nome, ID, e-mail, telefone, PF ou PJ"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-900 outline-none focus:border-[#b91c1c]"
                />
              </label>

              <FilterSelect
                label="Status interno"
                value={statusInternalFilter}
                onChange={setStatusInternalFilter}
                options={[
                  "Todos",
                  "Recebido",
                  "Em análise",
                  "Pendente documentação",
                  "Liberado",
                  "Recusado interno",
                ]}
              />

              <FilterSelect
                label="Status público"
                value={statusPublicFilter}
                onChange={setStatusPublicFilter}
                options={[
                  "Todos",
                  "Recebido",
                  "Em análise",
                  "Pendente contato",
                  "Liberado",
                ]}
              />

              <FilterSelect
                label="Risco"
                value={riskFilter}
                onChange={setRiskFilter}
                options={[
                  "Todos",
                  "Baixo",
                  "Médio",
                  "Alto",
                  "Restrito",
                ]}
              />

              <div className="md:col-span-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusInternalFilter("Todos");
                    setStatusPublicFilter("Todos");
                    setRiskFilter("Todos");
                  }}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 transition"
                >
                  Limpar busca e filtros
                </button>
              </div>
            </div>
          </div>

          <div className="h-[calc(100vh-360px)] min-h-[420px] overflow-auto">
            <table className="min-w-[1380px] w-full text-sm">
              <thead className="bg-gray-50 border-b text-xs uppercase text-gray-500 tracking-wide">
                <tr>
                  <th className="text-left px-6 py-3 w-[150px]">
                    ID
                  </th>

                  <th className="text-left px-6 py-3 w-[260px]">
                    Nome / Empresa
                  </th>

                  <th className="text-left px-6 py-3 w-[90px]">
                    Tipo
                  </th>

                  <th className="text-left px-6 py-3 w-[140px]">
                    Telefone
                  </th>

                  <th className="text-left px-6 py-3 w-[160px]">
                    Status Interno
                  </th>

                  <th className="text-left px-6 py-3 w-[160px]">
                    Status Público
                  </th>

                  <th className="text-left px-6 py-3 w-[140px]">
                    Risco
                  </th>

                  <th className="text-left px-6 py-3 w-[120px]">
                    Data
                  </th>

                  <th className="text-right px-6 py-3 w-[220px]">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCadastros.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <span className="whitespace-nowrap text-[11px] font-bold tracking-[0.08em] text-gray-500">
                        {c.display_id || "SEM ID"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {c.full_name}
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {c.email}
                      </div>
                    </td>

                    <td className="px-6">
                      <span className="text-xs font-semibold bg-gray-100 text-gray-800 px-3 py-1 rounded-full whitespace-nowrap">
                        {c.registration_type?.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-6 text-gray-800 font-medium whitespace-nowrap">
                      {c.phone}
                    </td>

                    <td className="px-6">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border whitespace-nowrap ${getStatusTone(
                          c.internal_status
                        )}`}
                      >
                        {c.internal_status || "—"}
                      </span>
                    </td>

                    <td className="px-6">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border whitespace-nowrap ${getStatusTone(
                          c.public_status
                        )}`}
                      >
                        {c.public_status || "—"}
                      </span>
                    </td>

                    <td className="px-6">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border whitespace-nowrap ${getRiskTone(
                          c.risk_level
                        )}`}
                      >
                        {c.risk_level || "—"}
                      </span>
                    </td>

                    <td className="px-6 text-gray-700">
                      {new Date(c.created_at).toLocaleDateString("pt-BR")}
                    </td>

                    <td className="px-6">
                      <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                        <Link href={`/admin-panel/cadastro/${c.id}`}>
                          <button
                            type="button"
                            className="rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-800 hover:bg-gray-100 transition whitespace-nowrap"
                          >
                            Ver ficha
                          </button>
                        </Link>

                        <Link href={`/admin-panel/cadastro/${c.id}`}>
                          <button
                            type="button"
                            className="rounded-md bg-black px-4 py-2 text-xs text-white hover:bg-gray-800 transition whitespace-nowrap"
                          >
                            Editar
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredCadastros.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-10 text-center text-sm font-medium text-gray-500"
                    >
                      Nenhum cadastro encontrado com a busca ou filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-1 block text-[11px] font-black uppercase tracking-wide text-gray-600">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-900 outline-none focus:border-[#b91c1c]"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function getStatusTone(value?: string) {
  const v = normalize(value);

  if (v.includes("liberado")) {
    return "border-green-300 bg-green-50 text-green-800";
  }

  if (v.includes("pendente documentacao")) {
    return "border-orange-300 bg-orange-50 text-orange-800";
  }

  if (v.includes("analise")) {
    return "border-yellow-300 bg-yellow-50 text-yellow-800";
  }

  if (v.includes("recusado")) {
    return "border-red-300 bg-red-50 text-red-800";
  }

  if (v.includes("recebido") || v.includes("pendente")) {
    return "border-gray-300 bg-gray-50 text-gray-800";
  }

  return "border-gray-300 bg-white text-gray-900";
}

function getRiskTone(value?: string) {
  const v = normalize(value);

  if (v.includes("baixo")) {
    return "border-green-300 bg-green-50 text-green-800";
  }

  if (v.includes("medio")) {
    return "border-yellow-300 bg-yellow-50 text-yellow-800";
  }

  if (v.includes("alto")) {
    return "border-red-300 bg-red-50 text-red-800";
  }

  if (v.includes("restrito")) {
    return "border-gray-900 bg-gray-900 text-white";
  }

  return "border-gray-300 bg-white text-gray-900";
}

function normalize(value?: string) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
