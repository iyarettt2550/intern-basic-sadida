import React, { useState } from 'react';
import { Menu, X, Shield, Sparkles, Phone, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  activeTab?: string;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'brand', label: 'หน้าหลัก', subtitle: 'Sadida Atelier' },
    { id: 'products', label: 'สินค้า', subtitle: 'Footwear Collection' },
    { id: 'contact', label: 'ติดต่อ', subtitle: 'Get In Touch' },
  ];

  const handleScroll = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/85 border-b border-neutral-800 transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-neutral-900 border-b border-neutral-800/80 px-4 py-1.5 text-center text-xs tracking-wider text-neutral-400 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-neutral-200 animate-pulse" />
        <span>SADIDA OFFICIAL • นิยามใหม่ของรองเท้าสไตล์มินิมอลขาว-ดำ วิ่ง & เดิน</span>
        <span className="hidden sm:inline-block text-neutral-600">|</span>
        <span className="hidden sm:inline-block text-white font-medium">จัดส่งฟรีทั่วประเทศ</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={() => handleScroll('hero')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Logo Image from public/logo.jpg */}
            <div className="relative w-12 h-12 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-lg shadow-white/5 border border-neutral-700 group-hover:scale-105 transition-transform duration-200">
              <img 
                src="/logo.jpg" 
                alt="Sadida Brand Logo" 
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tighter text-white font-['Space_Grotesk'] leading-none">
                SADIDA
              </span>
              <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase font-medium mt-1">
                FOOTWEAR • B&W
              </span>
            </div>
          </div>

          {/* Navigation Pill Buttons (ตรงตามภาพสเก็ตช์ [แบนร์] [สินค้า] [ติดต่อ]) */}
          <nav className="hidden md:flex items-center gap-3 p-1.5 bg-neutral-950/80 border border-neutral-800 rounded-full shadow-inner">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScroll(item.id)}
                className="group relative px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:text-black hover:bg-white text-neutral-300 border border-transparent hover:border-white shadow-sm cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  {item.label}
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 group-hover:bg-black transition-colors" />
                </span>
              </button>
            ))}
          </nav>

          {/* Right Action Icons & Admin Gateway */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Contact Link */}
            <button
              onClick={() => handleScroll('contact')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors cursor-pointer"
              title="ติดต่อเจ้าหน้าที่"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>ติดต่อเรา</span>
            </button>

            {/* Admin Access Button (เตรียมไว้สำหรับหน้า Admin ตาม requirement) */}
            <a
              href="#admin-login"
              onClick={(e) => {
                e.preventDefault();
                alert('ระบบหลังบ้าน (Admin Dashboard) กำลังอยู่ระหว่างการพัฒนาตาม Requirement');
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-400 hover:text-white hover:border-neutral-500 border border-neutral-800 rounded-lg transition-all"
              title="เข้าสู่ระบบ Admin"
            >
              <Shield className="w-3.5 h-3.5 text-neutral-400" />
              <span>Admin</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-950 border-b border-neutral-800 px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScroll(item.id)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-neutral-200 bg-neutral-900/60 hover:bg-white hover:text-black border border-neutral-800 transition-colors"
              >
                <div>
                  <div className="font-medium text-base">{item.label}</div>
                  <div className="text-xs text-neutral-500">{item.subtitle}</div>
                </div>
                <ArrowUpRight className="w-4 h-4 opacity-70" />
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-3">
            <button
              onClick={() => handleScroll('contact')}
              className="flex-1 py-2.5 px-3 text-center text-xs font-medium bg-neutral-900 text-neutral-300 rounded-lg border border-neutral-800"
            >
              ติดต่อสอบถาม
            </button>
            <a
              href="#admin"
              onClick={(e) => {
                e.preventDefault();
                alert('ระบบหลังบ้าน (Admin Dashboard) เตรียมพร้อมเชื่อมต่อในขั้นตอนถัดไป');
              }}
              className="py-2.5 px-4 text-xs font-semibold bg-white text-black rounded-lg flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
