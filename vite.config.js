import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

// Get target browser from environment variable
const targetBrowser = process.env.TARGET_BROWSER || "chrome";

// Determine which manifest to use
const getManifestSource = () => {
  if (targetBrowser === "firefox") {
    return "./src/manifest.json.firefox";
  }
  return "./src/manifest.json";
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: getManifestSource(),
          dest: "./",
          rename: "manifest.json",
        },
        {
          src: "./src/background.js",
          dest: "./",
        },
        {
          src: "./src/popup.js",
          dest: "./",
        },
      ],
    }),
  ],
  build: {
    minify: false, // Keep minification disabled as per your preference
    rollupOptions: {
      treeshake: true, // Enable tree-shaking but with less aggressive settings
      output: {
        manualChunks: {
          ethers: ["ethers"], // Still separate ethers into its own chunk
        },
      },
    }, // Added missing comma here
    outDir: `dist-${targetBrowser}`,
  },
  define: {
    "process.env.TARGET_BROWSER": JSON.stringify(targetBrowser),
  },
  // Fix: Move optimizeDeps inside the main config object
  optimizeDeps: {
    include: ["ethers"],
  },
});
