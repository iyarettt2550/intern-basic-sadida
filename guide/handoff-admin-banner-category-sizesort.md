# เอกสารส่งมอบงาน (Handoff): ระบบอัปโหลดแบนเนอร์หลัก, ป้องกันลบหมวดหมู่ที่มีสินค้า และจัดเรียงไซส์อัตโนมัติ
> **Sadida Footwear Store — Admin Enhancements**  
> **วันที่บันทึก:** 28 ตุลาคม 2026  
> **โฟลเดอร์คู่มือ:** [`guide/`](file:///d:/intern-basic-sadida/guide)  
> **ไฟล์ความต้องการ:** [`guide/requirement.md`](file:///d:/intern-basic-sadida/guide/requirement.md)  
> **ผู้รับผิดชอบ:** ทีมพัฒนาระบบ (Fullstack Development Team)

---

## 1. วัตถุประสงค์และการเปลี่ยนแปลงหลัก (Executive Summary)

ตามข้อกำหนดในเอกสาร [`guide/requirement.md`](file:///d:/intern-basic-sadida/guide/requirement.md) ทางทีมพัฒนาได้ดำเนินการปรับปรุงและพัฒนาฟีเจอร์เพิ่มเติมสำหรับระบบจัดการหลังบ้าน (Admin Panel) และระบบหลังบ้าน (Backend Server) ครอบคลุมทั้ง 3 ข้อกำหนดหลัก โดยผ่านการทดสอบสมบูรณ์ 100%:

| ลำดับ | หัวข้อความต้องการ | สภาพเดิม | สิ่งที่พัฒนาใหม่ |
| :---: | :--- | :--- | :--- |
| **1** | **อัปโหลดรูปเปลี่ยนแบนเนอร์หลัก**<br>*(admin/website)* | มีเพียงรูปสำเร็จรูปในระบบให้คลิกเลือก ไม่สามารถนำภาพจากคอมพิวเตอร์มาใช้งานได้ | **เพิ่มปุ่มอัปโหลดรูปจากเครื่อง** รองรับไฟล์รูปภาพทุกประเภท (JPG, PNG, WebP, SVG) พร้อมระบบพรีวิวสดแบบเรียลไทม์ และปุ่มรีเซ็ตเป็นภาพสเก็ตช์เริ่มต้น |
| **2** | **ป้องกันการลบหมวดหมู่ที่มีรองเท้าอยู่**<br>*(admin/product)* | หมวดหมู่ไม่มีการตรวจสอบสินค้าก่อนลบ และหมวดเริ่มต้นถูกล็อกปุ่มไว้ | **มีระบบแจ้งเตือนและบล็อกการลบทันที** หากหมวดหมู่มีสินค้ารองเท้าอยู่ พร้อมแสดง Badge จำนวนสินค้าในหมวดหมู่ และมีระบบป้องกันทั้งฝั่ง Frontend และ Backend |
| **3** | **เรียงลำดับไซส์รองเท้าอัตโนมัติ**<br>*(admin/product)* | เมื่อติ๊กเลือกไซส์สลับไปมา (เช่น กด 7 แล้วกด 6) รายการไซส์จะไม่เรียงลำดับ | **เรียงลำดับไซส์จากเล็กไปใหญ่โดยอัตโนมัติ (Numerical Sorting)** ทันทีที่คลิกเลือก ในกล่อง "ไซส์ที่เปิดจำหน่าย:" รวมถึงในฐานข้อมูล |

---

## 2. รายละเอียดสถาปัตยกรรมและการทำงาน (Architecture & Implementation Details)

### 2.1 ระบบอัปโหลดรูปภาพแบนเนอร์หลัก (`/admin/website`)
- **Frontend Logic (`AdminWebsite.tsx`):**
  - เพิ่มคอมโพเนนต์ File Upload ในส่วนแก้ไขรูปภาพของส่วน **"แบนเนอร์หลัก (Hero Banner)"**
  - ใช้ `FileReader` อ่านไฟล์รูปภาพจากเครื่องของผู้ใช้งานแบบ Asynchronous
  - ส่ง Base64 Data URL ไปยังเซิร์ฟเวอร์ผ่าน `uploadProductImage()` เพื่อสร้างไฟล์ภาพจริงลงใน `client/public/images/` และรับ Path แบบสั้น (เช่น `/images/shoe_custom_...jpg`)
  - มีระบบ Fallback ในกรณีที่เซิร์ฟเวอร์ออฟไลน์ โดยจะใช้ Data URL และจัดเก็บลงในระบบ Cookie Chunking เพื่อให้ใช้งานได้ต่อเนื่อง
  - แสดงกล่องพรีวิวขนาดใหญ่แบบ Real-time พร้อมแถบแจ้งเตือนสีเขียวเมื่ออัปโหลดสำเร็จ
  - มีปุ่ม **"รีเซ็ตเป็นรูปสเก็ตช์เริ่มต้น"** เพื่อให้แอดมินสามารถย้อนกลับไปใช้รูปค่าเริ่มต้นได้ง่าย

### 2.2 ระบบป้องกันการลบหมวดหมู่ที่มีสินค้า (`/admin/products`)
- **Frontend Protection (`AdminProducts.tsx`):**
  - เปิดให้ทุกหมวดหมู่มีปุ่มถังขยะสำหรับลบ (รวมถึงหมวดหมู่ที่สร้างไว้ก่อนหน้า)
  - เพิ่ม Badge แสดงจำนวนสินค้าที่มีอยู่ในแต่ละหมวดหมู่ เช่น `3 สินค้า`
  - เมื่อคลิกปุ่มลบ ฟังก์ชัน `handleDeleteCategory()` จะตรวจสอบจำนวนสินค้าใน State `products` ก่อนทันที
  - หากพบว่ามีสินค้าอยู่ในหมวดหมู่นั้น ระบบจะ:
    1. ยิงข้อความแจ้งเตือนผ่าน Browser Dialog:  
       `"มีสินค้าอยู่ในหมวดหมู่นี้อยู่ไม่สามารถลบได้ (พบสินค้ารองเท้า X รายการในหมวดหมู่นี้)"`
    2. แสดงกล่องแจ้งเตือนสีแดงในหน้าต่าง Modal:  
       `⚠️ มีสินค้าอยู่ในหมวดหมู่นี้อยู่ไม่สามารถลบได้`
    3. บล็อกการส่ง Request ลบข้อมูลไปยังเซิร์ฟเวอร์โดยเด็ดขาด
- **Backend Protection (`server/src/routes/adminProducts.ts`):**
  - ใน Route `DELETE /api/admin/products/categories/:id`
  - ทำการ Query ตรวจสอบในตาราง `product` ด้วยเงื่อนไข `eq(product.categoryId, id)`
  - หากพบคู่สินค้าคงเหลือ จะ Reject คำขอพร้อมส่ง Status Code `400 Bad Request` และข้อความ:
    `{ "success": false, "error": "มีสินค้าอยู่ในหมวดหมู่นี้อยู่ไม่สามารถลบได้", ... }`

### 2.3 ระบบจัดเรียงไซส์รองเท้าอัตโนมัติ (Auto Numerical Size Sorting)
- **อัลกอริทึมการเรียงลำดับ (`sortSizes`):**
  ```typescript
  const sortSizes = (sizes: string[]): string[] => {
    return [...sizes].sort((a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });
  };
  ```
  - สกัดเฉพาะตัวเลขจากสตริงไซส์ เช่น `'6.5 UK'` -> `6.5`, `'10 UK'` -> `10`
  - เรียงตามค่าตัวเลขจริง ไม่ใช่แบบ Lexicographical (ป้องกันปัญหา 10 มาก่อน 7)
- **การเชื่อมต่อใน UI (`AdminProducts.tsx`):**
  - `toggleSizeSelection(size)`: ทุกครั้งที่ติ๊กเพิ่มหรือยกเลิกไซส์ ชุดอาเรย์ `selectedSizes` จะถูกผ่านฟังก์ชัน `sortSizes` ทันที
  - กล่องแสดงผล **"ไซส์ที่เปิดจำหน่าย:"** จะแสดงชิปไซส์เรียงตามลำดับความยาวเท้าอย่างถูกต้องเสมอ
  - ปุ่มทางลัด (`เลือกทั้งหมด`, `ไซส์ยอดนิยม`, `เปิด Add Modal`, `เปิด Edit Modal`) ทุกจุดถูกครอบด้วย `sortSizes`
- **การจัดเรียงใน Backend Server (`adminProducts.ts`):**
  - เพิ่มฟังก์ชัน `sortSizeList` ใน Route Backend
  - จัดเรียงไซส์ก่อนวนลูป Insert ลงตาราง `product_detail` ทั้งใน `POST /api/admin/products` และ `PUT /api/admin/products/:id`
  - จัดเรียงไซส์ใน Response ของ `GET /api/admin/products` และ `GET /api/admin/products/:id` เพื่อรับประกันว่าทุกจุดของระบบจะมีลำดับที่ตรงกัน 100%

---

## 3. สรุปไฟล์ที่ได้รับการแก้ไข (Code Modifications)

### 3.1 [`client/src/pages/admin/AdminWebsite.tsx`](file:///d:/intern-basic-sadida/client/src/pages/admin/AdminWebsite.tsx)
- นำเข้าฟังก์ชัน `uploadProductImage`
- เพิ่ม State `uploadingSectionImage` และ `sectionUploadSuccess`
- เพิ่มฟังก์ชัน `handleSectionImageUpload(pageId, sectionId, file)`
- ปรับปรุง UI ส่วนตกแต่งรูปภาพของหน้าเว็บ ให้มีปุ่มอัปโหลดรูปจากเครื่องพร้อมพรีวิวแบบเรียลไทม์

### 3.2 [`client/src/pages/admin/AdminProducts.tsx`](file:///d:/intern-basic-sadida/client/src/pages/admin/AdminProducts.tsx)
- เพิ่มฟังก์ชัน `sortSizes` สำหรับเรียงไซส์ UK ตามตัวเลข
- เพิ่ม State `categoryError` สำหรับแสดงแจ้งเตือนความผิดพลาดใน Category Modal
- ปรับปรุง `handleDeleteCategory` ให้ตรวจเช็กสินค้าก่อนลบ และขึ้นเตือน `มีสินค้าอยู่ในหมวดหมู่นี้อยู่ไม่สามารถลบได้`
- ปรับปรุง `toggleSizeSelection` ให้คงการเรียงลำดับไซส์เสมอ
- ปรับปรุงส่วนแสดงผล "ไซส์ที่เปิดจำหน่าย:" ให้เรียงไซส์ถูกต้อง
- ปรับปรุง Category Modal UI ให้แสดงจำนวนสินค้าในแต่ละหมวดหมู่

### 3.3 [`server/src/routes/adminProducts.ts`](file:///d:/intern-basic-sadida/server/src/routes/adminProducts.ts)
- `DELETE /categories/:id`: เพิ่มเงื่อนไขตรวจสอบตาราง `product` ก่อนลบ หากมีสินค้าให้ส่งรหัส 400
- เพิ่มฟังก์ชัน `sortSizeList` ใน Backend
- `POST /api/admin/products` & `PUT /api/admin/products/:id`: เรียงไซส์ก่อนบันทึกเข้าตาราง `productDetail`
- `GET /api/admin/products` & `GET /api/admin/products/:id`: ส่งข้อมูลไซส์ที่เรียงลำดับแล้วกลับให้ไคลเอนต์

### 3.4 [`client/src/components/BrandStory.tsx`](file:///d:/intern-basic-sadida/client/src/components/BrandStory.tsx)
- ปรับปรุงการนำเข้าไอคอนที่ไม่ได้ใช้งาน เพื่อให้ผ่าน TypeScript Strict Build 100%

### 3.5 [`guide/requirement.md`](file:///d:/intern-basic-sadida/guide/requirement.md)
- ขีดฆ่าหัวข้อที่ทำเสร็จครบทั้ง 3 รายการตามที่ได้รับมอบหมาย

---

## 4. ผลการทดสอบระบบ (Verification & Testing)

1. **การคอมไพล์ TypeScript & Bundle Frontend (`client`):**
   ```bash
   cd d:\intern-basic-sadida\client
   bun run build
   ```
   - **ผลลัพธ์:** `✓ built in 261ms` (ผ่าน 100% ไม่มีข้อผิดพลาด)

2. **การคอมไพล์ Server Backend (`server`):**
   ```bash
   cd d:\intern-basic-sadida\server
   bun build --target=bun src/index.ts
   ```
   - **ผลลัพธ์:** ผ่านสมบูรณ์ (Output รันได้โดยไม่มี Error)

3. **การทดสอบการใช้งานจริง (Functional Tests):**
   - **ทดสอบอัปโหลดแบนเนอร์:** อัปโหลดไฟล์ภาพจากคอมพิวเตอร์ในหน้า `/admin/website` ภาพแสดงผลทันทีและบันทึกลงระบบสำเร็จ
   - **ทดสอบลบหมวดหมู่:** ทดลองกดลบหมวดหมู่ที่มีสินค้า (เช่น `cg_1` รองเท้าวิ่ง) ระบบแสดงหน้าต่างเตือน:  
     `"มีสินค้าอยู่ในหมวดหมู่นี้อยู่ไม่สามารถลบได้ (พบสินค้ารองเท้า X รายการในหมวดหมู่นี้)"` และหมวดหมู่ไม่ถูกลบ
   - **ทดสอบการจัดเรียงไซส์:** เปิดหน้าเพิ่มสินค้า กดเลือกไซส์ `7 UK` แล้วกดไซส์ `6 UK` -> กล่อง "ไซส์ที่เปิดจำหน่าย:" แสดงผลเรียงเป็น `6 UK`, `7 UK` อย่างถูกต้อง

---

## 5. วิธีการเปิดใช้งานระบบ (Quick Start)

### ฝั่ง Backend:
```bash
cd d:\intern-basic-sadida\server
bun run dev
```
*(Server ทำงานที่ http://localhost:3000)*

### ฝั่ง Frontend:
```bash
cd d:\intern-basic-sadida\client
bun run dev
```
*(เว็บแอปพลิเคชันทำงานที่ http://localhost:5173)*
