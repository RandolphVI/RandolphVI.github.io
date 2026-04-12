# Blog Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild randolph.pro from legacy Hexo output into a modern Astro-based static blog with "Paper East Wind" design identity.

**Architecture:** Astro SSG with Content Collections for Markdown management, Tailwind CSS for layout utilities plus custom CSS for Eastern typography effects. Interactive features (TOC, sidenotes, reading progress, animations) are vanilla JS island components. Pagefind for client-side search. GitHub Actions for CI/CD to GitHub Pages.

**Tech Stack:** Astro 4.x, Tailwind CSS 3.x, Pagefind, @astrojs/rss, Vitest (utility tests), GitHub Actions

**Spec:** `docs/superpowers/specs/2026-04-12-blog-rebuild-design.md`

---

## File Structure

```
/
├── astro.config.mjs              # Astro config: site URL, integrations, markdown plugins
├── tailwind.config.mjs            # Tailwind: custom colors, fonts, breakpoints
├── tsconfig.json                  # TypeScript config (Astro default)
├── package.json
├── vitest.config.ts               # Vitest config for utility tests
├── public/
│   ├── CNAME                      # GitHub Pages custom domain
│   ├── favicon.ico                # Existing favicon
│   └── fonts/
│       ├── JingHuaOldSong.woff2   # User must provide (or use fallback)
│       ├── josefin-sans-*.woff2   # Self-hosted Josefin Sans
│       └── jetbrains-mono-*.woff2 # Self-hosted JetBrains Mono
├── src/
│   ├── content/
│   │   ├── config.ts              # Content collection schemas (posts, tech, reading)
│   │   ├── posts/                 # Literary articles (homepage)
│   │   │   └── kun-chong-bai.md   # Sample post
│   │   ├── tech/                  # Tech articles
│   │   │   └── astro-rebuild.md   # Sample tech post
│   │   ├── reading/               # Book reviews
│   │   │   └── hundred-years-of-solitude.md
│   │   └── legacy/                # Reserved for old article migration
│   ├── layouts/
│   │   ├── BaseLayout.astro       # HTML shell: head, theme script, nav, footer
│   │   ├── ArticleLayout.astro    # Three-column article layout: TOC + content + sidenotes
│   │   └── PageLayout.astro       # Simple centered page layout (about, categories, etc.)
│   ├── components/
│   │   ├── Navbar.astro           # Top navigation bar
│   │   ├── Footer.astro           # Site footer
│   │   ├── ThemeToggle.astro      # Dark/light mode toggle (island component)
│   │   ├── ReadingProgress.astro  # Reading progress bar (island component)
│   │   ├── TableOfContents.astro  # Floating TOC with active heading tracking
│   │   ├── Sidenotes.astro        # Sidenote positioning system
│   │   ├── SearchModal.astro      # Pagefind search dialog
│   │   ├── ArticleCard.astro      # Reusable article list item
│   │   ├── BookCard.astro         # Book review card
│   │   └── EndMark.astro          # "完" diamond end mark
│   ├── pages/
│   │   ├── index.astro            # Homepage (magazine cover)
│   │   ├── posts/
│   │   │   └── [...slug].astro    # Individual literary article
│   │   ├── tech/
│   │   │   ├── index.astro        # Tech listing page
│   │   │   └── [...slug].astro    # Individual tech article
│   │   ├── reading/
│   │   │   └── index.astro        # Reading list
│   │   ├── categories/
│   │   │   ├── index.astro        # Categories grid
│   │   │   └── [category].astro   # Articles filtered by category
│   │   ├── archives/
│   │   │   └── index.astro        # Archives timeline
│   │   ├── about/
│   │   │   └── index.astro        # About page
│   │   └── rss.xml.ts             # RSS feed
│   ├── styles/
│   │   ├── global.css             # Tailwind directives, CSS variables, font-face, base styles
│   │   └── article.css            # Article-specific: drop cap, blockquote, sidenotes, end mark
│   └── utils/
│       ├── reading-time.ts        # Calculate reading time from text
│       ├── season.ts              # Get Chinese season name from date
│       └── collections.ts         # Helper to query/sort content collections
├── tests/
│   ├── reading-time.test.ts
│   └── season.test.ts
└── .github/
    └── workflows/
        └── deploy.yml             # GitHub Actions: build Astro + deploy to Pages
```

---

### Task 1: Repository Cleanup & Astro Project Initialization

**Files:**
- Remove: all old Hexo files (index.html, atom.xml, css/, js/, lib/, images/, archives/, categories/, tags/, page/, about/, 2015-2019/, etc.)
- Keep: `.git/`, `.gitignore`, `docs/`, `CNAME`, `favicon.ico`
- Create: `package.json`, `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`, `src/pages/index.astro`

- [ ] **Step 1: Clean up old Hexo files**

Remove all old generated files. Keep `.git`, `.gitignore`, `docs/`, and assets we'll reuse (`CNAME`, `favicon.ico`).

```bash
cd C:/Users/Randolph/Documents/RandolphVI.github.io

# Save files to keep
cp CNAME /tmp/CNAME_backup
cp favicon.ico /tmp/favicon_backup

# Remove all old Hexo output
git rm -rf --ignore-unmatch 2015 2016 2017 2018 2019 about archives assets categories css images js lib page tags 2>/dev/null
rm -rf 2015 2016 2017 2018 2019 about archives assets categories css images js lib page tags
rm -f index.html atom.xml baidusitemap.xml robots.txt search.xml sitemap.xml README.md

# Restore keepers
cp /tmp/CNAME_backup CNAME
cp /tmp/favicon_backup favicon.ico
```

- [ ] **Step 2: Initialize Astro project**

```bash
cd C:/Users/Randolph/Documents/RandolphVI.github.io
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict
```

If prompted about overwriting, allow it. The `--no-git` flag prevents re-initializing git.

- [ ] **Step 3: Install dependencies**

```bash
npm install
npm install @astrojs/tailwind tailwindcss @astrojs/rss remark-gfm
npm install -D vitest @astrojs/check
```

- [ ] **Step 4: Configure Astro**

Write `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import remarkGfm from 'remark-gfm';

export default defineConfig({
  site: 'https://randolph.pro',
  integrations: [tailwind()],
  markdown: {
    remarkPlugins: [remarkGfm],
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
```

Note: `remark-gfm` is required for Markdown footnotes, which power the sidenotes feature.

- [ ] **Step 5: Configure Tailwind**

