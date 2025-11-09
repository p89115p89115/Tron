import { build } from 'vite';
import { resolve } from 'node:path';
import { promises as fs } from 'node:fs';

const distDir = resolve('dist');

await build({ mode: 'production' });

const indexPath = resolve(distDir, 'index.html');
const errorPath = resolve(distDir, 'error.html');

try {
  await fs.copyFile(indexPath, errorPath);
} catch (error) {
  if (error.code === 'ENOENT') {
    throw new Error('Vite build did not produce dist/index.html; cannot prepare S3 bundle.');
  }
  throw error;
}

const noJekyllPath = resolve(distDir, '.nojekyll');
await fs.writeFile(noJekyllPath, 'Generated for static hosting on S3.\n');

console.log('S3 bundle ready in dist/. Upload contents to your bucket.');
