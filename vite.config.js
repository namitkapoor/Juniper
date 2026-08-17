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
                // Manual chunking for better code splitting.
                //
                // Only list packages that are actually in the module graph — a
                // name here that nothing imports just produces an empty chunk,
                // which is what the old 'ui-vendor': ['antd'] entry was doing.
                //
                // framer-motion is imported by nearly every component, so
                // motion-vendor really is part of the critical path. lottie is
                // not: it is lazily imported on Home and otherwise only used by
                // case-study routes, so it gets its own chunk rather than riding
                // along inside the preloaded animation bundle. three/fiber are
                // reached only through the lazy About route.
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'three-vendor': ['three', '@react-three/fiber'],
                    'motion-vendor': ['framer-motion'],
                    'lottie-vendor': ['lottie-react', 'lottie-web'],
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
    // Must be '/', not './'. This is an SPA: vercel.json rewrites every unknown
    // path to /index.html while the browser keeps the deep URL, so relative asset
    // URLs resolve against the route rather than the site root — /case-study/x
    // asked for /case-study/assets/index-*.js, which the catch-all answered with
    // index.html, so the module script died on a MIME mismatch and the page came
    // up blank on any direct link or refresh. './' was a leftover from the
    // GitHub Pages deploy (project pages are served from a subpath); that deploy
    // path is gone, so absolute URLs are correct now.
    base: '/',
    assetsInclude: ['**/*.glb'],
    optimizeDeps: {
        exclude: ['react-icons/io5']
    }
})