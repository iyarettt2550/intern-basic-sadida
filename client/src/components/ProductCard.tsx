import React from 'react';
import type { Product } from '../types';
import { ArrowUpRight, Eye, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const isRunning = product.categoryName.includes('วิ่ง');

  return (
    <div 
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-neutral-900/90 rounded-2xl border border-neutral-800 overflow-hidden hover:border-neutral-500 hover:shadow-2xl hover:shadow-white/5 transition-all duration-300 cursor-pointer flex-shrink-0 w-[300px] sm:w-[320px] md:w-[350px]"
    >
      {/* Top Image Box */}
      <div className="relative aspect-[4/3] bg-neutral-950 overflow-hidden p-4 flex items-center justify-center">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        {/* Product Image */}
        <img
          src={product.imageUrl}
          alt={product.proName}
          loading="lazy"
          className="w-full h-full object-contain filter contrast-105 group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-500 ease-out z-10"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wider rounded-md bg-white text-black uppercase shadow">
            {product.categoryName}
          </span>
          {product.badge && (
            <span className="px-2.5 py-0.5 text-[10px] font-medium tracking-wide rounded-md bg-neutral-800 text-neutral-300 border border-neutral-700">
              {product.badge}
            </span>
          )}
        </div>

        {/* Size Badge */}
        <div className="absolute bottom-3 right-3 z-20 px-2 py-1 rounded bg-black/80 backdrop-blur-sm border border-neutral-800 text-[11px] font-mono text-neutral-300">
          ไซส์แนะนำ {product.prodetailSize}
        </div>

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
          <span className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            ดูรายละเอียด
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-neutral-900">
        <div>
          {/* Category breadcrumb */}
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-neutral-500" />
              {isRunning ? 'Performance Running' : 'Daily Walking'}
            </span>
            <span className="text-neutral-500 font-mono">{product.proId}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-neutral-200 transition-colors line-clamp-1 font-['Space_Grotesk']">
            {product.proName}
          </h3>

          {/* Product Description */}
          <p className="mt-2 text-xs sm:text-sm text-neutral-400 font-light line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Footer: Price & Action */}
        <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">ราคาเริ่มต้น</span>
            <span className="text-lg sm:text-xl font-extrabold text-white font-['Space_Grotesk']">
              ฿{product.price.toLocaleString()}
            </span>
          </div>

          <button 
            type="button"
            className="w-9 h-9 rounded-full bg-neutral-800 group-hover:bg-white text-neutral-300 group-hover:text-black flex items-center justify-center transition-all duration-200 border border-neutral-700 group-hover:border-white"
            aria-label="View product details"
          >
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
