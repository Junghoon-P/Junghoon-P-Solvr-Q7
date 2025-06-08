import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // vendor 라이브러리들을 별도 청크로 분리
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['recharts'],
          http: ['axios']
        }
      }
    },
    // 청크 크기 경고 임계값 조정
    chunkSizeWarningLimit: 1000,
    // 소스맵 생성 (개발용)
    sourcemap: true
  },
  // 번들 분석 및 최적화
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'recharts', 'axios']
  }
})
