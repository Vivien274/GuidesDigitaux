'use client';

import { Product, DEFAULT_PRODUCTS } from '@/data/defaultProducts';

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

    const defaultIds = new Set(DEFAULT_PRODUCTS.map(p => p.id));
    const defaultSlugs = new Set(DEFAULT_PRODUCTS.map(p => p.slug));

    // Map each DEFAULT_PRODUCT with potential custom overrides from localStorage
    const mergedDefaults: Product[] = DEFAULT_PRODUCTS.map(def => {
      const stored = list.find(item => item.id === def.id || item.slug === def.slug || item.title.toLowerCase().trim() === def.title.toLowerCase().trim());
      if (!stored) return def;

      const defHasHtml = Boolean(def.longDescription && (def.longDescription.includes('<h3') || def.longDescription.includes('<p>')));
      const storedHasHtml = Boolean(stored.longDescription && (stored.longDescription.includes('<h3') || stored.longDescription.includes('<p>')));

      // Always pick the rich HTML description from def unless stored has custom rich HTML that is longer
      const effectiveLongDesc = (defHasHtml && (!storedHasHtml || def.longDescription!.length >= (stored.longDescription || '').length))
        ? def.longDescription!
        : (stored.longDescription || def.longDescription || stored.description || '');

      return {
        ...def,
        ...stored,
        title: stored.title || def.title,
        slug: stored.slug || def.slug,
        image: def.image || stored.image,
        imageAlt: def.imageAlt || stored.imageAlt,
        description: def.description || stored.description,
        longDescription: effectiveLongDesc,
        features: (def.features && def.features.length > 0) ? def.features : stored.features,
        downloadPdf: stored.downloadPdf || def.downloadPdf
      };
    });

    // Custom created products in localStorage that are not part of defaults
    const customCreated = list.filter(item => !defaultIds.has(item.id) && !defaultSlugs.has(item.slug));
    const fullList = [...mergedDefaults, ...customCreated];

    return fullList;
  } catch (e) {
    console.error('Failed to parse gd_custom_products', e);
  }
  return DEFAULT_PRODUCTS;
}

export function saveProduct(newProduct: Product): Product[] {
  const current = getStoredProducts();
  const index = current.findIndex(p => p.id === newProduct.id || p.slug === newProduct.slug);
  let updated: Product[];
  
  if (index >= 0) {
    updated = current.map((p, i) => i === index ? newProduct : p);
  } else {
    updated = [newProduct, ...current];
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('gd_custom_products', JSON.stringify(updated));
    } catch (e) {
      console.error('Could not save product to localStorage', e);
    }
  }
  return updated;
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
  return updated;
}
