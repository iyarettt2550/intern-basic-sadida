import { Hono } from "hono";
import { contactSchema } from "../validators";
import { db } from "../db";
import { contacts } from "../db/schema";

const router = new Hono();

// POST /api/contact — Public endpoint for submitting contact messages
router.post("/", async (c) => {
  try {
    const body = await c.req.json();

    const payload = {
      name: (body.name || body.contacts_name || "").trim(),
      email: (body.email || "").trim(),
      phone: (body.phone || "").replace(/[- ]/g, "").trim(),
      subject: (body.subject || "").trim(),
      message: (body.message || body.contacts_message || "").trim(),
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      return c.json(
        {
          success: false,
          error: "ข้อมูลไม่ถูกต้อง",
          details: parsed.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        400
      );
    }

    const { name, email, phone, subject, message } = parsed.data;

    // Generate unique ID without collision
    const newId = `cnt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    await db.insert(contacts).values({
      contactsId: newId,
      contactsName: name,
      email,
      phone,
      subject,
      contactsMessage: message,
      status: "unread",
      createdAt: new Date(),
    });

    return c.json(
      {
        success: true,
        message: "ส่งข้อความติดต่อเรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับโดยเร็ว",
        data: {
          contactsId: newId,
          contactsName: name,
          email,
          phone,
          subject,
          status: "unread",
        },
      },
      201
    );
  } catch (error: any) {
    console.error("Contact submission error:", error);
    return c.json(
      {
        success: false,
        error: "ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง",
      },
      500
    );
  }
});

export default router;
