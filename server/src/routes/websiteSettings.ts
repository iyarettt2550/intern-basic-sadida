import { Hono } from "hono";
import { db } from "../db";
import { websiteSettings } from "../db/schema";
import { eq } from "drizzle-orm";
import { adminAuthMiddleware } from "../middlewares/auth";

const router = new Hono();

export const DEFAULT_WEBSITE_CONFIG = {
  brand: {
    brandName: "SADIDA",
    brandTagline: "FOOTWEAR • BLACK & WHITE",
    brandLogo: "/logo.jpg",
    footerAbout:
      "Sadida แบรนด์รองเท้าวิ่งและรองเท้าเดินที่คัดสรรวัสดุพรีเมียม โครงสร้างน้ำหนักเบา และเอกลักษณ์โทนสีดำกับสีขาว สไตล์มินิมอลเหนือกาลเวลา",
    topNotice: "🔥 คอลเลกชันใหม่ SADIDA 2026 พร้อมเปิดตัวอย่างเป็นทางการแล้ว",
    showTopNotice: false,
  },
  pages: [
    {
      id: "home",
      name: "หน้าหลัก (Brand Home)",
      route: "/",
      sections: [
        {
          id: "hero",
          name: "แบนเนอร์หลัก (Hero Banner)",
          visible: true,
          image: "/images/hero_sketch.jpg",
          texts: {
            headline: "CRAFTED FOR PURE MOTION.",
            subtitle: "จากภาพร่างสเก็ตช์ในสตูดิโอ สู่นวัตกรรมรองเท้าวิ่งและรองเท้าเดินที่เรียบหรูเหนือกาลเวลา",
            badge: "Sadida Concept Atelier",
          },
        },
        {
          id: "products",
          name: "แถบเลื่อนสินค้า (Product Carousel)",
          visible: true,
          selectedProductIds: ["pro_001", "pro_002", "pro_003", "pro_004", "pro_005", "pro_006"],
          texts: {
            title: "สินค้าของแบรนด์ SADIDA",
            subtitle: "เลือกช้อปรองเท้าคุณภาพสูง แบ่งออกเป็น 2 ประเภทหลัก ได้แก่ รองเท้าวิ่ง สำหรับความเร็ว และ รองเท้าเดิน สำหรับความสบายทุกวัน",
            badge: "Sadida Collection 2026",
          },
        },
        {
          id: "brand",
          name: "ปรัชญาแบรนด์ (Brand Story)",
          visible: true,
          texts: {
            title: "ทำไมต้องเป็นโทนสีดำกับสีขาว ของ SADIDA?",
            description: "เราตัดทอนสีสันที่ไม่จำเป็นออก เพื่อให้คุณสัมผัสกับโครงสร้างที่แท้จริงของรองเท้า",
          },
        },
      ],
    },
    {
      id: "products",
      name: "หน้าสินค้า (Store)",
      route: "/products",
      sections: [
        {
          id: "sidebar",
          name: "แถบกรอง (Filter Sidebar)",
          visible: true,
          texts: {
            title: "Navbar Menu",
          },
        },
        {
          id: "productGrid",
          name: "ตารางสินค้า (Product Grid)",
          visible: true,
          texts: {
            title: "สินค้าทั้งหมด (PRODUCTS)",
            emptyMessage: "ไม่พบสินค้าที่ตรงกับเงื่อนไข",
          },
        },
      ],
    },
    {
      id: "contact",
      name: "หน้าติดต่อเรา (Contact)",
      route: "/contact",
      sections: [
        {
          id: "contactForm",
          name: "ฟอร์มติดต่อเรา (Contact Form)",
          visible: true,
          texts: {
            title: "ติดต่อเรา",
            description: "ส่งข้อความถึงทีมงาน Sadida",
            buttonText: "ส่ง",
          },
        },
        {
          id: "contactInfo",
          name: "ข้อมูลที่อยู่และแผนที่ (Address & Map)",
          visible: true,
          texts: {
            title: "รายละเอียดที่อยู่",
            address: "Sadida Flagship Atelier & Store 99/4 อาคารนวัตกรรมดีไซน์ ชั้น 1 แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ 10110",
            phone: "081-234-5678",
            email: "contact@sadida.co.th",
            mapTitle: "map (แผนที่ตั้ง)",
            mapLat: "13.7380",
            mapLng: "100.5630",
            mapZoom: "15",
            googleMapsApiKey: "",
          },
        },
      ],
    },
  ],
};

