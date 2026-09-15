import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // Vite 8 apunta por defecto a navegadores muy recientes ("baseline widely
  // available"), lo que puede generar sintaxis que un Safari de iPhone algo
  // viejo no puede ni parsear: el <script type="module"> falla en silencio
  // y la app queda en blanco, sin ningún error visible para el usuario.
  // Igualamos el target al que usaba Vite 5 (default "modules": Safari 14+),
  // que es la base con la que esta misma app ya funcionaba en producción.
  // No bajarlo más: Firebase ya usa BigInt (ES2020) internamente, así que
  // apuntar a un target anterior a ES2020 no aporta nada y solo genera
  // advertencias de build.
  build: {
    target: ["es2020", "safari14"],
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/apple-touch-icon.png"],
      manifest: {
        name: "Finanzas Familiares",
        short_name: "Finanzas",
        description: "Control de ingresos, gastos y ahorros con alertas por quincena.",
        lang: "es",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#EAECEF",
        theme_color: "#16232F",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Cachea el "app shell" (JS/CSS/HTML) para que la app abra al instante
        // y siga abriendo sin conexión. Las llamadas a Firebase (Auth/Firestore)
        // se dejan fuera a propósito: siempre deben ir a la red para no mostrar
        // datos financieros desactualizados o permitir login con datos viejos.
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
        navigateFallbackDenylist: [/^\/__/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts-stylesheets" },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
