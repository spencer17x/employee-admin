import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import * as path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	console.log('mode:', mode);
	return {
		plugins: [react()],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src')
			}
		}
	};
});
