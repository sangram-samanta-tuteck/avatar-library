// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';

export default defineConfig({
    plugins: [react()],
    // Add this line to tell Vite to treat .riv files as assets
    assetsInclude: ['**/*.riv'],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/lib/index.jsx'),
            name: 'AvatarTTS',
            fileName: (format) => `avatar-tts.${format}.js`,
        },
        rollupOptions: {
            external: ['react', 'react-dom', '@rive-app/react-canvas'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    '@rive-app/react-canvas': 'RiveCanvas',
                },
            },
        },
    }
});