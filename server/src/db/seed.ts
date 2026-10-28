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
    // 3. Products (สินค้ารองเท้า 6 รายการ)
    //    เก็บรูปเป็น path ไฟล์ใน client/public/images/
    // ──────────────────────────────────────────────
    console.log("📌 3/6 — เพิ่ม Products (6 รายการ พร้อม path รูปภาพ)...");
    await db
      .insert(product)
      .values([
        {
          proId: "pro_001",
          proName: "Sadida Zoom Runner X1",
          description: "รองเท้าวิ่งสายสปีด น้ำหนักเบาพิเศษ พื้นโฟมซับแรงกระแทก เด้งทุกก้าว",
          img: "/images/shoe_runner_1.jpg",
          price: 1990.00,         // ฿1,990
          categoryId: "cg_1",     // รองเท้าวิ่ง
        },
        {
          proId: "pro_002",
          proName: "Sadida Pure Walk Classic",
          description: "รองเท้าเดินหนังพรีเมียมสีขาวบริสุทธิ์ นุ่มสบาย ซัพพอร์ตสรีระเท้าตลอดวัน",
          img: "/images/shoe_walker_1.jpg",
          price: 1790.00,         // ฿1,790
          categoryId: "cg_2",     // รองเท้าเดิน
        },
        {
          proId: "pro_003",
          proName: "Sadida Swift Aeroflow",
          description: "นวัตกรรมผ้าถักระบายอากาศขั้นสูง ดีไซน์สปอร์ตมินิมอลสำหรับนักวิ่งทางไกล",
          img: "/images/shoe_runner_2.jpg",
          price: 2190.00,         // ฿2,190
          categoryId: "cg_1",     // รองเท้าวิ่ง
        },
        {
          proId: "pro_004",
          proName: "Sadida Urban Pace Leather",
          description: "รองเท้าเดินสไตล์สตรีทมินิมอล หนังแท้สีดำสนิทแมตช์ขอบขาวสุดไอคอนิก",
          img: "/images/shoe_walker_2.jpg",
          price: 2490.00,         // ฿2,490
          categoryId: "cg_2",     // รองเท้าเดิน
        },
        {
          proId: "pro_005",
          proName: "Sadida Monochrome Studio Edit",
          description: "รุ่นลิมิเต็ดจากการออกแบบในสตูดิโอ ผสานความยืดหยุ่นและการรองรับแรงกระแทก",
          img: "/images/shoe_runner_1.jpg",
          price: 2890.00,         // ฿2,890
          categoryId: "cg_1",     // รองเท้าวิ่ง
        },
        {
          proId: "pro_006",
          proName: "Sadida All-Day Commuter",
          description: "ความเรียบหรูที่ลงตัวสำหรับวันทำงานและการเดินท่องเที่ยวในเมือง",
          img: "/images/shoe_walker_1.jpg",
          price: 1290.00,         // ฿1,290
          categoryId: "cg_2",     // รองเท้าเดิน
        },
      ])
      .onConflictDoNothing();
    console.log("  ✅ Products: 6 รายการ (3 วิ่ง + 3 เดิน)\n");

    // ──────────────────────────────────────────────
    // 4. Product Details (ขนาดรองเท้า เชื่อมโยงกับแต่ละสินค้า)
    // ──────────────────────────────────────────────
    console.log("📌 4/6 — เพิ่ม Product Details (ไซส์ตามสินค้า แต่ละรุ่นมี 4-7 ไซส์)...");
    await db
      .insert(productDetail)
      .values([
        // pro_001: Sadida Zoom Runner X1 (6 ไซส์)
        { prodetailId: "pdd_001", proId: "pro_001", prodetailSize: "7 UK" },
        { prodetailId: "pdd_002", proId: "pro_001", prodetailSize: "7.5 UK" },
        { prodetailId: "pdd_003", proId: "pro_001", prodetailSize: "8 UK" },
        { prodetailId: "pdd_004", proId: "pro_001", prodetailSize: "8.5 UK" },
        { prodetailId: "pdd_005", proId: "pro_001", prodetailSize: "9 UK" },
        { prodetailId: "pdd_006", proId: "pro_001", prodetailSize: "10 UK" },

        // pro_002: Sadida Pure Walk Classic (5 ไซส์)
        { prodetailId: "pdd_007", proId: "pro_002", prodetailSize: "6.5 UK" },
        { prodetailId: "pdd_008", proId: "pro_002", prodetailSize: "7 UK" },
        { prodetailId: "pdd_009", proId: "pro_002", prodetailSize: "7.5 UK" },
        { prodetailId: "pdd_010", proId: "pro_002", prodetailSize: "8 UK" },
        { prodetailId: "pdd_011", proId: "pro_002", prodetailSize: "9 UK" },

        // pro_003: Sadida Swift Aeroflow (7 ไซส์)
        { prodetailId: "pdd_012", proId: "pro_003", prodetailSize: "7.5 UK" },
        { prodetailId: "pdd_013", proId: "pro_003", prodetailSize: "8 UK" },
        { prodetailId: "pdd_014", proId: "pro_003", prodetailSize: "8.5 UK" },
        { prodetailId: "pdd_015", proId: "pro_003", prodetailSize: "9 UK" },
        { prodetailId: "pdd_016", proId: "pro_003", prodetailSize: "9.5 UK" },
        { prodetailId: "pdd_017", proId: "pro_003", prodetailSize: "10 UK" },
        { prodetailId: "pdd_018", proId: "pro_003", prodetailSize: "10.5 UK" },

        // pro_004: Sadida Urban Pace Leather (4 ไซส์)
        { prodetailId: "pdd_019", proId: "pro_004", prodetailSize: "7.5 UK" },
        { prodetailId: "pdd_020", proId: "pro_004", prodetailSize: "8 UK" },
        { prodetailId: "pdd_021", proId: "pro_004", prodetailSize: "8.5 UK" },
        { prodetailId: "pdd_022", proId: "pro_004", prodetailSize: "9 UK" },

        // pro_005: Sadida Monochrome Studio Edit (5 ไซส์)
        { prodetailId: "pdd_023", proId: "pro_005", prodetailSize: "8 UK" },
        { prodetailId: "pdd_024", proId: "pro_005", prodetailSize: "8.5 UK" },
        { prodetailId: "pdd_025", proId: "pro_005", prodetailSize: "9 UK" },
        { prodetailId: "pdd_026", proId: "pro_005", prodetailSize: "9.5 UK" },
        { prodetailId: "pdd_027", proId: "pro_005", prodetailSize: "10 UK" },

        // pro_006: Sadida All-Day Commuter (6 ไซส์)
        { prodetailId: "pdd_028", proId: "pro_006", prodetailSize: "6.5 UK" },
        { prodetailId: "pdd_029", proId: "pro_006", prodetailSize: "7 UK" },
        { prodetailId: "pdd_030", proId: "pro_006", prodetailSize: "7.5 UK" },
        { prodetailId: "pdd_031", proId: "pro_006", prodetailSize: "8 UK" },
        { prodetailId: "pdd_032", proId: "pro_006", prodetailSize: "8.5 UK" },
        { prodetailId: "pdd_033", proId: "pro_006", prodetailSize: "9 UK" },
      ])
      .onConflictDoNothing();
    console.log("  ✅ Product Details: 33 รายการ (ไซส์ 6.5 UK – 10.5 UK เชื่อมโยงกับแต่ละสินค้า)\n");

    // ──────────────────────────────────────────────
    // 5. Users (ผู้ใช้เริ่มต้น — แอดมิน 1 คน)
    // ──────────────────────────────────────────────
    console.log("📌 5/6 — เพิ่ม Users (แอดมินเริ่มต้น พร้อม hash รหัสผ่าน)...");
    const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;
    if (!initialPassword) {
      throw new Error("ADMIN_INITIAL_PASSWORD is not defined");
    }
    const adminPasswordHash = await Bun.password.hash(initialPassword, {
      algorithm: "bcrypt",
      cost: 10,
    });
    await db
      .insert(users)
      .values([
        {
          usersId: "usr_admin_001",
          usersName: "Admin Sadida",
          phone: "0812345678",
          passwordHash: adminPasswordHash,
          userRolesId: "r_1",                // Admin
        },
      ])
      .onConflictDoNothing();
    console.log("  ✅ Users: Admin Sadida (usr_admin_001) — รหัสผ่านถูก hash ด้วย bcrypt แล้ว\n");

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
    console.log("   • Products      : 6 รายการ (เก็บ path รูปภาพ)");
    console.log("   • Product Detail: 33 รายการ (ไซส์ตามรุ่น 4-7 ไซส์/สินค้า)");
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
