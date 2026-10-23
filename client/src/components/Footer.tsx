import React from 'react';
import { ArrowUp, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  onScrollToTop?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop }) => {
  const handleScrollTop = () => {
    if (onScrollToTop) {
      onScrollToTop();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact-footer" className="border-t-2 border-black bg-black text-white relative">
      {/* Main Footer Links & Info Grid */}
      <div className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand Info & Logo */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#ffffff]">
                <img src="/logo.jpg" alt="Sadida Brand Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tighter text-white font-['Space_Grotesk'] leading-none">
                  SADIDA
                </span>
                <span className="text-[10px] tracking-[0.25em] text-neutral-400 block font-bold mt-1">
                  OFFICIAL FOOTWEAR • B&W
                </span>
              </div>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed font-normal max-w-sm">
              Sadida แบรนด์รองเท้าวิ่งและรองเท้าเดินที่คัดสรรวัสดุพรีเมียม โครงสร้างน้ำหนักเบา 
              และเอกลักษณ์โทนสีดำกับสีขาว สไตล์มินิมอลเหนือกาลเวลา
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href="#instagram" 
                onClick={(e) => e.preventDefault()}
                className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 text-white hover:bg-white hover:text-black hover:border-white flex items-center justify-center transition-colors"
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
                className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 text-white hover:bg-white hover:text-black hover:border-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a 
                href="#twitter" 
                onClick={(e) => e.preventDefault()}
                className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 text-white hover:bg-white hover:text-black hover:border-white flex items-center justify-center transition-colors"
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
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4 font-['Space_Grotesk']">
              เมนูหน้าเว็บ
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link to="/" className="text-neutral-300 hover:text-white transition-colors">
                  แบนร์ / หน้าหลัก
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-neutral-300 hover:text-white transition-colors">
                  สินค้าทั้งหมด
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-300 hover:text-white transition-colors">
                  ติดต่อเรา
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Category Highlights */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4 font-['Space_Grotesk']">
              ประเภทสินค้า (Categories)
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link to="/products?category=running" className="text-neutral-300 hover:text-white transition-colors flex items-center justify-between">
                  <span>รองเท้าวิ่ง (Running)</span>
                  <span className="text-[10px] text-neutral-400 font-mono">cg_1</span>
                </Link>
              </li>
              <li>
                <Link to="/products?category=walking" className="text-neutral-300 hover:text-white transition-colors flex items-center justify-between">
                  <span>รองเท้าเดิน (Walking)</span>
                  <span className="text-[10px] text-neutral-400 font-mono">cg_2</span>
                </Link>
              </li>
              <li className="pt-2 text-xs text-neutral-400">
                รองรับขนาด: 6 UK – 13 UK
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4 font-['Space_Grotesk']">
              ติดต่อและที่อยู่สตูดิโอ
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                <span className="text-xs text-neutral-300">
                  Sadida Flagship Store, แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ 10110
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-white flex-shrink-0" />
                <span className="text-xs text-neutral-300 font-mono">02-999-8888, 089-123-4567</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-white flex-shrink-0" />
                <span className="text-xs text-neutral-300 font-mono">support@sadida.store</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="mt-14 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            © {new Date().getFullYear()} SADIDA Official. All rights reserved. ออกแบบสไตล์สีดำกับสีขาวตาม wireframe.
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">นโยบายความเป็นส่วนตัว</span>
            <span className="hover:text-white cursor-pointer">เงื่อนไขการให้บริการ</span>
            <button
              onClick={handleScrollTop}
              className="flex items-center gap-1.5 text-white hover:underline transition-colors cursor-pointer font-bold"
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
