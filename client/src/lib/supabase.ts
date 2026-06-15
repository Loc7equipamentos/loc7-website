import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Variáveis de ambiente Supabase não configuradas");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string | null;
  brand?: string | null;
  price: number | null;
  description?: string | null;

  /**
   * LEGADO LOC7
   * Data: 2026-06-02
   *
   * Histórico:
   * Este campo foi utilizado originalmente para armazenar
   * os "Principais Recursos" exibidos como microdots na
   * página de produto.
   *
   * Motivo da substituição:
   * A estrutura foi substituída pelo campo `highlights`,
   * permitindo conteúdo expandido com aplicações,
   * diferenciais, contexto de uso, SEO e suporte a
   * "Ler mais / Ler menos".
   *
   * Status:
   * LEGADO - NÃO UTILIZAR EM NOVOS CADASTROS.
   *
   * Mantido apenas para preservação de dados antigos e
   * compatibilidade durante a migração do catálogo.
   */
  specs?: string | null;

  /**
   * HIGHLIGHTS
   * Campo oficial da LOC7 para conteúdo expandido.
   * Utilizado na aba "Highlights" da página de produto.
   */
  highlights?: string | null;

  image_url?: string | null;
  images?: string[] | string | null;
  includes?: string[] | string | null;
  badge?: string | null;
  slug?: string | null;
  catalog_order?: number | null;
  is_featured?: boolean | null;
  featured_order?: number | null;
  is_featured_special?: boolean | null;
  internal_code?: string | null;
  fiscal_description?: string | null;
  ncm?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug?: string | null;
  icon?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_applications?: string | null;
  seo_meta_description?: string | null;
  created_at?: string;
  updated_at?: string;
}
