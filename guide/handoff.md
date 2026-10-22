# เอกสารส่งมอบงานและการเตรียมพร้อมระบบ (Project & Environment Handoff)

**โปรเจกต์:** เว็บไซต์ STARTER (Mini Project ฝึกงาน - Fullstack)  
**ผู้จัดทำ / นักศึกษา:** นายไอยเรศ สังข์เสือ (ปวส.2 วิทยาลัยเทคนิคหาดใหญ่)  
**Repository:** `iyarettt2550/intern-basic-sadida`  
**วันที่จัดทำ:** 20 ตุลาคม 2026  
**เอกสารอ้างอิง:** [Requirement โปรเจกต์ฝึกงาน เว็บไซต์ STARTER (Fullstack) (2).pdf](./Requirement%20โปรเจกต์ฝึกงาน%20เว็บไซต์%20STARTER%20(Fullstack)%20(2).pdf)

---

## 1. บทนำและวัตถุประสงค์ (Overview & Purpose)

เอกสารฉบับนี้จัดทำขึ้นเพื่อส่งมอบข้อมูลสถานะความพร้อมของเครื่องคอมพิวเตอร์และสภาพแวดล้อม (Environment Readiness) สำหรับการพัฒนาโปรเจกต์ฝึกงานเว็บไซต์ธุรกิจแบบครบวงจร (Fullstack: Frontend + Backend + Database) รวมถึงแนะนำแนวทาง โครงสร้างโฟลเดอร์ และคำสั่งในการติดตั้งโปรเจกต์ เพื่อให้นักศึกษาหรือพี่เลี้ยงสามารถดำเนินการต่อได้อย่างราบรื่นและตรงตามเกณฑ์ 100 คะแนนเต็ม

---

## 2. สถานะการตรวจสอบและเตรียมเครื่อง (Environment Readiness Status)

จากการตรวจสอบระบบปฏิบัติการ Windows บนเครื่องพัฒนา พบว่าโปรแกรมและ Runtime สำคัญทั้งหมดได้รับการติดตั้งและพร้อมใช้งานแล้ว ดังนี้:

| โปรแกรม / เครื่องมือ | เวอร์ชันที่ติดตั้ง | สถานะการทำงาน | ที่ตั้งไฟล์ (Path) บนเครื่อง |
| :--- | :--- | :---: | :--- |
| **Bun** | `1.4.3` | พร้อมใช้งาน | `C:\Users\blick\.bun\bin\bun.exe` |
| **Node.js** | `v24.22.0` | พร้อมใช้งาน | `C:\Program Files\nodejs\node.exe` |
| **NPM** | `v11.x` | พร้อมใช้งาน | `C:\Program Files\nodejs\npm.ps1` |
| **Git** | `2.56.0.windows.2` | พร้อมใช้งาน | `C:\Program Files\Git\cmd\git.exe` |
| **PostgreSQL** | `18.6` | Service รันอยู่ (`Running`) | `C:\Program Files\PostgreSQL\18\bin\psql.exe` |
| **pgAdmin 4** | v8.x / v9.x | พร้อมใช้งาน | `C:\Program Files\PostgreSQL\18\pgAdmin 4\runtime\pgAdmin4.exe` |

> **สรุปความพร้อม:** เครื่องมี Runtime ฝั่ง Backend (`Bun`), Frontend tooling (`Node.js/npm`), ระบบจัดการฐานข้อมูล (`PostgreSQL` service รันอัตโนมัติ) และ GUI (`pgAdmin 4`) ครบถ้วน 100% ไม่จำเป็นต้องติดตั้งโปรแกรมระดับ OS เพิ่มเติม

---

## 3. สรุป Tech Stack และสถาปัตยกรรมระบบ (Architecture & Tech Stack)

ตามข้อกำหนดในเอกสาร Requirement กำหนดให้ใช้เทคโนโลยีดังต่อไปนี้:

