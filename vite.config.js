import react from '@vitejs/plugin-react'
import { transformWithEsbuild } from 'vite'
import restart from 'vite-plugin-restart'
import { resolve } from 'path'
import glsl from 'vite-plugin-glsl'

export default({
    root: 'src/',
    publicDir: '../public/',
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
        sourcemap: true,
        rollupOptions: {
            input: resolve(__dirname, 'src/index.html')
        },
        chunkSizeWarningLimit: 1600,
    },
    base: './',
    assetsInclude: ['**/*.glb']
})