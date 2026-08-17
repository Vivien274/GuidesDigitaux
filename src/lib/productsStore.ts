import { Product, DEFAULT_PRODUCTS } from '@/data/defaultProducts';
import { supabase } from '@/lib/supabaseLms';

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return DEFAULT_PRODUCTS;
  try {
    const data = localStorage.getItem('gd_custom_products');
    let list: Product[] = [];
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        list = parsed;
      }
    }

    const storedMap = new Map<string, Product>();
    list.forEach(item => {
      if (item.id) storedMap.set(item.id, item);
      if (item.slug) storedMap.set(item.slug, item);
    });

    // 1. Map default products with potential user overrides
    const mergedDefaults: Product[] = DEFAULT_PRODUCTS.map(def => {
      const stored = storedMap.get(def.id) || storedMap.get(def.slug) || list.find(item => item.title?.toLowerCase().trim() === def.title?.toLowerCase().trim());
      if (!stored) return def;

      // Stored user edits (image, gallery, longDescription, etc.) ALWAYS take priority over defaults
      return {
        ...def,
        ...stored,
        title: stored.title || def.title,
        slug: stored.slug || def.slug,
        image: stored.image || def.image,
        imageAlt: stored.imageAlt || def.imageAlt,
        gallery: (stored.gallery && stored.gallery.length > 0) ? stored.gallery : (def.gallery || [stored.image || def.image]),
        description: stored.description || def.description,
        longDescription: stored.longDescription || def.longDescription || stored.description || '',
        price: stored.price ?? def.price,
        originalPrice: stored.originalPrice ?? def.originalPrice,
        badge: stored.badge || def.badge,
        features: (stored.features && stored.features.length > 0) ? stored.features : def.features,
        downloadPdf: stored.downloadPdf || def.downloadPdf,
        productType: stored.productType || def.productType,
        bundleProductIds: stored.bundleProductIds || def.bundleProductIds,
        bundleCustomItems: stored.bundleCustomItems || def.bundleCustomItems
      };
    });

    // 2. Custom newly created products in localStorage that are not in DEFAULT_PRODUCTS
    const defaultIds = new Set(DEFAULT_PRODUCTS.map(p => p.id));
    const defaultSlugs = new Set(DEFAULT_PRODUCTS.map(p => p.slug));
    const customCreated = list.filter(item => !defaultIds.has(item.id) && !defaultSlugs.has(item.slug));

    return [...mergedDefaults, ...customCreated];
  } catch (e) {
    console.error('Failed to parse gd_custom_products', e);
  }
  return DEFAULT_PRODUCTS;
}

export function saveProduct(newProduct: Product): Product[] {
  // 1. Update in-memory DEFAULT_PRODUCTS if matching
  const defIndex = DEFAULT_PRODUCTS.findIndex(p => p.id === newProduct.id || p.slug === newProduct.slug);
  if (defIndex >= 0) {
    DEFAULT_PRODUCTS[defIndex] = {
      ...DEFAULT_PRODUCTS[defIndex],
      ...newProduct
    };
  }

  // 2. Get current raw list from localStorage
  let currentList: Product[] = [];
  if (typeof window !== 'undefined') {
    try {
      const data = localStorage.getItem('gd_custom_products');
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) currentList = parsed;
      }
    } catch (e) {}
  }

  const index = currentList.findIndex(p => p.id === newProduct.id || p.slug === newProduct.slug);
  let updatedList: Product[];
  
  if (index >= 0) {
    updatedList = currentList.map((p, i) => i === index ? newProduct : p);
  } else {
    updatedList = [newProduct, ...currentList];
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('gd_custom_products', JSON.stringify(updatedList));
    } catch (e) {
      console.error('Could not save product to localStorage', e);
    }
  }

  // 3. Upsert to Supabase DB asynchronously so public site is updated instantly
  try {
    supabase.from('products').upsert({
      id: newProduct.id,
      title: newProduct.title,
      slug: newProduct.slug,
      category: newProduct.category,
      category_label: newProduct.categoryLabel,
      price: newProduct.price,
      original_price: newProduct.originalPrice || null,
      badge: newProduct.badge || null,
      image: newProduct.image,
      image_alt: newProduct.imageAlt || newProduct.title,
      description: newProduct.description,
      long_description: newProduct.longDescription,
      download_pdf: newProduct.downloadPdf || null,
      features: newProduct.features || [],
      gallery: newProduct.gallery || [newProduct.image],
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' }).then(({ error }) => {
      if (error) console.warn('Supabase product upsert warning:', error);
    });
  } catch (err) {
    console.warn('Supabase product upsert error:', err);
  }

  return getStoredProducts();
}

export function deleteProduct(productId: string): Product[] {
  const current = getStoredProducts();
  const updated = current.filter(p => p.id !== productId && p.slug !== productId);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('gd_custom_products', JSON.stringify(updated));
    } catch (e) {
      console.error('Could not delete product from localStorage', e);
    }
  }

  try {
    supabase.from('products').delete().eq('id', productId).then(({ error }) => {
      if (error) console.warn('Supabase product delete warning:', error);
    });
  } catch (e) {}

  return updated;
}