```
+--------------------------------------------------------------------------+
|                             INTERN PROJECT                               |
+--------------------------------------------------------------------------+
|  [Frontend (client)]                                                     |
|  - React + TypeScript (สร้างด้วย Vite)                                    |
|  - Tailwind CSS สำหรับ Styling / Responsive                              |
|  - React Router สำหรับการจัดการหลายหน้า (Public & Admin)                  |
|  - Zod (แชร์ Type Validation ร่วมกับฝั่ง Backend)                        |
+--------------------------------------------------------------------------+
                                    │ (HTTP REST API / Cookie Auth)
                                    ▼
+--------------------------------------------------------------------------+
|  [Backend (server)]                                                      |
|  - Bun Runtime                                                           |
|  - Hono Framework                                                        |
|  - Drizzle ORM + drizzle-kit (Migration & Schema)                        |
|  - Zod (Input Validation & Error Responses)                              |
|  - Bun.password (Hash รหัสผ่านด้วย argon2/bcrypt)                         |
|  - JWT เก็บใน httpOnly Cookie (sameSite=lax)                             |
+--------------------------------------------------------------------------+
                                    │ (TCP / Connection Pool)
                                    ▼
+--------------------------------------------------------------------------+
|  [Database]                                                              |
|  - PostgreSQL 18                                                         |
|  - จัดการและตรวจสอบตารางผ่าน pgAdmin 4                                   |
+--------------------------------------------------------------------------+
```

---

## 4. โครงสร้างโฟลเดอร์มาตรฐาน (Standard Folder Structure)

โครงการจะต้องจัดโครงสร้างแบบ Monorepo แยก `client` และ `server` ภายใต้ Repository เดียวกัน:

```text
intern-basic-sadida/
├── client/                     # ส่วนหน้าเว็บ (Frontend)
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── robots.txt          # SEO requirement
│   │   └── sitemap.xml         # SEO requirement
│   ├── src/
│   │   ├── api/                # ตัวกลางเรียก API ไปยัง backend ทั้งหมด
│   │   ├── components/         # Reusable UI components (Navbar, Footer, Modal ฯลฯ)
│   │   ├── pages/              # หน้าเว็บแบ่งเป็น Public และ Admin
│   │   │   ├── public/         # Home, About/Services, Contact
│   │   │   └── admin/          # Login, Dashboard, Settings, Pages, Services, Messages
│   │   ├── types/              # TypeScript Types / Interfaces
│   │   ├── App.tsx             # Routing configuration
│   │   ├── main.tsx
│   │   └── index.css           # Tailwind CSS directives
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                     # ส่วนหลังบ้าน (Backend API)
│   ├── drizzle/                # โฟลเดอร์เก็บ Migration files อัตโนมัติ
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.ts        # Database Connection (Drizzle + Postgres Client)
│   │   │   └── schema.ts       # Drizzle Schema (6 ตารางหลัก)
│   │   ├── middleware/         # Auth Guard (JWT), Error Handler, Rate Limiting
│   │   ├── routes/             # แยกตาม Resource (auth, settings, pages, services, contact)
│   │   ├── validators/         # Zod validation schemas
│   │   └── index.ts            # Entry Point (Hono App)
│   ├── .env.example            # ตัวอย่าง Environment variables (ห้ามใส่ password จริง)
│   ├── package.json
│   ├── tsconfig.json
│   └── drizzle.config.ts       # การตั้งค่า Drizzle Kit
├── guide/                      # เอกสารคู่มือและ Requirement
│   ├── Requirement โปรเจกต์ฝึกงาน เว็บไซต์ STARTER (Fullstack) (2).pdf
│   └── handoff.md              # เอกสารส่งมอบฉบับนี้
├── .gitignore
├── about-me.md
└── README.md
```

---

## 5. คู่มือคำสั่งการติดตั้งโปรเจกต์ (Project Setup Guide)

เมื่อพร้อมเริ่มต้นสร้างโปรเจกต์ (วันที่ 1 - Setup Repo) สามารถดำเนินการตามคำสั่งดังนี้:

### 5.1 ตรวจสอบและตั้งค่า `.gitignore` (ที่ Root โฟลเดอร์)
ตรวจสอบให้แน่ใจว่า `.gitignore` ละเว้นไฟล์ที่ไม่ควร commit:
```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
dist/
dist-ssr/
*.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
bun.lockb
.DS_Store
```

---

### 5.2 การติดตั้งส่วน Frontend (`client/`)

รันคำสั่งที่ root ของโปรเจกต์:
```powershell
# 1. สร้างโปรเจกต์ Vite React + TypeScript
npm create vite@latest client -- --template react-ts

# 2. เข้าโฟลเดอร์ client
cd client

# 3. ติดตั้ง Dependencies พื้นฐาน
npm install react-router-dom lucide-react clsx tailwind-merge zod

# 4. ติดตั้ง Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 5. กลับสู่โฟลเดอร์หลัก
cd ..
```

---

### 5.3 การติดตั้งส่วน Backend (`server/`)

