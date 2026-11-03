import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Dev only: serve the IP gate's Vercel functions (api/gate.js, api/gated-asset.js)
 * from the Vite server, so the gate works on localhost. GATE_PASSWORD and
 * GATE_SECRET come from .env.local (gitignored).
 */
function gateDev() {
  return {
    name: "gate-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const u = new URL(req.url, "http://x");
        const route = u.pathname === "/api/gate" ? "./api/gate.js" : u.pathname.startsWith("/gated/") ? "./api/gated-asset.js" : null;
        if (!route) return next();
        try {
          const mod = await server.ssrLoadModule(route);
          await mod.default(req, res);
        } catch (e) {
          server.config.logger.error(`[gate-dev] ${e.message}`);
          res.statusCode = 500; res.end();
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "GATE_");
  for (const [k, v] of Object.entries(env)) if (process.env[k] === undefined) process.env[k] = v;
  return {
    plugins: [react(), gateDev()],
    server: { port: 5175, strictPort: true },
    test: { environment: "node", include: ["src/**/*.test.js"] },
  };
});
