#!/usr/bin/env node
/**
 * One-shot seeder: generates papers + projects markdown files from authoritative
 * data extracted from RandolphVI's GitHub profile + README. Re-runnable
 * (overwrites existing files).
 */
import fs from 'node:fs';
import path from 'node:path';

const PAPERS_DIR = 'src/content/papers';
const PROJECTS_DIR = 'src/content/projects';

// Wipe existing seeded files first (keep nothing — fully regenerate)
function wipe(dir) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith('.md')) fs.unlinkSync(path.join(dir, f));
  }
}
wipe(PAPERS_DIR);
wipe(PROJECTS_DIR);
fs.mkdirSync(PAPERS_DIR, { recursive: true });
fs.mkdirSync(PROJECTS_DIR, { recursive: true });

// ---------- PAPERS ----------
const papers = [
  {
    slug: 'context-aware-prompting-cpsi-2026',
    title: 'Context-Aware Prompting for Collaborative Problem Solving Skill Identification',
    authors: ['Mengxiao Zhu', 'Li Feng', 'Xin Wang', 'Wei Huang'],
    correspondingAuthor: true,
    venue: 'CAEAI', venueFull: 'Computers and Education: Artificial Intelligence',
    year: 2026, date: '2026-01-01', type: 'journal',
    doi: '10.1016/j.caeai.2026.100567',
    tags: ['Education', 'Prompting', 'CPS'],
  },
  {
    slug: 'beyond-final-products-lak-2025',
    title: 'Beyond Final Products: Multi-Dimensional Essay Scoring Using Keystroke Logs and Deep Learning',
    authors: ['Xinyun He', 'Qi Shu', 'Mo Zhang', 'Wei Huang', 'Han Zhao', 'Mengxiao Zhu'],
    venue: 'LAK', venueFull: 'Learning Analytics and Knowledge',
    year: 2025, date: '2025-03-03', type: 'conference',
    doi: '10.1145/3706468.3706548',
    tags: ['Essay Scoring', 'Keystroke', 'Deep Learning'],
  },
  {
    slug: 'prompt-learning-cps-cscw-2024',
    title: 'Application of Prompt Learning Models in Identifying the Collaborative Problem Solving Skills in an Online Task',
    authors: ['Mengxiao Zhu', 'Xin Wang', 'Xiantao Wang', 'Zihang Chen', 'Wei Huang'],
    venue: 'CSCW', venueFull: 'Proceedings of the ACM on Human-Computer Interaction',
    year: 2024, date: '2024-11-01', type: 'journal',
    doi: '10.1145/3686981',
    tags: ['CPS', 'Prompt Learning', 'CSCW'],
  },
  {
    slug: 'heckmancd-cikm-2024',
    title: 'HeckmanCD: Exploiting Selection Bias in Cognitive Diagnosis',
    authors: ['Dongxuan Han', 'Qi Liu', 'Siqi Lei', 'Shiwei Tong', 'Wei Huang'],
    venue: 'CIKM', venueFull: 'ACM International Conference on Information and Knowledge Management',
    year: 2024, date: '2024-10-21', type: 'conference',
    doi: '10.1145/3627673.3679648',
    tags: ['Cognitive Diagnosis', 'Selection Bias'],
  },
  {
    slug: 'search-efficient-cat-cikm-2023',
    title: 'Search-Efficient Computerized Adaptive Testing',
    authors: ['Yuting Hong', 'Shiwei Tong', 'Wei Huang', 'Yan Zhuang', 'Qi Liu', 'Enhong Chen'],
    venue: 'CIKM', venueFull: 'ACM International Conference on Information and Knowledge Management',
    year: 2023, date: '2023-10-21', type: 'conference',
    doi: '10.1145/3583780.3615049',
    tags: ['CAT', 'Adaptive Testing'],
  },
  {
    slug: 'hmnet-jmlc-2023',
    title: 'HMNet: A Hierarchical Multi-modal Network for Educational Video Concept Prediction',
    authors: ['Wei Huang', 'Tong Xiao', 'Qi Liu', 'Zhenya Huang'],
    venue: 'IJMLC', venueFull: 'International Journal of Machine Learning and Cybernetics',
    year: 2023, date: '2023-04-01', type: 'journal',
    doi: '10.1007/s13042-023-01809-6',
    tags: ['Multi-modal', 'Hierarchical', 'Video'],
  },
  {
    slug: 'hmcnet-tkde-2022',
    title: 'HmcNet: A General Approach for Hierarchical Multi-label Classification',
    authors: ['Wei Huang', 'Enhong Chen', 'Qi Liu', 'Hui Xiong', 'Zhenya Huang', 'Shiwei Tong'],
    venue: 'TKDE', venueFull: 'IEEE Transactions on Knowledge and Data Engineering',
    year: 2022, date: '2022-09-01', type: 'journal',
    doi: '10.1109/TKDE.2022.3208722',
    tags: ['Hierarchical', 'Multi-label', 'Classification'],
    featured: true,
  },
  {
    slug: 'monitor-student-progress-tkde-2022',
    title: 'Monitoring Student Progress for Learning Process-consistent Knowledge Tracing',
    authors: ['Shuanghong Shen', 'Qi Liu', 'Enhong Chen', 'Zhenya Huang', 'Wei Huang'],
    venue: 'TKDE', venueFull: 'IEEE Transactions on Knowledge and Data Engineering',
    year: 2022, date: '2022-08-01', type: 'journal',
    doi: '10.1109/TKDE.2022.3220900',
    tags: ['Knowledge Tracing', 'Education'],
  },
  {
    slug: 'hiercdf-kdd-2022',
    title: 'HierCDF: A Bayesian Network-based Hierarchical Cognitive Diagnosis Framework',
    authors: ['Jiatong Li', 'Fei Wang', 'Qi Liu', 'Mengxiao Zhu', 'Wei Huang'],
    venue: 'KDD', venueFull: 'ACM SIGKDD Conference on Knowledge Discovery and Data Mining',
    year: 2022, date: '2022-08-14', type: 'conference',
    doi: '10.1145/3534678.3539486',
    tags: ['Cognitive Diagnosis', 'Bayesian Network'],
  },
  {
    slug: 'incremental-cd-kdd-2022',
    title: 'Incremental Cognitive Diagnosis for Intelligent Education',
    authors: ['Shiwei Tong', 'Jiayu Liu', 'Yuting Hong', 'Zhenya Huang', 'Le Wu', 'Qi Liu', 'Wei Huang'],
    venue: 'KDD', venueFull: 'ACM SIGKDD Conference on Knowledge Discovery and Data Mining',
    year: 2022, date: '2022-08-14', type: 'conference',
    doi: '10.1145/3534678.3539399',
    tags: ['Cognitive Diagnosis', 'Incremental Learning'],
  },
  {
    slug: 'clustering-behavior-sampling-sigir-2022',
    title: 'Clustering based Behavior Sampling with Long Sequential Data for CTR Prediction',
    authors: ['Yuren Zhang', 'Enhong Chen', 'Binbin Jin', 'Hao Wang', 'Min Hou', 'Wei Huang', 'Runlong Yu'],
    venue: 'SIGIR', venueFull: 'ACM International Conference on Research and Development in Information Retrieval',
    year: 2022, date: '2022-07-11', type: 'conference',
    doi: '10.1145/3477495.3531829',
    tags: ['CTR', 'Recommendation', 'Sequential'],
  },
  {
    slug: 'tipster-dasfaa-2022',
    title: 'Tipster: A Topic-Guided Language Model for Topic-Aware Text Segmentation',
    authors: ['Zheng Gong', 'Shiwei Tong', 'Han Wu', 'Qi Liu', 'Hanqing Tao', 'Wei Huang'],
    venue: 'DASFAA', venueFull: 'Database Systems for Advanced Applications',
    year: 2022, date: '2022-04-11', type: 'conference',
    doi: '10.1007/978-3-031-00129-1_14',
    tags: ['NLP', 'Text Segmentation', 'Topic'],
  },
  {
    slug: 'consistency-aware-multimodal-icbk-2021',
    title: 'Consistency-aware Multi-modal Network for Hierarchical Multi-label Classification in Online Education System',
    authors: ['Siqi Lei', 'Wei Huang', 'Shiwei Tong', 'Qi Liu', 'Zhenya Huang', 'Enhong Chen'],
    venue: 'ICBK', venueFull: 'IEEE International Conference on Big Knowledge',
    year: 2021, date: '2021-12-07', type: 'conference',
    doi: '10.1109/ICKG52313.2021.00041',
    tags: ['Multi-modal', 'Hierarchical', 'Education'],
    award: 'Best Student Paper',
  },
  {
    slug: 'stan-icdm-2021',
    title: 'STAN: Adversarial Network for Cross-domain Question Difficulty Prediction',
    authors: ['Ye Huang', 'Wei Huang', 'Shiwei Tong'],
    venue: 'ICDM', venueFull: 'IEEE International Conference on Data Mining',
    year: 2021, date: '2021-12-07', type: 'conference',
    doi: '10.1109/ICDM51629.2021.00032',
    tags: ['Adversarial', 'Difficulty', 'Cross-domain'],
  },
  {
    slug: 'lpkt-kdd-2021',
    title: 'Learning Process-consistent Knowledge Tracing',
    authors: ['Shuanghong Shen', 'Qi Liu', 'Enhong Chen', 'Zhenya Huang', 'Wei Huang'],
    venue: 'KDD', venueFull: 'ACM SIGKDD Conference on Knowledge Discovery and Data Mining',
    year: 2021, date: '2021-08-14', type: 'conference',
    doi: '10.1145/3447548.3467237',
    tags: ['Knowledge Tracing'],
    featured: true,
  },
  {
    slug: 'item-response-ranking-ijcai-2021',
    title: 'Item Response Ranking for Cognitive Diagnosis',
    authors: ['Shiwei Tong', 'Qi Liu', 'Runlong Yu', 'Wei Huang', 'Zhenya Huang', 'Zachary A. Pardos', 'Weijie Jiang'],
    venue: 'IJCAI', venueFull: 'International Joint Conference on Artificial Intelligence',
    year: 2021, date: '2021-08-19', type: 'conference',
    doi: 'https://www.ijcai.org/proceedings/2021/241',
    tags: ['IRT', 'Cognitive Diagnosis'],
  },
  {
    slug: 'similar-exercises-icdm-2020',
    title: 'Exploiting Knowledge Hierarchy for Finding Similar Exercises in Online Education Systems',
    authors: ['Wei Tong', 'Shiwei Tong', 'Wei Huang'],
    venue: 'ICDM', venueFull: 'IEEE International Conference on Data Mining',
    year: 2020, date: '2020-11-17', type: 'conference',
    doi: '10.1109/ICDM50108.2020.00171',
    tags: ['Education', 'Similarity', 'Hierarchy'],
  },
  {
    slug: 'structure-based-kt-icdm-2020',
    title: 'Structure-based Knowledge Tracing: An Influence Propagation View',
    authors: ['Shiwei Tong', 'Qi Liu', 'Wei Huang'],
    venue: 'ICDM', venueFull: 'IEEE International Conference on Data Mining',
    year: 2020, date: '2020-11-17', type: 'conference',
    doi: '10.1109/ICDM50108.2020.00065',
    tags: ['Knowledge Tracing', 'Graph'],
    featured: true,
  },
  {
    slug: 'fine-grained-similarity-mm-2020',
    title: 'Fine-Grained Similarity Measurement between Educational Videos and Exercises',
    authors: ['Xin Wang', 'Wei Huang', 'Qi Liu'],
    venue: 'ACM MM', venueFull: 'ACM International Conference on Multimedia',
    year: 2020, date: '2020-10-12', type: 'conference',
    doi: '10.1145/3394171.3413783',
    tags: ['Multi-modal', 'Education', 'Similarity'],
  },
  {
    slug: 'social-aware-rec-jcst-2020',
    title: 'Exploiting Structural and Temporal Influence for Dynamic Social-Aware Recommendation',
    authors: ['Yang Liu', 'Zhi Li', 'Wei Huang', 'Tong Xu', 'Enhong Chen'],
    venue: 'JCST', venueFull: 'Journal of Computer Science and Technology',
    year: 2020, date: '2020-03-01', type: 'journal',
    doi: '10.1007/s11390-020-9956-9',
    tags: ['Recommendation', 'Social Network'],
  },
  {
    slug: 'harnn-cikm-2019',
    title: 'Hierarchical Multi-label Text Classification: An Attention-based Recurrent Network Approach',
    authors: ['Wei Huang', 'Enhong Chen', 'Qi Liu', 'Yuying Chen', 'Zai Huang', 'Yang Liu', 'Zhou Zhao', 'Dan Zhang', 'Shijin Wang'],
    venue: 'CIKM', venueFull: 'ACM International Conference on Information and Knowledge Management',
    year: 2019, date: '2019-11-03', type: 'conference',
    doi: '10.1145/3357384.3357885',
    code: 'https://github.com/RandolphVI/Hierarchical-Multi-Label-Text-Classification',
    tags: ['Hierarchical', 'Multi-label', 'Attention', 'NLP'],
    featured: true,
  },
];

