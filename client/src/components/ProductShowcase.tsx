import React, { useRef, useState, useEffect } from 'react';
import type { Product, CategoryFilter } from '../types';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight, SlidersHorizontal, Grid, Sparkles } from 'lucide-react';

interface ProductShowcaseProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  products,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Filter products by category
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.categoryName === selectedCategory;
  });

  // Track scroll progress to update custom wireframe scrollbar
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      return;
    }
    const progress = (scrollLeft / maxScroll) * 100;
    setScrollProgress(Math.min(100, Math.max(0, progress)));
  };

  useEffect(() => {
    handleScroll();
  }, [filteredProducts, viewMode]);

  // Scroll left/right buttons
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 370; // Roughly 1 card + gap
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="products" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Sadida Collection 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white uppercase font-['Space_Grotesk'] tracking-tight">
            สินค้าของแบรนด์ SADIDA
          </h2>
          <p className="mt-2 text-sm text-neutral-400 max-w-xl">
            เลือกช้อปรองเท้าคุณภาพสูง แบ่งออกเป็น 2 ประเภทหลัก ได้แก่ <strong className="text-white">รองเท้าวิ่ง</strong> สำหรับความเร็ว และ <strong className="text-white">รองเท้าเดิน</strong> สำหรับความสบายทุกวัน
          </p>
        </div>

        {/* Filter Tabs & View Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter Pills */}
          <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              ทั้งหมด ({products.length})
            </button>
            <button
              onClick={() => setSelectedCategory('รองเท้าวิ่ง')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                selectedCategory === 'รองเท้าวิ่ง'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              รองเท้าวิ่ง
            </button>
            <button
              onClick={() => setSelectedCategory('รองเท้าเดิน')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                selectedCategory === 'รองเท้าเดิน'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              รองเท้าเดิน
            </button>
          </div>

          {/* Toggle View Mode (Carousel vs Grid as in requirement) */}
          <div className="hidden sm:flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
            <button
              onClick={() => setViewMode('carousel')}
              className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'carousel'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="แสดงแบบสไลด์เลื่อน (ตามภาพร่าง)"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="แสดงแบบกริด (Grid Layout)"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Arrows for Carousel */}
          {viewMode === 'carousel' && (
            <div className="flex items-center gap-1.5 ml-1">
              <button
                onClick={() => scroll('left')}
                className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous Products"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-800 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next Products"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Main Display: Carousel (ตามภาพร่างที่มี 3 cards พร้อมแถบเลื่อน) vs Grid */}
      {viewMode === 'carousel' ? (
        <div className="relative">
          {/* Scrollable Container (3 cards per desktop view) */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto pb-4 smooth-scroll no-scrollbar select-none"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {filteredProducts.map((prod) => (
              <div key={prod.proId} style={{ scrollSnapAlign: 'start' }}>
                <ProductCard product={prod} onSelect={onSelectProduct} />
              </div>
            ))}
          </div>

          {/* Wireframe-matched Horizontal Scrollbar Track (แถบเลื่อนด้านล่างการ์ด 3 ใบ ตามรูปวาด) */}
          <div className="mt-6 flex flex-col gap-2">
            <div className="w-full h-3 bg-neutral-900 rounded-full border border-neutral-800 relative overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-neutral-400 to-white rounded-full transition-all duration-150 ease-out shadow-sm"
                style={{
                  width: `${Math.max(25, 100 / Math.max(1, filteredProducts.length - 2))}%`,
                  transform: `translateX(${scrollProgress * 2.5}%)`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
              <span>← เลื่อนซ้ายเพื่อดูรุ่นอื่น</span>
              <span>แสดง {filteredProducts.length} รายการ</span>
              <span>เลื่อนขวา →</span>
            </div>
          </div>
        </div>
      ) : (
        /* Grid Layout (เพื่อการปรับเปลี่ยนแบบ Grid ตาม requirement) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.proId} product={prod} onSelect={onSelectProduct} />
          ))}
        </div>
      )}

    </section>
  );
};
