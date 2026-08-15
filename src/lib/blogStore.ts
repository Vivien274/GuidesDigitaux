'use client';

import { BlogArticle, BLOG_ARTICLES } from '@/data/blogArticles';

export function getStoredBlogArticles(): BlogArticle[] {
  if (typeof window === 'undefined') return BLOG_ARTICLES;
  try {
    const data = localStorage.getItem('gd_custom_blog_articles');
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse gd_custom_blog_articles', e);
  }
  return BLOG_ARTICLES;
}

export function saveBlogArticle(newArticle: BlogArticle): BlogArticle[] {
  const current = getStoredBlogArticles();
  const index = current.findIndex(a => a.id === newArticle.id || a.slug === newArticle.slug);
  let updated: BlogArticle[];

  if (index >= 0) {
    updated = current.map((a, i) => i === index ? newArticle : a);
  } else {
    updated = [newArticle, ...current];
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('gd_custom_blog_articles', JSON.stringify(updated));
    } catch (e) {
      console.error('Could not save blog article to localStorage', e);
    }
  }
  return updated;
}

export function deleteBlogArticle(articleId: string): BlogArticle[] {
  const current = getStoredBlogArticles();
  const updated = current.filter(a => a.id !== articleId && a.slug !== articleId);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('gd_custom_blog_articles', JSON.stringify(updated));
    } catch (e) {
      console.error('Could not delete blog article from localStorage', e);
    }
  }
  return updated;
}
