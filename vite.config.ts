import { defineConfig,  type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer';


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
     visualizer({
      filename: 'dist/stats.html', // where the report goes
      open: true, // auto-opens the report in browser after build
      gzipSize: true, // show gzip sizes
      brotliSize: true, // show brotli sizes
    }) as PluginOption,
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
