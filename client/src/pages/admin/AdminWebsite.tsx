import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Eye, EyeOff, Save, RotateCcw, Type, Image, Layout, Globe, Layers, CheckCircle } from 'lucide-react';

// ======= Types =======
interface SectionItem {
  id: string;
  name: string;
  visible: boolean;
  image?: string;
  texts?: Record<string, string>;
}

interface PageConfig {
  id: string;
  name: string;
  route: string;
  icon: React.ElementType;
  sections: SectionItem[];
}

// ======= Available images in public/images/ =======
const AVAILABLE_IMAGES = [
  '/images/shoe_runner_1.jpg',
  '/images/shoe_runner_2.jpg',
  '/images/shoe_walker_1.jpg',
  '/images/shoe_walker_2.jpg',
  '/images/hero_sketch.jpg',
  '/logo.jpg',
];

// ======= Default page configurations =======
const DEFAULT_PAGES: PageConfig[] = [
  {
    id: 'home',
    name: 'หน้าหลัก (Brand Home)',
    route: '/',
    icon: Globe,
    sections: [
      {
        id: 'hero',
        name: 'แบนเนอร์หลัก (Hero Banner)',
        visible: true,
        image: '/images/hero_sketch.jpg',
        texts: {
          headline: 'CRAFTED FOR PURE MOTION.',
          subtitle: 'จากภาพร่างสเก็ตช์ในสตูดิโอ สู่นวัตกรรมรองเท้าวิ่งและรองเท้าเดินที่เรียบหรูเหนือกาลเวลา',
          badge: 'Sadida Concept Atelier',
        },
      },
      {
        id: 'products',
        name: 'แถบเลื่อนสินค้า (Product Carousel)',
        visible: true,
        texts: {
          title: 'สินค้าแนะนำ',
        },
      },
      {
        id: 'brand',
        name: 'ปรัชญาแบรนด์ (Brand Story)',
        visible: true,
        texts: {
          title: 'เรื่องราวของ Sadida',
          description: 'รองเท้าที่ออกแบบเพื่อการเคลื่อนไหว ผสมผสานนวัตกรรมและสไตล์',
        },
      },
    ],
  },
  {
    id: 'products',
    name: 'หน้าสินค้า (Store)',
    route: '/products',
    icon: Layers,
    sections: [
      {
        id: 'sidebar',
        name: 'แถบกรอง (Filter Sidebar)',
        visible: true,
        texts: {
          title: 'กรองสินค้า',
        },
      },
      {
        id: 'productGrid',
        name: 'ตารางสินค้า (Product Grid)',
        visible: true,
        texts: {
          title: 'รองเท้าทั้งหมด',
          emptyMessage: 'ไม่พบสินค้าที่ตรงกับเงื่อนไข',
        },
      },
    ],
  },
  {
    id: 'contact',
    name: 'หน้าติดต่อเรา (Contact)',
    route: '/contact',
    icon: Type,
    sections: [
      {
        id: 'contactForm',
        name: 'ฟอร์มติดต่อเรา (Contact Form)',
        visible: true,
        texts: {
          title: 'ติดต่อเรา',
          description: 'ส่งข้อความถึงทีมงาน Sadida',
          buttonText: 'ส่ง',
        },
      },
      {
        id: 'contactInfo',
        name: 'ข้อมูลที่อยู่และแผนที่ (Address & Map)',
        visible: true,
        texts: {
          title: 'รายละเอียดที่อยู่',
          address: 'กรุงเทพมหานคร ประเทศไทย',
          phone: '081-234-5678',
          email: 'contact@sadida.co.th',
        },
      },
    ],
  },
];

const STORAGE_KEY = 'sadida_website_config';

