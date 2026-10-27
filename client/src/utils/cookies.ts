/**
 * Cookie Utilities for Sadida Footwear Web Application
 * Handles setting, getting, and removing browser cookies with chunking support.
 */

const CHUNK_SIZE = 3000;

/**
 * Sets a cookie with expiration in days (default: 30 days)
 */
export function setCookie(name: string, value: string, days = 30): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const encoded = encodeURIComponent(value);

  // If payload fits comfortably inside single cookie limit
  if (encoded.length <= CHUNK_SIZE) {
    document.cookie = `${encodeURIComponent(name)}=${encoded}; expires=${expires}; path=/; SameSite=Lax`;
    removeCookieChunks(name);
    return;
  }

  // Split into chunks if payload exceeds single cookie threshold
  const totalChunks = Math.ceil(encoded.length / CHUNK_SIZE);
  document.cookie = `${encodeURIComponent(name)}=__chunked__:${totalChunks}; expires=${expires}; path=/; SameSite=Lax`;

  for (let i = 0; i < totalChunks; i++) {
    const chunk = encoded.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    document.cookie = `${encodeURIComponent(name)}_${i}=${chunk}; expires=${expires}; path=/; SameSite=Lax`;
  }
}

/**
 * Gets a cookie by name, assembling chunks automatically if chunked.
 */
export function getCookie(name: string): string | null {
  const raw = getRawCookie(name);
  if (!raw) return null;

  if (raw.startsWith('__chunked__:')) {
    const totalChunks = parseInt(raw.replace('__chunked__:', ''), 10);
    let full = '';
    for (let i = 0; i < totalChunks; i++) {
      const chunk = getRawCookie(`${name}_${i}`);
      if (chunk) {
        full += chunk;
      }
    }
    try {
      return decodeURIComponent(full);
    } catch {
      return full;
    }
  }

  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/**
 * Removes a cookie and any associated chunks
 */
export function removeCookie(name: string): void {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
  removeCookieChunks(name);
}

function removeCookieChunks(name: string): void {
  for (let i = 0; i < 10; i++) {
    const chunkName = `${name}_${i}`;
    if (getRawCookie(chunkName) !== null) {
      document.cookie = `${encodeURIComponent(chunkName)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
    }
  }
}

function getRawCookie(name: string): string | null {
  const nameEQ = encodeURIComponent(name) + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length);
    }
  }
  return null;
}

/**
 * Auto-migrates legacy localStorage items into Cookies and clears localStorage
 */
export function migrateLocalStorageToCookies(): void {
  try {
    // 1. Migrate sadida_admin
    const legacyAdmin = localStorage.getItem('sadida_admin');
    if (legacyAdmin) {
      setCookie('sadida_admin', legacyAdmin, 30);
      localStorage.removeItem('sadida_admin');
    }

    // 2. Migrate sadida_website_config
    const legacyConfig = localStorage.getItem('sadida_website_config');
    if (legacyConfig) {
      setCookie('sadida_website_config', legacyConfig, 30);
      localStorage.removeItem('sadida_website_config');
    }

    // Clean any old product catalog caches from localStorage
    localStorage.removeItem('sadida_products_catalog');
    localStorage.removeItem('sadida_categories_catalog');
  } catch (err) {
    console.warn('Cookie migration notice:', err);
  }
}

// Run migration immediately on module load
if (typeof window !== 'undefined') {
  migrateLocalStorageToCookies();
}
