import { Hono } from "hono";
import { db } from "../db";
import { categories } from "../db/schema";

const router = new Hono();

// GET /api/categories
router.get("/", async (c) => {
  try {
    const list = await db.select().from(categories);
    return c.json({
      success: true,
      data: list,
    });
  } catch (error: any) {
    return c.json(
      {
        success: false,
        error: "Failed to fetch categories",
        details: error?.message,
      },
      500
    );
  }
});

export default router;
