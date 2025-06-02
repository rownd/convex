import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      outDir: 'dist',
    }),
  ],
  build: {
    sourcemap: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        react: resolve(__dirname, 'src/react/index.ts'),
      },
      // the proper extensions will be added
      fileName: 'rownd',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@rownd/react',
        'convex/react',
        'convex',
        'tslib'
      ],
      output: {
        // Preserve directory structure
        entryFileNames: '[name].js',
        preserveModulesRoot: 'src',
        preserveModules: true,
      },
    },
  },
});
