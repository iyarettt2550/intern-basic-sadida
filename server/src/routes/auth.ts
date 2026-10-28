import { Hono } from "hono";
import { loginSchema } from "../validators";
import { db } from "../db";
import { users, userRoles } from "../db/schema";
import { eq, or, ilike } from "drizzle-orm";

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
          error: "Validation failed",
          details: parsed.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        400
      );
    }

    const { password } = parsed.data;
    const username = parsed.data.username || parsed.data.userName;
    const phone = parsed.data.phone;

    // Find user by username or phone
    const condition =
      username && phone
        ? or(eq(users.usersName, username), eq(users.phone, phone))
        : username
        ? or(eq(users.usersName, username), ilike(users.usersName, username))
        : eq(users.phone, phone!);

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

    // Compare password with bcrypt hash using Bun.password.verify
    const isPasswordValid = await Bun.password.verify(password, foundUser.passwordHash);
    if (!isPasswordValid) {
      return c.json(
        { success: false, error: "ชื่อผู้ใช้ เบอร์โทรศัพท์ หรือรหัสผ่านไม่ถูกต้อง" },
        401
      );
    }

    // Only allow Admin or Owner roles
    if (foundUser.userRolesId !== "r_1") {
      return c.json(
        { success: false, error: "บัญชีนี้ไม่มีสิทธิ์เข้าใช้งานระบบหลังบ้าน" },
        403
      );
    }

    return c.json({
      success: true,
      message: "เข้าสู่ระบบสำเร็จ",
      data: {
        usersId: foundUser.usersId,
        usersName: foundUser.usersName,
        phone: foundUser.phone,
        role: foundUser.roleName,
      },
    });
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

// GET /api/auth/me — check session (simple check)
router.get("/me", async (c) => {
  return c.json({ success: false, error: "Not authenticated" }, 401);
});

export default router;
