import React, { useState } from 'react';
import { ArrowUp, Mail, MapPin, Phone, Shield, Send, Check } from 'lucide-react';

interface FooterProps {
  onScrollToTop: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop, onNavigateSection }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  return (
    <footer id="contact" className="border-t border-neutral-800 bg-black text-neutral-400 relative">
      
      {/* Upper Footer / Newsletter Banner */}
      <div className="border-b border-neutral-800/80 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-['Space_Grotesk']">
              เข้าร่วมครอบครัว SADIDA FIRST DROP
            </h3>
            <p className="mt-2 text-sm text-neutral-400 max-w-lg">
              รับสิทธิ์สั่งจองรองเท้าวิ่งและรองเท้าเดินรุ่นลิมิเต็ดสีดำ-ขาว ก่อนใคร พร้อมข่าวสารโปรโมชั่น
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto items-center gap-2 max-w-md">
            <div className="relative flex-grow">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="กรอกอีเมลของคุณ..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-md flex-shrink-0 cursor-pointer"
            >
              {subscribed ? (
                <>
                  <Check className="w-4 h-4 text-black" />
                  <span>บันทึกแล้ว</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>ติดตาม</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links & Info Grid */}
      <div className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand Info & Logo */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl p-1.5 flex items-center justify-center border border-neutral-700 shadow-md">
                <img src="/logo.jpg" alt="Sadida Brand Logo" className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <div>
                <span className="text-2xl font-extrabold tracking-tighter text-white font-['Space_Grotesk'] leading-none">
                  SADIDA
                </span>
                <span className="text-[10px] tracking-[0.25em] text-neutral-400 block mt-1">
                  OFFICIAL FOOTWEAR
                </span>
              </div>
            </div>

            <p className="text-sm text-neutral-400 leading-relaxed font-light max-w-sm">
              Sadida แบรนด์รองเท้าวิ่งและรองเท้าเดินที่คัดสรรวัสดุพรีเมียม โครงสร้างน้ำหนักเบา 
              และเอกลักษณ์โทนสีขาว-ดำ สไตล์มินิมอลเหนือกาลเวลา
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href="#instagram" 
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a 
                href="#facebook" 
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a 
                href="#twitter" 
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 font-['Space_Grotesk']">
              เมนูหน้าเว็บ
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => onNavigateSection('hero')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  หน้าหลัก / แบนร์
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('products')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  สินค้าทั้งหมด
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('brand')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  เรื่องราวแบรนด์ Sadida
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('contact')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  ติดต่อเรา
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Category Highlights */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 font-['Space_Grotesk']">
              ประเภทสินค้า (Categories)
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => onNavigateSection('products')} 
                  className="hover:text-white transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>รองเท้าวิ่ง (Running)</span>
                  <span className="text-[10px] text-neutral-500 font-mono">cg_1</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateSection('products')} 
                  className="hover:text-white transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>รองเท้าเดิน (Walking)</span>
                  <span className="text-[10px] text-neutral-500 font-mono">cg_2</span>
                </button>
              </li>
              <li className="pt-2 text-xs text-neutral-500">
                รองรับขนาด: 6 UK – 13 UK
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location (Teaser for Google Map page) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 font-['Space_Grotesk']">
              ติดต่อและที่อยู่สตูดิโอ
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                <span className="text-xs text-neutral-400">
                  Sadida Flagship Store, แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ 10110 (มี Google Maps API ในหน้าติดต่อ)
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-white flex-shrink-0" />
                <span className="text-xs text-neutral-400 font-mono">02-999-8888, 089-123-4567</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-white flex-shrink-0" />
                <span className="text-xs text-neutral-400 font-mono">support@sadida.store</span>
              </div>
            </div>

            {/* Admin Backoffice Gateway Link */}
            <div className="mt-6 pt-4 border-t border-neutral-800">
              <a
                href="#admin"
                onClick={(e) => {
                  e.preventDefault();
                  alert('หน้า Login สำหรับแอดมินและเจ้าของระบบ (Admin Portal) ตามข้อกำหนดใน requirement.md');
                }}
                className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-neutral-400" />
                <span>เข้าสู่ระบบหลังบ้าน (Admin Only)</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="mt-14 pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} SADIDA Official. All rights reserved. ออกแบบสไตล์ขาว-ดำตาม wireframe.
          </div>

          <div className="flex items-center gap-6">
            <span>นโยบายความเป็นส่วนตัว</span>
            <span>เงื่อนไขการให้บริการ</span>
            <button
              onClick={onScrollToTop}
              className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>กลับสู่ด้านบน</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </footer>
  );
};
