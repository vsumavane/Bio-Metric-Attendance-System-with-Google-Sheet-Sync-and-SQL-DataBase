import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import {viteSingleFile} from "vite-plugin-singlefile";
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [tailwindcss(), viteSingleFile(), viteCompression({
      algorithm: 'gzip',
      deleteOriginFile: true,
    })],
    publicDir:'public',
});