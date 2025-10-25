/**
 * BUILD SCRIPT
 *
 * This script builds your widget into HTML/JS/CSS files that can be served.
 *
 * BEGINNER EXPLANATION:
 * - Vite is a tool that bundles your React code into optimized files
 * - It converts JSX → JavaScript, bundles dependencies, minifies code
 * - Output goes to the "assets" folder
 * - The MCP server will read these built files
 */

import { build } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log("🔨 Building Hello World widget...\n");

try {
  // Build the widget
  await build({
    root: __dirname,
    build: {
      outDir: "assets",
      emptyOutDir: true,
      rollupOptions: {
        input: {
          "hello-world": resolve(__dirname, "src/hello-world/index.jsx"),
        },
        output: {
          entryFileNames: "[name].js",
          chunkFileNames: "[name].js",
          assetFileNames: "[name].[ext]",
        },
      },
    },
    plugins: [react()],
  });

  console.log("✅ JavaScript bundle created");

  // Create the HTML file that loads the widget
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello World Widget</title>
  <style>
    body { margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div id="app-root"></div>
  <script>
    // This is where data from the MCP server will be injected
    // The server passes data via structuredContent which becomes window.appData
    window.appData = window.appData || {
      userName: "Guest",
      customMessage: "Welcome!"
    };
  </script>
  <script type="module" src="/hello-world.js"></script>
</body>
</html>`;

  fs.writeFileSync(
    resolve(__dirname, "assets/hello-world.html"),
    htmlContent
  );

  console.log("✅ HTML file created");
  console.log("\n📦 Build complete! Files are in the 'assets' folder:");
  console.log("   - assets/hello-world.html");
  console.log("   - assets/hello-world.js");
  console.log("\n🎯 Next steps:");
  console.log("   1. Run 'pnpm run serve' to preview your widget");
  console.log("   2. Run 'pnpm run server' to start the MCP server");
  console.log("   3. Use ngrok to connect to ChatGPT\n");
} catch (error) {
  console.error("❌ Build failed:", error);
  process.exit(1);
}
