import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Type,
  ImageIcon,
  Layout,
  Globe,
  Layers,
  CheckCircle,
  Sparkles,
  ShoppingBag,
  Check,
  Megaphone,
  Upload,
  MapPin,
  Crosshair,
  ExternalLink,
  Locate,
} from 'lucide-react';
import {
  DEFAULT_BRAND,
  DEFAULT_PAGES,
  AVAILABLE_IMAGES,
  STORAGE_KEY,
  WEBSITE_CONFIG_EVENT,
  getSavedWebsiteFullConfig,
  type PageConfig,
  type GlobalBrandConfig,
} from '../../config/websiteConfig';
import { setCookie, removeCookie } from '../../utils/cookies';
import {
  getCachedProducts,
  loadAllProducts,
  PRODUCTS_UPDATED_EVENT,
  uploadProductImage,
} from '../../utils/productStore';
import type { Product } from '../../types';

const PAGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  brand: Sparkles,
  home: Globe,
  products: Layers,
  contact: Type,
};

const TEXT_KEY_LABELS: Record<string, string> = {
  headline: 'หัวข้อหลักตัวใหญ่ (Headline)',
  subtitle: 'คำบรรยาย / สโลแกนย่อย (Subtitle)',
  badge: 'ข้อความป้ายกำกับ (Badge / Tag)',
  title: 'หัวข้อประจำส่วน (Section Title)',
  description: 'คำอธิบายเนื้อหา (Description)',
  emptyMessage: 'ข้อความเมื่อค้นหาไม่พบ (Empty Search Message)',
  buttonText: 'ข้อความบนปุ่มกด (Button Text)',
  address: 'ที่อยู่ร้าน & สตูดิโอ (Address)',
  phone: 'เบอร์โทรศัพท์ติดต่อ (Phone)',
  email: 'อีเมลติดต่อ (Email)',
  mapTitle: 'ชื่อหัวข้อแผนที่ (Map Title)',
  mapLat: 'ละติจูด (Latitude เช่น 13.7380)',
  mapLng: 'ลองจิจูด (Longitude เช่น 100.5630)',
  mapZoom: 'ระดับการซูม (Zoom 10 - 18)',
  googleMapsApiKey: 'Google Maps API Key (ทางเลือก)',
};

const LOCATION_PRESETS = [
  { name: '📍 อโศก - สุขุมวิท (Sadida Flagship Atelier)', lat: '13.7380', lng: '100.5630', zoom: '16' },
  { name: '📍 สยามพารากอน / สยามสแควร์วัน', lat: '13.7460', lng: '100.5347', zoom: '16' },
  { name: '📍 เซ็นทรัลเวิลด์ (CentralWorld)', lat: '13.7469', lng: '100.5388', zoom: '16' },
  { name: '📍 ไอคอนสยาม (ICONSIAM)', lat: '13.7267', lng: '100.5105', zoom: '16' },
  { name: '📍 นิมมานเหมินท์ เชียงใหม่', lat: '18.7961', lng: '98.9691', zoom: '16' },
];

