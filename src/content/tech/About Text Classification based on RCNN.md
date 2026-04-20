---
title: "About Text Classification based on RCNN"
date: 2017-10-10
category: "AI"
tags: ["Deep Learning", "NLP", "Papers"]
description: "「Recurrent Convolutional Neural Networks for Text Classification」"
draft: false
---

![](https://farm5.staticflickr.com/4373/35507009504_3298ce3029_o.jpg)

> **更多 AI 文章：** [查看 AI 分类](/categories/AI/)

# 「Recurrent Convolutional Neural Networks for Text Classification」

本文为中科院团队在 2015 年 AAAI[^1] 上提出来的 RCNN 网络结构。

## Introduction

作者在论文 Introduction 部分重点提及了以下几个问题与动机：

- 词向量的发展（A key problem in text classification is feature repre  
  sentation）以及作者词向量方法的选取（pre-trained word embedding）。
- 之所以选择使用 RecurrentNN，一是因为 RecurrentNN 的时间复杂度为 $O(n)$，二是因为 RecurrentNN 的优势在于能够更好地捕捉上下文信息（The adavantage of RecurrentNN is the ability to better capture the contextual information）。而不选择使用 RecursiveNN，一是因为 RecursiveNN 的时间复杂度较高 $O(n^2)$，其中 $n$ 为文本的句子长度，所以导致 RecursiveNN 不太适合用来处理长文本信息，二是因为 RecursiveNN 是通过树形结构捕捉句子的语义信息（The RecursiveNN captures the semantics of a sentence via a tree structure），但实际上两两句子之间几乎无法通过树形结构来表示。
- 然而，尽管使用 RecurrentNN 具有如上的优势，但是其本质是一个 Biased Model，在一段文本中靠后的分词往往会比靠前的分词更加具有决定性的作用（where later words are more dominant than earlier words），因此这会导致模型在捕捉文本全局信息的时候会影响模型的性能，而一段文本中的关键部分并不会只是仅仅出现文本的句末，而是可能出现在文本中的任意位置，为了解决这一问题，作者使用了 CNN 模型中的 max-pooling 这一组件（which can fairly determine discriminative phrases in a text with a max-pooling layer）。

## Related Work

![](https://farm5.staticflickr.com/4452/36946829163_ef05233be9_o.png)

上面的图就是作者循环卷积网络的模型示意图，可以看到还是比较简单，先是用了双向循环网络：

其中， $c\_l(w\_i)$ 是分词 $w\_i$ 的左边部分文本，相应地， $c\_r(w\_i)$ 是分词 $w\_i$ 的右边部分文本。

根据式子（1），可以得知 是由 以及 （分词 的词向量）决定的。

最后是将 $c\_l(w\_i)$、$e(w\_i)$ 以及 $c\_r(w\_i)$ 合并在一起作为 $x\_i$，进行下一步的处理。

$y\_{i}^{2}$ 是一个潜在语义向量（a latent semantic vector），激活函数选择的是 tanh 双曲正切函数，接着使用 max-pooling layer：

最大池化层的作用就是将不定长的文本转换成固定长度的向量（The pooling layer converts texts with various lengths into a fixed-length vector），除了最大池化层，还可以选择平均池化层，但是不建议在该任务上使用（We do not use average pooling here because only a few words and their combination are useful for capturing the meaning of the document）。

进行完最大池化之后，就是输出层：

最后再使用 softmax 函数作用于 $y^{(4)}$，将其转换每个 label 或者 class 的概率：

可以看出来，网络的设计还是比较简单易懂的。

## Experiments

### Datasets

实验部分就是使用几个常见的 Datasets，其中用到的有：

- 20Newsgroups
- Fudan Set
- ACL Anthology Network
- Sentiment Treebank

### Experiment Setting

- 使用的 SGD 算法就是最简单的，设定的学习率 $\alpha = 0.01$；
- 隐含层的神经元个数为 $H=100$；
- 词向量的 Embedding dim 为 **50** 维；
- 词向量的训练方法为 <strong>Skip-gram model</strong>。

### Results and Discussion

我个人着重观察的部分是在各个数据集上 RCNN 模型与 CNN 的比较[^2]，结果是 RCNN 会比 CNN 的性能要高一到两个百分比。

[^1]: AAAI（Association for the Advancement of Artificial Intelligence）年会是人工智能领域最顶级学术会议之一，与 NeurIPS、ICML、ICLR 并列为 AI 领域最优影响力的顶会议。
[^2]: 个人观察：RCNN 比 CNN 性能高 1−2 个百分点的原因在于双向 RNN 能建模上下文上下文两个方向的选泽信息，补齐了 CNN 对上下文不敏感的短板。
