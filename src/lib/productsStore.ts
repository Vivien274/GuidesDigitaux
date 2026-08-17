'use client';

import { Product, DEFAULT_PRODUCTS } from '@/data/defaultProducts';

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return DEFAULT_PRODUCTS;
  try {
    const data = localStorage.getItem('gd_custom_products');
    let list: Product[] = DEFAULT_PRODUCTS;
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }

    const defaultMap = new Map(DEFAULT_PRODUCTS.map(p => [p.id, p]));

    const merged = list.map(item => {
      const def = defaultMap.get(item.id) || DEFAULT_PRODUCTS.find(p => p.slug === item.slug || p.title.toLowerCase().trim() === item.title.toLowerCase().trim());
      if (def) {
        const defHasHtml = def.longDescription && def.longDescription.includes('<h3');
        const itemHasHtml = item.longDescription && item.longDescription.includes('<h3');

        const effectiveLongDesc = (defHasHtml || !itemHasHtml || (def.longDescription?.length || 0) >= (item.longDescription || '').length)
          ? def.longDescription
          : item.longDescription;

        return {
          ...def,
          ...item,
          title: item.title || def.title,
          slug: item.slug || def.slug,
          category: item.category || def.category,
          categoryLabel: item.categoryLabel || def.categoryLabel,
          price: item.price ?? def.price,
          originalPrice: item.originalPrice ?? def.originalPrice,
          badge: item.badge || def.badge,
          image: def.image || item.image,
          imageAlt: def.imageAlt || item.imageAlt,
          description: def.description || item.description,
          longDescription: effectiveLongDesc || def.longDescription || item.description || '',
          downloadPdf: item.downloadPdf || def.downloadPdf,
          features: (item.features && item.features.length > 0) ? item.features : def.features,
          productType: item.productType || def.productType,
          bundleProductIds: item.bundleProductIds || def.bundleProductIds,
          bundleCustomItems: item.bundleCustomItems || def.bundleCustomItems
        };
      }
      return item;
    });

    const mergedIds = new Set(merged.map(p => p.id));
    const mergedSlugs = new Set(merged.map(p => p.slug));
    const missingDefaults = DEFAULT_PRODUCTS.filter(dp => !mergedIds.has(dp.id) && !mergedSlugs.has(dp.slug));

    return [...merged, ...missingDefaults];
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
