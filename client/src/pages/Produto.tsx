import { useEffect, useMemo, useState } from 'react';
import { useRoute } from 'wouter';
import { supabase } from '@/lib/supabase';

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image_url: string | null;
  images: string[] | null;
  includes: string | null;
  category: string;
  subcategory?: string | null;
  badge?: string | null;
};

export default function Produto() {
  const [, params] = useRoute('/equipamentos/:slug');
  const slug = params?.slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) {
        setError('Produto não encontrado.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error || !data) {
          throw new Error('Produto não encontrado.');
        }

        setProduct(data as Product);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produto.');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const galleryImages = useMemo(() => {
    if (!product) return [];

    return [
      product.image_url,
      ...(product.images || [])
    ].filter((img): img is string => Boolean(img));
  }, [product]);

  useEffect(() => {
    if (!galleryImages.length) {
      setSelectedImage('');
      return;
    }

    setSelectedImage((current) => {
      if (current && galleryImages.includes(current)) {
        return current;
      }

      return galleryImages[0];
    });
  }, [galleryImages]);

  const includesList = useMemo(() => {
    if (!product?.includes) return [];

    return product.includes
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }, [product]);

  const handleSelectImage = (image: string) => {
    setSelectedImage(image);
  };

  const handlePrevImage = () => {
    if (!galleryImages.length || !selectedImage) return;

    const currentIndex = galleryImages.indexOf(selectedImage);
    const prevIndex = currentIndex <= 0 ? galleryImages.length - 1 : currentIndex - 1;
    setSelectedImage(galleryImages[prevIndex]);
  };

  const handleNextImage = () => {
    if (!galleryImages.length || !selectedImage) return;

    const currentIndex = galleryImages.indexOf(selectedImage);
    const nextIndex = currentIndex >= galleryImages.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(galleryImages[nextIndex]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <p className="text-sm text-gray-400">Carregando produto...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <p className="text-sm text-red-400">{error || 'Produto não encontrado.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-sm text-gray-400 mb-8">
          <span>Catálogo</span>
          {product.category && (
            <>
              <span className="mx-2">/</span>
              <span>{product.category}</span>
            </>
          )}
          {product.subcategory && (
            <>
              <span className="mx-2">/</span>
              <span>{product.subcategory}</span>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="aspect-[4/3] flex items-center justify-center p-6">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-sm text-gray-500">Sem imagem</div>
                )}
              </div>

              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white border border-white/10 transition"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white border border-white/10 transition"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            {galleryImages.length > 0 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                {galleryImages.map((img, index) => {
                  const isActive = img === selectedImage;

                  return (
                    <button
                      key={`${img}-${index}`}
                      type="button"
                      onClick={() => handleSelectImage(img)}
                      className={`shrink-0 rounded-xl overflow-hidden border transition ${
                        isActive
                          ? 'border-white'
                          : 'border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-24 h-20 object-cover bg-zinc-950"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            {product.badge && (
              <div className="inline-flex items-center rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300 mb-4">
                {product.badge}
              </div>
            )}

            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              {product.name}
            </h1>

            <div className="text-2xl md:text-3xl font-bold text-white mb-6">
              {Number(product.price || 0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </div>

            {product.description && (
              <div className="mb-8">
                <h2 className="text-sm uppercase tracking-[0.2em] text-zinc-400 mb-3">
                  Descrição
                </h2>
                <p className="text-zinc-300 leading-7 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {includesList.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm uppercase tracking-[0.2em] text-zinc-400 mb-3">
                  O que acompanha
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-zinc-300">
                  {includesList.map((item, index) => (
                    <li key={`${item}-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
