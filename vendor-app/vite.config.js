import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // ← THIS LETS MOBILE CONNECT
    port: 5173,
  },
});