รันคำสั่งที่ root ของโปรเจกต์:
```powershell
# 1. สร้างโฟลเดอร์ server และเข้าสู่โฟลเดอร์
mkdir server
cd server

# 2. สร้าง package.json สำหรับ Bun
bun init -y

# 3. ติดตั้ง Production Dependencies
bun add hono drizzle-orm postgres zod

# 4. ติดตั้ง Dev Dependencies สำหรับ Drizzle และ TypeScript
bun add -d drizzle-kit @types/node

# 5. สร้างโครงสร้างโฟลเดอร์ย่อย
mkdir src, src\db, src\routes, src\validators, src\middleware, drizzle

# 6. กลับสู่โฟลเดอร์หลัก
cd ..
```

---

### 5.4 การตั้งค่าฐานข้อมูล PostgreSQL และ `.env`

1. **เปิดโปรแกรม pgAdmin 4** (จาก Start Menu หรือ `C:\Program Files\PostgreSQL\18\pgAdmin 4\runtime\pgAdmin4.exe`)
2. สร้าง Database ใหม่สำหรับโปรเจกต์ เช่น ตั้งชื่อว่า `starter_business_db`
3. สร้างไฟล์ `server/.env.example` เพื่อแจกแจงตัวแปรที่จำเป็น:
```env
PORT=3000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/starter_business_db
JWT_SECRET=super_secret_jwt_key_at_least_32_characters_long
NODE_ENV=development
```
4. คัดลอกไฟล์ `server/.env.example` เป็น `server/.env` แล้วกรอกรหัสผ่าน PostgreSQL จริง (ย้ำ: `.env` จะถูกละเว้น ไม่ถูกอัปโหลดขึ้น Git)

---

## 6. สรุปความต้องการฐานข้อมูล 6 ตาราง (Database Schema Requirements)

ตาม Requirement หน้า 6 - 7 ฐานข้อมูลต้องประกอบด้วยอย่างน้อย 6 ตาราง:

| ชื่อตาราง | ฟิลด์หลัก | ข้อกำหนดสำคัญ |
| :--- | :--- | :--- |
| `admins` | `id`, `email`, `password_hash`, `name`, `created_at`, `updated_at` | `email` ต้อง unique, รหัสผ่านต้อง hash ผ่าน `Bun.password.hash` ห้ามเก็บ plaintext |
| `site_settings` | `id`, `shop_name`, `logo_url`, `phone`, `email`, `address`, `opening_hours`, `line_url`, `facebook_url`, `instagram_url`, `map_url`, timestamps | มีแถวเดียวทั้งระบบ (`singleton`) |
| `pages` | `id`, `slug`, `seo_title`, `seo_description`, `og_image_url`, `content` (jsonb), timestamps | `slug` unique: `home`, `about`, `contact` / ฟิลด์ content ตรวจสอบโครงสร้างด้วย Zod |
| `categories` | `id`, `name`, `slug`, `sort_order`, timestamps | `slug` unique |
| `services` | `id`, `category_id`, `name`, `description`, `price`, `image_url`, `is_featured`, `is_active`, `sort_order`, timestamps | FK เชื่อมกับ `categories` (ห้ามลบ category หากยังมี service ผูกอยู่) |
| `contact_messages` | `id`, `name`, `phone`, `email`, `subject`, `message`, `is_read`, timestamps | บันทึกข้อความจาก Contact Form |

> **เงื่อนไขสำคัญ:** ทุกตารางต้องมี `id` (UUID หรือ serial), `created_at`, `updated_at` และต้องมี **Seed Script** (`bun run seed`) สำหรับสร้าง admin คนแรก, หมวดหมู่ 2 หมวด, บริการ 6 รายการ, settings 1 รายการ และ pages 3 หน้า

---

## 7. แผนงาน 10 วันทำการ (Timeline & Milestones)

