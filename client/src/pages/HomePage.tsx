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
    <div className="min-h-screen bg-white text-black flex flex-col font-['Prompt'] selection:bg-black selection:text-white">
      
      {/* 1. Header / Navbar Navigation */}
      <Navbar />

      {/* Grid Layout Rearranger Float Widget (สาธิตฟังก์ชันสลับองค์ประกอบแบบ Grid สำหรับแอดมินตาม requirement) */}
      

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
      <Footer onScrollToTop={scrollToTop} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

    </div>
  );
};
