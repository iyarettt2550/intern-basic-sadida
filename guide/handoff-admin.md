# เอกสารส่งมอบงานประจำวัน: ระบบหลังบ้านและการเชื่อมต่อฐานข้อมูล (Admin & Backend Handoff)

**โปรเจกต์:** เว็บไซต์จำหน่ายรองเท้า SADIDA (Sadida Footwear Store)  
**วันที่ดำเนินการ:** 26 ตุลาคม 2026  
**ผู้จัดทำ:** ทีมพัฒนาระบบ  
**เอกสารอ้างอิง:** [`guide/requirement.md`](./requirement.md), [`guide/handoff-today.md`](./handoff-today.md), [`guide/handoff-admin-auto-id-multi-size.md`](./handoff-admin-auto-id-multi-size.md)  

---

## 1. สรุปภาพรวมสิ่งที่พัฒนาเสร็จสิ้นในรอบนี้ (Executive Summary)

ในรอบการพัฒนานี้ ได้ดำเนินการตามความต้องการในเอกสาร [`requirement.md`](./requirement.md) ในส่วนของ **ระบบฐานข้อมูล (Database & Seeding)** และ **ระบบหลังบ้าน (Backend API สำหรับ Admin & Owner)** อย่างครบถ้วน เพื่อเตรียมพร้อมสำหรับการเชื่อมต่อกับ Frontend Admin Panel และการเชื่อมต่อหน้าบ้านเข้ากับฐานข้อมูลจริง

| โมดูลงาน | ขอบเขตการพัฒนา | สถานะ | รายละเอียด |
| :--- | :--- | :---: | :--- |
| **1. Database Seeding** | นำข้อมูล mock ทั้งหมดลง PostgreSQL จริง | ✅ สำเร็จ 100% | จัดเก็บ User Roles, Admin/Owner Users, Categories, 15 Product Details (ไซส์ UK), 6 รายการสินค้าพร้อม Binary Image และ Contacts |
| **2. Binary Image Storage** | จัดเก็บภาพจริงลงคอลัมน์ `bytea` | ✅ สำเร็จ 100% | แปลงไฟล์รูปภาพจริงใน `client/public/images/` เป็น `Uint8Array` ไบนารีลงฐานข้อมูล พร้อม Endpoint เสิร์ฟภาพ |
| **3. Auth API** | ระบบยืนยันตัวตน Admin & Owner | ✅ สำเร็จ 100% | ตรวจสอบเบอร์โทรและรหัสผ่าน พร้อมตรวจสอบสิทธิ์ Role (Admin / Customer) |
| **4. Admin Products API** | ระบบจัดการสินค้า CRUD + Stats | ✅ สำเร็จ 100% | ดึงรายการ, ดูรายตัว, เพิ่ม, แก้ไข, ลบ และดึงสถิติสินค้าสำหรับหน้า Dashboard |
| **5. Admin Contacts API** | จัดการข้อความติดต่อจากลูกค้า | ✅ สำเร็จ 100% | ดึงรายการข้อความทั้งหมด, ดูรายละเอียด, ลบข้อความ และสถิติสำหรับ Dashboard |
| **6. Server Route Registration** | เชื่อมต่อ Route ทั้งหมดใน Hono | ✅ สำเร็จ 100% | ตรวจสอบการคอมไพล์และรัน Server ผ่านสมบูรณ์ |

---

## 2. รายละเอียดการพัฒนาเชิงลึก (Implementation Details)

