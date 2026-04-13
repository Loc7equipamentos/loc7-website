import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function generateSlugs() {
  try {
    console.log('Buscando produtos sem slug...');
    
    // Buscar todos os produtos
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name, slug');

    if (fetchError) {
      console.error('Erro ao buscar produtos:', fetchError);
      process.exit(1);
    }

    console.log(`Total de produtos: ${products.length}`);

    // Filtrar produtos sem slug
    const productsWithoutSlug = products.filter(p => !p.slug);
    console.log(`Produtos sem slug: ${productsWithoutSlug.length}`);

    if (productsWithoutSlug.length === 0) {
      console.log('✅ Todos os produtos já têm slug!');
      process.exit(0);
    }

    // Atualizar cada produto com slug gerado
    for (const product of productsWithoutSlug) {
      const slug = generateSlug(product.name);
      console.log(`Atualizando: ${product.name} → ${slug}`);

      const { error: updateError } = await supabase
        .from('products')
        .update({ slug })
        .eq('id', product.id);

      if (updateError) {
        console.error(`Erro ao atualizar ${product.name}:`, updateError);
      } else {
        console.log(`✅ ${product.name} atualizado`);
      }
    }

    console.log('\n✅ Slugs gerados com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

generateSlugs();
