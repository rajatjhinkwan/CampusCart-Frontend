import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
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
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true
        },
        manifestFilename: 'manifest.json',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'pwa-icon.svg', 'pwa-screenshot-mobile.svg', 'pwa-screenshot-wide.svg'],
        manifest: {
          name: 'CampusCart - Campus Marketplace',
          short_name: 'CampusCart',
          description: 'Buy and sell items within your campus securely.',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          id: '/',
          icons: [
            {
              src: '/pwa-icon.svg',
              sizes: '192x192',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            },
            {
              src: '/pwa-icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            }
          ],
          screenshots: [
            {
              src: '/pwa-screenshot-mobile.svg',
              sizes: '750x1334',
              type: 'image/svg+xml',
              form_factor: 'narrow',
              label: 'Mobile Home Screen'
            },
            {
              src: '/pwa-screenshot-wide.svg',
              sizes: '1280x720',
              type: 'image/svg+xml',
              form_factor: 'wide',
              label: 'Desktop Dashboard'
            }
          ]
        }
      })
    ],
    server: {
      host: true,
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
          target: "https://campuscart-backend-34qc.onrender.com",
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
