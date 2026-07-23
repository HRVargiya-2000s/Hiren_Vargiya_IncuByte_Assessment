import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],

  test: {
    environment: "jsdom",
    fileParallelism: false,
    globals: true,
    setupFiles: "./src/tests/setup.js",
  },
});
