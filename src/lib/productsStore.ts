'use client';

import { Product, DEFAULT_PRODUCTS } from '@/data/defaultProducts';

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return DEFAULT_PRODUCTS;
  try {
    const data = localStorage.getItem('gd_custom_products');
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
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