Write `tailwind.config.mjs`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#e8e0d0',
          300: '#d4c8b0',
          400: '#c4b5a0',
          500: '#b8a88a',
          600: '#a09080',
          700: '#888070',
        },
        ink: {
          50: '#f5f5f5',
          100: '#ececec',
          200: '#bbbbbb',
          300: '#aaaaaa',
          400: '#999999',
          500: '#777777',
          600: '#666666',
          700: '#555555',
          800: '#3a3a3a',
          900: '#1b1b1f',
        },
      },
      fontFamily: {
        serif: ['"京华老宋体"', '"Noto Serif SC"', '"Source Han Serif SC"', '"宋体"', 'serif'],
        sans: ['"Josefin Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 6: Configure Vitest**

Write `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
```

- [ ] **Step 7: Update .gitignore**

Replace `.gitignore` contents:

```
node_modules/
dist/
.superpowers/
.astro/
.DS_Store
```

- [ ] **Step 8: Move CNAME and favicon into public/**

```bash
mkdir -p public
mv CNAME public/CNAME
mv favicon.ico public/favicon.ico
```

- [ ] **Step 9: Create minimal index page and verify build**

Write `src/pages/index.astro`:

```astro
---
---
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>黃某人</title>
  </head>
  <body>
    <h1>黃某人</h1>
    <p>站点重建中…</p>
  </body>
</html>
```

Run:

```bash
npx astro build
```

Expected: Build succeeds, output in `dist/` with `index.html` and `CNAME`.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: replace Hexo output with Astro project scaffold

Remove all legacy Hexo-generated files. Initialize Astro with
Tailwind CSS, Vitest, and basic config. Site rebuilds successfully."
```

---

### Task 2: Design System — CSS Variables, Fonts & Theme Toggle

**Files:**
- Create: `src/styles/global.css`
- Create: `src/components/ThemeToggle.astro`
- Create: `public/fonts/` (font files — user provides Chinese font, download others)

- [ ] **Step 1: Set up font files**

```bash
mkdir -p public/fonts
```

For Josefin Sans and JetBrains Mono, download from Google Fonts or use a CDN link. For now, we'll use Google Fonts links in CSS and self-host later if needed.

For 京华老宋体: the user must provide `JingHuaOldSong.woff2` in `public/fonts/`. If not available yet, the fallback font stack will be used.

- [ ] **Step 2: Create global.css with design tokens**

Write `src/styles/global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* === Font Face === */
@font-face {
  font-family: '京华老宋体';
  src: url('/fonts/JingHuaOldSong.woff2') format('woff2');
  font-display: swap;
}

@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600&family=JetBrains+Mono:wght@400;500&display=swap');

/* === CSS Custom Properties === */
:root {
  /* Light mode (Paper East Wind) */
  --color-bg: #f5f0e8;
  --color-bg-secondary: #ede6d8;
  --color-text: #555555;
  --color-heading: #3a3a3a;
  --color-accent: #c4b5a0;
  --color-accent-dark: #b8a88a;
  --color-muted: #999999;
  --color-faint: #bbbbbb;
  --color-border: #e0d8c8;
  --color-border-light: #e8e0d0;
  --color-border-dark: #d4c8b0;
  --color-surface: rgba(196, 181, 160, 0.06);
}

:root.dark {
  /* Dark mode (Pure Clean Dark) */
  --color-bg: #1b1b1f;
  --color-bg-secondary: #222228;
  --color-text: #aaaaaa;
  --color-heading: #ececec;
  --color-accent: #888070;
  --color-accent-dark: #6b6560;
  --color-muted: #777777;
  --color-faint: #666666;
  --color-border: #333333;
  --color-border-light: #2a2a2e;
  --color-border-dark: #444444;
  --color-surface: rgba(255, 255, 255, 0.03);
}

/* === Base Styles === */
@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: '京华老宋体', 'Noto Serif SC', 'Source Han Serif SC', '宋体', serif;
    background-color: var(--color-bg);
    color: var(--color-text);
    line-height: 1.8;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  h1, h2, h3, h4, h5, h6 {
    color: var(--color-heading);
    font-weight: 400;
  }

  a {
    color: var(--color-heading);
    text-decoration: none;
    border-bottom: 1px solid var(--color-border);
    transition: border-color 0.2s;
  }

  a:hover {
    border-color: var(--color-accent);
  }

  ::selection {
    background-color: var(--color-accent);
    color: var(--color-bg);
  }
}
```

- [ ] **Step 3: Create ThemeToggle component**

Write `src/components/ThemeToggle.astro`:

```astro
---
---
<button
  id="theme-toggle"
  class="text-[var(--color-muted)] hover:text-[var(--color-heading)] transition-colors text-lg leading-none cursor-pointer"
  aria-label="Toggle dark mode"
  title="切换明暗主题"
>
  ◐
</button>

<script>
  function getThemePreference(): 'dark' | 'light' {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme: 'dark' | 'light') {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }

  // Apply immediately to prevent flash
  applyTheme(getThemePreference());

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
</script>
```

- [ ] **Step 4: Add inline theme script to prevent FOUC**

This script will be placed in the `<head>` of BaseLayout (Task 3). For now, note the pattern:

```html
<script is:inline>
  (function() {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  })();
</script>
```

- [ ] **Step 5: Verify theme system works**

Update `src/pages/index.astro` temporarily to import the CSS and test:

```astro
---
import '../styles/global.css';
import ThemeToggle from '../components/ThemeToggle.astro';
---
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>黃某人</title>
    <script is:inline>
      (function() {
        const stored = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (stored === 'dark' || (!stored && prefersDark)) {
          document.documentElement.classList.add('dark');
        }
      })();
    </script>
  </head>
  <body class="min-h-screen">
    <div class="max-w-md mx-auto py-20 text-center">
      <h1 class="text-2xl tracking-widest mb-4">黃某人</h1>
      <p class="text-[var(--color-muted)]">站点重建中…</p>
      <div class="mt-8"><ThemeToggle /></div>
    </div>
  </body>
</html>
```

Run:

```bash
npx astro dev
```

Expected: Page renders with paper-white background, click ◐ toggles to dark mode.

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css src/components/ThemeToggle.astro src/pages/index.astro public/fonts/
git commit -m "feat: add design system with CSS tokens, fonts, and theme toggle

Light mode uses paper-warm palette with Eastern accents.
Dark mode is clean neutral gray. Theme persists in localStorage."
```

---

### Task 3: Base Layout — Navigation & Footer

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/layouts/PageLayout.astro`
- Create: `src/components/Navbar.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create Navbar component**

Write `src/components/Navbar.astro`:

```astro
---
import ThemeToggle from './ThemeToggle.astro';

interface Props {
  currentPath?: string;
}

const { currentPath = '' } = Astro.props;

const navItems = [
  { label: '首页', href: '/' },
  { label: '技术', href: '/tech/' },
  { label: '阅读', href: '/reading/' },
  { label: '分类', href: '/categories/' },
  { label: '归档', href: '/archives/' },
  { label: '关于', href: '/about/' },
];
---

<header class="border-b border-[var(--color-border)]">
  <nav class="max-w-6xl mx-auto flex items-center justify-between px-6 py-4 lg:px-10">
    <!-- Logo -->
    <a href="/" class="flex items-baseline gap-2 border-none">
      <span class="font-serif text-lg text-[var(--color-heading)] tracking-widest">黃某人</span>
      <span class="font-sans text-[10px] text-[var(--color-accent-dark)] tracking-[3px] hidden sm:inline">RANDOLPH.PRO</span>
    </a>

    <!-- Desktop Nav -->
    <div class="hidden md:flex items-center gap-6">
      {navItems.map((item) => (
        <a
          href={item.href}
          class:list={[
            'font-sans text-[11px] tracking-[2px] border-none transition-colors',
            currentPath === item.href
              ? 'text-[var(--color-heading)] border-b border-[var(--color-heading)] pb-0.5'
              : 'text-[var(--color-muted)] hover:text-[var(--color-heading)]',
          ]}
        >
          {item.label}
        </a>
      ))}
      <button
        id="search-trigger"
        class="text-[var(--color-muted)] hover:text-[var(--color-heading)] transition-colors cursor-pointer"
        aria-label="搜索"
      >
        🔍
      </button>
      <ThemeToggle />
    </div>

    <!-- Mobile Hamburger -->
    <button
      id="mobile-menu-btn"
      class="md:hidden text-[var(--color-muted)] text-xl cursor-pointer"
      aria-label="菜单"
    >
      ☰
    </button>
  </nav>

  <!-- Mobile Menu -->
  <div id="mobile-menu" class="hidden md:hidden border-t border-[var(--color-border)] px-6 py-4">
    <div class="flex flex-col gap-3">
      {navItems.map((item) => (
        <a
          href={item.href}
          class:list={[
            'font-sans text-sm tracking-wider border-none',
            currentPath === item.href
              ? 'text-[var(--color-heading)]'
              : 'text-[var(--color-muted)]',
          ]}
        >
          {item.label}
        </a>
      ))}
      <div class="flex items-center gap-4 pt-2 border-t border-[var(--color-border-light)]">
        <button id="search-trigger-mobile" class="text-[var(--color-muted)] text-sm cursor-pointer">🔍 搜索</button>
        <ThemeToggle />
      </div>
    </div>
  </div>
</header>

<script>
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  btn?.addEventListener('click', () => {
    menu?.classList.toggle('hidden');
  });
</script>
```

- [ ] **Step 2: Create Footer component**

Write `src/components/Footer.astro`:

```astro
---
const year = new Date().getFullYear();
---

<footer class="border-t border-[var(--color-border)] mt-20">
  <div class="max-w-6xl mx-auto px-6 lg:px-10 py-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-[var(--color-faint)] font-sans tracking-wider">
    <span>© {year} 黃某人</span>
    <div class="flex gap-4">
      <a href="/rss.xml" class="hover:text-[var(--color-muted)] border-none">RSS</a>
      <a href="https://github.com/RandolphVI" class="hover:text-[var(--color-muted)] border-none" target="_blank" rel="noopener">GitHub</a>
    </div>
  </div>
</footer>
```

- [ ] **Step 3: Create BaseLayout**

Write `src/layouts/BaseLayout.astro`:

```astro
---
import Navbar from '../components/Navbar.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = '黃某人的个人博客' } = Astro.props;
const currentPath = Astro.url.pathname;
---

<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="alternate" type="application/rss+xml" title="黃某人" href="/rss.xml" />
    <title>{title} | 黃某人</title>
    <script is:inline>
      (function() {
        var s = localStorage.getItem('theme');
        var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (s === 'dark' || (!s && d)) document.documentElement.classList.add('dark');
      })();
    </script>
  </head>
  <body class="min-h-screen flex flex-col">
    <Navbar currentPath={currentPath} />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 4: Create PageLayout (for simple pages)**

Write `src/layouts/PageLayout.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';

interface Props {
  title: string;
  subtitle?: string;
  englishTitle?: string;
  description?: string;
}

const { title, subtitle, englishTitle, description } = Astro.props;
---

<BaseLayout title={title} description={description}>
  <div class="max-w-2xl mx-auto px-6 lg:px-10 py-16">
    <div class="text-center mb-12">
      {englishTitle && (
        <div class="font-sans text-[10px] tracking-[4px] text-[var(--color-accent-dark)] mb-3">
          {englishTitle}
        </div>
      )}
      <h1 class="text-2xl tracking-[3px]">{title}</h1>
      <div class="w-8 h-px bg-[var(--color-accent)] mx-auto mt-4"></div>
      {subtitle && (
        <p class="text-[var(--color-muted)] text-sm mt-4">{subtitle}</p>
      )}
    </div>
    <slot />
  </div>
</BaseLayout>
```

- [ ] **Step 5: Update index.astro to use BaseLayout**

Write `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="首页">
  <div class="max-w-md mx-auto py-20 text-center">
    <h1 class="text-2xl tracking-widest mb-4">黃某人</h1>
    <p class="text-[var(--color-muted)]">站点重建中…</p>
  </div>
</BaseLayout>
```

- [ ] **Step 6: Verify with dev server**

```bash
npx astro dev
```

Expected: Page renders with navbar (6 items + search + theme toggle), footer with © and links. Mobile hamburger menu works. Theme toggle works.

- [ ] **Step 7: Verify build**

```bash
npx astro build
```

Expected: Build succeeds.

- [ ] **Step 8: Commit**

```bash
git add src/layouts/ src/components/Navbar.astro src/components/Footer.astro src/pages/index.astro
git commit -m "feat: add base layout with navbar and footer

Shared layout includes responsive navbar (hamburger on mobile),
footer with copyright/RSS/GitHub, and theme-aware design tokens."
```

---

### Task 4: Utility Functions & Tests

**Files:**
- Create: `src/utils/reading-time.ts`
- Create: `src/utils/season.ts`
- Create: `src/utils/collections.ts`
- Create: `tests/reading-time.test.ts`
- Create: `tests/season.test.ts`

- [ ] **Step 1: Write failing test for reading time**

Write `tests/reading-time.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { getReadingTime } from '../src/utils/reading-time';

describe('getReadingTime', () => {
  it('returns 1 min for short Chinese text', () => {
    const text = '这是一段测试文字。'.repeat(50); // ~450 chars
    const result = getReadingTime(text);
    expect(result.minutes).toBe(1);
    expect(result.words).toBeGreaterThan(0);
  });

  it('returns correct time for longer text', () => {
    // ~300 chars/min for Chinese, 200 words/min for English
    const text = '这是一段较长的中文测试文字内容。'.repeat(200); // ~2800 chars
    const result = getReadingTime(text);
    expect(result.minutes).toBeGreaterThanOrEqual(5);
    expect(result.text).toMatch(/\d+ 分钟/);
  });

  it('handles mixed Chinese and English', () => {
    const text = 'Hello world. ' + '这是中文。'.repeat(100);
    const result = getReadingTime(text);
    expect(result.minutes).toBeGreaterThan(0);
  });

  it('returns 1 min minimum for empty text', () => {
    const result = getReadingTime('');
    expect(result.minutes).toBe(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/reading-time.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement reading-time**

Write `src/utils/reading-time.ts`:

```typescript
interface ReadingTimeResult {
  minutes: number;
  words: number;
  text: string;
}

export function getReadingTime(content: string): ReadingTimeResult {
  // Count Chinese characters (CJK Unified Ideographs)
  const chineseChars = (content.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
  // Count English words
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;

  // Reading speed: ~300 Chinese chars/min, ~200 English words/min
  const totalMinutes = chineseChars / 300 + englishWords / 200;
  const minutes = Math.max(1, Math.ceil(totalMinutes));
  const words = chineseChars + englishWords;

  return {
    minutes,
    words,
    text: `${minutes} 分钟`,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run tests/reading-time.test.ts
```

Expected: All 4 tests PASS.

- [ ] **Step 5: Write failing test for season utility**

Write `tests/season.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { getSeason, getVolumeLabel } from '../src/utils/season';

describe('getSeason', () => {
  it('returns 春 for March', () => {
    expect(getSeason(new Date('2026-03-15'))).toBe('春');
  });

  it('returns 夏 for July', () => {
    expect(getSeason(new Date('2026-07-01'))).toBe('夏');
  });

  it('returns 秋 for October', () => {
    expect(getSeason(new Date('2026-10-10'))).toBe('秋');
  });

  it('returns 冬 for January', () => {
    expect(getSeason(new Date('2026-01-15'))).toBe('冬');
  });
});

describe('getVolumeLabel', () => {
  it('formats volume label', () => {
    expect(getVolumeLabel(7, new Date('2026-03-15'))).toBe('VOL. 07 · 2026 春');
  });

  it('pads single digit volume', () => {
    expect(getVolumeLabel(3, new Date('2026-07-01'))).toBe('VOL. 03 · 2026 夏');
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

```bash
npx vitest run tests/season.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 7: Implement season utility**

Write `src/utils/season.ts`:

```typescript
export function getSeason(date: Date): string {
  const month = date.getMonth() + 1; // 1-12
  if (month >= 3 && month <= 5) return '春';
  if (month >= 6 && month <= 8) return '夏';
  if (month >= 9 && month <= 11) return '秋';
  return '冬';
}

export function getVolumeLabel(volume: number, date: Date): string {
  const padded = String(volume).padStart(2, '0');
  const year = date.getFullYear();
  const season = getSeason(date);
  return `VOL. ${padded} · ${year} ${season}`;
}
```

- [ ] **Step 8: Run test to verify it passes**

```bash
npx vitest run tests/season.test.ts
```

Expected: All 6 tests PASS.

- [ ] **Step 9: Create collections helper**

Write `src/utils/collections.ts`:

```typescript
import { getCollection, type CollectionEntry } from 'astro:content';

export async function getPublishedPosts(): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getFeaturedPost(): Promise<CollectionEntry<'posts'> | undefined> {
  const posts = await getPublishedPosts();
  return posts.find((p) => p.data.featured) || posts[0];
}

export async function getPublishedTech(): Promise<CollectionEntry<'tech'>[]> {
  const tech = await getCollection('tech', ({ data }) => !data.draft);
  return tech.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getReadingList(): Promise<CollectionEntry<'reading'>[]> {
  const reading = await getCollection('reading');
  return reading.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getAllArticles(): Promise<Array<{ slug: string; data: { title: string; date: Date; category: string; description: string }; collection: string }>> {
  const [posts, tech] = await Promise.all([getPublishedPosts(), getPublishedTech()]);
  const all = [
    ...posts.map((p) => ({ slug: p.slug, data: p.data, collection: 'posts' as const })),
    ...tech.map((t) => ({ slug: t.slug, data: t.data, collection: 'tech' as const })),
  ];
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
```

- [ ] **Step 10: Commit**

```bash
git add src/utils/ tests/
git commit -m "feat: add utility functions with tests

Reading time calculator (Chinese + English aware), season/volume
label formatter, and content collection query helpers."
```

---

### Task 5: Content Collections & Sample Content

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/posts/kun-chong-bai.md`
- Create: `src/content/tech/astro-rebuild.md`
- Create: `src/content/reading/hundred-years-of-solitude.md`

- [ ] **Step 1: Define content collection schemas**

Write `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    description: z.string(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const tech = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    description: z.string(),
    draft: z.boolean().default(false),
  }),
});

const reading = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.coerce.date(),
    rating: z.number().min(1).max(5),
    cover: z.string().optional(),
  }),
});

