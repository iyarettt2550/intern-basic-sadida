# 👟 Sadida — E-Commerce Shoe Platform

ระบบเว็บไซต์ร้านค้าออนไลน์และระบบจัดการสินค้าหลังบ้าน (E-Commerce & Admin Backoffice) สำหรับแบรนด์รองเท้า Sadida พัฒนาด้วยโครงสร้าง Monorepo แยกฝั่ง Frontend และ Backend อย่างชัดเจน

---

## 🛠️ Tech Stack

- **Frontend (`client/`):**
  - [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  - [Vite](https://vitejs.dev/)
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - [React Router v7](https://reactrouter.com/)
  - [Lucide Icons](https://lucide.dev/)
- **Backend (`server/`):**
  - [Bun](https://bun.sh/)
  - [Hono](https://hono.dev/)
  - [Drizzle ORM](https://orm.drizzle.team/)
  - [PostgreSQL](https://www.postgresql.org/) (รองรับทั้ง Local PostgreSQL และ [Neon Serverless Postgres](https://neon.tech/))

---

## 📋 ข้อกำหนดเบื้องต้น (Prerequisites)

ก่อนเริ่มต้นใช้งาน กรุณาตรวจสอบว่าได้ติดตั้งเครื่องมือเหล่านี้ในเครื่องเรียบร้อยแล้ว:
- [Bun](https://bun.sh/) (แนะนำเวอร์ชัน 1.1+)
- [Node.js](https://nodejs.org/) (เวอร์ชัน 18 ขึ้นไป สำหรับ npm)
- [PostgreSQL](https://www.postgresql.org/) (หากต้องการรัน Database ภายในเครื่อง) หรือบัญชี [Neon Postgres](https://neon.tech/) (สำหรับ Cloud Database)

---

## 🚀 ขั้นตอนการติดตั้ง (Installation)

โคลน Repository มายังเครื่องของคุณ และติดตั้ง Dependencies ทั้งสองฝั่ง:

### 1. ติดตั้ง Dependencies ฝั่ง Backend
```bash
cd server
bun install
```

### 2. ติดตั้ง Dependencies ฝั่ง Frontend
```bash
cd ../client
npm install
# หรือใช้คำสั่ง: bun install
```

---

## ⚙️ การตั้งค่า Environment Variables (`.env`)

สร้างไฟล์ `.env` หรือ `.env.local` ภายในโฟลเดอร์ `server/`:

```bash
# อยู่ที่โฟลเดอร์ server/
cp .env.example .env   # (หากมีไฟล์ตัวอย่าง) หรือสร้างไฟล์ใหม่
```

กำหนดค่าตัวแปรใน `server/.env` (หรือ `server/.env.local`):

```env
# พอร์ตสำหรับรัน Backend Server
PORT=3000

# การเชื่อมต่อฐานข้อมูล PostgreSQL (เลือกแบบใดแบบหนึ่ง)
# 1) กรณีใช้ PostgreSQL ในเครื่อง (Local)
DATABASE_URL="postgresql://postgres:1234@localhost:5432/sadida"

# 2) กรณีใช้ Neon Serverless Postgres (Cloud)
# DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"

# รหัสผ่านเริ่มต้นสำหรับบัญชีผู้ดูแลระบบ (Admin)
ADMIN_INITIAL_PASSWORD=12345
```

> **หมายเหตุ:** หากต้องการเชื่อมต่อกับ Neon Database หรือตั้งค่าผ่าน Vercel CLI สามารถใส่ค่าในไฟล์ `server/.env.local` ได้เช่นกัน

---

## 🗄️ การสร้างตารางและข้อมูลตั้งต้น (Database Migration & Seeding)

เมื่อตั้งค่า `DATABASE_URL` เรียบร้อยแล้ว ให้เข้าไปที่โฟลเดอร์ `server` เพื่อสร้างตารางและเพิ่มข้อมูลตั้งต้น:

```bash
cd server

# 1. สร้างตารางทั้งหมดลงฐานข้อมูล (Categories, Product, Product Detail, Users, Roles, Contacts)
bun run db:push

# 2. นำเข้าข้อมูลตัวอย่างตั้งต้น (Seed Data)
bun run seed
```

> **สิ่งที่คำสั่ง `seed` จะสร้างให้:**
> - สิทธิ์ผู้ใช้ (`Admin`, `Customer`)
> - หมวดหมู่สินค้าเริ่มต้น (รองเท้าวิ่ง, รองเท้าเดิน)
> - รายการสินค้ารองเท้าตัวอย่าง 6 รายการ พร้อมขนาด (Sizes) ครบถ้วน
> - บัญชีผู้ดูแลระบบ (`Admin Sadida`)
> - ข้อความติดต่อตัวอย่าง

---

## 💻 การเปิดเว็บและรันโปรเจกต์ (Running Development Servers)

เปิด 2 Terminal แยกเพื่อรันทั้งฝั่ง Backend และ Frontend:

### Terminal 1: รัน Backend (API Server)
```bash
cd server
bun run dev
```
เซิร์ฟเวอร์จะเริ่มทำงานที่: `http://localhost:3000`  
- ทดสอบ Health Check ได้ที่: `http://localhost:3000/`
- API หลักอยู่ที่: `http://localhost:3000/api/...`

### Terminal 2: รัน Frontend (Client SPA)
```bash
cd client
npm run dev
# หรือ: bun run dev
```
เว็บแอปพลิเคชันจะเปิดขึ้นที่: `http://localhost:5173`

---

## 🔐 ข้อมูลบัญชีผู้ดูแลระบบสำหรับทดสอบ (Test Admin Account)

สำหรับการเข้าสู่ระบบจัดการหลังบ้าน (Backoffice):

- **URL เข้าสู่ระบบ:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **ชื่อผู้ใช้ (Username):** `Admin Sadida`
- **เบอร์โทรศัพท์ (Phone):** `0812345678` *
- **รหัสผ่าน (Password):** `12345` *(อิงตามค่า `ADMIN_INITIAL_PASSWORD` ใน `.env`)*

### สิทธิ์และความสามารถของ Admin:
- 📊 **Dashboard:** ดูสรุปยอดรวมสินค้า, หมวดหมู่ และสถิติต่างๆ
- 👟 **Products:** เพิ่ม, แก้ไข, ลบรายการสินค้า พร้อมอัปโหลดรูปภาพและกำหนดไซส์ (UK)
- 🏷️ **Categories:** จัดการหมวดหมู่สินค้า
- 📬 **Contacts:** ดูข้อความติดต่อจากลูกค้าผ่านทางหน้าเว็บ

---

## 📡 API Documentation & Testing

ดูรายการ API ทุก Endpoint, ตัวอย่าง Request / Response และการนำไปทดสอบบน **Postman** หรือ **VS Code REST Client** ได้ที่:
👉 **[API.md](file:///d:/intern-basic-sadida/API.md)** หรือใช้ไฟล์ **[requests.http](file:///d:/intern-basic-sadida/requests.http)** เพื่อยิงทดสอบได้ทันที

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
intern-basic-sadida/
├── client/                     # Frontend Application (React + Vite)
│   ├── public/                 # Static assets (เช่น รูปภาพรองเท้า, _redirects)
│   ├── src/
│   │   ├── components/         # คอมโพเนนต์ UI (Navbar, Footer, ProductCard, etc.)
│   │   ├── pages/              # หน้าเว็บ (Home, Products, Contact, Admin)
│   │   ├── types/              # TypeScript Types / Interfaces
│   │   └── utils/              # Helper functions, cookies, stores
│   └── package.json
│
├── server/                     # Backend API (Hono + Bun + Drizzle ORM)
│   ├── drizzle/                # SQL Migrations
│   ├── src/
│   │   ├── db/                 # การเชื่อมต่อ Database และ Schema (schema.ts, seed.ts)
│   │   ├── routes/             # API Endpoints (adminProducts, categories, auth, etc.)
│   │   └── index.ts            # Entrypoint ของ Server
│   └── package.json
│
├── vercel.json                 # การตั้งค่า Deploy บน Vercel Multi-service
├── API.md                      # เอกสารสรุปการเรียก API ทุก Endpoint (รองรับ Postman / .http)
├── requests.http               # ไฟล์ทดสอบ HTTP Request สำหรับ VS Code REST Client
└── README.md                   # เอกสารประกอบการติดตั้งและการใช้งาน
```

