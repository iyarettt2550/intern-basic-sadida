import { Hono } from "hono";
import { loginSchema } from "../validators";
import { db } from "../db";
import { users, userRoles } from "../db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { generateAdminToken, adminAuthMiddleware } from "../middlewares/auth";

const router = new Hono();

// POST /api/auth/login
router.post("/login", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = loginSchema.safeParse(body);

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

    const { password } = parsed.data;
    const rawUsername = (parsed.data.username || parsed.data.userName || "").trim();
    const rawPhone = (parsed.data.phone || "").trim();

    if (!rawUsername && !rawPhone) {
      return c.json({ success: false, error: "กรุณาระบุชื่อผู้ใช้หรือเบอร์โทรศัพท์" }, 400);
    }

    // Parameterized strict condition to prevent SQL injection or wildcards
    const condition =
      rawUsername && rawPhone
        ? or(eq(users.usersName, rawUsername), eq(users.phone, rawPhone))
        : rawUsername
        ? eq(users.usersName, rawUsername)
        : eq(users.phone, rawPhone);

    const user = await db
      .select({
        usersId: users.usersId,
        usersName: users.usersName,
        phone: users.phone,
        passwordHash: users.passwordHash,
        userRolesId: users.userRolesId,
        roleName: userRoles.userRolesName,
      })
      .from(users)
      .leftJoin(userRoles, eq(users.userRolesId, userRoles.userRolesId))
      .where(condition)
      .limit(1);

    if (user.length === 0) {
      return c.json(
        { success: false, error: "ชื่อผู้ใช้ เบอร์โทรศัพท์ หรือรหัสผ่านไม่ถูกต้อง" },
        401
      );
    }

    const foundUser = user[0];

    const bunGlobal = (globalThis as { Bun?: typeof Bun }).Bun;
    const isPasswordValid = bunGlobal
      ? await bunGlobal.password.verify(password, foundUser.passwordHash)
      : await bcrypt.compare(password, foundUser.passwordHash);

    if (!isPasswordValid) {
      return c.json(
        { success: false, error: "ชื่อผู้ใช้ เบอร์โทรศัพท์ หรือรหัสผ่านไม่ถูกต้อง" },
        401
      );
    }

    // Only allow Admin or Owner roles (r_1)
    if (foundUser.userRolesId !== "r_1") {
      return c.json(
        { success: false, error: "บัญชีนี้ไม่มีสิทธิ์เข้าใช้งานระบบหลังบ้าน" },
        403
      );
    }

    // Generate JWT Token
    const token = await generateAdminToken({
      usersId: foundUser.usersId,
      usersName: foundUser.usersName,
      phone: foundUser.phone,
      role: foundUser.roleName || "Admin",
    });

    return c.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      data: {
        usersId: foundUser.usersId,
        usersName: foundUser.usersName,
        phone: foundUser.phone,
        role: foundUser.roleName,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return c.json(
      {
        success: false,
        error: "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
      },
      500
    );
  }
});

// GET /api/auth/me — verify session using JWT Token
router.get("/me", adminAuthMiddleware, async (c) => {
  const adminUser = c.get("adminUser" as any);
  return c.json({
    success: true,
    data: adminUser,
  });
});

export default router;
