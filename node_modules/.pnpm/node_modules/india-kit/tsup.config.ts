import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    dts: true,
    format: ['cjs', 'esm'],
    sourcemap: true,
    clean: true,
    noExternal: ['@india-kit/core'],
    splitting: false,
    outDir: 'dist',
  },
  {
    entry: ['src/bin.ts'],
    format: ['cjs'],
    sourcemap: false,
    noExternal: ['@india-kit/core'],
    splitting: false,
    outDir: 'dist',
    banner: { js: '#!/usr/bin/env node' },
  },
]);
