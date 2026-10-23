import React from 'react';
import { ShieldCheck, Wind, Feather, Footprints, Award, RefreshCw } from 'lucide-react';

export const BrandStory: React.FC = () => {
  return (
    <section id="brand" className="py-16 sm:py-20 border-t border-neutral-900 bg-neutral-950/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 uppercase tracking-widest mb-3">
            <Award className="w-3.5 h-3.5 text-white" />
            <span>SADIDA PHILOSOPHY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase font-['Space_Grotesk'] tracking-tight">
            ทำไมต้องเป็นโทนสีขาว-ดำ ของ SADIDA?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            เราตัดทอนสีสันที่ไม่จำเป็นออก เพื่อให้คุณสัมผัสกับโครงสร้างที่แท้จริงของรองเท้า 
            เส้นสายที่คมชัด วัสดุเกรดพรีเมียม และสมรรถนะในการขับเคลื่อนที่พร้อมรับทุกสถานการณ์
          </p>
        </div>

        {/* 2 Core Footwear Categories Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* 01 รองเท้าวิ่ง (Running) */}
          <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 hover:border-neutral-600 transition-all duration-300 group overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-7xl font-extrabold text-neutral-800/40 select-none font-['Space_Grotesk']">
              01
            </div>
            
            <div className="relative z-10">
              <span className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider inline-block mb-4">
                หมวดหมู่ที่ 1
              </span>
              <h3 className="text-2xl font-bold text-white font-['Space_Grotesk'] mb-3">
                รองเท้าวิ่ง (Performance Running)
              </h3>
              <p className="text-sm text-neutral-400 font-light leading-relaxed mb-6">
                ออกแบบสำหรับผู้ที่หลงใหลในความเร็วและระยะทาง โฟมพื้นรองเท้าลิขสิทธิ์คืนพลังงานสูง 
                ผ้าระบายอากาศตาข่ายไร้รอยต่อ และน้ำหนักที่เบาเสมือนไม่ได้สวมใส่
              </p>

              <ul className="space-y-2.5 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-white" />
                  <span>Aeroflow Breathable Mesh - ระบายเหงื่อรวดเร็ว</span>
                </li>
                <li className="flex items-center gap-2">
                  <Feather className="w-4 h-4 text-white" />
                  <span>Ultralight Cushioning - ซับแรงกระแทกเข่าและข้อเท้า</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>พื้นยาง Carbon Grip ยึดเกาะทุกสภาพพื้นผิว</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 02 รองเท้าเดิน (Walking) */}
          <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 hover:border-neutral-600 transition-all duration-300 group overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-7xl font-extrabold text-neutral-800/40 select-none font-['Space_Grotesk']">
              02
            </div>

            <div className="relative z-10">
              <span className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-bold uppercase tracking-wider inline-block mb-4">
                หมวดหมู่ที่ 2
              </span>
              <h3 className="text-2xl font-bold text-white font-['Space_Grotesk'] mb-3">
                รองเท้าเดิน (Urban Walking)
              </h3>
              <p className="text-sm text-neutral-400 font-light leading-relaxed mb-6">
                ออกแบบเพื่อการใช้ชีวิตในเมืองและการเดินตลอดทั้งวัน หนังนุ่มคุณภาพสูงปรับเข้ากับรูปเท้า 
                ทรงคลาสสิกแมตช์ได้กับทุกชุด พร้อมแผ่นรองเท้าซัพพอร์ตอุ้งเท้าตามหลักสรีรศาสตร์
              </p>

              <ul className="space-y-2.5 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <Footprints className="w-4 h-4 text-white" />
                  <span>Ergonomic Arch Support - เดิน 10,000 ก้าวไม่เมื่อยล้า</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Premium Supple Leather - ทนทาน ทำความสะอาดง่าย</span>
                </li>
                <li className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-white" />
                  <span>ดีไซน์สตรีทมินิมอล แมตช์ได้ทั้งลุคทำงานและวันหยุด</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Brand Atelier Feature Spotlight */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white p-2 flex items-center justify-center flex-shrink-0 shadow-lg shadow-white/10">
              <img src="/logo.jpg" alt="Sadida" className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white font-['Space_Grotesk']">
                SADIDA STUDIO & DESIGN LAB
              </h4>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                สร้างสรรค์ทุกโมเดลด้วยมาตรฐานไซส์ UK มาตรฐานสากล (ตั้งแต่ 6 UK จนถึง 13 UK)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-neutral-500 uppercase block">การรับประกัน</span>
              <span className="text-sm font-semibold text-white">ของแท้ 100% ตรงจากสตูดิโอ</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
