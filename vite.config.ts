import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import FullReload from 'vite-plugin-full-reload'

export default defineConfig({
  plugins: [
    RubyPlugin(),
    FullReload(['config/routes.rb', 'app/views/**/*'])
  ],
   build: {
    outDir: 'public/vite-dev',
    manifest: true,
    rollupOptions: {
      input: 'app/javascript/entrypoints/application.js'
    }
  }
})
