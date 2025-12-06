import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Disable build cache to force fresh builds
    rollupOptions: {
      output: {
        // Add timestamp to chunk names to force new hashes
        entryFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        chunkFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        assetFileNames: `assets/[name]-[hash]-${Date.now()}.[ext]`
      }
    }
  },
  // Clear cache on server start
  server: {
    watch: {
      ignored: ['!**/node_modules/**']
    }
  }
})
