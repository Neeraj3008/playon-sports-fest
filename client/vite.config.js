import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    // During development, forward /api calls to the Express server
    proxy: { "/api": "http://localhost:5000" },
  },
});
