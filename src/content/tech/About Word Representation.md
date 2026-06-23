---
title: "About Word Representations"
date: 2017-10-13
category: "AI"
tags: ["NLP", "Papers"]
description: "「Efficient Estimation of Word Representations in Vector Space」"
draft: false
---

![](https://farm5.staticflickr.com/4373/35507009504_3298ce3029_o.jpg)

> **更多 AI 文章：** [查看 AI 分类](/categories/AI/)

## 「Efficient Estimation of Word Representations in Vector Space」

本文是 Word2Vec 的奠基性论文，由 Mikolov 等人[^1] 于 2013 年在谷歌团队发表，提出了 CBOW 与 Skip-gram[^3] 两种高效的词向量训练模型，能够在十亿级语料上以极低的计算开销学习到高质量的分布式词表示。

### Introduction

论文 Introduction 部分阐述了以下几个核心论点：

- 传统 NLP 系统往往把词当作最小的原子单位，词与词之间只有编号、没有相似性的概念（如 one-hot 表示）。这种做法简单鲁棒，配合海量数据训练的简单模型甚至能胜过小数据上的复杂模型，但其表达能力终究受限。
- 以 Bengio 提出的前馈神经网络语言模型（NNLM）以及后续的循环神经网络语言模型（RNNLM）为代表的方法能够学到分布式词向量，效果显著，但隐藏层带来的计算开销过大，难以在超大规模语料上训练。
- 本文的目标是：在拥有数十亿词、词表上百万的超大数据集上，高效地学习高质量的词向量。作者发现，学到的词向量不仅刻画了词与词之间的相似度，还捕捉到了惊人的线性规律——例如 `vector("King") - vector("Man") + vector("Woman")` 的结果最接近 `vector("Queen")`。
- 为了量化这种规律，作者设计了一个语义—句法词关系测试集（Semantic-Syntactic Word Relationship test set），用词类比（analogy）任务来衡量词向量的质量。

### Model Architecture

<figure style="margin:1.8rem auto;text-align:center;max-width:680px;">
<svg viewBox="0 0 720 270" role="img" aria-label="CBOW 与 Skip-gram 模型架构对比" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:'Josefin Sans',sans-serif;">
  <defs>
    <marker id="w2v-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0 0 L10 5 L0 10 z" style="fill:var(--color-muted);"/>
    </marker>
  </defs>
  <line x1="360" y1="40" x2="360" y2="230" style="stroke:var(--color-border-light);stroke-width:1;"/>
  <text x="185" y="28" text-anchor="middle" style="fill:var(--color-heading);font-size:15px;letter-spacing:1px;">CBOW</text>
  <text x="185" y="44" text-anchor="middle" style="fill:var(--color-muted);font-size:10px;letter-spacing:1px;">上下文 → 中心词</text>
  <text x="535" y="28" text-anchor="middle" style="fill:var(--color-heading);font-size:15px;letter-spacing:1px;">Skip-gram</text>
  <text x="535" y="44" text-anchor="middle" style="fill:var(--color-muted);font-size:10px;letter-spacing:1px;">中心词 → 上下文</text>
  <line x1="110" y1="78" x2="150" y2="135" marker-end="url(#w2v-arrow)" style="stroke:var(--color-muted);stroke-width:1.1;"/>
  <line x1="110" y1="118" x2="150" y2="135" marker-end="url(#w2v-arrow)" style="stroke:var(--color-muted);stroke-width:1.1;"/>
  <line x1="110" y1="158" x2="150" y2="135" marker-end="url(#w2v-arrow)" style="stroke:var(--color-muted);stroke-width:1.1;"/>
  <line x1="110" y1="198" x2="150" y2="135" marker-end="url(#w2v-arrow)" style="stroke:var(--color-muted);stroke-width:1.1;"/>
  <line x1="220" y1="135" x2="266" y2="135" marker-end="url(#w2v-arrow)" style="stroke:var(--color-muted);stroke-width:1.1;"/>
  <g style="fill:var(--color-surface);stroke:var(--color-border-dark);stroke-width:1;">
    <rect x="24" y="64" width="86" height="28" rx="3"/>
    <rect x="24" y="104" width="86" height="28" rx="3"/>
    <rect x="24" y="144" width="86" height="28" rx="3"/>
    <rect x="24" y="184" width="86" height="28" rx="3"/>
    <rect x="270" y="121" width="86" height="28" rx="3"/>
  </g>
  <rect x="150" y="115" width="70" height="40" rx="3" style="fill:var(--color-accent);stroke:var(--color-accent-dark);stroke-width:1;"/>
  <g text-anchor="middle" style="fill:var(--color-heading);font-size:12px;">
    <text x="67" y="82">w(t-2)</text>
    <text x="67" y="122">w(t-1)</text>
    <text x="67" y="162">w(t+1)</text>
    <text x="67" y="202">w(t+2)</text>
    <text x="313" y="139">w(t)</text>
  </g>
  <text x="185" y="139" text-anchor="middle" style="fill:var(--color-bg);font-size:11px;letter-spacing:1px;">SUM</text>
  <line x1="458" y1="135" x2="484" y2="135" marker-end="url(#w2v-arrow)" style="stroke:var(--color-muted);stroke-width:1.1;"/>
  <line x1="556" y1="135" x2="598" y2="78" marker-end="url(#w2v-arrow)" style="stroke:var(--color-muted);stroke-width:1.1;"/>
  <line x1="556" y1="135" x2="598" y2="118" marker-end="url(#w2v-arrow)" style="stroke:var(--color-muted);stroke-width:1.1;"/>
  <line x1="556" y1="135" x2="598" y2="158" marker-end="url(#w2v-arrow)" style="stroke:var(--color-muted);stroke-width:1.1;"/>
  <line x1="556" y1="135" x2="598" y2="198" marker-end="url(#w2v-arrow)" style="stroke:var(--color-muted);stroke-width:1.1;"/>
  <g style="fill:var(--color-surface);stroke:var(--color-border-dark);stroke-width:1;">
    <rect x="372" y="121" width="86" height="28" rx="3"/>
    <rect x="600" y="64" width="86" height="28" rx="3"/>
    <rect x="600" y="104" width="86" height="28" rx="3"/>
    <rect x="600" y="144" width="86" height="28" rx="3"/>
    <rect x="600" y="184" width="86" height="28" rx="3"/>
  </g>
  <rect x="486" y="115" width="70" height="40" rx="3" style="fill:var(--color-accent);stroke:var(--color-accent-dark);stroke-width:1;"/>
  <g text-anchor="middle" style="fill:var(--color-heading);font-size:12px;">
    <text x="415" y="139">w(t)</text>
    <text x="643" y="82">w(t-2)</text>
    <text x="643" y="122">w(t-1)</text>
    <text x="643" y="162">w(t+1)</text>
    <text x="643" y="202">w(t+2)</text>
  </g>
  <text x="521" y="139" text-anchor="middle" style="fill:var(--color-bg);font-size:11px;letter-spacing:1px;">PROJ</text>
</svg>
<figcaption style="font-family:'KingHwa_OldSong',serif;font-size:0.85rem;color:var(--color-muted);margin-top:0.6rem;letter-spacing:0.02em;">CBOW 用上下文预测中心词，Skip-gram 反之——两者结构互为镜像。</figcaption>
</figure>

作者首先定义了模型的训练复杂度 $O = E \times T \times Q$，其中 $E$ 是训练轮数，$T$ 是语料中的词数，$Q$ 取决于具体的模型结构。在这一框架下对比已有模型后发现，无论是 NNLM 还是 RNNLM，计算量都主要消耗在非线性的隐藏层上。

本文的核心思想就是去掉隐藏层、只保留对数线性（log-linear）结构，以此换取在海量数据上的训练效率，并提出了两种模型：

- **CBOW（Continuous Bag-of-Words）**：用上下文窗口内的若干词去预测中心词。投影层对上下文词向量取平均，因此与词序无关（故称 Bag-of-Words），复杂度为 $Q = N \times D + D \times log\_{2}(V)$。
- **Skip-gram**：反过来，用中心词去预测窗口内的上下文词。距离中心词越远的词采样权重越低，复杂度为 $Q = C \times (D + D \times log\_{2}(V))$，其中 $C$ 是上下文窗口的最大跨度。

两者都借助 Hierarchical Softmax[^2] 把输出层的复杂度从 $O(V)$ 降到 $O(log\_{2}(V))$，这也正是 FastText 后来沿用的 trick。直观上，CBOW 训练更快、对高频词更友好；Skip-gram 则在低频词和语义类任务上表现更好。

### Experiments

#### Datasets

实验主要在 Google News 语料上进行，约含 60 亿词，词表取最高频的 100 万个词。评测使用作者构建的语义—句法词关系测试集，共约 8869 个语义类问题与 10675 个句法类问题（例如「Athens 之于 Greece，相当于 Oslo 之于 ?」「big 之于 biggest，相当于 small 之于 ?」），且只有当模型给出的词与标准答案完全一致时才算正确。

#### Experiment Setting

- 训练框架：谷歌内部的分布式框架 DistBelief，采用 mini-batch 异步随机梯度下降 + Adagrad 自适应学习率；
- 系统性地对比了不同的词向量维度 $D$ 与不同的训练数据量；
- 评价指标：词类比任务上的准确率（accuracy）。

### Results and Discussion

实验得出的主要结论：

- **维度与数据量需同步增长**：单纯增加词向量维度、或单纯增加训练数据，都会很快进入收益递减区间；二者一起增大才能持续提升效果。
- **两种模型各有侧重**：CBOW 在句法类任务上略优，Skip-gram 在语义类任务以及整体准确率上明显更好。用 300 维、约 7.83 亿词训练出的 Skip-gram 取得了当时最好的综合表现。
- **远超此前的神经网络语言模型**：在精度更高的同时，训练开销只是 NNLM / RNNLM 的一个零头。
- **线性语义规律**：词向量空间中存在大量可用向量加减来回答的类比关系（`King - Man + Woman ≈ Queen`），这一发现也成为后续词嵌入研究的重要基石。

---

## 「Bag of Tricks for Efficient Text Classification」

本文主要介绍了 Word2Vec 作者，Facebook AI 科学家 Mikolov[^1] 在 2016 年提出的 FastText 文本分类方法。

### Introduction

论文 Introduction 部分阐述了以下几个核心论点，为 FastText 的提出奠定了背景：

- 神经网络很流行，在文本分类上的性能表现也很喜人。但是存在训练时间长的弊端，在大型数据集上难以发挥。
- 在文本分类的任务上，线性分类器经常会作为一个基准模型，尽管会相对简单，如果特征选取得当，也可以获得很好的性能表现（Despite their simplicity, they often obtain state-of-art performances if the right features are used）。
- 本文基于词向量的有效性，在此基础上使用含有 rank constraint & a fast loss approximation 的线性模型，即 FastText 模型，用于处理标签预测以及情感分析的任务。

### Model Architecture

![](https://farm5.staticflickr.com/4508/37001961843_15cc54cf88_o.png)

FastText 模型架构如上图所示。FastText 模型输入一个词的序列（一段文本或者一句话），输出这个词序列属于不同类别的概率。序列中的词和词组组成特征向量，特征向量通过线性变换映射到中间层，中间层再映射到标签。FastText 在预测标签时使用了非线性激活函数，但在中间层不使用非线性激活函数。

FastText 模型架构和 Word2Vec 中的 CBOW 模型很类似。不同之处在于，FastText 预测标签，而 CBOW 模型预测中间词（This architecture is similar to the CBOW model of Mikolov, where the middle word is replaced by a label）。

FastText 简而言之，就是把文档中所有词通过 lookup table 变成向量，取平均后直接用线性分类器得到分类结果。FastText 和 ACL-15 上的 Deep Averaging Network（DAN）相似，区别就是去掉了中间的隐层。两篇文章的结论也比较类似，也是指出对一些简单的分类任务，没有必要使用太复杂的网络结构就可以取得差不多的结果。

#### Hierarchical Softmax

在某些文本分类任务中，当输出的类别非常巨大的时候，使用线性分类器的计算开销就显得非常的大，时间复杂度为 $O(kh)$，其中 $k$ 是类别的个数，$h$ 是词序列向量的维度。

为了改善运行的时间，FastText 模型使用了 Hierarchical softmax[^2] 层次化的 Softmax 来优化，其是建立在哈夫曼编码的基础上，对标签先进行编码，能够极大地缩小模型预测目标的数量。对应的时间复杂度降至为 $O(log\_{2}(k)h)$，这个和之前 Mikolov 自己在 2013 年在谷歌团队发表的 Word2Vec 的 「Efficient Estimation of Word Representations in Vector Space」 这篇论文中，使用了一样的 trick。

另外，同样地，当计算输出类别的 Top K 问题时，可以使用二叉堆（binary heap）来优化，其时间复杂度可以从 $O(K)$ 降至 $O(log(K))$，其中 $K$ 是 $K$ 个最有可能的类别。

##### N-gram features

FastText 可以用于文本分类和句子分类，不管是文本分类还是句子分类，我们常用的特征是词袋模型（BOW）。但词袋模型不能考虑词之间的顺序，因此 FastText 还加入了 N-gram 特征。“我 爱 她” 这句话中的词袋模型特征是 “我”，“爱”, “她”。这些特征和句子 “她 爱 我” 的特征是一样的。如果加入 2-Ngram，第一句话的特征还有 “我 - 爱” 和 “爱 - 她”，这两句话 “我 爱 她” 和 “她 爱 我” 就能区别开来了。当然为了提高效率，我们需要过滤掉低频的 N-gram。

另外，本文还提到了使用 hashing trick 来减少 N-gram 的存储开销（We maintain a fast and memory efficient mapping of the n-grams by using the ***hashing trick***）。

### Experiments

#### Sentiment Analysis

##### Datasets

实验部分使用到的 Datasets，可以详细参照 **「Text Understanding from Scratch」** 这篇论文。

##### Experiment Setting

- Number of training epochs: 5;
- Hidden Layer: 10;
- learning rate: {0.05, 0.1, 0.25, 0.5}.

##### Results

实验结果为：

![](https://farm5.staticflickr.com/4449/37652878592_03a1046ba2_o.png)

从实验结果可以看到 FastText 的性能会略好于 char-CNN 以及 char-RCNN，但会稍微差于 VDCNN（Very Deep Convolutional Network）。本文提到，可以通过使用 bigrams 能够进一步提高 FastText 的效果，提升的效果大概为 1-4%，还可以通过使用更多的 n-grams 来提高效果，例如图中使用 trigrams，在 Sogou 数据集上的准确率达到了 97.1%。

下图表示训练单个 epoch 的各个模型所需要的时间，可以看到 FastText 拥有无以伦比的训练速度，这也是其优势的体现。

![](https://farm5.staticflickr.com/4467/37652792812_a365b50bcc_o.png)

#### Tag Prediction

##### Datasets

实验部分使用到的 Datasets：

- YFCC100M，该数据集包含将近 1 亿张图片以及摘要、标题和标签。

##### Experiment Setting

- Number of training epochs: 5;
- Hidden Layer: 50 and 200.

##### Results

实验是将 FastText 模型和 Tagspace 模型进行对比，使用数据集中的摘要信息和标题信息去预测标签。Tagspace 模型是建立在 Wsabie 模型的基础上的。Wsabie 模型除了利用 CNN 抽取特征之外，还提出了一个带权近似配对排序 （Weighted Approximate-Rank Pairwise, WARP） 损失函数用于处理预测目标数量巨大的问题。

实验结果为：

![](https://farm5.staticflickr.com/4511/37636040486_57085a7686_o.png)

从实验结果来看 FastText 能够取得比 Tagspace 好的效果，并拥有无以伦比的训练测试速度。不仅如此，通过使用 bigrams 能够进一步地提升效果。但严格来说，这个实验对 Tagspace 有些不公平。YFCC100M 数据集是关于多标签分类的，即需要模型能从多个类别里预测出多个类。Tagspace 确实是做多标记分类的；但 FastText 只能做多类别分类，只能从多个类别里预测出一个类。而评价指标 **prec@1** 只评价一个预测结果，即刚好能够使用 FastText。

### Discussion & Conclusion

个人认为，本文说明在合适的任务上应当使用合适的方法，像文本分类这样的任务，如果是长文本，即使用 BOW 也能做很不错的效果。

[^1]: Tomas Mikolov 在谷歌期间创作了 Word2Vec（发表于 2013 年），后加入 Facebook AI 研究院（FAIR）。FastText 简化了架构但在具体任务上展示出相似甚至更好的性能。
[^2]: Hierarchical Softmax 基于 Huffman 编码树，将计算复杂度从 O(k) 降低到 O(log k)，它是 Word2Vec 高效训练的关键技术之一。
[^3]: CBOW（Continuous Bag-of-Words）与 Skip-gram 是 Word2Vec 的两种训练模式。CBOW 用上下文预测中心词，Skip-gram 用中心词预测上下文。Skip-gram 通常对少频词效果更好。
