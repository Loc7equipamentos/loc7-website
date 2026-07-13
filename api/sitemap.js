import { createClient } from "@supabase/supabase-js";

const OFFICIAL_DOMAIN = "https://loc7equipamentos.com.br";

function slugifyPathSegment(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function normalizeLastmod(value) {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function buildUrlEntry({ loc, lastmod, changefreq, priority }) {
  const lines = [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
  ];

  if (lastmod) {
    lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
  }

  if (changefreq) {
    lines.push(`    <changefreq>${escapeXml(changefreq)}</changefreq>`);
  }

  if (priority) {
    lines.push(`    <priority>${escapeXml(priority)}</priority>`);
  }

  lines.push("  </url>");
  return lines.join("\n");
}

export default {
  async fetch() {
    try {
      const supabaseUrl =
        process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;

      const supabaseAnonKey =
        process.env.VITE_SUPABASE_ANON_KEY ||
        process.env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
          "Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não configuradas."
        );
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });

      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("category, slug, updated_at")
        .eq("is_visible", true)
        .not("slug", "is", null)
        .order("category", { ascending: true })
        .order("slug", { ascending: true });

      if (productsError) {
        throw productsError;
      }

      const entries = new Map();

      const addEntry = (entry) => {
        if (!entries.has(entry.loc)) {
          entries.set(entry.loc, entry);
        }
      };

      addEntry({
        loc: `${OFFICIAL_DOMAIN}/`,
        changefreq: "weekly",
        priority: "1.0",
      });

      addEntry({
        loc: `${OFFICIAL_DOMAIN}/catalogo`,
        changefreq: "daily",
        priority: "0.9",
      });

      addEntry({
        loc: `${OFFICIAL_DOMAIN}/orcamento`,
        changefreq: "monthly",
        priority: "0.7",
      });

      const categoryLastmod = new Map();

      for (const product of products || []) {
        const categorySlug = slugifyPathSegment(product.category);
        const productSlug = String(product.slug || "").trim();

        if (!categorySlug || !productSlug) continue;

        const productLastmod = normalizeLastmod(product.updated_at);

        addEntry({
          loc: `${OFFICIAL_DOMAIN}/equipamentos/${categorySlug}/${productSlug}`,
          lastmod: productLastmod,
          changefreq: "weekly",
          priority: "0.8",
        });

        const currentCategoryLastmod = categoryLastmod.get(categorySlug);

        if (
          productLastmod &&
          (!currentCategoryLastmod ||
            new Date(productLastmod) > new Date(currentCategoryLastmod))
        ) {
          categoryLastmod.set(categorySlug, productLastmod);
        } else if (!categoryLastmod.has(categorySlug)) {
          categoryLastmod.set(categorySlug, null);
        }
      }

      for (const [categorySlug, lastmod] of categoryLastmod.entries()) {
        addEntry({
          loc: `${OFFICIAL_DOMAIN}/catalogo/${categorySlug}`,
          lastmod,
          changefreq: "weekly",
          priority: "0.9",
        });
      }

      const xmlEntries = Array.from(entries.values())
        .sort((a, b) => a.loc.localeCompare(b.loc, "pt-BR"))
        .map(buildUrlEntry)
        .join("\n");

      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        xmlEntries,
        "</urlset>",
        "",
      ].join("\n");

      return new Response(xml, {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control":
            "public, s-maxage=300, stale-while-revalidate=3600",
        },
      });
    } catch (error) {
      console.error("Erro ao gerar sitemap LOC7:", error);

      return new Response(
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
          "<error>Não foi possível gerar o sitemap.</error>\n",
        {
          status: 503,
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "no-store",
          },
        }
      );
    }
  },
};
