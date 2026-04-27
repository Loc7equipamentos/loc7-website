import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "wouter";

type Cadastro = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  registration_type: string;
  status_internal: string;
  status_public: string;
  risk: string;
  created_at: string;
};

export default function AdminCadastros() {
  const [cadastros, setCadastros] = useState<Cadastro[]>([]);
  const [search, setSearch] = useState("");
  const [statusInternalFilter, setStatusInternalFilter] = useState("Todos");
  const [statusPublicFilter, setStatusPublicFilter] = useState("Todos");
  const [riskFilter, setRiskFilter] = useState("Todos");

  useEffect(() => {
    fetchCadastros();
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
        normalize(c.registration_type).includes(normalizedSearch);

      const matchInternal =
        statusInternalFilter === "Todos" ||
        c.status_internal === statusInternalFilter;

      const matchPublic =
        statusPublicFilter === "Todos" ||
        c.status_public === statusPublicFilter;

      const matchRisk = riskFilter === "Todos" || c.risk === riskFilter;

      return matchSearch && matchInternal && matchPublic && matchRisk;
    });
  }, [cadastros, search, statusInternalFilter, statusPublicFilter, riskFilter]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-gray-500">
            LOC7 OPERAÇÕES
          </p>

          <h1 className="mt-1 text-3xl font-black text-gray-900">
            Cadastros
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Análise interna de clientes, risco e liberação de locação.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <p className="text-sm font-semibold text-gray-900">
              Cadastros recebidos
            </p>
            <p className="text-xs text-gray-500">
              {filteredCadastros.length} de {cadastros.length} registro(s)
            </p>
          </div>

          <div className="border-b bg-gray-50 px-6 py-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
              <label className="md:col-span-2">
                <span className="mb-1 block text-[11px] font-black uppercase tracking-wide text-gray-600">
                  Buscar
                </span>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Nome, e-mail, telefone, PF ou PJ"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-900 outline-none focus:border-black"
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
                options={["Todos", "Baixo", "Médio", "Alto", "Restrito"]}
              />

              <div className="flex justify-end md:col-span-5">
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusInternalFilter("Todos");
                    setStatusPublicFilter("Todos");
                    setRiskFilter("Todos");
                  }}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-100"
                >
                  Limpar busca e filtros
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1180px] w-full text-sm">
              <thead className="border-b bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="w-[260px] px-6 py-3 text-left">
                    Nome / Empresa
                  </th>
                  <th className="w-[90px] px-6 py-3 text-left">Tipo</th>
                  <th className="w-[140px] px-6 py-3 text-left">Telefone</th>
                  <th className="w-[160px] px-6 py-3 text-left">
                    Status Interno
                  </th>
                  <th className="w-[160px] px-6 py-3 text-left">
                    Status Público
                  </th>
                  <th className="w-[120px] px-6 py-3 text-left">Risco</th>
                  <th className="w-[120px] px-6 py-3 text-left">Data</th>
                  <th className="w-[170px] px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>

              <tbody>
                {filteredCadastros.map((c) => (
                  <tr key={c.id} className="border-b transition hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {c.full_name}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {c.email}
                      </div>
                    </td>

                    <td className="px-6">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800">
                        {c.registration_type?.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-6 font-medium text-gray-800">
                      {c.phone}
                    </td>

                    <td className="px-6">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusTone(
                          c.status_internal
                        )}`}
                      >
                        {c.status_internal || "—"}
                      </span>
                    </td>

                    <td className="px-6">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusTone(
                          c.status_public
                        )}`}
                      >
                        {c.status_public || "—"}
                      </span>
                    </td>

                    <td className="px-6">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getRiskTone(
                          c.risk
                        )}`}
                      >
                        {c.risk || "—"}
                      </span>
                    </td>

                    <td className="px-6 text-gray-700">
                      {new Date(c.created_at).toLocaleDateString("pt-BR")}
                    </td>

                    <td className="px-6">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin-panel/cadastro/${c.id}`}>
                          <button
                            type="button"
                            className="whitespace-nowrap rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-800 transition hover:bg-gray-100"
                          >
                            Ver ficha
                          </button>
                        </Link>

                        <Link href={`/admin-panel/cadastro/${c.id}`}>
                          <button
                            type="button"
                            className="whitespace-nowrap rounded-md bg-black px-4 py-2 text-xs text-white transition hover:bg-gray-800"
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
                      colSpan={8}
                      className="px-6 py-10 text-center text-sm font-medium text-gray-500"
                    >
                      Nenhum cadastro encontrado com a busca ou filtros
                      selecionados.
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
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-900 outline-none focus:border-black"
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

  return "border-gray-300 bg-gray-50 text-gray-800";
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
