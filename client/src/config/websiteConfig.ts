import { useState, useEffect, useCallback } from 'react';
import { getCookie, setCookie, removeCookie } from '../utils/cookies';

export interface GlobalBrandConfig {
  brandName: string;
  brandTagline: string;
  brandLogo: string;
  footerAbout: string;
  topNotice: string;
  showTopNotice: boolean;
}

export interface SectionItem {
  id: string;
  name: string;
  visible: boolean;
  image?: string;
  texts?: Record<string, string>;
  selectedProductIds?: string[];
}

export interface PageConfig {
  id: string;
  name: string;
  route: string;
  sections: SectionItem[];
}

export interface WebsiteFullConfig {
  brand: GlobalBrandConfig;
  pages: PageConfig[];
}

export const STORAGE_KEY = 'sadida_website_config';
export const WEBSITE_CONFIG_EVENT = 'sadida_website_config_updated';

export const AVAILABLE_IMAGES = [
  '/logo.jpg',
  '/banner.jpg',
  '/images/hero_sketch.jpg',
  '/images/shoe_runner_1.jpg',
  '/images/shoe_runner_2.jpg',
  '/images/shoe_walker_1.jpg',
  '/images/shoe_walker_2.jpg',
];

export const DEFAULT_BRAND: GlobalBrandConfig = {
  brandName: 'SADIDA',
  brandTagline: 'FOOTWEAR • BLACK & WHITE',
  brandLogo: '/logo.jpg',
  footerAbout:
    'Sadida แบรนด์รองเท้าวิ่งและรองเท้าเดินที่คัดสรรวัสดุพรีเมียม โครงสร้างน้ำหนักเบา และเอกลักษณ์โทนสีดำกับสีขาว สไตล์มินิมอลเหนือกาลเวลา',
  topNotice: '🔥 คอลเลกชันใหม่ SADIDA 2026 พร้อมเปิดตัวอย่างเป็นทางการแล้ว',
  showTopNotice: false,
};

export const DEFAULT_PAGES: PageConfig[] = [
  {
    id: 'home',
    name: 'หน้าหลัก (Brand Home)',
    route: '/',
    sections: [
      {
        id: 'hero',
        name: 'แบนเนอร์หลัก (Hero Banner)',
        visible: true,
        image: '/images/hero_sketch.jpg',
        texts: {
          headline: 'CRAFTED FOR PURE MOTION.',
          subtitle: 'จากภาพร่างสเก็ตช์ในสตูดิโอ สู่นวัตกรรมรองเท้าวิ่งและรองเท้าเดินที่เรียบหรูเหนือกาลเวลา',
          badge: 'Sadida Concept Atelier',
        },
      },
      {
        id: 'products',
        name: 'แถบเลื่อนสินค้า (Product Carousel)',
        visible: true,
        selectedProductIds: ['pro_001', 'pro_002', 'pro_003', 'pro_004', 'pro_005', 'pro_006'],
        texts: {
          title: 'สินค้าของแบรนด์ SADIDA',
          subtitle: 'เลือกช้อปรองเท้าคุณภาพสูง แบ่งออกเป็น 2 ประเภทหลัก ได้แก่ รองเท้าวิ่ง สำหรับความเร็ว และ รองเท้าเดิน สำหรับความสบายทุกวัน',
          badge: 'Sadida Collection 2026',
        },
      },
      {
        id: 'brand',
        name: 'ปรัชญาแบรนด์ (Brand Story)',
        visible: true,
        texts: {
          title: 'ทำไมต้องเป็นโทนสีดำกับสีขาว ของ SADIDA?',
          description: 'เราตัดทอนสีสันที่ไม่จำเป็นออก เพื่อให้คุณสัมผัสกับโครงสร้างที่แท้จริงของรองเท้า',
        },
      },
    ],
  },
  {
    id: 'products',
    name: 'หน้าสินค้า (Store)',
    route: '/products',
    sections: [
      {
        id: 'sidebar',
        name: 'แถบกรอง (Filter Sidebar)',
        visible: true,
        texts: {
          title: 'Navbar Menu',
        },
      },
      {
        id: 'productGrid',
        name: 'ตารางสินค้า (Product Grid)',
        visible: true,
        texts: {
          title: 'สินค้าทั้งหมด (PRODUCTS)',
          emptyMessage: 'ไม่พบสินค้าที่ตรงกับเงื่อนไข',
        },
      },
    ],
  },
  {
    id: 'contact',
    name: 'หน้าติดต่อเรา (Contact)',
    route: '/contact',
    sections: [
      {
        id: 'contactForm',
        name: 'ฟอร์มติดต่อเรา (Contact Form)',
        visible: true,
        texts: {
          title: 'ติดต่อเรา',
          description: 'ส่งข้อความถึงทีมงาน Sadida',
          buttonText: 'ส่ง',
        },
      },
      {
        id: 'contactInfo',
        name: 'ข้อมูลที่อยู่และแผนที่ (Address & Map)',
        visible: true,
        texts: {
          title: 'รายละเอียดที่อยู่',
          address: 'Sadida Flagship Atelier & Store 99/4 อาคารนวัตกรรมดีไซน์ ชั้น 1 แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ 10110',
          phone: '081-234-5678',
          email: 'contact@sadida.co.th',
          mapTitle: 'map (แผนที่ตั้ง)',
          mapLat: '13.7380',
          mapLng: '100.5630',
          mapZoom: '15',
          googleMapsApiKey: '',
        },
      },
    ],
  },
];

