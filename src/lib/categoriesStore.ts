'use client';

export interface ProductCategoryItem {
  id: string;
  name: string;
  slug: string;
}

export const DEFAULT_PRODUCT_CATEGORIES: ProductCategoryItem[] = [
  { id: 'cat-formation', name: 'Formations Vidéo', slug: 'formation' },
  { id: 'cat-ebook', name: 'E-Books & Guides PDF', slug: 'ebook' },
  { id: 'cat-checklist', name: 'Checklists & Modèles', slug: 'checklist' },
  { id: 'cat-coaching', name: 'Coaching & Visio', slug: 'coaching' }
];

export function getStoredCategories(): ProductCategoryItem[] {
  if (typeof window === 'undefined') return DEFAULT_PRODUCT_CATEGORIES;
  try {
    const data = localStorage.getItem('gd_product_categories');
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse gd_product_categories', e);
  }
  return DEFAULT_PRODUCT_CATEGORIES;
}

export function saveCategory(category: ProductCategoryItem): ProductCategoryItem[] {
  const current = getStoredCategories();
  const index = current.findIndex(c => c.id === category.id || c.slug === category.slug);
  let updated: ProductCategoryItem[];
  if (index >= 0) {
    updated = current.map((c, i) => i === index ? category : c);
  } else {
    updated = [...current, category];
  }
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('gd_product_categories', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save gd_product_categories', e);
    }
  }
  return updated;
}

export function deleteCategory(id: string): ProductCategoryItem[] {
  const current = getStoredCategories();
  const updated = current.filter(c => c.id !== id && c.slug !== id);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('gd_product_categories', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete category', e);
    }
  }
  return updated;
}