export const collections = { posts, tech, reading };
```

- [ ] **Step 2: Create sample literary post**

Write `src/content/posts/kun-chong-bai.md`:

```markdown
---
title: "昆虫白与舞茉莉"
date: 2026-03-15
category: "匯文"
tags: ["小说", "创作"]
description: "一个关于黄昏、梧桐和老城弄堂的短篇故事"
featured: true
draft: false
---

## 一

她总是在黄昏时分出现在阳台上，手里捧着一杯凉透了的茶。窗外的梧桐树在风中轻轻摇晃，叶片的影子落在她的裙摆上，像一群不安分的蝴蝶。

那是老城最安静的时刻。远处偶尔传来自行车铃铛的声音[^1]，和卖馄饨的吆喝声，像是另一个世界的回响。她从不回头看那些声音的来处，只是安静地搅动杯中早已冰凉的茶水。

> 蒹葭苍苍，白露为霜。所谓伊人，在水一方。
>
> ——《诗经·秦风》

## 二

梧桐是这条弄堂里最老的树。听隔壁的王阿婆说[^2]，这棵树比她的年纪还大，至少有七十年了。每到秋天，梧桐叶落满一地，踩上去沙沙作响，像是走在某个人的回忆里。

弄堂的尽头有一家裁缝铺，门口挂着褪色的招牌。裁缝是个沉默的老人，手指上满是针眼留下的疤痕。他做的旗袍在这片街区小有名气，但他从不主动招揽生意。

