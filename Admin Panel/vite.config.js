import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [tailwindcss(), viteCompression({
      algorithm: 'gzip',
      deleteOriginFile: true,
    })],
    publicDir:'public',
});