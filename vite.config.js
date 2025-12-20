import react from '@vitejs/plugin-react'
import { transformWithEsbuild } from 'vite'
import restart from 'vite-plugin-restart'
import { resolve } from 'path'
import glsl from 'vite-plugin-glsl'
import { defineConfig } from 'vite'

export default defineConfig({
    root: 'src/',
    publicDir: '../public/',
    envDir: '../', // Look for .env files in project root
    plugins: [
        // React support
        react(),

        // Restart server on static/public file change
        restart({ restart: [ '../public/**' ] }),

        // .js file support as if it was JSX
        {
            name: 'load+transform-js-files-as-jsx',
            async transform(code, id) {
                if (!id.match(/src\/.*\.js$/))
                    return null

                return transformWithEsbuild(code, id, {
                    loader: 'jsx',
                    jsx: 'automatic',
                });
            },
        },
        glsl()
    ],
    server: {
        host: true,
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env)
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: false, // Disable sourcemaps in production for smaller builds
        rollupOptions: {
            input: resolve(__dirname, 'src/index.html'),
            output: {
                // Manual chunking for better code splitting
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
                    'animation-vendor': ['framer-motion', 'lottie-react'],
                    'ui-vendor': ['antd'],
                }
            }
        },
        chunkSizeWarningLimit: 1000, // Lower warning threshold
        minify: 'terser', // Use terser for better minification
        terserOptions: {
            compress: {
                drop_console: true, // Remove console.logs in production
                drop_debugger: true,
            }
        }
    },
    base: './',
    assetsInclude: ['**/*.glb'],
    optimizeDeps: {
        exclude: ['react-icons/io5']
    }
})