## 三

她是在一个下雨的午后走进裁缝铺的。那天的雨很大，弄堂里的石板路上积了浅浅的水洼。她没有带伞，头发和衣服都湿透了，站在门口滴着水，像一朵被雨打落的茉莉花。

[^1]: 自行车铃铛声在九十年代的中国城市中是标志性的声景，如今已几乎消失。

[^2]: 王阿婆是弄堂里的"活档案"，关于这条巷子的一切她都知道。
```

- [ ] **Step 3: Create sample tech post**

Write `src/content/tech/astro-rebuild.md`:

```markdown
---
title: "用 Astro 重建博客的经历"
date: 2026-04-12
category: "前端"
tags: ["Astro", "前端"]
description: "从 Hexo 到 Astro，以及那些踩过的坑"
draft: false
---

## 为什么离开 Hexo

用了好几年 Hexo，它是个好工具，但生态逐渐停滞了。Node.js 版本升级后各种插件开始出问题，主题的定制也越来越力不从心。

## 为什么选择 Astro

Astro 的 Content Collections 让 Markdown 管理变得类型安全，不再担心 frontmatter 写错字段。零 JS 的默认输出意味着页面加载飞快，只在需要交互的地方引入 JavaScript。

## 迁移过程

整个迁移大概花了一个周末。最有趣的部分是实现 sidenotes——把 Markdown 脚注变成侧边注释，这比想象中要复杂一些。
```

- [ ] **Step 4: Create sample reading entry**

Write `src/content/reading/hundred-years-of-solitude.md`:

```markdown
---
title: "百年孤独"
author: "加西亚·马尔克斯"
date: 2026-03-01
rating: 5
---

多年以后，面对行刑队，奥雷里亚诺·布恩迪亚上校将会回想起……那些被遗忘和重复的命运。马尔克斯用魔幻现实主义构建了一个家族七代人的孤独史诗，每一次重读都有新的发现。
```

- [ ] **Step 5: Create legacy directory placeholder**

```bash
mkdir -p src/content/legacy
```

Write `src/content/legacy/.gitkeep` (empty file).

- [ ] **Step 6: Verify build with content collections**

```bash
npx astro build
```

Expected: Build succeeds. Content collections are validated against schemas.

- [ ] **Step 7: Commit**

```bash
git add src/content/
git commit -m "feat: define content collections and add sample content

Three collections: posts (literary), tech, reading.
Zod schemas validate frontmatter. Sample content for each type."
```

---

### Task 6: Homepage — Magazine Cover

**Files:**
- Create: `src/components/ArticleCard.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create ArticleCard component**

Write `src/components/ArticleCard.astro`:

```astro
---
interface Props {
  title: string;
  date: Date;
  description: string;
  href: string;
}

const { title, date, description, href } = Astro.props;
const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
---

<a href={href} class="block border-none group">
  <div class="mb-6 pb-6 border-b border-[var(--color-border-light)]">
    <div class="flex justify-between items-baseline">
      <span class="text-[15px] text-[var(--color-heading)] tracking-wide group-hover:text-[var(--color-accent-dark)] transition-colors">
        {title}
      </span>
      <span class="text-[10px] text-[var(--color-faint)] font-sans flex-shrink-0 ml-4">
        {dateStr}
      </span>
    </div>
    <div class="text-[11px] text-[var(--color-muted)] mt-1.5 leading-relaxed">
      {description}
    </div>
  </div>
</a>
```

- [ ] **Step 2: Build the homepage**

Write `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ArticleCard from '../components/ArticleCard.astro';
import { getFeaturedPost, getPublishedPosts } from '../utils/collections';
import { getReadingTime } from '../utils/reading-time';
import { getVolumeLabel } from '../utils/season';

const featured = await getFeaturedPost();
const allPosts = await getPublishedPosts();
const recentPosts = allPosts.filter((p) => p.slug !== featured?.slug).slice(0, 5);

// Volume number = total published literary articles
const volumeLabel = getVolumeLabel(allPosts.length, featured?.data.date ?? new Date());

const featuredExcerpt = featured?.data.description ?? '';
---

<BaseLayout title="首页" description="黃某人的个人博客 — 写小说，读闲书，偶尔研究机器学习">
  <!-- Cover Section -->
  <div class="relative py-16 px-6 lg:px-10 text-center">
    <!-- Vertical "痴" decoration -->
    <div class="absolute top-10 right-6 lg:right-10 writing-mode-vertical text-[11px] text-[var(--color-accent)] tracking-[6px] font-serif hidden sm:block" style="writing-mode: vertical-rl;">
      痴
    </div>

    <div class="font-sans text-[11px] tracking-[6px] text-[var(--color-accent-dark)] mb-5">
      {volumeLabel}
    </div>
    <div class="w-10 h-px bg-[var(--color-accent)] mx-auto mb-6"></div>

    {featured && (
      <div>
        <h2 class="text-[28px] text-[var(--color-heading)] tracking-[4px] mb-3">
          {featured.data.title}
        </h2>
        <div class="font-sans text-[12px] text-[var(--color-muted)] tracking-wider mb-6">
          最新发表 · {featured.data.category}
        </div>
        <p class="max-w-lg mx-auto text-[13px] text-[var(--color-muted)] leading-[2.2]">
          {featuredExcerpt}
        </p>
        <div class="mt-6">
          <a
            href={`/posts/${featured.slug}/`}
            class="inline-block font-sans text-[11px] text-[var(--color-accent-dark)] border border-[var(--color-border-dark)] px-5 py-1.5 tracking-[2px] hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition-colors"
          >
            阅读全文
          </a>
        </div>
      </div>
    )}
  </div>

  <!-- Gradient divider -->
  <div class="w-3/5 h-px mx-auto" style="background: linear-gradient(90deg, transparent, var(--color-border-dark), transparent);"></div>

  <!-- Recent Articles -->
  <div class="max-w-lg mx-auto px-6 lg:px-10 py-10">
    <div class="font-sans text-[10px] tracking-[4px] text-[var(--color-accent-dark)] mb-5">
      近期文章
    </div>

    {recentPosts.map((post) => (
      <ArticleCard
        title={post.data.title}
        date={post.data.date}
        description={post.data.description}
        href={`/posts/${post.slug}/`}
      />
    ))}

    <div class="text-center mt-8">
      <a href="/archives/" class="font-sans text-[11px] text-[var(--color-accent-dark)] tracking-[2px] border-none hover:text-[var(--color-heading)]">
        查看全部 →
      </a>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Verify with dev server**

```bash
npx astro dev
```

Expected: Homepage shows magazine cover with featured article "昆虫白与舞茉莉", volume label, gradient divider, and recent articles section.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/components/ArticleCard.astro
git commit -m "feat: build homepage with magazine cover layout

Featured article displayed as cover story with VOL/season label,
vertical 痴 decoration, gradient divider, and recent articles list."
```

---

### Task 7: Article Page — Layout & Eastern Typography

**Files:**
- Create: `src/styles/article.css`
- Create: `src/layouts/ArticleLayout.astro`
- Create: `src/components/EndMark.astro`
- Create: `src/pages/posts/[...slug].astro`
- Create: `src/pages/tech/[...slug].astro`

- [ ] **Step 1: Create article-specific CSS**

Write `src/styles/article.css`:

