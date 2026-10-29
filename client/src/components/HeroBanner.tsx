import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroBannerProps {
  onExploreProducts?: () => void;
  onExploreBrand?: () => void;
  badge?: string;
  headline?: string;
  subtitle?: string;
  image?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreBrand,
  badge,
  headline,
  subtitle,
  image,
}) => {
  const activeBanner = 'sketch';

  return (
    <section id="hero" className="relative pt-6 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Banner Container - Framed with crisp black borders like the wireframe drawing */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-black bg-white shadow-[8px_8px_0px_#000000]">
        
        {/* Banner Mode Switcher (Sleek pill in top-right corner) */}
        {/* <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1 bg-white/90 backdrop-blur-md border-2 border-black rounded-full text-xs shadow-[2px_2px_0px_#000000]">
          <button
            onClick={() => setActiveBanner('sketch')}
            className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer font-bold ${
              activeBanner === 'sketch'
                ? 'bg-black text-white shadow-sm'
                : 'text-neutral-700 hover:text-black'
            }`}
          >
            ภาพสเก็ตช์คอนเซ็ปต์
          </button>
          <button
            onClick={() => setActiveBanner('panoramic')}
            className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer font-bold ${
              activeBanner === 'panoramic'
                ? 'bg-black text-white shadow-sm'
                : 'text-neutral-700 hover:text-black'
            }`}
          >
            แบนเนอร์สตูดิโอ
          </button>
        </div> */}

        {/* Hero Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px] lg:min-h-[520px]">
          
          {/* Left Column: Text & Story Branding */}
          <div className="lg:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col justify-between z-10 bg-white">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border-2 border-black text-xs font-bold tracking-wider text-black uppercase mb-6 shadow-[2px_2px_0px_#000000]">
                <Zap className="w-3.5 h-3.5 text-black fill-black" />
                <span>{badge || 'Sadida Concept Atelier'}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black uppercase font-['Space_Grotesk'] leading-[1.1]">
                {headline || (
                  <>
                    CRAFTED FOR <br />
                    <span className="text-black underline decoration-4 decoration-black">
                      PURE MOTION.
                    </span>
                  </>
                )}
              </h1>

              {/* Subtitle in Thai */}
              <p className="mt-5 text-sm sm:text-base text-neutral-700 font-normal leading-relaxed max-w-md">
                {subtitle || 'จากภาพร่างสเก็ตช์ในสตูดิโอ สู่นวัตกรรมรองเท้าวิ่งและรองเท้าเดินที่เรียบหรูเหนือกาลเวลา ผสานความเบาสบาย การยึดเกาะ และเอกลักษณ์โทนสีดำกับสีขาว'}
              </p>
            </div>

            {/* CTAs & Feature Points */}
            <div className="mt-8 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/products"
                  className="px-6 py-3.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-sm tracking-wide transition-all duration-200 flex items-center gap-2 border-2 border-black shadow-[4px_4px_0px_#000000] active:translate-y-0.5 group cursor-pointer"
                >
                  <span>สำรวจสินค้าทั้งหมด</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                {onExploreBrand ? (
                  <button
                    onClick={onExploreBrand}
                    className="px-5 py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-black border-2 border-black font-bold text-sm shadow-[3px_3px_0px_#000000] transition-all duration-200 cursor-pointer"
                  >
                    เรื่องราวแบรนด์ Sadida
                  </button>
                ) : (
                  <Link
                    to="/contact"
                    className="px-5 py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-black border-2 border-black font-bold text-sm shadow-[3px_3px_0px_#000000] transition-all duration-200 cursor-pointer"
                  >
                    ติดต่อเรา
                  </Link>
                )}
              </div>

              {/* 3 Key Spec Badges */}
              <div className="pt-6 border-t-2 border-neutral-100 grid grid-cols-3 gap-3 text-center sm:text-left">
                <div>
                  <div className="text-lg font-black text-black font-['Space_Grotesk']">2 TYPES</div>
                  <div className="text-[11px] text-neutral-600 font-medium">รองเท้าวิ่ง & เดิน</div>
                </div>
                <div>
                  <div className="text-lg font-black text-black font-['Space_Grotesk']">6-13 UK</div>
                  <div className="text-[11px] text-neutral-600 font-medium">ขนาดครอบคลุม</div>
                </div>
                <div>
                  <div className="text-lg font-black text-black font-['Space_Grotesk']">B & W</div>
                  <div className="text-[11px] text-neutral-600 font-medium">โทนดำกับขาว</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: High Quality Banner Media */}
          <div className="lg:col-span-7 relative min-h-[320px] lg:min-h-full overflow-hidden bg-neutral-100 border-t-2 lg:border-t-0 lg:border-l-2 border-black flex items-center justify-center">
            {activeBanner === 'sketch' ? (
              <div className="relative w-full h-full group">
                <img
                  src={image || '/images/hero_sketch.jpg'}
                  alt="Sadida Sneaker Designer Studio Sketching"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Floating Aesthetic Tag matching the sketch lightning sneaker concept */}
                {/* <div className="absolute bottom-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-black text-left max-w-xs shadow-[4px_4px_0px_#000000] hidden sm:block">
                  <div className="flex items-center gap-2 text-black font-black text-xs tracking-wider uppercase mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>The Design Process</span>
                  </div>
                  <p className="text-[11px] text-neutral-700 font-medium leading-normal">
                    ร่างแบบด้วยมือสู่ต้นแบบจริง ผลิตขึ้นเพื่อตอบโจทย์ทั้งการเคลื่อนไหวและสไตล์สีดำกับสีขาว
                  </p>
                </div> */}
              </div>
            ) : (
              <div className="relative w-full h-full group">
                <img
                  src="/banner.jpg"
                  alt="Sadida Footwear Hero Banner"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
