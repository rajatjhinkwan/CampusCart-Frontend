import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname);
  const contact = env.VITE_NOMINATIM_CONTACT || "contact@example.com";
  const appName = "my-project";

  return {
    plugins: [
      react(),
      tailwindcss(),
      nodePolyfills({
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
      }),
    ],
    server: {
      host: true,
      hmr: {
        host: "localhost",
      },
      proxy: {
        "/osm": {
          target: "https://nominatim.openstreetmap.org",
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/osm/, ""),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader("User-Agent", `${appName} (${contact})`);
              proxyReq.setHeader("Accept", "application/json");
              proxyReq.setHeader("Referer", "http://localhost:5173/");
            });
          },
        },
        "/osrm": {
          target: "https://router.project-osrm.org",
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/osrm/, ""),
        },
        "/api": {
          target: env.VITE_API_PROXY_TARGET || "http://127.0.0.1:5000",
          changeOrigin: true,
          secure: false,
        },
        "/socket.io": {
          target: env.VITE_API_PROXY_TARGET || "http://127.0.0.1:5000",
          ws: true,
          changeOrigin: true,
          secure: false,
        },
        "/photon": {
          target: "https://photon.komoot.io",
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/photon/, "/api"),
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom', 'axios', 'zustand'],
            maps: ['leaflet', 'react-leaflet', '@googlemaps/js-api-loader'],
          },
        },
      },
    },
  };
});
