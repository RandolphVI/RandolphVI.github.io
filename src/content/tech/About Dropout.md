---
title: "About Dropout"
date: 2017-03-01
category: "AI"
tags: ["Machine Learning"]
description: "Dropout 是深度学习中防止过拟合提高效果的一个大杀器，但对于其为何有效，却众说纷纭。"
draft: false
---

![](https://farm5.staticflickr.com/4373/35507009504_3298ce3029_o.jpg)

> **更多 AI 文章：** [查看 AI 分类](/categories/AI/)

# Dropout

开篇明义，dropout 是指在深度学习网络的训练过程中，对于神经网络单元，按照<strong>一定的概率</strong>将其<strong>暂时</strong>从网络中丢弃。注意是暂时，对于随机梯度下降来说，由于是随机丢弃，故而每一个 mini-batch 都在训练不同的网络。

Dropout 是深度学习中防止过拟合提高效果的一个大杀器，但对于其为何有效，却众说纷纭。在下读到两篇代表性的论文，代表两种不同的观点，特此分享给大家。

## 组合派

参考文献中第一篇[^1]中的观点，Hinton 在 2014 年提出的。

### 观点

该论文从神经网络的难题出发，一步一步引出 dropout 为何有效的解释。大规模的神经网络有两个缺点：

- 费时
- 容易过拟合

这两个缺点是深度学习上的两大瓶颈，过拟合是很多机器学习的通病，过拟合了，得到的模型基本就废了。而为了解决过拟合问题，一般会采用 ensemble 方法，即训练多个模型做组合，此时，费时就成为一个大问题，不仅训练起来费时，测试起来多个模型也很费时。总之，几乎形成了一个死锁。

Dropout 的出现很好的可以解决这个问题，每次做完 dropout，相当于从原始的网络中找到一个更瘦的网络，如下图所示：

![](https://farm4.staticflickr.com/3878/33037649431_ab442383e2_o.png)

因而，对于一个有 $N$ 个节点的神经网络，有了 dropout 后，就可以看做是 $2^n$ 个模型的集合了，但此时要训练的参数数目却是不变的，这就解脱了费时的问题。

## Motivation

虽然直观上看 dropout 是 ensemble 在分类性能上的一个近似，然而实际中，dropout 毕竟还是在一个神经网络上进行的，只训练出了一套模型参数。那么他到底是因何而有效呢？这就要从动机上进行分析了。论文中作者对 dropout 的动机做了一个十分精彩的类比：

> A motivation for dropout comes from a theory of the role of sex in evolution (Livnat et al., 2010). Sexual reproduction involves taking half the genes of one parent and half of the other, adding a very small amount of random mutation, and combining them to produce an offspring. The asexual alternative is to create an offspring with a slightly mutated copy of the parent’s genes. It seems plausible that asexual reproduction should be a better way to optimize individual fitness because a good set of genes that have come to work well together can be passed on directly to the offspring. On the other hand, sexual reproduction is likely to break up these co-adapted sets of genes, especially if these sets are large and, intuitively, this should decrease the fitness of organisms that have already evolved complicated co- adaptations. However, sexual reproduction is the way most advanced organisms evolved.
>
> **One possible explanation for the superiority of sexual reproduction is that, over the long term, the criterion for natural selection may not be individual fitness but rather mix-ability of genes.** The ability of a set of genes to be able to work well with another random set of genes makes them more robust. Since a gene cannot rely on a large set of partners to be present at all times, it must learn to do something useful on its own or in collaboration with a small number of other genes. **According to this theory, the role of sexual reproduction is not just to allow useful new genes to spread throughout the population, but also to facilitate this process by reducing complex co-adaptations that would reduce the chance of a new gene improving the fitness of an individual.** Similarly, each hidden unit in a neural network trained with dropout must learn to work with a randomly chosen sample of other units. This should make each hidden unit more robust and drive it towards creating useful features on its own without relying on other hidden units to correct its mistakes. However, the hidden units within a layer will still learn to do different things from each other. One might imagine that the net would become robust against dropout by making many copies of each hidden unit, but this is a poor solution for exactly the same reason as replica codes are a poor way to deal with a noisy channel.
>
> A closely related, but slightly different motivation for dropout comes from thinking about successful conspiracies. Ten conspiracies each involving five people is probably a better way to create havoc than one big conspiracy that requires fifty people to all play their parts correctly. If conditions do not change and there is plenty of time for rehearsal, a big conspiracy can work well, but with non-stationary conditions, the smaller the conspiracy the greater its chance of still working. Complex co-adaptations can be trained to work well on a training set, but on novel test data they are far more likely to fail than multiple simpler co-adaptations that achieve the same thing.

大概的意思，讲的是：

在自然界中，在中大型动物中，一般是有性繁殖，有性繁殖是指后代的基因从父母两方各继承一半。但是从直观上看，似乎无性繁殖更加合理，因为无性繁殖可以保留大段大段的优秀基因。而有性繁殖则将基因随机拆了又拆，破坏了大段基因的联合适应性。

但是自然选择中毕竟没有选择无性繁殖，而选择了有性繁殖，须知物竞天择，适者生存。我们先做一个假设，那就是基因的力量在于混合的能力而非单个基因的能力。不管是有性繁殖还是无性繁殖都得遵循这个假设。为了证明有性繁殖的强大，我们先看一个概率学小知识。

比如要搞一次恐怖袭击，两种方式： 

-  集中 50 人，让这 50 个人准确分工，搞一次大爆破。 
-  将 50 人分成10组，每组 5 人，分头行事，去随便什么地方搞点动作，成功一次就算。

哪一个成功的概率比较大？ 显然是后者。

那么，类比过来，有性繁殖的方式不仅仅可以将优秀的基因传下来，还可以降低基因之间的联合适应性，使得复杂的大段大段基因联合适应性变成比较小的一个一个小段基因的联合适应性。

Dropout 也能达到同样的效果，它强迫一个神经单元，和随机挑选出来的其他神经单元共同工作，达到好的效果。消除减弱了神经元节点间的联合适应性，增强了泛化能力。

个人补充一点：那就是植物和微生物大多采用无性繁殖，因为他们的生存环境的变化很小，因而不需要太强的适应新环境的能力，所以保留大段大段优秀的基因适应当前环境就足够了。而高等动物却不一样，要准备随时适应新的环境，因而将基因之间的联合适应性变成一个一个小的，更能提高生存的概率。

### Dropout带来的模型的变化

而为了达到 ensemble 的特性，有了 dropout 后，神经网络的训练和预测就会发生一些变化。

- 训练层面

  无可避免的，训练网络的每个单元要添加一道概率流程。 

  ![](https://farm3.staticflickr.com/2588/32782576600_aefb2c6586_o.png)

  对应的公式变化如下如下：

  - 没有 dropout 的神经网络 
    $$
    \begin{aligned}
    z_{i}^{(l+1)} & = w_{i}^{(l+1)}y^{l} + b_{i}^{(l+1)} \\
    y_{i}^{(l+1)} & = f(z_{i}^{(l+1)})
    \end{aligned}
    $$

  - 有 dropout 的神经网络 
    $$
    \begin{aligned}
    r_{i}^{(l)} & \sim Bernoulli(p) \\
    \tilde{y}^{(l)} & = r^{(l)} * y^{(l)} \\
    z_{i}^{(l+1)} & = w_{i}^{(l+1)} \tilde{y}^{l} + b_{i}^{(l+1)} \\
    y_{i}^{(l+1)} & = f(z_{i}^{(l+1)})
    \end{aligned}
    $$
  
- 测试层面

  预测的时候，每一个单元的参数要预乘以 $p$。

  ![](https://farm4.staticflickr.com/3817/33123833046_48bf6f3dba_o.png) 

### 论文中的其他技术点

- 防止过拟合的方法：

  - 提前终止（当验证集上的效果变差的时候）
  - L1 和 L2 正则化加权
  - Soft Weight Sharing
  - Dropout

- Dropout 率的选择

  - 经过交叉验证，隐含节点 dropout 率等于 0.5 的时候效果最好，原因是 0.5 的时候 dropout 随机生成的网络结构最多。
  - Dropout 也可以被用作一种添加噪声的方法，直接对 input 进行操作。输入层设为更接近 1 的数。使得输入变化不会太大（0.8）。

- 训练过程 

  - 对参数 $w$ 的训练进行球形限制（max-normalization），对 dropout 的训练非常有用。
  - 球形半径 $c$ 是一个需要调整的参数。可以使用验证集进行参数调优。
  - Dropout 单独使用效果不错，但是 <strong>dropout</strong>、<strong>max-normalization</strong>、<strong>large decaying learning rates</strong> 以及 **high momentum** 组合起来效果更好，比如 max-norm regularization 就可以防止大的 learning rate 导致的参数 blow up。
  - 使用 pretraining 方法也可以帮助 dropout 训练参数，在使用 dropout 时，要将所有参数都乘以 $\frac{1}{p}$。

- 部分实验结论

  该论文的实验部分很丰富，有大量的评测数据。

  - maxout 神经网络中得另一种方法，`Cifar-10` 数据集上超越 dropout

  - 文本分类上，dropout 效果提升有限，分析原因可能是 `Reuters-RCV1` 数据集中数据量足够大，过拟合并不是模型的主要问题

  - dropout 与其他 standerd regularizers 的对比 

  - - L2 weight decay
    - lasso
    - KL-sparsity
    - max-norm regularization
    - dropout

  - 特征学习 

    - 标准神经网络，节点之间的相关性使得他们可以合作去 fix 其他节点中得噪声，但这些合作并不能在 unseen data 上泛化，于是，过拟合，dropout 破坏了这种相关性。在 autoencoder 上，有 dropout 的算法更能学习有意义的特征（不过只能从直观上，不能量化）。
    - 产生的向量具有稀疏性。
    - 保持隐含节点数目不变，dropout 率变化；保持激活的隐节点数目不变，隐节点数目变化。

  - 数据量小的时候，dropout 效果不好，数据量大了，dropout 效果好

  - 模型均值预测

    - 使用 weight-scaling 来做预测的均值化
    - 使用 mente-carlo 方法来做预测。即对每个样本根据 dropout 率先 sample 出来 $k$ 个 net，然后做预测，$k$ 越大，效果越好。

  - Multiplicative Gaussian Noise 

    使用高斯分布的 dropout 而不是伯努利模型 dropout

  - dropout 的缺点就在于训练时间是没有 dropout 网络的 2-3 倍。


>
> 进一步需要了解的知识点
>
>- dropout RBM
>- Marginalizing Dropout 
>- 具体来说就是将随机化的 dropout 变为确定性的，比如对于 Logistic 回归，其 dropout 相当于加了一个正则化项
>- Bayesian neural network 对稀疏数据特别有用，比如 medical diagnosis, genetics, drug discovery and other computational biology applications
>

## 噪声派

参考文献中第二篇[^2]论文中得观点，也很强有力。

### 观点

观点十分明确，就是对于每一个 dropout 后的网络，进行训练时，相当于做了 Data Augmentation，因为，总可以找到一个样本，使得在原始的网络上也能达到 dropout 单元后的效果。 比如，对于某一层，dropout 一些单元后，形成的结果是 `(1.5,0,2.5,0,1,2,0)`，其中 0 是被 drop 的单元，那么总能找到一个样本，使得结果也是如此。这样，每一次 dropout 其实都相当于增加了样本。

### 稀疏性

#### 知识点 A

首先，先了解一个知识点：

> When the data points belonging to a particular class are distributed along a linear manifold, or sub-space, of the input space, it is enough to learn a single set of features which can span the entire manifold. But when the data is distributed along a highly non-linear and discontinuous manifold, the best way to represent such a distribution is to learn features which can explicitly represent small local regions of the input space, effectively “tiling” the space to define non-linear decision boundaries.

大致含义就是： 

在线性空间中，学习一个整个空间的特征集合是足够的，但是当数据分布在非线性不连续的空间中得时候，则学习局部空间的特征集合会比较好。

#### 知识点 B

假设有一堆数据，这些数据由 $M$ 个不同的非连续性簇表示，给定 $K$ 个数据。那么一个有效的特征表示是将输入的每个簇映射为特征以后，簇之间的重叠度最低。使用 $A$ 来表示每个簇的特征表示中激活的维度集合。重叠度是指两个不同的簇的 $A_{i}$ 和 $A_{j}$ 之间的 Jaccard 相似度最小，那么：

- 当 $K$ 足够大时，即便 $A$ 也很大，也可以学习到最小的重叠度
- 当 $K$ 小，$M$ 大时，学习到最小的重叠度的方法就是减小 $A$ 的大小，也就是稀疏性

上述的解释可能是有点太专业化，比较拗口。主旨意思是这样，我们要把不同的类别区分出来，就要是学习到的特征区分度比较大，在数据量足够的情况下不会发生过拟合的行为，不用担心。但当数据量小的时候，可以通过稀疏性，来增加特征的区分度。

> 因而有意思的假设来了，使用了 dropout 后，相当于得到更多的局部簇，同等的数据下，簇变多了，因而为了使区分性变大，就使得稀疏性变大。
>

为了验证这个数据，论文还做了一个实验，如下图：

![](https://farm3.staticflickr.com/2517/33185584305_9d146f80be_o.png)

该实验使用了一个模拟数据，即在一个圆上，有 15000 个点，将这个圆分为若干个弧，在一个弧上的属于同一个类，一共 10 个类，即不同的弧也可能属于同一个类。改变弧的大小，就可以使属于同一类的弧变多。

实验结论就是当弧长变大时，簇数目变少，稀疏度变低。与假设相符合。

个人观点：该假设不仅仅解释了 dropout 何以导致稀疏性，还解释了 dropout 因为使局部簇的更加显露出来，而根据知识点 A 可得，使局部簇显露出来是 dropout 能防止过拟合的原因，而稀疏性只是其外在表现。

### 论文中的其他技术知识点

- 将 dropout 映射回得样本训练一个完整的网络，可以达到 dropout 的效果。

- Dropout 由固定值变为一个区间，可以提高效果。

- 将 dropout 后的表示映射回输入空间时，并不能找到一个样本 $x^{*}$ 使得所有层都能满足 dropout 的结果，但可以为每一层都找到一个样本，这样，对于每一个 dropout，都可以找到一组样本可以模拟结果。

- Dropout 对应的还有一个 dropConnect，公式如下：

  - dropout
    $$
    h_{n} = \overrightarrow{w_{n}}^{T}(\overrightarrow{r} \odot \overrightarrow{x}) + b_{n}
    $$

  - dropConnect
    $$
    h_{n} = (\overrightarrow{r_{n}} \odot \overrightarrow{w_{n}})^{T}\overrightarrow{x} + b_{n}
    $$
    

- 试验中，纯二值化的特征的效果也非常好，说明了稀疏表示在进行空间分区的假设是成立的，一个特征是否被激活表示该样本是否在一个子空间中。

[^1]: Srivastava N, Hinton G, Krizhevsky A, et al. Dropout: A simple way to prevent neural networks from overfitting[J]. The Journal of Machine Learning Research, 2014, 15(1): 1929-1958.

[^2]: Dropout as data augmentation. [http://arxiv.org/abs/1506.08700](http://arxiv.org/abs/1506.08700)
