# 👟 Sadida — E-Commerce Shoe Platform

ระบบเว็บไซต์ร้านค้าออนไลน์และระบบจัดการสินค้าหลังบ้าน (E-Commerce & Admin Backoffice) สำหรับแบรนด์รองเท้า **Sadida** พัฒนาด้วยสถาปัตยกรรมแบบ Monorepo แยกฝั่ง Frontend และ Backend อย่างชัดเจน เพื่อประสิทธิภาพ ความปลอดภัย และการดูแลรักษาที่ง่าย

---

## 📑 สารบัญ (Table of Contents)

1. [ภาพรวมของระบบและบทบาทผู้ใช้งาน (System Overview & User Roles)](#1-ภาพรวมของระบบและบทบาทผู้ใช้งาน)
2. [โครงสร้างโปรเจกต์ (Project Structure)](#2-โครงสร้างโปรเจกต์)
3. [ความต้องการของระบบ (System Requirements)](#3-ความต้องการของระบบ)
4. [ขั้นตอนการติดตั้งและเริ่มใช้งาน (Getting Started)](#4-ขั้นตอนการติดตั้งและเริ่มใช้งาน)
5. [การจัดการฐานข้อมูล (Database & Drizzle ORM)](#5-การจัดการฐานข้อมูล)
6. [ตารางสรุป API Endpoints (API Endpoints Summary)](#6-ตารางสรุป-api-endpoints)
7. [สถาปัตยกรรมความปลอดภัยและการคำนวณรายรับ (Security & Revenue Calculation)](#7-สถาปัตยกรรมความปลอดภัยและการคำนวณรายรับ)

---

## 1. ภาพรวมของระบบและบทบาทผู้ใช้งาน

ระบบ Sadida แบ่งฟังก์ชันการทำงานหลักออกเป็น 2 ส่วน:
1. **หน้าร้าน (Storefront):** หน้าแรก (Landing Page), โชว์รูมสินค้า, เลือกรองเท้าตามหมวดหมู่, ดูรายละเอียดและไซส์รองเท้า (UK Size) และแบบฟอร์มติดต่อสอบถาม
2. **ระบบหลังบ้าน (Admin Backoffice):** แดชบอร์ดสรุปสถิติ, จัดการสินค้า (CRUD), เพิ่ม/ลบหมวดหมู่สินค้า, จัดการขนาดรองเท้า, อัปโหลดภาพแบนเนอร์และภาพสินค้า, และกล่องข้อความติดต่อจากลูกค้า

### บทบาทผู้ใช้งาน (User Roles)
ระบบควบคุมสิทธิ์ผ่านตาราง `user_roles`:

| Role ID | ชื่อบทบาท (Role Name) | ขอบเขตหน้าที่และสิทธิ์การใช้งาน |
| :--- | :--- | :--- |
| `r_1` | **Admin / ผู้ดูแลระบบ** | เข้าใช้งานระบบหลังบ้าน (`/admin/*`), ดูสถิติ Dashboard, เพิ่ม/แก้ไข/ลบสินค้า, จัดการหมวดหมู่, ปรับแต่งหน้าเว็บ และตรวจสอบ/ลบข้อความติดต่อ |
| `r_2` | **Customer / ลูกค้าทั่วไป** | เข้าชมเว็บไซต์หน้าร้าน, ค้นหาและกรองรองเท้าตามหมวดหมู่, ดูรายละเอียดสินค้าและไซส์ที่มีจำหน่าย, ส่งข้อความติดต่อผ่านฟอร์ม Contact Us |

---

## 2. โครงสร้างโปรเจกต์

โปรเจกต์ใช้โครงสร้าง Monorepo โดยแบ่งออกเป็น 2 แอปพลิเคชันหลัก:

```text
intern-basic-sadida/
├── client/                     # Frontend Application (React 19 + Vite + Tailwind CSS v4)
│   ├── public/                 # Static assets (เช่น รูปภาพรองเท้า, _redirects)
│   ├── src/
│   │   ├── api/                # ฟังก์ชันเชื่อมต่อ RESTful API
│   │   ├── components/         # คอมโพเนนต์ UI (Navbar, Footer, ProductCard, etc.)
│   │   │   └── admin/          # คอมโพเนนต์เฉพาะระบบหลังบ้าน (AdminSidebar, etc.)
│   │   ├── config/             # การตั้งค่าเว็บไซต์ (websiteConfig.ts)
│   │   ├── pages/              # หน้าเว็บ (Home, Products, Contact)
│   │   │   └── admin/          # หน้าเว็บหลังบ้าน (Dashboard, Products, Contacts, Login)
│   │   ├── types/              # TypeScript Types / Interfaces
│   │   └── utils/              # ตัวช่วยจัดการ Cookies, Stores, Data formatters
│   ├── package.json
│   └── vite.config.ts
│
├── server/                     # Backend API (Bun + Hono + Drizzle ORM)
│   ├── drizzle/                # ไฟล์ SQL Migration
│   ├── src/
│   │   ├── db/                 # การเชื่อมต่อ Database, Schemas, และ Seed data
│   │   │   ├── index.ts        # Database Client (Postgres.js + Drizzle)
│   │   │   ├── schema.ts       # Drizzle Schema Definition
│   │   │   └── seed.ts         # Mock Data Seeding Script
│   │   ├── routes/             # Hono Routers (auth, products, categories, contacts)
│   │   ├── validators/         # Zod Schemas สำหรับ Request Validation
│   │   └── index.ts            # Server Entrypoint & Global Middlewares
│   ├── drizzle.config.ts       # การตั้งค่า Drizzle Kit
│   └── package.json
│
├── API.md                      # เอกสารคู่มือ API ฉบับสมบูรณ์ พร้อมตัวอย่าง Payload
├── requests.http               # ไฟล์ทดสอบ HTTP Request สำหรับ VS Code REST Client
├── vercel.json                 # การตั้งค่า Deploy บน Vercel Multi-service
└── README.md                   # เอกสารคู่มือโครงการ
```

---

## 3. ความต้องการของระบบ

โปรดตรวจสอบว่าเครื่องคอมพิวเตอร์ของคุณมีสภาพแวดล้อมดังต่อไปนี้:
- **Runtime:** [Bun](https://bun.sh/) (แนะนำเวอร์ชัน 1.1 หรือใหม่กว่า)
- **Node.js:** เวอร์ชัน 18+ ขึ้นไป (สำหรับเครื่องมือ npm/npx)
- **Database:** [PostgreSQL](https://www.postgresql.org/) เวอร์ชัน 14+ (กรณีรัน Local) หรือ [Neon Serverless Postgres](https://neon.tech/) (กรณีใช้ Cloud Database)
- **Web Browser:** Google Chrome, Microsoft Edge, Safari หรือ Firefox เวอร์ชันล่าสุด

---

## 4. ขั้นตอนการติดตั้งและเริ่มใช้งาน

### 4.1 การติดตั้ง Dependencies
เปิด Terminal ในโฟลเดอร์หลักของโปรเจกต์ แล้วติดตั้งแพ็กเกจทั้งสองส่วน:

```bash
# 1. ติดตั้ง Dependencies ฝั่ง Backend
cd server
bun install

# 2. ติดตั้ง Dependencies ฝั่ง Frontend
cd ../client
npm install   # หรือ bun install
```

### 4.2 การตั้งค่า Environment Variables (`.env`)
กำหนดค่าไฟล์ `server/.env` (สำหรับรัน Local) หรือ `server/.env.local` (สำหรับต่อ Neon Cloud Database):

```env
# พอร์ตของ Backend API Server
PORT=3000

# การเชื่อมต่อฐานข้อมูล PostgreSQL
# ตัวอย่าง Local:
DATABASE_URL="postgresql://postgres:1234@localhost:5432/sadida"
# ตัวอย่าง Neon Cloud:
# DATABASE_URL="postgresql://neondb_owner:***@ep-your-project-id.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# รหัสผ่านเริ่มต้นสำหรับบัญชี Admin (กำหนดใน Environment Variable เท่านั้น)
ADMIN_INITIAL_PASSWORD=your_secure_admin_password
JWT_SECRET=your_jwt_secret_token
```

### 4.3 การเปิดใช้งานเซิร์ฟเวอร์ (Development Mode)
เปิด 2 Terminal แยกกันเพื่อรัน Backend และ Frontend:

**Terminal 1 — Backend Server:**
```bash
cd server
bun run dev
# เซิร์ฟเวอร์จะเริ่มต้นที่: http://localhost:3000
```

**Terminal 2 — Frontend Client:**
```bash
cd client
npm run dev
# หน้าเว็บไซต์จะเปิดขึ้นที่: http://localhost:5173
```

### 4.4 บัญชีผู้ดูแลระบบสำหรับทดสอบ (Admin Account)
- **URL เข้าสู่ระบบ:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **ชื่อผู้ใช้ (Username):** `Admin Sadida` หรือใช้ **เบอร์โทรศัพท์:** `0812345678`
- **รหัสผ่าน (Password):** ตามที่ระบุไว้ในตัวแปรสภาพแวดล้อม `ADMIN_INITIAL_PASSWORD` ของคุณ (ห้ามเปิดเผยเป็น Plaintext)

---

## 5. การจัดการฐานข้อมูล

ระบบใช้ **Drizzle ORM** ร่วมกับ **Postgres.js** ในการจัดการฐานข้อมูลเชิงสัมพันธ์ (Relational Database)

### 5.1 โครงสร้างตาราง (Database Schema)
- `categories`: รหัสหมวดหมู่ (`category_id`) และชื่อหมวดหมู่ (`category_name`)
- `product`: รหัสสินค้า (`pro_id`), ชื่อสินค้า (`pro_name`), คำอธิบาย (`description`), ที่อยู่รูปภาพ (`img`), ราคา (`price`), และรหัสหมวดหมู่ (`category_id`)
- `product_detail`: รหัสรายละเอียด (`prodetail_id`), รหัสสินค้า (`pro_id`), และขนาดรองเท้า (`prodetail_size` เช่น `8 UK`)
- `contacts`: ข้อความติดต่อจากลูกค้า (`contacts_id`, `contacts_name`, `email`, `phone`, `subject`, `contacts_message`)
- `user_roles`: สิทธิ์ผู้ใช้งาน (`user_roles_id`, `user_roles_name`)
- `users`: ข้อมูลผู้ใช้งาน (`users_id`, `users_name`, `phone`, `password_hash`, `user_roles_id`)

```mermaid
erDiagram
    categories ||--o{ product : "has"
    product ||--o{ product_detail : "contains"
    user_roles ||--o{ users : "defines"

    categories {
        varchar category_id PK
        varchar category_name
    }
    product {
        varchar pro_id PK
        varchar pro_name
        text description
        varchar img
        double_precision price
        varchar category_id FK
    }
    product_detail {
        varchar prodetail_id PK
        varchar pro_id FK
        varchar prodetail_size
    }
    contacts {
        varchar contacts_id PK
        varchar contacts_name
        varchar email
        varchar phone
        varchar subject
        varchar contacts_message
    }
    user_roles {
        varchar user_roles_id PK
        varchar user_roles_name
    }
    users {
        varchar users_id PK
        varchar users_name
        varchar phone UK
        varchar password_hash
        varchar user_roles_id FK
    }
```

### 5.2 คำสั่งจัดการฐานข้อมูล (Drizzle Commands)
คำสั่งทั้งหมดให้รันจากโฟลเดอร์ `server`:

```bash
cd server

# ผลักดัน Schema ไปยังฐานข้อมูลทันที (Sync Schema to DB)
bun run db:push

# สร้างไฟล์ SQL Migration จาก Schema ปัจจุบัน
bun run db:generate

# ดำเนินการรัน Migration ที่สร้างไว้
bun run db:migrate

# นำเข้าข้อมูลเริ่มต้น (Roles, Categories, Products, Sizes, Admin, Contacts)
bun run seed

# เปิด Drizzle Studio สำหรับดูและแก้ไขข้อมูลผ่าน Web Interface
bun run db:studio
```

---

## 6. ตารางสรุป API Endpoints

รายการ Endpoints ทั้งหมดของระบบ Sadida (ดูรายละเอียด Request/Response เพิ่มเติมได้ที่ [API.md](./API.md) หรือไฟล์ [requests.http](./requests.http)):

| หมวดหมู่ | Method | Endpoint | สิทธิ์เข้าถึง | หน้าที่และการทำงาน |
| :--- | :---: | :--- | :---: | :--- |
| **Health** | `GET` | `/` | Public | ตรวจสอบสถานะการทำงานของระบบเซิร์ฟเวอร์ |
| **Auth** | `POST` | `/api/auth/login` | Public | ตรวจสอบรหัสผ่านผู้ดูแลระบบ (Username/Phone + Password) |
| | `GET` | `/api/auth/me` | Protected | ตรวจสอบสถานะ Session ปัจจุบันของผู้ใช้ |
| **Storefront** | `GET` | `/api/products` | Public | ดึงรายการสินค้าทั้งหมดพร้อมขนาดสำหรับแสดงหน้าร้าน |
| | `GET` | `/api/services` | Public | Endpoint สำรองสำหรับดึงรายการสินค้า |
| **Categories** | `GET` | `/api/categories` | Public | ดึงรายชื่อหมวดหมู่สินค้าทั้งหมด |
| **Contact** | `POST` | `/api/contact` | Public | ส่งข้อความติดต่อใหม่ (ตรวจสอบผ่าน Zod Schema) |
| | `GET` | `/api/contact` | Public | ดึงรายการข้อความติดต่อทั้งหมด |
| **Admin Stats** | `GET` | `/api/admin/products/stats/summary` | Admin | ดึงสรุปยอดรวมสินค้าและหมวดหมู่สำหรับ Dashboard |
| | `GET` | `/api/admin/contacts/stats/summary` | Admin | ดึงสรุปยอดรวมข้อความติดต่อสำหรับ Dashboard |
| **Admin Products** | `GET` | `/api/admin/products` | Admin | ดึงรายการสินค้าทั้งหมดสำหรับตารางจัดการหลังบ้าน |
| | `GET` | `/api/admin/products/:id` | Admin | ดึงข้อมูลสินค้าและไซส์รายตัวตาม ID |
| | `POST` | `/api/admin/products` | Admin | เพิ่มสินค้าใหม่พร้อมขนาด (Auto-generate `proId` ได้) |
| | `PUT` | `/api/admin/products/:id` | Admin | แก้ไขข้อมูลสินค้า รายละเอียด และขนาด |
| | `DELETE`| `/api/admin/products/:id` | Admin | ลบสินค้าและข้อมูลไซส์ที่เกี่ยวข้องออกจากระบบ |
| **Admin Categories**| `GET` | `/api/admin/products/categories` | Admin | แสดงรายการหมวดหมู่สินค้าทั้งหมด |
| | `POST` | `/api/admin/products/categories` | Admin | เพิ่มหมวดหมู่สินค้าใหม่ (Auto-generate `categoryId`) |
| | `DELETE`| `/api/admin/products/categories/:id`| Admin | ลบหมวดหมู่ (ระบบจะปฏิเสธหากมีสินค้าผูกอยู่) |
| **Admin Details** | `GET` | `/api/admin/products/product-details/all` | Admin | ดึงรายการขนาดสินค้าและราคาทั้งหมด |
| | `POST` | `/api/admin/products/product-details` | Admin | เพิ่มขนาดรองเท้าใหม่ให้กับสินค้า |
| **Admin Upload** | `POST` | `/api/admin/products/upload` | Admin | อัปโหลดรูปภาพ Base64 ลงใน `client/public/images/` |
| **Admin Contacts**| `GET` | `/api/admin/contacts` | Admin | แสดงรายการข้อความติดต่อทั้งหมด |
| | `GET` | `/api/admin/contacts/:id` | Admin | ดูรายละเอียดข้อความติดต่อตาม ID |
| | `DELETE`| `/api/admin/contacts/:id` | Admin | ลบข้อความติดต่อออกจากระบบ |

---

## 7. สถาปัตยกรรมความปลอดภัยและการคำนวณรายรับ

### 7.1 สถาปัตยกรรมความปลอดภัย (Security Architecture)

1. **การเข้ารหัสและตรวจสอบรหัสผ่าน (Password Hashing):**
   - รหัสผ่านผู้ดูแลระบบถูกเข้ารหัสด้วยอัลกอริทึม **Bcrypt** (`Bun.password.hash` พร้อม Salt Cost ระดับ 10)
   - ไม่มีการจัดเก็บรหัสผ่านแบบ Plaintext ในฐานข้อมูลอย่างเด็ดขาด
   - การตรวจสอบการเข้าสู่ระบบทำผ่าน `Bun.password.verify()` ที่มีความปลอดภัยสูง ป้องกัน Timing Attacks

2. **การควบคุมการเข้าถึงตามบทบาท (Role-Based Access Control - RBAC):**
   - แยกสิทธิ์ในระดับฐานข้อมูลผ่าน `user_roles`
   - ตรวจสอบ `userRolesId === "r_1"` (Admin) ในขั้นตอน Authentication ก่อนอนุญาตให้เข้าสู่ระบบหลังบ้าน
   - ฝั่ง Frontend มี **Protected Route Wrapper** (`AdminLayout.tsx`) คอยตรวจสอบ Cookie เซสชัน หากไม่มีการยืนยันตัวตนจะ Redirect กลับหน้า `/admin/login` ทันที

3. **การตรวจสอบความถูกต้องของข้อมูล (Input Validation):**
   - ฝั่ง Backend ใช้ **Zod Library** กำหนด Schema ที่เข้มงวด:
     - `loginSchema`: ตรวจสอบความถูกต้องของ Username/Phone และ Password
     - `contactSchema`: ตรวจสอบความถูกต้องของอีเมล, เบอร์โทร (9-10 หลัก), และจำกัดความยาวของข้อความเพื่อป้องกัน Buffer Overflow และ Injection
   - ฝั่ง Frontend มีระบบ Real-time Validation เช่น ตัวนับบรรทัดคำอธิบายสินค้าไม่เกิน 3 บรรทัด และตรวจสอบขนาดไฟล์รูปภาพ

4. **การจัดการเซสชันและการป้องกันข้ามโดเมน (Session & CORS):**
   - จัดเก็บข้อมูลผู้ใช้ที่ผ่านการยืนยันตัวตนลงใน Cookie ที่มีการตั้งค่าวันหมดอายุ (Expire in 7 days)
   - กำหนดค่า **CORS Middleware** ใน Hono เพื่อควบคุม Origin, Methods และ Headers ให้เป็นไปตามมาตรฐานความปลอดภัย

---

### 7.2 โครงสร้างราคาและการคำนวณรายรับ (Pricing & Revenue Model)

1. **โครงสร้างราคาแบบยืดหยุ่น (Flexible Pricing Structure):**
   - **Base Price (`product.price`):** กำหนดราคามาตรฐานระดับตัวสินค้าเพื่อความรวดเร็วในการสั่งซื้อและการคำนวณ
   - **Detail Sizing (`product_detail.prodetailSize`):** ผูกขนาดรองเท้า (UK Size) เข้ากับสินค้า ทำให้สามารถต่อยอดไปสู่การตั้งราคาเฉพาะไซส์ (Variant-based pricing) หรือจัดโปรโมชันเฉพาะขนาดในอนาคตได้

2. **การประเมินมูลค่าสินค้าคงคลัง (Inventory Valuation):**
   - แดชบอร์ดสรุปสถิติคำนวณปริมาณสินค้าทั้งหมดผ่าน `/api/admin/products/stats/summary`
   - ระบบพร้อมคำนวณมูลค่ารวมของสินค้าในระบบ (Total Inventory Value) ตามสมการ:
     $$\text{Total Catalog Value} = \sum_{i=1}^{n} (\text{Price}_i \times \text{Available Variants}_i)$$

3. **การคำนวณยอดขายและรายรับในอนาคต (Projected Sales & Revenue Metrics):**
   - การสั่งซื้อจะถูกเชื่อมโยงระหว่าง `proId`, `prodetailId` และ `price`
   - คำนวณรายรับสุทธิ (Gross Revenue) และภาษีมูลค่าเพิ่ม (VAT 7%) ตามสูตรมาตรฐาน:
     $$\text{Subtotal} = \sum (\text{Item Price} \times \text{Quantity})$$
     $$\text{Total Revenue} = \text{Subtotal} - \text{Discount} + \text{Shipping Fee}$$
   - ตัวเลขสถิติบน Dashboard ถูกดึงแบบเรียลไทม์จากฐานข้อมูล ทำให้ผู้ดูแลระบบสามารถตรวจสอบความเคลื่อนไหวของหมวดหมู่และสินค้าที่ได้รับความนิยมได้อย่างแม่นยำ
