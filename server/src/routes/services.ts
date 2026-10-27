import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { product, productDetail, categories } from "../db/schema";

const router = new Hono();

// GET /api/services (or /api/products)
router.get("/", async (c) => {
  try {
    const products = await db
      .select({
        proId: product.proId,
        proName: product.proName,
        description: product.description,
        img: product.img,
        price: product.price,
        categoryId: product.categoryId,
        categoryName: categories.categoryName,
      })
      .from(product)
      .leftJoin(categories, eq(product.categoryId, categories.categoryId));

    const allDetails = await db.select().from(productDetail);

    const items = products.map((p) => {
      const details = allDetails.filter((d) => d.proId === p.proId);
      const sizes = details.map((d) => d.prodetailSize);
      return {
        ...p,
        prodetailId: details[0]?.prodetailId || "",
        prodetailSize: sizes[0] || "",
        sizes: sizes,
        details: details,
      };
    });

    return c.json({
      success: true,
      data: items,
    });
  } catch (error: any) {
    return c.json(
      {
        success: false,
        error: "Failed to fetch services/products",
        details: error?.message,
      },
      500
    );
  }
});

export default router;
