import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import { config } from 'dotenv';
import postcssUrl from 'postcss-url';

// Load environment variables from .env
const envConfig = config({path: './.env.production'}).parsed;

// Transform env variables for the replace plugin
const replaceValues = {};
for (const [key, value] of Object.entries(envConfig)) {
  replaceValues[`process.env.${key}`] = JSON.stringify(value); // Stringify values for proper replacement
}

replaceValues['process.env.NODE_ENV'] = JSON.stringify('development');


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
    json(),
    resolve({
      extensions: ['.js', '.jsx'],
      browser: true,
      preferBuiltins: false,
    }),
    replace({
      preventAssignment: true, // Recommended for security
      values: replaceValues,
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
    postcss({
      inject: true,
      minimize: true,
      sourceMap: true,
      plugins: [
        postcssUrl({ url: 'inline' }) 
      ]
    }),
    terser(),
  ],
};
