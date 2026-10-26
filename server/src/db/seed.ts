import { db } from "./index";
import {
  categories,
  productDetail,
  product,
  userRoles,
  users,
  contacts,
} from "./schema";

async function seed() {
  console.log("🌱 เริ่มเพิ่มข้อมูลลงฐานข้อมูล (Seeding)...\n");

  try {
    // ──────────────────────────────────────────────
    // 1. User Roles (บทบาทผู้ใช้)
    // ──────────────────────────────────────────────
    console.log("📌 1/6 — เพิ่ม User Roles...");
    await db
      .insert(userRoles)
      .values([
        { userRolesId: "r_1", userRolesName: "Admin" },
        { userRolesId: "r_2", userRolesName: "Customer" },
      ])
      .onConflictDoNothing();
    console.log("  ✅ User Roles: Admin, Customer\n");

    // ──────────────────────────────────────────────
    // 2. Categories (หมวดหมู่สินค้า)
    // ──────────────────────────────────────────────
    console.log("📌 2/6 — เพิ่ม Categories...");
    await db
      .insert(categories)
      .values([
        { categoryId: "cg_1", categoryName: "รองเท้าวิ่ง" },
        { categoryId: "cg_2", categoryName: "รองเท้าเดิน" },
      ])
      .onConflictDoNothing();
    console.log("  ✅ Categories: รองเท้าวิ่ง (cg_1), รองเท้าเดิน (cg_2)\n");

    // ──────────────────────────────────────────────
    // 3. Product Details (ขนาดและราคา)
    // ──────────────────────────────────────────────
    console.log("📌 3/6 — เพิ่ม Product Details (ไซส์ UK + ราคา)...");
    await db
      .insert(productDetail)
      .values([
        { prodetailId: "pdd_1",  prodetailSize: "6 UK",    price: 1000.00 },
        { prodetailId: "pdd_2",  prodetailSize: "6.5 UK",  price: 1100.00 },
        { prodetailId: "pdd_3",  prodetailSize: "7 UK",    price: 1200.00 },
        { prodetailId: "pdd_4",  prodetailSize: "7.5 UK",  price: 1300.00 },
        { prodetailId: "pdd_5",  prodetailSize: "8 UK",    price: 1400.00 },
        { prodetailId: "pdd_6",  prodetailSize: "8.5 UK",  price: 1500.00 },
        { prodetailId: "pdd_7",  prodetailSize: "9 UK",    price: 1600.00 },
        { prodetailId: "pdd_8",  prodetailSize: "9.5 UK",  price: 1700.00 },
        { prodetailId: "pdd_9",  prodetailSize: "10 UK",   price: 1800.00 },
        { prodetailId: "pdd_10", prodetailSize: "10.5 UK", price: 1900.00 },
        { prodetailId: "pdd_11", prodetailSize: "11 UK",   price: 2000.00 },
        { prodetailId: "pdd_12", prodetailSize: "11.5 UK", price: 2100.00 },
        { prodetailId: "pdd_13", prodetailSize: "12 UK",   price: 2200.00 },
        { prodetailId: "pdd_14", prodetailSize: "12.5 UK", price: 2300.00 },
        { prodetailId: "pdd_16", prodetailSize: "13 UK",   price: 2400.00 },
      ])
      .onConflictDoNothing();
    console.log("  ✅ Product Details: 15 ไซส์ (6 UK – 13 UK)\n");

    // ──────────────────────────────────────────────
    // 4. Products (สินค้ารองเท้า 6 รายการ)
    //    เก็บรูปเป็น path ไฟล์ใน client/public/images/
    // ──────────────────────────────────────────────
    console.log("📌 4/6 — เพิ่ม Products (6 รายการ พร้อม path รูปภาพ)...");
    await db
      .insert(product)
      .values([
        {
          proId: "pro_001",
          proName: "Sadida Zoom Runner X1",
          description: "รองเท้าวิ่งสายสปีด น้ำหนักเบาพิเศษ พื้นโฟมซับแรงกระแทก เด้งทุกก้าว",
          img: "/images/shoe_runner_1.jpg",
          prodetailId: "pdd_6",   // 8.5 UK — ฿1,500
          categoryId: "cg_1",     // รองเท้าวิ่ง
        },
        {
          proId: "pro_002",
          proName: "Sadida Pure Walk Classic",
          description: "รองเท้าเดินหนังพรีเมียมสีขาวบริสุทธิ์ นุ่มสบาย ซัพพอร์ตสรีระเท้าตลอดวัน",
          img: "/images/shoe_walker_1.jpg",
          prodetailId: "pdd_5",   // 8 UK — ฿1,400
          categoryId: "cg_2",     // รองเท้าเดิน
        },
        {
          proId: "pro_003",
          proName: "Sadida Swift Aeroflow",
          description: "นวัตกรรมผ้าถักระบายอากาศขั้นสูง ดีไซน์สปอร์ตมินิมอลสำหรับนักวิ่งทางไกล",
          img: "/images/shoe_runner_2.jpg",
          prodetailId: "pdd_7",   // 9 UK — ฿1,600
          categoryId: "cg_1",     // รองเท้าวิ่ง
        },
        {
          proId: "pro_004",
          proName: "Sadida Urban Pace Leather",
          description: "รองเท้าเดินสไตล์สตรีทมินิมอล หนังแท้สีดำสนิทแมตช์ขอบขาวสุดไอคอนิก",
          img: "/images/shoe_walker_2.jpg",
          prodetailId: "pdd_6",   // 8.5 UK — ฿1,500
          categoryId: "cg_2",     // รองเท้าเดิน
        },
        {
          proId: "pro_005",
          proName: "Sadida Monochrome Studio Edit",
          description: "รุ่นลิมิเต็ดจากการออกแบบในสตูดิโอ ผสานความยืดหยุ่นและการรองรับแรงกระแทก",
          img: "/images/shoe_runner_1.jpg",
          prodetailId: "pdd_8",   // 9.5 UK — ฿1,700
          categoryId: "cg_1",     // รองเท้าวิ่ง
        },
        {
          proId: "pro_006",
          proName: "Sadida All-Day Commuter",
          description: "ความเรียบหรูที่ลงตัวสำหรับวันทำงานและการเดินท่องเที่ยวในเมือง",
          img: "/images/shoe_walker_1.jpg",
          prodetailId: "pdd_5",   // 8 UK — ฿1,400
          categoryId: "cg_2",     // รองเท้าเดิน
        },
      ])
      .onConflictDoNothing();
    console.log("  ✅ Products: 6 รายการ (3 วิ่ง + 3 เดิน)\n");

    // ──────────────────────────────────────────────
    // 5. Users (ผู้ใช้เริ่มต้น — แอดมิน 1 คน)
    // ──────────────────────────────────────────────
    console.log("📌 5/6 — เพิ่ม Users (แอดมินเริ่มต้น)...");
    await db
      .insert(users)
      .values([
        {
          usersId: "usr_admin_001",
          usersName: "Admin Sadida",
          phone: "0812345678",
          passwordHash: "12345",  // ในการใช้งานจริงควร hash ด้วย Bun.password
          userRolesId: "r_1",                // Admin
        },
      ])
      .onConflictDoNothing();
    console.log("  ✅ Users: Admin Sadida (usr_admin_001)\n");

    // ──────────────────────────────────────────────
    // 6. Contacts (ข้อความติดต่อตัวอย่าง)
    // ──────────────────────────────────────────────
    console.log("📌 6/6 — เพิ่ม Contacts (ข้อความตัวอย่าง)...");
    await db
      .insert(contacts)
      .values([
        {
          contactsId: "cnt_sample_001",
          contactsName: "สมชาย ใจดี",
          email: "somchai@example.com",
          phone: "0891234567",
          subject: "สอบถามสินค้า",
          contactsMessage: "สนใจรองเท้า Sadida Zoom Runner X1 ไซส์ 9 UK ยังมีในสต็อกไหมครับ?",
        },
        {
          contactsId: "cnt_sample_002",
          contactsName: "สมหญิง รักเดิน",
          email: "somying@example.com",
          phone: "0867654321",
          subject: "แจ้งปัญหาการสั่งซื้อ",
          contactsMessage: "สั่งรองเท้า Pure Walk Classic ไป 3 วันแล้วยังไม่ได้รับการยืนยันค่ะ",
        },
        {
          contactsId: "cnt_sample_003",
          contactsName: "ธนากร สปอร์ตแมน",
          email: "thanakorn@example.com",
          phone: "0923456789",
          subject: "ขอคำแนะนำ",
          contactsMessage: "อยากได้รองเท้าวิ่งระยะไกล มีรุ่นไหนแนะนำบ้างครับ งบ 2,000 บาท",
        },
      ])
      .onConflictDoNothing();
    console.log("  ✅ Contacts: 3 ข้อความตัวอย่าง\n");

    // ──────────────────────────────────────────────
    console.log("═══════════════════════════════════════════");
    console.log("🎉 เพิ่มข้อมูลทั้งหมดลงฐานข้อมูลเรียบร้อย!");
    console.log("═══════════════════════════════════════════");
    console.log("📊 สรุป:");
    console.log("   • User Roles    : 2 รายการ (Admin, Customer)");
    console.log("   • Categories    : 2 รายการ (วิ่ง, เดิน)");
    console.log("   • Product Detail: 15 ไซส์ (6 UK – 13 UK)");
    console.log("   • Products      : 6 รายการ (เก็บ path รูปภาพ)");
    console.log("   • Users         : 1 คน (Admin)");
    console.log("   • Contacts      : 3 ข้อความตัวอย่าง");
    console.log("═══════════════════════════════════════════\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed ล้มเหลว:", error);
    process.exit(1);
  }
}

seed();
