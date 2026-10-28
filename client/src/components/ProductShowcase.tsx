import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { Product, CategoryFilter } from '../types';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight, SlidersHorizontal, Grid, Sparkles, ArrowRight, GripVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductShowcaseProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  title?: string;
  subtitle?: string;
  badge?: string;
  selectedProductIds?: string[];
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  products,
  onSelectProduct,
  title,
  subtitle,
  badge,
  selectedProductIds,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Dragging states
  const [isDraggingThumb, setIsDraggingThumb] = useState<boolean>(false);
  const [isDraggingCards, setIsDraggingCards] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollStartX, setScrollStartX] = useState<number>(0);

  // Cached dimensions
  const thumbWidthPercentRef = useRef<number>(30);
  const [thumbWidthPercent] = useState<number>(30);

  // Filter products by selected IDs first (if configured), then by category
  const baseProducts =
    selectedProductIds && selectedProductIds.length > 0
      ? products.filter((p) => selectedProductIds.includes(p.proId))
      : products;

  // Extract all unique categories dynamically from base products
  const availableCategories = React.useMemo(() => {
    const set = new Set<string>();
    baseProducts.forEach((p) => {
      if (p.categoryName) set.add(p.categoryName);
    });
    return Array.from(set);
  }, [baseProducts]);

  const filteredProducts = baseProducts.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.categoryName === selectedCategory;
  });

  // Calculate and apply thumb position directly to DOM for silky smooth 60/120fps
  const updateThumbPosition = useCallback(() => {
    if (!scrollContainerRef.current || !thumbRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    
    if (maxScroll <= 0) {
      thumbRef.current.style.width = '100%';
      thumbRef.current.style.transform = 'translateX(0%)';
      return;
    }

    // Dynamic thumb width based on visible ratio (between 20% and 50%)
    const visibleRatio = clientWidth / scrollWidth;
    const thumbW = Math.max(20, Math.min(50, visibleRatio * 100));
    thumbWidthPercentRef.current = thumbW;
    thumbRef.current.style.width = `${thumbW}%`;

    // Position of thumb
    const progress = Math.max(0, Math.min(1, scrollLeft / maxScroll));
    const maxThumbLeft = 100 - thumbW;
    const thumbLeft = progress * maxThumbLeft;

    // Use transform for hardware-accelerated GPU positioning
    thumbRef.current.style.left = `${thumbLeft}%`;
  }, []);

  useEffect(() => {
    updateThumbPosition();
    const handleResize = () => updateThumbPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [filteredProducts, viewMode, updateThumbPosition]);

  // Scroll left/right buttons by roughly 1 card width
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.style.scrollBehavior = 'smooth';
    const cardWidth = 370;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    });
  };

  // Scroll to proportion without lag
  const scrollToRatio = (ratio: number, smooth = false) => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.style.scrollBehavior = smooth ? 'smooth' : 'auto';
    const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
    const clampedRatio = Math.max(0, Math.min(1, ratio));
    scrollContainerRef.current.scrollLeft = clampedRatio * maxScroll;
  };

  // Handle pointer down on the scrollbar track or thumb
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    setIsDraggingThumb(true);
    
    // Disable smooth scroll during drag so movement is 1:1 instant
    scrollContainerRef.current.style.scrollBehavior = 'auto';
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const thumbWidthPx = (thumbWidthPercentRef.current / 100) * rect.width;
    const availableTrack = rect.width - thumbWidthPx;
    const ratio = availableTrack > 0 ? (clickX - thumbWidthPx / 2) / availableTrack : clickX / rect.width;
    scrollToRatio(ratio, false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingThumb || !trackRef.current || !scrollContainerRef.current) return;
    
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const clientX = e.clientX;

    rafRef.current = requestAnimationFrame(() => {
      if (!trackRef.current || !scrollContainerRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const thumbWidthPx = (thumbWidthPercentRef.current / 100) * rect.width;
      const availableTrack = rect.width - thumbWidthPx;
      const ratio = availableTrack > 0 ? (clickX - thumbWidthPx / 2) / availableTrack : clickX / rect.width;
      scrollToRatio(ratio, false);
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDraggingThumb(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.scrollBehavior = 'smooth';
    }
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Mouse Drag-to-scroll on cards row
  const handleCardsMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDraggingCards(true);
    scrollContainerRef.current.style.scrollBehavior = 'auto';
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollStartX(scrollContainerRef.current.scrollLeft);
  };

  const handleCardsMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingCards || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    scrollContainerRef.current.scrollLeft = scrollStartX - walk;
  };

  const handleCardsMouseUpOrLeave = () => {
    setIsDraggingCards(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.scrollBehavior = 'smooth';
    }
  };

  return (
    <section id="products" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-black uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>{badge || 'Sadida Collection 2026'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black uppercase font-['Space_Grotesk'] tracking-tight">
            {title || 'สินค้าของแบรนด์ SADIDA'}
          </h2>
          <p className="mt-2 text-sm text-neutral-600 max-w-xl font-normal">
            {subtitle || (
              <>
                เลือกช้อปรองเท้าคุณภาพสูง แบ่งออกเป็น 2 ประเภทหลัก ได้แก่ <strong className="text-black">รองเท้าวิ่ง</strong> สำหรับความเร็ว และ <strong className="text-black">รองเท้าเดิน</strong> สำหรับความสบายทุกวัน
              </>
            )}
          </p>
        </div>

        {/* Filter Tabs & View Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center p-1 bg-white border-2 border-black rounded-2xl shadow-[3px_3px_0px_#000000]">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
              }`}
            >
              ทั้งหมด ({baseProducts.length})
            </button>
            {availableCategories.map((catName) => (
              <button
                key={catName}
                onClick={() => setSelectedCategory(catName)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  selectedCategory === catName
                    ? 'bg-black text-white shadow-sm'
                    : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
                }`}
              >
                {catName}
              </button>
            ))}
          </div>

          {/* Toggle View Mode */}
          <div className="hidden sm:flex items-center p-1 bg-white border-2 border-black rounded-2xl shadow-[3px_3px_0px_#000000]">
            <button
              onClick={() => setViewMode('carousel')}
              className={`p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                viewMode === 'carousel'
                  ? 'bg-black text-white'
                  : 'text-neutral-600 hover:text-black'
              }`}
              title="แสดงแบบสไลด์เลื่อน 3 การ์ด (ตามภาพร่าง)"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-black text-white'
                  : 'text-neutral-600 hover:text-black'
              }`}
              title="แสดงแบบกริด (Grid Layout)"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Display: Carousel vs Grid */}
      {viewMode === 'carousel' ? (
        <div className="relative">
          {/* Scrollable Container (3 cards per desktop view) */}
          <div
            ref={scrollContainerRef}
            onScroll={updateThumbPosition}
            onMouseDown={handleCardsMouseDown}
            onMouseMove={handleCardsMouseMove}
            onMouseUp={handleCardsMouseUpOrLeave}
            onMouseLeave={handleCardsMouseUpOrLeave}
            className={`flex items-stretch gap-6 overflow-x-auto pb-4 pt-1 no-scrollbar select-none ${
              isDraggingCards ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              scrollBehavior: 'smooth',
            }}
          >
            {filteredProducts.map((prod) => (
              <div key={prod.proId} className="w-[300px] sm:w-[320px] md:w-[360px] flex-shrink-0 flex flex-col">
                <ProductCard product={prod} onSelect={onSelectProduct} />
              </div>
            ))}
          </div>

          {/* Wireframe-matched Horizontal Scrollbar Track & Controls (ลื่นไหล ไม่หน่วง 100%) */}
          <div className="mt-8 flex flex-col gap-3">
            <div className="flex items-center gap-3 w-full">
              {/* Left Arrow Button */}
              <button
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full bg-white border-2 border-black text-black hover:bg-black hover:text-white flex items-center justify-center transition-all shadow-[2px_2px_0px_#000000] active:translate-y-0.5 cursor-pointer flex-shrink-0"
                aria-label="เลื่อนซ้าย"
                title="เลื่อนซ้าย"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Interactive Draggable Scrollbar Track (วงสีแดงตามภาพ) */}
              <div
                ref={trackRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="flex-grow h-7 bg-neutral-100 rounded-full border-2 border-black relative p-1 shadow-[3px_3px_0px_#000000] cursor-pointer touch-none select-none overflow-hidden"
                title="คลิกหรือลากลูกเลื่อนสีดำเพื่อเลื่อนดูสินค้า"
              >
                {/* Draggable Black Thumb: transitions disabled during drag for 0ms lag */}
                <div
                  ref={thumbRef}
                  className={`absolute top-1 bottom-1 bg-black rounded-full flex items-center justify-center border border-neutral-700 shadow-md ${
                    isDraggingThumb 
                      ? 'cursor-grabbing transition-none' 
                      : 'cursor-grab transition-all duration-150 ease-out hover:bg-neutral-800'
                  }`}
                  style={{
                    width: `${thumbWidthPercent}%`,
                    left: '0%',
                  }}
                >
                  <GripVertical className="w-4 h-4 text-white opacity-70" />
                </div>
              </div>

              {/* Right Arrow Button */}
              <button
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full bg-white border-2 border-black text-black hover:bg-black hover:text-white flex items-center justify-center transition-all shadow-[2px_2px_0px_#000000] active:translate-y-0.5 cursor-pointer flex-shrink-0"
                aria-label="เลื่อนขวา"
                title="เลื่อนขวา"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Helper Labels Below Track */}
            <div className="flex items-center justify-between text-xs text-neutral-600 font-mono font-bold px-1">
              <span>← กดปุ่ม หรือคลิกลากลูกเลื่อน</span>
              <Link to="/products" className="text-black underline font-bold flex items-center gap-1 hover:text-neutral-700">
                <span>เปิดดูสินค้าทั้งหมดในสโตร์</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span>เลื่อนดูเพิ่มเติม →</span>
            </div>
          </div>
        </div>
      ) : (
        /* Grid Layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.proId} product={prod} onSelect={onSelectProduct} />
          ))}
        </div>
      )}

    </section>
  );
};
