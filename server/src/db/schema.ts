import { pgTable, varchar, doublePrecision, text, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. categories
export const categories = pgTable("categories", {
  categoryId: varchar("category_id", { length: 10 }).primaryKey(),
  categoryName: varchar("category_name", { length: 50 }).notNull().unique(),
});

// 2. product_detail
export const productDetail = pgTable("product_detail", {
  prodetailId: varchar("prodetail_id", { length: 12 }).primaryKey(),
  proId: varchar("pro_id", { length: 20 })
    .notNull()
    .references(() => product.proId),
  prodetailSize: varchar("prodetail_size", { length: 10 }).notNull(),
});

// 3. product — img เก็บเป็น path หรือ URL ของรูปภาพ
export const product = pgTable("product", {
  proId: varchar("pro_id", { length: 20 }).primaryKey(),
  proName: varchar("pro_name", { length: 50 }).notNull(),
  description: text("description").notNull(),
  price: numeric("price").notNull(),
  categoryId: varchar("category_id", { length: 10 })
    .notNull()
    .references(() => categories.categoryId),
  img: text("img").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// 4. contacts
export const contacts = pgTable("contacts", {
  contactsId: varchar("contacts_id", { length: 50 }).primaryKey(),
  contactsName: varchar("contacts_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  contactsMessage: text("contacts_message").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("unread"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 5. website_settings
export const websiteSettings = pgTable("website_settings", {
  id: varchar("id", { length: 50 }).primaryKey().default("default"),
  brandName: varchar("brand_name", { length: 100 }),
  brandTagline: varchar("brand_tagline", { length: 255 }),
  brandLogo: text("brand_logo"),
  footerAbout: text("footer_about"),
  topNotice: varchar("top_notice", { length: 255 }),
  showTopNotice: boolean("show_top_notice").default(false),
  configJson: text("config_json").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// 5. user_roles
export const userRoles = pgTable("user_roles", {
  userRolesId: varchar("user_roles_id", { length: 5 }).primaryKey(),
  userRolesName: varchar("user_roles_name", { length: 20 }).notNull(),
});

// 6. users
export const users = pgTable("users", {
  usersId: varchar("users_id", { length: 50 }).primaryKey(),
  usersName: varchar("users_name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 10 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  userRolesId: varchar("user_roles_id", { length: 5 })
    .notNull()
    .references(() => userRoles.userRolesId),
});

// Relations
export const productRelations = relations(product, ({ one, many }) => ({
  category: one(categories, {
    fields: [product.categoryId],
    references: [categories.categoryId],
  }),
  // แก้ไขตรงนี้: เปลี่ยนจาก one เป็น many และลบ fields/references ออก 
  // เพราะฝั่ง product ไม่ได้เก็บ Foreign Key แล้ว
  details: many(productDetail),
}));

// 2. ความสัมพันธ์ฝั่ง Categories (อันนี้ถูกต้องแล้วครับ)
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(product),
}));

// 3. ความสัมพันธ์ฝั่ง Product Detail
export const productDetailRelations = relations(productDetail, ({ one }) => ({
  // แก้ไขตรงนี้: เปลี่ยนจาก many เป็น one และระบุจุดเชื่อม 
  // เพราะตารางนี้เป็นคนเก็บ Foreign key (proId) เอาไว้
  product: one(product, {
    fields: [productDetail.proId],
    references: [product.proId],
  }),
}));

// 4. ความสัมพันธ์ฝั่ง Users (อันนี้ดูถูกต้องแล้ว หากในตาราง users มีคอลัมน์ userRolesId ครับ)
export const usersRelations = relations(users, ({ one }) => ({
  role: one(userRoles, {
    fields: [users.userRolesId],
    references: [userRoles.userRolesId],
  }),
}));