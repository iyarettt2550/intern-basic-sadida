# เอกสารส่งมอบงานประจำวัน (Daily Development Handoff)

**โปรเจกต์:** เว็บไซต์จำหน่ายรองเท้า SADIDA (Sadida Footwear Store)  
**วันที่ดำเนินการ:** 23 ตุลาคม 2026  
**ผู้จัดทำ:** ทีมพัฒนาระบบ  
**เอกสารอ้างอิง:** [`guide/requirement.md`](./requirement.md) และภาพสเก็ตช์ Wireframe จากผู้สั่งงาน  

---

## 1. สรุปภาพรวมสิ่งที่พัฒนาเสร็จสิ้นในวันนี้ (Executive Summary)

ในวันนี้ได้ทำการพัฒนาและปรับแต่งส่วนหน้าเว็บสำหรับผู้ใช้งานทั่วไป (**Public Web Pages**) เสร็จสมบูรณ์ครบทั้ง 3 หน้าหลัก ตามภาพสเก็ตช์ (Wireframe) ที่ได้รับมอบหมาย ใน**โทนสีดำกับสีขาว (High-Contrast Black & White)** ที่คมชัด เรียบหรู สะอาดตา ไม่ติดฟิลเตอร์ขาวดำมัวๆ

| หน้าเว็บ | URL Route | สรุปงานที่ทำเสร็จในวันนี้ |
| :--- | :--- | :--- |
| **1. หน้าแรก (Home / แบนร์)** | `/` | • เมนูนำทาง 3 ปุ่มแคปซูลตรงตามภาพร่าง<br>• แบนเนอร์ภาพสตูดิโอสเก็ตช์รองเท้า สลับมุมมองกับแบนเนอร์สินค้าจริงได้<br>• แถบเลื่อนสินค้ารองเท้า 3 การ์ด พร้อมแถบเลื่อนแถวเดียวอันเดียว (Single Scrollbar) ปรับจูนลากลื่นไหลระดับ 60/120fps<br>• เนื้อหาปรัชญาแบรนด์ 2 ประเภทสินค้า (วิ่ง & เดิน)<br>• เครื่องมือสาธิตสลับบล็อก Grid Layout สำหรับแอดมิน |
| **2. หน้าสินค้า (Store / Catalog)** | `/products` | • เลย์เอาต์ 2 คอลัมน์ตามภาพสเก็ตช์ใบที่ 2<br>• คอลัมน์ซ้าย: **Navbar Menu** กรองหมวดหมู่ (วิ่ง/เดิน), ขนาดรองเท้า UK (6-11 UK), ช่วงราคา<br>• คอลัมน์ขวา: ช่องค้นหา **"ค้นหา"** ที่มุมบนขวา + ตารางสินค้า Grid 2-3 คอลัมน์<br>• ป็อปอัป Modal ดูสเปกและเลือกไซส์ UK ได้ทันที |
| **3. หน้าติดต่อหาแอดมิน (Contact)** | `/contact` | • เลย์เอาต์ 2 คอลัมน์ขนานกัน (Side-by-Side) ตามภาพสเก็ตช์ใบที่ 4 ล่าสุด<br>• คอลัมน์ซ้าย: ฟอร์ม **"ติดต่อเรา"** (`name`, `email`, แถวคู่ `cel` + `subject`, `รายละเอียด`, ปุ่ม `ส่ง`) เชื่อมโยง Backend API `/api/contact`<br>• คอลัมน์ขวา: กล่อง **"รายละเอียดที่อยู่"** ด้านบน และกล่อง **"map"** (Google Maps Embed) ด้านล่าง |

---

## 2. รายละเอียดการแก้ไขและปรับปรุงตามความต้องการพิเศษ

### 2.1 ปรับโทนสีเป็น "สีดำกับสีขาว" (High-Contrast Clean Black & White)
- ปรับเปลี่ยนพื้นหลังหลักของเว็บไซต์เป็นสีขาวสว่างคมชัด (`#ffffff`)
- ใช้อักษรสีดำสนิท พร้อมเส้นขอบสีดำหนา 2px (`border-2 border-black`) และเงาสไตล์ Modern Neo-Minimalism (`shadow-[4px_4px_0px_#000000]`)
- แสดงภาพถ่ายรองเท้าและสตูดิโอแบบคมชัดตามสีจริง ไม่ใช้ฟิลเตอร์ขาวดำมัวๆ (grayscale) เพื่อให้ผู้ใช้มองเห็นเนื้อสัมผัสและดีเทลสินค้าได้ชัดเจนที่สุด

