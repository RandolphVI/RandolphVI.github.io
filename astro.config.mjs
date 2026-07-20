import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkCjkFriendly from 'remark-cjk-friendly';
import rehypeKatex from 'rehype-katex';

// 段首为引号/括号的段落打 no-dropcap 类：::first-letter 会把前置标点连同首字一起放大，
// 这类段落（多为对白开篇）不做首字下沉。
const DROPCAP_OPENERS = '「『《〈“‘（【';
function rehypeNoDropcap() {
  const firstText = (node) => {
    if (node.type === 'text') return node.value.trim() || null;
    for (const c of node.children || []) {
      const t = firstText(c);
      if (t) return t;
    }
    return null;
  };
  const visit = (node) => {
    if (node.type === 'element' && node.tagName === 'p') {
      const t = firstText(node);
      if (t && DROPCAP_OPENERS.includes(t[0])) {
        node.properties = node.properties || {};
        const cls = node.properties.className;
        node.properties.className = Array.isArray(cls) ? [...cls, 'no-dropcap'] : cls ? [cls, 'no-dropcap'] : ['no-dropcap'];
      }
    }
    for (const c of node.children || []) visit(c);
  };
  return (tree) => visit(tree);
}

export default defineConfig({
  site: 'https://randolphvi.github.io',
  integrations: [tailwind()],
  markdown: {
    remarkPlugins: [remarkGfm, remarkMath, remarkCjkFriendly],
    rehypePlugins: [[rehypeKatex, { strict: false }], rehypeNoDropcap],
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
