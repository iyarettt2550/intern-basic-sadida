import { pgTable, varchar, doublePrecision } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. categories
export const categories = pgTable("categories", {
  categoryId: varchar("category_id", { length: 10 }).primaryKey(),
  categoryName: varchar("category_name", { length: 50 }).notNull(),
});

// 2. product_detail
export const productDetail = pgTable("product_detail", {
  prodetailId: varchar("prodetail_id", { length: 12 }).primaryKey(),
  prodetailSize: varchar("prodetail_size", { length: 10 }).notNull(),
  price: doublePrecision("price").notNull(),
});

// 3. product — img เก็บเป็น path ของไฟล์รูปภาพ (เช่น "/images/shoe_runner_1.jpg")
export const product = pgTable("product", {
  proId: varchar("pro_id", { length: 20 }).primaryKey(),
  proName: varchar("pro_name", { length: 50 }).notNull(),
  description: varchar("description", { length: 100 }).notNull(),
  img: varchar("img", { length: 200 }).notNull(),
  prodetailId: varchar("prodetail_id", { length: 12 })
    .notNull()
    .references(() => productDetail.prodetailId),
  categoryId: varchar("category_id", { length: 10 })
    .notNull()
    .references(() => categories.categoryId),
});

// 4. contacts
export const contacts = pgTable("contacts", {
  contactsId: varchar("contacts_id", { length: 50 }).primaryKey(),
  contactsName: varchar("contacts_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 25 }).notNull(),
  phone: varchar("phone", { length: 10 }).notNull(),
  subject: varchar("subject", { length: 50 }).notNull(),
  contactsMessage: varchar("contacts_message", { length: 200 }).notNull(),
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
  passwordHash: varchar("password_hash", { length: 50 }).notNull(),
  userRolesId: varchar("user_roles_id", { length: 5 })
    .notNull()
    .references(() => userRoles.userRolesId),
});

// Relations
export const productRelations = relations(product, ({ one }) => ({
  category: one(categories, {
    fields: [product.categoryId],
    references: [categories.categoryId],
  }),
  detail: one(productDetail, {
    fields: [product.prodetailId],
    references: [productDetail.prodetailId],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(product),
}));

export const productDetailRelations = relations(productDetail, ({ many }) => ({
  products: many(product),
}));

export const usersRelations = relations(users, ({ one }) => ({
  role: one(userRoles, {
    fields: [users.userRolesId],
    references: [userRoles.userRolesId],
  }),
}));
