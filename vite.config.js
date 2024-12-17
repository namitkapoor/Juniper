import react from '@vitejs/plugin-react'
import { transformWithEsbuild } from 'vite'
import restart from 'vite-plugin-restart'

export default({
    root: 'src/', // This should point to where index.html is
    publicDir: '../public/',
    plugins: [
        // React support with Fast Refresh enabled
        react({
            fastRefresh: true
        }),

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
    ],
    server: {
        host: true,
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env),
        hmr: {
            overlay: true,
            timeout: 2000
        },
        watch: {
            usePolling: true,
            interval: 100
        }
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
            input: {
                main: '/index.html'  // This should be relative to the root
            }
        }
    },
    base: '/'
})