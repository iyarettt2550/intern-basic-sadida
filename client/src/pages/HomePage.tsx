import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroBanner } from '../components/HeroBanner';
import { ProductShowcase } from '../components/ProductShowcase';
import { BrandStory } from '../components/BrandStory';
import { Footer } from '../components/Footer';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { initialProducts } from '../data/mockProducts';
import type { Product } from '../types';
import { Sliders } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [products] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modular Grid / Section Order state (ตาม Requirement ที่ระบุให้สลับ/แก้องค์ประกอบได้)
  const [sectionOrder, setSectionOrder] = useState<string[]>(['hero', 'products', 'brand']);
  const [showGridManager, setShowGridManager] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reordering helpers for demonstration of grid rearrangement
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setSectionOrder(newOrder);
  };

  // Section labels
  const sectionLabels: Record<string, string> = {
    hero: '1. แบนเนอร์ภาพสเก็ตช์ & โปรโมท (Hero Banner)',
    products: '2. แถบเลื่อนสินค้ารองเท้า 3 Cards (Product Carousel)',
    brand: '3. ปรัชญาแบรนด์ขาว-ดำ & 2 ประเภทสินค้า (Brand Story)',
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-['Prompt'] selection:bg-white selection:text-black">
      
      {/* 1. Header / Navbar Navigation */}
      <Navbar onNavigateSection={scrollToSection} />

      {/* Grid Layout Rearranger Float Widget (สาธิตฟังก์ชันสลับองค์ประกอบแบบ Grid สำหรับแอดมินตาม requirement) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowGridManager(!showGridManager)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-black font-semibold text-xs shadow-2xl hover:bg-neutral-200 transition-all border border-neutral-300 cursor-pointer"
          title="เครื่องมือสลับองค์ประกอบแบบ Grid"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>จัดเลย์เอาต์ Grid (Admin Preview)</span>
        </button>

        {showGridManager && (
          <div className="absolute bottom-12 right-0 w-80 bg-neutral-950 border border-neutral-700 rounded-2xl p-4 shadow-2xl text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <span className="font-bold text-white uppercase font-['Space_Grotesk']">
                จัดการบล็อกองค์ประกอบ
              </span>
              <span className="text-[10px] text-neutral-400">สำหรับเจ้าของร้าน</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              สลับลำดับบล็อกในหน้าแรกได้ทันทีโดยไม่ต้องเขียนโค้ดใหม่:
            </p>
            <div className="space-y-2">
              {sectionOrder.map((sectionId, idx) => (
                <div 
                  key={sectionId}
                  className="flex items-center justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800"
                >
                  <span className="text-neutral-200 truncate">{sectionLabels[sectionId]}</span>
                  <div className="flex items-center gap-1">
                    <button
                      disabled={idx === 0}
                      onClick={() => moveSection(idx, 'up')}
                      className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-white"
                      title="เลื่อนขึ้น"
                    >
                      ↑
                    </button>
                    <button
                      disabled={idx === sectionOrder.length - 1}
                      onClick={() => moveSection(idx, 'down')}
                      className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-white"
                      title="เลื่อนลง"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area - Rendered Dynamically based on Section Order */}
      <main className="flex-grow">
        {sectionOrder.map((sectionId) => {
          if (sectionId === 'hero') {
            return (
              <HeroBanner
                key="hero"
                onExploreProducts={() => scrollToSection('products')}
                onExploreBrand={() => scrollToSection('brand')}
              />
            );
          }
          if (sectionId === 'products') {
            return (
              <ProductShowcase
                key="products"
                products={products}
                onSelectProduct={(product) => setSelectedProduct(product)}
              />
            );
          }
          if (sectionId === 'brand') {
            return <BrandStory key="brand" />;
          }
          return null;
        })}
      </main>

      {/* 4. Footer Matching Wireframe */}
      <Footer 
        onScrollToTop={scrollToTop} 
        onNavigateSection={scrollToSection} 
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

    </div>
  );
};
