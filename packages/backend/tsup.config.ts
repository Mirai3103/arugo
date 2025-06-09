// tsup.config.ts
import { defineConfig } from "tsup";
export default defineConfig((options) => ({
  entry: ["src/**/*.ts"],
  outDir: "dist",
  target: "node22",
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  ...options,
}));
