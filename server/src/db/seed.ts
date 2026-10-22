import { db } from "./index";
import { categories, productDetail, product, userRoles } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // 1. Roles
    await db
      .insert(userRoles)
      .values([
        { userRolesId: "r_1", userRolesName: "Admin" },
        { userRolesId: "r_2", userRolesName: "Customer" },
      ])
      .onConflictDoNothing();

    // 2. Categories
    await db
      .insert(categories)
      .values([
        { categoryId: "cg_1", categoryName: "รองเท้าวิ่ง" },
        { categoryId: "cg_2", categoryName: "รองเท้าเดิน" },
      ])
      .onConflictDoNothing();

    // 3. Product Details (ขนาดและราคา)
    await db
      .insert(productDetail)
      .values([
        { prodetailId: "pdd_1", prodetailSize: "6 UK", price: 1000.00 },
        { prodetailId: "pdd_2", prodetailSize: "6.5 UK", price: 1100.00 },
        { prodetailId: "pdd_3", prodetailSize: "7 UK", price: 1200.00 },
        { prodetailId: "pdd_4", prodetailSize: "7.5 UK", price: 1300.00 },
        { prodetailId: "pdd_5", prodetailSize: "8 UK", price: 1400.00 },
        { prodetailId: "pdd_6", prodetailSize: "8.5 UK", price: 1500.00 },
        { prodetailId: "pdd_7", prodetailSize: "9 UK", price: 1600.00 },
        { prodetailId: "pdd_8", prodetailSize: "9.5 UK", price: 1700.00 },
        { prodetailId: "pdd_9", prodetailSize: "10 UK", price: 1800.00 },
        { prodetailId: "pdd_10", prodetailSize: "10.5 UK", price: 1900.00 },
        { prodetailId: "pdd_11", prodetailSize: "11 UK", price: 2000.00 },
        { prodetailId: "pdd_12", prodetailSize: "11.5 UK", price: 2100.00 },
        { prodetailId: "pdd_13", prodetailSize: "12 UK", price: 2200.00 },
        { prodetailId: "pdd_14", prodetailSize: "12.5 UK", price: 2300.00 },
        { prodetailId: "pdd_16", prodetailSize: "13 UK", price: 2400.00 },

      ])
      .onConflictDoNothing();

    // 4. Products / Services
    /*await db
      .insert(product)
      .values([
        
      ])
      .onConflictDoNothing();*/

    console.log("✅ Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
