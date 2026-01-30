import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // Adicione esta linha
import path from "path";

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss() // Adicione esta linha
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
  root: "client",
});
