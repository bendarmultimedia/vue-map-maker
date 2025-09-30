import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [
        vue(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },
    build: {
        outDir: 'public/client',
        emptyOutDir: true,
        rollupOptions: {
            // input: {
            //     style: resolve(__dirname, 'src/js/style.js')
            // },
            output: {
                entryFileNames: '[name].js',
                assetFileNames: 'style.css',
            }
        }
    },
    server: {
        port: 5173,
        proxy: {
            '/api': 'http://localhost:8000'
        }
        
    },
    css: {
        postcss: './postcss.config.cjs'
    }
})
