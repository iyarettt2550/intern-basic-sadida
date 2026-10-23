import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Brand Home', id: 'home' },
    { path: '/products', label: 'Store', id: 'products' },
    { path: '/contact', label: 'Contact', id: 'contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b-2 border-black transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <Link 
            to="/"
            className="flex items-center gap-3 group cursor-pointer"
          >
            {/* Logo Image from public/logo.jpg */}
            <div className="relative w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000000] group-hover:-translate-y-0.5 transition-transform duration-200">
              <img 
                src="/logo.jpg" 
                alt="Sadida Brand Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-black font-['Space_Grotesk'] leading-none">
                SADIDA
              </span>
              <span className="text-[10px] tracking-[0.25em] text-neutral-600 uppercase font-bold mt-1">
                FOOTWEAR • BLACK & WHITE
              </span>
            </div>
          </Link>

          {/* Navigation Pill Buttons (ตรงตามภาพสเก็ตช์ [แบนร์] [สินค้า] [ติดต่อ]) */}
          <nav className="hidden md:flex items-center gap-3 p-1.5 bg-neutral-100 border-2 border-black rounded-full shadow-[3px_3px_0px_#000000]">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-200 border-2 ${
                    active
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'bg-white text-black border-transparent hover:border-black hover:bg-neutral-50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-black bg-white hover:bg-neutral-100 border-2 border-black shadow-[2px_2px_0px_#000000] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b-2 border-black px-4 pt-4 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left font-bold border-2 transition-colors ${
                    active
                      ? 'bg-black text-white border-black'
                      : 'bg-neutral-50 text-black border-black hover:bg-neutral-100'
                  }`}
                >
                  <span className="text-base">{item.label}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-70" />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
