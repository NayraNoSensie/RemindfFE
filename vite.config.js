import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3009, // or whatever you're using
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // your backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
