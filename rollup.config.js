import resolve from '@rollup/plugin-node-resolve';
import rollupTypescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/index.js',
      format: 'cjs',
      exports: 'auto',
    },
    plugins: [
      resolve(),
      rollupTypescript(),
    ]
  },
  {
    input: 'src/example.ts',
    output: {
      file: 'lib/example.js',
      format: 'cjs',
      exports: 'auto',
    },
    plugins: [
      resolve(),
      rollupTypescript(),
    ]
  },
  {
    input: 'src/iframe.ts',
    output: {
      file: 'lib/iframe.js',
      format: 'cjs',
      exports: 'auto',
    },
    plugins: [
      resolve(),
      rollupTypescript(),
    ]
  }
];
