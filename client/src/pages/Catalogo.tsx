import { useState, useEffect } from "react";
import { SlidersHorizontal, ChevronDown, Menu, X } from "lucide-react";
import { useParams, useLocation } from "wouter";
import ProductCard from "@/components/ProductCard";
import { supabase, type Product, type Category } from "@/lib/supabase";

const normalize = (text: string): string =>
  text
    ?.toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") || "";

const slugifyPathSegment = (text: string): string =>
  text
    ?.toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "") || "";

type Subcategory = {
  id: string;
  name: string;
  category_id: string;
};

type FilterOption = {
  id: string;
  group_id: string;
  name: string;
  display_order: number | null;
  is_active?: boolean | null;
};

type FilterGroup = {
  id: string;
  category_id: string;
  name: string;
  display_order: number | null;
  is_active?: boolean | null;
  category?: {
    id: string;
    name: string;
  } | null;
  options?: FilterOption[];
};

type ProductFilterOption = {
  product_id: string;
  filter_option_id: string;
};

const OFFICIAL_DOMAIN = "https://www.loc7equipamentos.com.br";

type CategoryWithSeo = Category & {
  seo_title?: string | null;
  seo_description?: string | null;
  seo_applications?: string | null;
  seo_brands?: string | null;
  seo_meta_description?: string | null;
};
export default function Catalogo() {
  const params = useParams<{ category?: string }>();
  const [location, setLocation] = useLocation();

  const pathCategorySlug = location.startsWith("/catalogo/")
    ? location.replace("/catalogo/", "").split("/")[0]
    : "";

  const activeCategorySlug = params.category || pathCategorySlug;
  const isCategoryPage = !!activeCategorySlug;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryRows, setCategoryRows] = useState<CategoryWithSeo[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([]);
  const [productFilterOptions, setProductFilterOptions] = useState<
    Record<string, string[]>
  >({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedSubcategory, setSelectedSubcategory] = useState("Todas");
  const [selectedBrand, setSelectedBrand] = useState("Todas");
  const [selectedFilterOptionIds, setSelectedFilterOptionIds] = useState<
    Record<string, string[]>
  >({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const slugToCategoryName: Record<string, string> = {
    cameras: "Câmeras",
    lentes: "Lentes",
    iluminacao: "Iluminação",
    audio: "Áudio",
    monitores: "Monitores",
    movimento: "Movimento",
    transmissores: "Transmissores",
    maquinaria: "Maquinária",

    filtros: "Filtros",
    mattebox: "Mattebox",
    switchers: "Switchers",
    teleprompter: "Teleprompter",
    "follow-focus": "Follow Focus",
    tripes: "Tripés de Câmera",
    "suporte-de-camera": "Suporte de Câmera",
    modificadores: "Modificadores",
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get("search") || "";
    setSearchQuery(search);
  }, []);

  useEffect(() => {
    if (activeCategorySlug) {
      const categoryName =
        slugToCategoryName[activeCategorySlug] ||
        activeCategorySlug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

      setSelectedCategory(categoryName);
      setSelectedSubcategory("Todas");
      setSelectedBrand("Todas");
      setSelectedFilterOptionIds({});
    } else {
      setSelectedCategory("Todos");
      setSelectedSubcategory("Todas");
      setSelectedBrand("Todas");
      setSelectedFilterOptionIds({});
    }
  }, [activeCategorySlug]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: categoriesData, error: catError } = await supabase
          .from("categories")
         .select("id, name, seo_title, seo_description, seo_applications, seo_brands, seo_meta_description")
          .order("name");

        if (catError) throw catError;

        const categoryNames = categoriesData?.map((c) => c.name) || [];
        setCategories(["Todos", ...categoryNames]);
        setCategoryRows((categoriesData as CategoryWithSeo[]) || []);

        const { data: subcategoriesData, error: subError } = await supabase
          .from("subcategories")
          .select("*")
          .order("name");

        if (subError) throw subError;

        setSubcategories(subcategoriesData || []);

        const { data: filterGroupsData, error: filterGroupsError } = await supabase
          .from("filter_groups")
          .select(`
            *,
            category:categories!filter_groups_category_id_fkey (
              id,
              name
            )
          `)
          .order("display_order", { ascending: true });

        if (filterGroupsError) throw filterGroupsError;

        const { data: filterOptionsData, error: filterOptionsError } = await supabase
          .from("filter_options")
          .select("*")
          .order("display_order", { ascending: true });

        if (filterOptionsError) throw filterOptionsError;

        const groups = ((filterGroupsData as FilterGroup[]) || []).map((group) => ({
          ...group,
          options: ((filterOptionsData as FilterOption[]) || [])
            .filter((option) => option.group_id === group.id)
            .sort((a, b) => {
              const orderA = a.display_order ?? 999;
              const orderB = b.display_order ?? 999;

              if (orderA !== orderB) return orderA - orderB;

              return a.name.localeCompare(b.name, "pt-BR");
            }),
        }));

        setFilterGroups(groups);

        const { data: productsData, error: prodError } = await supabase
          .from("products")
          .select("*")
          .order("name", { ascending: true });

        if (prodError) throw prodError;

        setProducts(productsData || []);

        const { data: productFilterData, error: productFilterError } = await supabase
          .from("product_filter_options")
          .select("product_id, filter_option_id");

        if (productFilterError) throw productFilterError;

        const productFilterMap = ((productFilterData as ProductFilterOption[]) || []).reduce<
          Record<string, string[]>
        >((acc, item) => {
          if (!acc[item.product_id]) acc[item.product_id] = [];
          acc[item.product_id].push(item.filter_option_id);
          return acc;
        }, {});

        setProductFilterOptions(productFilterMap);
      } catch (err) {
        console.error("Erro ao carregar catálogo:", err);
        setError("Erro ao carregar produtos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const categoryExists =
    !activeCategorySlug ||
    loading ||
    categoryRows.some((cat) => {
      const mappedCategoryName = slugToCategoryName[activeCategorySlug || ""];

      return (
        slugifyPathSegment(cat.name) === activeCategorySlug ||
        normalize(cat.name) === normalize(mappedCategoryName || "")
      );
    });

  const searchScopedProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;

    const searchableText = [
      p.name,
      p.category,
      p.subcategory,
      p.brand,
      p.name ? p.name.split(" ")[0] : "",
    ]
      .filter(Boolean)
      .join(" ");

    return normalize(searchableText).includes(normalize(searchQuery));
  });

  const categoryScopedProducts = searchScopedProducts.filter((p) =>
    selectedCategory === "Todos"
      ? true
      : normalize(p.category || "") === normalize(selectedCategory)
  );

  const selectedCategoryRow = categoryRows.find(
    (cat) => normalize(cat.name) === normalize(selectedCategory)
  );

  const selectedCategoryFilterGroups =
    selectedCategory === "Todos" || !selectedCategoryRow
      ? []
      : filterGroups
          .filter((group) => group.category_id === selectedCategoryRow.id)
          .filter((group) => group.options && group.options.length > 0)
          .sort((a, b) => {
            const orderA = a.display_order ?? 999;
            const orderB = b.display_order ?? 999;

            if (orderA !== orderB) return orderA - orderB;

            return a.name.localeCompare(b.name, "pt-BR");
          });

  const hasDynamicFilters = selectedCategoryFilterGroups.length > 0;

  const uniqueSubcategories =
    selectedCategory === "Todos" || !selectedCategoryRow
      ? []
      : subcategories
          .filter((subcat) => subcat.category_id === selectedCategoryRow.id)
          .map((subcat) => subcat.name)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b, "pt-BR"));

  const uniqueBrands = Array.from(
    new Set(categoryScopedProducts.map((p) => p.brand || "").filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));

  const toggleDynamicFilter = (groupId: string, optionId: string) => {
    setSelectedFilterOptionIds((prev) => {
      const current = prev[groupId] || [];
      const nextValues = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];

      const next = { ...prev };

      if (nextValues.length === 0) {
        delete next[groupId];
      } else {
        next[groupId] = nextValues;
      }

      return next;
    });
  };

  const clearDynamicFilters = () => {
    setSelectedFilterOptionIds({});
  };

  const selectedDynamicFilterCount = Object.values(selectedFilterOptionIds).reduce(
    (total, ids) => total + ids.length,
    0
  );

  const filteredProducts = categoryScopedProducts
    .filter((p) => {
      if (hasDynamicFilters && selectedDynamicFilterCount > 0) {
        const productOptionIds = productFilterOptions[p.id] || [];

        return Object.entries(selectedFilterOptionIds).every(([, selectedIds]) => {
          if (selectedIds.length === 0) return true;
          return selectedIds.some((optionId) => productOptionIds.includes(optionId));
        });
      }

      const matchSubcategory =
        selectedSubcategory === "Todas" ||
        normalize(p.subcategory || "") === normalize(selectedSubcategory);

      const matchBrand =
        selectedBrand === "Todas" || normalize(p.brand || "") === normalize(selectedBrand);

      return matchSubcategory && matchBrand;
    })
    .sort((a, b) => {
      if (!isCategoryPage || selectedCategory === "Todos") {
        return normalize(a.name || "").localeCompare(normalize(b.name || ""), "pt-BR");
      }

      const orderA =
        typeof (a as Product & { catalog_order?: number | null }).catalog_order === "number"
          ? (a as Product & { catalog_order?: number | null }).catalog_order
          : Number.POSITIVE_INFINITY;

      const orderB =
        typeof (b as Product & { catalog_order?: number | null }).catalog_order === "number"
          ? (b as Product & { catalog_order?: number | null }).catalog_order
          : Number.POSITIVE_INFINITY;

      if (orderA !== orderB) return orderA - orderB;

      return normalize(a.name || "").localeCompare(normalize(b.name || ""), "pt-BR");
    });

  const activeCategorySeo =
    isCategoryPage && selectedCategoryRow
      ? {
          title: selectedCategoryRow.seo_title?.trim() || selectedCategoryRow.name,
          description: selectedCategoryRow.seo_description?.trim() || "",
          applications: selectedCategoryRow.seo_applications?.trim() || "",
          brands: selectedCategoryRow.seo_brands?.trim() || "",
          metaDescription:
            selectedCategoryRow.seo_meta_description?.trim() ||
            selectedCategoryRow.seo_description?.trim() ||
            `Catálogo de ${selectedCategoryRow.name.toLowerCase()} para locação profissional em São Paulo.`,
        }
      : null;

  useEffect(() => {
    const setMetaTag = (
      key: "name" | "property",
      value: string,
      content: string
    ) => {
      let tag = document.head.querySelector(
        `meta[${key}="${value}"]`
      ) as HTMLMetaElement | null;

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(key, value);
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", content);
    };

    const canonicalPath = activeCategorySlug
      ? `/catalogo/${activeCategorySlug}`
      : "/catalogo";
    const canonicalUrl = `${OFFICIAL_DOMAIN}${canonicalPath}`;
    const pageTitle = activeCategorySeo
      ? `${activeCategorySeo.title} | LOC7`
      : "Catálogo de Equipamentos para Locação | LOC7";
    const pageDescription = activeCategorySeo
      ? activeCategorySeo.metaDescription
      : "Catálogo de equipamentos audiovisuais para locação em São Paulo. Câmeras, lentes, iluminação, áudio, monitores e acessórios profissionais.";

    document.title = pageTitle;

    setMetaTag("name", "description", pageDescription);
    setMetaTag("property", "og:title", pageTitle);
    setMetaTag("property", "og:description", pageDescription);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:type", "website");

    let canonical = document.head.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute("href", canonicalUrl);

    if (activeCategorySeo) {
      const collectionJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: activeCategorySeo.title,
        description: activeCategorySeo.description,
        url: canonicalUrl,
        mainEntity: {
          "@type": "ItemList",
          name: selectedCategory,
          numberOfItems: filteredProducts.length,
          itemListElement: filteredProducts.slice(0, 24).map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: product.name,
            url: `${OFFICIAL_DOMAIN}/equipamentos/${slugifyPathSegment(
              product.category
            )}/${(product as Product & { slug?: string | null }).slug || ""}`,
          })),
        },
      };

      let collectionSchema = document.head.querySelector(
        'script[data-loc7-schema="category"]'
      ) as HTMLScriptElement | null;

      if (!collectionSchema) {
        collectionSchema = document.createElement("script");
        collectionSchema.type = "application/ld+json";
        collectionSchema.setAttribute("data-loc7-schema", "category");
        document.head.appendChild(collectionSchema);
      }

      collectionSchema.textContent = JSON.stringify(collectionJsonLd);
    } else {
      const collectionSchema = document.head.querySelector(
        'script[data-loc7-schema="category"]'
      );

      collectionSchema?.remove();
    }

    const hostname = window.location.hostname;
    const isStaging =
      hostname.includes("loc7.com.br") &&
      !hostname.includes("loc7equipamentos.com.br");

    setMetaTag("name", "robots", isStaging ? "noindex, nofollow" : "index, follow");
  }, [
    activeCategorySeo,
    activeCategorySlug,
    filteredProducts,
    selectedCategory,
  ]);

  const SidebarFilters = () => (
    <div className="space-y-8">
      {!isCategoryPage && (
        <div>
          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Categorias
          </h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedSubcategory("Todas");
                  setSelectedBrand("Todas");
                  setSelectedFilterOptionIds({});

                  if (cat === "Todos") {
                    setSelectedCategory("Todos");
                    setLocation("/catalogo");
                    return;
                  }

                  setSelectedCategory(cat);
                  setLocation(`/catalogo/${slugifyPathSegment(cat)}`);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  selectedCategory === cat
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>{cat}</span>
                <ChevronDown className="h-4 w-4 opacity-60" />
              </button>
            ))}
          </div>
        </div>
      )}

      {isCategoryPage && hasDynamicFilters ? (
        <>
          {selectedDynamicFilterCount > 0 && (
            <button
              onClick={clearDynamicFilters}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left text-sm font-medium text-neutral-700 transition hover:border-neutral-400"
            >
              Limpar filtros ({selectedDynamicFilterCount})
            </button>
          )}

          {selectedCategoryFilterGroups.map((group) => (
            <div key={group.id}>
              <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                {group.name}
              </h3>

              <div className="space-y-2">
                {(group.options || []).map((option) => {
                  const active = (selectedFilterOptionIds[group.id] || []).includes(option.id);

                  return (
                    <button
                      key={option.id}
                      onClick={() => toggleDynamicFilter(group.id, option.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        active
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          active
                            ? "border-white bg-white text-neutral-900"
                            : "border-neutral-300 bg-white"
                        }`}
                      >
                        {active ? "✓" : ""}
                      </span>
                      <span>{option.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          {uniqueSubcategories.length > 0 && (
            <div>
              <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Refinar Busca
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedSubcategory("Todas");
                    setSelectedBrand("Todas");
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    selectedSubcategory === "Todas"
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <span>Todas</span>
                  <ChevronDown className="h-4 w-4 opacity-60" />
                </button>

                {uniqueSubcategories.map((subcat) => (
                  <button
                    key={subcat}
                    onClick={() => {
                      setSelectedSubcategory(subcat);
                      setSelectedBrand("Todas");
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      selectedSubcategory === subcat
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    <span>{subcat}</span>
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Marca
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedBrand("Todas")}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  selectedBrand === "Todas"
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>Todas</span>
                <ChevronDown className="h-4 w-4 opacity-60" />
              </button>

              {uniqueBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    selectedBrand === brand
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <span>{brand}</span>
                  <ChevronDown className="h-4 w-4 opacity-60" />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (error) {
    return (
      <main className="min-h-screen bg-[#f3f3f1] px-4 pb-16 pt-28 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1600px] rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm text-red-700">
          {error}
        </div>
      </main>
    );
  }

  if (isCategoryPage && !categoryExists) {
    return (
      <main className="min-h-screen bg-[#f3f3f1] px-4 pb-16 pt-28 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1600px] rounded-2xl border border-neutral-200 bg-white px-6 py-14 text-center">
          <h1 className="text-2xl font-semibold text-neutral-950">
            Categoria não encontrada
          </h1>

          <p className="mt-3 text-sm text-neutral-600">
            A categoria acessada não existe ou foi removida.
          </p>

          <a
            href="/catalogo"
            className="mt-6 inline-flex rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Voltar ao catálogo
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f3f1] text-neutral-900">
      <section className="border-b border-neutral-200 bg-[#f3f3f1]">
        <div className="mx-auto max-w-[1600px] px-4 pb-2 pt-12 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-3">
            <div className="hidden items-start justify-between gap-16 border-b border-neutral-200 pb-6 lg:flex">
              <div className="w-[180px] shrink-0 pt-2">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                  01 / CATÁLOGO
                </span>

                {isCategoryPage && (
                  <h1 className="mt-5 text-[26px] font-semibold leading-tight text-neutral-950">
                    {selectedCategory}
                  </h1>
                )}
              </div>

              <div className="flex flex-1 justify-start">
                <div className="max-w-[620px]">
                  <div className="h-[32px]" aria-hidden="true" />

                  <p className="mt-2 text-[15px] font-medium leading-relaxed text-neutral-700">
                    {activeCategorySeo?.description
                      ? activeCategorySeo.description
                      : searchQuery
                        ? `Resultado da busca por "${searchQuery}".`
                        : "Busque o que precisar, quando precisar."}
                  </p>

                {isCategoryPage && activeCategorySeo?.brands && (
  <p className="mt-3 max-w-[360px] text-[12px] leading-relaxed text-neutral-500">
    {activeCategorySeo.brands}
  </p>
)}
                </div>
              </div>
            </div>

            <div className="lg:hidden border-b border-neutral-200 pb-5">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                01 / CATÁLOGO
              </span>

              <h1 className="mt-2 text-[32px] font-semibold leading-[0.95] tracking-[-0.04em] text-neutral-950">
  {isCategoryPage ? selectedCategory : "Monte seu setup."}
</h1>

              <p className="mt-3 max-w-[360px] text-[14px] font-medium leading-relaxed text-neutral-700">
                {activeCategorySeo?.description
                  ? activeCategorySeo.description
                  : searchQuery
                    ? `Resultado da busca por "${searchQuery}".`
                    : "Busque o que precisar, quando precisar."}
              </p>

             {isCategoryPage && activeCategorySeo?.brands && (
  <p className="mt-3 text-[13px] leading-relaxed text-neutral-500">
    {activeCategorySeo.brands}
  </p>
)}
            </div>

            {!isCategoryPage && (
              <div className="lg:hidden">
                <div className="-mx-4 mt-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
                  <div className="flex min-w-max gap-2 pb-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedSubcategory("Todas");
                          setSelectedBrand("Todas");
                          setSelectedFilterOptionIds({});

                          if (cat === "Todos") {
                            setSelectedCategory("Todos");
                            setLocation("/catalogo");
                            return;
                          }

                          setSelectedCategory(cat);
                          setLocation(`/catalogo/${slugifyPathSegment(cat)}`);
                        }}
                        className={`whitespace-nowrap rounded-full border px-4 py-[10px] text-[13px] font-semibold tracking-[-0.01em] transition-all duration-200 ${
                          selectedCategory === cat
                            ? "border-black bg-black text-white shadow-sm"
                            : "border-neutral-300 bg-white text-neutral-800 hover:border-neutral-500"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}

                    <button
                      onClick={() => setShowMobileFilters(true)}
                      className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-neutral-400 bg-white px-4 py-[10px] text-[13px] font-semibold text-neutral-900 shadow-sm"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Filtros
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isCategoryPage && (
              <div className="lg:hidden">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="mt-2 inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-700"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-10 lg:py-6">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr] xl:grid-cols-[240px_1fr]">
          <aside className="hidden self-start rounded-2xl border border-neutral-200 bg-white p-6 lg:block">
            <div className="mb-6 flex items-center gap-2">
              <Menu className="h-4 w-4 text-neutral-500" />
              <span className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-700">
                Filtros
              </span>
            </div>
            <SidebarFilters />
          </aside>

          <div>
            {loading ? (
              <div className="grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
                  >
                    <div className="aspect-[4/3] w-full animate-pulse bg-neutral-100" />
                    <div className="space-y-3 p-4">
                      <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
                      <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
                      <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-12 text-center">
                <h2 className="text-lg font-semibold text-neutral-900">
                  Nenhum produto encontrado
                </h2>
                <p className="mt-2 text-sm text-neutral-600">
                  Ajuste os filtros para encontrar outros equipamentos.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <div className="ml-auto h-full w-full max-w-sm overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-neutral-500" />
                <span className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-700">
                  Filtros
                </span>
              </div>

              <button onClick={() => setShowMobileFilters(false)}>
                <X className="h-5 w-5 text-neutral-700" />
              </button>
            </div>

            <SidebarFilters />

            <button
              onClick={() => setShowMobileFilters(false)}
              className="mt-8 w-full rounded-lg bg-neutral-950 px-4 py-3 text-sm font-medium text-white"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