// GET /api/website-config — Public endpoint for fetching current website configuration
router.get("/", async (c) => {
  try {
    const rows = await db
      .select()
      .from(websiteSettings)
      .where(eq(websiteSettings.id, "default"))
      .limit(1);

    if (rows.length === 0 || !rows[0].configJson) {
      // Seed default record if not present
      try {
        await db.insert(websiteSettings).values({
          id: "default",
          brandName: DEFAULT_WEBSITE_CONFIG.brand.brandName,
          brandTagline: DEFAULT_WEBSITE_CONFIG.brand.brandTagline,
          brandLogo: DEFAULT_WEBSITE_CONFIG.brand.brandLogo,
          footerAbout: DEFAULT_WEBSITE_CONFIG.brand.footerAbout,
          topNotice: DEFAULT_WEBSITE_CONFIG.brand.topNotice,
          showTopNotice: DEFAULT_WEBSITE_CONFIG.brand.showTopNotice,
          configJson: JSON.stringify(DEFAULT_WEBSITE_CONFIG),
          updatedAt: new Date(),
        });
      } catch {
        // If conflict or concurrent insert, ignore
      }
      return c.json({ success: true, data: DEFAULT_WEBSITE_CONFIG });
    }

    const parsed = JSON.parse(rows[0].configJson);
    return c.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error("Failed to fetch website config from DB:", err);
    return c.json({ success: true, data: DEFAULT_WEBSITE_CONFIG });
  }
});

// PUT /api/website-config or /api/admin/website-config — Update website configuration (Admin protected)
router.put("/", adminAuthMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const { brand, pages } = body;

    if (!brand || !Array.isArray(pages)) {
      return c.json({ success: false, error: "Invalid configuration format (brand and pages required)" }, 400);
    }

    const fullConfig = { brand, pages };
    const configString = JSON.stringify(fullConfig);

    const existing = await db
      .select({ id: websiteSettings.id })
      .from(websiteSettings)
      .where(eq(websiteSettings.id, "default"))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(websiteSettings)
        .set({
          brandName: brand.brandName || "SADIDA",
          brandTagline: brand.brandTagline || "",
          brandLogo: brand.brandLogo || "/logo.jpg",
          footerAbout: brand.footerAbout || "",
          topNotice: brand.topNotice || "",
          showTopNotice: Boolean(brand.showTopNotice),
          configJson: configString,
          updatedAt: new Date(),
        })
        .where(eq(websiteSettings.id, "default"));
    } else {
      await db.insert(websiteSettings).values({
        id: "default",
        brandName: brand.brandName || "SADIDA",
        brandTagline: brand.brandTagline || "",
        brandLogo: brand.brandLogo || "/logo.jpg",
        footerAbout: brand.footerAbout || "",
        topNotice: brand.topNotice || "",
        showTopNotice: Boolean(brand.showTopNotice),
        configJson: configString,
        updatedAt: new Date(),
      });
    }

    return c.json({
      success: true,
      message: "บันทึกการตั้งค่าหน้าเว็บลงฐานข้อมูลเรียบร้อยแล้ว",
      data: fullConfig,
    });
  } catch (err: any) {
    console.error("Failed to save website config:", err);
    return c.json({ success: false, error: "Failed to save website configuration", details: err?.message }, 500);
  }
});

export default router;

