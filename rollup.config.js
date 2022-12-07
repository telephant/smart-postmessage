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
];
