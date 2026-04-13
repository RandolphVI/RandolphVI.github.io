---
title: "About Field-aware Factorization Machines"
date: 2017-11-11
category: "AI"
tags: ["Machine Learning", "Papers"]
description: "本文主要介绍了 Field-aware Factorization Machines 在 广告点击率（CTR）任务上的一篇论文。"
draft: false
---

![](https://farm5.staticflickr.com/4373/35507009504_3298ce3029_o.jpg)

> **更多 AI 文章：** [查看 AI 分类](/categories/AI/)

## 「Field-aware Factorization Machines for CTR Prediction 」

FM 和 FFM 模型都是最近几年提出的模型，凭借其在数据量比较大并且特征稀疏的情况下，仍然能够得到优秀的性能和效果的特性，屡次在各大公司举办的 CTR 预估比赛中获得不错的战绩。

FFM（Field-aware Factorization Machine）最初的概念来自 Yu-Chin Juan（阮毓钦，毕业于中国台湾大学，现在美国 Criteo 工作）与其比赛队员，是他们借鉴了来自 Michael Jahrer 的论文[「Ensemble of Collaborative Filtering and Feature Engineered Models for Click Through Rate Prediction」](https://kaggle2.blob.core.windows.net/competitions/kddcup2012/2748/media/Opera.pdf)中的 field 概念提出了 FM 的升级版模型，该篇于 2016 年发布。

### Introduction

在 CTR 任务中，大部分样本数据特征是非常稀疏的，使用  One-hot 编码会造成特征空间剧增。而通过对大量样本数据的观察发现某些特征经过关联之后，与最后预测的 label  的相关性就会提高。

因此使用多项式模型，考虑特征之间的组合会更加直观。

## Related Work

### Poly 2

在多项式模型中，特征 $x_i$ 和 $x_j$ 的组合采用 $x_ix_j$ 表示，即 $x_i$ 和 $x_j$都非零时，组合特征 $x_ix_j$ 才有意义。典型的二阶多项式模型的表达式如下：
$$
y(\mathbf{x}) = w_0+ \sum_{i=1}^n w_i x_i + \sum_{i=1}^n \sum_{j=i+1}^n w_{ij} x_i x_j 
$$
其中，$n$ 代表样本的特征数量，$$x_ i$$ 是第 $$i$$个特征的值，$$w_0$$、$$w_i$$、$$w_{ij}$$ 是模型参数。这也是 Poly2 （Degree-2 Polynomial Model ）模型的表达式。

从公式（1）可以看出，组合特征的参数一共有 $\frac{n(n−1)}{2}$ 个，任意两个参数都是独立的。然而，在数据稀疏性普遍存在的实际应用场景中，二次项参数的训练是很困难的。其原因是，每个参数 $$w_{ij}$$ 的训练需要大量 $$x_i$$ 和 $$x_j$$ 都非零的样本；由于样本数据本来就比较稀疏，满足“$$x_i$$ 和 $$x_j$$ 都非零”的样本将会非常少。训练样本的不足，很容易导致参数 $$w_{ij}$$ 不准确，最终将严重影响模型的性能。

### FM

因此，为了解决二次项参数的训练问题，FM 模型基于矩阵分解的思想，在原有表达式对其稍微进行了一点改动：
$$
y(\mathbf{x}) = w_0+ \sum_{i=1}^n w_i x_i + \sum_{i=1}^n \sum_{j=i+1}^n \left \langle v_{i},v_{j} \right \rangle x_i x_j
$$
其中，$n$ 代表样本的特征数量，$$x_ i$$ 是第 $i$ 个特征的值，$$w_0$$、$$w_i$$、$$v_{i}$$、$$v_{j}$$ 是模型参数。$$v_{i}$$、$$v_{j}$$ 表示长度为 $k $ 的隐向量，包含 $k$ 个描述特征的因子，$k$ 为超参数，$$\left \langle v_{i},v_{j} \right \rangle$$ 表示向量点积。

根据公式，二次项的参数数量减少为 $kn$ 个，远小于 Poly2 模型的参数数量。而且，最重要的是，参数的因子化使得 $$x_ix_j$$ 的参数和 $$x_ix_t$$ 的参数不再是相互独立的，因此我们可以在样本稀疏的情况下相对合理地估计 FM 的二次项参数。具体来说，$$x_ix_j$$ 和 $$x_ix_t$$ 的系数分别为 $$\left \langle v_{i},v_{j} \right \rangle$$ 和 $$\left \langle v_{i},v_{t} \right \rangle$$，它们之间有共同项 $$v_i$$。也就是说，所有包含“$$x_i$$ 的非零组合特征”（存在某个 $j≠i$，使得 $$x_ix_j≠0$$）的样本都可以用来学习隐向量 $$v_i$$，这很大程度上避免了数据稀疏性造成的影响。而在 Poly2 模型中，$$w_iw_j$$ 和 $$w_iw_t$$ 是相互独立的。

FM 模型比起 Poly 2 模型，其优点显而易见：

- 通常 CTR 任务的数据量都是十分庞大的，FM 的参数数量比起 Poly 2 要明显减少，减少了模型的训练时间。
- FM 的参数并不是相互独立，可以从其他的参数学习得到，在样本稀疏性非常明显的情况下，能够的得到更好更准确的参数，提高了模型的精度。

### FFM

而我们今天的主角 FFM 模型，在 FM 模型表达式的基础上，更进一步：
$$
y(\mathbf{x}) = w_0+ \sum_{i=1}^n w_i x_i + \sum_{i=1}^n \sum_{j=i+1}^n \left \langle v_{i,f_{2}},v_{j,f_{1}} \right \rangle x_i x_j
$$
其中，$n$ 代表样本的特征数量，$$x_ i$$ 是第 $i$ 个特征的值，$$w_0$$、$$w_i$$、$$v_{i,f_{2}}$$、$$v_{j,f_{1}}$$ 是模型参数。$$v_{i,f_{2}}$$、$$v_{j,f_{1}}$$ 表示长度为 $k$ 的隐向量，包含 $k$ 个描述特征的因子，$k$ 为超参数，$$\left \langle v_{i},v_{j} \right \rangle$$ 表示向量点积。$$\left \langle v_{i},v_{j} \right \rangle$$ 变成了 $$\left \langle v_{i,f_{2}},v_{j,f_{1}} \right \rangle$$ ，其中 $$f_1$$、$$f_2$$ 表示 $$x_i$$ 与 $$x_j$$ 所属的 field。

举个例子：

| Clicked | Publisher(P) | Advertiser(A) | Gender(G) |
| ------- | ------------ | ------------- | --------- |
| Yes     | ESPN         | Nike          | Male      |

对于 FM 模型而言，$\phi_{FM}(w,x)$ 为：
$$
\phi_{FM}(w,x) = w_{ESPN} \cdot w_{Nike} + w_{ESPN} \cdot w_{Male} + w_{Nike} \cdot w_{Male}
$$
而对于 FFM 模型而言，$\phi_{FFM}(w, x)$ 为：
$$
\phi_{FM}(w,x) = w_{ESPN,A} \cdot w_{Nike,P} + w_{ESPN,G} \cdot w_{Male,P} + w_{Nike,G} \cdot w_{Male,A}
$$
在 FM 模型中，每个特征只有一个隐向量需要学习，而 FFM 则需要学习多个隐向量，取决于与其组合的特征的 field。例如对于特征 ESPN 的参数 $$w_{ESPN}$$ ，它可以通过与特征 Nike 组合（$$w_{ESPN} \cdot w_{Nike}$$）或者 特征 Male 的组合（$$w_{ESPN} \cdot w_{Male}$$）来学习。然而，由于 Nike 与 Male 分别属于不同的 field ，因此（ESPN, NIKE）与（ESPN, Male）所造成的影响是不一样。

可以看到，$$w_{ESPN, A}$$ 是因为 Nike 的 field 为 Advertiser（A），$$w_{ESPN,G}$$ 是因为 Male 的 field 为 Gender（G）。

#### FFM 模型数据格式

$$
label \quad field_1:feat_1:val_1 \quad field_2:feat_2:val_2 \quad ...
$$

 对于大多数特征都可以用这样的方法表示，但是对于一些特征：

1. 类别型特征

   例如上表的数据，处理成 FFM 数据格式的话：
   $$
   1 \quad P:ESPN:1 \quad A:Nike:1 \quad G:Male:1
   $$

2. 数值型特征

   对于数值型特征，例如下表数据：

| Accepted | AR    | Hidx | Cite  |
| -------- | ----- | ---- | ----- |
| Yes      | 45.73 | 2    | 3     |
| No       | 1.04  | 100  | 50000 |

   有两种处理成 FFM 数据格式的方式：

   - Treat each feature as a dummy field:
     $$
     1 \quad AR:AR:45.73 \quad Hidx:Hidx:2 \quad Cite:Cite:3
     $$

   - Discretize each numerical feature to a categorical one:
     $$
     1 \quad AR:45:1 \quad Hidx:2:1 \quad Cite:3:1
     $$

   注意到第二种处理方法，将 AR 这 field 中的特征值进行了处理，将 $45.73$ 处理成 $45.7$、$45$、$40$ 甚至是 $int(log(45.73))$ 都是可行的。

1. 单 field 特征

   经常在 NLP 任务上出现，例如如下表数据：

| good mood | sentence                        |
| --------- | ------------------------------- |
| Yes       | Hooray!  Our paper is accepted! |
| No        | Well, our paper is rejected..   |

   所有的特征都属于同一个 field — `sentence`，那么我们的做法就是将 `sentence` 这一 field 放置在每个分词特征之前，相当于是从 FFM 降低到 FM。 

### Experiments

#### Experiment Setting

**1. 数据集**

数据集为 Kaggle 两个比赛的数据集：

- Criteo
- Avazu

| Data Set | instances  | features | fields |
| -------- | ---------- | -------- | ------ |
| Criteo   | 45,840,617 | $10^6$   | 39     |
| Avazu    | 40,428,968 | $10^6$   | 33     |

**2. 模型训练及参数**

模型的优化方法为普通的 SG （Stochastic Gradient），再加上 FFM 中需要我们设定的超参数 $k$ ，因此模型的参数为： 

- $k$ 隐向量的长度；
- $\lambda$ 学习率；
- $\eta$ 步长；

**3. 实验结果**

![FFM](https://farm5.staticflickr.com/4552/24489629838_2654e8c9e6_o.png)

#### Results and Discussion

相较于 LM、Poly 2 以及 FM 模型，FFM 在该两个数据集上表现更好，拥有更高的准确率。
