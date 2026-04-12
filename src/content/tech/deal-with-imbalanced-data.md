---
title: "Deal with Imbalanced Data"
date: 2017-09-06
category: "ML-AI"
tags: ["Machine Learning"]
description: "Introduction"
draft: false
---

![](https://farm5.staticflickr.com/4300/35460446383_aafc34ca3c_o.jpg)

有关「Machine Learning」的其他学习笔记系列：[「Machine Learning」](http://randolph.pro/categories/Machine-Learning/)

# Introduction

在机器学习中，常常会遇到样本比例不平衡的问题，如对于一个二分类问题，正负样本的比例是 10:1。这种现象往往是由于本身数据来源决定的，如信用卡的征信问题中往往就是正样本居多。样本比例不平衡往往会带来不少问题，但是实际获取的数据又往往是不平衡的，因此本文主要讨论面对样本不平衡时的解决方法。

样本不平衡往往会导致模型对样本数较多的分类造成过拟合，即总是将样本分到了样本数较多的分类中；除此之外，一个典型的问题就是 [Accuracy Paradox](https://en.wikipedia.org/wiki/Accuracy_paradox)，这个问题指的是模型的对样本预测的准确率很高，但是模型的泛化能力差。其原因是模型将大多数的样本都归类为样本数较多的那一类，如下表所示:

| category | Predicted Negative | Predicted Positive |
| --- | --- | --- |
| Negative Cases | 9700 | 150 |
| Positive Cases | 50 | 100 |

准确率为：

而假如将所有的样本都归为预测为负样本，准确率会进一步上升，但是这样的模型显然是不好的，实际上，模型已经对这个不平衡的样本过拟合了。

针对样本的不平衡问题，可以从两个方面考虑：

- Data Level：
  - Over-Sampling
    - Random Over-Sampling
    - SMOTE
    - Borderline-SMOTE
    - ASASYN
  - Under-Sampling
    - Random Under-Samling
    - Easy Ensemble
    - Balance Cascade
    - NearMiss
  - Integration of
    - SMOTE + Tomek Links
    - SMOTE + ENN
  - Different resampled ratios
- Algorithm Level：
  - Try Different Algorithms
  - Try Penalized Models
  - Change the Performance Measures
  - Change the Model Training Process

但是，搜集更多的数据，从而让正负样本的比例平衡，这种方法往往是最被忽视的方法，然而实际上，当搜集数据的代价不大时，这种方法是最有效的。

但是需要注意，当搜集数据的场景本来产生数据的比例就是不平衡时，这种方法并不能解决数据比例不平衡问题。

# Data Level

在数据层面上，改变数据分布，从数据层面使得类别分布更为平衡。

对于一个不平衡样本，其样本数多的为 **majority**，样本数少的为 **minority**。整个 trainingset 为 $S$，**majority** 记为 ，**minority** 记为 。用 表示 **majority** 的样本数量，用 表示 **minority** 的样本数量。

对于随机采取部分 **majority** 的样本记为 ，其样本数量用 表示。  
对于随机采取部分 **minority** 的样本记为 ，其样本数量用 表示。

对数据重采样可以有针对性地改变数据中样本的比例，采样一般有两种方式：**Over-Sampling** 和 **Under-Sampling**。

**Over-Sampling** 是增加样本数较少的样本，其方式是直接复制原来的样本，通常简单的做法就是随机挑选 ，然后加入到 当中，增加的量通常是 ，因为增加了重复的样本，所以容易造成过拟合。

**Under-Sampling** 是减少样本数较多的样本，其方式是丢弃这些多余的样本，通过简单的做法就是随机挑选 ，然后将其去除，减少的量通常是 ，由于去除了原本样本中可能存在的重要信息，所以会导致欠拟合。

通常来说，当总样本数目较少的时候考虑 **Over-Sampling**，而样本数数目较多的时候考虑 **Under-Sampling**。

## Over-Sampling

过采样方法是针对少数的正样本，增加正样本的数量，从而提高整体 $F$ 值。最简单的过采样方法是简单地复制一些正样本。过采样的缺点是没有给正样本增加任何新的信息，这样训练得到的模型会有出现一定的过拟合问题。

另外，过采样方法对 SVM 算法是无效的。因为 SVM 算法是找支持向量，复制正样本并不能改变数据的支持向量。

### Random Over-Sampling

随机过采样是增加少数类样本数量，可以事先设置多数类与少数类最终的数量比例，在保留多数类样本不变的情况下，根据比例随机复制少数类样本，在使用的过程中为了保证所有的少数类样本信息都会被包含，可以先完全复制一份全量的少数类样本，再随机复制少数样本使得满足数量比例，具体步骤如下：

1. 首先在少数类 $S\_{min}$ 集合中随机选中一些少数类样本
2. 然后通过复制所选样本生成样本集合 $E$
3. 将它们添加到 中来扩大原始数据集从而得到新的少数类集合

最后， 中的总样本数增加了 个新样本，且 的类分布均衡度进行了相应的调整，如此操作可以改变类分布平衡度从而达到所需水平。当然，重复的样本过多，容易造成分类器的过拟合。

![](https://farm5.staticflickr.com/4362/37118453045_b9e9c4a044_o.png)

### SMOTE（Synthetic Minority Oversampling Technique）

在合成采样技术方面，Chawla NY 等人提出的 SMOTE 过采样技术是基于随机过采样算法的一种改进方案，由于随机过采样简单复制样本的策略来增加少数类样本，这样容易产生模型过拟合的问题，即使模型学习到的信息过于特别（Specific）而不够泛化(General)。

SMOTE 的主要思想是利用特征空间中现存少数类样本之间的相似性来建立人工数据，特别是，对于子集 ，对于每一个样本 使用 KNN 算法，其中 KNN 算法被定义为考虑 $S\_{min}$ 中的 K 个元素本身与 的欧氏距离在 $n$ 维特征空间 $X$ 中表现为最小幅度值的样本。**由于不是简单地复制少数类样本，因此可以在一定程度上避免分类器的过度拟合，实践证明此方法可以提高分类器的性能。但是由于对每个少数类样本都生成新样本，因此容易发生生成样本重叠（overlapping）的问题**。算法流程如下：

1. 对于少数类中的每一个样本 ，以欧氏距离为标准计算它到少数类样本集 中所有样本的距离，得到 K 近邻；
2. 根据样本不平衡比例设置一个采样比例以确定采样倍率 ，对于每一个少数类样本 ，从其 K 近邻中随机选择若干个样本，假设选择的近邻为 ；
3. 对于每一个随机选出的近邻 ，分别与原样本按照如下的公式构建新的样本:

![](https://farm5.staticflickr.com/4369/37075604245_e8b49bcb5e_o.png)

### Borderline-SMOTE

原始的 SMOTE 算法对所有的少数类样本都是一视同仁的，**但实际建模过程中发现那些处于边界位置的样本更容易被错分，因此利用边界位置的样本信息产生新样本可以给模型带来更大的提升**。Borderline-SMOTE 便是将原始 SMOTE 算法和边界信息算法结合的算法。算法流程如下：

1. 首先，对于每个 确定一系列 KNN 样本集，称该数据集为 ，且 ；
2. 然后，对每个样本 ，判断出最近邻样本集中属于多数类样本的个数，即：；
3. 最后，选择满足下面不等式的 的 ，将其加入危险集 **DANGER**，对危险集中的每一个样本点（最容易被错分的样本），采用普通的 SMOTE 算法生成新的少数类样本。

**NOISE**：如果一个 的 等于 $k$（即设定的近邻个数），表示这个 **minority** 点的周围全都是 的点，那么这个点就很有可能只是个干扰，或者是一个错误的 sample。

**DANGER**：如果一个 的 在 与 之间，表示这个 **minority** 点很有可能在 **minority** 与 **majority** 的边界边，或者已经到了 的范围内，因此有点“危险”。

**SAFE**：如果一个 的 少于 ，表示这个 **minority** 点还在 的范围内，算是比较“安全”。

在划分了三种级别的 **minority** 点之后，就开始采用普通的 SMOTE 算法产生新的少数类样本，但是只要是 **NOISE** 级别的，就不予产生，反而是 **Danger** 的才产生新的样本， **SAFE** 的产生意义就不是特别大，大多数机器学习算法的假设大多数会涵盖到 **SAFE** 该级别的附近，多了反而会产生过拟合。

![](https://farm5.staticflickr.com/4416/36680155240_e56c93ec1d_o.png)

### ADASYN

实际效果如下：

![](https://farm5.staticflickr.com/4407/36721703920_7ee63f5633_o.png)

## Under-Sampling

欠采样方法是针对多数的负样本，减少负样本的数量，反而提高整体 $F$ 值。最简单的欠采样方法是随机地删掉一些负样本。欠采样的缺点很明显，就是会丢失负样本的一些重要信息，不能够充分利用已有的信息，这样训练得到的模型只学到了总体模式的一部分。

### Random Under-Sampling

减少多数类样本数量最简单的方法便是随机剔除多数类样本，可以事先设置多数类与少数类最终的数量比例，在保留少数类样本不变的情况下，根据比例随机选择多数类样本。

1. 首先我们从 中随机选取一些多数类样本
2. 将这些样本从 中移除，就有

![](https://farm5.staticflickr.com/4391/36948259812_969cfd4d20_o.png)

优点在于操作简单，只依赖于样本分布，不依赖任何距离信息，属于非启发式方法；缺点在于会丢失一部分多数类样本的信息，无法充分利用已有信息。

### Tomek Links

### Informed Under-Samling

Informed 欠采样算法可以解决传统随机欠采样造成的数据信息丢失问题，且表现出较好的不均衡数据分类性能。其中含有一些集成（Ensemble）的思想，主要的方法是 **EasyEnsemble** 算法和 **BalanceCascade** 算法。

#### Easy Ensemble

它把数据划分为两部分，分别是多数类样本和少数类样本，对于多数类样本 ，通过 $n$ 次  **有放回**  采样生成 $n$ 份子集，每份子集的大小为 。然后，让少数类样本 分别和这 份样本合并训练 AdaBoost 分类器，这样可以得到 个模型，最终的模型采用加权多数表决的方法，加大分类误差率小的弱分类器的权值，使其在表决中起较大的作用，减小分类误差率大的弱分类器的权值，使其在表决中起较小的作用。这里假设多数类样本为 $N$，少数类样本为 $P$，算法伪代码如下：

![](https://farm5.staticflickr.com/4349/36924720872_f6dc5d18bc_o.png)

EasyEnsemble 的想法是多次随机欠采样，尽可能全面地涵盖所有信息，算法特点是利用 **boosting** 减小偏差（Adaboost）、**bagging** 减小方差（Ensemble Classifier）。实际应用的时候也可以尝试选用不同的分类器来提高分类的效果。算法的流程如下：

![](https://farm5.staticflickr.com/4409/36281899963_45beb23bde_o.png)

实际的效果如下：

![](https://farm5.staticflickr.com/4362/36282852314_18efd6065f_o.png)

#### Balance Cascade

**EasyEnsemble** 算法训练的子过程是独立的，**BalanceCascade** 则是一种级联算法，这种级联的思想在图像识别中用途非常广泛。算法伪代码如下：

![](https://farm5.staticflickr.com/4423/36924728072_b27ef319a3_o.png)

**BalanceCascade** 和 **EasyEnsemble** 方法接近，但并不是对于多数类样本 一次性直接生成多个子集，而是先生成一个子集 ，让少数类样本 和这个子集 样本合并训练出一个分类器，通过这个分类器判断整个多数类 ，将判断错误的挑出来。用判断错误的 中生成一个新的子集 ，并且再让少数类样本和该子集 样本合并训练出一个分类器，然后继续通过这个新的分类器继续判断整个多数类 ，将判断错误的挑出来，如此不停地用这种流程进行下去，直到先用完 sample 或者判断准确，程序停止。

可以看出，**BalanceCascade** 算法每次循环的前置条件都是根据上一次判断错误的结果来生成 sample 。

**BalanceCascade** 算法得到的是一个级联分类器，将若干个强分类器由简单到复杂排列，只有和少数类样本特征比较接近的才有可能输入到后面的分类器，比如边界点，因此能更充分地利用多数类样本的信息，一定程度上解决随机欠采样的信息丢失问题。

实际效果如下：

![](https://farm5.staticflickr.com/4390/36976962741_8a22144772_o.png)

#### NearMiss

**NearMiss** 方法是利用距离远近剔除多数类样本的一类方法，实际操作就是依据 KNN 算法，有以下三种方法：

- **NearMiss 1**：对于多数样本类 中的某个点，计算该点和离自己最近的 少数类的 3 个点的总距离，按值从小到大排序，根据指定个数 $n$， 保留 $n$ 个样本。

![](https://farm5.staticflickr.com/4392/36976824531_e1ecb1b0d1_o.png)

- **NearMiss 2**：对于多数样本类 中的某个点，计算该点和离自己最远的 少数类的 3 个点的总距离，按值从小到大排序，根据指定个数 $n$， 保留 $n$ 个样本。

![](https://farm5.staticflickr.com/4442/36976823751_dd2854ca84_o.png)

- **NearMiss 3**：首先事前给定一个值 $a$，对于少数样本类 中的每个点，保留和自己距离最近的 $a$ 个多数类点。

![](https://farm5.staticflickr.com/4361/36976822951_d483540f26_o.png)

**NearMiss-1** 和 **NearMiss-2** 方法的描述仅有一字之差，但其含义是完全不同的：

**NearMiss-1** 考虑的是与最近的 3 个少数类样本的平均距离，是局部的；**NearMiss-2** 考虑的是与最远的 3 个少数类样本的平均距离，是全局的。

**NearMiss-1** 方法得到的多数类样本分布也是”不均衡“的，它倾向于在比较集中的少数类附近找到更多的多数类样本，而在孤立的（或者说是离群的）少数类附近找到更少的多数类样本，原因是 **NearMiss-1** 方法考虑的局部性质和平均距离。

**NearMiss-3** 方法则会使得每一个少数类样本附近都有足够多的多数类样本，显然这会使得模型的精确度高、召回率低。

**NearMiss** 算法实际效果如下：

![](https://farm5.staticflickr.com/4336/37117835945_006294f37c_o.png)

### CNN(Condensed Nearest Neighbours)

这里的 CNN 不是卷积神经网络的简称，而是 Condensed Nearest Neighbours 压缩最近邻算法，通过 CNN 算法来进行 Under-Sampling。

## Integration of

将过采样和欠采样结合。

### SMOTE + Tomek Links

实际效果如下：

![](https://farm5.staticflickr.com/4363/36305865973_b4c970d546_o.png)

### SMOTE + ENN

实际效果如下：

![](https://farm5.staticflickr.com/4411/36305863773_0780f863b0_o.png)

## Different resampled ratios

尝试不同的采样比例，有些时候 1:1 的比例并不是最好的，因为与现实情况相差甚远。

# Algorithm Level

在算法层面上，改变分类算法，在传统分类算法的基础上对不同类别采取不同的加权方式，使得模型更看重少数类。

## Try Different Algorithms

强烈建议不要对待每一个分类都使用自己喜欢而熟悉的分类算法。应该使用不同的算法对其进行比较，因为不同的算法适用于不同的任务与数据。

例如，**决策树** 往往在类别不均衡数据上表现不错。它使用基于类变量的划分规则去创建分类树，因此可以强制地将不同类别的样本分开。目前流行的决策树算法有：**`C4.5`**、**`C5.0`**、**`CART`** 和 **`Random Forest`** 等。

## Try Penalized Models

可以使用相同的分类算法，但是使用一个不同的角度，比如你的分类任务是识别那些小类，那么可以对分类器的小类样本数据增加权值，降低大类样本的权值，从而使得分类器将重点集中在小类样本身上。一个具体做法就是，在训练分类器时，若分类器将小类样本分错时额外增加分类器一个小类样本分错代价，这个额外的代价可以使得分类器更加“关心”小类样本。如 `penalized-SVM` 和 `penalized-LDA` 算法。另外，刚开始，可以设置每个类别的权值与样本个数比例的倒数，然后可以使用过采样进行调优。

如果你锁定一个具体的算法时，并且无法通过使用重采样来解决不均衡性问题，此时你便可以使用惩罚模型来解决不平衡性问题。但是，设置惩罚矩阵是一个复杂的事，因此你需要根据你的任务尝试不同的惩罚矩阵，并选取一个较好的惩罚矩阵。

## Change the Performance Measures

改变评判指标，也就是不用准确率来评判和选择模型，原因就是我们上面提到的 Accuracy Paradox 问题。从开头的分析可以看出，准确度这个评价指标在类别不均衡的分类任务中并不能很好的适用，甚至还会进行误导（尽管单从这个指标的数值上而言很高，但是模型的泛化能力很差）。因此在样本不均衡的分类任务中，需要使用更有说服力的评价指标来对分类器进行评价。

实际上有一些评判指标就是专门解决样本不平衡时的评判问题的，如：

- 混淆矩阵（Confusion Matrix）
- 准确率（Precision）
- 召回率（Recall）
- F1 值

特别是：

- [ROC（AUC）](http://alexkong.net/2013/06/introduction-to-auc-and-roc/)
- [Kappa](https://en.wikipedia.org/wiki/Cohen%27s_kappa)

如何针对不同的问题选择有效的评价指标，可以阅读这篇文章：[Classification Accuracy is Not Enough: More Performance Measures You Can Use](http://machinelearningmastery.com/classification-accuracy-is-not-enough-more-performance-measures-you-can-use/)。

## Change the Model Training Process

更改模型的训练过程。假设超大类中样本的个数是极小类中样本个数的 $L$ 倍，那么在随机梯度下降（SGD，stochastic gradient descent）算法中，每次遇到一个极小类中样本进行训练时，训练 $L$ 次。

参考：

> - [8 Tactics to Combat Imbalanced Classes in Your Machine Learning Dataset](http://machinelearningmastery.com/tactics-to-combat-imbalanced-classes-in-your-machine-learning-dataset/)
> - [Learning from Imbalanced Data](http://www.ele.uri.edu/faculty/he/PDFfiles/ImbalancedLearning.pdf)
> - [SMOTE: Synthetic Minority Over-sampling Technique](http://www.jair.org/media/953/live-953-2037-jair.pdf)
> - [Borderline-SMOTE: A New Over-Sampling Method inImbalanced Data Sets Learning](http://sci2s.ugr.es/keel/pdf/specific/congreso/han_borderline_smote.pdf)
> - [ADASYN: Adaptive Synthetic Sampling Approach for ImbalancedLearning](https://pdfs.semanticscholar.org/4823/4756b7cf798bfeb47328f7c5d597fd4838c2.pdf)
> - [Two Modifications of CNN](http://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=4309452)
> - [Exploratory Undersampling for Class-Imbalance Learning](https://cs.nju.edu.cn/zhouzh/zhouzh.files/publication/tsmcb09.pdf)
> - [KNN Approach to Unbalanced Data Distributions: A Case Study Involving Information Extraction](https://www.site.uottawa.ca/~nat/Workshop2003/jzhang.pdf)
