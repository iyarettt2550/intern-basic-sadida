# 📡 Sadida API Reference

**Base URL:** `http://localhost:3000` (Local) | `https://intern-basic-sadida-h1t2.vercel.app` (Production)

---

## 1. Health Check

### `GET /api/health` หรือ `GET /`
ตรวจสอบสถานะการทำงานของเซิร์ฟเวอร์
```json
// Response 200 OK
{
  "success": true,
  "status": "ok",
  "message": "Sadida Backend API is running",
  "timestamp": "2026-11-04T04:41:43.348Z"
}
```

---

## 2. Authentication

### `POST /api/auth/login`
เข้าสู่ระบบแอดมิน (ใช้ `userName` หรือ `phone` คู่กับ `password`)
```json
// Request Body
{ "userName": "Admin Sadida", "password": "12345" }
// หรือ
{ "phone": "0812345678", "password": "12345" }

// Response 200 OK
{
  "success": true,
  "data": { "usersId": "usr_admin_001", "usersName": "Admin Sadida", "role": "Admin" }
}
```

### `GET /api/auth/me`
ตรวจสอบสถานะ Session ของผู้ใช้ปัจจุบัน

---

## 3. Storefront (หน้าร้าน)

### `GET /api/products` (หรือ `/api/services`)
ดึงรายการสินค้ารองเท้าทั้งหมด พร้อมข้อมูลหมวดหมู่และขนาด (Sizes)
```json
// Response 200 OK
{
  "success": true,
  "data": [
    {
      "proId": "pro_001",
      "proName": "Sadida Zoom Runner X1",
      "price": 1990,
      "categoryName": "รองเท้าวิ่ง",
      "sizes": ["7 UK", "7.5 UK", "8 UK"]
    }
  ]
}
```

### `GET /api/categories`
ดึงรายการหมวดหมู่สินค้าทั้งหมด

---

## 4. Contact (ติดต่อเรา)

### `POST /api/contact`
ส่งข้อความติดต่อจากลูกค้า
```json
// Request Body
{
  "name": "สมชาย ใจดี",
  "email": "somchai@example.com",
  "phone": "0812345678",
  "subject": "สอบถามสินค้า",
  "message": "สนใจรองเท้ารุ่น Runner X1"
}
```

### `GET /api/contact`
ดึงรายการข้อความติดต่อทั้งหมด

---

## 5. Admin — Dashboard Stats

### `GET /api/admin/products/stats/summary`
สรุปสถิติจำนวนสินค้าและหมวดหมู่สำหรับหน้า Dashboard
```json
// Response 200 OK
{
  "success": true,
  "data": { "totalProducts": 6, "totalCategories": 2, "categories": [...] }
}
```

### `GET /api/admin/contacts/stats/summary`
สรุปจำนวนข้อความติดต่อทั้งหมด
```json
// Response 200 OK
{ "success": true, "data": { "totalContacts": 3 } }
```

---

## 6. Admin — Products (จัดการสินค้า)

### `GET /api/admin/products`
ดึงรายการสินค้าทั้งหมดในระบบ

### `GET /api/admin/products/:id`
ดึงรายละเอียดสินค้าตาม ID (เช่น `/api/admin/products/pro_001`)

### `POST /api/admin/products`
เพิ่มสินค้าใหม่พร้อมไซส์ (หากไม่ส่ง `proId` ระบบจะสร้างให้อัตโนมัติ)
```json
// Request Body
{
  "proName": "Sadida Air Velocity",
  "description": "รองเท้าวิ่งสายมาราธอน น้ำหนักเบาพิเศษ",
  "img": "/images/shoe_runner_1.jpg",
  "categoryId": "cg_1",
  "price": 2590,
  "sizes": ["7 UK", "8 UK", "9 UK"]
}
```

### `PUT /api/admin/products/:id`
แก้ไขข้อมูลสินค้าและขนาดรองเท้า
```json
// Request Body
{
  "proName": "Sadida Air Velocity Pro",
  "price": 2790,
  "sizes": ["8 UK", "9 UK", "10 UK"]
}
```

### `DELETE /api/admin/products/:id`
ลบสินค้าออกจากระบบ (ลบข้อมูลไซส์ที่เกี่ยวข้องให้อัตโนมัติ)

---

## 7. Admin — Categories (จัดการหมวดหมู่)

### `GET /api/admin/products/categories`
ดึงรายการหมวดหมู่สินค้าทั้งหมด

### `POST /api/admin/products/categories`
เพิ่มหมวดหมู่ใหม่
```json
// Request Body
{ "categoryName": "รองเท้าเทรนนิ่ง" }
```

### `DELETE /api/admin/products/categories/:id`
ลบหมวดหมู่ตาม ID (จะไม่อนุญาตให้ลบหากยังมีสินค้าผูกอยู่)

---

## 8. Admin — Product Details / Sizes (จัดการไซส์)

### `GET /api/admin/products/product-details/all`
ดึงรายการไซส์และราคาของสินค้าทั้งหมด

### `POST /api/admin/products/product-details`
เพิ่มไซส์ใหม่ให้สินค้า
```json
// Request Body
{ "proId": "pro_001", "prodetailSize": "11 UK" }
```

---

## 9. Admin — Upload (อัปโหลดรูปภาพ)

### `POST /api/admin/products/upload`
อัปโหลดรูปภาพแบบ Base64 data URL (บันทึกลง `client/public/images/`)
```json
// Request Body
{ "dataUrl": "data:image/png;base64,..." }

// Response 200 OK
{ "success": true, "data": { "url": "/images/shoe_custom_123.png" } }
```

---

## 10. Admin — Contacts (จัดการข้อความติดต่อ)

### `GET /api/admin/contacts`
ดึงรายการข้อความติดต่อทั้งหมด

### `GET /api/admin/contacts/:id`
ดึงรายละเอียดข้อความติดต่อตาม ID

### `DELETE /api/admin/contacts/:id`
ลบข้อความติดต่อตาม ID
