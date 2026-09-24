// @ts-check
import { defineConfig } from 'astro/config';

// Custom domain: layer.caipex.site → base '/'.
// To preview a build as if hosted under https://USER.github.io/REPO/,
// run: SITE_BASE=/REPO/ npm run build
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://layer.caipex.site',
  base: process.env.SITE_BASE ?? '/',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
});