### 2.2 นำปุ่มและส่วนเกินออกตามคำขอ
- **แถบนำทาง (Navbar)**: นำปุ่ม `[ 📞 ติดต่อเรา ]` และปุ่ม `[ 🛡️ Admin ]` ทางฝั่งขวาออก คงไว้เฉพาะโลโก้ และปุ่ม 3 ปุ่มหลัก `[ แบนร์ / Brand Home ]`, `[ สินค้า / Store ]`, `[ ติดต่อ / Contact ]`
- **ส่วนท้ายเว็บ (Footer)**: นำแบนเนอร์รับข่าวสาร *"เข้าร่วมครอบครัว SADIDA FIRST DROP"* ออก ทำให้ส่วนท้ายกระชับและตรงตามรูปวาด

### 2.3 ปรับแก้แถบเลื่อน (Scrollbar) ให้เหลือแถวเดียว และแก้ไขอาการหน่วงให้สมูท 100%
- ซ่อนแถบเลื่อนแนวนอนสีเทาของระบบปฏิบัติการ (OS Default Scrollbar) อย่างถาวรด้วย Utility `.no-scrollbar`
- **แก้ปัญหาอาการหน่วง (Laggy Scrollbar)**:
  1. ขณะคลิกลากเมาส์ ระบบจะสลับ `scroll-behavior` เป็น `auto` ทันทีแบบ 1:1 จึงไม่มีการต้านหรือหน่วงจาก CSS Animation
  2. ปิด Transition ดีเลย์บนตัวลูกเลื่อน (`transition-none`) ทำให้ตัวเลื่อนขยับตามเคอร์เซอร์เมาส์ทันที 0ms
  3. ผสาน `requestAnimationFrame` ควบคุมการเรนเดอร์ตำแหน่งลูกเลื่อนตาม Refresh Rate ของหน้าจอ (60/120Hz)
  4. เพิ่มปุ่มลูกศร `◀` `▶` ขนาบข้างแถบเลื่อน และรองรับการคลิกบนรางเลื่อนเพื่อกระโดดข้ามตำแหน่ง

### 2.4 ปรับเลย์เอาต์หน้าติดต่อหาแอดมินเป็น 2 คอลัมน์
- ปรับจากเดิมที่เรียงต่อกันเป็นแนวดิ่ง มาเป็นระบบกริด 2 คอลัมน์ขนานกัน:
  - ฝั่งซ้าย: ฟอร์มกรอกข้อความติดต่อหาแอดมิน
  - ฝั่งขวา: กล่องข้อมูลรายละเอียดที่อยู่ + แผนที่ Google Maps Interactive อยู่ข้างกันในระดับสายตาเดียวกัน

---

## 3. รายการไฟล์ที่สร้างและพัฒนาในวันนี้ (Files Modified / Created)

