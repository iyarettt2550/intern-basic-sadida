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
      className="group relative flex flex-col bg-white rounded-xl sm:rounded-2xl border-2 border-black overflow-hidden shadow-[3px_3px_0px_#000000] sm:shadow-[4px_4px_0px_#000000] hover:shadow-[5px_5px_0px_#000000] sm:hover:shadow-[7px_7px_0px_#000000] hover:-translate-y-0.5 sm:hover:-translate-y-1 transition-all duration-200 cursor-pointer flex-shrink-0 w-full"
    >
      {/* Top Image Box */}
      <div className="relative aspect-square sm:aspect-[4/3] bg-neutral-100 overflow-hidden p-3 sm:p-6 flex items-center justify-center border-b-2 border-black">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-grid-light opacity-50 pointer-events-none" />

        {/* Product Image */}
        <img
          src={product.imageUrl}
          alt={product.proName}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-108 group-hover:-rotate-2 transition-transform duration-300 ease-out z-10"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 flex flex-col gap-1 sm:gap-1.5">
          <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[11px] font-black tracking-wider rounded sm:rounded-md bg-black text-white uppercase border border-black shadow-sm">
            {product.categoryName}
          </span>
          {product.badge && (
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-wide rounded-md bg-white text-black border border-black shadow-sm">
              {product.badge}
            </span>
          )}
        </div>

        {/* Size Badge */}
        {product.prodetailSize && (
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded bg-white border border-black text-[9px] sm:text-[11px] font-mono font-bold text-black shadow-sm">
            ไซส์ {product.prodetailSize}
          </div>
        )}

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex items-center justify-center z-20">
          <span className="px-4 py-2 rounded-full bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform border border-black">
            <Eye className="w-3.5 h-3.5" />
            ดูรายละเอียด
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-2.5 sm:p-5 flex flex-col flex-grow justify-between bg-white text-black">
        <div>
          {/* Category breadcrumb */}
          <div className="hidden sm:flex items-center justify-between text-xs text-neutral-600 mb-1.5 font-medium">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-black" />
              {isRunning ? 'Performance Running' : 'Daily Walking'}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-xs sm:text-lg font-bold text-black group-hover:text-neutral-800 transition-colors line-clamp-1 font-['Space_Grotesk'] leading-tight">
            {product.proName}
          </h3>

          {/* Product Description */}
          <p className="hidden sm:block mt-2 text-xs sm:text-sm text-neutral-600 font-normal line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Footer: Price & Action */}
        <div className="mt-2.5 sm:mt-5 pt-2 sm:pt-4 border-t border-neutral-100 sm:border-t-2 flex items-center justify-between gap-1">
          <div>
            <span className="text-[9px] sm:text-[10px] text-neutral-500 uppercase font-bold tracking-wider block leading-tight">ราคาเริ่มต้น</span>
            <span className="text-sm sm:text-xl font-black text-black font-['Space_Grotesk'] leading-tight">
              ฿{product.price.toLocaleString()}
            </span>
          </div>

          <button 
            type="button"
            className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-black group-hover:bg-neutral-800 text-white flex items-center justify-center transition-all duration-200 border-2 border-black shadow-[1px_1px_0px_#000000] sm:shadow-[2px_2px_0px_#000000]"
            aria-label="View product details"
          >
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
