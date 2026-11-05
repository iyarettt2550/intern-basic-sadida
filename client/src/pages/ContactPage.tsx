import React, { useState, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useWebsiteConfig } from '../config/websiteConfig';
import { API_BASE } from '../utils/productStore';

// Helper to validate Thai phone numbers and reject fake/spam numbers
export const validatePhone = (raw: string): { valid: boolean; message: string } => {
  const clean = raw.replace(/[- ]/g, '').trim();

  if (!clean) {
    return { valid: false, message: 'กรุณากรอกเบอร์โทรศัพท์' };
  }

  // 1. Must contain only digits
  if (!/^\d+$/.test(clean)) {
    return { valid: false, message: 'เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น (ห้ามใส่ตัวอักษรหรืออักขระพิเศษ)' };
  }

  // 2. Must start with 0
  if (!clean.startsWith('0')) {
    return { valid: false, message: 'เบอร์โทรศัพท์ในประเทศไทยต้องขึ้นต้นด้วยเลข 0 เสมอ' };
  }

  // 3. Length must be 9 or 10 digits
  if (clean.length !== 9 && clean.length !== 10) {
    return { valid: false, message: 'เบอร์โทรศัพท์ต้องมี 10 หลัก (เบอร์มือถือ) หรือ 9 หลัก (เบอร์บ้าน)' };
  }

  // 4. Strict Thai prefix check:
  // Mobile (10 digits): 06, 08, 09
  // Landline (9 digits): 02, 03, 04, 05, 07
  const isMobile = clean.length === 10 && /^0[689]\d{8}$/.test(clean);
  const isLandline = clean.length === 9 && /^0[23457]\d{7}$/.test(clean);

  if (!isMobile && !isLandline) {
    if (clean.length === 10) {
      return {
        valid: false,
        message: 'เบอร์มือถือ 10 หลักต้องขึ้นต้นด้วย 06, 08 หรือ 09 เท่านั้น (เบอร์บ้านมี 9 หลัก)',
      };
    } else {
      return {
        valid: false,
        message: 'เบอร์บ้าน 9 หลักต้องขึ้นต้นด้วย 02 (กทม.) หรือ 03, 04, 05, 07 (ต่างจังหวัด)',
      };
    }
  }

  // 5. Reject repeated digits e.g. 0999999999, 0888888888, 0000000000
  if (/^0(\d)\1+$/.test(clean)) {
    return { valid: false, message: 'ไม่อนุญาตให้ใช้เบอร์ที่เป็นเลขซ้ำกันทั้งหมด' };
  }

  // 6. Reject 6 or more identical consecutive digits
  if (/(\d)\1{5,}/.test(clean)) {
    return { valid: false, message: 'เบอร์โทรศัพท์มีตัวเลขซ้ำกันผิดปกติ กรุณากรอกเบอร์จริง' };
  }

  // 7. Reject simple sequences
  const sequences = ['0123456789', '0987654321', '0876543210', '0898765432', '0678901234'];
  if (sequences.includes(clean)) {
    return { valid: false, message: 'ไม่อนุญาตให้ใช้ตัวเลขเรียงลำดับ' };
  }

  return { valid: true, message: '' };
};