```css
/* === Article Typography === */

/* Drop cap - first letter of first paragraph after each h2 */
.article-content > h2 + p::first-letter {
  float: left;
  font-size: 3.2em;
  line-height: 1;
  margin: 0.05em 0.12em 0 0;
  color: var(--color-heading);
  font-family: '京华老宋体', 'Noto Serif SC', serif;
}

/* Headings as Chinese numerals - styled via frontmatter or manually */
.article-content h2 {
  font-size: 13px;
  color: var(--color-accent-dark);
  letter-spacing: 3px;
  font-family: 'Josefin Sans', sans-serif;
  margin: 2.5em 0 1.2em;
}

/* Paragraphs */
.article-content p {
  font-size: 15px;
  line-height: 2.2;
  text-align: justify;
  margin-bottom: 1.2em;
  color: var(--color-text);
}

/* Blockquote - Eastern style */
.article-content blockquote {
  margin: 2em 0;
  padding: 1.2em 1.5em;
  border-left: 2px solid var(--color-accent);
  background: var(--color-surface);
  position: relative;
}

.article-content blockquote::before {
  content: '\201C';
  position: absolute;
  top: -8px;
  left: 16px;
  font-size: 28px;
  color: var(--color-border-dark);
  font-family: serif;
}

.article-content blockquote p {
  font-size: 13px;
  color: var(--color-muted);
  font-style: italic;
  line-height: 2.0;
  margin-bottom: 0;
}

/* Footnote references (will be used for sidenotes) */
.article-content sup a {
  color: var(--color-accent-dark);
  font-size: 11px;
  border: none;
  margin: 0 2px;
}

/* Code blocks */
.article-content pre {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 1em 1.2em;
  overflow-x: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  line-height: 1.7;
  margin: 1.5em 0;
}

.article-content code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9em;
  background: var(--color-surface);
  padding: 0.15em 0.4em;
  border-radius: 3px;
}

.article-content pre code {
  background: none;
  padding: 0;
  border-radius: 0;
}

/* Images */
.article-content img {
  max-width: 100%;
  height: auto;
  margin: 2em auto;
  display: block;
}

/* Horizontal rule */
.article-content hr {
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border-dark), transparent);
  margin: 2em 0;
}

/* Footnote section at bottom (fallback / mobile) */
.article-content .footnotes {
  margin-top: 3em;
  padding-top: 1.5em;
  border-top: 1px solid var(--color-border);
  font-size: 12px;
  color: var(--color-muted);
}

.article-content .footnotes ol {
  padding-left: 1.5em;
}

.article-content .footnotes li {
  margin-bottom: 0.5em;
  line-height: 1.8;
}

/* === Literary Animation === */
@media (prefers-reduced-motion: no-preference) {
  .article-fade-in {
    animation: fadeInUp 0.5s ease-out both;
  }

  .article-fade-in-delay {
    animation: fadeInUp 0.6s ease-out 0.15s both;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

- [ ] **Step 2: Create EndMark component**

Write `src/components/EndMark.astro`:

```astro
---
---
<div class="flex justify-center my-10">
  <div class="w-5 h-5 border border-[var(--color-border-dark)] rotate-45 flex items-center justify-center">
    <span class="text-[7px] text-[var(--color-accent)] -rotate-45 font-serif">完</span>
  </div>
</div>
```

- [ ] **Step 3: Create ArticleLayout**

Write `src/layouts/ArticleLayout.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';
import EndMark from '../components/EndMark.astro';
import ReadingProgress from '../components/ReadingProgress.astro';
import TableOfContents from '../components/TableOfContents.astro';
import { getReadingTime } from '../utils/reading-time';
import '../styles/article.css';

interface Props {
  title: string;
  date: Date;
  category: string;
  tags: string[];
  description: string;
  rawContent: string;
  headings: { depth: number; slug: string; text: string }[];
  prevPost?: { title: string; href: string };
  nextPost?: { title: string; href: string };
}

const { title, date, category, tags, description, rawContent, headings, prevPost, nextPost } = Astro.props;

const { minutes, words } = getReadingTime(rawContent);
const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
const showTOC = headings.filter((h) => h.depth <= 3).length >= 3;
---

<BaseLayout title={title} description={description}>
  <ReadingProgress />

  <div class="max-w-6xl mx-auto px-4 lg:px-10 py-10">
    <div class="flex gap-0 lg:gap-6 justify-center">

      <!-- Left: TOC (desktop only) -->
      {showTOC && (
        <aside class="hidden xl:block w-36 flex-shrink-0 pt-20">
          <TableOfContents headings={headings} />
        </aside>
      )}

      <!-- Center: Article Content -->
      <article class="w-full max-w-[560px]">
        <!-- Article Header -->
        <div class="text-center mb-10 article-fade-in">
          <div class="font-sans text-[10px] tracking-[4px] text-[var(--color-accent-dark)] mb-4">
            {category}
          </div>
          <h1 class="text-[26px] text-[var(--color-heading)] tracking-[3px] mb-3">
            {title}
          </h1>
          <div class="flex justify-center gap-4 font-sans text-[10px] text-[var(--color-faint)]">
            <span>{dateStr}</span>
            <span>·</span>
            <span>约 {words} 字</span>
            <span>·</span>
            <span>{minutes} 分钟</span>
          </div>
        </div>

        <div class="w-10 h-px bg-[var(--color-accent)] mx-auto mb-9"></div>

        <!-- Article Body -->
        <div class="article-content article-fade-in-delay">
          <slot />
        </div>

        <EndMark />

        <!-- Tags -->
        <div class="flex gap-2 justify-center mt-6">
          {tags.map((tag) => (
            <span class="font-sans text-[10px] text-[var(--color-accent-dark)] border border-[var(--color-border-dark)] px-2.5 py-0.5">
              {tag}
            </span>
          ))}
        </div>

        <!-- Prev / Next Navigation -->
        {(prevPost || nextPost) && (
          <div class="mt-10 pt-6 border-t border-[var(--color-border)] flex justify-between text-[11px]">
            {prevPost ? (
              <a href={prevPost.href} class="border-none group">
                <div class="text-[var(--color-faint)] text-[9px] tracking-[2px] font-sans mb-1">← 上一篇</div>
                <div class="text-[var(--color-muted)] group-hover:text-[var(--color-heading)] transition-colors">{prevPost.title}</div>
              </a>
            ) : <div />}
            {nextPost ? (
              <a href={nextPost.href} class="text-right border-none group">
                <div class="text-[var(--color-faint)] text-[9px] tracking-[2px] font-sans mb-1">下一篇 →</div>
                <div class="text-[var(--color-muted)] group-hover:text-[var(--color-heading)] transition-colors">{nextPost.title}</div>
              </a>
            ) : <div />}
          </div>
        )}
      </article>

      <!-- Right: Sidenotes area (desktop only, populated by JS) -->
      <aside class="hidden xl:block w-40 flex-shrink-0 pt-20" id="sidenotes-container">
        <!-- Sidenotes will be positioned here by client-side JS -->
      </aside>

    </div>
  </div>
</BaseLayout>
```

- [ ] **Step 4: Create post article page**

Write `src/pages/posts/[...slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import ArticleLayout from '../../layouts/ArticleLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return sorted.map((post, i) => ({
    params: { slug: post.slug },
    props: {
      post,
      prevPost: sorted[i + 1]
        ? { title: sorted[i + 1].data.title, href: `/posts/${sorted[i + 1].slug}/` }
        : undefined,
      nextPost: sorted[i - 1]
        ? { title: sorted[i - 1].data.title, href: `/posts/${sorted[i - 1].slug}/` }
        : undefined,
    },
  }));
}

const { post, prevPost, nextPost } = Astro.props;
const { Content, headings } = await post.render();
---

<ArticleLayout
  title={post.data.title}
  date={post.data.date}
  category={post.data.category}
  tags={post.data.tags}
  description={post.data.description}
  rawContent={post.body ?? ''}
  headings={headings}
  prevPost={prevPost}
  nextPost={nextPost}
>
  <Content />
