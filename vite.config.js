import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist',
		lib: {
			entry: 'src/index.ts',
			name: 'taskBot',
			formats: ['iife'],
			fileName: 'taskBot',
		},
	},
	publicDir: false,
});