// Helper to validate realistic email
export const validateEmail = (raw: string): { valid: boolean; message: string } => {
  const email = raw.trim().toLowerCase();
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
  if (!regex.test(email)) {
    return { valid: false, message: 'รูปแบบอีเมลไม่ถูกต้อง (ตัวอย่าง: yourname@gmail.com)' };
  }

  const parts = email.split('@');
  if (parts.length !== 2) {
    return { valid: false, message: 'รูปแบบอีเมลไม่ถูกต้อง' };
  }

  const [username, domain] = parts;

  if (username.length < 2) {
    return { valid: false, message: 'ชื่ออีเมลต้องมีอย่างน้อย 2 ตัวอักษร' };
  }

  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return { valid: false, message: 'โดเมนอีเมลต้องมีนามสกุล (เช่น .com หรือ .co.th)' };
  }

  const tld = domainParts[domainParts.length - 1];
  // TLD must be at least 2 characters and letters only
  if (tld.length < 2 || !/^[a-z]+$/.test(tld)) {
    return { valid: false, message: 'นามสกุลโดเมนอีเมลไม่ถูกต้อง (ต้องมีอย่างน้อย 2 ตัวอักษร เช่น .com, .co.th)' };
  }

  const mainDomain = domainParts[0];
  if (mainDomain.length < 2) {
    return { valid: false, message: 'ชื่อโดเมนอีเมลสั้นผิดปกติหรือไม่ถูกต้อง' };
  }

  // Reject known fake/troll/disposable domains
  const blockedDomains = [
    'test.com',
    'fake.com',
    'example.com',
    'asdf.com',
    'a.com',
    'hot.dog',
    'good.com',
    'htc.com',
    'temp.com',
    'trash.com',
    'mailinator.com',
    '10minutemail.com',
    'guerrillamail.com',
    'yopmail.com',
    'dispostable.com',
    'throwaway.com',
  ];

  if (blockedDomains.includes(domain)) {
    return { valid: false, message: `ไม่อนุญาตให้อีเมลจากโดเมน @${domain} กรุณาใช้อีเมลจริง` };
  }

  return { valid: true, message: '' };
};

export const validateName = (raw: string): { valid: boolean; message: string } => {
  const name = raw.trim();
  if (name.length < 2) {
    return { valid: false, message: 'กรุณากรอกชื่อ-นามสกุลอย่างน้อย 2 ตัวอักษร' };
  }
  if (name.length > 100) {
    return { valid: false, message: 'ชื่อ-นามสกุลยาวเกินไป (ไม่เกิน 100 ตัวอักษร)' };
  }
  if (/(.)\1{4,}/.test(name)) {
    return { valid: false, message: 'กรุณากรอกชื่อจริง ไม่ใช้อักษรซ้ำกันแบบสแปม' };
  }
  return { valid: true, message: '' };
};

export const validateSubject = (raw: string): { valid: boolean; message: string } => {
  const subject = raw.trim();
  if (subject.length < 2) {
    return { valid: false, message: 'กรุณากรอกหัวข้ออย่างน้อย 2 ตัวอักษร' };
  }
  if (subject.length > 100) {
    return { valid: false, message: 'หัวข้อยาวเกินไป (ไม่เกิน 100 ตัวอักษร)' };
  }
  if (/(.)\1{4,}/.test(subject)) {
    return { valid: false, message: 'หัวข้อมีอักขระซ้ำกันผิดปกติ' };
  }
  return { valid: true, message: '' };
};

