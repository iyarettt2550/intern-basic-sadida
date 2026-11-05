import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useWebsiteConfig } from '../config/websiteConfig';
import { API_BASE } from '../utils/productStore';

// Helper to validate Thai phone numbers and reject repetitive spam
const isValidPhone = (val: string): boolean => {
  const clean = val.replace(/[- ]/g, '').trim();
  if (!/^0[2-9]\d{7,8}$/.test(clean)) return false;
  if (/^(\d)\1+$/.test(clean)) return false;
  if (clean === '0123456789' || clean === '0987654321' || clean === '0876543210') return false;
  return true;
};

// Helper to validate realistic email
const isValidEmail = (val: string): boolean => {
  const email = val.trim().toLowerCase();
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(email)) return false;
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const domain = parts[1];
  const domainParts = domain.split('.');
  if (domainParts.length < 2) return false;
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) return false;
  const fakeDomains = ['test.com', 'fake.com', 'example.com', 'asdf.com', 'a.com'];
  if (fakeDomains.includes(domain)) return false;
  return true;
};

export const ContactPage: React.FC = () => {
  const { isSectionVisible, getSectionText } = useWebsiteConfig();
  const showForm = isSectionVisible('contact', 'contactForm');
  const showInfo = isSectionVisible('contact', 'contactInfo');

  const formTitle = getSectionText('contact', 'contactForm', 'title', 'ติดต่อเรา');
  const formDesc = getSectionText('contact', 'contactForm', 'description', 'ส่งข้อความถึงทีมงาน Sadida');
  const formBtn = getSectionText('contact', 'contactForm', 'buttonText', 'ส่ง');

  const infoTitle = getSectionText('contact', 'contactInfo', 'title', 'รายละเอียดที่อยู่');
  const infoAddress = getSectionText(
    'contact',
    'contactInfo',
    'address',
    'Sadida Flagship Atelier & Store\n99/4 อาคารนวัตกรรมดีไซน์ ชั้น 1\nแขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ 10110'
  );
  const infoPhone = getSectionText('contact', 'contactInfo', 'phone', '081-234-5678');
  const infoEmail = getSectionText('contact', 'contactInfo', 'email', 'contact@sadida.co.th');
  const mapTitle = getSectionText('contact', 'contactInfo', 'mapTitle', 'map (แผนที่ตั้ง)');
  const mapLat = getSectionText('contact', 'contactInfo', 'mapLat', '13.7380');
  const mapLng = getSectionText('contact', 'contactInfo', 'mapLng', '100.5630');
  const mapZoom = getSectionText('contact', 'contactInfo', 'mapZoom', '15');
  const googleMapsApiKey = getSectionText('contact', 'contactInfo', 'googleMapsApiKey', '');

  const mapEmbedUrl = googleMapsApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(googleMapsApiKey)}&q=${encodeURIComponent(mapLat)},${encodeURIComponent(mapLng)}&zoom=${encodeURIComponent(mapZoom)}`
    : `https://maps.google.com/maps?q=${encodeURIComponent(mapLat)},${encodeURIComponent(mapLng)}&hl=th&z=${encodeURIComponent(mapZoom)}&output=embed`;

  const mapExternalUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapLat)},${encodeURIComponent(mapLng)}`;


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    // 1. Validate Thai phone number
    if (!isValidPhone(formData.phone)) {
      setStatus({
        type: 'error',
        message: 'กรุณากรอกเบอร์โทรศัพท์จริงในประเทศไทย (เช่น 0812345678 หรือ 021234567) และห้ามใส่เลขมั่ว',
      });
      return;
    }

    // 2. Validate email domain
    if (!isValidEmail(formData.email)) {
      setStatus({
        type: 'error',
        message: 'กรุณากรอกอีเมลจริงที่ถูกต้อง (เช่น yourname@gmail.com, @hotmail.com, @yahoo.com)',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.replace(/[- ]/g, '').trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
      });

      const resData = await response.json().catch(() => null);

      if (response.ok && resData?.success) {
        setStatus({
          type: 'success',
          message: 'ส่งข้อความติดต่อเรียบร้อยแล้ว! เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด',
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        const errMsg =
          resData?.details?.[0]?.message ||
          resData?.error ||
          resData?.message ||
          'เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง';
        setStatus({
          type: 'error',
          message: errMsg,
        });
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-['Prompt'] selection:bg-black selection:text-white">
      {/* 1. Navbar */}
      <Navbar />

      {/* Main Content Area matching Wireframe Layout (2-Column Side-by-Side Grid) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        
        {/* Status Alert if any */}
        {status.type && (
          <div
            className={`mb-8 p-4 rounded-2xl border-2 flex items-center gap-3 shadow-[4px_4px_0px_#000000] ${
              status.type === 'success'
                ? 'bg-neutral-50 border-black text-black'
                : 'bg-red-50 border-red-600 text-red-900'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span className="text-sm font-bold">{status.message}</span>
          </div>
        )}

        {/* 2-Column Grid or Single Column matching Visibility */}
        <div className={`grid grid-cols-1 ${showForm && showInfo ? 'lg:grid-cols-2' : 'max-w-2xl mx-auto'} gap-8 items-start`}>
          
          {/* LEFT COLUMN: Contact Form "ติดต่อเรา" */}
          {showForm && (
            <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_#000000] space-y-6">
              <div className="text-center pb-2">
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-['Space_Grotesk']">
                  {formTitle}
                </h1>
                {formDesc && (
                  <p className="text-xs text-neutral-500 mt-1">{formDesc}</p>
                )}
              </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Field 1: name */}
              <div>
                <label htmlFor="name" className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 font-['Space_Grotesk']">
                  name <span className="text-neutral-500 font-normal font-sans">(ชื่อ-นามสกุล)</span> <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="กรอกชื่อของคุณ"
                  className="w-full px-4 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-black font-medium placeholder-neutral-400 focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_#000000] transition-all"
                />
              </div>

              {/* Field 2: email */}
              <div>
                <label htmlFor="email" className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 font-['Space_Grotesk']">
                  email <span className="text-neutral-500 font-normal font-sans">(อีเมล)</span> <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@domain.com"
                  className="w-full px-4 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-black font-medium placeholder-neutral-400 focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_#000000] transition-all"
                />
              </div>

              {/* Row with 2 Columns: cel & subject matching wireframe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* cel (เบอร์โทร) */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 font-['Space_Grotesk']">
                    cel <span className="text-neutral-500 font-normal font-sans">(เบอร์โทร)</span> <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0812345678"
                    className="w-full px-4 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-black font-medium placeholder-neutral-400 focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_#000000] transition-all"
                  />
                </div>

                {/* subject (หัวข้อ) */}
                <div>
                  <label htmlFor="subject" className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 font-['Space_Grotesk']">
                    subject <span className="text-neutral-500 font-normal font-sans">(หัวข้อ)</span> <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="สอบถามไซส์ / สั่งซื้อ"
                    className="w-full px-4 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-black font-medium placeholder-neutral-400 focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_#000000] transition-all"
                  />
                </div>
              </div>

              {/* Field: รายละเอียด (ข้อความ) */}
              <div>
                <label htmlFor="message" className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                  รายละเอียด <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  maxLength={200}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="พิมพ์ข้อความรายละเอียดที่ต้องการสอบถาม..."
                  className="w-full px-4 py-2.5 bg-neutral-50 border-2 border-black rounded-xl text-black font-medium placeholder-neutral-400 focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_#000000] transition-all resize-y"
                />
                <div className="text-right text-[11px] text-neutral-500 mt-1 font-mono">
                  {formData.message.length}/200 ตัวอักษร
                </div>
              </div>

              {/* Submit Button: ส่ง */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-32 py-3 bg-white hover:bg-black hover:text-white text-black font-black text-sm uppercase tracking-wider rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>กำลังส่ง...</span>
                  ) : (
                    <>
                      <span>{formBtn}</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          )}

          {/* RIGHT COLUMN: รายละเอียดที่อยู่ (Top) + map (Bottom) matching wireframe */}
          {showInfo && (
            <div className="space-y-6">
              
              {/* Box: รายละเอียดที่อยู่ (ตรงตามภาพร่าง) */}
              <div className="bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_#000000] space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b-2 border-black">
                  <MapPin className="w-5 h-5 text-black" />
                  <h2 className="text-xl font-black uppercase font-['Space_Grotesk'] tracking-tight">
                    {infoTitle}
                  </h2>
                </div>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs font-black uppercase text-neutral-500 block mb-1">ที่ตั้งร้านค้า & สตูดิโอ</span>
                  <p className="font-bold text-black leading-relaxed whitespace-pre-line">
                    {infoAddress}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-200">
                  <span className="text-xs font-black uppercase text-neutral-500 block mb-1">เวลาทำการ</span>
                  <p className="font-bold text-black flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>จันทร์ - เสาร์: 10:00 - 20:00 น. | อาทิตย์: 11:00 - 18:00 น.</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-200 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <p className="font-bold text-black flex items-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    <span className="font-mono">{infoPhone}</span>
                  </p>
                  <p className="font-bold text-black flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    <span className="font-mono">{infoEmail}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Box: map (ตรงตามภาพร่าง [map] ด้วย Google Maps Embed ปรับแต่งได้) */}
            <div className="bg-white border-2 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0px_#000000]">
              <div className="px-6 py-3 border-b-2 border-black flex items-center justify-between bg-neutral-50">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-black" />
                  <span className="text-sm font-black uppercase font-['Space_Grotesk']">
                    {mapTitle}
                  </span>
                </div>
                <a
                  href={mapExternalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-black underline hover:text-neutral-600"
                >
                  เปิด Google Maps ↗
                </a>
              </div>

              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-neutral-100">
                <iframe
                  title="SADIDA Flagship Store Google Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapEmbedUrl}
                  className="w-full h-full"
                />
              </div>
            </div>

            </div>
          )}

        </div>

      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
};
