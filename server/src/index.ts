import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import path from "path";
import { mkdir, writeFile } from "node:fs/promises";
import { put } from "@vercel/blob";
import categoriesRouter from "./routes/categories";
import servicesRouter from "./routes/services";
import contactRouter from "./routes/contact";
import authRouter from "./routes/auth";
import adminProductsRouter from "./routes/adminProducts";
import adminContactsRouter from "./routes/adminContacts";
import websiteSettingsRouter from "./routes/websiteSettings";
import { adminAuthMiddleware } from "./middlewares/auth";

const app = new Hono();

// Middlewares
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// Health check endpoints
const healthCheck = (c: any) => {
  return c.json({
    success: true,
    status: "ok",
    message: "Sadida Backend API is running",
    timestamp: new Date().toISOString(),
  });
};

app.get("/", healthCheck);
app.get("/health", healthCheck);
app.get("/api", healthCheck);
app.get("/api/health", healthCheck);

// File Upload Endpoint (Vercel Blob / Local fallback) — Admin protected
app.post("/api/upload", adminAuthMiddleware, async (c) => {
  try {
    const url = new URL(c.req.url);
    const rawFilename = url.searchParams.get("filename") || `upload_${Date.now()}.png`;
    const cleanFilename = rawFilename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const arrayBuffer = await c.req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return c.json({ error: "No file content received" }, 400);
    }

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(cleanFilename, buffer, {
        access: "public",
      });
      return c.json(blob);
    }

    if (process.env.VERCEL) {
      return c.json(
        {
          error: "ยังไม่ได้เชื่อมต่อ Vercel Blob Store (กรุณาไปที่ Vercel Dashboard > Storage เพื่อสร้าง Blob และ Connect เข้าโปรเจกต์)",
        },
        500
      );
    }

    const uploadDir = path.resolve(process.cwd(), "../client/public/images");
    const filePath = path.join(uploadDir, cleanFilename);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, buffer);
    return c.json({
      url: `/images/${cleanFilename}`,
      pathname: cleanFilename,
      contentType: c.req.header("content-type") || "image/png",
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return c.json({ error: err.message }, 500);
  }
});

// API Routes
app.route("/api/categories", categoriesRouter);
app.route("/api/services", servicesRouter);
app.route("/api/products", servicesRouter);
app.route("/api/contact", contactRouter);
app.route("/api/auth", authRouter);
app.route("/api/admin/products", adminProductsRouter);
app.route("/api/admin/contacts", adminContactsRouter);
app.route("/api/website-config", websiteSettingsRouter);
app.route("/api/admin/website-config", websiteSettingsRouter);

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: "Not Found",
      message: `Path ${c.req.path} not found`,
    },
    404
  );
});

// Global error handler
app.onError((err, c) => {
  console.error("Server Error:", err);
  return c.json(
    {
      success: false,
      error: "Internal Server Error",
      message: err.message,
    },
    500
  );
});

const port = Number(process.env.PORT) || 3000;

export default app;

const bunGlobal = (globalThis as { Bun?: typeof Bun }).Bun;
if (bunGlobal && import.meta.main) {
  console.log(`🚀 Server starting on http://localhost:${port}`);
  bunGlobal.serve({ port, fetch: app.fetch });
}
