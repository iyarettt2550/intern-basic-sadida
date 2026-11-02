var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// api/_entry.ts
import { getRequestListener } from "@hono/node-server";

// server/src/index.ts
import { Hono as Hono7 } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

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
  usersRelations: () => usersRelations
});
import { pgTable, varchar, doublePrecision, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
var categories = pgTable("categories", {
  categoryId: varchar("category_id", { length: 10 }).primaryKey(),
  categoryName: varchar("category_name", { length: 50 }).notNull()
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
  img: varchar("img", { length: 200 }).notNull(),
  price: doublePrecision("price").notNull(),
  categoryId: varchar("category_id", { length: 10 }).notNull().references(() => categories.categoryId)
});
var contacts = pgTable("contacts", {
  contactsId: varchar("contacts_id", { length: 50 }).primaryKey(),
  contactsName: varchar("contacts_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 25 }).notNull(),
  phone: varchar("phone", { length: 10 }).notNull(),
  subject: varchar("subject", { length: 50 }).notNull(),
  contactsMessage: varchar("contacts_message", { length: 200 }).notNull()
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
var NEON_DEFAULT_URL = "postgresql://neondb_owner:npg_f5y8DkpOTmCn@ep-fancy-bread-b3zupoaq-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
var connectionString = process.env.DATABASE_URL || (process.env.VERCEL ? NEON_DEFAULT_URL : "postgresql://postgres:1234@localhost:5432/sadida");
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
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
      const sizes = details.map((d) => d.prodetailSize);
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
    return c.json(
      {
        success: false,
        error: "Failed to fetch services/products",
        details: error?.message
      },
      500
    );
  }
});
var services_default = router2;

// server/src/routes/contact.ts
import { Hono as Hono3 } from "hono";

// server/src/validators/index.ts
import { z } from "zod";
var contactSchema = z.object({
  name: z.string().min(1, "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E0A\u0E37\u0E48\u0E2D").max(100, "\u0E0A\u0E37\u0E48\u0E2D\u0E22\u0E32\u0E27\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B"),
  email: z.string().email("\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07").max(25, "\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E22\u0E32\u0E27\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B"),
  phone: z.string().regex(/^[0-9]{9,10}$/, "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02 9-10 \u0E2B\u0E25\u0E31\u0E01"),
  subject: z.string().min(1, "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E2B\u0E31\u0E27\u0E02\u0E49\u0E2D").max(50, "\u0E2B\u0E31\u0E27\u0E02\u0E49\u0E2D\u0E22\u0E32\u0E27\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B"),
  message: z.string().min(1, "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E01\u0E23\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21").max(200, "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E22\u0E32\u0E27\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B")
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
      name: body.name || body.contacts_name,
      email: body.email,
      phone: body.phone,
      subject: body.subject,
      message: body.message || body.contacts_message
    };
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      return c.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message
          }))
        },
        400
      );
    }
    const { name, email, phone, subject, message } = parsed.data;
    const newId = `cnt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    await db.insert(contacts).values({
      contactsId: newId,
      contactsName: name,
      email,
      phone,
      subject,
      contactsMessage: message
    });
    return c.json(
      {
        success: true,
        message: "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27",
        data: {
          contactsId: newId,
          contactsName: name,
          email,
          phone,
          subject,
          contactsMessage: message
        }
      },
      201
    );
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Internal Server Error",
        details: error?.message
      },
      500
    );
  }
});
router3.get("/", async (c) => {
  try {
    const list = await db.select().from(contacts);
    return c.json({
      success: true,
      data: list
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Failed to fetch contact messages",
        details: error?.message
      },
      500
    );
  }
});
var contact_default = router3;

// server/src/routes/auth.ts
import { Hono as Hono4 } from "hono";
import { eq as eq2, or, ilike } from "drizzle-orm";
import bcrypt from "bcryptjs";
var router4 = new Hono4();
router4.post("/login", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message
          }))
        },
        400
      );
    }
    const { password } = parsed.data;
    const username = parsed.data.username || parsed.data.userName;
    const phone = parsed.data.phone;
    const condition = username && phone ? or(eq2(users.usersName, username), eq2(users.phone, phone)) : username ? or(eq2(users.usersName, username), ilike(users.usersName, username)) : eq2(users.phone, phone);
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
        { success: false, error: "\u0E0A\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49 \u0E2B\u0E23\u0E37\u0E2D \u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" },
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
    return c.json({
      success: true,
      message: "\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08",
      data: {
        usersId: foundUser.usersId,
        usersName: foundUser.usersName,
        phone: foundUser.phone,
        role: foundUser.roleName
      }
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: "Internal Server Error",
        details: error?.message
      },
      500
    );
  }
});
router4.get("/me", async (c) => {
  return c.json({ success: false, error: "Not authenticated" }, 401);
});
var auth_default = router4;

// server/src/routes/adminProducts.ts
import { Hono as Hono5 } from "hono";
import { eq as eq3 } from "drizzle-orm";
import path from "path";
import { mkdir, writeFile } from "node:fs/promises";
var router5 = new Hono5();
var sortSizeList = (list) => {
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
      const sizes = sortSizeList(details.map((d) => d.prodetailSize));
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
    if (process.env.VERCEL) {
      return c.json({
        success: true,
        message: "\u0E2D\u0E31\u0E1B\u0E42\u0E2B\u0E25\u0E14\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08",
        data: { url: dataUrl }
      });
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
      price: finalPrice,
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
    const sortedSizesToInsert = sortSizeList(sizesToInsert);
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
    const updateData = {};
    if (proName !== void 0) updateData.proName = proName;
    if (description !== void 0) updateData.description = description;
    if (categoryId !== void 0) updateData.categoryId = categoryId;
    if (img !== void 0) updateData.img = img;
    if (price !== void 0 || customPrice !== void 0) {
      updateData.price = Number(price !== void 0 ? price : customPrice) || 0;
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
      const sortedSizesToUpdate = sortSizeList(sizesToUpdate);
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
import { eq as eq4 } from "drizzle-orm";
var router6 = new Hono6();
router6.get("/", async (c) => {
  try {
    const list = await db.select().from(contacts);
    return c.json({ success: true, data: list });
  } catch (error) {
    return c.json(
      { success: false, error: "Failed to fetch contacts", details: error?.message },
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
    return c.json({ success: true, data: items[0] });
  } catch (error) {
    return c.json(
      { success: false, error: "Failed to fetch contact", details: error?.message },
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
    return c.json(
      { success: false, error: "Failed to delete contact", details: error?.message },
      500
    );
  }
});
router6.get("/stats/summary", async (c) => {
  try {
    const allContacts = await db.select({ contactsId: contacts.contactsId }).from(contacts);
    return c.json({
      success: true,
      data: { totalContacts: allContacts.length }
    });
  } catch (error) {
    return c.json(
      { success: false, error: "Failed to fetch stats", details: error?.message },
      500
    );
  }
});
var adminContacts_default = router6;

// server/src/index.ts
var app = new Hono7();
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"]
  })
);
app.get("/", (c) => {
  return c.json({
    success: true,
    message: "Sadida Backend API is running",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.route("/api/categories", categories_default);
app.route("/api/services", services_default);
app.route("/api/products", services_default);
app.route("/api/contact", contact_default);
app.route("/api/auth", auth_default);
app.route("/api/admin/products", adminProducts_default);
app.route("/api/admin/contacts", adminContacts_default);
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
var src_default = app;
var bunGlobal = globalThis.Bun;
if (bunGlobal && import.meta.main) {
  console.log(`\u{1F680} Server starting on http://localhost:${port}`);
  bunGlobal.serve({ port, fetch: app.fetch });
}

// api/_entry.ts
var config2 = {
  runtime: "nodejs"
};
function handler(req, res) {
  if (res) {
    const matchedPath2 = req.headers?.["x-matched-path"] || req.headers?.["x-forwarded-uri"];
    if (matchedPath2 && (req.url === "/api" || req.url === "/api/")) {
      req.url = matchedPath2;
    }
    return getRequestListener(src_default.fetch)(req, res);
  }
  let request = req;
  const matchedPath = req.headers?.get?.("x-matched-path") || req.headers?.get?.("x-forwarded-uri");
  if (matchedPath) {
    try {
      const url = new URL(req.url);
      if (url.pathname === "/api" || url.pathname === "/api/") {
        url.pathname = matchedPath;
        request = new Request(url.toString(), req);
      }
    } catch {
    }
  }
  return src_default.fetch(request);
}
export {
  config2 as config,
  handler as default
};
