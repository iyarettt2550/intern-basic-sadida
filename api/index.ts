import { getRequestListener } from "@hono/node-server";

export const config = {
  runtime: "nodejs",
};

let cachedApp: any = null;

async function getApp() {
  if (!cachedApp) {
    try {
      const mod = await import("../server/src/index.js");
      cachedApp = mod.default || mod;
    } catch {
      const mod = await import("../server/src/index");
      cachedApp = mod.default || mod;
    }
  }
  return cachedApp;
}

export default async function handler(req: any, res?: any) {
  const app = await getApp();

  // Handle Node.js runtime (req: IncomingMessage, res: ServerResponse)
  if (res) {
    const matchedPath = req.headers?.["x-matched-path"] || req.headers?.["x-forwarded-uri"];
    if (matchedPath && (req.url === "/api" || req.url === "/api/")) {
      req.url = matchedPath;
    }
    return getRequestListener(app.fetch)(req, res);
  }

  // Handle Web Standard Request runtime
  let request = req;
  const matchedPath = req.headers?.get?.("x-matched-path") || req.headers?.get?.("x-forwarded-uri");
  if (matchedPath) {
    try {
      const url = new URL(req.url);
      if (url.pathname === "/api" || url.pathname === "/api/") {
        url.pathname = matchedPath;
        request = new Request(url.toString(), req);
      }
    } catch {}
  }
  return app.fetch(request);
}
