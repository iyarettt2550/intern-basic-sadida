import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroBanner } from '../components/HeroBanner';
import { ProductShowcase } from '../components/ProductShowcase';
import { BrandStory } from '../components/BrandStory';
import { Footer } from '../components/Footer';
import { ProductDetailModal } from '../components/ProductDetailModal';
import type { Product } from '../types';
import { getCachedProducts, loadAllProducts, PRODUCTS_UPDATED_EVENT } from '../utils/productStore';

import { useWebsiteConfig, DEFAULT_PAGES, type SectionItem } from '../config/websiteConfig';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { getPage } = useWebsiteConfig();
  const homePage = getPage('home');

  useEffect(() => {
    loadAllProducts().then((p) => {
      if (Array.isArray(p)) setProducts(p);
    });

    const handleProductsUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<Product[]>;
      if (Array.isArray(customEvent.detail)) {
        setProducts(customEvent.detail);
      } else {
        setProducts(getCachedProducts());
      }
    };

    window.addEventListener(PRODUCTS_UPDATED_EVENT, handleProductsUpdated);
    return () => window.removeEventListener(PRODUCTS_UPDATED_EVENT, handleProductsUpdated);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sections: SectionItem[] =
    homePage?.sections || DEFAULT_PAGES.find((p) => p.id === 'home')?.sections || [];

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-['Prompt'] selection:bg-black selection:text-white">
      
      {/* 1. Header / Navbar Navigation */}
      <Navbar />

      {/* Main Content Area - Rendered Dynamically based on Section Order */}
      <main className="flex-grow">
        {sections.map((section) => {
          if (!section.visible) return null;
          if (section.id === 'hero') {
            return (
              <HeroBanner
                key="hero"
                badge={section.texts?.badge}
                headline={section.texts?.headline}
                subtitle={section.texts?.subtitle}
                image={section.image}
                onExploreProducts={() => scrollToSection('products')}
                onExploreBrand={() => scrollToSection('brand')}
              />
            );
          }
          if (section.id === 'products') {
            return (
              <ProductShowcase
                key="products"
                title={section.texts?.title}
                subtitle={section.texts?.subtitle}
                badge={section.texts?.badge}
                selectedProductIds={section.selectedProductIds}
                products={products}
                onSelectProduct={(product) => setSelectedProduct(product)}
              />
            );
          }
          if (section.id === 'brand') {
            return (
              <BrandStory
                key="brand"
                title={section.texts?.title}
                description={section.texts?.description}
              />
            );
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
