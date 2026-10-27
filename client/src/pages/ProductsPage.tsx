import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import type { Product, CategoryFilter } from '../types';
import {
  getCachedProducts,
  loadAllProducts,
  PRODUCTS_UPDATED_EVENT,
  loadAllCategories,
  getCachedCategories,
  CATEGORIES_UPDATED_EVENT,
} from '../utils/productStore';
import type { CategoryItem } from '../utils/productStore';
import { Search, Filter, SlidersHorizontal, Sparkles, RotateCcw } from 'lucide-react';
import { useWebsiteConfig } from '../config/websiteConfig';

export const ProductsPage: React.FC = () => {
  const { isSectionVisible, getSectionText } = useWebsiteConfig();
  const showSidebar = isSectionVisible('products', 'sidebar');
  const showProductGrid = isSectionVisible('products', 'productGrid');
  const pageTitle = getSectionText('products', 'productGrid', 'title', 'สินค้าทั้งหมด (PRODUCTS)');
  const sidebarTitle = getSectionText('products', 'sidebar', 'title', 'Navbar Menu');
  const emptyMessage = getSectionText('products', 'productGrid', 'emptyMessage', 'ไม่พบสินค้าตรงกับเงื่อนไขการค้นหา');
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  // Initial category based on URL query
  const getInitialCategory = (): CategoryFilter => {
    if (categoryParam === 'running') return 'รองเท้าวิ่ง';
    if (categoryParam === 'walking') return 'รองเท้าเดิน';
    if (categoryParam) return categoryParam;
    return 'all';
  };

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(getInitialCategory());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    loadAllProducts().then((p) => {
      if (Array.isArray(p)) setAllProducts(p);
    });

    loadAllCategories().then((c) => {
      if (Array.isArray(c)) setCategories(c);
    });

    const handleProductsUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<Product[]>;
      if (Array.isArray(customEvent.detail)) {
        setAllProducts(customEvent.detail);
      } else {
        setAllProducts(getCachedProducts());
      }
    };

    const handleCategoriesUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<CategoryItem[]>;
      if (Array.isArray(customEvent.detail)) {
        setCategories(customEvent.detail);
      } else {
        setCategories(getCachedCategories());
      }
    };

    window.addEventListener(PRODUCTS_UPDATED_EVENT, handleProductsUpdated);
    window.addEventListener(CATEGORIES_UPDATED_EVENT, handleCategoriesUpdated);
    return () => {
      window.removeEventListener(PRODUCTS_UPDATED_EVENT, handleProductsUpdated);
      window.removeEventListener(CATEGORIES_UPDATED_EVENT, handleCategoriesUpdated);
    };
  }, []);

  // Compute all unique categories combining stored categories and products
  const uniqueCategories = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.categoryName, c.categoryId));
    allProducts.forEach((p) => {
      if (p.categoryName && !map.has(p.categoryName)) {
        map.set(p.categoryName, p.categoryId);
      }
    });
    return Array.from(map.entries()).map(([name, id]) => ({ categoryName: name, categoryId: id }));
  }, [categories, allProducts]);

  // Dynamically compute available UK Sizes directly from database products
  const allSizes = useMemo(() => {
    const sizeSet = new Set<string>();
    allProducts.forEach((p) => {
      if (p.prodetailSize) {
        const formatted = p.prodetailSize.toUpperCase().includes('UK')
          ? p.prodetailSize
          : `${p.prodetailSize} UK`;
        sizeSet.add(formatted);
      }
      if (Array.isArray(p.sizes)) {
        p.sizes.forEach((s: string) => {
          if (s) {
            const formatted = s.toUpperCase().includes('UK') ? s : `${s} UK`;
            sizeSet.add(formatted);
          }
        });
      }
    });

    return Array.from(sizeSet).sort((a, b) => {
      const numA = parseFloat(a) || 0;
      const numB = parseFloat(b) || 0;
      return numA - numB;
    });
  }, [allProducts]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.categoryName !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = product.proName.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.categoryName.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      // Size filter
      if (selectedSize !== 'all') {
        const hasSize =
          (Array.isArray(product.sizes) && product.sizes.includes(selectedSize)) ||
          product.prodetailSize === selectedSize;
        if (!hasSize) return false;
      }

      // Price filter
      if (selectedPriceRange === 'under-1800' && product.price >= 1800) return false;
      if (selectedPriceRange === '1800-2200' && (product.price < 1800 || product.price > 2200)) return false;
      if (selectedPriceRange === 'above-2200' && product.price <= 2200) return false;

      return true;
    });
  }, [allProducts, selectedCategory, searchQuery, selectedSize, selectedPriceRange]);

  const handleCategoryChange = (cat: CategoryFilter) => {
    setSelectedCategory(cat);
    if (cat === 'รองเท้าวิ่ง') setSearchParams({ category: 'running' });
    else if (cat === 'รองเท้าเดิน') setSearchParams({ category: 'walking' });
    else setSearchParams({});
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedSize('all');
    setSelectedPriceRange('all');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-['Prompt'] selection:bg-black selection:text-white">
      {/* 1. Navbar */}
      <Navbar />

      {/* Page Title & Breadcrumb */}
      <div className="bg-neutral-100 border-b-2 border-black py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-600 mb-1">
              <span>SADIDA</span>
              <span>/</span>
              <span className="text-black">แคตตาล็อกสินค้า</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-['Space_Grotesk']">
              {pageTitle}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold bg-white border-2 border-black px-4 py-2 rounded-xl shadow-[2px_2px_0px_#000000]">
            <Sparkles className="w-4 h-4" />
            <span>
              {uniqueCategories.length} หมวดหมู่สินค้า: {uniqueCategories.map((c) => c.categoryName).join(' & ')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content: 2-Column Wireframe Layout [Navbar Menu (Left) | Search & Grid (Right)] */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Navbar Menu (Sidebar filter matching wireframe) */}
          {showSidebar && (
            <aside className="lg:col-span-3 bg-white border-2 border-black rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[4px_4px_0px_#000000] sm:shadow-[6px_6px_0px_#000000] static lg:sticky lg:top-24 z-10 w-full">
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b-2 border-black mb-3 sm:mb-6">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="flex items-center gap-2 cursor-pointer lg:cursor-default"
                >
                  <Filter className="w-5 h-5 text-black" />
                  <h2 className="text-base font-black uppercase tracking-wider font-['Space_Grotesk']">
                    {sidebarTitle}
                  </h2>
                  <span className="lg:hidden text-[11px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 border border-black text-black">
                    {mobileFilterOpen ? 'ซ่อนตัวกรอง ▲' : 'เปิดตัวกรอง ▼'}
                  </span>
                </button>
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-neutral-600 hover:text-black flex items-center gap-1 cursor-pointer"
                  title="ล้างตัวกรอง"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>รีเซ็ต</span>
                </button>
              </div>

              {/* Filter Groups: Accordion on mobile, always visible on desktop */}
              <div className={`${mobileFilterOpen ? 'block' : 'hidden lg:block'} space-y-6 pt-1`}>
                {/* Filter Group 1: Category Menu */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-black block mb-3">
                    หมวดหมู่สินค้า
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                        selectedCategory === 'all'
                          ? 'bg-black text-white border-black shadow-[2px_2px_0px_#000000]'
                          : 'bg-white hover:bg-neutral-100 text-black border-black'
                      }`}
                    >
                      <span>สินค้าทั้งหมด</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${selectedCategory === 'all' ? 'bg-white text-black' : 'bg-neutral-200 text-black'}`}>
                        {allProducts.length}
                      </span>
                    </button>

                    {uniqueCategories.map((cat) => {
                      const count = allProducts.filter(
                        (p) => p.categoryName === cat.categoryName || p.categoryId === cat.categoryId
                      ).length;
                      const isSelected = selectedCategory === cat.categoryName;
                      return (
                        <button
                          key={cat.categoryId}
                          onClick={() => handleCategoryChange(cat.categoryName)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-black text-white border-black shadow-[2px_2px_0px_#000000]'
                              : 'bg-white hover:bg-neutral-100 text-black border-black'
                          }`}
                        >
                          <span className="truncate">{cat.categoryName}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] ${
                              isSelected ? 'bg-white text-black' : 'bg-neutral-200 text-black'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Filter Group 2: UK Size Filter */}
                <div className="pt-5 border-t-2 border-neutral-100">
                  <label className="text-xs font-black uppercase tracking-wider text-black block mb-3">
                    ขนาดรองเท้า (UK Size)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setSelectedSize('all')}
                      className={`py-1.5 px-2 text-xs font-mono font-bold rounded-lg border-2 transition-all cursor-pointer ${
                        selectedSize === 'all'
                          ? 'bg-black text-white border-black shadow-[2px_2px_0px_#000000]'
                          : 'bg-white hover:bg-neutral-100 text-black border-black'
                      }`}
                    >
                      ทั้งหมด
                    </button>
                    {allSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-1.5 px-2 text-xs font-mono font-bold rounded-lg border-2 transition-all cursor-pointer ${
                          selectedSize === size
                            ? 'bg-black text-white border-black shadow-[2px_2px_0px_#000000]'
                            : 'bg-white hover:bg-neutral-100 text-black border-black'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter Group 3: Price Range */}
                <div className="pt-5 border-t-2 border-neutral-100">
                  <label className="text-xs font-black uppercase tracking-wider text-black block mb-3">
                    ช่วงราคา
                  </label>
                  <div className="space-y-2 text-xs font-bold">
                    {[
                      { id: 'all', label: 'ทุกช่วงราคา' },
                      { id: 'under-1800', label: 'ต่ำกว่า ฿1,800' },
                      { id: '1800-2200', label: '฿1,800 - ฿2,200' },
                      { id: 'above-2200', label: 'มากกว่า ฿2,200' },
                    ].map((item) => (
                      <label 
                        key={item.id} 
                        className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-neutral-100 rounded-lg"
                      >
                        <input
                          type="radio"
                          name="priceRange"
                          checked={selectedPriceRange === item.id}
                          onChange={() => setSelectedPriceRange(item.id)}
                          className="accent-black w-4 h-4 cursor-pointer"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

            </aside>
          )}

          {/* RIGHT COLUMN: Search Bar & Product Grid matching wireframe */}
          {showProductGrid ? (
            <main className={`${showSidebar ? 'lg:col-span-9' : 'lg:col-span-12'} space-y-4 sm:space-y-6`}>
            
            {/* Top Right: Search Box "ค้นหา" */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 bg-neutral-50 border-2 border-black rounded-xl sm:rounded-2xl shadow-[3px_3px_0px_#000000] sm:shadow-[4px_4px_0px_#000000]">
              
              {/* Product Count & Filter Summary */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-black">
                <SlidersHorizontal className="w-4 h-4 flex-shrink-0" />
                <span>พบสินค้าทั้งหมด <strong className="font-black text-sm sm:text-base">{filteredProducts.length}</strong> รายการ</span>
              </div>

              {/* Search Bar matching wireframe [ค้นหา] */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหารองเท้า... (เช่น X1, วิ่ง, Classic)"
                  className="w-full bg-white border-2 border-black rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-black placeholder-neutral-500 font-medium focus:outline-none focus:shadow-[2px_2px_0px_#000000] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500 hover:text-black cursor-pointer"
                  >
                    ล้าง
                  </button>
                )}
              </div>

            </div>

            {/* Active Filter Tags */}
            {(selectedCategory !== 'all' || selectedSize !== 'all' || selectedPriceRange !== 'all' || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-neutral-600">ตัวกรองที่ใช้งาน:</span>
                {selectedCategory !== 'all' && (
                  <span className="px-3 py-1 bg-black text-white rounded-full font-bold flex items-center gap-1.5">
                    {selectedCategory}
                    <button onClick={() => handleCategoryChange('all')} className="cursor-pointer">×</button>
                  </span>
                )}
                {selectedSize !== 'all' && (
                  <span className="px-3 py-1 bg-white border-2 border-black rounded-full font-bold flex items-center gap-1.5">
                    ขนาด: {selectedSize}
                    <button onClick={() => setSelectedSize('all')} className="cursor-pointer">×</button>
                  </span>
                )}
                {searchQuery && (
                  <span className="px-3 py-1 bg-white border-2 border-black rounded-full font-bold flex items-center gap-1.5">
                    คำค้น: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="cursor-pointer">×</button>
                  </span>
                )}
              </div>
            )}

            {/* Product Cards Grid: 2 columns on mobile, 3 columns on desktop */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.proId}
                    product={product}
                    onSelect={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search State */
              <div className="py-20 text-center bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-3xl p-8">
                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-black mb-2">
                  {emptyMessage}
                </h3>
                <p className="text-sm text-neutral-600 mb-6">
                  ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองเพื่อดูรองเท้าทั้งหมด
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-3 bg-black text-white font-bold rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            )}

          </main>
          ) : (
            <div className={`${showSidebar ? 'lg:col-span-9' : 'lg:col-span-12'} py-20 text-center bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-3xl p-8`}>
              <h3 className="text-xl font-bold font-['Space_Grotesk'] text-black mb-2">
                ส่วนรายการสินค้าถูกซ่อนอยู่โดยผู้ดูแลระบบ
              </h3>
            </div>
          )}

        </div>
      </div>

      {/* 3. Footer */}
      <Footer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
