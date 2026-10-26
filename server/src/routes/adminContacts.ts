import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { contacts } from "../db/schema";

const router = new Hono();

// GET /api/admin/contacts — list all contacts
router.get("/", async (c) => {
  try {
    const list = await db.select().from(contacts);
    return c.json({ success: true, data: list });
  } catch (error: any) {
    return c.json(
      { success: false, error: "Failed to fetch contacts", details: error?.message },
      500
    );
  }
});

// GET /api/admin/contacts/:id — get single contact detail
router.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const items = await db
      .select()
      .from(contacts)
      .where(eq(contacts.contactsId, id))
      .limit(1);

    if (items.length === 0) {
      return c.json({ success: false, error: "Contact not found" }, 404);
    }

    return c.json({ success: true, data: items[0] });
  } catch (error: any) {
    return c.json(
      { success: false, error: "Failed to fetch contact", details: error?.message },
      500
    );
  }
});

// DELETE /api/admin/contacts/:id — delete contact
router.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");

    await db.delete(contacts).where(eq(contacts.contactsId, id));

    return c.json({
      success: true,
      message: "ลบข้อความติดต่อเรียบร้อยแล้ว",
      data: { contactsId: id },
    });
  } catch (error: any) {
    return c.json(
      { success: false, error: "Failed to delete contact", details: error?.message },
      500
    );
  }
});

// GET /api/admin/contacts/stats/summary — contacts stats for dashboard
router.get("/stats/summary", async (c) => {
  try {
    const allContacts = await db
      .select({ contactsId: contacts.contactsId })
      .from(contacts);
    return c.json({
      success: true,
      data: { totalContacts: allContacts.length },
    });
  } catch (error: any) {
    return c.json(
      { success: false, error: "Failed to fetch stats", details: error?.message },
      500
    );
  }
});

export default router;
