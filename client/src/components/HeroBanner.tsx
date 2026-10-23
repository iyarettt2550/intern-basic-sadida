import React, { useState } from 'react';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

interface HeroBannerProps {
  onExploreProducts: () => void;
  onExploreBrand: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreProducts,
  onExploreBrand,
}) => {
  // Allows user/admin to preview alternate banner (sketch concept vs studio panoramic banner)
  const [activeBanner, setActiveBanner] = useState<'sketch' | 'panoramic'>('sketch');

  return (
    <section id="hero" className="relative pt-6 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Banner Container - Framed like the wireframe drawing */}
      <div className="relative rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-2xl shadow-black/80">
        
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-neutral-800/20 rounded-full blur-3xl pointer-events-none" />

        {/* Banner Mode Switcher (Sleek pill in top-right corner) */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1 bg-black/70 backdrop-blur-md border border-neutral-800 rounded-full text-xs text-neutral-300">
          <button
            onClick={() => setActiveBanner('sketch')}
            className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${
              activeBanner === 'sketch'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'hover:text-white'
            }`}
          >
            ภาพสเก็ตช์คอนเซ็ปต์
          </button>
          <button
            onClick={() => setActiveBanner('panoramic')}
            className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer ${
              activeBanner === 'panoramic'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'hover:text-white'
            }`}
          >
            แบนเนอร์สตูดิโอ
          </button>
        </div>

        {/* Hero Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px] lg:min-h-[540px]">
          
          {/* Left Column: Text & Story Branding */}
          <div className="lg:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col justify-between z-10 bg-gradient-to-t lg:bg-gradient-to-r from-neutral-950 via-neutral-950/95 to-transparent">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-700/80 text-xs font-semibold tracking-wider text-neutral-300 uppercase mb-6">
                <Zap className="w-3.5 h-3.5 text-white fill-white" />
                <span>Sadida Concept Atelier</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase font-['Space_Grotesk'] leading-[1.1]">
                CRAFTED FOR <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-300 to-neutral-500">
                  PURE MOTION.
                </span>
              </h1>

              {/* Subtitle in Thai */}
              <p className="mt-5 text-sm sm:text-base text-neutral-400 font-light leading-relaxed max-w-md">
                จากภาพร่างสเก็ตช์ในสตูดิโอ สู่นวัตกรรมรองเท้าวิ่งและรองเท้าเดินที่เรียบหรูเหนือกาลเวลา 
                ผสานความเบาสบาย การยึดเกาะ และอัตลักษณ์โมโนโครม ขาว-ดำ
              </p>
            </div>

            {/* CTAs & Feature Points */}
            <div className="mt-8 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onExploreProducts}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-sm tracking-wide transition-all duration-200 flex items-center gap-2 shadow-lg shadow-white/10 group cursor-pointer"
                >
                  <span>สำรวจสินค้าทั้งหมด</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onExploreBrand}
                  className="px-5 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700 font-medium text-sm transition-all duration-200 cursor-pointer"
                >
                  เรื่องราวแบรนด์ Sadida
                </button>
              </div>

              {/* 3 Key Spec Badges */}
              <div className="pt-6 border-t border-neutral-800/80 grid grid-cols-3 gap-3 text-center sm:text-left">
                <div>
                  <div className="text-lg font-bold text-white font-['Space_Grotesk']">2 TYPES</div>
                  <div className="text-[11px] text-neutral-500">รองเท้าวิ่ง & เดิน</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-white font-['Space_Grotesk']">6-13 UK</div>
                  <div className="text-[11px] text-neutral-500">ขนาดครอบคลุม</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-white font-['Space_Grotesk']">B & W</div>
                  <div className="text-[11px] text-neutral-500">โทนขาวดำคลาสสิก</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: High Quality Banner Media */}
          <div className="lg:col-span-7 relative min-h-[320px] lg:min-h-full overflow-hidden bg-neutral-900 flex items-center justify-center">
            {activeBanner === 'sketch' ? (
              <div className="relative w-full h-full group">
                <img
                  src="/images/hero_sketch.jpg"
                  alt="Sadida Sneaker Designer Studio Sketching"
                  className="w-full h-full object-cover object-center filter grayscale contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/30 lg:hidden" />
                
                {/* Floating Aesthetic Tag matching the sketch lightning sneaker concept */}
                <div className="absolute bottom-6 right-6 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-neutral-700 text-left max-w-xs shadow-xl hidden sm:block">
                  <div className="flex items-center gap-2 text-white font-semibold text-xs tracking-wider uppercase mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>The Design Process</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    ร่างแบบด้วยมือสู่ต้นแบบจริง ผลิตขึ้นเพื่อตอบโจทย์ทั้งการเคลื่อนไหวและความงามมินิมอล
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full group">
                <img
                  src="/banner.jpg"
                  alt="Sadida Footwear Hero Banner"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/30 lg:hidden" />
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