</ArticleLayout>
```

- [ ] **Step 5: Create tech article page**

Write `src/pages/tech/[...slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import ArticleLayout from '../../layouts/ArticleLayout.astro';

export async function getStaticPaths() {
  const articles = await getCollection('tech', ({ data }) => !data.draft);
  const sorted = articles.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return sorted.map((article, i) => ({
    params: { slug: article.slug },
    props: {
      article,
      prevPost: sorted[i + 1]
        ? { title: sorted[i + 1].data.title, href: `/tech/${sorted[i + 1].slug}/` }
        : undefined,
      nextPost: sorted[i - 1]
        ? { title: sorted[i - 1].data.title, href: `/tech/${sorted[i - 1].slug}/` }
        : undefined,
    },
  }));
}

const { article, prevPost, nextPost } = Astro.props;
const { Content, headings } = await article.render();
---

<ArticleLayout
  title={article.data.title}
  date={article.data.date}
  category={article.data.category}
  tags={article.data.tags}
  description={article.data.description}
  rawContent={article.body ?? ''}
  headings={headings}
  prevPost={prevPost}
  nextPost={nextPost}
>
  <Content />
</ArticleLayout>
```

- [ ] **Step 6: Verify with dev server**

```bash
npx astro dev
```

Visit `http://localhost:4321/posts/kun-chong-bai/`. Expected: Article renders with drop cap, blockquote styling, end mark, header with word count and reading time, fade-in animation.

- [ ] **Step 7: Commit**

```bash
git add src/styles/article.css src/layouts/ArticleLayout.astro src/components/EndMark.astro src/pages/posts/ src/pages/tech/
git commit -m "feat: article page with Eastern typography and literary effects

Three-column layout, drop cap, styled blockquotes, 完 end mark,
fade-in animations, reading time, prev/next navigation."
```

---

### Task 8: Article Interactive Features — Reading Progress, TOC & Sidenotes

**Files:**
- Create: `src/components/ReadingProgress.astro`
- Create: `src/components/TableOfContents.astro`
- Create: `src/components/Sidenotes.astro`
- Modify: `src/layouts/ArticleLayout.astro` (add Sidenotes import)

- [ ] **Step 1: Create ReadingProgress component**

Write `src/components/ReadingProgress.astro`:

```astro
---
---
<div
  id="reading-progress"
  class="fixed top-0 left-0 h-0.5 z-50 transition-[width] duration-100"
  style="width: 0%; background: linear-gradient(90deg, var(--color-accent), var(--color-accent-dark));"
></div>

<script>
  function updateProgress() {
    const el = document.getElementById('reading-progress');
    if (!el) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    el.style.width = `${Math.min(100, progress)}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
</script>
```

- [ ] **Step 2: Create TableOfContents component**

Write `src/components/TableOfContents.astro`:

```astro
---
interface Props {
  headings: { depth: number; slug: string; text: string }[];
}

const { headings } = Astro.props;
const tocItems = headings.filter((h) => h.depth <= 3);
---

<nav class="sticky top-24" id="toc-nav">
  <div class="font-sans text-[9px] tracking-[3px] text-[var(--color-accent-dark)] mb-3">
    目录
  </div>
  <div class="border-l border-[var(--color-border-dark)] pl-2.5">
    {tocItems.map((item) => (
      <a
        href={`#${item.slug}`}
        class:list={[
          'block text-[10px] mb-2 border-none transition-colors toc-link',
          'text-[var(--color-muted)] hover:text-[var(--color-heading)]',
          item.depth === 3 && 'ml-3',
        ]}
        data-heading={item.slug}
      >
        {item.text}
      </a>
    ))}
  </div>
</nav>

<script>
  function initTOC() {
    const headings = document.querySelectorAll('.article-content h2, .article-content h3');
    const links = document.querySelectorAll('.toc-link');
    if (headings.length === 0 || links.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            links.forEach((link) => {
              const isActive = link.getAttribute('data-heading') === id;
              link.classList.toggle('!text-[var(--color-heading)]', isActive);
              link.classList.toggle('!font-bold', isActive);
            });
          }
        });
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );

    headings.forEach((h) => observer.observe(h));
  }

  initTOC();
  document.addEventListener('astro:page-load', initTOC);
</script>
```

- [ ] **Step 3: Create Sidenotes component**

Write `src/components/Sidenotes.astro`:

```astro
---
---
<script>
  function initSidenotes() {
    const container = document.getElementById('sidenotes-container');
    const articleContent = document.querySelector('.article-content');
    if (!container || !articleContent) return;

    // Check if wide enough for sidenotes
    const isWide = window.innerWidth >= 1280;
    const footnoteSection = articleContent.querySelector('.footnotes');

    if (!isWide || !footnoteSection) return;

    // Extract footnote items
    const footnoteItems = footnoteSection.querySelectorAll('li');
    if (footnoteItems.length === 0) return;

    // Clear container
    container.innerHTML = '';

    footnoteItems.forEach((item, index) => {
      const id = item.id; // e.g., "fn-1"
      const num = index + 1;

      // Find the reference in the article
      const ref = articleContent.querySelector(`a[href="#${id}"]`) ||
                  articleContent.querySelector(`sup a[href="#fn:${num}"]`) ||
                  articleContent.querySelector(`a.footnote-ref[href*="${num}"]`);

      // Create sidenote element
      const sidenote = document.createElement('div');
      sidenote.className = 'mb-8';
      sidenote.innerHTML = `
        <div class="text-[10px] text-[var(--color-accent-dark)] mb-1 font-sans">${num}</div>
        <div class="text-[10px] text-[var(--color-muted)] leading-relaxed border-l border-[var(--color-border-dark)] pl-2">
          ${item.innerHTML.replace(/<a[^>]*class="footnote-backref"[^>]*>.*?<\/a>/g, '')}
        </div>
      `;

      // Position relative to the reference
      if (ref) {
        const refRect = ref.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const offsetTop = refRect.top - containerRect.top + container.scrollTop;
        sidenote.style.position = 'absolute';
        sidenote.style.top = `${offsetTop}px`;
      }

      container.appendChild(sidenote);
    });

    // Set container to relative positioning
    container.style.position = 'relative';

    // Hide the original footnotes section
    footnoteSection.style.display = 'none';
  }

  // Run after page load and on resize
  window.addEventListener('load', initSidenotes);
  window.addEventListener('resize', () => {
    const container = document.getElementById('sidenotes-container');
    if (container) container.innerHTML = '';
    const footnotes = document.querySelector('.article-content .footnotes');
    if (footnotes) (footnotes as HTMLElement).style.display = '';
    initSidenotes();
  });
</script>
```

- [ ] **Step 4: Add Sidenotes to ArticleLayout**

Modify `src/layouts/ArticleLayout.astro` — add the Sidenotes import after the existing imports:

```astro
import Sidenotes from '../components/Sidenotes.astro';
```

And add `<Sidenotes />` just before the closing `</BaseLayout>` tag:

```astro
  <Sidenotes />
</BaseLayout>
```

- [ ] **Step 5: Verify all interactive features**

```bash
npx astro dev
```

Visit `http://localhost:4321/posts/kun-chong-bai/`. Expected:
- Reading progress bar appears at top, advances on scroll
- TOC appears on left (on wide screens), highlights current section
- Sidenotes appear on right (on wide screens) aligned with footnote references
- On narrow screens, footnotes remain at bottom of article

- [ ] **Step 6: Commit**

```bash
git add src/components/ReadingProgress.astro src/components/TableOfContents.astro src/components/Sidenotes.astro src/layouts/ArticleLayout.astro
git commit -m "feat: add reading progress bar, floating TOC, and sidenotes

Progress bar tracks scroll position. TOC highlights current heading
via IntersectionObserver. Sidenotes extract footnotes into right
margin on desktop, fall back to footnotes on mobile."
```

---

### Task 9: Tech Listing Page

**Files:**
- Create: `src/pages/tech/index.astro`

- [ ] **Step 1: Build tech listing page**

Write `src/pages/tech/index.astro`:

```astro
---
import PageLayout from '../../layouts/PageLayout.astro';
import { getPublishedTech } from '../../utils/collections';

const articles = await getPublishedTech();
---

<PageLayout title="技术碎碎念" englishTitle="TECH NOTES" description="ML/AI 碎碎念和技术笔记">
  <div class="max-w-lg mx-auto">
    {articles.map((article) => {
      const dateStr = `${article.data.date.getFullYear()}.${String(article.data.date.getMonth() + 1).padStart(2, '0')}`;
      return (
        <a href={`/tech/${article.slug}/`} class="block border-none group mb-7 pb-7 border-b border-[var(--color-border-light)]">
          <div class="flex justify-between items-baseline">
            <span class="text-[15px] text-[var(--color-heading)] tracking-wide group-hover:text-[var(--color-accent-dark)] transition-colors">
              {article.data.title}
            </span>
            <span class="text-[10px] text-[var(--color-faint)] font-sans flex-shrink-0 ml-4">
              {dateStr}
            </span>
          </div>
          <div class="text-[11px] text-[var(--color-muted)] mt-1.5 leading-relaxed">
            {article.data.description}
          </div>
          <div class="flex gap-1.5 mt-2">
            {article.data.tags.map((tag) => (
              <span class="font-sans text-[9px] text-[var(--color-accent-dark)] border border-[var(--color-border-dark)] px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>
        </a>
      );
    })}

    {articles.length === 0 && (
      <p class="text-center text-[var(--color-muted)] text-sm">暂无文章</p>
    )}
  </div>
</PageLayout>
```

- [ ] **Step 2: Verify**

```bash
npx astro dev
```

Visit `http://localhost:4321/tech/`. Expected: Lists the sample tech article with title, date, description, tags.

- [ ] **Step 3: Commit**

```bash
git add src/pages/tech/index.astro
git commit -m "feat: add tech listing page

Displays tech articles with title, date, description, and tags."
```

---

### Task 10: Reading Page

**Files:**
- Create: `src/components/BookCard.astro`
- Create: `src/pages/reading/index.astro`

- [ ] **Step 1: Create BookCard component**

Write `src/components/BookCard.astro`:

