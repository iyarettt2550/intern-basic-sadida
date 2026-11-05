import type { Product } from '../types';
import { getAdminAuthHeaders } from './cookies';

export const API_BASE = (import.meta.env.VITE_API_BASE ?? '').replace(/\/$/, '');
export const PRODUCTS_UPDATED_EVENT = 'sadida_products_updated';
export const CATEGORIES_UPDATED_EVENT = 'sadida_categories_updated';

// Auto-clean any legacy localStorage caches
try {
  localStorage.removeItem('sadida_products_catalog');
  localStorage.removeItem('sadida_categories_catalog');
} catch {}

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
 * Always returns empty array synchronously (no caching).
 */
export function getCachedProducts(): Product[] {
  return [];
}

/**
 * Dispatches product update event without persisting to localStorage
 */
export function saveProductsToCache(products: Product[]): void {
  try {
    localStorage.removeItem('sadida_products_catalog');
  } catch {}
  window.dispatchEvent(new CustomEvent(PRODUCTS_UPDATED_EVENT, { detail: products }));
}

/**
 * Asynchronously loads products from backend API.
 * If backend server is not running (offline/unreachable), returns empty array [].
 */
export async function loadAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/api/products`, {
      headers: { Accept: 'application/json' },
    });
    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      console.error(`Products API returned ${res.status} (${contentType || 'unknown type'})`);
      return [];
    }
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data.map(mapBackendProductToProduct);
    }
    console.error('Products API error:', json.error || json);
  } catch (err) {
    console.error('Failed to load products:', err);
  }
  return [];
}

/**
 * Always returns empty array synchronously (no caching).
 */
export function getCachedCategories(): CategoryItem[] {
  return [];
}

/**
 * Dispatches category update event without persisting to localStorage
 */
export function saveCategoriesToCache(cats: CategoryItem[]): void {
  try {
    localStorage.removeItem('sadida_categories_catalog');
  } catch {}
  window.dispatchEvent(new CustomEvent(CATEGORIES_UPDATED_EVENT, { detail: cats }));
}

/**
 * Load categories directly from backend API.
 * If backend server is not running, returns empty array [].
 */
export async function loadAllCategories(): Promise<CategoryItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/admin/products/categories`);
    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      console.error(`Categories API returned ${res.status} (${contentType || 'unknown type'})`);
      return [];
    }
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data;
    }
    console.error('Categories API error:', json.error || json);
  } catch (err) {
    console.error('Failed to load categories:', err);
  }
  return [];
}

/**
 * Create a new category on server
 */
export async function createCategory(categoryName: string, customId?: string): Promise<CategoryItem> {
  const newId = customId || `cg_${Date.now()}`;
  const newCat: CategoryItem = { categoryId: newId, categoryName: categoryName.trim() };

  try {
    const res = await fetch(`${API_BASE}/api/admin/products/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAdminAuthHeaders(),
      },
      body: JSON.stringify(newCat),
    });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn('Backend category creation failed:', err);
  }

  return newCat;
}

/**
 * Upload image to server or fallback to base64 dataUrl
 */
export async function uploadProductImage(dataUrl: string): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/api/admin/products/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAdminAuthHeaders(),
      },
      body: JSON.stringify({ dataUrl }),
    });
    const json = await res.json();
    if (json.success && json.data?.url) {
      return json.data.url;
    }
  } catch (err) {
    console.warn('Backend image upload failed:', err);
  }
  return dataUrl;
}

/**
 * Upload binary file directly to Vercel Blob / server
 */
export async function uploadFileToBlob(file: File): Promise<string> {
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filename = `${Date.now()}_${cleanName}`;
  const res = await fetch(`${API_BASE}/api/upload?filename=${encodeURIComponent(filename)}`, {
    method: 'POST',
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
      ...getAdminAuthHeaders(),
    },
    body: file,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to upload file to storage');
  }
  const blob = await res.json();
  return blob.url;
}