### 3.1 ไฟล์หน้าหลัก (Pages)
1. [`client/src/pages/HomePage.tsx`](file:///d:/intern-basic-sadida/client/src/pages/HomePage.tsx)
   - หน้าหลักที่รวบรวม Hero Banner, Product Showcase, Brand Philosophy, Footer และเครื่องมือสลับบล็อก Grid Layout
2. [`client/src/pages/ProductsPage.tsx`](file:///d:/intern-basic-sadida/client/src/pages/ProductsPage.tsx)
   - หน้าสโตร์สินค้า พร้อม Sidebar กรอง 2 หมวดหมู่, กรองขนาด UK และช่องค้นหา
3. [`client/src/pages/ContactPage.tsx`](file:///d:/intern-basic-sadida/client/src/pages/ContactPage.tsx)
   - หน้าติดต่อหาแอดมินแบบ 2 คอลัมน์ ฟอร์มอยู่ซ้าย ที่อยู่และ Google Map อยู่ขวา เชื่อมต่อ API บันทึกข้อมูล

### 3.2 ไฟล์คอมโพเนนต์ (Components)
4. [`client/src/components/Navbar.tsx`](file:///d:/intern-basic-sadida/client/src/components/Navbar.tsx)
   - แถบเมนูด้านบน โลโก้ Sadida และปุ่ม 3 ปุ่มหลัก
5. [`client/src/components/HeroBanner.tsx`](file:///d:/intern-basic-sadida/client/src/components/HeroBanner.tsx)
   - แบนเนอร์ภาพสเก็ตช์สตูดิโอและปุ่มสลับมุมมอง
6. [`client/src/components/ProductCard.tsx`](file:///d:/intern-basic-sadida/client/src/components/ProductCard.tsx)
   - การ์ดสินค้าดีไซน์สีดำตัดขาว พร้อมป้ายหมวดหมู่และราคา
7. [`client/src/components/ProductShowcase.tsx`](file:///d:/intern-basic-sadida/client/src/components/ProductShowcase.tsx)
   - แคตตาล็อก 3 การ์ดแนวนอน พร้อมระบบเลื่อนลื่นไหล Drag & Click
8. [`client/src/components/ProductDetailModal.tsx`](file:///d:/intern-basic-sadida/client/src/components/ProductDetailModal.tsx)
   - ป็อปอัปแสดงรายละเอียดขนาดรองเท้า UK และการสั่งซื้อ
9. [`client/src/components/BrandStory.tsx`](file:///d:/intern-basic-sadida/client/src/components/BrandStory.tsx)
   - ส่วนอธิบายจุดเด่นของรองเท้าวิ่งและรองเท้าเดิน
10. [`client/src/components/Footer.tsx`](file:///d:/intern-basic-sadida/client/src/components/Footer.tsx)
    - ส่วนท้ายเว็บไซต์ แสดงข้อมูลลิขสิทธิ์ ลิงก์ และช่องทางติดต่อ

### 3.3 ไฟล์การตั้งค่าและข้อมูลจำลอง (Config & Data)
11. [`client/src/App.tsx`](file:///d:/intern-basic-sadida/client/src/App.tsx) — ติดตั้งระบบ React Router กำหนดเส้นทาง `/`, `/products`, `/contact`
12. [`client/src/index.css`](file:///d:/intern-basic-sadida/client/src/index.css) — ตั้งค่าธีมดำ-ขาว, Utility `.no-scrollbar` และแบบอักษร
13. [`client/src/types/index.ts`](file:///d:/intern-basic-sadida/client/src/types/index.ts) — กำหนด Data Types สำหรับ Product และ Category
14. [`client/src/data/mockProducts.ts`](file:///d:/intern-basic-sadida/client/src/data/mockProducts.ts) — ข้อมูลจำลองรองเท้าวิ่งและเดินตรงตามโครงสร้างฐานข้อมูล Drizzle ORM

---

## 4. ความสอดคล้องกับฐานข้อมูลและ Backend (Data & Schema Alignment)

ระบบหน้าเว็บที่พัฒนาขึ้น สอดคล้องกับโครงสร้าง PostgreSQL และ Drizzle ORM ในโฟลเดอร์ `server/` ทุกประการ:
- **หมวดหมู่สินค้า (`categories`)**:
  - `cg_1`: รองเท้าวิ่ง
  - `cg_2`: รองเท้าเดิน
- **รายละเอียดสินค้า (`product_detail`)**:
  - ไซส์ UK ตั้งแต่ `6 UK` ถึง `13 UK`
  - ราคาตั้งแต่ ฿1,000 ถึง ฿2,400
- **การติดต่อ (`contacts`)**:
  - รองรับฟิลด์ `contactsName`, `email`, `phone`, `subject`, `contactsMessage` ตามที่กำหนดใน `server/src/db/schema.ts` และ `server/src/routes/contact.ts`

---

## 5. วิธีการทดสอบและรันระบบ (How to Run & Verify)

### การรันฝั่ง Frontend:
```bash
cd client
bun run dev
```
เปิดใช้งานผ่านเว็บเบราว์เซอร์ที่: **`http://localhost:5173/`**
- หน้าแรก: `http://localhost:5173/`
- หน้าสินค้า: `http://localhost:5173/products`
- หน้าติดต่อเรา: `http://localhost:5173/contact`

### การตรวจสอบความถูกต้องของโค้ด:
```bash
cd client
bun run build
```
*(ผ่านการทดสอบ Build 100% ไม่มีข้อผิดพลาดของ TypeScript หรือ Bundler)*

---

## 6. แผนงานสำหรับขั้นตอนถัดไป (Next Steps / Phase 2)

สิ่งที่ต้องพัฒนาต่อตามเอกสาร [requirement.md](./requirement.md) ในส่วนของระบบหลังบ้าน (Admin System):
1. **หน้าเข้าสู่ระบบของแอดมิน (Admin Login)**
   - ระบบยืนยันตัวตนด้วย Bun.password hash และจัดเก็บ JWT ใน httpOnly Cookie
2. **หน้าแดชบอร์ดแอดมิน (Admin Dashboard)**
   - สรุปสถิติสินค้า ข้อความติดต่อ และภาพรวมหลังบ้าน
3. **ระบบจัดการสินค้า (Product Management CRUD)**
   - เพิ่ม ลบ แก้ไข รายการรองเท้า และการอัปโหลดไฟล์รูปภาพเข้าฐานข้อมูลตามเงื่อนไข
4. **หน้ารายการติดต่อ (Contact Inquiries)**
   - ดูรายละเอียดข้อความที่ผู้ใช้ส่งมาจากหน้าติดต่อ
5. **ระบบจัดการเลย์เอาต์หน้าเว็บ (Site Customizer / Grid Manager)**
   - แอดมินสามารถสลับตำแหน่งบล็อกองค์ประกอบแบบ Grid ใน 3 หน้าหลักได้โดยไม่ต้องเขียนโค้ดแก้เอง
