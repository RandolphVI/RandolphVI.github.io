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
        ? `/posts/${article.id}/`
        : `/tech/${article.id}/`,
    })),
    customData: '<language>zh-CN</language>',
  });
}