| วันที่ | ขอบเขตงานหลัก | ผลลัพธ์ที่ต้องส่งมอบ (Deliverables) |
| :---: | :--- | :--- |
| **วัน 1** | เลือกประเภทธุรกิจสมมติ, เขียน Brief ธุรกิจ, ร่าง Wireframe 3 หน้า, Setup Repo | Brief และโครงสร้าง Repo ผ่านการตรวจ |
| **วัน 2** | Drizzle Schema, Migration, Seed Script, ทำ ER Diagram | `bun run seed` สำเร็จ มีข้อมูลใน pgAdmin, มีรูป ER Diagram |
| **วัน 3** | พัฒนา Public API, Zod Validation, มาตรฐาน Response JSON Format | ทดสอบทุก endpoint ผ่าน Postman / Thunder Client |
| **วัน 4** | ระบบ Auth (Login/Logout), Cookie httpOnly, Middleware ตรวจสอบสิทธิ์, Admin API | เรียก Admin API โดยไม่ login ต้องตอบกลับ `401 Unauthorized` |
| **วัน 5** | ทำ Layout หน้าเว็บ, Navbar, Footer, หน้า Home (ดึงข้อมูลจริงจาก API) | **Review รอบที่ 1** (ประเมินโครงสร้าง DB + API ร่วมกับพี่เลี้ยง) |
| **วัน 6** | หน้า About/Services, หน้า Contact Form พร้อม Validation และบันทึกลง DB | ส่งข้อความแล้วบันทึกเข้า DB สำเร็จ |
| **วัน 7** | ระบบ Admin: หน้า Login, Dashboard, จัดการ Settings, จัดการ Pages | แก้ไขข้อมูลในหลังบ้านแล้วหน้าเว็บ Public เปลี่ยนตามจริง |
| **วัน 8** | ระบบ Admin: จัดการ Services/Categories (CRUD ครบ), จัดการ Messages | ทดสอบเพิ่ม/แก้ไข/ลบ ครบทุกฟังก์ชัน |
| **วัน 9** | ทดสอบ Responsive (375px, 768px, 1280px), SEO (Title, Meta, OG), Error Handling | **Review รอบที่ 2** (ตรวจสอบระบบทั้งหน้าบ้านและหลังบ้าน) |
| **วัน 10** | ปรับปรุงโค้ดตาม Review, เขียน README คู่มือการใช้งาน, เตรียม Demo 15 นาที | นำเสนอ Demo สด 15 นาที |

---

## 8. กฎเหล็กและข้อควรระวังสำคัญ (Zero-Tolerance Checklist)

ในการประเมินผล มีข้อผิดพลาดร้ายแรงที่จะทำให้ **ไม่ผ่านการประเมินทันที (ตกอัตโนมัติ)** หากพบข้อใดข้อหนึ่ง:

- [ ] **ห้ามเก็บรหัสผ่านเป็น Plain Text:** ต้องแฮชด้วย `Bun.password.hash` (argon2 หรือ bcrypt) เสมอ
- [ ] **ห้ามเปิด Admin API ให้เข้าถึงได้โดยไม่ยืนยันตัวตน:** ทุก endpoint `/api/admin/*` ต้องมี Middleware ตรวจสอบ JWT จาก cookie httpOnly
- [ ] **โปรเจกต์ต้องรันตามคู่มือ README ได้จริง:** ผู้ตรวจต้องสามารถ clone โปรเจกต์ ติดตั้ง dependencies และรันขึ้นได้ทันที
- [ ] **ห้าม Commit ไฟล์ `.env` ขึ้น Git เด็ดขาด**
- [ ] **ห้าม Hardcode ข้อมูลบนหน้าเว็บ:** ข้อมูลสินค้า/บริการ รายละเอียดร้าน รูปภาพ ต้องดึงผ่าน API มาแสดงผล
- [ ] **ห้ามใช้ `any` มั่วใน TypeScript:** ต้องกำหนด Type/Interface ให้ชัดเจน เว้นแต่มีเหตุผลจำเป็นและเขียน Comment อธิบายไว้

---

## 9. ขั้นตอนถัดไปที่แนะนำ (Next Action Items)

1. **เลือกธุรกิจสมมติ (Day 1 Task):**
   - เลือกร้านค้าหรือธุรกิจบริการ 1 ประเภท (เช่น คลินิกทันตกรรม, ร้านกาแฟ Specialty, ร้านซ่อมมือถือ, สตูดิโอถ่ายภาพ, โฮมสเตย์)
   - สรุป Brief: ชื่อแบรนด์, โทนสี 2-3 สี, กลุ่มลูกค้าเป้าหมาย, รายการสินค้า/บริการอย่างน้อย 6 รายการ
   - ร่าง Wireframe หน้า Home, About/Services และ Contact (วาดลงกระดาษหรือ Figma)
2. **Setup Repositories & Packages:**
   - ติดตั้ง `client` และ `server` ตามคำสั่งในหัวข้อที่ 5
   - ตั้งค่า Tailwind CSS และไฟล์ Drizzle Configuration
3. **ส่งมอบ Brief ให้พี่เลี้ยงตรวจสอบก่อนเริ่มโค้ด Day 2**

---
*จัดทำและตรวจสอบความถูกต้องโดยระบบประสานงานการพัฒนา Antigravity IDE*
