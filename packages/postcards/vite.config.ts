import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import inject from '@rollup/plugin-inject'
import path from 'path'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import rollupNodePolyFill from 'rollup-plugin-polyfill-node'

export default defineConfig({
	server: {
		port: 3000,
		host: '0.0.0.0',
		strictPort: true
	},
	plugins: [sveltekit()],
	optimizeDeps: {
		esbuildOptions: {
			define: {
				global: 'globalThis'
			},
			plugins: [
				NodeGlobalsPolyfillPlugin({
					process: true,
					buffer: true
				}),
				NodeModulesPolyfillPlugin()
			]
		}
	},
	build: {
		minify: 'esbuild',
		sourcemap: true,
		rollupOptions: {
			plugins: [
				rollupNodePolyFill(),
				inject({
					util: 'util',
					window: path.resolve('src/helpers/window.ts'),
					Buffer: ['buffer', 'Buffer'],
				})
			]
		}
	}
})