import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import dotenv from 'rollup-plugin-dotenv';
import replace from '@rollup/plugin-replace';

export default {
  input: 'src/widget/chatbox/chat-mounter.js',
  output: [
    {
      file: 'public/bundle/chat-bundle.min.js',
      format: 'iife',
      name: 'version',
      plugins: [terser()],
    },
  ],
  plugins: [
    dotenv(),
    json(),
    resolve({
      extensions: ['.js', '.jsx'],
      browser: true,
      preferBuiltins: false,
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env': JSON.stringify({}), // fallback for any other usage
    }),
    commonjs({
      include: /node_modules/, // only process true CJS modules
      ignoreGlobal: true,
      esmExternals: true, // skip ESM modules
    }),
    babel({
      babelHelpers: 'bundled',
      presets: [
        ['@babel/preset-react', { runtime: 'automatic' }], // 👈 use automatic runtime
      ],
    }),
    terser(), // minify
  ],
};
