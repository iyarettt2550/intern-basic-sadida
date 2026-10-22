import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { product, productDetail, categories } from "../db/schema";

const router = new Hono();

// GET /api/services (or /api/products)
router.get("/", async (c) => {
  try {
    const items = await db
      .select({
        proId: product.proId,
        proName: product.proName,
        description: product.description,
        prodetailId: product.prodetailId,
        prodetailSize: productDetail.prodetailSize,
        price: productDetail.price,
        categoryId: product.categoryId,
        categoryName: categories.categoryName,
      })
      .from(product)
      .leftJoin(productDetail, eq(product.prodetailId, productDetail.prodetailId))
      .leftJoin(categories, eq(product.categoryId, categories.categoryId));

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
