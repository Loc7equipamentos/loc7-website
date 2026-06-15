import { supabase } from '@/lib/supabase';
import { buildProductDisplayName } from '@/lib/admin/product-utils';

type ProductImageSource = {
  name?: string | null;
  brand?: string | null;
  category?: string | null;
  operational_type?: string | null;
};

type UploadProductImagesParams = {
  files: FileList;
  existingImages: string[];
  uploadBaseName: string;
};

type UploadProductImagesResult = {
  uploadedUrls: string[];
  errors: string[];
};

export const getCombinedImages = (
  imageUrl?: string | null,
  images?: string[] | null
) => {
  return [imageUrl, ...(images || [])].filter(Boolean) as string[];
};

const slugify = (value: string) => {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
};

export const getImageUploadBaseName = (sourceProduct: ProductImageSource) => {
  const displayName = buildProductDisplayName(
    sourceProduct.operational_type || '',
    sourceProduct.category || '',
    sourceProduct.name || ''
  );

  const fallbackName = [
    sourceProduct.operational_type,
    sourceProduct.brand,
    sourceProduct.name,
  ]
    .filter(Boolean)
    .join(' ');

  return slugify(displayName || fallbackName || `produto-${Date.now()}`) || `produto-${Date.now()}`;
};

const resizeImageToLoc7Pattern = async (file: File): Promise<Blob> => {
  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
      img.src = imageUrl;
    });

    const canvasSize = 2000;
    const maxImageSize = canvasSize * 0.9;
    const scale = Math.min(
      maxImageSize / image.naturalWidth,
      maxImageSize / image.naturalHeight
    );

    const drawWidth = Math.round(image.naturalWidth * scale);
    const drawHeight = Math.round(image.naturalHeight * scale);
    const offsetX = Math.round((canvasSize - drawWidth) / 2);
    const offsetY = Math.round((canvasSize - drawHeight) / 2);

    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Não foi possível processar a imagem.');
    }

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvasSize, canvasSize);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Não foi possível converter a imagem para WebP.'));
            return;
          }

          resolve(blob);
        },
        'image/webp',
        0.85
      );
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
};

export const uploadProductImages = async ({
  files,
  existingImages,
  uploadBaseName,
}: UploadProductImagesParams): Promise<UploadProductImagesResult> => {
  const uploadedUrls: string[] = [];
  const errors: string[] = [];
  const uploadVersion = Date.now();

  const orderedFiles = Array.from(files)
    .filter(Boolean)
    .sort((a, b) =>
      a.name.localeCompare(b.name, 'pt-BR', {
        numeric: true,
        sensitivity: 'base',
      })
    );

  for (const file of orderedFiles) {
    if (!file) continue;

    try {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Formato inválido. Use JPG, PNG ou WebP.');
      }

      const maxSize = 20 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('Arquivo muito grande (máximo 20MB)');
      }

      const imageNumber = existingImages.length + uploadedUrls.length + 1;
      const fileName = `${uploadBaseName}-${String(imageNumber).padStart(2, '0')}-${uploadVersion}.webp`;
      const filePath = `products/${uploadBaseName}/${fileName}`;
      const processedImage = await resizeImageToLoc7Pattern(file);

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, processedImage, {
          cacheControl: '3600',
          contentType: 'image/webp',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
      }

      const { data } = supabase.storage.from('products').getPublicUrl(filePath);
      uploadedUrls.push(data.publicUrl);
    } catch (err) {
      errors.push(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  }

  return {
    uploadedUrls,
    errors,
  };
};
