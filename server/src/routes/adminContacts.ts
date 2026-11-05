import { Hono } from "hono";
import { eq, desc } from "drizzle-orm";
import { db } from "../db";
import { contacts } from "../db/schema";
import { adminAuthMiddleware } from "../middlewares/auth";

const router = new Hono();

// Protect all admin contact routes with adminAuthMiddleware
router.use("*", adminAuthMiddleware);

// GET /api/admin/contacts/stats/summary — contacts stats for dashboard
router.get("/stats/summary", async (c) => {
  try {
    const all = await db
      .select({
        contactsId: contacts.contactsId,
        status: contacts.status,
      })
      .from(contacts);

    const totalContacts = all.length;
    const unreadContacts = all.filter((item) => (item.status || "unread") === "unread").length;
    const readContacts = totalContacts - unreadContacts;

    return c.json({
      success: true,
      data: {
        totalContacts,
        unreadContacts,
        readContacts,
      },
    });
  } catch (error: any) {
    console.error("Failed to fetch contact stats:", error);
    return c.json(
      { success: false, error: "Failed to fetch contact statistics" },
      500
    );
  }
});

// GET /api/admin/contacts — list all contacts
router.get("/", async (c) => {
  try {
    const list = await db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt));
    return c.json({ success: true, data: list });
  } catch (error: any) {
    console.error("Failed to fetch contacts:", error);
    return c.json(
      { success: false, error: "Failed to fetch contacts" },
      500
    );
  }
});

// GET /api/admin/contacts/:id — get single contact detail and optionally mark as read
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

    // Auto mark as read on view
    if (items[0].status === "unread") {
      await db
        .update(contacts)
        .set({ status: "read" })
        .where(eq(contacts.contactsId, id));
      items[0].status = "read";
    }

    return c.json({ success: true, data: items[0] });
  } catch (error: any) {
    console.error("Failed to fetch contact:", error);
    return c.json(
      { success: false, error: "Failed to fetch contact detail" },
      500
    );
  }
});

// PATCH /api/admin/contacts/:id/read — mark contact as read explicitly
router.patch("/:id/read", async (c) => {
  try {
    const id = c.req.param("id");
    await db
      .update(contacts)
      .set({ status: "read" })
      .where(eq(contacts.contactsId, id));

    return c.json({
      success: true,
      message: "ทำเครื่องหมายว่าอ่านแล้วเรียบร้อย",
      data: { contactsId: id, status: "read" },
    });
  } catch (error: any) {
    console.error("Failed to mark contact as read:", error);
    return c.json(
      { success: false, error: "Failed to update contact status" },
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
    console.error("Failed to delete contact:", error);
    return c.json(
      { success: false, error: "Failed to delete contact" },
      500
    );
  }
});

export default router;
