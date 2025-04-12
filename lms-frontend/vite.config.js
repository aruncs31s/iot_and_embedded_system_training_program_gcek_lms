import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
    })
  ],
  optimizeDeps: {
    include: ['bootstrap', 'react', 'react-dom'],
    exclude: ['lightningcss']
  },
  build: {
    commonjsOptions: {
      include: [/bootstrap/, /node_modules/],
    },
  },
  esbuild: {
    loader: "tsx",
    include: /src\/.*\.[tj]sx?$/,
    exclude: [],
  },
});
