import React, { useState } from 'react';
import type { Product } from '../types';
import { X, Check, Shield, Truck, RotateCcw, Sparkles } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.prodetailSize);
  const [orderedSuccess, setOrderedSuccess] = useState(false);

  const handleOrder = () => {
    setOrderedSuccess(true);
    setTimeout(() => {
      setOrderedSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl shadow-black text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image Box */}
          <div className="relative aspect-square md:aspect-auto bg-neutral-900 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-neutral-800">
            <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
            <img
              src={product.imageUrl}
              alt={product.proName}
              className="max-h-[300px] w-auto object-contain filter contrast-105 z-10 drop-shadow-2xl"
            />
            <div className="absolute bottom-4 left-4 z-20">
              <span className="px-3 py-1 rounded-md bg-white text-black text-xs font-bold uppercase">
                {product.categoryName}
              </span>
            </div>
          </div>

          {/* Right: Product Details & Controls */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Product ID & Badge */}
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                <span className="font-mono">รหัสสินค้า: {product.proId}</span>
                {product.badge && (
                  <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px] font-semibold">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
                {product.proName}
              </h3>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
                  ฿{product.price.toLocaleString()}
                </span>
                <span className="text-xs text-neutral-400">ราคารวมภาษีมูลค่าเพิ่มแล้ว</span>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                {product.description}
              </p>

              {/* Available Sizes (UK Size as configured in Drizzle ORM seed) */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-neutral-400 font-medium">เลือกขนาด (UK Size):</span>
                  <span className="text-neutral-500 font-mono">เลือกแล้ว: {selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 text-xs rounded-lg font-mono transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-white text-black font-bold shadow'
                          : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Perks */}
              <div className="mt-6 pt-4 border-t border-neutral-800/80 space-y-2 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-white" />
                  <span>จัดส่งฟรีทั่วประเทศแบบด่วนพิเศษ</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-white" />
                  <span>เปลี่ยนไซส์ได้ภายใน 7 วันหากใส่ไม่พอดี</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-white" />
                  <span>รับประกันของแท้ Sadida Official 100%</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6">
              {orderedSuccess ? (
                <div className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-sm flex items-center justify-center gap-2 animate-bounce">
                  <Check className="w-4 h-4" />
                  <span>ส่งคำสั่งสนใจสินค้าเรียบร้อย!</span>
                </div>
              ) : (
                <button
                  onClick={handleOrder}
                  className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-white/10 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>สนใจสั่งซื้อ / สอบถามไซส์ {selectedSize}</span>
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