### 2.1 การนำข้อมูลทั้งหมดเข้าสู่ฐานข้อมูล (Database Seeding)
ไฟล์แก้ไข: [`server/src/db/seed.ts`](file:///d:/intern-basic-sadida/server/src/db/seed.ts)
- **User Roles (`user_roles`)**:
  - `r_1`: Admin
  - `r_2`: Customer
- **ผู้ใช้งานระบบ (`users`)**:
  - **Admin**: `usersId: "u_1"`, ชื่อ "ผู้ดูแลระบบ Sadida", เบอร์โทร `0812345678`, รหัสผ่าน `admin1234`
  - **Owner**: `usersId: "u_2"`, ชื่อ "เจ้าของร้าน Sadida", เบอร์โทร `0898765432`, รหัสผ่าน `owner1234`
- **หมวดหมู่สินค้า (`categories`)**:
  - `cg_1`: รองเท้าวิ่ง
  - `cg_2`: รองเท้าเดิน
- **รายละเอียดสินค้าและราคา (`product_detail`)**:
  - จัดเก็บขนาด 15 ไซส์ ตั้งแต่ `6 UK` ถึง `13 UK` ราคา ฿1,000 ถึง ฿2,400 บาท
- **สินค้ารองเท้าพร้อมรูปภาพจริง (`product`)**:
  - แปลงรูปภาพรองเท้าจริงจากไฟล์ `client/public/images/shoe_runner_*.jpg` และ `shoe_walking_*.jpg` ให้เป็นไบนารี (`Uint8Array`) บันทึกลงคอลัมน์ `img` (`bytea`) ตรงตามข้อกำหนดใน requirement ที่ไม่เก็บเป็น URL path แต่เก็บเป็นข้อมูลไฟล์จริงในฐานข้อมูล
- **ข้อความติดต่อ (`contacts`)**:
  - ข้อมูลตัวอย่าง 3 รายการ พร้อมข้อมูลชื่อ อีเมล เบอร์โทร หัวข้อ และข้อความ

---

### 2.2 โครงสร้าง Backend API ที่พัฒนาขึ้นใหม่ (New RESTful APIs)

#### A. Authentication API (`/api/auth`)
ไฟล์: [`server/src/routes/auth.ts`](file:///d:/intern-basic-sadida/server/src/routes/auth.ts)
- `POST /api/auth/login`
  - **Request Body:** `{ phone: string, password: string }`
  - **Validator:** `loginSchema` (ตรวจสอบเบอร์โทร 9-10 หลัก และรหัสผ่านขั้นต่ำ 6 ตัวอักษร)
  - **การทำงาน:** ค้นหาผู้ใช้จากตาราง `users` ร่วมกับ `user_roles` ตรวจสอบรหัสผ่าน และส่งคืนข้อมูลผู้ใช้พร้อมบทบาทสิทธิ์ (Admin / Owner)
- `GET /api/auth/me`
  - ตรวจสอบสถานะการล็อกอินของผู้ใช้ปัจจุบัน

#### B. Admin Product Management API (`/api/admin/products`)
ไฟล์: [`server/src/routes/adminProducts.ts`](file:///d:/intern-basic-sadida/server/src/routes/adminProducts.ts)
- `GET /api/admin/products`
  - ดึงรายการสินค้าทั้งหมด พร้อม JOIN ข้อมูลหมวดหมู่ (`categories`) และรายละเอียดขนาด/ราคา (`product_detail`)
- `GET /api/admin/products/stats`
  - สรุปตัวเลขสถิติสินค้าสำหรับหน้า Dashboard:
    - จำนวนสินค้าทั้งหมด (`totalProducts`)
    - จำนวนสินค้าแยกตามหมวดหมู่ วิ่ง / เดิน (`byCategory`)
    - จำนวนไซส์สินค้าที่มีในระบบ (`totalSizes`)
- `GET /api/admin/products/:id`
  - ดึงรายละเอียดสินค้าชิ้นเดียวตาม `proId`
- `GET /api/admin/products/:id/image`
  - เสิร์ฟรูปภาพไบนารีจาก `img` (`bytea`) ออกมาเป็นภาพจริง พร้อมตั้งค่า Header `Content-Type: image/jpeg` และ Cache Headers
- `POST /api/admin/products`
  - เพิ่มสินค้ารองเท้าใหม่ลงฐานข้อมูล
- `PUT /api/admin/products/:id`
  - แก้ไขข้อมูลสินค้า (ชื่อ, คำอธิบาย, ไซส์/ราคา, หมวดหมู่)
- `DELETE /api/admin/products/:id`
  - ลบสินค้าออกจากระบบ

#### C. Admin Contact Inbox API (`/api/admin/contacts`)
ไฟล์: [`server/src/routes/adminContacts.ts`](file:///d:/intern-basic-sadida/server/src/routes/adminContacts.ts)
- `GET /api/admin/contacts`
  - ดึงรายการข้อความติดต่อทั้งหมด เรียงลำดับจากล่าสุดไปเก่าสุด
- `GET /api/admin/contacts/stats`
  - สรุปสถิติจำนวนข้อความติดต่อทั้งหมด (`totalContacts`) และข้อความล่าสุด
- `GET /api/admin/contacts/:id`
  - ดูรายละเอียดข้อความติดต่อรายคน (`name`, `email`, `phone`, `subject`, `message`, `createdAt`)
- `DELETE /api/admin/contacts/:id`
  - ลบข้อความติดต่อ

---

### 2.3 การเชื่อมโยง Router บน Server
ไฟล์แก้ไข: [`server/src/index.ts`](file:///d:/intern-basic-sadida/server/src/index.ts)
- นำเข้าและลงทะเบียน Route:
  ```ts
  app.route("/api/auth", authRouter);
  app.route("/api/admin/products", adminProductsRouter);
  app.route("/api/admin/contacts", adminContactsRouter);
  ```
- ทดสอบการรัน Server ผ่าน Bun Hono ทำงานได้อย่างถูกต้องบนพอร์ต 3000

---

## 3. รายการไฟล์ที่สร้างและแก้ไข (Modified & Created Files)

| ไฟล์ที่แก้ไข / สร้างใหม่ | หน้าที่การทำงาน |
| :--- | :--- |
| [`server/src/index.ts`](file:///d:/intern-basic-sadida/server/src/index.ts) | ลงทะเบียนเส้นทาง API สำหรับ Auth และ Admin ทั้งหมด |
| [`server/src/validators/index.ts`](file:///d:/intern-basic-sadida/server/src/validators/index.ts) | เพิ่ม `loginSchema` สำหรับตรวจสอบข้อมูลล็อกอินของ Admin |
| [`server/src/db/seed.ts`](file:///d:/intern-basic-sadida/server/src/db/seed.ts) | เพิ่มฟังก์ชันแปลงภาพเป็นไบนารี และเพิ่มข้อมูลเริ่มต้นครบทุกตาราง |
| [`server/src/routes/auth.ts`](file:///d:/intern-basic-sadida/server/src/routes/auth.ts) | **[สร้างใหม่]** API ตรวจสอบสิทธิ์และล็อกอินของ Admin/Owner |
| [`server/src/routes/adminProducts.ts`](file:///d:/intern-basic-sadida/server/src/routes/adminProducts.ts) | **[สร้างใหม่]** API สำหรับจัดการสินค้า (CRUD) สถิติ และเสิร์ฟภาพไบนารี |
| [`server/src/routes/adminContacts.ts`](file:///d:/intern-basic-sadida/server/src/routes/adminContacts.ts) | **[สร้างใหม่]** API สำหรับจัดการข้อความติดต่อจากลูกค้าและสถิติ |

---

## 4. บัญชีผู้ใช้สำหรับการทดสอบเข้าสู่ระบบ (Test Credentials)

| บทบาท (Role) | เบอร์โทรศัพท์ (Phone / Login) | รหัสผ่าน (Password) | สิทธิ์การเข้าถึง |
| :--- | :---: | :---: | :--- |
| **Admin** | `0812345678` | `admin1234` | ดูแลจัดการสินค้า, ข้อความติดต่อ, สถิติหลังบ้าน |
| **Owner** | `0898765432` | `owner1234` | สิทธิ์สูงสุด ดูแลหลังบ้านและปรับแต่งเลย์เอาต์เว็บไซต์ |

---

## 5. วิธีการทดสอบและรันระบบ Backend (How to Run & Verify)

### รัน Server หลังบ้าน:
```bash
cd server
bun run dev
```
หรือรันคำสั่ง Seeding เพื่ออัปเดตข้อมูล:
```bash
cd server
bun run src/db/seed.ts
```

### การทดสอบ API Endpoints:
- Health Check: `GET http://localhost:3000/`
- ข้อมูลหมวดหมู่: `GET http://localhost:3000/api/categories`
- ข้อมูลสินค้าสำหรับหน้าบ้าน: `GET http://localhost:3000/api/products`
- ดึงรูปภาพสินค้า: `GET http://localhost:3000/api/admin/products/pro_001/image`
- สถิติสินค้า Dashboard: `GET http://localhost:3000/api/admin/products/stats`
- สถิติข้อความ Dashboard: `GET http://localhost:3000/api/admin/contacts/stats`

---

## 6. งานที่ต้องดำเนินการต่อในขั้นตอนถัดไป (Next Steps)

ตามข้อกำหนดใน [`guide/requirement.md`](./requirement.md) ขั้นตอนต่อไปคือการสร้างส่วนแสดงผลของ **Admin Panel ฝั่ง Frontend**:

1. **หน้าเข้าสู่ระบบแอดมิน (Admin Login Page - `/admin/login`)**:
   - ฟอร์มเข้าสู่ระบบด้วยเบอร์โทรและรหัสผ่าน ในโทนสีขาว-ดำ สไตล์เดียวกับหน้าบ้าน
   - จัดเก็บ Token / Session ใน LocalStorage หรือ State Management
2. **หน้าแดชบอร์ดแอดมิน (Admin Dashboard - `/admin/dashboard`)**:
   - การ์ดสถิติ (Total Products, Total Inquiries, Categories)
   - กราฟสรุปสถิติ (ยอดข้อความติดต่อรายวัน, สัดส่วนประเภทรองเท้าวิ่ง vs เดิน)
3. **หน้าจัดการสินค้า (Admin Products Management - `/admin/products`)**:
   - ตารางแสดงรายการสินค้าพร้อมรูปภาพ, ไซส์, ราคา, หมวดหมู่
   - ป็อปอัป Modal เพิ่ม/แก้ไขสินค้า พร้อมระบบอัปโหลดรูปภาพ
   - ปุ่มลบสินค้าพร้อมกล่องยืนยัน
4. **หน้าจัดการข้อความติดต่อ (Admin Contact Inquiries - `/admin/contacts`)**:
   - ตารางแสดงข้อความที่ลูกค้าส่งเข้ามา
   - หน้าต่างดูรายละเอียดข้อความฉบับเต็ม และปุ่มลบข้อความ
5. **หน้าจัดการเลย์เอาต์และปรับแต่งเว็บไซต์ (Site Customizer - `/admin/layout`)**:
   - จัดการสลับบล็อก Grid Layout ของหน้าแรก, หน้าสินค้า และหน้าติดต่อ
6. **เชื่อมโยงหน้าบ้าน (Public Store) เข้ากับ Backend API จริง**:
   - ปรับ `client/src/pages/HomePage.tsx` และ `ProductsPage.tsx` ให้ Fetch ข้อมูลจาก `/api/products` แทน Mock Data
