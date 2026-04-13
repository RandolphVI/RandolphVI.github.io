import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://randolph.pro',
  integrations: [tailwind()],
  markdown: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: 'github-light',
    },
  },
  vite: {
    build: {
      rollupOptions: {
        external: ['/pagefind/pagefind.js'],
      },
    },
    optimizeDeps: {
      exclude: ['pagefind'],
    },
    ssr: {
      noExternal: [],
    },
  },
});
