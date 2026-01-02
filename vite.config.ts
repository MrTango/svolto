import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		host: '0.0.0.0',
		proxy: {
			'/Plone': {
				target: 'http://backend:8080',
				changeOrigin: true
			},
			// Proxy @@images and @@download requests to Plone backend
			// These paths have /Plone stripped in frontend URLs but backend needs it
			'^/.*@@images': {
				target: 'http://backend:8080',
				changeOrigin: true,
				rewrite: (path) => `/Plone${path}`
			},
			'^/.*@@download': {
				target: 'http://backend:8080',
				changeOrigin: true,
				rewrite: (path) => `/Plone${path}`
			}
		},
		watch: {
			ignored: ['**/volto-svolto/**', '**/claude-code/**', '**/core.*', '**/.claude/**'],
			followSymlinks: false
		}
	},
	test: {
		workspace: [
			{
				extends: './vite.config.ts',
				plugins: [svelteTesting()],
				test: {
					name: 'client',
					environment: 'jsdom',
					clearMocks: true,
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
