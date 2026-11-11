import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  // GitHub Pages serves the site at shaunfox.com/hito/. Dev stays at the root.
  base: command === 'build' ? '/hito/' : '/',
  plugins: [react()],
  resolve: {
    alias: { '@styled-system': '/src/styled-system' },
  },
}));