/**
 * Load and merge saved website full config (Brand + Pages)
 */
export function getSavedWebsiteFullConfig(): WebsiteFullConfig {
  try {
    const stored = getCookie(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { brand: DEFAULT_BRAND, pages: DEFAULT_PAGES };
    }

    const parsed = JSON.parse(stored);

    let rawBrand: any = DEFAULT_BRAND;
    let rawPages: any[] = DEFAULT_PAGES;

    if (Array.isArray(parsed)) {
      rawPages = parsed;
    } else if (parsed && typeof parsed === 'object') {
      if (parsed.brand) rawBrand = { ...DEFAULT_BRAND, ...parsed.brand };
      if (Array.isArray(parsed.pages)) rawPages = parsed.pages;
    }

    const mergedPages = DEFAULT_PAGES.map((defaultPage) => {
      const savedPage = rawPages.find((p: any) => p.id === defaultPage.id);
      if (!savedPage) return defaultPage;

      const savedSections: SectionItem[] = savedPage.sections || [];
      const mergedSections: SectionItem[] = savedSections.map((savedSection) => {
        const defaultSection = defaultPage.sections.find((s) => s.id === savedSection.id);
        return {
          id: savedSection.id,
          name: savedSection.name || defaultSection?.name || savedSection.id,
          visible: savedSection.visible !== false,
          image: savedSection.image || defaultSection?.image,
          selectedProductIds:
            savedSection.selectedProductIds !== undefined
              ? savedSection.selectedProductIds
              : defaultSection?.selectedProductIds,
          texts: {
            ...defaultSection?.texts,
            ...savedSection.texts,
          },
        };
      });

      defaultPage.sections.forEach((defSec) => {
        if (!mergedSections.some((s) => s.id === defSec.id)) {
          mergedSections.push(defSec);
        }
      });

      return {
        ...defaultPage,
        ...savedPage,
        sections: mergedSections,
      };
    });

    return {
      brand: rawBrand,
      pages: mergedPages,
    };
  } catch {
    return { brand: DEFAULT_BRAND, pages: DEFAULT_PAGES };
  }
}

/**
 * Backward compatibility helper for pages only
 */
export function getSavedWebsiteConfig(): PageConfig[] {
  return getSavedWebsiteFullConfig().pages;
}

/**
 * Custom React hook for reading and subscribing to website full config
 */
export function useWebsiteConfig() {
  const [config, setConfig] = useState<WebsiteFullConfig>(() => getSavedWebsiteFullConfig());

  const reload = useCallback(() => {
    setConfig(getSavedWebsiteFullConfig());
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || !e.key) {
        reload();
      }
    };

    const handleCustomUpdate = () => {
      reload();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(WEBSITE_CONFIG_EVENT, handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(WEBSITE_CONFIG_EVENT, handleCustomUpdate);
    };
  }, [reload]);

  const getPage = useCallback(
    (pageId: string): PageConfig | undefined => {
      return config.pages.find((p) => p.id === pageId);
    },
    [config.pages]
  );

  const getSection = useCallback(
    (pageId: string, sectionId: string): SectionItem | undefined => {
      const page = config.pages.find((p) => p.id === pageId);
      return page?.sections.find((s) => s.id === sectionId);
    },
    [config.pages]
  );

  const isSectionVisible = useCallback(
    (pageId: string, sectionId: string): boolean => {
      const sec = getSection(pageId, sectionId);
      return sec ? sec.visible !== false : true;
    },
    [getSection]
  );

  const getSectionText = useCallback(
    (pageId: string, sectionId: string, key: string, fallback: string): string => {
      const sec = getSection(pageId, sectionId);
      const val = sec?.texts?.[key];
      return val !== undefined && val !== '' ? val : fallback;
    },
    [getSection]
  );

  const getSectionImage = useCallback(
    (pageId: string, sectionId: string, fallback: string): string => {
      const sec = getSection(pageId, sectionId);
      return sec?.image || fallback;
    },
    [getSection]
  );

  const getSectionSelectedProductIds = useCallback(
    (pageId: string, sectionId: string): string[] | undefined => {
      const sec = getSection(pageId, sectionId);
      return sec?.selectedProductIds;
    },
    [getSection]
  );

  const saveConfig = useCallback((newConfig: WebsiteFullConfig) => {
    setCookie(STORAGE_KEY, JSON.stringify(newConfig));
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(WEBSITE_CONFIG_EVENT));
    setConfig(newConfig);
  }, []);

  const resetConfig = useCallback(() => {
    removeCookie(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(WEBSITE_CONFIG_EVENT));
    setConfig({ brand: DEFAULT_BRAND, pages: DEFAULT_PAGES });
  }, []);

  return {
    config,
    brand: config.brand,
    pages: config.pages,
    getPage,
    getSection,
    isSectionVisible,
    getSectionText,
    getSectionImage,
    getSectionSelectedProductIds,
    saveConfig,
    resetConfig,
    reload,
  };
}
