#!/usr/bin/env node
/*
  Prefix Tailwind CSS utilities with `khan-` in:
  - class/className attributes within .js/.jsx/.ts/.tsx/.html
  - @apply directives within .css files

  This codemod is conservative: it only touches class attribute values,
  template literal segments without expressions, and @apply value lists.
*/
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();
const PREFIX = 'khan-';

const TEXT_FILE_EXTENSIONS = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.html',
  '.css',
]);

function walkDirectory(dirPath, onFile) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (
      entry.name === 'node_modules' ||
      entry.name === '.git' ||
      entry.name === 'dist' ||
      entry.name === 'build'
    )
      continue;
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkDirectory(fullPath, onFile);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (TEXT_FILE_EXTENSIONS.has(ext)) onFile(fullPath);
    }
  }
}

function shouldPrefixToken(token) {
  if (!token) return false;
  // Don't touch already prefixed utilities
  if (token.startsWith(PREFIX)) return false;
  // Tokens may contain variants like md:hover:text-white
  const parts = token.split(':');
  const base = parts[parts.length - 1];
  if (!base) return false;
  if (base.startsWith(PREFIX)) return false;
  // Heuristic: Tailwind utilities almost always contain '-' or brackets or are known singletons (e.g., flex, grid, block, hidden)
  const singletonUtilities = new Set([
    // display/layout
    'flex',
    'grid',
    'block',
    'inline',
    'inline-block',
    'table',
    'hidden',
    'sr-only',
    'container',
    'contents',
    'flow-root',
    'list-item',
    'inline-flex',
    'inline-grid',
    // position
    'static',
    'fixed',
    'absolute',
    'relative',
    'sticky',
    // text case
    'uppercase',
    'lowercase',
    'capitalize',
    'normal-case',
    // borders
    'border',
    // rendering
    'subpixel-antialiased',
    'antialiased',
    // font style
    'italic',
    'not-italic',
  ]);
  const looksLikeUtility =
    base.includes('-') || base.includes('[') || singletonUtilities.has(base);
  return looksLikeUtility;
}

function prefixToken(token) {
  const parts = token.split(':');
  const base = parts.pop();
  if (!base) return token;
  if (base.startsWith(PREFIX)) return token;
  return (parts.length ? parts.join(':') + ':' : '') + PREFIX + base;
}

function transformClassList(value) {
  // Split on whitespace keeping it simple; ignore sequences
  return value
    .split(/\s+/)
    .map((tok) => (shouldPrefixToken(tok) ? prefixToken(tok) : tok))
    .join(' ')
    .trim();
}

function transformClassAttributeContent(content) {
  // Double-quoted and single-quoted class values
  content = content.replace(
    /\b(class|className)\s*=\s*"([^"]*)"/g,
    (m, attr, val) => {
      return `${attr}="${transformClassList(val)}"`;
    }
  );
  content = content.replace(
    /\b(class|className)\s*=\s*'([^']*)'/g,
    (m, attr, val) => {
      return `${attr}='${transformClassList(val)}'`;
    }
  );
  // Template literal without expressions or with expressions preserved:
  // className={`foo ${bar} baz`} -> only transform plain segments
  content = content.replace(
    /\b(class|className)\s*=\s*\{`([\s\S]*?)`\}/g,
    (m, attr, tpl) => {
      const parts = tpl.split(/(\$\{[\s\S]*?\})/g);
      const transformed = parts
        .map((segment) =>
          segment.startsWith('${') ? segment : transformClassList(segment)
        )
        .join('');
      return `${attr}={` + '`' + transformed + '`' + `}`;
    }
  );
  return content;
}

function transformCssApply(content) {
  return content.replace(/@apply\s+([^;]+);/g, (m, classList) => {
    const transformed = transformClassList(classList);
    return `@apply ${transformed};`;
  });
}

function processFile(filePath) {
  const ext = path.extname(filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  if (ext === '.css') {
    content = transformCssApply(content);
  } else if (
    ext === '.js' ||
    ext === '.jsx' ||
    ext === '.ts' ||
    ext === '.tsx' ||
    ext === '.html'
  ) {
    content = transformClassAttributeContent(content);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', path.relative(PROJECT_ROOT, filePath));
  }
}

function main() {
  const targetRoots = [
    path.join(PROJECT_ROOT, 'src'),
    path.join(PROJECT_ROOT, 'public'),
  ];
  for (const root of targetRoots) {
    if (fs.existsSync(root)) {
      walkDirectory(root, processFile);
    }
  }
}

if (require.main === module) {
  main();
}