export const validateMessage = (raw: string): { valid: boolean; message: string } => {
  const message = raw.trim();
  if (message.length < 5) {
    return { valid: false, message: 'กรุณากรอกข้อความอย่างน้อย 5 ตัวอักษร' };
  }
  if (message.length > 1000) {
    return { valid: false, message: 'ข้อความยาวเกินไป (ไม่เกิน 1000 ตัวอักษร)' };
  }
  if (/(.)\1{6,}/.test(message)) {
    return { valid: false, message: 'ข้อความมีอักขระซ้ำกันผิดปกติ' };
  }
  return { valid: true, message: '' };
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

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  // DOM Refs for auto-scroll and focus
  const alertRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToAlert = () => {
    setTimeout(() => {
      if (alertRef.current) {
        alertRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Filter phone input to digits and common separators only
    if (name === 'phone') {
      const sanitized = value.replace(/[^0-9- ]/g, '');
      setFormData((prev) => ({ ...prev, phone: sanitized }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear specific field error as user corrects it
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name as keyof typeof fieldErrors];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    // Validate all fields
    const errors: Record<string, string> = {};

    const nameRes = validateName(formData.name);
    if (!nameRes.valid) errors.name = nameRes.message;

    const emailRes = validateEmail(formData.email);
    if (!emailRes.valid) errors.email = emailRes.message;

    const phoneRes = validatePhone(formData.phone);
    if (!phoneRes.valid) errors.phone = phoneRes.message;

    const subjectRes = validateSubject(formData.subject);
    if (!subjectRes.valid) errors.subject = subjectRes.message;

    const messageRes = validateMessage(formData.message);
    if (!messageRes.valid) errors.message = messageRes.message;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstErrorMessage = Object.values(errors)[0];
      setStatus({
        type: 'error',
        message: firstErrorMessage,
      });

      // Jump/Scroll smoothly to the warning alert and focus the first invalid field
      scrollToAlert();

      if (errors.name) nameInputRef.current?.focus();
      else if (errors.email) emailInputRef.current?.focus();
      else if (errors.phone) phoneInputRef.current?.focus();
      else if (errors.subject) subjectInputRef.current?.focus();
      else if (errors.message) messageInputRef.current?.focus();

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
        setFieldErrors({});
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        scrollToAlert();
      } else {
        const serverErrors: Record<string, string> = {};
        if (resData?.details && Array.isArray(resData.details)) {
          resData.details.forEach((d: { field: string; message: string }) => {
            serverErrors[d.field] = d.message;
          });
          setFieldErrors(serverErrors);
        }

        const errMsg =
          resData?.details?.[0]?.message ||
          resData?.error ||
          resData?.message ||
          'เกิดข้อผิดพลาดในการส่งข้อความ กรุณาตรวจสอบข้อมูล';
        setStatus({
          type: 'error',
          message: errMsg,
        });
        scrollToAlert();
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง',
      });
      scrollToAlert();
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
        
        {/* Status Alert if any — with ref for auto jumping/scrolling */}
        {status.type && (
          <div
            ref={alertRef}
            tabIndex={-1}
            className={`mb-8 p-4 sm:p-5 rounded-2xl border-2 flex items-start gap-3.5 shadow-[4px_4px_0px_#000000] transition-all scroll-mt-24 ${
              status.type === 'success'
                ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                : 'bg-red-50 border-red-600 text-red-950 ring-2 ring-red-400/50'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5 animate-pulse" />
            )}
            <div className="flex-1">
              <h4 className="text-sm font-black font-['Space_Grotesk'] uppercase tracking-wider">
                {status.type === 'success' ? 'ส่งข้อความสำเร็จ' : 'โปรดตรวจสอบข้อมูล (ข้อผิดพลาด)'}
              </h4>
              <p className="text-sm font-semibold mt-0.5 leading-relaxed">{status.message}</p>
            </div>
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

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Field 1: name */}
              <div>
                <label htmlFor="name" className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 font-['Space_Grotesk']">
                  name <span className="text-neutral-500 font-normal font-sans">(ชื่อ-นามสกุล)</span> <span className="text-red-500">*</span>
                </label>
                <input
                  ref={nameInputRef}
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="กรอกชื่อ-นามสกุลของคุณ"
                  className={`w-full px-4 py-2.5 rounded-xl text-black font-medium placeholder-neutral-400 focus:outline-none focus:shadow-[2px_2px_0px_#000000] transition-all border-2 ${
                    fieldErrors.name
                      ? 'border-red-500 bg-red-50/50 focus:bg-white'
                      : 'border-black bg-neutral-50 focus:bg-white'
                  }`}
                />
                {fieldErrors.name && (
                  <p className="text-xs text-red-600 font-bold flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Field 2: email */}
              <div>
                <label htmlFor="email" className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 font-['Space_Grotesk']">
                  email <span className="text-neutral-500 font-normal font-sans">(อีเมล)</span> <span className="text-red-500">*</span>
                </label>
                <input
                  ref={emailInputRef}
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="yourname@gmail.com"
                  className={`w-full px-4 py-2.5 rounded-xl text-black font-medium placeholder-neutral-400 focus:outline-none focus:shadow-[2px_2px_0px_#000000] transition-all border-2 ${
                    fieldErrors.email
                      ? 'border-red-500 bg-red-50/50 focus:bg-white'
                      : 'border-black bg-neutral-50 focus:bg-white'
                  }`}
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  รูปแบบ: อีเมลจริงที่มีโดเมนถูกต้อง เช่น name@gmail.com, name@company.co.th
                </p>
                {fieldErrors.email && (
                  <p className="text-xs text-red-600 font-bold flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Row with 2 Columns: cel & subject matching wireframe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* cel (เบอร์โทร) */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 font-['Space_Grotesk']">
                    cel <span className="text-neutral-500 font-normal font-sans">(เบอร์โทร)</span> <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={phoneInputRef}
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    maxLength={12}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0812345678"
                    className={`w-full px-4 py-2.5 rounded-xl text-black font-medium placeholder-neutral-400 focus:outline-none focus:shadow-[2px_2px_0px_#000000] transition-all border-2 ${
                      fieldErrors.phone
                        ? 'border-red-500 bg-red-50/50 focus:bg-white'
                        : 'border-black bg-neutral-50 focus:bg-white'
                    }`}
                  />
                  <p className="text-[11px] text-neutral-500 mt-1">
                    เบอร์มือถือ 10 หลัก (06x, 08x, 09x) หรือเบอร์บ้าน 9 หลัก
                  </p>
                  {fieldErrors.phone && (
                    <p className="text-xs text-red-600 font-bold flex items-center gap-1 mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>

                {/* subject (หัวข้อ) */}
                <div>
                  <label htmlFor="subject" className="block text-xs font-black uppercase tracking-wider text-black mb-1.5 font-['Space_Grotesk']">
                    subject <span className="text-neutral-500 font-normal font-sans">(หัวข้อ)</span> <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={subjectInputRef}
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="สอบถามไซส์ / สั่งซื้อ"
                    className={`w-full px-4 py-2.5 rounded-xl text-black font-medium placeholder-neutral-400 focus:outline-none focus:shadow-[2px_2px_0px_#000000] transition-all border-2 ${
                      fieldErrors.subject
                        ? 'border-red-500 bg-red-50/50 focus:bg-white'
                        : 'border-black bg-neutral-50 focus:bg-white'
                    }`}
                  />
                  {fieldErrors.subject && (
                    <p className="text-xs text-red-600 font-bold flex items-center gap-1 mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {fieldErrors.subject}
                    </p>
                  )}
                </div>
              </div>

              {/* Field: รายละเอียด (ข้อความ) */}
              <div>
                <label htmlFor="message" className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
                  รายละเอียด <span className="text-red-500">*</span>
                </label>
                <textarea
                  ref={messageInputRef}
                  id="message"
                  name="message"
                  rows={4}
                  required
                  maxLength={500}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="พิมพ์ข้อความรายละเอียดที่ต้องการสอบถาม..."
                  className={`w-full px-4 py-2.5 rounded-xl text-black font-medium placeholder-neutral-400 focus:outline-none focus:shadow-[2px_2px_0px_#000000] transition-all resize-y border-2 ${
                    fieldErrors.message
                      ? 'border-red-500 bg-red-50/50 focus:bg-white'
                      : 'border-black bg-neutral-50 focus:bg-white'
                  }`}
                />
                <div className="flex justify-between items-center text-[11px] text-neutral-500 mt-1">
                  {fieldErrors.message ? (
                    <span className="text-xs text-red-600 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {fieldErrors.message}
                    </span>
                  ) : (
                    <span>กรุณากรอกข้อความอย่างน้อย 5 ตัวอักษร</span>
                  )}
                  <span className="font-mono">{formData.message.length}/500 ตัวอักษร</span>
                </div>
              </div>

              {/* Submit Button: ส่ง */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-36 py-3 bg-white hover:bg-black hover:text-white text-black font-black text-sm uppercase tracking-wider rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
