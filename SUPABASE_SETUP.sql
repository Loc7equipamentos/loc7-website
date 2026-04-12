-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  icon VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  badge VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category) REFERENCES categories(name)
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso público (leitura)
CREATE POLICY "Allow public read on categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on products" ON products
  FOR SELECT USING (true);

-- Criar políticas de acesso para admin (todas as operações)
-- Nota: Você precisa configurar autenticação no Supabase para isso
-- Por enquanto, vamos permitir tudo (remova isso em produção!)
CREATE POLICY "Allow all on categories" ON categories
  FOR ALL USING (true);

CREATE POLICY "Allow all on products" ON products
  FOR ALL USING (true);

-- Criar bucket de storage para imagens
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT DO NOTHING;

-- Criar política de acesso ao storage
CREATE POLICY "Allow public read on products storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Allow authenticated upload on products storage" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'products');

-- Inserir categorias padrão
INSERT INTO categories (name) VALUES
  ('Câmeras'),
  ('Lentes'),
  ('Iluminação'),
  ('Áudio'),
  ('Monitores'),
  ('Movimento'),
  ('Wireless'),
  ('Modificadores'),
  ('Maquinária')
ON CONFLICT DO NOTHING;
