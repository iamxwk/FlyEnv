import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'

const renderPath = path.resolve(__dirname, '../src/render/')
const sharePath = path.resolve(__dirname, '../src/shared/')

console.log('__dirname: ', __dirname)
console.log('renderPath: ', renderPath)
console.log('sharePath: ', sharePath)

const config: UserConfig = {
  base: './',
  plugins: [vue(), vueJsx()],
  assetsInclude: ['**/*.node'],
  optimizeDeps: {
    exclude: ['fsevents']
  },
  root: __dirname,
  resolve: {
    alias: {
      '@': renderPath,
      '@shared': sharePath
    }
  },
  css: {
    // css预处理器
    preprocessorOptions: {
      scss: {
        // 引入 var.scss 这样就可以在全局中使用 var.scss中预定义的变量了
        // 给导入的路径最后加上 ;
        additionalData: '@import "@/components/Theme/Variables.scss";'
      }
    }
  }
}

const serveConfig: UserConfig = {
  server: {
    port: 5000,
    open: true,
    hmr: true
  },
  ...config
}

const buildConfig: UserConfig = {
  build: {
    outDir: '../dist/web',
    assetsDir: 'static',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, './index.html')
      },
      output: {
        entryFileNames: 'static/js/[name].[hash].js',
        chunkFileNames: 'static/js/[name].[hash].js',
        assetFileNames: 'static/[ext]/[name].[hash].[ext]',
        manualChunks(id) {
          console.log('id: ', id)
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
          return undefined
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  ...serveConfig
}

export default defineConfig(buildConfig)
