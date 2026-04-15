import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    hmr: false,          // exigido pelo AI Studio
    host: '0.0.0.0',    // necessario para preview no AI Studio
  },
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {},
  },
});
