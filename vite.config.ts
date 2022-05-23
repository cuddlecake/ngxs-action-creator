import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'NgxsActionCreator',
      fileName: (format) => `ngxs-action-creator.${format}.js`,
    },
    rollupOptions: {
      external: ['@ngxs/store'],
    },
  },
  test: {
    globals: true,
  },
});
