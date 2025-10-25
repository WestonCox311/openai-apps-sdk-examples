/**
 * VITE CONFIGURATION
 *
 * This configures the Vite development server for live preview.
 *
 * BEGINNER EXPLANATION:
 * - When you run "pnpm run dev", this config is used
 * - It sets up hot-reloading (auto-refresh when you save files)
 * - You can preview your widget at http://localhost:5173
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true, // Auto-open browser
  },
  // Entry point for dev server
  build: {
    rollupOptions: {
      input: "./src/hello-world/index.jsx",
    },
  },
});
