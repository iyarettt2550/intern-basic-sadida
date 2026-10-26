import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { product, productDetail, categories } from "../db/schema";

const router = new Hono();

// GET /api/admin/products — list all products (for admin table)
router.get("/", async (c) => {
  try {
    const items = await db
      .select({
        proId: product.proId,
        proName: product.proName,
        description: product.description,
        img: product.img,
        prodetailId: product.prodetailId,
        prodetailSize: productDetail.prodetailSize,
        price: productDetail.price,
        categoryId: product.categoryId,
        categoryName: categories.categoryName,
      })
      .from(product)
      .leftJoin(
        productDetail,
        eq(product.prodetailId, productDetail.prodetailId)
      )
      .leftJoin(categories, eq(product.categoryId, categories.categoryId));

    return c.json({ success: true, data: items });
  } catch (error: any) {
    return c.json(
      { success: false, error: "Failed to fetch products", details: error?.message },
      500
    );
  }
});

// GET /api/admin/products/stats/summary — stats for dashboard
router.get("/stats/summary", async (c) => {
  try {
    const allProducts = await db.select({ proId: product.proId }).from(product);
    return c.json({
      success: true,
      data: { totalProducts: allProducts.length },
    });
  } catch (error: any) {
    return c.json(
      { success: false, error: "Failed to fetch stats", details: error?.message },
      500
    );
  }
});

// GET /api/admin/products/product-details/all — list all available sizes/prices
router.get("/product-details/all", async (c) => {
  try {
    const details = await db.select().from(productDetail);
    return c.json({ success: true, data: details });
  } catch (error: any) {
    return c.json(
      { success: false, error: "Failed to fetch product details", details: error?.message },
      500
    );
  }
});

// GET /api/admin/products/:id — get single product detail
router.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const items = await db
      .select({
        proId: product.proId,
        proName: product.proName,
        description: product.description,
        img: product.img,
        prodetailId: product.prodetailId,
        prodetailSize: productDetail.prodetailSize,
        price: productDetail.price,
        categoryId: product.categoryId,
        categoryName: categories.categoryName,
      })
      .from(product)
      .leftJoin(
        productDetail,
        eq(product.prodetailId, productDetail.prodetailId)
      )
      .leftJoin(categories, eq(product.categoryId, categories.categoryId))
      .where(eq(product.proId, id))
      .limit(1);

    if (items.length === 0) {
      return c.json({ success: false, error: "Product not found" }, 404);
    }

    return c.json({ success: true, data: items[0] });
  } catch (error: any) {
    return c.json(
      { success: false, error: "Failed to fetch product", details: error?.message },
      500
    );
  }
});

// POST /api/admin/products — create new product
router.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { proId, proName, description, img, prodetailId, categoryId } = body;

    if (!proId || !proName || !description || !prodetailId || !categoryId) {
      return c.json({ success: false, error: "Missing required fields" }, 400);
    }

    await db.insert(product).values({
      proId,
      proName,
      description,
      img: img || "/images/shoe_runner_1.jpg", // default placeholder image path
      prodetailId,
      categoryId,
    });

    return c.json(
      { success: true, message: "เพิ่มสินค้าเรียบร้อยแล้ว", data: { proId } },
      201
    );
  } catch (error: any) {
    return c.json(
      { success: false, error: "Failed to create product", details: error?.message },
      500
    );
  }
});

// PUT /api/admin/products/:id — update product
router.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { proName, description, img, prodetailId, categoryId } = body;

    const updateData: Record<string, any> = {};
    if (proName !== undefined) updateData.proName = proName;
    if (description !== undefined) updateData.description = description;
    if (prodetailId !== undefined) updateData.prodetailId = prodetailId;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (img !== undefined) updateData.img = img; // img is now a path string

    if (Object.keys(updateData).length === 0) {
      return c.json({ success: false, error: "No fields to update" }, 400);
    }

    await db.update(product).set(updateData).where(eq(product.proId, id));

    return c.json({
      success: true,
      message: "แก้ไขสินค้าเรียบร้อยแล้ว",
      data: { proId: id },
    });
  } catch (error: any) {
    return c.json(
      { success: false, error: "Failed to update product", details: error?.message },
      500
    );
  }
});

// DELETE /api/admin/products/:id — delete product
router.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");

    await db.delete(product).where(eq(product.proId, id));

    return c.json({
      success: true,
      message: "ลบสินค้าเรียบร้อยแล้ว",
      data: { proId: id },
    });
  } catch (error: any) {
    return c.json(
      { success: false, error: "Failed to delete product", details: error?.message },
      500
    );
  }
});

export default router;