export const AdminWebsite: React.FC = () => {
  const [brand, setBrand] = useState<GlobalBrandConfig>(DEFAULT_BRAND);
  const [pages, setPages] = useState<PageConfig[]>(DEFAULT_PAGES);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'brand' | 'home' | 'products' | 'contact'>('brand');
  const [editingText, setEditingText] = useState<{ sectionId: string; key: string } | null>(null);
  const [saved, setSaved] = useState(false);
  const [logoUploadMsg, setLogoUploadMsg] = useState<string | null>(null);
  const [uploadingSectionImage, setUploadingSectionImage] = useState(false);
  const [sectionUploadSuccess, setSectionUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage or use defaults and sync dynamic products
  useEffect(() => {
    const full = getSavedWebsiteFullConfig();
    setBrand(full.brand);
    setPages(full.pages);

    loadAllProducts().then((p) => {
      if (Array.isArray(p)) setAllProducts(p);
    });

    const handleProductsUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<Product[]>;
      if (Array.isArray(customEvent.detail)) {
        setAllProducts(customEvent.detail);
      } else {
        setAllProducts(getCachedProducts());
      }
    };

    window.addEventListener(PRODUCTS_UPDATED_EVENT, handleProductsUpdated);
    return () => window.removeEventListener(PRODUCTS_UPDATED_EVENT, handleProductsUpdated);
  }, []);

  const activePage = pages.find((p) => p.id === activeTab);

  // Save full configuration
  const handleSave = () => {
    const fullConfig = { brand, pages };
    setCookie(STORAGE_KEY, JSON.stringify(fullConfig));
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(WEBSITE_CONFIG_EVENT));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Reset all to defaults
  const handleReset = () => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตการตั้งค่าหน้าเว็บทั้งหมดกลับเป็นค่าเริ่มต้น?')) {
      setBrand(DEFAULT_BRAND);
      setPages(DEFAULT_PAGES);
      removeCookie(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event(WEBSITE_CONFIG_EVENT));
    }
  };

  // Move section up/down in active page
  const moveSection = (pageId: string, sectionIndex: number, direction: 'up' | 'down') => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id !== pageId) return page;
        const newSections = [...page.sections];
        const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
        if (targetIndex < 0 || targetIndex >= newSections.length) return page;
        [newSections[sectionIndex], newSections[targetIndex]] = [
          newSections[targetIndex],
          newSections[sectionIndex],
        ];
        return { ...page, sections: newSections };
      })
    );
  };

  // Toggle section visibility
  const toggleVisibility = (pageId: string, sectionId: string) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id !== pageId) return page;
        return {
          ...page,
          sections: page.sections.map((s) =>
            s.id === sectionId ? { ...s, visible: !s.visible } : s
          ),
        };
      })
    );
  };

  // Update section text
  const updateText = (pageId: string, sectionId: string, key: string, value: string) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id !== pageId) return page;
        return {
          ...page,
          sections: page.sections.map((s) =>
            s.id === sectionId ? { ...s, texts: { ...s.texts, [key]: value } } : s
          ),
        };
      })
    );
  };

  // Update section image
  const updateImage = (pageId: string, sectionId: string, newImage: string) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id !== pageId) return page;
        return {
          ...page,
          sections: page.sections.map((s) =>
            s.id === sectionId ? { ...s, image: newImage } : s
          ),
        };
      })
    );
  };

  // Upload section image from local device (e.g. Hero Banner)
  const handleSectionImageUpload = async (pageId: string, sectionId: string, file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WebP, SVG)');
      return;
    }
    setUploadingSectionImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async (readerEvent) => {
        const rawDataUrl = readerEvent.target?.result as string;
        try {
          const uploadedUrl = await uploadProductImage(rawDataUrl);
          updateImage(pageId, sectionId, uploadedUrl);
          setSectionUploadSuccess(`อัปโหลดรูปภาพ "${file.name}" สำหรับแบนเนอร์หลักเรียบร้อยแล้ว! อย่าลืมกดบันทึกการเปลี่ยนแปลง`);
          setTimeout(() => setSectionUploadSuccess(null), 4000);
        } catch (uploadErr) {
          console.warn('Backend image upload failed, using dataUrl fallback', uploadErr);
          updateImage(pageId, sectionId, rawDataUrl);
          setSectionUploadSuccess(`อัปโหลดรูปภาพ "${file.name}" เรียบร้อยแล้ว! อย่าลืมกดบันทึกการเปลี่ยนแปลง`);
          setTimeout(() => setSectionUploadSuccess(null), 4000);
        } finally {
          setUploadingSectionImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Failed to read image:', err);
      alert('เกิดข้อผิดพลาดในการอ่านไฟล์รูปภาพ');
      setUploadingSectionImage(false);
    }
  };

  // Logo upload from local device
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WebP, SVG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new (window as any).Image();
      img.onload = () => {
        // Compress to maximum 400x400 to keep base64 small and ultra-fast
        const maxDim = 400;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.88);
          setBrand((prev) => ({ ...prev, brandLogo: compressedDataUrl }));
          setLogoUploadMsg(`อัปโหลดไฟล์ "${file.name}" เรียบร้อยแล้ว`);
        } else {
          setBrand((prev) => ({ ...prev, brandLogo: readerEvent.target?.result as string }));
          setLogoUploadMsg(`อัปโหลดไฟล์ "${file.name}" เรียบร้อยแล้ว`);
        }
        setTimeout(() => setLogoUploadMsg(null), 4000);
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleGetCurrentLocation = (pageId: string, sectionId: string) => {
    if (!navigator.geolocation) {
      alert('เบราว์เซอร์นี้ไม่รองรับการดึงตำแหน่ง Geolocation');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        updateText(pageId, sectionId, 'mapLat', lat);
        updateText(pageId, sectionId, 'mapLng', lng);
      },
      (err) => {
        alert('ไม่สามารถดึงตำแหน่งปัจจุบันได้: ' + err.message);
      }
    );
  };

  // Toggle product in featured showcase
  const toggleProductSelection = (pageId: string, sectionId: string, proId: string) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id !== pageId) return page;
        return {
          ...page,
          sections: page.sections.map((s) => {
            if (s.id !== sectionId) return s;
            const current = s.selectedProductIds || allProducts.map((p) => p.proId);
            const exists = current.includes(proId);
            const updated = exists ? current.filter((id) => id !== proId) : [...current, proId];
            return { ...s, selectedProductIds: updated };
          }),
        };
      })
    );
  };

  // Select all or clear all products
  const setAllProductsSelection = (pageId: string, sectionId: string, selectAll: boolean) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id !== pageId) return page;
        return {
          ...page,
          sections: page.sections.map((s) => {
            if (s.id !== sectionId) return s;
            return {
              ...s,
              selectedProductIds: selectAll ? allProducts.map((p) => p.proId) : [],
            };
          }),
        };
      })
    );
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-xs font-black tracking-widest uppercase mb-2 shadow-[2px_2px_0px_#000000]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Site Visual Customizer</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-black font-['Space_Grotesk']">
            จัดการและปรับแต่งหน้าเว็บ
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            แก้ไขชื่อแบรนด์ โลโก้ เลือกสินค้าที่จะโชว์ แก้ไขข้อความ สลับลำดับ และซ่อน/แสดงองค์ประกอบได้โดยไม่ต้องแตะโค้ด
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleReset}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-black font-bold text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
            title="รีเซ็ตทั้งหมดกลับเป็นค่าเริ่มต้น"
          >
            <RotateCcw className="w-4 h-4" />
            <span>รีเซ็ตค่าเดิม</span>
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 font-bold text-sm rounded-xl border-2 shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer ${
              saved
                ? 'bg-green-500 text-white border-green-600 shadow-[3px_3px_0px_#16a34a]'
                : 'bg-black text-white border-black'
            }`}
          >
            {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'บันทึกสำเร็จแล้ว!' : 'บันทึกการแก้ไขทั้งหมด'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2.5 mb-8 overflow-x-auto pb-2 border-b-2 border-neutral-200">
        {/* Brand Tab */}
        <button
          onClick={() => setActiveTab('brand')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm border-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'brand'
              ? 'bg-black text-white border-black shadow-[4px_4px_0px_#000000]'
              : 'bg-white text-black border-neutral-300 hover:border-black'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>แบรนด์ & โลโก้ (Brand & Header)</span>
        </button>

        {/* Page Tabs */}
        {pages.map((page) => {
          const PageIcon = PAGE_ICONS[page.id] || Layout;
          return (
            <button
              key={page.id}
              onClick={() => setActiveTab(page.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm border-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === page.id
                  ? 'bg-black text-white border-black shadow-[4px_4px_0px_#000000]'
                  : 'bg-white text-black border-neutral-300 hover:border-black'
              }`}
            >
              <PageIcon className="w-4 h-4" />
              <span>{page.name}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Brand & Logo Customization */}
      {activeTab === 'brand' && (
        <div className="space-y-6">
          {/* Live Preview Header Card */}
          <div className="bg-neutral-50 border-2 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000000]">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-neutral-500 mb-3">
              <Eye className="w-4 h-4 text-black" />
              <span>ตัวอย่างการแสดงผลส่วนหัว (Header Live Preview)</span>
            </div>

            {/* Top notice preview */}
            {brand.showTopNotice && brand.topNotice && (
              <div className="bg-black text-white text-xs font-bold py-1.5 px-4 rounded-xl text-center mb-3">
                {brand.topNotice}
              </div>
            )}

            <div className="bg-white border-2 border-black rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl border-2 border-black p-1 flex items-center justify-center overflow-hidden shadow-[2px_2px_0px_#000000]">
                  <img src={brand.brandLogo || '/logo.jpg'} alt="Logo Preview" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="text-2xl font-black tracking-tighter text-black font-['Space_Grotesk'] leading-none block">
                    {brand.brandName || 'SADIDA'}
                  </span>
                  <span className="text-[10px] tracking-[0.25em] text-neutral-600 uppercase font-bold mt-0.5 block">
                    {brand.brandTagline || 'FOOTWEAR • BLACK & WHITE'}
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-full border border-neutral-300">
                <span>[ แบนร์ ]</span>
                <span>[ สินค้า ]</span>
                <span>[ ติดต่อ ]</span>
              </div>
            </div>
          </div>

          {/* Brand Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Setting: Brand Name */}
            <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_#000000] space-y-3">
              <label className="block text-sm font-black text-black">
                1. ชื่อแบรนด์ (Brand Name)
              </label>
              <p className="text-xs text-neutral-500">
                แสดงผลที่ส่วนหัว Navbar, โลโก้ และส่วนท้าย Footer ของทุกหน้า
              </p>
              <input
                type="text"
                value={brand.brandName}
                onChange={(e) => setBrand({ ...brand, brandName: e.target.value })}
                placeholder="เช่น SADIDA"
                className="w-full px-4 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-base font-bold text-black focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_#000000] transition-all"
              />
            </div>

            {/* Setting: Brand Tagline */}
            <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_#000000] space-y-3">
              <label className="block text-sm font-black text-black">
                2. สโลแกนใต้โลโก้ (Brand Tagline)
              </label>
              <p className="text-xs text-neutral-500">
                แสดงผลข้อความย่อยใต้ชื่อแบรนด์
              </p>
              <input
                type="text"
                value={brand.brandTagline}
                onChange={(e) => setBrand({ ...brand, brandTagline: e.target.value })}
                placeholder="เช่น FOOTWEAR • BLACK & WHITE"
                className="w-full px-4 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-base font-bold text-black focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_#000000] transition-all"
              />
            </div>

            {/* Setting: Brand Logo */}
            <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_#000000] space-y-4 md:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="block text-sm font-black text-black">
                    3. รูปโลโก้แบรนด์ (Brand Logo Image)
                  </label>
                  <p className="text-xs text-neutral-500">
                    อัปโหลดรูปภาพจากในเครื่องคอมพิวเตอร์ เลือกรูปจากคลัง หรือพิมพ์ Path รูปภาพเอง
                  </p>
                </div>

                {/* Upload Button from Local Computer */}
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoFileUpload}
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>อัปโหลดจากเครื่อง (Upload Local)</span>
                  </button>
                </div>
              </div>

              {/* Upload Success Alert */}
              {logoUploadMsg && (
                <div className="p-3 bg-neutral-100 border-2 border-black rounded-xl text-xs font-bold text-black flex items-center gap-2 shadow-[2px_2px_0px_#000000]">
                  <CheckCircle className="w-4 h-4 text-black flex-shrink-0" />
                  <span>{logoUploadMsg}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-6 items-start pt-2">
                <div className="w-24 h-24 bg-neutral-100 border-2 border-black rounded-2xl p-2 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-[3px_3px_0px_#000000] relative group">
                  <img src={brand.brandLogo || '/logo.jpg'} alt="Brand Logo" className="w-full h-full object-contain" />
                  {brand.brandLogo?.startsWith('data:') && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1">
                      <span className="text-[9px] font-black text-white text-center leading-tight">รูปจากเครื่อง</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4 w-full">
                  {/* Status Indicator if using Local Upload */}
                  {brand.brandLogo?.startsWith('data:') && (
                    <div className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-300 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-bold text-black">
                          กำลังใช้รูปภาพที่อัปโหลดจากคอมพิวเตอร์ของคุณ (Data URL)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBrand({ ...brand, brandLogo: '/logo.jpg' })}
                        className="text-xs text-neutral-500 hover:text-black underline font-bold"
                      >
                        รีเซ็ตเป็น /logo.jpg
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-neutral-600 block mb-1">
                      หรือเลือกจากรูปที่มีอยู่ในระบบ:
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {AVAILABLE_IMAGES.map((img) => (
                        <button
                          key={img}
                          onClick={() => setBrand({ ...brand, brandLogo: img })}
                          className={`h-14 rounded-xl border-2 p-1 bg-white overflow-hidden transition-all cursor-pointer ${
                            brand.brandLogo === img
                              ? 'border-black shadow-[3px_3px_0px_#000000] ring-2 ring-black'
                              : 'border-neutral-200 hover:border-black'
                          }`}
                          title={img}
                        >
                          <img src={img} alt="" className="w-full h-full object-contain" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-600 block mb-1">
                      หรือพิมพ์ Path / URL รูปภาพเอง:
                    </label>
                    <input
                      type="text"
                      value={brand.brandLogo.startsWith('data:') ? '(รูปภาพที่อัปโหลดจากเครื่อง)' : brand.brandLogo}
                      onChange={(e) => {
                        if (!brand.brandLogo.startsWith('data:') || e.target.value !== '(รูปภาพที่อัปโหลดจากเครื่อง)') {
                          setBrand({ ...brand, brandLogo: e.target.value });
                        }
                      }}
                      placeholder="/logo.jpg หรือ https://..."
                      className="w-full px-3.5 py-2 bg-neutral-50 border-2 border-neutral-300 rounded-xl text-sm font-mono focus:outline-none focus:border-black focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Setting: Top Notice Bar */}
            <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_#000000] space-y-4 md:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-black text-black">
                    4. แถบประกาศด้านบนสุด (Top Announcement Bar)
                  </label>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    แสดงแถบดำด้านบนสุดสำหรับแจ้งโปรโมชัน หรือการเปิดตัวสินค้า
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setBrand({ ...brand, showTopNotice: !brand.showTopNotice })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                    brand.showTopNotice
                      ? 'bg-green-500 text-white border-black shadow-[2px_2px_0px_#000000]'
                      : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                  }`}
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>{brand.showTopNotice ? 'เปิดใช้งานอยู่' : 'ปิดใช้งาน'}</span>
                </button>
              </div>

              {brand.showTopNotice && (
                <input
                  type="text"
                  value={brand.topNotice}
                  onChange={(e) => setBrand({ ...brand, topNotice: e.target.value })}
                  placeholder="เช่น 🔥 คอลเลกชันใหม่ SADIDA 2026 พร้อมเปิดตัวอย่างเป็นทางการแล้ว"
                  className="w-full px-4 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-sm font-medium text-black focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_#000000] transition-all"
                />
              )}
            </div>

            {/* Setting: Footer About */}
            <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_#000000] space-y-3 md:col-span-2">
              <label className="block text-sm font-black text-black">
                5. คำอธิบายเกี่ยวกับแบรนด์ส่วนท้ายเว็บ (Footer About Description)
              </label>
              <p className="text-xs text-neutral-500">
                ข้อความสรุปความเป็นแบรนด์ใน Footer คอลัมน์แรก
              </p>
              <textarea
                rows={3}
                value={brand.footerAbout}
                onChange={(e) => setBrand({ ...brand, footerAbout: e.target.value })}
                placeholder="คำอธิบายแบรนด์..."
                className="w-full px-4 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-sm font-medium text-black focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_#000000] transition-all resize-y"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2, 3, 4: Pages Customization */}
      {activeTab !== 'brand' && activePage && (
        <div className="space-y-6">
          {/* Page Route Info Bar */}
          <div className="bg-neutral-50 border-2 border-neutral-200 rounded-2xl px-5 py-3.5 flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-600">
              หน้าเว็บ: <strong className="text-black font-black">{activePage.name}</strong> • เส้นทาง:{' '}
              <code className="bg-white px-2 py-0.5 rounded border border-neutral-300 font-mono text-xs text-black">
                {activePage.route}
              </code>
            </span>
            <a
              href={activePage.route}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-black text-black underline hover:no-underline flex items-center gap-1"
            >
              <span>เปิดดูหน้าจริง</span>
              <span>↗</span>
            </a>
          </div>

          {/* Sections List */}
          {activePage.sections.map((section, index) => (
            <div
              key={section.id}
              className={`bg-white border-2 border-black rounded-3xl shadow-[5px_5px_0px_#000000] overflow-hidden transition-all ${
                section.visible ? 'opacity-100' : 'opacity-60 bg-neutral-50'
              }`}
            >
              {/* Section Header with Controls */}
              <div className="flex items-center justify-between p-5 border-b-2 border-neutral-200 bg-neutral-50/50">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveSection(activePage.id, index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-neutral-200 disabled:opacity-20 transition-colors cursor-pointer"
                      title="เลื่อนขึ้น"
                    >
                      <ArrowUp className="w-4 h-4 text-black" />
                    </button>
                    <button
                      onClick={() => moveSection(activePage.id, index, 'down')}
                      disabled={index === activePage.sections.length - 1}
                      className="p-1 rounded hover:bg-neutral-200 disabled:opacity-20 transition-colors cursor-pointer"
                      title="เลื่อนลง"
                    >
                      <ArrowDown className="w-4 h-4 text-black" />
                    </button>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Layout className="w-4 h-4 text-neutral-500" />
                      <h3 className="font-black text-black text-base">{section.name}</h3>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800">
                        ลำดับที่ {index + 1}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {section.visible ? 'กำลังแสดงผลบนหน้าเว็บ' : 'ซ่อนอยู่ (ไม่แสดงผลให้ผู้ใช้เห็น)'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleVisibility(activePage.id, section.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                    section.visible
                      ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100'
                      : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                  }`}
                >
                  {section.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{section.visible ? 'แสดงอยู่' : 'ซ่อนไว้'}</span>
                </button>
              </div>

              {/* Section Content Customizers */}
              <div className="p-6 space-y-6">
                {/* 1. Image Editor */}
                {section.image !== undefined && (
                  <div className="bg-neutral-50 border-2 border-neutral-200 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-black" />
                        <span className="text-xs font-black uppercase text-black">
                          {section.id === 'hero' ? 'รูปภาพแบนเนอร์หลัก (Hero Banner Image)' : 'รูปภาพประจำส่วน'}
                        </span>
                      </div>
                      {section.id === 'hero' && (
                        <span className="text-[11px] font-bold text-black bg-white px-2.5 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_#000000]">
                          แบนเนอร์หน้าแรก
                        </span>
                      )}
                    </div>

                    {sectionUploadSuccess && (
                      <div className="p-3 bg-emerald-50 border-2 border-emerald-600 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                        <Check className="w-4 h-4 flex-shrink-0" />
                        <span>{sectionUploadSuccess}</span>
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-5 items-start">
                      {/* Current image preview */}
                      <div className="w-full md:w-64 h-36 bg-white border-2 border-black rounded-xl overflow-hidden flex-shrink-0 shadow-[3px_3px_0px_#000000] relative group">
                        <img
                          src={section.image}
                          alt="Section preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/hero_sketch.jpg';
                          }}
                        />
                        <span className="absolute bottom-1 left-1 right-1 text-[9px] font-mono bg-black/80 text-white px-1.5 py-0.5 rounded truncate">
                          {section.image}
                        </span>
                      </div>

                      {/* Controls: Upload & Preset Picker */}
                      <div className="flex-1 space-y-4 w-full">
                        {/* Upload Button Area */}
                        <div className="p-4 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000000]">
                          <label className="block text-xs font-black text-black mb-1">
                            อัปโหลดรูปภาพใหม่จากคอมพิวเตอร์ของคุณ
                          </label>
                          <p className="text-[11px] text-neutral-500 mb-3">
                            {section.id === 'hero'
                              ? 'เลือกไฟล์รูปภาพเพื่อใช้เป็นแบนเนอร์หลักของหน้าแรก (รองรับ JPG, PNG, WebP, SVG)'
                              : 'เลือกไฟล์รูปภาพจากอุปกรณ์เพื่อเปลี่ยนรูปส่วนนี้'}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer flex items-center gap-2">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{uploadingSectionImage ? 'กำลังอัปโหลด...' : 'เลือกไฟล์รูปภาพจากเครื่อง'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={uploadingSectionImage}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleSectionImageUpload(activePage.id, section.id, file);
                                    e.target.value = '';
                                  }
                                }}
                              />
                            </label>

                            {section.id === 'hero' && section.image !== '/images/hero_sketch.jpg' && (
                              <button
                                type="button"
                                onClick={() => updateImage(activePage.id, section.id, '/images/hero_sketch.jpg')}
                                className="px-3 py-2 bg-white text-neutral-600 hover:text-black font-bold text-xs rounded-xl border border-neutral-300 hover:border-black transition-all cursor-pointer"
                              >
                                รีเซ็ตเป็นรูปสเก็ตช์เริ่มต้น
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Presets and URL input */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-neutral-600">หรือเลือกจากคลังรูปภาพในระบบ:</label>
                          </div>
                          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                            {AVAILABLE_IMAGES.map((img) => (
                              <button
                                key={img}
                                type="button"
                                onClick={() => updateImage(activePage.id, section.id, img)}
                                className={`h-14 rounded-xl border-2 overflow-hidden transition-all cursor-pointer ${
                                  section.image === img
                                    ? 'border-black shadow-[2px_2px_0px_#000000] ring-2 ring-black'
                                    : 'border-neutral-200 hover:border-black'
                                }`}
                                title={img}
                              >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-neutral-600 block mb-1">
                            หรือระบุ URL / Path รูปภาพ:
                          </label>
                          <input
                            type="text"
                            value={section.image.startsWith('data:') ? '(รูปภาพที่อัปโหลดจากเครื่อง)' : section.image}
                            onChange={(e) => {
                              if (!section.image?.startsWith('data:') || e.target.value !== '(รูปภาพที่อัปโหลดจากเครื่อง)') {
                                updateImage(activePage.id, section.id, e.target.value);
                              }
                            }}
                            placeholder="/images/hero_sketch.jpg หรือ https://..."
                            className="w-full px-3.5 py-2 bg-white border-2 border-neutral-300 rounded-xl text-xs font-mono focus:outline-none focus:border-black"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Featured Products Selector (สำหรับส่วน Product Carousel) */}
                {activePage.id === 'home' && section.id === 'products' && (
                  <div className="bg-neutral-50 border-2 border-black rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-black" />
                          <h4 className="text-sm font-black text-black">
                            เลือกสินค้าที่ต้องการโชว์ในหน้าแรก (Featured Products)
                          </h4>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          คลิกที่การ์ดสินค้าเพื่อเลือกหรือเอาออกจากหน้าแรก สามารถโชว์กี่ชิ้นก็ได้ตามต้องการ
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAllProductsSelection(activePage.id, section.id, true)}
                          className="px-3 py-1 bg-white text-black text-xs font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] hover:bg-neutral-100 cursor-pointer"
                        >
                          เลือกทั้งหมด
                        </button>
                        <button
                          type="button"
                          onClick={() => setAllProductsSelection(activePage.id, section.id, false)}
                          className="px-3 py-1 bg-white text-neutral-700 text-xs font-bold rounded-lg border border-neutral-300 hover:border-black cursor-pointer"
                        >
                          ล้างการเลือก
                        </button>
                        <span className="text-xs font-black bg-black text-white px-2.5 py-1 rounded-lg">
                          แสดง {(section.selectedProductIds || []).length} / {allProducts.length} ชิ้น
                        </span>
                      </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                      {allProducts.map((p) => {
                        const isSelected =
                          section.selectedProductIds !== undefined
                            ? section.selectedProductIds.includes(p.proId)
                            : true;

                        return (
                          <div
                            key={p.proId}
                            onClick={() => toggleProductSelection(activePage.id, section.id, p.proId)}
                            className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                              isSelected
                                ? 'bg-white border-black shadow-[3px_3px_0px_#000000]'
                                : 'bg-neutral-100 border-neutral-300 opacity-50 hover:opacity-80'
                            }`}
                          >
                            <div className="w-14 h-14 bg-neutral-100 rounded-xl border border-black overflow-hidden flex-shrink-0">
                              <img src={p.imageUrl} alt={p.proName} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-black uppercase text-neutral-500 block truncate">
                                {p.categoryName}
                              </span>
                              <h5 className="text-xs font-black text-black truncate">{p.proName}</h5>
                              <span className="text-xs font-bold text-black font-['Space_Grotesk']">
                                ฿{p.price.toLocaleString()}
                              </span>
                            </div>

                            <div
                              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${
                                isSelected ? 'bg-black border-black text-white' : 'border-neutral-400 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Text Editors & Interactive Customizers */}
                {section.texts && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4 text-black" />
                      <span className="text-xs font-black uppercase text-black">ข้อความและเนื้อหา</span>
                    </div>

                    {/* Standard Text Fields (Excluding specialized map fields if contactInfo) */}
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(section.texts)
                        .filter(([key]) => {
                          if (activePage.id === 'contact' && section.id === 'contactInfo') {
                            return !['mapTitle', 'mapLat', 'mapLng', 'mapZoom', 'googleMapsApiKey'].includes(key);
                          }
                          return true;
                        })
                        .map(([key, value]) => {
                          const label = TEXT_KEY_LABELS[key] || key;
                          const isMultiline =
                            key === 'subtitle' || key === 'description' || key === 'address';

                          return (
                            <div key={key} className="bg-white border-2 border-neutral-200 rounded-2xl p-4">
                              <label className="text-xs font-black text-black block mb-1">
                                {label}
                              </label>

                              {editingText?.sectionId === section.id && editingText?.key === key ? (
                                <div className="space-y-2 mt-2">
                                  {isMultiline ? (
                                    <textarea
                                      rows={3}
                                      value={value}
                                      onChange={(e) =>
                                        updateText(activePage.id, section.id, key, e.target.value)
                                      }
                                      className="w-full px-3.5 py-2 border-2 border-black rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                                      autoFocus
                                    />
                                  ) : (
                                    <input
                                      type="text"
                                      value={value}
                                      onChange={(e) =>
                                        updateText(activePage.id, section.id, key, e.target.value)
                                      }
                                      className="w-full px-3.5 py-2 border-2 border-black rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                                      autoFocus
                                    />
                                  )}
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => setEditingText(null)}
                                      className="px-4 py-1.5 bg-black text-white font-black text-xs rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] cursor-pointer"
                                    >
                                      เสร็จสิ้น
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  onClick={() => setEditingText({ sectionId: section.id, key })}
                                  className="px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-800 cursor-pointer hover:border-black hover:bg-white transition-all whitespace-pre-line group flex items-center justify-between"
                                  title="คลิกเพื่อแก้ไข"
                                >
                                  <span className="line-clamp-2">
                                    {value || <span className="text-neutral-400 italic">คลิกเพื่อเพิ่มข้อความ</span>}
                                  </span>
                                  <span className="text-xs font-bold text-neutral-400 group-hover:text-black ml-2 flex-shrink-0">
                                    ✏️ แก้ไข
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>

                    {/* Specialized Google Maps & Interactive Pinning Customizer for Contact Page */}
                    {activePage.id === 'contact' && section.id === 'contactInfo' && (() => {
                      const mapTexts = section.texts || {};
                      const curMapLat = mapTexts.mapLat || '13.7380';
                      const curMapLng = mapTexts.mapLng || '100.5630';
                      const curMapZoom = mapTexts.mapZoom || '15';
                      const curMapTitle = mapTexts.mapTitle || 'map (แผนที่ตั้ง)';
                      const curApiKey = mapTexts.googleMapsApiKey || '';

                      return (
                        <div className="bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000000] space-y-5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-black">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-black" />
                              <div>
                                <h4 className="text-sm font-black uppercase text-black font-['Space_Grotesk']">
                                  ตั้งค่าแผนที่ Google Maps & ปักหมุดพิกัด (Coordinates & Map Picker)
                                </h4>
                                <p className="text-xs text-neutral-500">
                                  ปักหมุดเลือกทำเลร้านค้า ป้อนละติจูด/ลองจิจูด หรือเลือกจากตำแหน่งยอดนิยม
                                </p>
                              </div>
                            </div>

                            {/* GPS Current Location Button */}
                            <button
                              type="button"
                              onClick={() => handleGetCurrentLocation(activePage.id, section.id)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 hover:bg-black hover:text-white text-black text-xs font-bold rounded-xl border-2 border-black transition-colors cursor-pointer flex-shrink-0"
                            >
                              <Locate className="w-3.5 h-3.5" />
                              <span>ดึงพิกัดตำแหน่งปัจจุบัน (GPS)</span>
                            </button>
                          </div>

                          {/* Location Quick Presets */}
                          <div>
                            <label className="text-xs font-black uppercase text-neutral-600 block mb-2">
                              ⚡ หมุดตำแหน่งแนะนำด่วน (Quick Presets):
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {LOCATION_PRESETS.map((preset) => (
                                <button
                                  key={preset.name}
                                  type="button"
                                  onClick={() => {
                                    updateText(activePage.id, section.id, 'mapLat', preset.lat);
                                    updateText(activePage.id, section.id, 'mapLng', preset.lng);
                                    updateText(activePage.id, section.id, 'mapZoom', preset.zoom);
                                  }}
                                  className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                    curMapLat === preset.lat && curMapLng === preset.lng
                                      ? 'bg-black text-white border-black shadow-[2px_2px_0px_#000000]'
                                      : 'bg-neutral-50 hover:bg-neutral-200 text-black border-neutral-300'
                                  }`}
                                >
                                  {preset.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Coordinate Input Fields */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <label className="text-xs font-bold text-black block mb-1">
                                ละติจูด (Latitude):
                              </label>
                              <input
                                type="text"
                                value={curMapLat}
                                onChange={(e) => updateText(activePage.id, section.id, 'mapLat', e.target.value)}
                                placeholder="เช่น 13.7380"
                                className="w-full px-3 py-2 bg-neutral-50 border-2 border-black rounded-xl text-sm font-mono font-bold focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_#000000]"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-black block mb-1">
                                ลองจิจูด (Longitude):
                              </label>
                              <input
                                type="text"
                                value={curMapLng}
                                onChange={(e) => updateText(activePage.id, section.id, 'mapLng', e.target.value)}
                                placeholder="เช่น 100.5630"
                                className="w-full px-3 py-2 bg-neutral-50 border-2 border-black rounded-xl text-sm font-mono font-bold focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_#000000]"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-bold text-black">
                                  การซูม (Zoom Level):
                                </label>
                                <span className="text-xs font-mono font-bold bg-neutral-100 px-2 py-0.5 rounded border border-neutral-300">
                                  {curMapZoom}
                                </span>
                              </div>
                              <input
                                type="range"
                                min="10"
                                max="19"
                                value={curMapZoom}
                                onChange={(e) => updateText(activePage.id, section.id, 'mapZoom', e.target.value)}
                                className="w-full accent-black cursor-pointer"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-black block mb-1">
                                ชื่อหัวข้อแผนที่ (Map Title):
                              </label>
                              <input
                                type="text"
                                value={curMapTitle}
                                onChange={(e) => updateText(activePage.id, section.id, 'mapTitle', e.target.value)}
                                placeholder="map (แผนที่ตั้ง)"
                                className="w-full px-3 py-2 bg-neutral-50 border-2 border-black rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_#000000]"
                              />
                            </div>
                          </div>

                          {/* Google Maps API Key Input (Optional) */}
                          <div className="bg-neutral-50 border border-neutral-300 rounded-xl p-3">
                            <label className="text-xs font-bold text-black block mb-1">
                              Google Maps API Key (ทางเลือก / ใส่หรือไม่ใส่ก็ได้):
                            </label>
                            <input
                              type="text"
                              value={curApiKey}
                              onChange={(e) => updateText(activePage.id, section.id, 'googleMapsApiKey', e.target.value)}
                              placeholder="AIzaSy... (หากปล่อยว่าง ระบบจะใช้ Google Maps Embed ฟรีอัตโนมัติ)"
                              className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-mono focus:outline-none focus:border-black"
                            />
                          </div>

                          {/* Interactive Click-to-Pin Visual Canvas & Map Controller */}
                          <div className="border-2 border-black rounded-xl overflow-hidden bg-neutral-100">
                            <div className="px-4 py-2.5 bg-neutral-900 text-white flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <Crosshair className="w-4 h-4 text-white" />
                                <span className="font-bold">
                                  พิกัดที่เลือก: {curMapLat}, {curMapLng} (คลิกบนแผนที่ด้านล่างเพื่อขยับหมุด)
                                </span>
                              </div>
                              <a
                                href={`https://www.google.com/maps?q=${encodeURIComponent(curMapLat)},${encodeURIComponent(curMapLng)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:underline flex items-center gap-1 font-bold"
                              >
                                <span>เปิดดูใน Google Maps</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>

                            {/* Click-to-pin interactive helper */}
                            <div
                              onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const y = e.clientY - rect.top;
                                // Approximate offset adjustment around current center
                                const latOffset = ((rect.height / 2 - y) / rect.height) * 0.05;
                                const lngOffset = ((x - rect.width / 2) / rect.width) * 0.05;
                                const curLat = parseFloat(curMapLat);
                                const curLng = parseFloat(curMapLng);
                                const newLat = (curLat + latOffset).toFixed(4);
                                const newLng = (curLng + lngOffset).toFixed(4);
                                updateText(activePage.id, section.id, 'mapLat', newLat);
                                updateText(activePage.id, section.id, 'mapLng', newLng);
                              }}
                              className="relative aspect-[16/9] w-full bg-neutral-200 cursor-crosshair group overflow-hidden"
                              title="คลิกที่ตำแหน่งใดๆ บนแผนที่เพื่อขยับหมุดพิกัด"
                            >
                              <iframe
                                title="Google Map Live Preview"
                                width="100%"
                                height="100%"
                                style={{ border: 0, pointerEvents: 'none' }}
                                loading="lazy"
                                src={
                                  curApiKey
                                    ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(curApiKey)}&q=${encodeURIComponent(curMapLat)},${encodeURIComponent(curMapLng)}&zoom=${encodeURIComponent(curMapZoom)}`
                                    : `https://maps.google.com/maps?q=${encodeURIComponent(curMapLat)},${encodeURIComponent(curMapLng)}&hl=th&z=${encodeURIComponent(curMapZoom)}&output=embed`
                                }
                                className="w-full h-full"
                              />

                              {/* Floating Pin Overlay Indicator */}
                              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border-2 border-black text-[11px] font-bold text-black shadow-[2px_2px_0px_#000000] pointer-events-none flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-black animate-bounce" />
                                <span>คลิกที่แผนที่เพื่อปรับพิกัดปักหมุด</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminWebsite;
