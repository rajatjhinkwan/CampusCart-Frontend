import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
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
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'My Project',
          short_name: 'Project',
          description: 'My awesome project',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    server: {
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
