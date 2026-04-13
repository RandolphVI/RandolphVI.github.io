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
