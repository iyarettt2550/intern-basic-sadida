import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import categoriesRouter from "./routes/categories";
import servicesRouter from "./routes/services";
import contactRouter from "./routes/contact";
import authRouter from "./routes/auth";
import adminProductsRouter from "./routes/adminProducts";
import adminContactsRouter from "./routes/adminContacts";

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

// Health check
app.get("/", (c) => {
  return c.json({
    success: true,
    message: "Sadida Backend API is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.route("/api/categories", categoriesRouter);
app.route("/api/services", servicesRouter);
app.route("/api/products", servicesRouter);
app.route("/api/contact", contactRouter);
app.route("/api/auth", authRouter);
app.route("/api/admin/products", adminProductsRouter);
app.route("/api/admin/contacts", adminContactsRouter);

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
console.log(`🚀 Server starting on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
