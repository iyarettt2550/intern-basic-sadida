# 📡 Sadida API Documentation & Collection

เอกสารรวบรวม API ทุก Endpoint ของระบบ **Sadida Backend** ในรูปแบบที่สามารถนำไปทดสอบผ่าน **Postman**, **Insomnia**, หรือเปิดใช้งานผ่านส่วนขยาย **REST Client / Thunder Client** ใน VS Code (รูปแบบ `.http` / RFC 7230) ได้ทันที

---

## 🌐 Base URL & Environment

| Environment | Base URL |
| :--- | :--- |
| **Local Development** | `http://localhost:3000` |
| **Production (Vercel)** | `https://intern-basic-sadida-h1t2.vercel.app` |

---

## 📑 สารบัญ (Table of Contents)

1. [Health Check (ตรวจสอบสถานะระบบ)](#1-health-check)
2. [Authentication (ระบบเข้าสู่ระบบ Admin)](#2-authentication)
3. [Storefront & Services (สินค้าและบริการหน้าร้าน)](#3-storefront--services)
4. [Categories (หมวดหมู่สินค้า)](#4-categories)
5. [Contact (ระบบส่งข้อความติดต่อ)](#5-contact)
6. [Admin — Dashboard Stats (สถิติแดชบอร์ด)](#6-admin--dashboard-stats)
7. [Admin — Products (จัดการสินค้าหลังบ้าน)](#7-admin--products)
8. [Admin — Categories (จัดการหมวดหมู่หลังบ้าน)](#8-admin--categories)
9. [Admin — Product Details / Sizes (จัดการไซส์สินค้า)](#9-admin--product-details--sizes)
10. [Admin — Image Upload (อัปโหลดรูปภาพ)](#10-admin--image-upload)
11. [Admin — Contacts (จัดการข้อความติดต่อหลังบ้าน)](#11-admin--contacts)

---

## 1. Health Check

### 1.1 ตรวจสอบสถานะของ API Server
ใช้ตรวจสอบว่าเซิร์ฟเวอร์ Backend กำลังทำงานปกติหรือไม่

- **Method:** `GET`
- **Endpoint:** `/`

#### HTTP Request Format (`.http`):
```http
GET http://localhost:3000/
Content-Type: application/json
```

#### Example Response (200 OK):
```json
{
  "success": true,
  "message": "Sadida Backend API is running",
  "timestamp": "2026-10-30T09:00:00.000Z"
}
```

---

## 2. Authentication

### 2.1 เข้าสู่ระบบแอดมิน (Admin Login)
ตรวจสอบสิทธิ์ด้วยชื่อผู้ใช้ (Username) หรือเบอร์โทรศัพท์ (Phone) พร้อมรหัสผ่าน

- **Method:** `POST`
- **Endpoint:** `/api/auth/login`

#### HTTP Request Format (`.http`):
```http
### เข้าสู่ระบบด้วย Username
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "userName": "Admin Sadida",
  "password": "12345"
}

### หรือเข้าสู่ระบบด้วยเบอร์โทรศัพท์
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "phone": "0812345678",
  "password": "12345"
}
```

#### Example Response (200 OK):
```json
{
  "success": true,
  "message": "เข้าสู่ระบบสำเร็จ",
  "data": {
    "usersId": "usr_admin_001",
    "usersName": "Admin Sadida",
    "phone": "0812345678",
    "role": "Admin"
  }
}
```

#### Example Response (401 Unauthorized):
```json
{
  "success": false,
  "error": "ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง"
}
```

---

### 2.2 ตรวจสอบเซสชันผู้ใช้ (Session Check)
- **Method:** `GET`
- **Endpoint:** `/api/auth/me`

#### HTTP Request Format (`.http`):
```http
GET http://localhost:3000/api/auth/me
Content-Type: application/json
```

---

## 3. Storefront & Services

### 3.1 ดึงรายการสินค้าทั้งหมดสำหรับหน้าร้าน
ดึงรายการสินค้ารองเท้าทั้งหมด พร้อมข้อมูลหมวดหมู่และขนาด (Sizes) ที่มีจำหน่าย

- **Method:** `GET`
- **Endpoint:** `/api/products` (หรือ `/api/services`)

#### HTTP Request Format (`.http`):
```http
GET http://localhost:3000/api/products
Content-Type: application/json
```

#### Example Response (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "proId": "pro_001",
      "proName": "Sadida Zoom Runner X1",
      "description": "รองเท้าวิ่งสายสปีด น้ำหนักเบาพิเศษ พื้นโฟมซับแรงกระแทก เด้งทุกก้าว",
      "img": "/images/shoe_runner_1.jpg",
      "price": 1990,
      "categoryId": "cg_1",
      "categoryName": "รองเท้าวิ่ง",
      "prodetailId": "pdd_001",
      "prodetailSize": "7 UK",
      "sizes": ["7 UK", "7.5 UK", "8 UK", "8.5 UK", "9 UK", "10 UK"],
      "details": [
        {
          "prodetailId": "pdd_001",
          "proId": "pro_001",
          "prodetailSize": "7 UK"
        }
      ]
    }
  ]
}
```

---

## 4. Categories

### 4.1 ดึงรายการหมวดหมู่สินค้าทั้งหมด (Public)
- **Method:** `GET`
- **Endpoint:** `/api/categories`

#### HTTP Request Format (`.http`):
```http
GET http://localhost:3000/api/categories
Content-Type: application/json
```

#### Example Response (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "categoryId": "cg_1",
      "categoryName": "รองเท้าวิ่ง"
    },
    {
      "categoryId": "cg_2",
      "categoryName": "รองเท้าเดิน"
    }
  ]
}
```

---

## 5. Contact

### 5.1 ส่งข้อความติดต่อจากลูกค้า
ส่งฟอร์มติดต่อจากหน้า Contact Us (มีการตรวจสอบความถูกต้องด้วย Zod)

- **Method:** `POST`
- **Endpoint:** `/api/contact`

#### Constraints:
- `name`: ตัวอักษร 1-100 ตัว
- `email`: รูปแบบอีเมลถูกต้อง ความยาวไม่เกิน 25 ตัว
- `phone`: ตัวเลขเบอร์โทรศัพท์ 9-10 หลัก
- `subject`: ความยาว 1-50 ตัวอักษร
- `message`: ความยาว 1-200 ตัวอักษร

#### HTTP Request Format (`.http`):
```http
POST http://localhost:3000/api/contact
Content-Type: application/json

{
  "name": "สมเกียรติ ก้าวหน้า",
  "email": "somkiat@test.com",
  "phone": "0899998888",
  "subject": "สอบถามขนาดรองเท้า",
  "message": "ต้องการสอบถามว่ารุ่น Sadida Zoom Runner X1 จะมีไซส์ 11 UK เข้ามาเพิ่มไหมครับ?"
}
```

#### Example Response (201 Created):
```json
{
  "success": true,
  "message": "บันทึกข้อความติดต่อเรียบร้อยแล้ว",
  "data": {
    "contactsId": "cnt_1730278912345_abc12",
    "contactsName": "สมเกียรติ ก้าวหน้า",
    "email": "somkiat@test.com",
    "phone": "0899998888",
    "subject": "สอบถามขนาดรองเท้า",
    "contactsMessage": "ต้องการสอบถามว่ารุ่น Sadida Zoom Runner X1 จะมีไซส์ 11 UK เข้ามาเพิ่มไหมครับ?"
  }
}
```

---

### 5.2 ดึงรายการข้อความติดต่อทั้งหมด (Public / Testing)
- **Method:** `GET`
- **Endpoint:** `/api/contact`

#### HTTP Request Format (`.http`):
```http
GET http://localhost:3000/api/contact
Content-Type: application/json
```

---

## 6. Admin — Dashboard Stats

### 6.1 สรุปสถิติสินค้าและหมวดหมู่สำหรับ Dashboard
ดึงจำนวนสินค้าทั้งหมด, จำนวนหมวดหมู่ทั้งหมด และรายชื่อหมวดหมู่

- **Method:** `GET`
- **Endpoint:** `/api/admin/products/stats/summary`

#### HTTP Request Format (`.http`):
```http
GET http://localhost:3000/api/admin/products/stats/summary
Content-Type: application/json
```

#### Example Response (200 OK):
```json
{
  "success": true,
  "data": {
    "totalProducts": 6,
    "totalCategories": 2,
    "categories": [
      { "categoryId": "cg_1", "categoryName": "รองเท้าวิ่ง" },
      { "categoryId": "cg_2", "categoryName": "รองเท้าเดิน" }
    ]
  }
}
```

---

### 6.2 สรุปสถิติจำนวนข้อความติดต่อสำหรับ Dashboard
- **Method:** `GET`
- **Endpoint:** `/api/admin/contacts/stats/summary`

#### HTTP Request Format (`.http`):
```http
GET http://localhost:3000/api/admin/contacts/stats/summary
Content-Type: application/json
```

#### Example Response (200 OK):
```json
{
  "success": true,
  "data": {
    "totalContacts": 3
  }
}
```

---

## 7. Admin — Products

### 7.1 ดึงรายการสินค้าทั้งหมด (สำหรับตารางแอดมิน)
- **Method:** `GET`
- **Endpoint:** `/api/admin/products`

#### HTTP Request Format (`.http`):
```http
GET http://localhost:3000/api/admin/products
Content-Type: application/json
```

---

### 7.2 ดึงข้อมูลสินค้ารายตัวตาม ID
- **Method:** `GET`
- **Endpoint:** `/api/admin/products/:id`

#### HTTP Request Format (`.http`):
```http
GET http://localhost:3000/api/admin/products/pro_001
Content-Type: application/json
```

---

### 7.3 สร้างสินค้าใหม่ (Create Product)
สร้างสินค้าใหม่พร้อมไซส์ที่เลือก (หากไม่ส่ง `proId` ระบบจะ Auto-generate ให้ เช่น `pro_007`)

- **Method:** `POST`
- **Endpoint:** `/api/admin/products`

#### HTTP Request Format (`.http`):
```http
POST http://localhost:3000/api/admin/products
Content-Type: application/json

{
  "proName": "Sadida Air Velocity 2026",
  "description": "รองเท้าวิ่งรุ่นใหม่ล่าสุด เสริมแผ่นคาร์บอนไฟเบอร์เพิ่มแรงส่ง รองรับการวิ่งมาราธอน",
  "img": "/images/shoe_runner_1.jpg",
  "categoryId": "cg_1",
  "price": 3290,
  "sizes": ["7.5 UK", "8 UK", "8.5 UK", "9 UK", "10 UK"]
}
```

#### Example Response (201 Created):
```json
{
  "success": true,
  "message": "เพิ่มสินค้าเรียบร้อยแล้ว",
  "data": {
    "proId": "pro_007"
  }
}
```

---

### 7.4 แก้ไขข้อมูลสินค้า (Update Product)
อัปเดตข้อมูลสินค้า และอัปเดตรายการขนาด (Sizes)

- **Method:** `PUT`
- **Endpoint:** `/api/admin/products/:id`

#### HTTP Request Format (`.http`):
```http
PUT http://localhost:3000/api/admin/products/pro_007
Content-Type: application/json

{
  "proName": "Sadida Air Velocity Pro Edit",
  "description": "ปรับปรุงดีไซน์สีพิเศษ เบาขึ้น 15% พร้อมพื้นกันลื่นขั้นสูง",
  "price": 3490,
  "categoryId": "cg_1",
  "sizes": ["8 UK", "8.5 UK", "9 UK", "9.5 UK"]
}
```

#### Example Response (200 OK):
```json
{
  "success": true,
  "message": "แก้ไขสินค้าเรียบร้อยแล้ว",
  "data": {
    "proId": "pro_007"
  }
}
```

---

### 7.5 ลบสินค้า (Delete Product)
ลบสินค้าออกจากระบบ โดยระบบจะลบข้อมูลไซส์ใน `product_detail` ที่เกี่ยวข้องให้อัตโนมัติ

- **Method:** `DELETE`
- **Endpoint:** `/api/admin/products/:id`

#### HTTP Request Format (`.http`):
```http
DELETE http://localhost:3000/api/admin/products/pro_007
Content-Type: application/json
```

#### Example Response (200 OK):
```json
{
  "success": true,
  "message": "ลบสินค้าเรียบร้อยแล้ว",
  "data": {
    "proId": "pro_007"
  }
}
```

---

## 8. Admin — Categories

### 8.1 ดึงรายการหมวดหมู่สินค้าทั้งหมด
- **Method:** `GET`
- **Endpoint:** `/api/admin/products/categories`

#### HTTP Request Format (`.http`):
```http
GET http://localhost:3000/api/admin/products/categories
Content-Type: application/json
```

---

### 8.2 เพิ่มหมวดหมู่ใหม่
- **Method:** `POST`
- **Endpoint:** `/api/admin/products/categories`

#### HTTP Request Format (`.http`):
```http
POST http://localhost:3000/api/admin/products/categories
Content-Type: application/json

{
  "categoryName": "รองเท้าเทรนนิ่ง"
}
```

#### Example Response (201 Created):
```json
{
  "success": true,
  "message": "เพิ่มหมวดหมู่เรียบร้อยแล้ว",
  "data": {
    "categoryId": "cg_3",
    "categoryName": "รองเท้าเทรนนิ่ง"
  }
}
```

---

### 8.3 ลบหมวดหมู่
*(หมายเหตุ: จะไม่อนุญาตให้ลบ หากยังมีสินค้าที่เชื่อมต่อกับหมวดหมู่นี้อยู่)*

- **Method:** `DELETE`
- **Endpoint:** `/api/admin/products/categories/:id`

#### HTTP Request Format (`.http`):
```http
DELETE http://localhost:3000/api/admin/products/categories/cg_3
Content-Type: application/json
```

#### Example Response (200 OK):
```json
{
  "success": true,
  "message": "ลบหมวดหมู่เรียบร้อยแล้ว"
}
```

#### Example Response (400 Bad Request — หากมีสินค้าผูกอยู่):
```json
{
  "success": false,
  "error": "มีสินค้าอยู่ในหมวดหมู่นี้อยู่ไม่สามารถลบได้",
  "message": "มีสินค้าอยู่ในหมวดหมู่นี้อยู่ไม่สามารถลบได้ (พบสินค้า 3 รายการ)"
}
```

---

## 9. Admin — Product Details / Sizes

### 9.1 ดึงรายการไซส์และราคาของสินค้าทั้งหมด
- **Method:** `GET`
- **Endpoint:** `/api/admin/products/product-details/all`

#### HTTP Request Format (`.http`):
```http
GET http://localhost:3000/api/admin/products/product-details/all
Content-Type: application/json
```

---

### 9.2 เพิ่มขนาดสินค้าเดี่ยว (Single Size)
- **Method:** `POST`
- **Endpoint:** `/api/admin/products/product-details`

#### HTTP Request Format (`.http`):
```http
POST http://localhost:3000/api/admin/products/product-details
Content-Type: application/json

{
  "proId": "pro_001",
  "prodetailSize": "11 UK"
}
```

#### Example Response (201 Created):
```json
{
  "success": true,
  "message": "เพิ่มขนาดเรียบร้อยแล้ว",
  "data": {
    "prodetailId": "pdd_034",
    "prodetailSize": "11 UK",
    "proId": "pro_001"
  }
}
```

---

## 10. Admin — Image Upload

### 10.1 อัปโหลดรูปภาพสินค้า (Base64 Data URL)
อัปโหลดไฟล์รูปภาพรองเท้าโดยส่งเป็น Data URL (Base64) เซิร์ฟเวอร์จะบันทึกไฟล์ลงใน `client/public/images/` และส่ง URL เส้นทางไฟล์กลับมา

- **Method:** `POST`
- **Endpoint:** `/api/admin/products/upload`

#### HTTP Request Format (`.http`):
```http
POST http://localhost:3000/api/admin/products/upload
Content-Type: application/json

{
  "dataUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
}
```

#### Example Response (200 OK):
```json
{
  "success": true,
  "message": "อัปโหลดรูปภาพสำเร็จ",
  "data": {
    "url": "/images/shoe_custom_1730279000000_a1b2.png"
  }
}
```

---

## 11. Admin — Contacts

### 11.1 ดึงรายการข้อความติดต่อทั้งหมดสำหรับแอดมิน
- **Method:** `GET`
- **Endpoint:** `/api/admin/contacts`

#### HTTP Request Format (`.http`):
```http
GET http://localhost:3000/api/admin/contacts
Content-Type: application/json
```

---

### 11.2 ดึงรายละเอียดข้อความติดต่อตาม ID
- **Method:** `GET`
- **Endpoint:** `/api/admin/contacts/:id`

#### HTTP Request Format (`.http`):
```http
GET http://localhost:3000/api/admin/contacts/cnt_sample_001
Content-Type: application/json
```

#### Example Response (200 OK):
```json
{
  "success": true,
  "data": {
    "contactsId": "cnt_sample_001",
    "contactsName": "สมชาย ใจดี",
    "email": "somchai@example.com",
    "phone": "0891234567",
    "subject": "สอบถามสินค้า",
    "contactsMessage": "สนใจรองเท้า Sadida Zoom Runner X1 ไซส์ 9 UK ยังมีในสต็อกไหมครับ?"
  }
}
```

---

### 11.3 ลบข้อความติดต่อ
- **Method:** `DELETE`
- **Endpoint:** `/api/admin/contacts/:id`

#### HTTP Request Format (`.http`):
```http
DELETE http://localhost:3000/api/admin/contacts/cnt_sample_001
Content-Type: application/json
```

#### Example Response (200 OK):
```json
{
  "success": true,
  "message": "ลบข้อความติดต่อเรียบร้อยแล้ว",
  "data": {
    "contactsId": "cnt_sample_001"
  }
}
```

---

## 💡 ทริกการนำไปใช้งาน (Quick Tips)

### การนำไปใช้ใน VS Code (REST Client Extension)
1. ติดตั้ง Extension: **REST Client** (โดย Huachao Mao) หรือ **Thunder Client**
2. สามารถบันทึกเนื้อหาโค้ดบล็อกส่วน `### ...` ไปไว้ในไฟล์ชื่อ `requests.http`
3. จะปรากฏปุ่ม `Send Request` เหนือแต่ละ Request เพื่อกดทดสอบและดู Response ได้ทันที!

### การนำเข้าสู่ Postman (Import)
1. เปิดโปรแกรม **Postman** -> กดปุ่ม **Import** (มุมซ้ายบน)
2. เลือกแท็บ **Raw text**
3. คัดลอกบล็อกคำขอ HTTP หรือ cURL ที่ต้องการวาง แล้วกด **Import** ได้ทันที

