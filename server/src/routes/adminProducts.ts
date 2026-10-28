import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { product, productDetail, categories } from "../db/schema";
import path from "path";

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

// GET /api/admin/products — list all products (for admin table & storefront)
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
    const allCategories = await db.select().from(categories);
    return c.json({
      success: true,
      data: {
        totalProducts: allProducts.length,
        totalCategories: allCategories.length,
        categories: allCategories,
      },
    });
  } catch (error: any) {
    return c.json(
      { success: false, error: "Failed to fetch stats", details: error?.message },
      500
    );
  }
});

// GET /api/admin/products/categories — list all categories
router.get("/categories", async (c) => {
  try {
    const all = await db.select().from(categories);
    return c.json({ success: true, data: all });
  } catch (error: any) {
    return c.json(
      { success: false, error: "Failed to fetch categories", details: error?.message },
      500
    );
  }
});

// POST /api/admin/products/categories — create new category
router.post("/categories", async (c) => {
  try {
    const body = await c.req.json();
    const { categoryId, categoryName } = body;
    if (!categoryName || typeof categoryName !== "string" || !categoryName.trim()) {
      return c.json({ success: false, error: "กรุณาระบุชื่อหมวดหมู่" }, 400);
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
      categoryName: categoryName.trim(),
    });
    return c.json(
      {
        success: true,
        message: "เพิ่มหมวดหมู่เรียบร้อยแล้ว",
        data: { categoryId: newId, categoryName: categoryName.trim() },
      },
      201
    );
  } catch (error: any) {
    return c.json(
      { success: false, error: "Failed to create category", details: error?.message },
      500
    );
  }
});

// DELETE /api/admin/products/categories/:id — delete category
router.delete("/categories/:id", async (c) => {
  try {
    const id = c.req.param("id");

    // Check if category has any products
    const existingProducts = await db
      .select({ proId: product.proId })
      .from(product)
      .where(eq(product.categoryId, id));

    if (existingProducts.length > 0) {
      return c.json(
        {
          success: false,
          error: "มีสินค้าอยู่ในหมวดหมู่นี้อยู่ไม่สามารถลบได้",
          message: `มีสินค้าอยู่ในหมวดหมู่นี้อยู่ไม่สามารถลบได้ (พบสินค้า ${existingProducts.length} รายการ)`,
        },
        400
      );
    }

    await db.delete(categories).where(eq(categories.categoryId, id));
    return c.json({ success: true, message: "ลบหมวดหมู่เรียบร้อยแล้ว" });
  } catch (error: any) {
    return c.json({ success: false, error: "Failed to delete category", details: error?.message }, 500);
  }
});

// POST /api/admin/products/upload — upload image from client
router.post("/upload", async (c) => {
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
    const uploadDir = path.resolve(process.cwd(), "../client/public/images");
    const filePath = path.join(uploadDir, filename);
    const buffer = Buffer.from(matches[2], "base64");
    await Bun.write(filePath, buffer);
    return c.json({
      success: true,
      message: "อัปโหลดรูปภาพสำเร็จ",
      data: { url: `/images/${filename}` },
    });
  } catch (error: any) {
    return c.json({ success: false, error: error?.message }, 500);
  }
});

// GET /api/admin/products/product-details/all — list all sizes with price
router.get("/product-details/all", async (c) => {
  try {
    const details = await db
      .select({
        prodetailId: productDetail.prodetailId,
        proId: productDetail.proId,
        prodetailSize: productDetail.prodetailSize,
        price: product.price,
      })
      .from(productDetail)
      .leftJoin(product, eq(productDetail.proId, product.proId));
    return c.json({ success: true, data: details });
  } catch (error: any) {
    return c.json(
      { success: false, error: "Failed to fetch product details", details: error?.message },
      500
    );
  }
});

// POST /api/admin/products/product-details — create new size (UK)
router.post("/product-details", async (c) => {
  try {
    const body = await c.req.json();
    const { prodetailSize, proId } = body;
    if (!prodetailSize) {
      return c.json({ success: false, error: "กรุณาระบุขนาด" }, 400);
    }
    const rawSize = String(prodetailSize).trim();
    const formattedSize = rawSize.toUpperCase().includes("UK") ? rawSize : `${rawSize} UK`;

    const all = await db.select().from(productDetail);
    const newId = `pdd_${String(all.length + 1).padStart(3, "0")}`;

    if (proId) {
      await db.insert(productDetail).values({
        prodetailId: newId,
        proId: proId,
        prodetailSize: formattedSize,
      });
    }

    return c.json(
      {
        success: true,
        message: "เพิ่มขนาดเรียบร้อยแล้ว",
        data: { prodetailId: newId, prodetailSize: formattedSize, proId: proId || "" },
      },
      201
    );
  } catch (error: any) {
    return c.json(
      { success: false, error: "Failed to create product detail", details: error?.message },
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
      prodetailSize,
    } = body;

    if (!proName || !description || !categoryId) {
      return c.json({ success: false, error: "Missing required fields (proName, description, categoryId)" }, 400);
    }

    // Auto-generate proId if not provided
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

    const finalPrice = Number(price !== undefined ? price : customPrice) || 0;

    await db.insert(product).values({
      proId: finalProId,
      proName,
      description,
      img: img || "/images/shoe_runner_1.jpg",
      price: finalPrice,
      categoryId,
    });

    // Handle sizes inserting into productDetail
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

    const sizesToInsert: string[] = [];
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
        prodetailSize: formatted,
      });
    }

    return c.json(
      { success: true, message: "เพิ่มสินค้าเรียบร้อยแล้ว", data: { proId: finalProId } },
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
    const {
      proName,
      description,
      img,
      categoryId,
      price,
      customPrice,
      sizes,
      size,
      prodetailSize,
    } = body;

    const updateData: Record<string, any> = {};
    if (proName !== undefined) updateData.proName = proName;
    if (description !== undefined) updateData.description = description;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (img !== undefined) updateData.img = img;
    if (price !== undefined || customPrice !== undefined) {
      updateData.price = Number(price !== undefined ? price : customPrice) || 0;
    }

    if (Object.keys(updateData).length > 0) {
      await db.update(product).set(updateData).where(eq(product.proId, id));
    }

    // If sizes provided, update or add productDetail
    const sizesToUpdate: string[] = [];
    if (Array.isArray(sizes) && sizes.length > 0) {
      sizesToUpdate.push(...sizes);
    } else if (size) {
      sizesToUpdate.push(size);
    } else if (prodetailSize) {
      sizesToUpdate.push(prodetailSize);
    }

    if (sizesToUpdate.length > 0) {
      const sortedSizesToUpdate = sortSizeList(sizesToUpdate);
      await db.delete(productDetail).where(eq(productDetail.proId, id));
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
          prodetailSize: formatted,
        });
      }
    }

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

    // Delete child details first due to foreign key constraint
    await db.delete(productDetail).where(eq(productDetail.proId, id));
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
