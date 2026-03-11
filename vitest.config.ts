import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    environmentMatchGlobs: [
      ["tests/server/**", "node"],
      ["tests/shared/**", "node"],
    ],
    setupFiles: ["./tests/setup.ts"],
    exclude: ["tests/e2e/**", "node_modules/**"],
    reporter: "verbose",
    environmentOptions: {
      jsdom: {
        url: "http://localhost",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client/src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
});
