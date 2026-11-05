var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/src/index.ts
import { Hono as Hono8 } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import path2 from "path";
import { mkdir as mkdir2, writeFile as writeFile2 } from "node:fs/promises";
import { put as put2 } from "@vercel/blob";

// server/src/routes/categories.ts
import { Hono } from "hono";

// server/src/db/index.ts
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeonHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";

// server/src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  categories: () => categories,
  categoriesRelations: () => categoriesRelations,
  contacts: () => contacts,
  product: () => product,
  productDetail: () => productDetail,
  productDetailRelations: () => productDetailRelations,
  productRelations: () => productRelations,
  userRoles: () => userRoles,
  users: () => users,
  usersRelations: () => usersRelations,
  websiteSettings: () => websiteSettings
});
import { pgTable, varchar, text, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
var categories = pgTable("categories", {
  categoryId: varchar("category_id", { length: 10 }).primaryKey(),
  categoryName: varchar("category_name", { length: 50 }).notNull().unique()
});
var productDetail = pgTable("product_detail", {
  prodetailId: varchar("prodetail_id", { length: 12 }).primaryKey(),
  proId: varchar("pro_id", { length: 20 }).notNull().references(() => product.proId),
  prodetailSize: varchar("prodetail_size", { length: 10 }).notNull()
});
var product = pgTable("product", {
  proId: varchar("pro_id", { length: 20 }).primaryKey(),
  proName: varchar("pro_name", { length: 50 }).notNull(),
  description: text("description").notNull(),
  price: numeric("price").notNull(),
  categoryId: varchar("category_id", { length: 10 }).notNull().references(() => categories.categoryId),
  img: text("img").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});
var contacts = pgTable("contacts", {
  contactsId: varchar("contacts_id", { length: 50 }).primaryKey(),
  contactsName: varchar("contacts_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  contactsMessage: text("contacts_message").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("unread"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});
var websiteSettings = pgTable("website_settings", {
  id: varchar("id", { length: 50 }).primaryKey().default("default"),
  brandName: varchar("brand_name", { length: 100 }),
  brandTagline: varchar("brand_tagline", { length: 255 }),
  brandLogo: text("brand_logo"),
  footerAbout: text("footer_about"),
  topNotice: varchar("top_notice", { length: 255 }),
  showTopNotice: boolean("show_top_notice").default(false),
  configJson: text("config_json").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});
var userRoles = pgTable("user_roles", {
  userRolesId: varchar("user_roles_id", { length: 5 }).primaryKey(),
  userRolesName: varchar("user_roles_name", { length: 20 }).notNull()
});
var users = pgTable("users", {
  usersId: varchar("users_id", { length: 50 }).primaryKey(),
  usersName: varchar("users_name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 10 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  userRolesId: varchar("user_roles_id", { length: 5 }).notNull().references(() => userRoles.userRolesId)
});
var productRelations = relations(product, ({ one, many }) => ({
  category: one(categories, {
    fields: [product.categoryId],
    references: [categories.categoryId]
  }),
  // แก้ไขตรงนี้: เปลี่ยนจาก one เป็น many และลบ fields/references ออก 
  // เพราะฝั่ง product ไม่ได้เก็บ Foreign Key แล้ว
  details: many(productDetail)
}));
var categoriesRelations = relations(categories, ({ many }) => ({
  products: many(product)
}));
var productDetailRelations = relations(productDetail, ({ one }) => ({
  // แก้ไขตรงนี้: เปลี่ยนจาก many เป็น one และระบุจุดเชื่อม 
  // เพราะตารางนี้เป็นคนเก็บ Foreign key (proId) เอาไว้
  product: one(product, {
    fields: [productDetail.proId],
    references: [product.proId]
  })
}));
var usersRelations = relations(users, ({ one }) => ({
  role: one(userRoles, {
    fields: [users.userRolesId],
    references: [userRoles.userRolesId]
  })
}));

// server/src/db/index.ts
if (!process.env.VERCEL) {
  dotenv.config({ path: ".env.local" });
  dotenv.config();
}
var connectionString = process.env.DATABASE_URL || (!process.env.VERCEL ? "postgresql://postgres:1234@localhost:5432/sadida" : "");
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Please configure DATABASE_URL in environment variables.");
}
var useNeonHttp = Boolean(process.env.VERCEL) || /neon\.(tech|build)/i.test(connectionString);
var db = useNeonHttp ? drizzleNeonHttp(neon(connectionString), { schema: schema_exports }) : drizzlePostgres(postgres(connectionString), { schema: schema_exports });

// server/src/routes/categories.ts
var router = new Hono();
router.get("/", async (c) => {
  try {
    const list = await db.select().from(categories);
    return c.json({
      success: true,
      data: list
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Failed to fetch categories",
        details: error?.message
      },
      500
    );
  }
});
var categories_default = router;

// server/src/routes/services.ts
import { Hono as Hono2 } from "hono";
import { eq } from "drizzle-orm";
var router2 = new Hono2();
var sortSizeList = (list) => {
  return [...list].sort((a, b) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });
};
router2.get("/", async (c) => {
  try {
    const products = await db.select({
      proId: product.proId,
      proName: product.proName,
      description: product.description,
      img: product.img,
      price: product.price,
      categoryId: product.categoryId,
      categoryName: categories.categoryName
    }).from(product).leftJoin(categories, eq(product.categoryId, categories.categoryId));
    const allDetails = await db.select().from(productDetail);
    const items = products.map((p) => {
      const details = allDetails.filter((d) => d.proId === p.proId);
      const sizes = sortSizeList(details.map((d) => d.prodetailSize));
      return {
        ...p,
        prodetailId: details[0]?.prodetailId || "",
        prodetailSize: sizes[0] || "",
        sizes,
        details
      };
    });
    return c.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error("Public products API error:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch products"
      },
      500
    );
  }
});
router2.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const items = await db.select({
      proId: product.proId,
      proName: product.proName,
      description: product.description,
      img: product.img,
      price: product.price,
      categoryId: product.categoryId,
      categoryName: categories.categoryName
    }).from(product).leftJoin(categories, eq(product.categoryId, categories.categoryId)).where(eq(product.proId, id)).limit(1);
    if (items.length === 0) {
      return c.json({ success: false, error: "Product not found" }, 404);
    }
    const details = await db.select().from(productDetail).where(eq(productDetail.proId, id));
    const sizes = sortSizeList(details.map((d) => d.prodetailSize));
    return c.json({
      success: true,
      data: {
        ...items[0],
        prodetailId: details[0]?.prodetailId || "",
        prodetailSize: sizes[0] || "",
        sizes,
        details
      }
    });
  } catch (error) {
    console.error("Single product API error:", error);
    return c.json({ success: false, error: "Failed to fetch product" }, 500);
  }
});
var services_default = router2;

// server/src/routes/contact.ts
import { Hono as Hono3 } from "hono";