function escapeYaml(s) {
  if (s == null) return '""';
  const str = String(s);
  if (/[:#&*!|>'"%@`\[\]{},?]/.test(str) || /^\s|\s$/.test(str)) {
    return `"${str.replace(/"/g, '\\"')}"`;
  }
  return str;
}

for (const p of papers) {
  const lines = ['---'];
  lines.push(`title: ${escapeYaml(p.title)}`);
  lines.push('authors:');
  for (const a of p.authors) lines.push(`  - ${escapeYaml(a)}`);
  lines.push(`venue: ${escapeYaml(p.venue)}`);
  if (p.venueFull) lines.push(`venueFull: ${escapeYaml(p.venueFull)}`);
  lines.push(`year: ${p.year}`);
  lines.push(`date: ${p.date}`);
  lines.push(`type: ${p.type}`);
  if (p.doi) lines.push(`doi: ${escapeYaml(p.doi)}`);
  if (p.arxiv) lines.push(`arxiv: ${escapeYaml(p.arxiv)}`);
  if (p.code) lines.push(`code: ${escapeYaml(p.code)}`);
  if (p.tags && p.tags.length) {
    lines.push('tags:');
    for (const t of p.tags) lines.push(`  - ${escapeYaml(t)}`);
  }
  if (p.featured) lines.push('featured: true');
  if (p.correspondingAuthor) lines.push('correspondingAuthor: true');
  lines.push('---', '');
  if (p.award) {
    lines.push(`> 🏆 **${p.award}**`);
    lines.push('');
  }
  lines.push(`发表于 ${p.year} 年 ${p.venueFull || p.venue}。`);
  lines.push('');
  fs.writeFileSync(path.join(PAPERS_DIR, `${p.slug}.md`), lines.join('\n'));
}

// ---------- PROJECTS ----------
const projects = [
  // Localization (5)
  { slug: 'esoteric-ebb-chinese', name: 'Esoteric Ebb 中文化', description: 'CRPG 独立游戏 Esoteric Ebb 的简体中文本地化项目。', date: '2024-08-01', category: 'localization', language: 'C#', stars: 69, repo: 'https://github.com/RandolphVI/EsotericEbb_Chinese', tags: ['Localization', 'CRPG', 'Indie'], featured: true },
  { slug: 'of-the-devil-chinese', name: 'of the Devil 中文化', description: '独立游戏 of the Devil 的简体中文本地化。', date: '2025-12-01', category: 'localization', stars: 2, repo: 'https://github.com/RandolphVI/oftheDevil_Chinese', tags: ['Localization', 'Indie'] },
  { slug: 'dead-in-antares-chinese', name: 'Dead in Antares 中文化', description: '独立游戏 Dead in Antares 的简体中文本地化。', date: '2025-08-01', category: 'localization', language: 'C#', stars: 3, repo: 'https://github.com/RandolphVI/DeadInAntares_Chinese', tags: ['Localization', 'Indie'] },
  { slug: 'the-pale-beyond-chinese', name: 'The Pale Beyond 中文化', description: '叙事冒险游戏 The Pale Beyond 的简体中文本地化。', date: '2025-04-01', category: 'localization', language: 'C#', stars: 1, repo: 'https://github.com/RandolphVI/ThePaleBeyond_Chinese', tags: ['Localization', 'Narrative'] },
  { slug: 'athanasy-chinese', name: 'Athanasy 中文化', description: 'Ren\'Py 视觉小说 Athanasy 的简体中文本地化。', date: '2025-03-01', category: 'localization', language: 'Ren\'Py', stars: 2, repo: 'https://github.com/RandolphVI/Athanasy_Chinese', tags: ['Localization', 'VN'] },

  // Research (10)
  { slug: 'multi-label-text-classification', name: 'Multi-Label Text Classification', description: '基于神经网络的多标签文本分类研究实现，TextCNN / RNN / RCNN 等模型对比。', date: '2018-01-01', category: 'research', language: 'Python', stars: 562, repo: 'https://github.com/RandolphVI/Multi-Label-Text-Classification', tags: ['NLP', 'Deep Learning', 'TensorFlow'], featured: true },
  { slug: 'hierarchical-multi-label-text-classification', name: 'Hierarchical Multi-Label Text Classification', description: 'CIKM 2019 论文配套代码：基于注意力的层级多标签文本分类网络（HARNN）。', date: '2019-09-01', category: 'research', language: 'Python', stars: 329, repo: 'https://github.com/RandolphVI/Hierarchical-Multi-Label-Text-Classification', paper: 'https://dl.acm.org/doi/10.1145/3357384.3357885', tags: ['NLP', 'Hierarchical', 'CIKM'], featured: true },
  { slug: 'text-pairs-relation-classification', name: 'Text Pairs Relation Classification', description: '句子对关系分类 / 语义相似度建模的神经网络实现。', date: '2018-06-01', category: 'research', language: 'Python', stars: 190, repo: 'https://github.com/RandolphVI/Text-Pairs-Relation-Classification', tags: ['NLP', 'Sentence Pair', 'Similarity'], featured: true },
  { slug: 'next-basket-recommendation', name: 'Next Basket Recommendation', description: '基于神经网络的下一篮推荐系统。', date: '2019-12-01', category: 'research', language: 'Python', stars: 48, repo: 'https://github.com/RandolphVI/Next-Basket-Recommendation', tags: ['Recommendation', 'Sequential'] },
  { slug: 'question-difficulty-prediction', name: 'Question Difficulty Prediction', description: '教育领域题目难度预测的神经网络模型实现。', date: '2019-03-01', category: 'research', language: 'Python', stars: 38, repo: 'https://github.com/RandolphVI/Question-Difficulty-Prediction', tags: ['NLP', 'Education', 'Difficulty'] },
  { slug: 'music-recommendation-system', name: 'Music Recommendation System', description: 'Kaggle KKBox 音乐推荐挑战赛的解决方案。', date: '2020-08-01', category: 'research', language: 'Python', stars: 33, repo: 'https://github.com/RandolphVI/Music-Recommendation-System', tags: ['Recommendation', 'Kaggle'] },
  { slug: 'deep-relevance-ranking', name: 'Deep Relevance Ranking', description: '问答和信息检索中的深度相关性排序。', date: '2020-08-01', category: 'research', language: 'Python', stars: 8, repo: 'https://github.com/RandolphVI/Deep-Relevance-Ranking', tags: ['IR', 'QA', 'Ranking'] },
  { slug: 'hyper-net', name: 'HyperNet', description: '在 NLP 任务中应用双曲空间表示。', date: '2020-09-01', category: 'research', language: 'Python', stars: 1, repo: 'https://github.com/RandolphVI/HyperNet', tags: ['NLP', 'Hyperbolic'] },
  { slug: 'time-series-prediction', name: 'Time Series Prediction', description: '基于神经网络的时间序列预测。', date: '2020-09-01', category: 'research', language: 'Python', stars: 1, repo: 'https://github.com/RandolphVI/Time-Series-Prediction', tags: ['Time Series'] },
  { slug: 'ai-gaokao', name: 'AI GaoKao', description: '面向高考数据集的 AI Benchmark。', date: '2025-12-01', category: 'research', language: 'Python', repo: 'https://github.com/RandolphVI/AI_GaoKao', tags: ['Benchmark', 'Education', 'LLM'] },
];

for (const p of projects) {
  const lines = ['---'];
  lines.push(`name: ${escapeYaml(p.name)}`);
  lines.push(`description: ${escapeYaml(p.description)}`);
  lines.push(`date: ${p.date}`);
  lines.push(`category: ${p.category}`);
  if (p.language) lines.push(`language: ${escapeYaml(p.language)}`);
  if (p.stars !== undefined) lines.push(`stars: ${p.stars}`);
  if (p.repo) lines.push(`repo: ${escapeYaml(p.repo)}`);
  if (p.demo) lines.push(`demo: ${escapeYaml(p.demo)}`);
  if (p.paper) lines.push(`paper: ${escapeYaml(p.paper)}`);
  if (p.tags && p.tags.length) {
    lines.push('tags:');
    for (const t of p.tags) lines.push(`  - ${escapeYaml(t)}`);
  }
  if (p.featured) lines.push('featured: true');
  lines.push('---', '');
  fs.writeFileSync(path.join(PROJECTS_DIR, `${p.slug}.md`), lines.join('\n'));
}

console.log(`Papers: ${papers.length}, Projects: ${projects.length}`);
