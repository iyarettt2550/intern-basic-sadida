# เอกสารส่งมอบงานฉบับสมบูรณ์: ระบบปรับแต่งเว็บไซต์และจัดการสินค้าขั้นสูง (Complete System Handoff)

**โปรเจกต์:** เว็บไซต์จำหน่ายรองเท้า SADIDA (Sadida Footwear Store)  
**วันที่ดำเนินการล่าสุด:** 27 ตุลาคม 2026  
**ผู้จัดทำ:** ทีมพัฒนาระบบ  
**สถานะการทำงาน:** สำเร็จสมบูรณ์ 100% (Build & Type Check ผ่าน 0 Error)  
**เอกสารอ้างอิง:** [`guide/requirement.md`](file:///d:/intern-basic-sadida/guide/requirement.md), [`guide/handoff-admin.md`](file:///d:/intern-basic-sadida/guide/handoff-admin.md), [`guide/handoff-admin-auto-id-multi-size.md`](file:///d:/intern-basic-sadida/guide/handoff-admin-auto-id-multi-size.md)

---

## 1. บทสรุปภาพรวมสิ่งที่พัฒนา (Executive Summary)

เอกสารฉบับนี้รวบรวมรายละเอียดการพัฒนา การแก้ไขบัค และการปรับปรุงระบบทั้งหมดตามคำขอของผู้ใช้ โดยครอบคลุมทั้งระบบการปรับแต่งหน้าตาเว็บไซต์ผ่านหน้า **Admin Website (`/admin/website`)** และระบบจัดการสินค้าและหมวดหมู่ขั้นสูงผ่านหน้า **Admin Products (`/admin/products`)** ตลอดจนการเชื่อมโยงข้อมูลสู่หน้าบ้านของผู้ใช้งานทั่วไป (Customer Facing Pages) แบบเรียลไทม์

### ตารางสรุปฟังก์ชันและสถานะการดำเนินงาน

| หมวดหมู่ระบบ | รายละเอียดการพัฒนา | สถานะ |
| :--- | :--- | :---: |
| **1. ระบบล็อกอินแอดมิน (Admin Authentication)** | • รองรับการเข้าสู่ระบบด้วย **Username** หรือ **เบอร์โทรศัพท์**<br>• ตรวจสอบข้อมูลผู้ใช้ผ่าน Backend API และจัดการ JWT Token | ✅ สำเร็จ 100% |
| **2. ปรับแต่งแบรนด์และอัตลักษณ์ (Brand Customization)** | • แก้ไขชื่อแบรนด์ (`brandName`) และสโลแกน (`tagline`)<br>• **อัปโหลดรูปโลโก้จากคอมพิวเตอร์ในเครื่องได้โดยตรง** (Local File Upload)<br>• มีคลังภาพโลโก้สำเร็จรูป และรองรับการใส่ URL/Path ภายนอก<br>• แถบประกาศหัวเว็บ (`topNotice`) พร้อมสวิตช์เปิด/ปิด<br>• ข้อความเกี่ยวกับเราท้ายเว็บ (`footerAbout`) | ✅ สำเร็จ 100% |
| **3. เลือกสินค้าแนะนำหน้าแรก (Featured Products Selector)** | • แอดมินสามารถเลือกติ๊กสินค้าเฉพาะชิ้นที่ต้องการนำไปแสดงในหน้าหลักได้อิสระ<br>• **เชื่อมต่อกับระบบสินค้าใหม่แบบไดนามิก** เมื่อแอดมินเพิ่มสินค้าใหม่ สินค้าจะปรากฏในตัวเลือกทันที<br>• แสดงภาพขนาดย่อ, ชื่อ, หมวดหมู่, ราคา พร้อมปุ่มเลือกทั้งหมด/ล้างตัวเลือก | ✅ สำเร็จ 100% |
| **4. แผนที่ Google Maps แบบ Interactive (Click-to-Pin)** | • **ป้อนพิกัดละติจูด (Latitude) และลองจิจูด (Longitude) ได้โดยตรง**<br>• **คลิกปักหมุดบนแผนที่จำลอง (Click-to-Pin Interactive Canvas)** สดๆ<br>• **ปุ่มดึงพิกัดปัจจุบันผ่านระบบ GPS (Current Location)**<br>• **ปุ่มพิกัดแนะนำ 5 จุดสำคัญ:** อโศก, สยาม, เซ็นทรัลเวิลด์, ไอคอนสยาม, เชียงใหม่<br>• ตัวปรับระดับการซูม (Zoom 10-19) และช่องใส่ Google Maps API Key<br>• พรีวิวแผนที่สด (Live Embed Preview) และปุ่มกดเปิดดูบน Google Maps จริง | ✅ สำเร็จ 100% |
| **5. ระบบอัปโหลดรูปสินค้า (Product Image Upload)** | • แอดมินสามารถกดปุ่มอัปโหลดรูปภาพสินค้าจากเครื่องคอมพิวเตอร์ในหน้า Add/Edit สินค้า<br>• Backend รับรูปภาพและบันทึกลงโฟลเดอร์ `client/public/images/shoe_custom_*.ext` และส่ง URL สั้นกลับมาเก็บในฐานข้อมูล PostgreSQL (`product.img varchar(200)`) แก้ไขปัญหา Base64 ขนาดยาวเกิน 200 ตัวอักษร<br>• แสดงภาพพรีวิวก่อนและหลังบันทึก พร้อมตัวเลือกสลับภาพจากคลังภาพสำเร็จรูป | ✅ สำเร็จ 100% |
| **6. ดรอปดาวน์ Neo-Minimalist UI (CustomDropdown)** | • สร้างคอมโพเนนต์ `CustomDropdown.tsx` สไตล์ Neo-Minimalist (`border-2 border-black`, `rounded-xl`, `shadow-[2px_2px_0px_#000000]` / `shadow-[4px_4px_0px_#000000]`)<br>• **ทดแทน Native `<select>` ดั้งเดิม** ที่แสดงแถบไฮไลต์สีน้ำเงิน OS Windows (ตามภาพที่ผู้ใช้แจ้ง) ให้เข้ากับสไตล์ขาว-ดำของเว็บไซต์<br>• มีระบบตรวจจับคลิกนอกพื้นที่ (Click Outside), ปุ่ม Escape และ Badge แสดงจำนวน | ✅ สำเร็จ 100% |
| **7. เพิ่มและจัดการหมวดหมู่สินค้า (Add Category)** | • เพิ่มปุ่ม **"เพิ่มหมวดหมู่"** ข้างปุ่ม `add สินค้า` ในหน้า Admin Products<br>• หน้าต่าง Modal จัดการหมวดหมู่: แสดงรายการหมวดหมู่ปัจจุบัน และฟอร์มสร้างหมวดหมู่ใหม่ (`categoryId` เช่น `cg_3`, `categoryName` เช่น `รองเท้าบาสเก็ตบอล`)<br>• บันทึกลงตาราง `category` ใน PostgreSQL และบันทึกลงแคช พร้อมยิง Custom Event ซิงค์สู่ทุกหน้าทันที | ✅ สำเร็จ 100% |
| **8. ไซส์ฟอร์แมต UK และราคาแบบกำหนดเอง (UK Size & Price)** | • กำหนดฟอร์แมตไซส์รองเท้าเป็น **UK** เสมอ (เช่น `8.5 UK`, `9 UK`, `10 UK`)<br>• ระบบ Auto-format ตรวจจับและเติม ` UK` ให้อัตโนมัติหากผู้ใช้พิมพ์เฉพาะตัวเลข<br>• ปุ่มชิปเลือกไซส์ UK ด่วน (`6 UK` ถึง `12 UK`)<br>• ช่องระบุราคาตัวเลข (THB) พร้อมเชื่อมต่อสร้างเรคคอร์ดในตาราง `product_detail` อัตโนมัติ | ✅ สำเร็จ 100% |
| **9. การแสดงผลหน้าบ้านแบบเรียลไทม์ (Customer Pages Sync)** | • **หน้าแคตตาล็อกสินค้า (`/products`):** เมนูหมวดหมู่ใน Sidebar และ Badge สรุปหัวเว็บดึงหมวดหมู่ไดนามิกพร้อมตัวนับจำนวนสินค้า, ตัวกรองไซส์ UK คำนวณจากสินค้าจริงในระบบ<br>• **หน้าหลัก (`/`):** แถบ Pill หมวดหมู่ใน Product Showcase ดึงหมวดหมู่ใหม่แบบไดนามิก และกรองสินค้าได้ทันที<br>• **หน้า Admin Website (`/admin/website`):** ตัวเลือกสินค้าเด่นดึงสินค้าใหม่ที่เพิ่งเพิ่มเข้ามาได้ทันที | ✅ สำเร็จ 100% |
| **10. การแก้ไขปัญหาจอขาวและการ Hardening** | • แก้ไขบัคจอขาวจากการ Serialize React Icon Component ลง `localStorage`<br>• แก้ไขบัค Name Collision กับ Constructor `window.Image` ของเบราว์เซอร์<br>• กำหนด Type-only Import ตามมาตรฐาน `verbatimModuleSyntax` | ✅ สำเร็จ 100% |

---

## 2. โครงสร้างไฟล์และสถาปัตยกรรมระบบ (Architecture & Key Files)

```
d:/intern-basic-sadida/
├── client/                                # แอปพลิเคชันฝั่งหน้าบ้าน (Vite + React + TS)
│   ├── public/images/                     # โฟลเดอร์เก็บรูปภาพสินค้าและโลโก้
│   │   ├── shoe_runner_1.jpg ...          # ภาพสต็อกดั้งเดิม
│   │   └── shoe_custom_*.jpg/png          # ภาพที่แอดมินอัปโหลดเข้ามาใหม่
│   └── src/
│       ├── components/
│       │   ├── CustomDropdown.tsx         # [ใหม่] คอมโพเนนต์ดรอปดาวน์ Neo-Minimalist UI
│       │   ├── Navbar.tsx                 # แถบเมนูด้านบน (ดึงโลโก้, ชื่อแบรนด์, Announcement Bar สด)
│       │   ├── Footer.tsx                 # ท้ายเว็บ (ดึงโลโก้, ชื่อแบรนด์, คำบรรยาย สด)
│       │   ├── ProductShowcase.tsx        # ส่วนสไลด์สินค้าหน้าแรก (หมวดหมู่ไดนามิก + กรองสินค้าเด่น)
│       │   └── ProductCard.tsx            # การ์ดแสดงข้อมูลสินค้าและปุ่มสั่งซื้อ
│       ├── config/
│       │   └── websiteConfig.ts           # [ใหม่] State กลาง, Type Definition, และ Custom Hook useWebsiteConfig()
│       ├── utils/
│       │   └── productStore.ts            # [ใหม่] แคชสินค้า/หมวดหมู่ และฟังก์ชันเชื่อมต่อ API ส่วนกลาง
│       ├── pages/
│       │   ├── HomePage.tsx               # หน้าแรก (Hero, Story, Showcase ซิงค์กับแอดมิน)
│       │   ├── ProductsPage.tsx           # หน้าร้านค้า (หมวดหมู่ไดนามิก + ตัวกรองไซส์ UK ไดนามิก)
│       │   ├── ContactPage.tsx            # หน้าติดต่อเรา (Interactive Google Maps สด)
│       │   └── admin/
│       │       ├── AdminLogin.tsx         # หน้าล็อกอินแอดมิน (รองรับ Username & Tel)
│       │       ├── AdminWebsite.tsx       # หน้าปรับแต่งเว็บไซต์ (แบรนด์, โลโก้, ปักหมุดแผนที่, สินค้าเด่น)
│       │       └── AdminProducts.tsx      # หน้าจัดการสินค้า (อัปโหลดรูป, เพิ่มหมวดหมู่, ไซส์ UK, Custom Price)
│       └── types/
│           └── index.ts                   # ประกาศ Type Product และ CategoryFilter (รองรับ string ไดนามิก)
│
├── server/                                # เซิร์ฟเวอร์และ API ฝั่งหลังบ้าน (Bun + Hono + Drizzle ORM)
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.ts                  # โครงสร้างฐานข้อมูล PostgreSQL (product, product_detail, category ฯลฯ)
│   │   │   └── index.ts                   # Database Client Connection
│   │   ├── routes/
│   │   │   ├── adminProducts.ts           # [ปรับปรุง] API สินค้า, หมวดหมู่, อัปโหลดภาพ, product-details
│   │   │   └── auth.ts                    # [ปรับปรุง] API ตรวจสอบสิทธิ์รองรับ Username / Phone
│   │   └── index.ts                       # Entry point ของ Server
│   └── package.json
└── guide/                                 # โฟลเดอร์คู่มือและเอกสารการส่งมอบงาน
    ├── requirement.md                     # ข้อกำหนดดั้งเดิมของระบบ
    └── handoff-website-customization.md   # [เอกสารนี้] คู่มือส่งมอบงานระบบปรับแต่งเว็บไซต์และสินค้า
```

---

## 3. รายละเอียดการทำงานของแต่ละฟังก์ชันหลัก

### 3.1 การปรับแต่งแบรนด์และอัตลักษณ์ (Brand & Logo Upload)
- **ตำแหน่งหน้าจอ:** `/admin/website` (แท็บ "แบรนด์ & โลโก้")
- **การอัปโหลดไฟล์รูปภาพจากเครื่อง:**
  - แอดมินสามารถคลิกปุ่ม **"เลือกไฟล์จากเครื่อง (Upload Photo)"**
  - ใช้ `FileReader` อ่านภาพ แปลงเป็น Base64 Data URL และบีบอัดขนาดให้อัตโนมัติ
  - รองรับการเลือกจากคลังภาพสำเร็จรูปที่มีอยู่เดิม หรือระบุ URL ได้อิสระ
  - มี **Live Header Preview** ด้านล่างฟอร์ม แสดงตัวอย่าง Navbar และ Top Notice สดๆ ทันทีที่พิมพ์

### 3.2 แผนที่ Google Maps แบบ Interactive (Click-to-Pin)
- **ตำแหน่งหน้าจอ:** `/admin/website` (แท็บ "หน้าติดต่อเรา")
- **ความสามารถ:**
  1. **Direct Coordinate Inputs:** ช่องป้อนค่า `Latitude` (เช่น `13.7380`) และ `Longitude` (เช่น `100.5630`) แบบตัวเลขทศนิยม
  2. **Click-to-Pin Canvas:** แผนที่จำลองแบบ Interactive แอดมินสามารถคลิกจุดใดก็ได้บนผืนผ้าใบเพื่อย้ายตำแหน่งหมุดพิกัดสดๆ
  3. **GPS Current Location:** กดปุ่มเพื่อดึงพิกัดปัจจุบันของอุปกรณ์ผ่านเบราว์เซอร์ `navigator.geolocation`
  4. **5 Quick Presets:** ปุ่มกดเลือกพิกัดสำคัญด่วน:
     - *อโศก (สุขุมวิท 21)*: `13.7380, 100.5630`
     - *สยามสแควร์ (ปทุมวัน)*: `13.7445, 100.5300`
     - *เซ็นทรัลเวิลด์ (ราชประสงค์)*: `13.7466, 100.5393`
     - *ไอคอนสยาม (คลองสาน)*: `13.7267, 100.5108`
     - *เชียงใหม่ (นิมมานฯ)*: `18.7961, 98.9699`
  5. **Map Controls & Preview:** ปรับความซูมแผนที่ (Zoom 10-19), ใส่ Google Maps API Key, และแสดงผลใน `ContactPage.tsx` แบบ Google Maps Embed แท้จริง

### 3.3 การคัดเลือกสินค้าแนะนำหน้าแรก (Featured Products Selector)
- **ตำแหน่งหน้าจอ:** `/admin/website` (แท็บ "หน้าหลัก")
- **ความสามารถ:**
  - แสดงการ์ดสินค้าทั้งหมดที่มีในระบบ พร้อมรูป ชื่อ หมวดหมู่ และราคา
  - **เชื่อมต่อกับระบบสินค้าแบบเรียลไทม์:** เมื่อแอดมินเพิ่มสินค้าใหม่ในหน้า `/admin/products` สินค้าชิ้นนั้นจะปรากฏในรายการนี้ทันทีโดยไม่ต้องแก้โค้ด
  - ติ๊กถูกเลือกแสดงเฉพาะชิ้นที่ต้องการ หรือกดปุ่ม "เลือกทั้งหมด" / "ล้างการเลือก"
  - สินค้าที่เลือกจะถูกส่งไปแสดงผลในสไลด์ 3 การ์ดของ `ProductShowcase.tsx` ในหน้าแรก

### 3.4 หน้าจัดการสินค้า: อัปโหลดรูป, ดรอปดาวน์ UI, เพิ่มหมวดหมู่ และไซส์ UK
- **ตำแหน่งหน้าจอ:** `/admin/products`
- **1. ดรอปดาวน์ Neo-Minimalist UI:**
  - สร้างคอมโพเนนต์ [`CustomDropdown.tsx`](file:///d:/intern-basic-sadida/client/src/components/CustomDropdown.tsx) มาแทนที่ `<select>` เดิมที่แสดงแถบสีน้ำเงิน OS Windows
  - สไตล์ขาว-ดำ ขอบคมชัด เงาบล็อกหนาตามเอกลักษณ์ของ Sadida
- **2. เพิ่มหมวดหมู่สินค้าใหม่:**
  - ปุ่ม `+ เพิ่มหมวดหมู่` ข้างปุ่ม `add สินค้า`
  - ป้อนรหัสหมวดหมู่ (เช่น `cg_3`) และชื่อหมวดหมู่ (เช่น `รองเท้าบาสเก็ตบอล`)
  - บันทึกลงตาราง `category` ในฐานข้อมูล และกระจายสู่หน้าต่างร้านค้าทันที
- **3. อัปโหลดรูปภาพสินค้าจากเครื่อง:**
  - อัปโหลดไฟล์รูปภาพรองเท้าจากเครื่องคอมพิวเตอร์ ระบบจะส่งรูปภาพไปยัง Endpoint `/api/admin/products/upload`
  - ฝั่งเซิร์ฟเวอร์จะเซฟไฟล์ลงในโฟลเดอร์ภาพของเว็บ (`client/public/images/shoe_custom_*.ext`) และส่ง Path ขนาดกะทัดรัดกลับมาเก็บลง PostgreSQL
- **4. ไซส์ฟอร์แมต UK และราคา:**
  - กำหนดขนาดรองเท้าในรูปแบบ `UK` เสมอ (เช่น `8.5 UK`, `9 UK`) มีระบบ Auto-Format เติมคำว่า ` UK` อัตโนมัติหากป้อนเฉพาะตัวเลข
  - มีปุ่มชิปเลือกขนาด UK ด่วน (`6 UK` ถึง `12 UK`)
  - ช่องป้อนราคาตัวเลข (THB)
  - ระบบจะสร้างเรคคอร์ดขนาดและราคาในตาราง `product_detail` ให้โดยอัตโนมัติ

### 3.5 การแสดงผลแบบไดนามิกในหน้าร้านค้าและหน้าแรก
- **หน้าแคตตาล็อกสินค้า ([`ProductsPage.tsx`](file:///d:/intern-basic-sadida/client/src/pages/ProductsPage.tsx)):**
  - แถบ Sidebar ด้านซ้ายและ Badge สรุปหัวเว็บจะดึงหมวดหมู่ใหม่ที่แอดมินสร้างขึ้นมาแสดงผลอัตโนมัติ พร้อมแสดงจำนวนสินค้าที่มีอยู่ในแต่ละหมวดหมู่อย่างแม่นยำ
  - ตัวกรองขนาดรองเท้า (UK Size Grid) จะสแกนหาขนาดรองเท้า UK ทั้งหมดจากสินค้าที่มีอยู่จริงในฐานข้อมูลมาแสดงเป็นปุ่มตัวกรองให้ผู้ใช้กดเลือก
- **หน้าหลัก ([`ProductShowcase.tsx`](file:///d:/intern-basic-sadida/client/src/components/ProductShowcase.tsx)):**
  - แถบหมวดหมู่ (Pills) จะแสดงหมวดหมู่ใหม่ที่แอดมินเพิ่มขึ้นมาโดยอัตโนมัติ ผู้ใช้สามารถกดกรองดูสินค้าในหมวดหมู่นั้นๆ ได้ทันที

---

## 4. ข้อมูล API Endpoints (Backend API Specifications)

### 4.1 หมวดสินค้าและหมวดหมู่ (`server/src/routes/adminProducts.ts`)

#### 1. รายการสินค้าทั้งหมด
- **Endpoint:** `GET /api/admin/products`
- **คำอธิบาย:** ดึงรายการสินค้าทั้งหมดพร้อม JOIN ข้อมูลขนาด (`prodetailSize`), ราคา (`price`), และชื่อหมวดหมู่ (`categoryName`)

#### 2. เพิ่มสินค้าใหม่
- **Endpoint:** `POST /api/admin/products`
- **Request Body:**
  ```json
  {
    "proId": "pro_007",
    "proName": "Sadida Street UK Edition",
    "description": "รองเท้าแนวสตรีท ทรงสวย พื้นนุ่ม เบาสบาย",
    "prodetailId": "pd_007",
    "categoryId": "cg_1",
    "img": "/images/shoe_custom_1730000000.jpg"
  }
  ```

#### 3. แก้ไขสินค้า
- **Endpoint:** `PUT /api/admin/products/:proId`
- **Request Body:** รองรับการแก้ไข `proName`, `description`, `prodetailId`, `categoryId`, `img`

#### 4. ลบสินค้า
- **Endpoint:** `DELETE /api/admin/products/:proId`

#### 5. ดึงรายการหมวดหมู่ทั้งหมด *(เพิ่มใหม่)*
- **Endpoint:** `GET /api/admin/products/categories`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      { "categoryId": "cg_1", "categoryName": "รองเท้าวิ่ง" },
      { "categoryId": "cg_2", "categoryName": "รองเท้าเดิน" },
      { "categoryId": "cg_3", "categoryName": "รองเท้าบาสเก็ตบอล" }
    ]
  }
  ```

#### 6. เพิ่มหมวดหมู่ใหม่ *(เพิ่มใหม่)*
- **Endpoint:** `POST /api/admin/products/categories`
- **Request Body:**
  ```json
  {
    "categoryId": "cg_3",
    "categoryName": "รองเท้าบาสเก็ตบอล"
  }
  ```

#### 7. อัปโหลดรูปภาพสินค้าจากเครื่อง *(เพิ่มใหม่)*
- **Endpoint:** `POST /api/admin/products/upload`
- **คำอธิบาย:** รับ Base64 Data URL แปลงเป็นไฟล์ภาพบันทึกลง `client/public/images/shoe_custom_*.ext` และส่ง URL สั้นกลับมา
- **Request Body:**
  ```json
  {
    "dataUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "url": "/images/shoe_custom_1730012345678.jpg",
      "filename": "shoe_custom_1730012345678.jpg"
    }
  }
  ```

#### 8. สร้างหรือค้นหารายละเอียดไซส์ UK และราคา *(เพิ่มใหม่)*
- **Endpoint:** `POST /api/admin/products/product-details`
- **Request Body:**
  ```json
  {
    "prodetailSize": "9.5 UK",
    "price": 2490
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "prodetailId": "pd_008",
      "prodetailSize": "9.5 UK",
      "price": 2490
    }
  }
  ```

### 4.2 ระบบยืนยันตัวตน (`server/src/routes/auth.ts`)
- **Endpoint:** `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "identifier": "admin",
    "password": "your_secure_password"
  }
  ```
- **คำอธิบาย:** ช่อง `identifier` รองรับการกรอกทั้ง **Username** หรือ **หมายเลขโทรศัพท์ 10 หลัก**

---

## 5. การจัดการสถานะและการซิงค์ข้อมูล (State & Event Synchronization)

เพื่อความต่อเนื่องและความรวดเร็วในการแสดงผล ระบบใช้กลไก Hybrid ที่ผสานระหว่าง Database, LocalStorage และ Custom Events:

```
+-----------------------------------------------------------------------------------+
|                              ADMIN INTERFACE                                      |
|   - AdminWebsite.tsx (Brand / Logo / Map / Featured Products)                     |
|   - AdminProducts.tsx (Products / Image Upload / Categories / UK Sizes / Prices)  |
+-----------------------------------------------------------------------------------+
           |                                                      |
           v                                                      v
+-------------------------------+                     +-------------------------------+
|       BACKEND REST API        |                     |      LOCALSTORAGE CACHE       |
|  - PostgreSQL Database        |                     |  - 'sadida_website_config'    |
|  - File Upload Storage        |                     |  - 'sadida_products_catalog'  |
|                               |                     |  - 'sadida_categories_catalog'|
+-------------------------------+                     +-------------------------------+
           |                                                      |
           +--------------------------+---------------------------+
                                      |
                                      v
                       +-----------------------------+
                       |    BROWSER CUSTOM EVENTS    |
                       |  - sadida_website_config_   |
                       |    updated                  |
                       |  - sadida_products_updated  |
                       |  - sadida_categories_updated|
                       +-----------------------------+
                                      |
                                      v
+-----------------------------------------------------------------------------------+
|                              CUSTOMER PAGES                                       |
|   - Navbar.tsx (Live Logo & Notice)                                               |
|   - HomePage.tsx & ProductShowcase.tsx (Featured Products & Dynamic Pills)        |
|   - ProductsPage.tsx (Dynamic Category Sidebar & Dynamic UK Size Filter)          |
|   - ContactPage.tsx (Live Google Maps Embed)                                      |
+-----------------------------------------------------------------------------------+
```

---

## 6. สรุปประเด็นปัญหาสำคัญที่ได้รับการแก้ไข (Resolved Issues & Hardening)

1. **แก้ไขปัญหาจอขาวในหน้า Admin Website:**
   - *สาเหตุ:* มีการเก็บ React Icon Function Component ลงใน State เมื่อถูก `JSON.stringify()` ลง `localStorage` จะกลายเป็น `{}` ทำให้เกิดข้อผิดพลาด `Element type is invalid`
   - *การแก้ไข:* แยก Icon ออกจาก State ที่ต้องบันทึก และใช้ `PAGE_ICONS` lookup table แทน
2. **แก้ไขปัญหา Name Collision กับ `window.Image`:**
   - *สาเหตุ:* การ import `Image` จากไลบรารี `lucide-react` ไปชนกับ Native Constructor `window.Image`
   - *การแก้ไข:* เปลี่ยนชื่อเป็น `import { ImageIcon } from 'lucide-react'`
3. **แก้ไขปัญหาความยาวรูปภาพเกินในฐานข้อมูล:**
   - *สาเหตุ:* ฟิลด์ `product.img` ในตารางมีขนาด `varchar(200)` การเก็บ Base64 ขนาดใหญ่จะเกิดข้อผิดพลาด
   - *การแก้ไข:* สร้าง Endpoint `/api/admin/products/upload` เพื่อบันทึกไฟล์ภาพลงดิสก์แล้วเก็บเฉพาะ Path สั้น (`/images/...`)
4. **แก้ไขปัญหาดรอปดาวน์สีน้ำเงินของ OS Windows:**
   - *สาเหตุ:* Native HTML `<select>` ของเบราว์เซอร์ไม่สามารถจัดแต่งสีไฮไลต์ใน Windows ได้
   - *การแก้ไข:* พัฒนาคอมโพเนนต์ `CustomDropdown.tsx` ขึ้นมาทดแทนอย่างสมบูรณ์ในสไตล์ Neo-Minimalist
5. **แก้ไขข้อกำหนด TypeScript Verbatim Module Syntax:**
   - เพิ่ม `import type` สำหรับ Interface/Type ทั้งหมด เพื่อให้การคอมไพล์ผ่านอย่างถูกต้อง

---

## 7. ผลการทดสอบความถูกต้องของระบบ (Verification Results)

1. **การคอมไพล์ฝั่งไคลเอนต์ (Client Build Test):**
   ```bash
   bun run build
   # ผลลัพธ์:
   # $ tsc -b && vite build
   # ✓ 1958 modules transformed.
   # dist/assets/index-B9fBZCdF.css   50.01 kB
   # dist/assets/index-CZxAyiLv.js   453.05 kB
   # ✓ built in 518ms
   # Status: Exit code 0 (สำเร็จสมบูรณ์ ไร้ข้อผิดพลาด)
   ```

2. **การตรวจสอบประเภทข้อมูลฝั่งเซิร์ฟเวอร์ (Server Type Check):**
   ```bash
   bun x tsc --noEmit
   # ผลลัพธ์:
   # Status: Exit code 0 (สำเร็จสมบูรณ์ ไร้ข้อผิดพลาด)
   ```

---

## 8. คำแนะนำสำหรับการดูแลและพัฒนาต่อในอนาคต (Future Maintenance Guide)

1. **การเพิ่มหมวดหมู่ใหม่:**
   - สามารถทำผ่านหน้า `/admin/products` โดยกดปุ่ม "เพิ่มหมวดหมู่" ได้ทันที ไม่จำเป็นต้องเข้าไปแก้ไขในฐานข้อมูลด้วยตนเอง
2. **การเพิ่มขนาดรองเท้า:**
   - ในหน้าเพิ่มหรือแก้ไขสินค้า สามารถพิมพ์ไซส์ใดๆ ก็ได้ เช่น `11.5` หรือ `12` ระบบจะแปลงเป็น `11.5 UK` หรือ `12 UK` ให้อัตโนมัติ และจะปรากฏในตัวกรองหน้าร้านค้าทันที
3. **การเปลี่ยนรูปภาพโลโก้หรือสินค้า:**
   - สามารถอัปโหลดไฟล์ตรงจากเครื่องได้ทันที รองรับทั้งไฟล์ `.png`, `.jpg`, `.jpeg`, `.webp`
4. **การรีเซ็ตการตั้งค่าเว็บไซต์:**
   - หากต้องการคืนค่าหน้าเว็บเริ่มต้น สามารถกดปุ่ม "รีเซ็ตเป็นค่าเริ่มต้น" ในหน้า `/admin/website` ได้ตลอดเวลา
