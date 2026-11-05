import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { product, productDetail, categories } from "../db/schema";

const router = new Hono();

// Helper to sort shoe sizes numerically (e.g. 6.5 UK before 7 UK, 7 UK before 7.5 UK)
const sortSizeList = (list: string[]): string[] => {
  return [...list].sort((a, b) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });
};

// GET /api/products or /api/services — Public storefront products API
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
      const sizes = sortSizeList(details.map((d) => d.prodetailSize));
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
    console.error("Public products API error:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch products",
      },
      500
    );
  }
});

// GET /api/products/:id — Public single product detail
router.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const items = await db
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
      .leftJoin(categories, eq(product.categoryId, categories.categoryId))
      .where(eq(product.proId, id))
      .limit(1);

    if (items.length === 0) {
      return c.json({ success: false, error: "Product not found" }, 404);
    }

    const details = await db
      .select()
      .from(productDetail)
      .where(eq(productDetail.proId, id));
    const sizes = sortSizeList(details.map((d) => d.prodetailSize));

    return c.json({
      success: true,
      data: {
        ...items[0],
        prodetailId: details[0]?.prodetailId || "",
        prodetailSize: sizes[0] || "",
        sizes: sizes,
        details: details,
      },
    });
  } catch (error: any) {
    console.error("Single product API error:", error);
    return c.json({ success: false, error: "Failed to fetch product" }, 500);
  }
});

export default router;