// server/src/validators/index.ts
import { z } from "zod";
var validatePhone = (raw) => {
  const clean = raw.replace(/[- ]/g, "").trim();
  if (!clean) {
    return { valid: false, message: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C" };
  }
  if (!/^\d+$/.test(clean)) {
    return { valid: false, message: "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19 (\u0E2B\u0E49\u0E32\u0E21\u0E43\u0E2A\u0E48\u0E2D\u0E31\u0E01\u0E29\u0E23\u0E2B\u0E23\u0E37\u0E2D\u0E2D\u0E31\u0E01\u0E02\u0E23\u0E30\u0E1E\u0E34\u0E40\u0E28\u0E29)" };
  }
  if (!clean.startsWith("0")) {
    return { valid: false, message: "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C\u0E43\u0E19\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28\u0E44\u0E17\u0E22\u0E15\u0E49\u0E2D\u0E07\u0E02\u0E36\u0E49\u0E19\u0E15\u0E49\u0E19\u0E14\u0E49\u0E27\u0E22\u0E40\u0E25\u0E02 0 \u0E40\u0E2A\u0E21\u0E2D" };
  }
  if (clean.length !== 9 && clean.length !== 10) {
    return { valid: false, message: "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35 10 \u0E2B\u0E25\u0E31\u0E01 (\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E21\u0E37\u0E2D\u0E16\u0E37\u0E2D) \u0E2B\u0E23\u0E37\u0E2D 9 \u0E2B\u0E25\u0E31\u0E01 (\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E1A\u0E49\u0E32\u0E19)" };
  }
  const isMobile = clean.length === 10 && /^0[689]\d{8}$/.test(clean);
  const isLandline = clean.length === 9 && /^0[23457]\d{7}$/.test(clean);
  if (!isMobile && !isLandline) {
    if (clean.length === 10) {
      return {
        valid: false,
        message: "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E21\u0E37\u0E2D\u0E16\u0E37\u0E2D 10 \u0E2B\u0E25\u0E31\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E02\u0E36\u0E49\u0E19\u0E15\u0E49\u0E19\u0E14\u0E49\u0E27\u0E22 06, 08 \u0E2B\u0E23\u0E37\u0E2D 09 \u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19 (\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E1A\u0E49\u0E32\u0E19\u0E21\u0E35 9 \u0E2B\u0E25\u0E31\u0E01)"
      };
    } else {
      return {
        valid: false,
        message: "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E1A\u0E49\u0E32\u0E19 9 \u0E2B\u0E25\u0E31\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E02\u0E36\u0E49\u0E19\u0E15\u0E49\u0E19\u0E14\u0E49\u0E27\u0E22 02 \u0E2B\u0E23\u0E37\u0E2D 03, 04, 05, 07"
      };
    }
  }
  if (/^0(\d)\1+$/.test(clean)) {
    return { valid: false, message: "\u0E44\u0E21\u0E48\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15\u0E43\u0E2B\u0E49\u0E43\u0E0A\u0E49\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E17\u0E35\u0E48\u0E40\u0E1B\u0E47\u0E19\u0E40\u0E25\u0E02\u0E0B\u0E49\u0E33\u0E01\u0E31\u0E19\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14" };
  }
  if (/(\d)\1{5,}/.test(clean)) {
    return { valid: false, message: "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C\u0E21\u0E35\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E0B\u0E49\u0E33\u0E01\u0E31\u0E19\u0E1C\u0E34\u0E14\u0E1B\u0E01\u0E15\u0E34 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E08\u0E23\u0E34\u0E07" };
  }
  const sequences = ["0123456789", "0987654321", "0876543210", "0898765432", "0678901234"];
  if (sequences.includes(clean)) {
    return { valid: false, message: "\u0E44\u0E21\u0E48\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15\u0E43\u0E2B\u0E49\u0E43\u0E0A\u0E49\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E40\u0E23\u0E35\u0E22\u0E07\u0E25\u0E33\u0E14\u0E31\u0E1A" };
  }
  return { valid: true, message: "" };
};
var validateEmail = (raw) => {
  const email = raw.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: "\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 (\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07: yourname@gmail.com)" };
  }
  const parts = email.split("@");
  if (parts.length !== 2) {
    return { valid: false, message: "\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" };
  }
  const [username, domain] = parts;
  if (username.length < 2) {
    return { valid: false, message: "\u0E0A\u0E37\u0E48\u0E2D\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22 2 \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23" };
  }
  const domainParts = domain.split(".");
  if (domainParts.length < 2) {
    return { valid: false, message: "\u0E42\u0E14\u0E40\u0E21\u0E19\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25 (\u0E40\u0E0A\u0E48\u0E19 .com \u0E2B\u0E23\u0E37\u0E2D .co.th)" };
  }
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2 || !/^[a-z]+$/.test(tld)) {
    return { valid: false, message: "\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25\u0E42\u0E14\u0E40\u0E21\u0E19\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 (\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22 2 \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23 \u0E40\u0E0A\u0E48\u0E19 .com, .co.th)" };
  }
  const mainDomain = domainParts[0];
  if (mainDomain.length < 2) {
    return { valid: false, message: "\u0E0A\u0E37\u0E48\u0E2D\u0E42\u0E14\u0E40\u0E21\u0E19\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E2A\u0E31\u0E49\u0E19\u0E1C\u0E34\u0E14\u0E1B\u0E01\u0E15\u0E34\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" };
  }
  const blockedDomains = [
    "test.com",
    "fake.com",
    "example.com",
    "asdf.com",
    "a.com",
    "hot.dog",
    "good.com",
    "htc.com",
    "temp.com",
    "trash.com",
    "mailinator.com",
    "10minutemail.com",
    "guerrillamail.com",
    "yopmail.com",
    "dispostable.com",
    "throwaway.com"
  ];
  if (blockedDomains.includes(domain)) {
    return { valid: false, message: `\u0E44\u0E21\u0E48\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15\u0E43\u0E2B\u0E49\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E08\u0E32\u0E01\u0E42\u0E14\u0E40\u0E21\u0E19 @${domain} \u0E01\u0E23\u0E38\u0E13\u0E32\u0E43\u0E0A\u0E49\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E08\u0E23\u0E34\u0E07` };
  }
  return { valid: true, message: "" };
};
var validateName = (raw) => {
  const name = raw.trim();
  if (name.length < 2) {
    return { valid: false, message: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E0A\u0E37\u0E48\u0E2D-\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22 2 \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23" };
  }
  if (name.length > 100) {
    return { valid: false, message: "\u0E0A\u0E37\u0E48\u0E2D-\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25\u0E22\u0E32\u0E27\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B (\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 100 \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23)" };
  }
  if (/(.)\1{4,}/.test(name)) {
    return { valid: false, message: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E0A\u0E37\u0E48\u0E2D\u0E08\u0E23\u0E34\u0E07 \u0E44\u0E21\u0E48\u0E43\u0E0A\u0E49\u0E2D\u0E31\u0E01\u0E29\u0E23\u0E0B\u0E49\u0E33\u0E01\u0E31\u0E19\u0E41\u0E1A\u0E1A\u0E2A\u0E41\u0E1B\u0E21" };
  }
  return { valid: true, message: "" };
};
var validateSubject = (raw) => {
  const subject = raw.trim();
  if (subject.length < 2) {
    return { valid: false, message: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E2B\u0E31\u0E27\u0E02\u0E49\u0E2D\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22 2 \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23" };
  }
  if (subject.length > 100) {
    return { valid: false, message: "\u0E2B\u0E31\u0E27\u0E02\u0E49\u0E2D\u0E22\u0E32\u0E27\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B (\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 100 \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23)" };
  }
  if (/(.)\1{4,}/.test(subject)) {
    return { valid: false, message: "\u0E2B\u0E31\u0E27\u0E02\u0E49\u0E2D\u0E21\u0E35\u0E2D\u0E31\u0E01\u0E02\u0E23\u0E30\u0E0B\u0E49\u0E33\u0E01\u0E31\u0E19\u0E1C\u0E34\u0E14\u0E1B\u0E01\u0E15\u0E34" };
  }
  return { valid: true, message: "" };
};
var validateMessage = (raw) => {
  const message = raw.trim();
  if (message.length < 5) {
    return { valid: false, message: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22 5 \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23" };
  }
  if (message.length > 1e3) {
    return { valid: false, message: "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B (\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 1000 \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23)" };
  }
  if (/(.)\1{6,}/.test(message)) {
    return { valid: false, message: "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E21\u0E35\u0E2D\u0E31\u0E01\u0E02\u0E23\u0E30\u0E0B\u0E49\u0E33\u0E01\u0E31\u0E19\u0E1C\u0E34\u0E14\u0E1B\u0E01\u0E15\u0E34" };
  }
  return { valid: true, message: "" };
};
var contactSchema = z.object({
  name: z.string().superRefine((val, ctx) => {
    const res = validateName(val);
    if (!res.valid) ctx.addIssue({ code: z.ZodIssueCode.custom, message: res.message });
  }),
  email: z.string().superRefine((val, ctx) => {
    const res = validateEmail(val);
    if (!res.valid) ctx.addIssue({ code: z.ZodIssueCode.custom, message: res.message });
  }),
  phone: z.string().superRefine((val, ctx) => {
    const res = validatePhone(val);
    if (!res.valid) ctx.addIssue({ code: z.ZodIssueCode.custom, message: res.message });
  }),
  subject: z.string().superRefine((val, ctx) => {
    const res = validateSubject(val);
    if (!res.valid) ctx.addIssue({ code: z.ZodIssueCode.custom, message: res.message });
  }),
  message: z.string().superRefine((val, ctx) => {
    const res = validateMessage(val);
    if (!res.valid) ctx.addIssue({ code: z.ZodIssueCode.custom, message: res.message });
  })
});
var loginSchema = z.object({
  username: z.string().optional(),
  userName: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(1, "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19")
}).refine((data) => !!(data.username || data.userName || data.phone), {
  message: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E0A\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C"
});

// server/src/routes/contact.ts
var router3 = new Hono3();
router3.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const payload = {
      name: (body.name || body.contacts_name || "").trim(),
      email: (body.email || "").trim(),
      phone: (body.phone || "").replace(/[- ]/g, "").trim(),
      subject: (body.subject || "").trim(),
      message: (body.message || body.contacts_message || "").trim()
    };
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      return c.json(
        {
          success: false,
          error: "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07",
          details: parsed.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message
          }))
        },
        400
      );
    }
    const { name, email, phone, subject, message } = parsed.data;
    const newId = `cnt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    await db.insert(contacts).values({
      contactsId: newId,
      contactsName: name,
      email,
      phone,
      subject,
      contactsMessage: message,
      status: "unread",
      createdAt: /* @__PURE__ */ new Date()
    });
    return c.json(
      {
        success: true,
        message: "\u0E2A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27 \u0E40\u0E08\u0E49\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48\u0E08\u0E30\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E01\u0E25\u0E31\u0E1A\u0E42\u0E14\u0E22\u0E40\u0E23\u0E47\u0E27",
        data: {
          contactsId: newId,
          contactsName: name,
          email,
          phone,
          subject,
          status: "unread"
        }
      },
      201
    );
  } catch (error) {
    console.error("Contact submission error:", error);
    return c.json(
      {
        success: false,
        error: "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E2A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E44\u0E14\u0E49 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07"
      },
      500
    );
  }
});
var contact_default = router3;

// server/src/routes/auth.ts
import { Hono as Hono4 } from "hono";
import { eq as eq2, or } from "drizzle-orm";
import bcrypt from "bcryptjs";

// server/src/middlewares/auth.ts
import { createMiddleware } from "hono/factory";
import { verify, sign } from "hono/jwt";
var JWT_SECRET = process.env.JWT_SECRET || "sadida-secret-key-2026-production-token";
async function generateAdminToken(user) {
  const payload = {
    usersId: user.usersId,
    usersName: user.usersName,
    phone: user.phone,
    role: user.role || "Admin",
    // Token expires in 7 days
    exp: Math.floor(Date.now() / 1e3) + 60 * 60 * 24 * 7
  };
  return await sign(payload, JWT_SECRET, "HS256");
}
var adminAuthMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  const cookieHeader = c.req.header("Cookie") || "";
  let token = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  } else {
    const match = cookieHeader.match(/sadida_admin_token=([^;]+)/);
    if (match) {
      token = decodeURIComponent(match[1]).trim();
    }
  }
  if (!token) {
    return c.json(
      {
        success: false,
        error: "Unauthorized",
        message: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E01\u0E48\u0E2D\u0E19\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23 (Missing admin token)"
      },
      401
    );
  }
  try {
    const payload = await verify(token, JWT_SECRET, "HS256");
    if (!payload || !payload.usersId) {
      return c.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Token \u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E2B\u0E23\u0E37\u0E2D\u0E2B\u0E21\u0E14\u0E2D\u0E32\u0E22\u0E38"
        },
        401
      );
    }
    c.set("adminUser", payload);
    await next();
  } catch {
    return c.json(
      {
        success: false,
        error: "Unauthorized",
        message: "Token \u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E2B\u0E23\u0E37\u0E2D\u0E2B\u0E21\u0E14\u0E2D\u0E32\u0E22\u0E38 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E43\u0E2B\u0E21\u0E48"
      },
      401
    );
  }
});

// server/src/routes/auth.ts
var router4 = new Hono4();
router4.post("/login", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        {
          success: false,
          error: "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07",
          details: parsed.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message
          }))
        },
        400
      );
    }
    const { password } = parsed.data;
    const rawUsername = (parsed.data.username || parsed.data.userName || "").trim();
    const rawPhone = (parsed.data.phone || "").trim();
    if (!rawUsername && !rawPhone) {
      return c.json({ success: false, error: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38\u0E0A\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C" }, 400);
    }
    const condition = rawUsername && rawPhone ? or(eq2(users.usersName, rawUsername), eq2(users.phone, rawPhone)) : rawUsername ? eq2(users.usersName, rawUsername) : eq2(users.phone, rawPhone);
    const user = await db.select({
      usersId: users.usersId,
      usersName: users.usersName,
      phone: users.phone,
      passwordHash: users.passwordHash,
      userRolesId: users.userRolesId,
      roleName: userRoles.userRolesName
    }).from(users).leftJoin(userRoles, eq2(users.userRolesId, userRoles.userRolesId)).where(condition).limit(1);
    if (user.length === 0) {
      return c.json(
        { success: false, error: "\u0E0A\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49 \u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C \u0E2B\u0E23\u0E37\u0E2D\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" },
        401
      );
    }
    const foundUser = user[0];
    const bunGlobal2 = globalThis.Bun;
    const isPasswordValid = bunGlobal2 ? await bunGlobal2.password.verify(password, foundUser.passwordHash) : await bcrypt.compare(password, foundUser.passwordHash);
    if (!isPasswordValid) {
      return c.json(
        { success: false, error: "\u0E0A\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49 \u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C \u0E2B\u0E23\u0E37\u0E2D\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" },
        401
      );
    }
    if (foundUser.userRolesId !== "r_1") {
      return c.json(
        { success: false, error: "\u0E1A\u0E31\u0E0D\u0E0A\u0E35\u0E19\u0E35\u0E49\u0E44\u0E21\u0E48\u0E21\u0E35\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E40\u0E02\u0E49\u0E32\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E23\u0E30\u0E1A\u0E1A\u0E2B\u0E25\u0E31\u0E07\u0E1A\u0E49\u0E32\u0E19" },
        403
      );
    }
    const token = await generateAdminToken({
      usersId: foundUser.usersId,
      usersName: foundUser.usersName,
      phone: foundUser.phone,
      role: foundUser.roleName || "Admin"
    });
    return c.json({
      success: true,
      message: "\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08",
      token,
      data: {
        usersId: foundUser.usersId,
        usersName: foundUser.usersName,
        phone: foundUser.phone,
        role: foundUser.roleName
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json(
      {
        success: false,
        error: "\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07"
      },
      500
    );
  }
});
router4.get("/me", adminAuthMiddleware, async (c) => {
  const adminUser = c.get("adminUser");
  return c.json({
    success: true,
    data: adminUser
  });
});
var auth_default = router4;

// server/src/routes/adminProducts.ts
import { Hono as Hono5 } from "hono";
import { eq as eq3, ilike } from "drizzle-orm";
import path from "path";
import { mkdir, writeFile } from "node:fs/promises";
import { put } from "@vercel/blob";
var router5 = new Hono5();
router5.post("*", adminAuthMiddleware);
router5.put("*", adminAuthMiddleware);
router5.delete("*", adminAuthMiddleware);
var sortSizeList2 = (list) => {
  return [...list].sort((a, b) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });
};
router5.get("/", async (c) => {
  try {
    const products = await db.select({
      proId: product.proId,
      proName: product.proName,
      description: product.description,
      img: product.img,
      price: product.price,
      categoryId: product.categoryId,
      categoryName: categories.categoryName
    }).from(product).leftJoin(categories, eq3(product.categoryId, categories.categoryId));
    const allDetails = await db.select().from(productDetail);
    const items = products.map((p) => {
      const details = allDetails.filter((d) => d.proId === p.proId);
      const sizes = sortSizeList2(details.map((d) => d.prodetailSize));
      return {
        ...p,
        prodetailId: details[0]?.prodetailId || "",
        prodetailSize: sizes[0] || "",
        sizes,
        details
      };
    });
    return c.json({ success: true, data: items });
  } catch (error) {
    return c.json(
      { success: false, error: "Failed to fetch products", details: error?.message },
      500
    );
  }
});
router5.get("/stats/summary", async (c) => {
  try {
    const allProducts = await db.select({ proId: product.proId }).from(product);
    const allCategories = await db.select().from(categories);
    return c.json({
      success: true,
      data: {
        totalProducts: allProducts.length,
        totalCategories: allCategories.length,
        categories: allCategories
      }
    });
  } catch (error) {
    return c.json(
      { success: false, error: "Failed to fetch stats", details: error?.message },
      500
    );
  }
});
router5.get("/categories", async (c) => {
  try {
    const all = await db.select().from(categories);
    return c.json({ success: true, data: all });
  } catch (error) {
    return c.json(
      { success: false, error: "Failed to fetch categories", details: error?.message },
      500
    );
  }
});
router5.post("/categories", async (c) => {
  try {
    const body = await c.req.json();
    const { categoryId, categoryName } = body;
    if (!categoryName || typeof categoryName !== "string" || !categoryName.trim()) {
      return c.json({ success: false, error: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38\u0E0A\u0E37\u0E48\u0E2D\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48" }, 400);
    }
    const cleanCatName = categoryName.trim();
    const existingCat = await db.select({ categoryId: categories.categoryId }).from(categories).where(ilike(categories.categoryName, cleanCatName)).limit(1);
    if (existingCat.length > 0) {
      return c.json(
        { success: false, error: `\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48 "${cleanCatName}" \u0E21\u0E35\u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A\u0E41\u0E25\u0E49\u0E27` },
        400
      );
    }
    const all = await db.select().from(categories);
    let maxNum = 0;
    for (const item of all) {
      const match = item.categoryId.match(/\d+/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (num > maxNum) maxNum = num;
      }
    }
    const newId = categoryId?.trim() || `cg_${maxNum + 1}`;
    await db.insert(categories).values({
      categoryId: newId,
      categoryName: categoryName.trim()
    });
    return c.json(
      {
        success: true,
        message: "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27",
        data: { categoryId: newId, categoryName: categoryName.trim() }
      },
      201
    );
  } catch (error) {
    return c.json(
      { success: false, error: "Failed to create category", details: error?.message },
      500
    );
  }
});
router5.delete("/categories/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const existingProducts = await db.select({ proId: product.proId }).from(product).where(eq3(product.categoryId, id));
    if (existingProducts.length > 0) {
      return c.json(
        {
          success: false,
          error: "\u0E21\u0E35\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48\u0E19\u0E35\u0E49\u0E2D\u0E22\u0E39\u0E48\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E25\u0E1A\u0E44\u0E14\u0E49",
          message: `\u0E21\u0E35\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48\u0E19\u0E35\u0E49\u0E2D\u0E22\u0E39\u0E48\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E25\u0E1A\u0E44\u0E14\u0E49 (\u0E1E\u0E1A\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32 ${existingProducts.length} \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23)`
        },
        400
      );
    }
    await db.delete(categories).where(eq3(categories.categoryId, id));
    return c.json({ success: true, message: "\u0E25\u0E1A\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27" });
  } catch (error) {
    return c.json({ success: false, error: "Failed to delete category", details: error?.message }, 500);
  }
});
router5.post("/upload", async (c) => {
  try {
    const body = await c.req.json();
    const { dataUrl } = body;
    if (!dataUrl || !dataUrl.startsWith("data:")) {
      return c.json({ success: false, error: "Invalid data URL format" }, 400);
    }
    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return c.json({ success: false, error: "Invalid base64 image data" }, 400);
    }
    let ext = matches[1].toLowerCase();
    if (ext === "jpeg") ext = "jpg";
    if (ext === "svg+xml") ext = "svg";
    const filename = `shoe_custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.${ext}`;
    const buffer = Buffer.from(matches[2], "base64");
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`products/${filename}`, buffer, {
        access: "public"
      });
      return c.json({
        success: true,
        message: "\u0E2D\u0E31\u0E1B\u0E42\u0E2B\u0E25\u0E14\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E\u0E02\u0E36\u0E49\u0E19 Vercel Blob \u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08",
        data: { url: blob.url }
      });
    }
    if (process.env.VERCEL) {
      return c.json(
        {
          success: false,
          error: "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D Vercel Blob Store (\u0E01\u0E23\u0E38\u0E13\u0E32\u0E44\u0E1B\u0E17\u0E35\u0E48 Vercel Dashboard > Storage \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E2A\u0E23\u0E49\u0E32\u0E07 Blob \u0E41\u0E25\u0E30 Connect \u0E40\u0E02\u0E49\u0E32\u0E42\u0E1B\u0E23\u0E40\u0E08\u0E01\u0E15\u0E4C)"
        },
        500
      );
    }
    const uploadDir = path.resolve(process.cwd(), "../client/public/images");
    const filePath = path.join(uploadDir, filename);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, buffer);
    return c.json({
      success: true,
      message: "\u0E2D\u0E31\u0E1B\u0E42\u0E2B\u0E25\u0E14\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08",
      data: { url: `/images/${filename}` }
    });
  } catch (error) {
    return c.json({ success: false, error: error?.message }, 500);
  }
});
router5.get("/product-details/all", async (c) => {
  try {
    const details = await db.select({
      prodetailId: productDetail.prodetailId,
      proId: productDetail.proId,
      prodetailSize: productDetail.prodetailSize,
      price: product.price
    }).from(productDetail).leftJoin(product, eq3(productDetail.proId, product.proId));
    return c.json({ success: true, data: details });
  } catch (error) {
    return c.json(
      { success: false, error: "Failed to fetch product details", details: error?.message },
      500
    );
  }
});
router5.post("/product-details", async (c) => {
  try {
    const body = await c.req.json();
    const { prodetailSize, proId } = body;
    if (!prodetailSize) {
      return c.json({ success: false, error: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38\u0E02\u0E19\u0E32\u0E14" }, 400);
    }
    const rawSize = String(prodetailSize).trim();
    const formattedSize = rawSize.toUpperCase().includes("UK") ? rawSize : `${rawSize} UK`;
    const all = await db.select().from(productDetail);
    const newId = `pdd_${String(all.length + 1).padStart(3, "0")}`;
    if (proId) {
      await db.insert(productDetail).values({
        prodetailId: newId,
        proId,
        prodetailSize: formattedSize
      });
    }
    return c.json(
      {
        success: true,
        message: "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E19\u0E32\u0E14\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27",
        data: { prodetailId: newId, prodetailSize: formattedSize, proId: proId || "" }
      },
      201
    );
  } catch (error) {
    return c.json(
      { success: false, error: "Failed to create product detail", details: error?.message },
      500
    );
  }
});
router5.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const items = await db.select({
      proId: product.proId,
      proName: product.proName,
      description: product.description,
      img: product.img,
      price: product.price,
      categoryId: product.categoryId,
      categoryName: categories.categoryName
    }).from(product).leftJoin(categories, eq3(product.categoryId, categories.categoryId)).where(eq3(product.proId, id)).limit(1);
    if (items.length === 0) {
      return c.json({ success: false, error: "Product not found" }, 404);
    }
    const details = await db.select().from(productDetail).where(eq3(productDetail.proId, id));
    const sizes = sortSizeList2(details.map((d) => d.prodetailSize));
    return c.json({
      success: true,
      data: {
        ...items[0],
        prodetailId: details[0]?.prodetailId || "",
        prodetailSize: sizes[0] || "",
        sizes,
        details
      }
    });
  } catch (error) {
    return c.json(
      { success: false, error: "Failed to fetch product", details: error?.message },
      500
    );
  }
});
router5.post("/", async (c) => {
  try {
    const body = await c.req.json();
    let {
      proId,
      proName,
      description,
      img,
      categoryId,
      price,
      customPrice,
      sizes,
      size,
      prodetailSize
    } = body;
    if (!proName || !description || !categoryId) {
      return c.json({ success: false, error: "Missing required fields (proName, description, categoryId)" }, 400);
    }
    const cleanName = String(proName).trim();
    if (!cleanName) {
      return c.json({ success: false, error: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38\u0E0A\u0E37\u0E48\u0E2D\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32" }, 400);
    }
    const existingProd = await db.select({ proId: product.proId }).from(product).where(ilike(product.proName, cleanName)).limit(1);
    if (existingProd.length > 0) {
      return c.json(
        {
          success: false,
          error: `\u0E0A\u0E37\u0E48\u0E2D\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32 "${cleanName}" \u0E21\u0E35\u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A\u0E41\u0E25\u0E49\u0E27 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E43\u0E0A\u0E49\u0E0A\u0E37\u0E48\u0E2D\u0E2D\u0E37\u0E48\u0E19`
        },
        400
      );
    }
    let finalProId = proId?.trim();
    if (!finalProId) {
      const allProds = await db.select({ proId: product.proId }).from(product);
      let maxNum = 0;
      for (const p of allProds) {
        const match = p.proId.match(/\d+/);
        if (match) {
          const num = parseInt(match[0], 10);
          if (num > maxNum) maxNum = num;
        }
      }
      finalProId = `pro_${String(maxNum + 1).padStart(3, "0")}`;
    }
    const finalPrice = Number(price !== void 0 ? price : customPrice) || 0;
    await db.insert(product).values({
      proId: finalProId,
      proName,
      description,
      img: img || "/images/shoe_runner_1.jpg",
      price: String(finalPrice),
      categoryId
    });
    const allDetails = await db.select().from(productDetail);
    let maxDetailNum = 0;
    for (const d of allDetails) {
      const match = d.prodetailId.match(/\d+/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (num > maxDetailNum) maxDetailNum = num;
      }
    }
    let nextDetailIndex = maxDetailNum + 1;
    const sizesToInsert = [];
    if (Array.isArray(sizes) && sizes.length > 0) {
      sizesToInsert.push(...sizes);
    } else if (size) {
      sizesToInsert.push(size);
    } else if (prodetailSize) {
      sizesToInsert.push(prodetailSize);
    }
    const sortedSizesToInsert = sortSizeList2(sizesToInsert);
    for (const s of sortedSizesToInsert) {
      const rawSize = String(s).trim();
      if (!rawSize) continue;
      const formatted = rawSize.toUpperCase().includes("UK") ? rawSize : `${rawSize} UK`;
      const detailId = `pdd_${String(nextDetailIndex++).padStart(3, "0")}`;
      await db.insert(productDetail).values({
        prodetailId: detailId,
        proId: finalProId,
        prodetailSize: formatted
      });
    }
    return c.json(
      { success: true, message: "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27", data: { proId: finalProId } },
      201
    );
  } catch (error) {
    return c.json(
      { success: false, error: "Failed to create product", details: error?.message },
      500
    );
  }
});
router5.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const {
      proName,
      description,
      img,
      categoryId,
      price,
      customPrice,
      sizes,
      size,
      prodetailSize
    } = body;
    const updateData = { updatedAt: /* @__PURE__ */ new Date() };
    if (proName !== void 0) {
      const cleanName = String(proName).trim();
      if (!cleanName) {
        return c.json({ success: false, error: "\u0E0A\u0E37\u0E48\u0E2D\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E15\u0E49\u0E2D\u0E07\u0E44\u0E21\u0E48\u0E40\u0E1B\u0E47\u0E19\u0E04\u0E48\u0E32\u0E27\u0E48\u0E32\u0E07" }, 400);
      }
      const existingProd = await db.select({ proId: product.proId }).from(product).where(ilike(product.proName, cleanName)).limit(1);
      if (existingProd.length > 0 && existingProd[0].proId !== id) {
        return c.json(
          {
            success: false,
            error: `\u0E0A\u0E37\u0E48\u0E2D\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32 "${cleanName}" \u0E21\u0E35\u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A\u0E41\u0E25\u0E49\u0E27 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E43\u0E0A\u0E49\u0E0A\u0E37\u0E48\u0E2D\u0E2D\u0E37\u0E48\u0E19`
          },
          400
        );
      }
      updateData.proName = cleanName;
    }
    if (description !== void 0) updateData.description = description;
    if (categoryId !== void 0) updateData.categoryId = categoryId;
    if (img !== void 0) updateData.img = img;
    if (price !== void 0 || customPrice !== void 0) {
      updateData.price = String(Number(price !== void 0 ? price : customPrice) || 0);
    }
    if (Object.keys(updateData).length > 0) {
      await db.update(product).set(updateData).where(eq3(product.proId, id));
    }
    const sizesToUpdate = [];
    if (Array.isArray(sizes) && sizes.length > 0) {
      sizesToUpdate.push(...sizes);
    } else if (size) {
      sizesToUpdate.push(size);
    } else if (prodetailSize) {
      sizesToUpdate.push(prodetailSize);
    }
    if (sizesToUpdate.length > 0) {
      const sortedSizesToUpdate = sortSizeList2(sizesToUpdate);
      await db.delete(productDetail).where(eq3(productDetail.proId, id));
      const allDetails = await db.select().from(productDetail);
      let maxDetailNum = 0;
      for (const d of allDetails) {
        const match = d.prodetailId.match(/\d+/);
        if (match) {
          const num = parseInt(match[0], 10);
          if (num > maxDetailNum) maxDetailNum = num;
        }
      }
      let nextDetailIndex = maxDetailNum + 1;
      for (const s of sortedSizesToUpdate) {
        const rawSize = String(s).trim();
        if (!rawSize) continue;
        const formatted = rawSize.toUpperCase().includes("UK") ? rawSize : `${rawSize} UK`;
        const detailId = `pdd_${String(nextDetailIndex++).padStart(3, "0")}`;
        await db.insert(productDetail).values({
          prodetailId: detailId,
          proId: id,
          prodetailSize: formatted
        });
      }
    }
    return c.json({
      success: true,
      message: "\u0E41\u0E01\u0E49\u0E44\u0E02\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27",
      data: { proId: id }
    });
  } catch (error) {
    return c.json(
      { success: false, error: "Failed to update product", details: error?.message },
      500
    );
  }
});
router5.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await db.delete(productDetail).where(eq3(productDetail.proId, id));
    await db.delete(product).where(eq3(product.proId, id));
    return c.json({
      success: true,
      message: "\u0E25\u0E1A\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27",
      data: { proId: id }
    });
  } catch (error) {
    return c.json(
      { success: false, error: "Failed to delete product", details: error?.message },
      500
    );
  }
});
var adminProducts_default = router5;

// server/src/routes/adminContacts.ts
import { Hono as Hono6 } from "hono";
import { eq as eq4, desc } from "drizzle-orm";
var router6 = new Hono6();
router6.use("*", adminAuthMiddleware);
router6.get("/stats/summary", async (c) => {
  try {
    const all = await db.select({
      contactsId: contacts.contactsId,
      status: contacts.status
    }).from(contacts);
    const totalContacts = all.length;
    const unreadContacts = all.filter((item) => (item.status || "unread") === "unread").length;
    const readContacts = totalContacts - unreadContacts;
    return c.json({
      success: true,
      data: {
        totalContacts,
        unreadContacts,
        readContacts
      }
    });
  } catch (error) {
    console.error("Failed to fetch contact stats:", error);
    return c.json(
      { success: false, error: "Failed to fetch contact statistics" },
      500
    );
  }
});
router6.get("/", async (c) => {
  try {
    const list = await db.select().from(contacts).orderBy(desc(contacts.createdAt));
    return c.json({ success: true, data: list });
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
    return c.json(
      { success: false, error: "Failed to fetch contacts" },
      500
    );
  }
});
router6.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const items = await db.select().from(contacts).where(eq4(contacts.contactsId, id)).limit(1);
    if (items.length === 0) {
      return c.json({ success: false, error: "Contact not found" }, 404);
    }
    if (items[0].status === "unread") {
      await db.update(contacts).set({ status: "read" }).where(eq4(contacts.contactsId, id));
      items[0].status = "read";
    }
    return c.json({ success: true, data: items[0] });
  } catch (error) {
    console.error("Failed to fetch contact:", error);
    return c.json(
      { success: false, error: "Failed to fetch contact detail" },
      500
    );
  }
});
router6.patch("/:id/read", async (c) => {
  try {
    const id = c.req.param("id");
    await db.update(contacts).set({ status: "read" }).where(eq4(contacts.contactsId, id));
    return c.json({
      success: true,
      message: "\u0E17\u0E33\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E2B\u0E21\u0E32\u0E22\u0E27\u0E48\u0E32\u0E2D\u0E48\u0E32\u0E19\u0E41\u0E25\u0E49\u0E27\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22",
      data: { contactsId: id, status: "read" }
    });
  } catch (error) {
    console.error("Failed to mark contact as read:", error);
    return c.json(
      { success: false, error: "Failed to update contact status" },
      500
    );
  }
});
router6.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await db.delete(contacts).where(eq4(contacts.contactsId, id));
    return c.json({
      success: true,
      message: "\u0E25\u0E1A\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27",
      data: { contactsId: id }
    });
  } catch (error) {
    console.error("Failed to delete contact:", error);
    return c.json(
      { success: false, error: "Failed to delete contact" },
      500
    );
  }
});
var adminContacts_default = router6;

// server/src/routes/websiteSettings.ts
import { Hono as Hono7 } from "hono";
import { eq as eq5 } from "drizzle-orm";
var router7 = new Hono7();
var DEFAULT_WEBSITE_CONFIG = {
  brand: {
    brandName: "SADIDA",
    brandTagline: "FOOTWEAR \u2022 BLACK & WHITE",
    brandLogo: "/logo.jpg",
    footerAbout: "Sadida \u0E41\u0E1A\u0E23\u0E19\u0E14\u0E4C\u0E23\u0E2D\u0E07\u0E40\u0E17\u0E49\u0E32\u0E27\u0E34\u0E48\u0E07\u0E41\u0E25\u0E30\u0E23\u0E2D\u0E07\u0E40\u0E17\u0E49\u0E32\u0E40\u0E14\u0E34\u0E19\u0E17\u0E35\u0E48\u0E04\u0E31\u0E14\u0E2A\u0E23\u0E23\u0E27\u0E31\u0E2A\u0E14\u0E38\u0E1E\u0E23\u0E35\u0E40\u0E21\u0E35\u0E22\u0E21 \u0E42\u0E04\u0E23\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01\u0E40\u0E1A\u0E32 \u0E41\u0E25\u0E30\u0E40\u0E2D\u0E01\u0E25\u0E31\u0E01\u0E29\u0E13\u0E4C\u0E42\u0E17\u0E19\u0E2A\u0E35\u0E14\u0E33\u0E01\u0E31\u0E1A\u0E2A\u0E35\u0E02\u0E32\u0E27 \u0E2A\u0E44\u0E15\u0E25\u0E4C\u0E21\u0E34\u0E19\u0E34\u0E21\u0E2D\u0E25\u0E40\u0E2B\u0E19\u0E37\u0E2D\u0E01\u0E32\u0E25\u0E40\u0E27\u0E25\u0E32",
    topNotice: "\u{1F525} \u0E04\u0E2D\u0E25\u0E40\u0E25\u0E01\u0E0A\u0E31\u0E19\u0E43\u0E2B\u0E21\u0E48 SADIDA 2026 \u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E40\u0E1B\u0E34\u0E14\u0E15\u0E31\u0E27\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E17\u0E32\u0E07\u0E01\u0E32\u0E23\u0E41\u0E25\u0E49\u0E27",
    showTopNotice: false
  },
  pages: [
    {
      id: "home",
      name: "\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E25\u0E31\u0E01 (Brand Home)",
      route: "/",
      sections: [
        {
          id: "hero",
          name: "\u0E41\u0E1A\u0E19\u0E40\u0E19\u0E2D\u0E23\u0E4C\u0E2B\u0E25\u0E31\u0E01 (Hero Banner)",
          visible: true,
          image: "/images/hero_sketch.jpg",
          texts: {
            headline: "CRAFTED FOR PURE MOTION.",
            subtitle: "\u0E08\u0E32\u0E01\u0E20\u0E32\u0E1E\u0E23\u0E48\u0E32\u0E07\u0E2A\u0E40\u0E01\u0E47\u0E15\u0E0A\u0E4C\u0E43\u0E19\u0E2A\u0E15\u0E39\u0E14\u0E34\u0E42\u0E2D \u0E2A\u0E39\u0E48\u0E19\u0E27\u0E31\u0E15\u0E01\u0E23\u0E23\u0E21\u0E23\u0E2D\u0E07\u0E40\u0E17\u0E49\u0E32\u0E27\u0E34\u0E48\u0E07\u0E41\u0E25\u0E30\u0E23\u0E2D\u0E07\u0E40\u0E17\u0E49\u0E32\u0E40\u0E14\u0E34\u0E19\u0E17\u0E35\u0E48\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E2B\u0E23\u0E39\u0E40\u0E2B\u0E19\u0E37\u0E2D\u0E01\u0E32\u0E25\u0E40\u0E27\u0E25\u0E32",
            badge: "Sadida Concept Atelier"
          }
        },
        {
          id: "products",
          name: "\u0E41\u0E16\u0E1A\u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32 (Product Carousel)",
          visible: true,
          selectedProductIds: ["pro_001", "pro_002", "pro_003", "pro_004", "pro_005", "pro_006"],
          texts: {
            title: "\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E02\u0E2D\u0E07\u0E41\u0E1A\u0E23\u0E19\u0E14\u0E4C SADIDA",
            subtitle: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E0A\u0E49\u0E2D\u0E1B\u0E23\u0E2D\u0E07\u0E40\u0E17\u0E49\u0E32\u0E04\u0E38\u0E13\u0E20\u0E32\u0E1E\u0E2A\u0E39\u0E07 \u0E41\u0E1A\u0E48\u0E07\u0E2D\u0E2D\u0E01\u0E40\u0E1B\u0E47\u0E19 2 \u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E2B\u0E25\u0E31\u0E01 \u0E44\u0E14\u0E49\u0E41\u0E01\u0E48 \u0E23\u0E2D\u0E07\u0E40\u0E17\u0E49\u0E32\u0E27\u0E34\u0E48\u0E07 \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E40\u0E23\u0E47\u0E27 \u0E41\u0E25\u0E30 \u0E23\u0E2D\u0E07\u0E40\u0E17\u0E49\u0E32\u0E40\u0E14\u0E34\u0E19 \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E1A\u0E32\u0E22\u0E17\u0E38\u0E01\u0E27\u0E31\u0E19",
            badge: "Sadida Collection 2026"
          }
        },
        {
          id: "brand",
          name: "\u0E1B\u0E23\u0E31\u0E0A\u0E0D\u0E32\u0E41\u0E1A\u0E23\u0E19\u0E14\u0E4C (Brand Story)",
          visible: true,
          texts: {
            title: "\u0E17\u0E33\u0E44\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E42\u0E17\u0E19\u0E2A\u0E35\u0E14\u0E33\u0E01\u0E31\u0E1A\u0E2A\u0E35\u0E02\u0E32\u0E27 \u0E02\u0E2D\u0E07 SADIDA?",
            description: "\u0E40\u0E23\u0E32\u0E15\u0E31\u0E14\u0E17\u0E2D\u0E19\u0E2A\u0E35\u0E2A\u0E31\u0E19\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E08\u0E33\u0E40\u0E1B\u0E47\u0E19\u0E2D\u0E2D\u0E01 \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E43\u0E2B\u0E49\u0E04\u0E38\u0E13\u0E2A\u0E31\u0E21\u0E1C\u0E31\u0E2A\u0E01\u0E31\u0E1A\u0E42\u0E04\u0E23\u0E07\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E17\u0E35\u0E48\u0E41\u0E17\u0E49\u0E08\u0E23\u0E34\u0E07\u0E02\u0E2D\u0E07\u0E23\u0E2D\u0E07\u0E40\u0E17\u0E49\u0E32"
          }
        }
      ]
    },
    {
      id: "products",
      name: "\u0E2B\u0E19\u0E49\u0E32\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32 (Store)",
      route: "/products",
      sections: [
        {
          id: "sidebar",
          name: "\u0E41\u0E16\u0E1A\u0E01\u0E23\u0E2D\u0E07 (Filter Sidebar)",
          visible: true,
          texts: {
            title: "Navbar Menu"
          }
        },
        {
          id: "productGrid",
          name: "\u0E15\u0E32\u0E23\u0E32\u0E07\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32 (Product Grid)",
          visible: true,
          texts: {
            title: "\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 (PRODUCTS)",
            emptyMessage: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E17\u0E35\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02"
          }
        }
      ]
    },
    {
      id: "contact",
      name: "\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E40\u0E23\u0E32 (Contact)",
      route: "/contact",
      sections: [
        {
          id: "contactForm",
          name: "\u0E1F\u0E2D\u0E23\u0E4C\u0E21\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E40\u0E23\u0E32 (Contact Form)",
          visible: true,
          texts: {
            title: "\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E40\u0E23\u0E32",
            description: "\u0E2A\u0E48\u0E07\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E16\u0E36\u0E07\u0E17\u0E35\u0E21\u0E07\u0E32\u0E19 Sadida",
            buttonText: "\u0E2A\u0E48\u0E07"
          }
        },
        {
          id: "contactInfo",
          name: "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48\u0E41\u0E25\u0E30\u0E41\u0E1C\u0E19\u0E17\u0E35\u0E48 (Address & Map)",
          visible: true,
          texts: {
            title: "\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48",
            address: "Sadida Flagship Atelier & Store 99/4 \u0E2D\u0E32\u0E04\u0E32\u0E23\u0E19\u0E27\u0E31\u0E15\u0E01\u0E23\u0E23\u0E21\u0E14\u0E35\u0E44\u0E0B\u0E19\u0E4C \u0E0A\u0E31\u0E49\u0E19 1 \u0E41\u0E02\u0E27\u0E07\u0E04\u0E25\u0E2D\u0E07\u0E40\u0E15\u0E22\u0E40\u0E2B\u0E19\u0E37\u0E2D \u0E40\u0E02\u0E15\u0E27\u0E31\u0E12\u0E19\u0E32 \u0E01\u0E23\u0E38\u0E07\u0E40\u0E17\u0E1E\u0E2F 10110",
            phone: "081-234-5678",
            email: "contact@sadida.co.th",
            mapTitle: "map (\u0E41\u0E1C\u0E19\u0E17\u0E35\u0E48\u0E15\u0E31\u0E49\u0E07)",
            mapLat: "13.7380",
            mapLng: "100.5630",
            mapZoom: "15",
            googleMapsApiKey: ""
          }
        }
      ]
    }
  ]
};
router7.get("/", async (c) => {
  try {
    const rows = await db.select().from(websiteSettings).where(eq5(websiteSettings.id, "default")).limit(1);
    if (rows.length === 0 || !rows[0].configJson) {
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
          updatedAt: /* @__PURE__ */ new Date()
        });
      } catch {
      }
      return c.json({ success: true, data: DEFAULT_WEBSITE_CONFIG });
    }
    const parsed = JSON.parse(rows[0].configJson);
    return c.json({ success: true, data: parsed });
  } catch (err) {
    console.error("Failed to fetch website config from DB:", err);
    return c.json({ success: true, data: DEFAULT_WEBSITE_CONFIG });
  }
});
router7.put("/", adminAuthMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const { brand, pages } = body;
    if (!brand || !Array.isArray(pages)) {
      return c.json({ success: false, error: "Invalid configuration format (brand and pages required)" }, 400);
    }
    const fullConfig = { brand, pages };
    const configString = JSON.stringify(fullConfig);
    const existing = await db.select({ id: websiteSettings.id }).from(websiteSettings).where(eq5(websiteSettings.id, "default")).limit(1);
    if (existing.length > 0) {
      await db.update(websiteSettings).set({
        brandName: brand.brandName || "SADIDA",
        brandTagline: brand.brandTagline || "",
        brandLogo: brand.brandLogo || "/logo.jpg",
        footerAbout: brand.footerAbout || "",
        topNotice: brand.topNotice || "",
        showTopNotice: Boolean(brand.showTopNotice),
        configJson: configString,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq5(websiteSettings.id, "default"));
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
        updatedAt: /* @__PURE__ */ new Date()
      });
    }
    return c.json({
      success: true,
      message: "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E01\u0E32\u0E23\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E27\u0E47\u0E1A\u0E25\u0E07\u0E10\u0E32\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27",
      data: fullConfig
    });
  } catch (err) {
    console.error("Failed to save website config:", err);
    return c.json({ success: false, error: "Failed to save website configuration", details: err?.message }, 500);
  }
});
var websiteSettings_default = router7;

// server/src/index.ts
var app = new Hono8();
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"]
  })
);
var healthCheck = (c) => {
  return c.json({
    success: true,
    status: "ok",
    message: "Sadida Backend API is running",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
};
app.get("/", healthCheck);
app.get("/health", healthCheck);
app.get("/api", healthCheck);
app.get("/api/health", healthCheck);
app.post("/api/upload", adminAuthMiddleware, async (c) => {
  try {
    const url = new URL(c.req.url);
    const rawFilename = url.searchParams.get("filename") || `upload_${Date.now()}.png`;
    const cleanFilename = rawFilename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const arrayBuffer = await c.req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length === 0) {
      return c.json({ error: "No file content received" }, 400);
    }
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put2(cleanFilename, buffer, {
        access: "public"
      });
      return c.json(blob);
    }
    if (process.env.VERCEL) {
      return c.json(
        {
          error: "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D Vercel Blob Store (\u0E01\u0E23\u0E38\u0E13\u0E32\u0E44\u0E1B\u0E17\u0E35\u0E48 Vercel Dashboard > Storage \u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E2A\u0E23\u0E49\u0E32\u0E07 Blob \u0E41\u0E25\u0E30 Connect \u0E40\u0E02\u0E49\u0E32\u0E42\u0E1B\u0E23\u0E40\u0E08\u0E01\u0E15\u0E4C)"
        },
        500
      );
    }
    const uploadDir = path2.resolve(process.cwd(), "../client/public/images");
    const filePath = path2.join(uploadDir, cleanFilename);
    await mkdir2(uploadDir, { recursive: true });
    await writeFile2(filePath, buffer);
    return c.json({
      url: `/images/${cleanFilename}`,
      pathname: cleanFilename,
      contentType: c.req.header("content-type") || "image/png"
    });
  } catch (err) {
    console.error("Upload error:", err);
    return c.json({ error: err.message }, 500);
  }
});
app.route("/api/categories", categories_default);
app.route("/api/services", services_default);
app.route("/api/products", services_default);
app.route("/api/contact", contact_default);
app.route("/api/auth", auth_default);
app.route("/api/admin/products", adminProducts_default);
app.route("/api/admin/contacts", adminContacts_default);
app.route("/api/website-config", websiteSettings_default);
app.route("/api/admin/website-config", websiteSettings_default);
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: "Not Found",
      message: `Path ${c.req.path} not found`
    },
    404
  );
});
app.onError((err, c) => {
  console.error("Server Error:", err);
  return c.json(
    {
      success: false,
      error: "Internal Server Error",
      message: err.message
    },
    500
  );
});
var port = Number(process.env.PORT) || 3e3;
var index_default = app;
var bunGlobal = globalThis.Bun;
if (bunGlobal && import.meta.main) {
  console.log(`\u{1F680} Server starting on http://localhost:${port}`);
  bunGlobal.serve({ port, fetch: app.fetch });
}
export {
  index_default as default
};
