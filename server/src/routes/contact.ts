import { Hono } from "hono";
import { contactSchema } from "../validators";
import { db } from "../db";
import { contacts } from "../db/schema";

const router = new Hono();

// POST /api/contact
router.post("/", async (c) => {
  try {
    const body = await c.req.json();

    // Normalizing field names if user sends contacts_name or name
    const payload = {
      name: body.name || body.contacts_name,
      email: body.email,
      phone: body.phone,
      subject: body.subject,
      message: body.message || body.contacts_message,
    };

    // Zod validation
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      return c.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        400
      );
    }

    const { name, email, phone, subject, message } = parsed.data;

    // Generate unique ID (max 50 chars)
    const newId = `cnt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    await db.insert(contacts).values({
      contactsId: newId,
      contactsName: name,
      email,
      phone,
      subject,
      contactsMessage: message,
    });

    return c.json(
      {
        success: true,
        message: "บันทึกข้อความติดต่อเรียบร้อยแล้ว",
        data: {
          contactsId: newId,
          contactsName: name,
          email,
          phone,
          subject,
          contactsMessage: message,
        },
      },
      201
    );
  } catch (error: any) {
    return c.json(
      {
        success: false,
        error: "Internal Server Error",
        details: error?.message,
      },
      500
    );
  }
});

// GET /api/contact (Bonus: list messages for admin/testing)
router.get("/", async (c) => {
  try {
    const list = await db.select().from(contacts);
    return c.json({
      success: true,
      data: list,
    });
  } catch (error: any) {
    return c.json(
      {
        success: false,
        error: "Failed to fetch contact messages",
        details: error?.message,
      },
      500
    );
  }
});

export default router;
