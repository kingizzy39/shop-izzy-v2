import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: "eslint . --ext .js,.jsx,.ts,.tsx",
      },
      overlay: {
        initialIsOpen: false,
      },
    }),
    // Sentry plugin for source map uploads (only in production)
    process.env.SENTRY_AUTH_TOKEN &&
      sentryVitePlugin({
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        // Only upload source maps in production
        include: ".",
        ignore: ["node_modules", "vite.config.ts"],
        urlPrefix: "~/",
      }),
  ].filter(Boolean),
  server: {
    port: 3001,
    strictPort: true,
    host: "0.0.0.0",
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Generate source maps for Sentry
    sourcemap: true,
    // Don't minify in development for easier debugging
    minify: process.env.NODE_ENV === "production" ? "esbuild" : false,
  },
});
