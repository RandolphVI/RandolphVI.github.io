---
title: "About Word Representation"
date: 2017-10-13
category: "AI"
tags: ["NLP", "Papers"]
description: "「Efficient Estimation of Word Representation in Vector Space」"
draft: false
---

![](https://farm5.staticflickr.com/4373/35507009504_3298ce3029_o.jpg)

> ** 更多 AI 文章： ** [查看 AI 分类](/categories/AI/)

# 「Efficient Estimation of Word Representation in Vector Space」

本文

## Introduction

Introduction 里面提及了：

- ## Model Architecture

![]()

### 

## Experiments

### Datasets

实验部分就是使用几个常见的 Datasets，其中用到的有：

- ​

### Experiment Setting


## Results and Discussion

---

# 「Bag of Tricks for Efficient Text Classification」

本文主要介绍了 Word2Vec 作者，Facebook AI 科学家 Mikolov 在 2016 年提出的 FastText 文本分类方法。

## Introduction

Introduction 里面提及了：

- 神经网络很流行，在文本分类上的性能表现也很喜人。但是存在训练时间长的弊端，在大型数据集上难以发挥。
- 在文本分类的任务上，线性分类器经常会作为一个基准模型，尽管会相对简单，如果特征选取得当，也可以获得很好的性能表现（Despite their simplicity, they often obatin state-of-art performances if the right features are used）。
- 本文基于词向量的有效性，在此基础上使用含有 rank constraint & a fast loss approximation 的线性模型，即 FastText 模型，用于处理标签预测以及情感分析的任务。

## Model Architecture

![](https://farm5.staticflickr.com/4508/37001961843_15cc54cf88_o.png)

FastText 模型架构如上图所示。FastText 模型输入一个词的序列（一段文本或者一句话 )，输出这个词序列属于不同类别的概率。序列中的词和词组组成特征向量，特征向量通过线性变换映射到中间层，中间层再映射到标签。FastText 在预测标签时使用了非线性激活函数，但在中间层不使用非线性激活函数。

FastText 模型架构和 Word2Vec 中的 CBOW 模型很类似。不同之处在于，FastText 预测标签，而 CBOW 模型预测中间词（This architecture is similar to the CBOW model of Mikolov, where the middle word is replaced by a label）。

FastText 简而言之，就是把文档中所有词通过 lookup table 变成向量，取平均后直接用线性分类器得到分类结果。FastText 和 ACL-15 上的 Deep Averaging Network（DAN）相似，区别就是去掉了中间的隐层。两篇文章的结论也比较类似，也是指出对一些简单的分类任务，没有必要使用太复杂的网络结构就可以取得差不多的结果。

### Hierarchical Softmax

在某些文本分类任务中，当输出的类别非常巨大的时候，使用线性分类器的计算开销就显得非常的大，时间复杂度为 $O(kh)$，其中 $k$ 是类别的个数，$h$ 是词序列向量的维度。

为了改善运行的时间，FastText 模型使用了 Hierarchical softmax 层次化的 Softmax 来优化，其是建立在哈夫曼编码的基础上，对标签先进行编码，能够极大地缩小模型预测目标的数量。对应的时间复杂度降至为 $O(log\_{2}(k)h)$，这个和之前 Mikolov 自己在 2013 年在谷歌团队发表的 Word2Vec 的 「Efficient Estimation of Word Representations in Vector Space」 这篇论文中，使用了一样的 trick。

另外，同样地，当计算输出类别的 Top K 问题时，可以使用二叉堆（binary heap）来优化，其时间复杂度可以从 $O(K)$ 降至 $O(log(K))$，其中 $K$ 是 $K$ 个最有可能的类别。

#### N-gram features

FastText 可以用于文本分类和句子分类，不管是文本分类还是句子分类，我们常用的特征是词袋模型（BOW）。但词袋模型不能考虑词之间的顺序，因此 FastText 还加入了 N-gram 特征。“我 爱 她” 这句话中的词袋模型特征是 “我”，“爱”, “她”。这些特征和句子 “她 爱 我” 的特征是一样的。如果加入 2-Ngram，第一句话的特征还有 “我 - 爱” 和 “爱 - 她”，这两句话 “我 爱 她” 和 “她 爱 我” 就能区别开来了。当然为了提高效率，我们需要过滤掉低频的 N-gram。

另外，本文还提到了使用 hashing trick 来减少 N-gram 的存储开销（We maintain a fast and memory efficient mapping of the n-grams by using the ***hashing trick*** ）。

## Experiments

### Sentiment Analysis

#### Datasets

实验部分使用到的 Datasets，可以详细参照 ** 「Text Understanding from Scratch」 ** 这篇论文。

#### Experiment Setting

- Number of training epochs: 5;
- Hidden Layer: 10;
- learning rate: {0.05, 0.1, 0.25, 0.5}.

#### Results

实验结果为：

![](https://farm5.staticflickr.com/4449/37652878592_03a1046ba2_o.png)

从实验结果可以看到 FastText 的性能会略好于 char-CNN 以及 char-RCNN，但会稍微差于 VDCNN（Very Deep Convolutional Network）。本文提到，可以通过使用 bigrams 能够进一步提高 FastText 的效果，提升的效果大概为 1-4%，还可以通过使用更多的 n-grams 来提高效果，例如图中使用 trigrams，在 Sogou 数据集上的准确率达到了 97.1%。

下图表示训练单个 epoch 的各个模型所需要的时间，可以看到 FastText 拥有无以伦比的训练速度，这也是其优势的体现。

![](https://farm5.staticflickr.com/4467/37652792812_a365b50bcc_o.png)

### Tag Prediction

#### Datasets

实验部分使用到的 Datasets：

- ​YFCC100M，该数据集包含将近 1 亿张图片以及摘要、标题和标签。

#### Experiment Setting

- Number of training epochs: 5;
- Hidden Layer: 50 and 200.

#### Results

实验是将 FastText 模型和 Tagspace 模型进行对比，使用数据集中的摘要信息和标题信息去预测标签。Tagspace 模型是建立在 Wsabie 模型的基础上的。Wsabie 模型除了利用 CNN 抽取特征之外，还提出了一个带权近似配对排序 (Weighted Approximate-Rank Pairwise, WARP) 损失函数用于处理预测目标数量巨大的问题。

实验结果为：

![](https://farm5.staticflickr.com/4511/37636040486_57085a7686_o.png)

从实验结果来看 FastText 能够取得比 Tagspace 好的效果，并拥有无以伦比的训练测试速度。不仅如此，通过使用 bigrams 能够进一步地提升效果。但严格来说，这个实验对 Tagspace 有些不公平。YFCC100M 数据集是关于多标签分类的，即需要模型能从多个类别里预测出多个类。Tagspace 确实是做多标记分类的；但 FastText 只能做多类别分类，只能从多个类别里预测出一个类。而评价指标 **prec@1** 只评价一个预测结果，即刚好能够使用 FastText。

## Discussion & Conclusion

个人认为，本文说明在合适的任务上应当使用合适的方法，像文本分类这样的任务，如果是长文本，即使用 BOW 也能做很不错的效果。
