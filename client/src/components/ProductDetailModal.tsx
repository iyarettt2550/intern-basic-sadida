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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-white border-2 border-black rounded-3xl overflow-hidden shadow-[10px_10px_0px_#000000] text-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white border-2 border-black text-black hover:bg-neutral-100 flex items-center justify-center transition-colors shadow-[2px_2px_0px_#000000] cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image Box */}
          <div className="relative aspect-square md:aspect-auto bg-neutral-100 p-8 flex items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-black">
            <div className="absolute inset-0 bg-grid-light opacity-60 pointer-events-none" />
            <img
              src={product.imageUrl}
              alt={product.proName}
              className="max-h-[300px] w-auto object-contain z-10 drop-shadow-xl"
            />
            <div className="absolute bottom-4 left-4 z-20">
              <span className="px-3 py-1 rounded-md bg-black text-white text-xs font-bold uppercase shadow-sm">
                {product.categoryName}
              </span>
            </div>
          </div>

          {/* Right: Product Details & Controls */}
          <div className="p-6 sm:p-8 flex flex-col justify-between bg-white">
            <div>
              {/* Product ID & Badge */}
              <div className="flex items-center justify-between text-xs text-neutral-600 mb-2">
                <span className="font-mono font-bold">รหัสสินค้า: {product.proId}</span>
                {product.badge && (
                  <span className="px-2 py-0.5 rounded bg-neutral-100 text-black border border-black text-[10px] font-bold">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-black font-['Space_Grotesk'] text-black">
                {product.proName}
              </h3>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-black font-['Space_Grotesk']">
                  ฿{product.price.toLocaleString()}
                </span>
                <span className="text-xs text-neutral-500">ราคารวมภาษีมูลค่าเพิ่มแล้ว</span>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-neutral-700 font-normal leading-relaxed">
                {product.description}
              </p>

              {/* Available Sizes (UK Size as configured in Drizzle ORM seed) */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-black font-bold">เลือกขนาด (UK Size):</span>
                  <span className="text-neutral-600 font-mono font-bold">เลือกแล้ว: {selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 text-xs rounded-lg font-mono font-bold transition-all cursor-pointer border-2 ${
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

              {/* Perks */}
              <div className="mt-6 pt-4 border-t-2 border-neutral-100 space-y-2 text-xs text-neutral-700">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-black" />
                  <span>จัดส่งฟรีทั่วประเทศแบบด่วนพิเศษ</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-black" />
                  <span>เปลี่ยนไซส์ได้ภายใน 7 วันหากใส่ไม่พอดี</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-black" />
                  <span>รับประกันของแท้ Sadida Official 100%</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6">
              {orderedSuccess ? (
                <div className="w-full py-3.5 rounded-xl bg-black text-white font-bold text-sm flex items-center justify-center gap-2 border-2 border-black animate-bounce">
                  <Check className="w-4 h-4" />
                  <span>ส่งคำสั่งสนใจสินค้าเรียบร้อย!</span>
                </div>
              ) : (
                <button
                  onClick={handleOrder}
                  className="w-full py-3.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 border-2 border-black shadow-[4px_4px_0px_#000000] active:translate-y-0.5 cursor-pointer"
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
