import type { Product } from '../types';

export const API_BASE = 'http://localhost:3000';
export const PRODUCTS_CACHE_KEY = 'sadida_products_catalog';
export const PRODUCTS_UPDATED_EVENT = 'sadida_products_updated';

export const CATEGORIES_CACHE_KEY = 'sadida_categories_catalog';
export const CATEGORIES_UPDATED_EVENT = 'sadida_categories_updated';

export interface CategoryItem {
  categoryId: string;
  categoryName: string;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [];

/**
 * Maps raw backend item to standard Product interface
 */
export function mapBackendProductToProduct(item: any): Product {
  const isRunning =
    item.categoryId === 'cg_1' ||
    (item.categoryName && item.categoryName.includes('วิ่ง'));

  // Get sizes strictly from backend (item.sizes array, or item.prodetailSize)
  let sizes: string[] = [];
  if (Array.isArray(item.sizes) && item.sizes.length > 0) {
    sizes = item.sizes
      .filter(Boolean)
      .map((s: string) => (String(s).toUpperCase().includes('UK') ? String(s) : `${s} UK`));
  } else if (item.prodetailSize) {
    const s = String(item.prodetailSize).trim();
    if (s) {
      sizes = [s.toUpperCase().includes('UK') ? s : `${s} UK`];
    }
  }

  const rawSize = item.prodetailSize || sizes[0] || '';
  const sizeWithUK = rawSize
    ? String(rawSize).toUpperCase().includes('UK')
      ? String(rawSize)
      : `${rawSize} UK`
    : '';

  return {
    proId: item.proId,
    proName: item.proName,
    description: item.description || '',
    categoryId: item.categoryId || (isRunning ? 'cg_1' : 'cg_2'),
    categoryName: item.categoryName || (isRunning ? 'รองเท้าวิ่ง' : 'รองเท้าเดิน'),
    price: Number(item.price) || 0,
    prodetailSize: sizeWithUK,
    sizes: sizes,
    imageUrl: item.img || item.imageUrl || '/images/shoe_runner_1.jpg',
    badge: item.badge || (isRunning ? 'HIGH PERFORMANCE' : 'BESTSELLER'),
    isPopular: item.isPopular ?? true,
  };
}

/**
 * Returns cached products synchronously directly from localStorage
 */
export function getCachedProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse cached products:', err);
  }
  return [];
}

/**
 * Saves products to localStorage cache and dispatches update event
 */
export function saveProductsToCache(products: Product[]): void {
  try {
    localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent(PRODUCTS_UPDATED_EVENT, { detail: products }));
  } catch (err) {
    console.warn('Failed to save products to cache:', err);
  }
}

/**
 * Asynchronously loads products from backend API, updating cache on success.
 */
export async function loadAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/api/admin/products`, {
      headers: { 'Accept': 'application/json' },
    });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      const mapped = json.data.map(mapBackendProductToProduct);
      saveProductsToCache(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('Backend unreachable, using local products cache:', err);
  }
  return getCachedProducts();
}

/**
 * Get cached categories directly from localStorage
 */
export function getCachedCategories(): CategoryItem[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse cached categories:', err);
  }
  return [];
}

/**
 * Save categories to cache and dispatch event
 */
export function saveCategoriesToCache(cats: CategoryItem[]): void {
  try {
    localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(cats));
    window.dispatchEvent(new CustomEvent(CATEGORIES_UPDATED_EVENT, { detail: cats }));
  } catch (err) {
    console.warn('Failed to save categories to cache:', err);
  }
}

/**
 * Load categories from backend API or local cache
 */
export async function loadAllCategories(): Promise<CategoryItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/admin/products/categories`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      saveCategoriesToCache(json.data);
      return json.data;
    }
  } catch (err) {
    console.warn('Backend categories unreachable, using cache:', err);
  }
  return getCachedCategories();
}

/**
 * Create a new category and persist to server + cache
 */
export async function createCategory(categoryName: string, customId?: string): Promise<CategoryItem> {
  const current = getCachedCategories();
  const newId = customId || `cg_${current.length + 1}`;
  const newCat: CategoryItem = { categoryId: newId, categoryName: categoryName.trim() };

  try {
    const res = await fetch(`${API_BASE}/api/admin/products/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCat),
    });
    const json = await res.json();
    if (json.success && json.data) {
      const updated = [...current.filter(c => c.categoryId !== json.data.categoryId), json.data];
      saveCategoriesToCache(updated);
      return json.data;
    }
  } catch (err) {
    console.info('Backend category creation offline fallback:', err);
  }

  // Fallback cache save
  const updated = [...current.filter(c => c.categoryId !== newId), newCat];
  saveCategoriesToCache(updated);
  return newCat;
}

/**
 * Upload image to server or fallback to base64 dataUrl
 */
export async function uploadProductImage(dataUrl: string): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/api/admin/products/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl }),
    });
    const json = await res.json();
    if (json.success && json.data?.url) {
      return json.data.url;
    }
  } catch (err) {
    console.info('Backend image upload offline fallback:', err);
  }
  return dataUrl;
}
