import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const API_URL = `${env.VITE_API_URL ?? "http://localhost:3000"}`;

  return {
    server: {
      proxy: {
        "/api": {
          target: API_URL,
          changeOrigin: true,
        },
      },
    },
    plugins: [react()],
  };
});
