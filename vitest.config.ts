
import { defineConfig } from "vitest/config"

export default defineConfig({
  root: "./",
  resolve: {
    alias: {
      "@": "./src",
    },
  },
})