export const AdminWebsite: React.FC = () => {
  const [pages, setPages] = useState<PageConfig[]>([]);
  const [activePageId, setActivePageId] = useState('home');
  const [editingText, setEditingText] = useState<{ sectionId: string; key: string } | null>(null);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Load from localStorage or use defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPages(JSON.parse(stored));
      } else {
        setPages(DEFAULT_PAGES);
      }
    } catch {
      setPages(DEFAULT_PAGES);
    }
  }, []);

  const activePage = pages.find((p) => p.id === activePageId);

  // Save to localStorage
  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Reset to defaults
  const handleReset = () => {
    setPages(DEFAULT_PAGES);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Move section up/down
  const moveSection = (pageId: string, sectionIndex: number, direction: 'up' | 'down') => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id !== pageId) return page;
        const newSections = [...page.sections];
        const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
        if (targetIndex < 0 || targetIndex >= newSections.length) return page;
        [newSections[sectionIndex], newSections[targetIndex]] = [newSections[targetIndex], newSections[sectionIndex]];
        return { ...page, sections: newSections };
      })
    );
  };

  // Toggle section visibility
  const toggleVisibility = (pageId: string, sectionId: string) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id !== pageId) return page;
        return {
          ...page,
          sections: page.sections.map((s) =>
            s.id === sectionId ? { ...s, visible: !s.visible } : s
          ),
        };
      })
    );
  };

  // Update section text
  const updateText = (pageId: string, sectionId: string, key: string, value: string) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id !== pageId) return page;
        return {
          ...page,
          sections: page.sections.map((s) =>
            s.id === sectionId
              ? { ...s, texts: { ...s.texts, [key]: value } }
              : s
          ),
        };
      })
    );
  };

  // Update section image
  const updateImage = (pageId: string, sectionId: string, newImage: string) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id !== pageId) return page;
        return {
          ...page,
          sections: page.sections.map((s) =>
            s.id === sectionId ? { ...s, image: newImage } : s
          ),
        };
      })
    );
    setEditingImage(null);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-black font-['Space_Grotesk']">
            จัดการหน้าเว็บ
          </h1>
          <p className="text-sm text-neutral-500 mt-1">สลับองค์ประกอบ แก้ชื่อ แก้รูปภาพ ของแต่ละหน้า</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-black font-bold text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            รีเซ็ต
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 font-bold text-sm rounded-xl border-2 shadow-[3px_3px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all ${
              saved
                ? 'bg-green-500 text-white border-green-500 shadow-[3px_3px_0px_#22c55e]'
                : 'bg-black text-white border-black'
            }`}
          >
            {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'บันทึกแล้ว!' : 'บันทึก'}
          </button>
        </div>
      </div>

      {/* Page tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => setActivePageId(page.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm border-2 transition-all whitespace-nowrap ${
              activePageId === page.id
                ? 'bg-black text-white border-black shadow-[3px_3px_0px_#000000]'
                : 'bg-white text-black border-black hover:bg-neutral-50'
            }`}
          >
            <page.icon className="w-4 h-4" />
            {page.name}
          </button>
        ))}
      </div>

      {/* Active page sections */}
      {activePage && (
        <div className="space-y-4">
          {/* Page route info */}
          <div className="bg-neutral-50 border-2 border-neutral-200 rounded-xl px-5 py-3 flex items-center justify-between">
            <span className="text-sm text-neutral-600">
              เส้นทาง: <code className="bg-white px-2 py-0.5 rounded border border-neutral-300 font-mono text-xs">{activePage.route}</code>
            </span>
            <a
              href={activePage.route}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-black underline hover:no-underline"
            >
              ดูตัวอย่างหน้าจริง →
            </a>
          </div>

          {/* Sections list */}
          {activePage.sections.map((section, index) => (
            <div
              key={section.id}
              className={`bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000000] overflow-hidden transition-opacity ${
                section.visible ? 'opacity-100' : 'opacity-60'
              }`}
            >
              {/* Section header with controls */}
              <div className="flex items-center justify-between p-5 border-b-2 border-neutral-200">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveSection(activePage.id, index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-neutral-100 disabled:opacity-30 transition-colors"
                      title="เลื่อนขึ้น"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveSection(activePage.id, index, 'down')}
                      disabled={index === activePage.sections.length - 1}
                      className="p-1 rounded hover:bg-neutral-100 disabled:opacity-30 transition-colors"
                      title="เลื่อนลง"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Layout className="w-4 h-4 text-neutral-400" />
                      <h3 className="font-black text-black text-sm">{section.name}</h3>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">ลำดับที่ {index + 1}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleVisibility(activePage.id, section.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
                    section.visible
                      ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100'
                      : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                  }`}
                >
                  {section.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {section.visible ? 'แสดง' : 'ซ่อน'}
                </button>
              </div>

              {/* Section edit body */}
              <div className="p-5 space-y-4">
                {/* Image editor */}
                {section.image !== undefined && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Image className="w-4 h-4 text-neutral-500" />
                      <span className="text-xs font-bold text-neutral-600">รูปภาพ</span>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-40 h-24 bg-neutral-100 border-2 border-neutral-300 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={section.image} alt="Section" className="w-full h-full object-cover" />
                      </div>
                      {editingImage === section.id ? (
                        <div className="flex-1 space-y-2">
                          <div className="grid grid-cols-3 gap-2">
                            {AVAILABLE_IMAGES.map((img) => (
                              <button
                                key={img}
                                onClick={() => updateImage(activePage.id, section.id, img)}
                                className={`h-16 rounded-lg border-2 overflow-hidden transition-all ${
                                  section.image === img ? 'border-black shadow-[2px_2px_0px_#000000]' : 'border-neutral-200 hover:border-black'
                                }`}
                              >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => setEditingImage(null)}
                            className="text-xs font-bold text-neutral-500 hover:text-black"
                          >
                            ยกเลิก
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-neutral-500 mb-2 truncate max-w-xs">{section.image}</p>
                          <button
                            onClick={() => setEditingImage(section.id)}
                            className="px-3 py-1.5 bg-white text-black font-bold text-xs rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] hover:shadow-[1px_1px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                          >
                            เปลี่ยนรูป
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Text editors */}
                {section.texts && Object.entries(section.texts).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Type className="w-3.5 h-3.5 text-neutral-500" />
                      <label className="text-xs font-bold text-neutral-600 capitalize">{key}</label>
                    </div>
                    {editingText?.sectionId === section.id && editingText?.key === key ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateText(activePage.id, section.id, key, e.target.value)}
                          className="flex-1 px-3 py-2 border-2 border-black rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                          autoFocus
                        />
                        <button
                          onClick={() => setEditingText(null)}
                          className="px-3 py-2 bg-black text-white font-bold text-xs rounded-lg border-2 border-black"
                        >
                          ✓
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => setEditingText({ sectionId: section.id, key })}
                        className="px-3 py-2 bg-neutral-50 border-2 border-neutral-200 rounded-lg text-sm text-neutral-700 cursor-pointer hover:border-black hover:bg-white transition-all truncate"
                      >
                        {value || <span className="text-neutral-400 italic">คลิกเพื่อแก้ไข</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminWebsite;