```astro
---
interface Props {
  title: string;
  author: string;
  date: Date;
  rating: number;
  cover?: string;
  body: string;
}

const { title, author, date, rating, cover, body } = Astro.props;
const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
---

<div class="flex gap-5 mb-7 pb-7 border-b border-[var(--color-border-light)]">
  <!-- Book cover -->
  <div class="w-16 h-22 flex-shrink-0 border border-[var(--color-border-dark)] bg-[var(--color-border-light)] flex items-center justify-center">
    {cover ? (
      <img src={cover} alt={title} class="w-full h-full object-cover" />
    ) : (
      <div class="text-[10px] text-[var(--color-muted)] tracking-[2px]" style="writing-mode: vertical-rl;">
        书影
      </div>
    )}
  </div>

  <!-- Book info -->
  <div class="flex-1">
    <div class="text-[15px] text-[var(--color-heading)] tracking-wide mb-1">{title}</div>
    <div class="text-[11px] text-[var(--color-faint)] font-sans mb-2">
      {author} · {dateStr} 读毕
    </div>
    <div class="text-[11px] text-[var(--color-muted)] leading-relaxed mb-1.5">
      {body}
    </div>
    <div class="text-[10px] text-[var(--color-accent)]">{stars}</div>
  </div>
</div>
```

- [ ] **Step 2: Build reading page**

Write `src/pages/reading/index.astro`:

```astro
---
import PageLayout from '../../layouts/PageLayout.astro';
import BookCard from '../../components/BookCard.astro';
import { getReadingList } from '../../utils/collections';

const books = await getReadingList();
---

<PageLayout title="阅读" englishTitle="READING" description="读书记录与简评">
  <div class="max-w-lg mx-auto">
    {books.map((book) => (
      <BookCard
        title={book.data.title}
        author={book.data.author}
        date={book.data.date}
        rating={book.data.rating}
        cover={book.data.cover}
        body={book.body ?? ''}
      />
    ))}

    {books.length === 0 && (
      <p class="text-center text-[var(--color-muted)] text-sm">暂无阅读记录</p>
    )}
  </div>
</PageLayout>
```

- [ ] **Step 3: Verify and commit**

```bash
npx astro dev
```

Visit `http://localhost:4321/reading/`. Expected: Shows book card with cover placeholder, title, author, date, review text, star rating.

```bash
git add src/components/BookCard.astro src/pages/reading/
git commit -m "feat: add reading page with book cards

Displays book reviews with cover, author, rating, and comments."
```

---

### Task 11: Categories Page

**Files:**
- Create: `src/pages/categories/index.astro`
- Create: `src/pages/categories/[category].astro`

- [ ] **Step 1: Build categories index page**

Write `src/pages/categories/index.astro`:

```astro
---
import PageLayout from '../../layouts/PageLayout.astro';
import { getAllArticles } from '../../utils/collections';

const articles = await getAllArticles();

// Count articles per category
const categoryMap = new Map<string, number>();
articles.forEach((a) => {
  const cat = a.data.category;
  categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
});
const categories = Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1]);
---

<PageLayout title="分类" englishTitle="CATEGORIES" description="按分类浏览文章">
  <div class="flex flex-wrap gap-3 justify-center max-w-md mx-auto">
    {categories.map(([name, count]) => (
      <a
        href={`/categories/${encodeURIComponent(name)}/`}
        class="block px-6 py-3 border border-[var(--color-border-dark)] text-center min-w-[100px] border-none hover:bg-[var(--color-surface)] transition-colors"
        style="border: 1px solid var(--color-border-dark);"
      >
        <div class="text-sm text-[var(--color-heading)] tracking-wide">{name}</div>
        <div class="text-[10px] text-[var(--color-faint)] mt-1 font-sans">{count} 篇</div>
      </a>
    ))}
  </div>
</PageLayout>
```

- [ ] **Step 2: Build category detail page**

Write `src/pages/categories/[category].astro`:

```astro
---
import PageLayout from '../../layouts/PageLayout.astro';
import ArticleCard from '../../components/ArticleCard.astro';
import { getAllArticles } from '../../utils/collections';

export async function getStaticPaths() {
  const articles = await getAllArticles();
  const categories = [...new Set(articles.map((a) => a.data.category))];

  return categories.map((category) => ({
    params: { category },
    props: {
      category,
      articles: articles.filter((a) => a.data.category === category),
    },
  }));
}

const { category, articles } = Astro.props;
---

<PageLayout title={category} englishTitle="CATEGORY" description={`分类：${category}`}>
  <div class="max-w-lg mx-auto">
    {articles.map((article) => {
      const href = article.collection === 'posts'
        ? `/posts/${article.slug}/`
        : `/tech/${article.slug}/`;
      return (
        <ArticleCard
          title={article.data.title}
          date={article.data.date}
          description={article.data.description}
          href={href}
        />
      );
    })}
  </div>
</PageLayout>
```

- [ ] **Step 3: Verify and commit**

```bash
npx astro dev
```

Visit `http://localhost:4321/categories/`. Expected: Grid of category cards with article counts. Clicking a category shows filtered article list.

```bash
git add src/pages/categories/
git commit -m "feat: add categories page with dynamic category routes

Grid of categories with article counts. Each category links to
a filtered article list."
```

---

### Task 12: Archives Page

**Files:**
- Create: `src/pages/archives/index.astro`

- [ ] **Step 1: Build archives page**

Write `src/pages/archives/index.astro`:

```astro
---
import PageLayout from '../../layouts/PageLayout.astro';
import { getAllArticles } from '../../utils/collections';

const articles = await getAllArticles();

// Group by year
const yearMap = new Map<number, typeof articles>();
articles.forEach((a) => {
  const year = a.data.date.getFullYear();
  if (!yearMap.has(year)) yearMap.set(year, []);
  yearMap.get(year)!.push(a);
});
const years = Array.from(yearMap.entries()).sort((a, b) => b[0] - a[0]);
---

<PageLayout title="归档" englishTitle="ARCHIVES" description="按时间线浏览所有文章">
  <div class="max-w-lg mx-auto">
    {years.map(([year, yearArticles]) => (
      <div class="mb-8">
        <div class="text-base text-[var(--color-heading)] tracking-[2px] mb-4 pb-2 border-b border-[var(--color-border-light)]">
          {year}
        </div>
        <div class="ml-4">
          {yearArticles.map((article) => {
            const d = article.data.date;
            const dateStr = `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
            const href = article.collection === 'posts'
              ? `/posts/${article.slug}/`
              : `/tech/${article.slug}/`;
            return (
              <a href={href} class="flex items-baseline gap-3 mb-2.5 border-none group">
                <span class="text-[10px] text-[var(--color-faint)] font-sans w-10 flex-shrink-0">
                  {dateStr}
                </span>
                <div class="w-1 h-1 bg-[var(--color-accent)] rounded-full flex-shrink-0 mt-1.5"></div>
                <span class="text-[13px] text-[var(--color-text)] group-hover:text-[var(--color-heading)] transition-colors">
                  {article.data.title}
                </span>
                <span class="text-[9px] text-[var(--color-faint)] font-sans flex-shrink-0">
                  {article.data.category}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    ))}

    <!-- Legacy placeholder -->
    <div class="mb-8">
      <div class="text-base text-[var(--color-heading)] tracking-[2px] mb-4 pb-2 border-b border-[var(--color-border-light)]">
        2019 及更早
      </div>
      <div class="ml-4 text-[11px] text-[var(--color-faint)] italic">
        旧文章迁移中……
      </div>
    </div>
  </div>
</PageLayout>
```

- [ ] **Step 2: Verify and commit**

```bash
npx astro dev
```

Visit `http://localhost:4321/archives/`. Expected: Timeline with year grouping, each article shows date dot, title, and category tag. Legacy placeholder at bottom.

```bash
git add src/pages/archives/
git commit -m "feat: add archives page with timeline layout

Year-grouped timeline with date, dot, title, and category.
Legacy placeholder for old article migration."
```

---

### Task 13: About Page

**Files:**
- Create: `src/pages/about/index.astro`

- [ ] **Step 1: Build about page**

Write `src/pages/about/index.astro`:

```astro
---
import PageLayout from '../../layouts/PageLayout.astro';
---

<PageLayout title="关于" englishTitle="ABOUT" description="关于黃某人">
  <div class="text-center">
    <!-- Avatar -->
    <div class="w-20 h-20 rounded-full bg-[var(--color-border-light)] border-2 border-[var(--color-border-dark)] mx-auto mb-5 flex items-center justify-center">
      <span class="text-2xl text-[var(--color-accent)] font-sans">R</span>
    </div>

    <div class="text-lg text-[var(--color-heading)] tracking-[2px] mb-2">黃某人</div>

    <div class="text-[12px] text-[var(--color-muted)] leading-[2.0] mb-6">
      写小说，读闲书，偶尔研究机器学习。<br />
      相信文字的力量，也相信代码的优雅。
    </div>

    <div class="w-10 h-px bg-[var(--color-accent)] mx-auto mb-6"></div>

    <div class="flex gap-5 justify-center font-sans text-[11px] text-[var(--color-accent-dark)]">
      <a href="https://github.com/RandolphVI" class="border-none hover:text-[var(--color-heading)]" target="_blank" rel="noopener">GitHub</a>
      <span class="text-[var(--color-border)]">·</span>
      <a href="mailto:" class="border-none hover:text-[var(--color-heading)]">Email</a>
      <span class="text-[var(--color-border)]">·</span>
      <a href="/rss.xml" class="border-none hover:text-[var(--color-heading)]">RSS</a>
    </div>
  </div>
</PageLayout>
```

