/**
 * Cookie Utilities for Sadida Footwear Web Application
 * Handles setting, getting, and removing browser cookies with chunking support.
 */

const MAX_SAFE_COOKIE_SIZE = 3500;

/**
 * Sets a cookie with expiration in days (default: 30 days).
 * Prevents bloating HTTP request headers by falling back to localStorage if payload exceeds safe header limits.
 */
export function setCookie(name: string, value: string, days = 30): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const encoded = encodeURIComponent(value);

  // If payload fits safely inside a single small cookie
  if (encoded.length <= MAX_SAFE_COOKIE_SIZE) {
    document.cookie = `${encodeURIComponent(name)}=${encoded}; expires=${expires}; path=/; SameSite=Lax`;
    removeCookieChunks(name);
    return;
  }

  // Safety fallback: Large payloads (>3.5KB) are saved in localStorage
  // to avoid Vercel 494 REQUEST_HEADER_TOO_LARGE error.
  console.warn(`Payload for "${name}" is too large for cookies (${encoded.length} bytes). Saving to localStorage to protect request headers.`);
  try {
    localStorage.setItem(name, value);
    // Remove bloated cookies
    document.cookie = `${encodeURIComponent(name)}=__local_storage__; expires=${expires}; path=/; SameSite=Lax`;
    removeCookieChunks(name);
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

/**
 * Gets a cookie by name, assembling chunks automatically if chunked,
 * and falling back to localStorage if marked as stored in localStorage.
 */
export function getCookie(name: string): string | null {
  const raw = getRawCookie(name);
  if (!raw) {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(name) : null;
  }

  if (raw === '__local_storage__') {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(name) : null;
  }

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
  try {
    localStorage.removeItem(name);
  } catch {
    // ignore
  }
}

function removeCookieChunks(name: string): void {
  for (let i = 0; i < 50; i++) {
    const chunkName = `${name}_${i}`;
    if (getRawCookie(chunkName) !== null) {
      document.cookie = `${encodeURIComponent(chunkName)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
    }
  }
}

/**
 * Automatically purges any lingering bloated chunk cookies that cause 494 REQUEST_HEADER_TOO_LARGE
 */
export function cleanupBloatedCookies(): void {
  if (typeof document === 'undefined') return;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    const eqIdx = c.indexOf('=');
    const cookieName = eqIdx > -1 ? c.slice(0, eqIdx) : c;
    if (cookieName.startsWith('sadida_website_config_') || cookieName.startsWith('sadida_products_')) {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
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

// Run cleanup and migration immediately on module load
if (typeof window !== 'undefined') {
  cleanupBloatedCookies();
  migrateLocalStorageToCookies();
}
