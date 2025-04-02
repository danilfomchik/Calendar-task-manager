import react from '@vitejs/plugin-react';
import {resolve} from 'path';
import {defineConfig} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src/'),
        },
    },
    plugins: [tsconfigPaths(), react()],
});