- [ ] **Step 2: Verify and commit**

```bash
npx astro dev
```

Visit `http://localhost:4321/about/`. Expected: Centered layout with avatar placeholder, name, bio, and social links.

```bash
git add src/pages/about/
git commit -m "feat: add about page

Centered layout with avatar, bio, and social links."
```

---

### Task 14: Search — Pagefind Integration

**Files:**
- Create: `src/components/SearchModal.astro`
- Modify: `src/components/Navbar.astro` (wire search trigger)
- Modify: `astro.config.mjs` (add pagefind post-build script)
- Modify: `package.json` (add pagefind to build script)

- [ ] **Step 1: Install Pagefind**

```bash
npm install -D pagefind
```

- [ ] **Step 2: Update build script in package.json**

In `package.json`, change the `build` script:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build && npx pagefind --site dist --glob '**/*.html'",
  "preview": "astro preview"
}
```

- [ ] **Step 3: Create SearchModal component**

Write `src/components/SearchModal.astro`:

```astro
---
---
<div id="search-modal" class="hidden fixed inset-0 z-50">
  <!-- Backdrop -->
  <div id="search-backdrop" class="absolute inset-0 bg-black/40"></div>

  <!-- Modal -->
  <div class="absolute top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
    <div class="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg shadow-2xl p-4">
      <div class="flex items-center gap-3 mb-3">
        <span class="text-[var(--color-muted)]">🔍</span>
        <input
          id="search-input"
          type="text"
          placeholder="搜索文章…"
          class="flex-1 bg-transparent border-none outline-none text-[var(--color-heading)] text-sm placeholder:text-[var(--color-faint)]"
          autocomplete="off"
        />
        <button id="search-close" class="text-[var(--color-muted)] text-xs font-sans tracking-wider cursor-pointer">ESC</button>
      </div>
      <div id="search-results" class="max-h-[50vh] overflow-y-auto">
        <!-- Results rendered here -->
      </div>
    </div>
  </div>
</div>

<script>
  async function initSearch() {
    const modal = document.getElementById('search-modal');
    const input = document.getElementById('search-input') as HTMLInputElement;
    const results = document.getElementById('search-results');
    const backdrop = document.getElementById('search-backdrop');
    const closeBtn = document.getElementById('search-close');

    if (!modal || !input || !results) return;

    // Triggers
    document.querySelectorAll('#search-trigger, #search-trigger-mobile').forEach((btn) => {
      btn.addEventListener('click', () => openSearch());
    });

    backdrop?.addEventListener('click', closeSearch);
    closeBtn?.addEventListener('click', closeSearch);

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape') closeSearch();
    });

    function openSearch() {
      modal!.classList.remove('hidden');
      input!.focus();
      input!.value = '';
      results!.innerHTML = '';
    }

    function closeSearch() {
      modal!.classList.add('hidden');
    }

    // Pagefind search
    let pagefind: any = null;

    input.addEventListener('input', async () => {
      const query = input.value.trim();
      if (!query) {
        results!.innerHTML = '';
        return;
      }

      if (!pagefind) {
        try {
          pagefind = await import(/* @vite-ignore */ '/pagefind/pagefind.js');
          await pagefind.init();
        } catch {
          results!.innerHTML = '<div class="text-[var(--color-muted)] text-xs p-4">搜索索引加载中，请在构建后使用…</div>';
          return;
        }
      }

      const search = await pagefind.search(query);
      const items = await Promise.all(search.results.slice(0, 8).map((r: any) => r.data()));

      if (items.length === 0) {
        results!.innerHTML = '<div class="text-[var(--color-muted)] text-xs p-4">未找到相关文章</div>';
        return;
      }

      results!.innerHTML = items
        .map(
          (item: any) => `
          <a href="${item.url}" class="block px-3 py-2.5 hover:bg-[var(--color-surface)] rounded transition-colors" style="border:none;">
            <div class="text-sm text-[var(--color-heading)]">${item.meta?.title || item.url}</div>
            <div class="text-[11px] text-[var(--color-muted)] mt-1 line-clamp-2">${item.excerpt}</div>
          </a>`
        )
        .join('');
    });
  }

  initSearch();
  document.addEventListener('astro:page-load', initSearch);
</script>
```

- [ ] **Step 4: Add SearchModal to BaseLayout**

Modify `src/layouts/BaseLayout.astro` — add import and component:

```astro
import SearchModal from '../components/SearchModal.astro';
```

Add `<SearchModal />` right after `<Footer />`:

```astro
    <Footer />
    <SearchModal />
  </body>
```

- [ ] **Step 5: Build and verify search**

```bash
npm run build
npx astro preview
```

Expected: Click 🔍 or press Ctrl+K — search modal opens. Type a query — results from sample articles appear.

- [ ] **Step 6: Commit**

```bash
git add src/components/SearchModal.astro src/layouts/BaseLayout.astro package.json
git commit -m "feat: add Pagefind search with modal UI

Search indexed at build time. Modal opened via navbar icon or Ctrl+K.
Shows title and excerpt for matching articles."
```

---

### Task 15: RSS Feed

**Files:**
- Create: `src/pages/rss.xml.ts`

- [ ] **Step 1: Create RSS feed endpoint**

Write `src/pages/rss.xml.ts`:

```typescript
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllArticles } from '../utils/collections';

export async function GET(context: APIContext) {
  const articles = await getAllArticles();

  return rss({
    title: '黃某人',
    description: '写小说，读闲书，偶尔研究机器学习',
    site: context.site!,
    items: articles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.date,
      description: article.data.description,
      link: article.collection === 'posts'
        ? `/posts/${article.slug}/`
        : `/tech/${article.slug}/`,
    })),
    customData: '<language>zh-CN</language>',
  });
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: `dist/rss.xml` is generated with correct entries.

```bash
cat dist/rss.xml | head -20
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/rss.xml.ts
git commit -m "feat: add RSS feed

Includes all literary and tech articles, sorted by date."
```

---

### Task 16: GitHub Actions Deployment

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create GitHub Actions workflow**

Write `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci
      - run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verify build locally**

```bash
npm run build
```

Expected: Full build succeeds with all pages, search index, and RSS.

- [ ] **Step 3: Commit**

```bash
git add .github/
git commit -m "ci: add GitHub Actions workflow for Pages deployment

Builds Astro site with Pagefind indexing and deploys to GitHub Pages
on push to master."
```

---

### Task 17: Final Verification & Polish

**Files:**
- Verify all pages render correctly
- Run full test suite
- Verify build output

- [ ] **Step 1: Run all tests**

```bash
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 2: Run full build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Preview and verify all pages**

```bash
npx astro preview
```

Verify in browser:
- `http://localhost:4321/` — Homepage with magazine cover, featured article, recent list
- `http://localhost:4321/posts/kun-chong-bai/` — Article with drop cap, blockquote, TOC, sidenotes, progress bar, end mark, animations
- `http://localhost:4321/tech/` — Tech listing
- `http://localhost:4321/tech/astro-rebuild/` — Tech article page
- `http://localhost:4321/reading/` — Reading list with book card
- `http://localhost:4321/categories/` — Category grid
- `http://localhost:4321/archives/` — Timeline with legacy placeholder
- `http://localhost:4321/about/` — About page
- Search (Ctrl+K) — Modal opens, search returns results
- Theme toggle — Light/dark mode switches correctly
- Mobile — Hamburger menu works, responsive layout adapts

- [ ] **Step 4: Verify dark mode on key pages**

Toggle to dark mode. Verify:
- Background is neutral dark `#1b1b1f`
- Text is readable
- Progress bar and accents adapt
- No flash of wrong theme on page load

- [ ] **Step 5: Check build output structure**

```bash
ls dist/
ls dist/posts/
ls dist/tech/
```

Expected: Static HTML files for all routes, `pagefind/` directory with search index, `CNAME` file, `favicon.ico`.

- [ ] **Step 6: Final commit**

If any fixes were needed during verification:

```bash
git add -A
git commit -m "fix: polish and verification fixes"
```
