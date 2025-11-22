import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import { config } from 'dotenv';
import postcssUrl from 'postcss-url';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import alias from '@rollup/plugin-alias';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load environment variables from .env
const envConfig = config({ path: './.env.production' }).parsed;

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
    {
      file: 'build/bundle/chat-bundle.min.js',
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
    alias({
      entries: [
        {
          find: '@components',
          replacement: path.resolve(__dirname, 'src/components'),
        },
        {
          find: '@contexts',
          replacement: path.resolve(__dirname, 'src/contexts'),
        },
        { find: '@pages', replacement: path.resolve(__dirname, 'src/pages') },
        { find: '@utils', replacement: path.resolve(__dirname, 'src/utils') },
      ],
    }),
    replace({
      preventAssignment: true,
      values: replaceValues,
    }),
    commonjs({
      include: /node_modules/,
      ignoreGlobal: true,
      esmExternals: true,
    }),
    babel({
      babelHelpers: 'bundled',
      presets: [['@babel/preset-react', { runtime: 'automatic' }]],
    }),
    postcss({
      inject: true, // injects CSS into JS bundle
      minimize: true,
      sourceMap: true,
      plugins: [
        tailwindcss({
          config: './tailwind.widget.config.js',
        }),
        autoprefixer(),
        postcssUrl({ url: 'inline' }),
      ],
    }),
    terser(),
  ],
};
