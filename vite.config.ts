import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 相对路径，GitHub Pages 项目子路径下也能正确加载资源
  base: './',
})
