import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkCjkFriendly from 'remark-cjk-friendly';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://randolphvi.github.io',
  integrations: [tailwind()],
  markdown: {
    remarkPlugins: [remarkGfm, remarkMath, remarkCjkFriendly],
    rehypePlugins: [[rehypeKatex, { strict: false }]],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      // Map the uppercase fence tags used in our articles to Shiki's lowercase
      // grammar ids so they highlight instead of falling back to plaintext.
      langAlias: {
        C: 'c',
        'C++': 'cpp',
        R: 'r',
        SQL: 'sql',
      },
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
