import { createMiddleware } from "hono/factory";
import { verify, sign } from "hono/jwt";

export const JWT_SECRET = process.env.JWT_SECRET || "sadida-secret-key-2026-production-token";

export interface AdminPayload {
  [key: string]: unknown;
  usersId: string;
  usersName: string;
  phone: string;
  role: string;
  exp?: number;
}

export async function generateAdminToken(user: {
  usersId: string;
  usersName: string;
  phone: string;
  role?: string;
}): Promise<string> {
  const payload: AdminPayload = {
    usersId: user.usersId,
    usersName: user.usersName,
    phone: user.phone,
    role: user.role || "Admin",
    // Token expires in 7 days
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  };
  return await sign(payload, JWT_SECRET, "HS256");
}

export const adminAuthMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  const cookieHeader = c.req.header("Cookie") || "";

  let token = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  } else {
    const match = cookieHeader.match(/sadida_admin_token=([^;]+)/);
    if (match) {
      token = decodeURIComponent(match[1]).trim();
    }
  }

  if (!token) {
    return c.json(
      {
        success: false,
        error: "Unauthorized",
        message: "กรุณาเข้าสู่ระบบก่อนดำเนินการ (Missing admin token)",
      },
      401
    );
  }

  try {
    const payload = (await verify(token, JWT_SECRET, "HS256")) as unknown as AdminPayload;
    if (!payload || !payload.usersId) {
      return c.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Token ไม่ถูกต้องหรือหมดอายุ",
        },
        401
      );
    }
    c.set("adminUser" as any, payload);
    await next();
  } catch {
    return c.json(
      {
        success: false,
        error: "Unauthorized",
        message: "Token ไม่ถูกต้องหรือหมดอายุ กรุณาเข้าสู่ระบบใหม่",
      },
      401
    );
  }
});

