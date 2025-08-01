import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart({
      target: "node-server",
      server:{
        entry: "server.ts",
      },
      react: {
        babel: {
          plugins: [["babel-plugin-react-compiler", {}]],
        },
      },
    }),
  ],
  
});
