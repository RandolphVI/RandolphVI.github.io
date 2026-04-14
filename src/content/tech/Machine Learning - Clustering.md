---
title: "Machine Learning - Clustering"
date: 2017-01-03
category: "AI"
tags: ["Machine Learning", "Books"]
description: "本文是关于周志华「Machine Learning」这本书的 Clustering 的学习笔记。"
draft: false
---

![](https://farm5.staticflickr.com/4307/36174772306_62cfbc8cd6_o.jpg)

> **本系列文章：** [Chapter 1](/tech/machine-learning---chapter-1/) · [Chapter 2](/tech/machine-learning---chapter-2/) · [Clustering](/tech/machine-learning---clustering/) · [KNN & kd Tree](/tech/machine-learning---knn--kd-tree/)

# 聚类介绍

*   聚类是从数据集中挖掘相似观测值集合的方法。
*   聚类试图将数据集中的样本划分为若干个通常是不相交的子集，每个子集称为一个“簇”（cluster）。通过这样的划分，每个簇可能对应于一些潜在的概念（类别）。
*   聚类过程仅能自动形成簇结构，簇所对应的概念语义需由使用者自己来把握。
*   聚类既能作为一个单独的过程用于寻找数据内在的分布结构，也可以作为分类等其他学习任务的前驱过程。

----
## 聚类算法

**角度I：**

*    **基于原型的聚类（Prototype-based Clustering）**
     *   **K均值聚类（K-means）**
     *   **学习向量量化聚类（Learning Vector Quantization）**
     *   **高斯混合模型聚类 （Gaussian Mixture Model）**
*    **基于密度的聚类 （Density-based Clustering）**
     *   **DBSCAN （Density-Based Spatial Clustering of Application with Noise）**
     *   **OPTICS （Ordering Points To Identify the Clustering Structure）**
*    **层次聚类 （Hierarchical Clustering）**
*    **基于模型的聚类 （Model-based Clustering）**
     *   **混合回归模型 （Mixture Regression Model）**

**角度II：**

*   **基于中心的聚类： kmeans聚类**
*   **基于分布的聚类： GMM聚类**
*   **基于密度的聚类： DBSCAN, OPTICS**
*   **基于连通性的聚类： 层次聚类**
*   **基于模型的聚类： Miture Regression Model**
*   **其他聚类方法： 谱聚类, Chameleon, Canopy…**

----
## 聚类数据设置


假定样本集 $ D $ 包含 $n$ 个无标记样本：
$$
D = \{x_1, x_2, \ldots, x_n \}
$$

每个样本是一个 $p$ 维特征向量：
$$
x_i=(x_{i1}; x_{i2}; \ldots; x_{ip})
$$


聚类算法将样本集 $D$ 划分为 $k$ 个不相交的簇：
$$
\{C_l|l=1, 2, \ldots, k\}
$$

其中， $$(C_{l^{'}} \cap_{l^{'} \neq l} C_{l} = \emptyset)$$ 且 $$(D=\cup_{l=1}^{k}C_{l})$$。

相应的，用：
$$
\lambda_{i} \in {1, 2, \ldots, k}
$$

表示样本 $x_{i}$ 的“簇标记”（cluster label）, 即：
$$
x_{i} \in C_{\lambda_{i}}
$$

于是，聚类的结果可用包含 $n$ 个元素的簇标记向量表示：
$$
\lambda=(\lambda_{1}; \lambda_{2}, \ldots, \lambda_{n})
$$

-----

## 聚类性能度量

**聚类性能度量亦称聚类“有效性指标”（validity index）。**

**设置聚类性能度量的目的:**

- 对聚类结果，通过某种性能度量来评估其好坏；
- 若明确了最终将要使用的性能度量，则可直接将其作为聚类过程的优化目标，从而更好地得到符合要求的聚类结果。

**什么样的聚类结果比较好？**

- “簇内相似度”（intra-cluster similarity）高
- “蔟间相似度”（inter-cluster similarity）低

**聚类性能度量分类：**

- “外部指标”（external index）：将聚类结果与某个“参考模型”（reference model）进行比较。
- “内部指标”（internal index）：直接考察聚类结果而不利用任何参考模型。

### 外部指标

对数据集  $$D = \{x_1, x_2, \ldots, x_n\}$$，假定通过聚类，给出的簇划分为 $$V=\{v_{1}, v_{2}, \ldots, v_{C}\}$$，参考模型给出的簇划分为$$U=\{u_{1}, u_{2}\, \ldots, u_{R}\}$$。相应地，令$$\lambda$$ 与 $$\lambda^{*}$$分别表示与$V$和$U$对应的簇标记向量。我们将样本两两配对考虑，定义：

$$
\begin{aligned}
a & = |SS|, SS =\left \{  (x_i,x_j)|(\lambda_i = \lambda_j, \lambda_i^* =  \lambda_j^* , i < j )\right \} \\
b & = |SD|, SD =\left \{  (x_i,x_j)|(\lambda_i = \lambda_j, \lambda_i^* \neq  \lambda_j^* , i < j )\right \} \\
c & = |DS|, DS =\left \{  (x_i,x_j)|(\lambda_i \neq \lambda_j, \lambda_i^* =  \lambda_j^* , i < j )\right \} \\
d & = |DD|, DD =\left \{  (x_i,x_j)|(\lambda_i \neq \lambda_j, \lambda_i^* \neq  \lambda_j^* , i < j )\right \}
\end{aligned}
$$

其中：

- 集合 $SS$ 包含了在 $V$ 中隶属于相同簇且在 $U$ 中也隶属于相同簇的样本对；
- 集合 $SD$ 包含了在 $V$ 中隶属于相同簇且在 $U$ 中也隶属于不同簇的样本对；
- 集合 $DS$ 包含了在 $V$ 中隶属于不同簇且在 $U$ 中也隶属于相同簇的样本对；
- 集合 $DD$ 包含了在 $V$ 中隶属于不同簇且在 $U$ 中也隶属于不同簇的样本对；

这样，由于每个样本对 $$((x_{i}, x_{j})(i<j))$$ 仅能出现在一个集合中，因此有：
$$
a+b+c+d=n(n-1)/2
$$

#### JC (Jaccard Coefficient)
$$
JC = \frac{a}{a+b+c}
$$

JC系数的结果分布在$[0,1]$区间，值越大越好。个人总结，JC系数是一个比较“爱憎分明”的相似性度量指标，对于聚类效果越好的模型的JC计算结果会很好，对于聚类效果越差的模型的JC计算结果会很差。关于JC系数的数学解释及实际意义，可以参考Wiki对应词条，讲的非常清晰：[Jaccard index](https://en.wikipedia.org/wiki/Jaccard_index)。

在此我摘取其中的重点：

> When used for binary attributes, the Jaccard index is very similar to the Simple matching coefficient. The main difference is that the SMC has the term $M_{00}$ in its numerator and denominator, whereas the Jaccard index does not. Thus, the SMC compares the number of matches with the entire set of the possible attributes, whereas the Jaccard index only compares it to tshe attributes that have been chosen by at least A or B.

> **In market basket analysis for example, the basket of two consumers who we wish to compare might only contain a small fraction of all the available products in the store, so the SMC would always return very small values compared to the Jaccard index. Using the SMC would then induce a bias by systematically considering, as more similar, two customers with large identical baskets compared to two customers with identical but smaller baskets; thus making the Jaccard index a better measure of similarity in that context.**

> In other contexts, where 0 and 1 carry equivalent information (symmetry), the SMC is a better measure of similarity. For example, vectors of demographic variables stored in dummies variables, such as gender, would be better compared with the SMC than with the Jaccard index since the impact of gender on similarity should be equal, independent of whether male is defined as a 0 and female as a 1 or the other way around. However, when we have symmetric dummy variables, one could replicate the behaviour of the SMC by splitting the dummies into two binary attributes (in this case, male and female), thus transforming them into asymmetric attributes, allowing the use of the Jaccard index without introducing the bias. By using this trick, the Jaccard index can be considered as making the SMC a fully redundant metric. The SMC remains however more computationally efficient in the case of symmetric dummy variables since it doesn't require adding extra dimensions.

> **In general, the Jaccard index can be considered as an indicator of local "similarity" while SMC evaluates "similarity" relative to the whole "universe".**Similarity and dissimilarity must be understood in a relative sense. For example, if there are only 2 attributes (x,y), then A=(1,0) is intuitively very different from B=(0,1). However if there are 10 attributes in the "universe", A=(1,0,0,0,0,0,0,0,0,0) and B=(0,1,0,0,0,0,0,0,0) are not intuitively so different anymore. If the focus comes back to be just on A and B, the remaining 8 attributes are often considered as redundant. As a result, A and B are very different in a "local" sense (which the Jaccard Index measures efficiently), but less different in a "global" sense (which the SMC measures efficiently). From this point of view, the choice of using SMC or the Jaccard index comes down to more than just symmetry and asymmetry of information in the attributes. The distribution of sets in the defined "universe" and the nature of the problem to be modeled should also be considered.

> The Jaccard index is also more general than the SMC and can be used to compare other data types than just vectors of binary attributes, such as Probability measures.

上段重点的大体意思是：JC的一个适用场景，例如商场或者电商（亚马逊）的用户们，在买东西的时候，我们对其相似性进行判断的时候，SMC（Simple Matching Coefficient）简单匹配系数并不太适用，是因为SMC中添加了（两个顾客都不感兴趣的商品这一信息），而JC并没有考虑这一部分。对于琳琅满目的商品信息而言，两个顾客不感兴趣的商品应该远远多于他们感兴趣的商品，简而言之，如果将顾客对所有的商品向量进行标记，感兴趣的为1，不感兴趣的为0，那么得到的这个向量应当是一个非常稀疏的。在这种情况下，如果使用SMC，势必会导致结果很小，但是实际上我们完全可以不考虑两个顾客都不感兴趣的内容，而是考虑两个顾客感兴趣的商品信息之和，对其进行计算，相对于SMC，得到的结果会好解释许多。就像那句话说的，<strong>JC就好比是一个局域性的“相似性”比较的衡量指标，而SMC就好比是要考虑整个宏观宇宙之下的“相似性”比较</strong>。


#### FMI (Fowlkes and Mallows Index)
$$
FMI = \sqrt{\frac{a}{a+b}\cdot \frac{a}{a+c}}
$$

FMI系数的结果分布在$[0,1]$区间，值越大越好。个人总结，FMI系数是一个比较“温文儒雅”的相似性度量指标，对于聚类效果特别好的模型的FMI计算结果不会好得特别夸张，对于聚类效果特别越差的模型的FMI计算结果也不会差得特别夸张。同样，FMI系数的数学解释及实际意义，对应的Wiki词条：[Fowlkes–Mallows index](https://en.wikipedia.org/wiki/Fowlkes–Mallows_index)。

在此我摘取其中的重点：

> Since the index is directly proportional to the number of true positives, a higher index means greater similarity between the two clusterings used to determine the index. **One of the most basic thing to test the validity of this index is to compare two clusterings that are unrelated to each other.** Fowlkes and Mallows showed that on using two unrelated clusterings, the value of this index approaches zero as the number of total data points chosen for clustering increase; whereas the value for the Rand index for the same data quickly approaches making Fowlkes–Mallows index a much more accurate representation for unrelated data. **This index also performs well if noise is added to an existing dataset and their similarity compared. Fowlkes and Mallows showed that the value of the index decreases as the component of the noise increases.** The index also showed similarity even when the noisy dataset had a different number of clusters than the clusters of the original dataset. Thus making it a reliable tool for measuring similarity between two clusters.

上段重点的大体意思是：“衡量一个相似性度量指标是否可靠，应当将对于两个完全不相关簇的研究也作为重要的判定基础之一”，这样讲可能太绕了，解释一下就是如果我们对一个相似性度量指标的可靠性进行判断，不仅仅需要：我们的模型与“参考模型”两个模型越相似（聚类效果越好），指标系数越大（或越小）；同样的，我们的模型与“参考模型”越不相似（聚类效果越差），指标系数也应该呈现一个单调变大（或变小）的趋势。

FMI与其他相似性度量指标的区别是，特别是与JC系数对比，JC系数 $[0,1]$ 的特点是假如我们的模型聚类效果越好，结果就越趋向于1，反之，如果我们的模型聚类效果越不好，结果就越趋向于0；而FMI $[0,1]$ 则不会显得那么“爱憎分明”，因为在 $[0,1]$ 范围内根号运算的存在，使得模型越好的结果不会好得特别夸张，但是模型越差的结果也不会显得特别夸张，因为根号运算起到一个“缓冲 ”的作用。另外一点，就是FMI系数对于含有噪声的数据集的判定效果仍然不错。

#### RI (Rand Index)
$$
RI = \frac{a+d}{a+b+c+d}
$$

RI系数的结果分布在$[0,1]$区间，值越大越好。关于RI系数的数学解释及实际意义，可以参考Wiki对应词条，重点是要看它的改进指标ARI：[Rand  index](https://en.wikipedia.org/wiki/Rand_index)。


#### ARI (Adjusted Rand Index)

  在<strong>RI（Rand Index）</strong>的评判基础上，为了实现“在聚类结果随机产生的情况下，指标应该接近零”，<strong>ARI（Adjusted Rand Index）</strong>系数被提出，它具有更高的区分度。

  > A problem with the Rand index is that the expected value of the Rand index of two random partitions does not take a constant value (say zero). The adjusted Rand index proposed by [Hubert and Arabie, 1985] assumes the generalized hypergeometric distribution as the model of randomness, i.e., the $U$ and $V$ partitions are picked at random such that the number of objects in the classes and clusters are fixed.
$$
ARI  = \frac{Rand \ Index - expected \ index}{maximum \ index - expected \ index} = \frac{RI - E(RI)}{1-E(RI)}
$$

进行进一步的展开推导后：
$$
API = \frac{\frac{a+d}{a+b+c+d} - \frac{(a+b)(a+c)+(c+d)(b+d)}{(a+b+c+d)^2}}{\frac{(a+b)(a+c)+(c+d)(b+d)}{(a+b+c+d)^2}}
$$

ARI系数结果分布在$[-1,1]$区间，负数代表结果不好，越接近于1意味着聚类结果与真实情况越吻合。个人总结，ARI系数对于任意数量的聚类中心和样本数，随机聚类的ARI都非常接近于0。ARI相比于RI好在，它是负数的时候就说明我们自己的模型很糟糕，有个更加相对明确的评判标准。（从广义的角度上来说，ARI衡量的是两个数据分布的吻合程度）

#### 举个具体例子计算 ARI
Let $$n_{ij}$$ be the number of objects that are in both class $$u_{i}$$ and cluster $$v_{j}$$. Let $$n_{i.}$$ and $$n_{.j}$$ be the number of objects in class $$u_{i}$$ and cluster $$v_{j}$$ respectively.The notations are illustrated in Table below:

$$
\begin{array}{c|cccc|c}
Class \ Cluster & v_{1}  & v_{2} & ... & v_{C} & Sums \\
\hline
u_{1} & n_{11} & n_{12} & ... & n_{1C} & n_{1.}  \\
u_{2} & n_{21} & n_{22} & ... & n_{2C} & n_{2.}  \\
... & ... & ... & ... & ... & ...  \\
u_{R} & n_{R1} & n_{R2} & ... & n_{RC} & n_{R.}  \\
\hline
Sums & n_{.1} & n_{.2} & ... & n_{.C} & n.. = n  \\
\end{array}
$$

Here is the example:

$$
\begin{array}{c|ccc|c}
Class \ Cluster & v_{1}  & v_{2} &  v_{3} & Sums \\
\hline
u_{1} & 1 & 1 &  0 & 2  \\
u_{2} & 1 & 2 &  1 & 4  \\
u_{3} & 0 & 0 &  4 & 4  \\
\hline
Sums & 2 & 3 & 5 & n = 10  \\
\end{array}
$$

$a$ is defined as the number of pairs of objects in the same class $U$ and same cluster in $V$,hence $a$ can be written as $$\sum_{i,j} \binom{n_{ij}}{2}$$.In Example,$$a = \binom{2}{2} + \binom{4}{2} = 7$$(所有不超过2的都不需要考虑，因为$$\binom{1}{2} = 0$$).

$b$ is defined as the number of pairs of objects in the same class in $U$ but not in the same cluster in $V$.In terms of the notation in Table, $b$ can be writtern as $$\sum_{i}\binom{n_{i.}}{2}-\sum_{i,j}\binom{n_{ij}}{2}$$. In Example, $$b = \binom{2}{2} + \binom{4}{2} + \binom{4}{2} - 7 = 6$$.

Similarly, $c$ is defined as the number of pairs of objects in the same cluster in $V$ but not in the same class in $U$, so $c$ can be writtern as $$\sum_{j}\binom{n_{.j}}{2}-\sum_{i,j}\binom{n_{ij}}{2} = \binom{2}{2} + \binom{3}{2} + \binom{5}{2} -7 = 7$$.

$d$ is defined as the number of pairs of objects that are not in the same class in $U$ and not in the same cluster in $V$. Since $$a + b + c + d = \binom{n}{2}$$, $$d = \binom{10}{2} -7 - 6 - 7 = 25$$.

The Rand Index for comparing the two partitions in Example is $\frac{7+25}{45} = 0.711$, while the adjusted Rand Index is 0.311.

**The Rand index is much higher than the adjusted Rand index, which is typical. Since the Rand index lies between 0 and 1, the expected value of the Rand index (although not a constant value) must be greater than or equal to 0.On the other hand, the expected value of the adjusted Rand index has value zero and the maximum value of the adjusted Rand is  also 1. Hence, there is a wider range of values that the adjusted Rand index can take on, thus increasing the sensitivity of the index.**


### 内部指标

根据聚类结果的簇划分 $$(C={C_{1}, C_{2}, \ldots, C_{k}})$$ ,定义：

- 簇 $C$ 内样本间的平均距离

$$
avg(C)=\frac{2}{|C|(|C|-1)}\sum_{1<i<j<|C|}dist(x_{i}, x_{j})
$$

- 簇 $C$ 内样本间的最远距离
$$
diam(C)=max_{1<i<j<|C|}dist(x_{i}, x_{j})
$$

- 簇 $$C_{i}$$ 与簇 $$C_{j}$$ 最近样本间的距离
$$
d{min}(C_{i}, C_{j})=min_{1<i<j<|C|}dist(x_{i}, x_{j})
$$
- 簇 $$C_{i}$$ 与簇 $$C_{j}$$ 中心点间的距离
$$
d_{cen}(C_{i}, C_{j})=dist(\mu_{i}, \mu_{j})
$$

其中：

- $dist(,)$ 是两个样本之间的距离
- $\mu$ 是簇 $C$ 的中心点 $$\mu=\frac{1}{|C|}\sum_{1<i<|C|}x_{i}$$


#### CP (Compactness)

$$
\begin{aligned}
\overline{CP_{i}} & =\frac{1}{|C_{i}|}\sum_{x_{i} \in C_{i}} dist(x_{i}, \mu_{i}) \\
\overline{CP} & =\frac{1}{k}\sum_{k=1}^{k} \overline{CP_{k}}
\end{aligned}
$$

CP紧密性，其计算的是每个簇中各个点到簇中心的平均距离，值越低意味着簇内聚类距离越近，缺点就是没有考虑到簇间效果。

#### SP (Separation)
$$
SP=\frac{2}{k^2-k}\sum^{k}_{i=1}\sum^{k}_{j=i+1} d_{cen}(\mu_{i}, \mu_{j})
$$
SP间隔性，其计算的是各簇中心两两之间的平均距离，值越高意味着簇间距离越远，缺点是没有考虑簇内效果。

#### DBI (Davies-Bouldin Index)
$$
DBI=\frac{1}{k}\sum^{k}_{i=1}\underset{j \neq i}{max}\bigg(\frac{avg(C_{i})+avg(C_{j})}{d_{cen}(\mu_{i}, \mu_{j})}\bigg)
$$

关于DBI系数的数学解释及实际意义，可以参考Wiki对应词条：[Davies-Bouldin Index](https://en.wikipedia.org/wiki/Davies–Bouldin_index)。

> These conditions constrain the index so defined to be symmetric and non-negative. Due to the way it is defined, as a function of the ratio of the within cluster scatter, to the between cluster separation, a lower value will mean that the clustering is better. **It happens to be the average similarity between each cluster and its most similar one, averaged over all the clusters, where the similarity is defined as $S_{i}$ above.** This affirms the idea that no cluster has to be similar to another, and hence the best clustering scheme essentially minimizes the Davies–Bouldin index. This index thus defined is an average over all the $i$ clusters, and hence a good measure of deciding how many clusters actually exists in the data is to plot it against the number of clusters it is calculated over. The number *i* for which this value is the lowest is a good measure of the number of clusters the data could be ideally classified into. This has applications in deciding the value of $k$ in the [kmeans](https://en.wikipedia.org/wiki/Kmeans) algorithm, where the value of k is not known apriori. 

DBI系数结果为非负数，值越小意味着簇内距离越小，同时簇间距离越大。个人总结，DBI其实就是将几个$$d_{max}$$的值叠加，当我们模型最后聚集了多少个Cluster簇，就会出现多少个$$d_{max}$$，这些$$d_{max}$$值叠加的结果越小，说明我们模型的聚类越合理。可以通过DBI系数来确定k-means中$k$的最佳值，即不同的$k$值对应不同的DBI结果，选取DBI结果最小时对应的$k$值，意味着此时这样划分$k$个簇是最合理，效果最佳的。其缺点是，因为使用的是欧式距离，所以对于环状分布，聚类评测比较糟糕。

#### DI (Dunn Index)
$$
DI=\underset{1 \leqslant i \leqslant k}{min}\bigg\{\underset{j \neq i}{min}\bigg(\frac{d_{min}(C_{i}, C_{j})}{max_{1 \leqslant l \leqslant k}diam(C_{l})}\bigg)\bigg\}
$$

关于DI系数的数学解释及实际意义，可以参考Wiki对应词条：[Dunn Index](https://en.wikipedia.org/wiki/Dunn_index)。

> Being defined in this way, the *DI* depends on $k$, the number of clusters in the set. If the number of clusters is not known apriori, the $k$ for which the *DI* is the highest can be chosen as the number of clusters. There is also some flexibility when it comes to the definition of d(x,y) where any of the well known metrics can be used, like [Manhattan distance](https://en.wikipedia.org/wiki/Manhattan_distance) or [Euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance) based on the geometry of the clustering problem. **This formulation has a peculiar problem, in that if one of the clusters is badly behaved, where the others are tightly packed, since the denominator contains a 'max' term instead of an average term, the Dunn Index for that set of clusters will be uncharacteristically low. This is thus some sort of a worst case indicator, and has to be kept in mind.**

DI系数结果为非负数，值越大意味着簇间距离越大，同时簇内距离越小。个人总结，DI系数计算的是，任意两个簇的最短距离（簇间）除以任意簇中的最大距离（簇内），其优点是对于离散点的聚类评测效果不错，但缺点是对于环状分布评测效果比较差。还有上述重点提到的，因为分母采用的是取一个max距离而不是取平均值average，所以会出现一个奇怪的问题，对于某个聚类效果特别差的一个簇，它可能"一个老鼠屎坏了一锅粥"这种，导致DI系数会特别低，这也是当我们需要使用DI系数时，对于某些聚类表现非常差的簇需要注意的原因。


## 聚类距离计算

**距离度量（distance measure）函数 $dist(,)$ 需满足的基本性质：**

- <strong>非负性</strong>：$$dist(x_{i}, x_{j}) \geqslant 0$$
- <strong>同一性</strong>：$$dist(x_{i}, x_{j})=0$$ 当且仅当 $$x_{i}=x_{j}$$
- <strong>对称性</strong>：$$dist(x_{i}, x_{j})=dist(x_{j}, x_{i})$$
- <strong>直递性</strong>：$$dist(x_{i}, x_{j}) \leqslant dist(x_{i}, x_{k}) + dist(x_{k}, x_{j})$$ (可不满足)

**变量属性：**

- 连续属性： 闵可夫斯基距离
- 离散属性
  - 有序属性： 闵可夫斯基距离
  - 无序属性：VDM (Value Difference Metric)
- 混合属性：闵可夫斯基距离 与 VDM混合距离

### 闵可夫斯基距离（Minkowski distance）

样本：$$x_{i}=(x_{i1}, x_{i2}, \ldots, x_{in})$$ 与 $$x_{j}=(x_{j1}, x_{j2}, \ldots, x_{jn})$$

$$
dist_{mk}(x_{i}, x_{j})=\bigg(\sum_{u=1}^{n}|x_{iu}-x_{ju}|^{p}\bigg)^{\frac{1}{p}}
$$

### VDM(Value Difference Metric)

> 我们常将属性划分为“连续属性”（continuous attribute）和“离散属性”（categorical attribute），前者在定义域上有无穷多个可能的取值，后者在定义域上是有限个取值。然而，在讨论距离计算时，属性上是否定义了“序”关系更为重要。例如定义域为 $\lbrace 1,2,3 \rbrace$ 的离散属性与连续属性的性质更接近一些， 能直接在属性值上计算距离：“1”与“2”比较接近、与“3”比较远，这样的属性称为“有序属性”（ordinal attribute）;而定义域为｛飞机，火车，轮船｝这样的离散属性则不能直接在属性值上计算距离，称为“无序属性”（non-ordinal attribute）。显然， 闵可夫斯基距离可用于有序属性。
>
> 对无序属性可采用VDM（Value Difference Metric） 「Stanfill and Waltz, 1986」。

令 $$m_{u,a}$$ 表示在属性 $u$ 上取值为 $a$ 的样本数，$$m_{u, a, i}$$ 表示在第 $i$ 个样本簇中在属性 $u$ 上取值为 $a$ 的样本数，$k$ 为样本簇数，则属性 $u$ 上两个离散值 $a$ 与 $b$ 之间的VDM距离为：
$$
VDM_{q}(a, b)=\sum^{k}_{i=1}\bigg|\frac{m_{u,a,i}}{m_{u,a}}-\frac{m_{u,b,i}}{m_{u,b}}\bigg|^{p}.
$$

（这里的 $p$ 同闵可夫斯基距离中的 $p$ 一样）

### 闵可夫斯基距离与VDM混合距离

假设有 $$n_{c}$$ 个有序属性，$$n-n_{c}$$ 个无序属性，有序属性排列在无序属性之前：

$$
MinkovDM_{p}(x_{i}, x_{j})=\bigg(\sum^{n_{c}}_{u=1}|x_{i,u}-x_{j,u}|^{p}+\sum^{n}_{u=n_{c}+1}VDM_{p}(x_{i,u},x_{j,u})\bigg)^{\frac{1}{p}}
$$

### 加权闵可夫斯基距离

当样本在空间中不同属性的重要性不同时：
$$
dist_{wmk}(x_{i}, x_{j})=(w_{1}\cdot|x_{i1}-x_{j1}|^{p}+w_{2}\cdot|x_{i2}-x_{j2}|^{p}+\ldots+w_{n}\cdot|x_{in}-x_{jn}|^{p})^{\frac{1}{p}}
$$

其中： 权重$$w_{i} \geqslant 0(i=1, 2, \ldots, p)$$ 表示不同属性的重要性，通常 $$\sum_{i=1}^{n}w_{i}=1$$。

---

# 聚类算法介绍及实现

**聚类算法类型：**

- **基于原型的聚类（Prototype-based Clustering）**
  - **K均值聚类（K-means）**
  - **学习向量量化聚类（Learning vector Quantization）**
  - **高斯混合聚类（Mixture-of-Gaussian）**

- **基于密度的聚类（Density-based Clustering）**

- **层次聚类（Hierarchical Clustering）**

---
## 基于原型的聚类

**基于原型的聚类（Prototype-based Clustering），此类算法假设聚类结构能通过一组原形刻画。通常情况下，算法先对原型进行初始化，然后对原型进行迭代更新求解，采用不同的原型表示，不同的求解方式，将产生不同的算法。**

- **基于原型的聚类（Prototype-based Clustering）**
  - **K均值聚类（K-means）**
  - **学习向量量化聚类（Learning vector Quantization）**
  - **高斯混合聚类（Mixture-of-Gaussian）**

### K均值聚类（K-means）

#### 算法介绍

给定样本集 $$D= \lbrace x_{1}, x_{2}, \ldots, x_{n} \rbrace$$， K-means 算法针对聚类所得簇划分 $$C= \lbrace C_{1}, C_{2}, \ldots, C_{k} \rbrace$$，最小化平方误差：
$$
E = \sum^{k}_{i=1}\sum_{x \in C_{i}}|x-\mu_{i}|_{2}^{2}
$$
其中 $$\mu_{i}$$ 是簇 $$C_{i}$$ 的均值向量：
$$
\mu_{i}=\frac{1}{|C_{i}|}\sum_{x \in C_{i}}x
$$

直观上看，$E$ 在一定程度上刻画了簇内样本围绕均值向量的紧密程度， $E$ 值越小簇内样本相似度越高。但最小化 $E$ 不容易，是一个NP难问题， K-means 算法采用了贪心策略，通过迭代优化来近似求解 $E$ 的最小值。具体算法如下：


![$k$均值算法](https://farm5.staticflickr.com/4303/36049857562_cf0480eb62_o.png)

#### 算法实现 （R语言）

Python的实现可以参考[Programming Collective Intelligence - Chapter 3](/tech/programming-collective-intelligence---chapter-3/) 这篇文章。

```R
head(iris)
```

```
  Sepal.Length Sepal.Width Petal.Length Petal.Width Species
1          5.1         3.5          1.4         0.2  setosa
2          4.9         3.0          1.4         0.2  setosa
3          4.7         3.2          1.3         0.2  setosa
4          4.6         3.1          1.5         0.2  setosa
5          5.0         3.6          1.4         0.2  setosa
6          5.4         3.9          1.7         0.4  setosa
```

After a little bit of exploration, I found that Petal.Length and Petal. Width were similar among the same species but varied considerably between different species, as demonstrated below:

```R
library(ggplot2)
ggplot(iris, aes(Petal.Length, Petal.Width, color = Species)) + geom_point()
```

![](https://farm1.staticflickr.com/33/31680514905_7dba9b551a_o.jpg)


```R
set.seed(20)
irisCluster <- kmeans(iris[, 3:4], centers = 3, nstart = 20)
irisCluster
```

```R
K-means clustering with 3 clusters of sizes 50, 52, 48

Cluster means:
  Petal.Length Petal.Width
1     1.462000    0.246000
2     4.269231    1.342308
3     5.595833    2.037500

Clustering vector:
  [1] 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
 [33] 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 2 2 2 2 2 2 2 2 2 2 2 2 2
 [65] 2 2 2 2 2 2 2 2 2 2 2 2 2 3 2 2 2 2 2 3 2 2 2 2 2 2 2 2 2 2 2 2
 [97] 2 2 2 2 3 3 3 3 3 3 2 3 3 3 3 3 3 3 3 3 3 3 3 2 3 3 3 3 3 3 2 3
[129] 3 3 3 3 3 3 3 3 3 3 2 3 3 3 3 3 3 3 3 3 3 3

Within cluster sum of squares by cluster:
[1]  2.02200 13.05769 16.29167
 (between_SS / total_SS =  94.3 %)

Available components:

[1] "cluster"      "centers"      "totss"        "withinss"    
[5] "tot.withinss" "betweenss"    "size"         "iter"        
[9] "ifault"      
```

```R
table(irisCluster$cluster, iris$Species)
```

```R
   
    setosa versicolor virginica
  1     50          0         0
  2      0         48         4
  3      0          2        46
```

```R
> irisCluster$cluster <- as.factor(irisCluster$cluster)
> ggplot(iris, aes(Petal.Length, Petal.Width, color = irisCluster$cluster)) + geom_point()
```

![](https://farm1.staticflickr.com/353/31565301411_fc7281b525_o.jpg)

---

### 学习向量量化聚类（Learning vector Quantization）

#### 算法介绍

**LVQ 假设数据样本带有类别标记，学习过程利用样本的这些监督信息来辅助聚类。**

给定样本集 $$D=\lbrace (x_{1}, y_{1}), (x_{2}, y_{2}), \ldots, (x_{m}, y_{m}) \rbrace$$，每个样本$$x_{j}$$是由$n$个属性描述的特征向量$$(x_{j1}; x_{j2}; \ldots; x_{jn})$$,$$y_{j} \in \mathcal{Y}$$是样本$$x_{j}$$的类别标记。LVQ的目标是学得一组$n$维原型向量$$\lbrace p_{1}, p_{2}, \ldots, p_{q} \rbrace$$, 每个原型向量代表一个聚类簇，簇标记为$$t_{i}\in \mathcal{Y}$$。

具体算法如下：

![学习向量量化方法](https://farm5.staticflickr.com/4320/36049858912_c400743b7f_o.png)

**算法解释**

* 算法第1行：对原型向量进行初始化。例如：对第$i,i=(1,2,\ldots,q)$个簇，可以从类别标记为$t_{i}$的样本中随机选取一个作为原型向量。
* 算法第2-12行：对原型向量进行迭代优化。在每一轮迭代中，算法随机选取一个有标记训练样本，找出与其距离最近的原型向量，并根据两者的类别标记是否一致来对原型向量进行相应的更新。
     * 算法第5行：这是竞争学习的“胜者为王“的策略。SOM是基于无标记样本的聚类算法，而LVQ可以看作是SOM基于监督信息的扩展。
     * 算法第6-10行：如何更新原型向量。对样本 $x_{j}$，
          *   若距离$$x_{j}$$最近的原型向量 $$p_{i^{*}}$$ 与 $$x_{j}$$ 的标记相同，则令 $$p_{i^{*}}$$ 向 $$x_{j}$$ 的方向靠拢，此时新的原型向量为 
          $$
          p' = p_{i^{*}} + \eta \cdot (x_{j}-p_{i^{*}})
          $$

          ​        $p^{'}$ 与 $x_{j}$ 之间的距离为 

          $$
          ||p'-x_{j}||_{2}=(1-\eta) \cdot ||p_{i^{*}}-x_{j}||_{2}
          $$
          ​       原型向量 $$p_{i^{*}}$$ 更新为 $$p'$$之后将更接近 $$x_{j}$$。
          *   若距离$$x_{j}$$最近的原型向量 $$p_{i^{*}}$$ 与 $$x_{j}$$ 的标记不同，则令 $$p_{i^{*}}$$ 向 $$x_{j}$$ 的方向远离，此时新的原型向量为 
          $$
          p' = p_{i^{*}} - \eta \cdot (x_{j}-p_{i^{*}})
          $$
          ​       $p^{'}$ 与 $x_{j}$ 之间的距离为 
          $$
          ||p'-x_{j}|_{2}=(1+\eta) \cdot |p_{i^{*}}-x_{j}||_{2}
          $$
          ​       原型向量 $$p_{i^{*}}$$ 更新为 $$p'$$之后将更远离 $$x_{j}$$。
* 算法第12行：若算法的停止条件已满足(例如已达到最大迭代轮数，或原型向量更新很小甚至不再更新)，则将当前原型向量作为最终结果返回。
* 在学得一组原型向量 $$\lbrace p_{1}, p_{2}, \ldots, p_{q} \rbrace$$ 后即可实现对样本空间 $$\mathcal{X}$$ 的簇划分。
     *   对任意样本 $x$, 他将被划入与其距离最近的原型向量所代表的簇中，每个原型向量$$p_{i}$$ 定义了与之相关的一个区域 $$R_{i}$$，该区域中每个样本与 $$p_{i}$$ 的距离不大于他与其他原型向量 $$p_{i'} (i \neq i')$$，即 
     $$
     R_{i}= \lbrace x \in \mathcal{X} \ |\ ||x-p_{i}||_{2} \leqslant ||x-p_{i'}||_{2}, i \neq i'\rbrace
     $$
     ​       由此形成了对样本空间 $\mathcal{X}$ 的簇划分 $${R_{1}, R_{2}, \ldots, R_{q}}$$，该划分通常称为“Voronoi剖分”（Voronoi tessellation）。


#### 算法实现

（Unfinished.）

#### 补充
##### 竞争型学习
竞争型学习是神经网络中一种常见的无监督学习策略，在使用该策略时，网络的输出神经元相互竞争，每一时刻仅有一个竞争获胜的神经元被激活，其他神经元的状态被抑制。这种机制亦称为"胜者通吃"(winner-take-all)原则。
##### ART 网络
ART (Adaptive Resonance Theory,自适应谐振理论）网络「Carpenter and Grossberg, 1987」是竞争型学习的重要代表。该网络由比较层、识别层、识别阈值和重置模块构成。其中，比较层负责接收输入样本，并将其传递给识别层神经元。识别层每个神经元对应一个模式类（模式类可以认为是某类别的“子类”），神经元数目可在训练过程中动态增长以增加新的模式类。

在接收到比较层的输入信号后，识别层神经元之间相互竞争以产生获胜神经元。竞争的最简单方式是，计算输入向量与每个识别层神经元所对应的模式类的代表向量之间的距离，距离最小者胜．获胜神经元将向其他识别层神经元发送信号，抑制其激活。若输入向量与获胜神经元所对应的代表向量之间的相似度大于识别阈值，则当前输入样本将被归为该代表向量所属类别，同时，网络连接权将会更新，使得以后在接收到相似输入样本时该模式类会计算出更大的相似度，从而使该获胜神经元有更大可能获胜；若相似度不大于识别阈值，则重置模块将在识别层增设一个新的神经元，其代表向量就设置为当前输入向量。

显然，识别阈值对ART网络的性能有重要影响。当识别阈值较高时，输入样本将会被分成比较多、比较精细的模式类，而如果识别阈值较低，则会产生比较少、比较粗略的模式类。

ART比较好地缓解了竞争型学习中的“可塑性一稳定性窘境”（stability-- plasticity dilemma），可塑性是指神经网络要有学习新知识的能力，而稳定性则是指神经网络在学习新知识时要保持对旧知识的记忆．这就使得ART网络具有一个很重要的优点：可进行<strong>增量学习（incremental learning）</strong>或<strong>在线学习（online learning)</strong>。

早期的ART网络只能处理布尔型输入数据，此后ART发展成了一个算法族，包括能处理实值输入的ART2网络、结合模糊处理的FuzzyART网络，以及可进行监督学习的ARTMAP网络等。 

##### SOM 网络
SOM (Self-Organizing Map，自组织映射）网络「Kohollen, 1982」是一种竞争学习型的无监督神经网络，它能将高维输入数据映射到低维空间（通常为二维），同时保持输入数据在高维空间的拓扑结构，即将高维空间中相似的样本点映射到网络输出层中的邻近神经元。

![](https://farm6.staticflickr.com/5569/31429001070_b16d937809_o.png)

如图所示，SOM网络中的输出层神经元以矩阵方式排列在二维空间中，每个神经元都拥有一个权向量，网络在接收输入向量后，将会确定输出层获胜神经元，它决定了该输入向量在低维空间中的位置。SOM的训练目标就是为每个输出层神经元找到合适的权向量，以达到保持拓扑结构的目的。 SOM的训练过程很简单：在接收到一个训练样本后，每个输出层神经元会计算该样本与自身携带的权向量之间的距离，距离最近的神经元成为竞争获胜者，称为最佳匹配单元（best matching unit)。然后，最佳匹配单元及其邻近神经元的权向量将被调整，以使得这些权向量与当前输入样本的距离缩小。这个过程不断迭代，直至收敛。

---

###  高斯混合聚类（Mixture-of-Gaussian）

#### 算法介绍

与 $k$ 均值、LVQ用原型向量来刻画聚类结构不同，<strong>高斯混合聚类(Mixture-of-Gaussian)采用概率模型来表达聚类原型</strong>。

##### （多元）高斯分布：

对 $n$ 维样本空间 $\mathcal{X}$ 中的随机向量 $x$，若 $x$ 服从(多元)高斯分布，其概率密度函数为：
$$
p(x| \mu, \Sigma)=\frac{1}{(2\pi)^{\frac{n}{2}}|\Sigma|^{\frac{1}{2}}} e^{ - \frac{1}{2} (x-\mu)^{T} \Sigma^{-1} (x-\mu)}
$$
其中：$\mu​$ 是$n​$ 维均值向量，$\Sigma​$ 是 $n \times n​$ 协方差矩阵。($\Sigma​$：对称正定矩阵；$|\Sigma|​$：$\Sigma​$ 的行列式；$\Sigma^{-1}​$：$\Sigma​$ 的逆矩阵)

##### （多元）高斯混合分布：

对 $n$ 维样本空间 $\mathcal{X}$ 中的随机向量 $x$，若 $x$ 服从（多元）高斯混合分布，其概率密度函数为：
$$
p_{\mathcal{M}}(x)=\sum_{i=1}^{k}\alpha_{i} \cdot p(x| \mu_{i}, \Sigma_{i})
$$

该分布由 $k$ 个混合成分组成，每个成分对应一个（多元）高斯分布，其中：$$\mu_{i}$$, $$\Sigma_{i}$$ 是第 $i$ 个高斯混合成分的参数， 而 $$\alpha_{i}$$ 为相应的“混合系数” (mixture coeffcient)， $$\sum_{i=1}^{k}\alpha_{i}=1$$。

##### 样本集的生成模型：

假设样本集 $$D= \lbrace x_{1}, x_{2}, \ldots, x_{n} \rbrace$$ 的生成过程由高斯混合分布给出：

- 首先：根据 $$\alpha_{1}, \alpha_{2}, \ldots,\alpha_{k}$$ 定义的先验分布选择高斯混合成分，其中 $$\alpha_{i}$$ 为选择第 $i$ 个混合成分的概率；

- 然后：根据被选择的混合成分的概率密度函数进行采样， 生成相应的样本。

令随机变量 $$z_{j} \in \lbrace 1, 2, \ldots,k \rbrace$$ 表示生成样本 $$x_{j}$$ 的高斯混合成分， 其取值未知。

$z_{j}$ 的先验概率：
$$
P(z{j}=i)=\alpha{i} \quad (i=1, 2, \ldots,k).
$$

由Bayesian定理得 $z_{j}$ 的后验分布为：
$$
\begin{aligned}
P_{\mathcal{M}}(z_{j}=i|x_{j}) &=\frac{P(z_{j}=i) \cdot p_{\mathcal{M}}(x_{j}|z_{j}=i)}{p_{\mathcal{M}}(x_{j})} \\
& =\frac{\alpha_{i}\cdot p(x_{j}|\mu_{i},\Sigma_{i})}{\sum^{k}_{l=1}\alpha_{l}\cdot p(x_{j}|\mu_{l},\Sigma_{l})}
\end{aligned}
$$

可知，$$P_{\mathcal{M}}(z_{j}=i|x_{j})$$ 给出了样本 $$x_{j}$$ 由第 $i$ 个高斯混合成分生成的后验概率，记：

$$
\gamma_{ji}=P_{\mathcal{M}}(z_{j}=i|x_{j}) \quad (i=1, 2, \ldots,k)
$$

##### 高斯混合聚类策略：

*   若（多元）高斯混合分布 $p_{\mathcal{M}}(x)$ 已知，高斯混合聚类将把样本集 $D$ 划分为 $k$ 个簇：
$$
C= \lbrace C_{1}, C_{2}, \ldots,C_{k} \rbrace
$$

每个样本 $$x_{j}$$ 的簇标记 $$\lambda_{j}$$ 为:
$$
\lambda_{j}=arg \underset{i \in {1, 2, \ldots,k}}{max}\gamma_{ji}
$$
*   （多元）高斯混合分布 $$p_{\mathcal{M}}(x)$$ 参数 $$\lbrace (\alpha_{i},\mu_{i}, \Sigma_{i})|1 \leqslant i \leqslant k \rbrace$$ 的求解采用极大似然估计(MLE):

给定样本集 $D$， 最大化（对数）似然函数：
$$
\begin{aligned}
LL(D) & = ln\Big(\prod^{n}_{j=1}p_{\mathcal{M}}(x_{j})\Big) \\
&=\sum^{n}_{j=1}\Big(\sum^{k}_{i=1}\alpha_{i}\cdot p(x_{j}|\mu_{i}, \Sigma_{i})\Big)
\end{aligned}
$$
MLE解为：
$$
\begin{aligned}
\mu_{i} & = \frac{\sum^{n}_{j=1}\gamma_{ji}x_{j}}{\sum^{n}_{j=1}\gamma_{ji}} \\
\Sigma_{i} & = \frac{\sum^{n}_{j=1}\gamma_{ji}(x_{j}-\mu_{i})(x_{j}-\mu_{i})^{T}}{\sum^{n}_{j=1}\gamma_{ji}} \\
\alpha_{i} &= \frac{1}{n}\sum^{n}_{j=1}\gamma_{ji}
\end{aligned}
$$

具体算法如下：
![高斯混合聚类算法](https://farm5.staticflickr.com/4295/35824129960_2e09d0a8b8_o.png)

#### 算法实现

（Unfinished）

---


# **各聚类算法过程**

使用西瓜数据集合：

$$
\begin{array}{ccc|ccc|ccc}
\hline
编号 & 密度 & 含糖率 & 编号 & 密度 & 含糖率 & 编号 & 密度 & 含糖率 \\
\hline
1 & 0.697 & 0.460 & 11 & 0.245 & 0.057 & 21 & 0.748 & 0.232 \\
2 & 0.774 & 0.376 & 12 & 0.343 & 0.099 & 22 & 0.714 & 0.346 \\
3 & 0.634 & 0.264 & 13 & 0.639 & 0.161 & 23 & 0.483 & 0.312 \\
4 & 0.608 & 0.318 & 14 & 0.657 & 0.198 & 24 & 0.478 & 0.437 \\
5 & 0.556 & 0.215 & 15 & 0.360 & 0.370 & 25 & 0.525 & 0.369 \\
6 & 0.403 & 0.237 & 16 & 0.593 & 0.042 & 26 & 0.751 & 0.489 \\
7 & 0.481 & 0.149 & 17 & 0.719 & 0.103 & 27 & 0.532 & 0.472 \\
8 & 0.437 & 0.211 & 18 & 0.359 & 0.188 & 28 & 0.473 & 0.376 \\
9 & 0.666 & 0.091 & 19 & 0.339 & 0.241 & 29 & 0.725 & 0.445 \\
10 & 0.243 & 0.267 & 20 & 0282 & 0.257 & 30 & 0.446 & 0.459 \\
\end{array}
$$

（其中编号为9~21的类别是"坏瓜"，其他样本的类别是"好瓜"） 

## 使用$k$均值算法

假定聚类簇数 $k=3$，算法开始时随机选取的三个样本$$x_{6},x_{12},x_{27}$$作为初始均值向量，即：

$$
\mu_{1} = (0.403;0.237), \mu_{2} = (0.343;0.099),\mu_{3} = (0.532;0.472).
$$

考察样本 $$x_{1}=(0.697;0.460)$$，它与当前均值向量 $$\mu_{1},\mu_{2},\mu_{3}$$的距离分别是$$0.369, 0.506, 0.166$$，因此 $$x_{1}$$ 将被划入簇 $$C_{3}$$ 中。类似的，对数据集中的所有样本考察一遍后，可得当前簇划分为：

$$
\begin{aligned}
C_{1} & = \lbrace x_{5},x_{6},x_{7},x_{8},x_{9},x_{10},x_{13},x_{14},x_{15},x_{17},x_{18},x_{19},x_{20},x_{23} \rbrace; \\
C_{2} & = \lbrace x_{11},x_{12},x_{16} \rbrace; \\
C_{3} & = \lbrace x_{1},x_{2},x_{3},x_{4},x_{21},x_{22},x_{24},x_{25},x_{26},x_{27},x_{28},x_{29},x_{30} \rbrace
\end{aligned}
$$

于是，可以从 $$C_{1},C_{2},C_{3}$$ 分别求出新的均值向量：

$$
\mu_{1}^{'} = (0.473;0.214), \mu_{2}^{'} = (0.394;0.066),\mu_{3}^{'} = (0.623;0.388).
$$

更新当前均值向量后，不断重复上述过程，如图所示，第五轮迭代产生的结果与第四轮迭代结果相同，于是算法停止，得到最终的簇划分，其中样本点与均值向量分别用"●"与"+"表示，红色虚线显示出簇划分。

![](https://farm1.staticflickr.com/403/30990399723_0db34a3cde_o.png)


## 使用学习向量量化

令数据集中编号为9-21的样本的类别标记为 $$c_{2}$$ ，其他样本的类别标记为 $$c_{1}$$。假定$q=5$，即学习目标是找到5个原型向量 $$p_{1},p_{2},p_{3},p_{4},p_{5}$$，并假定其对应的类别标记分别为$$c_{1},c_{2},c_{2},c_{1},c_{1}$$ 。

算法开始时，根据样本的类别标记和簇的预设类别标记，对原型向量进行随机初始化，假定初始化为样本 $$x_{5},x_{12},x_{18},x_{23},x_{29}$$ 。在第一轮迭代中，假定随机选取的样本为 $$x_{1}$$ ，该样本与当前原型向量 $$p_{1},p_{2},p_{3},p_{4},p_{5}$$ 的距离分别为 $$0.283, 0.506, 0.434, 0.260, 0.032$$ 。由于 $$p_{5}$$ 与 $$x_{1}$$ 距离最近且两者具有相同的类别标记 $$c_{2}$$ ，假定学习率 $\eta = 0.1$ ，则LVQ更新 $$p_{5}$$ 得到新原型向量：

$$
\begin{aligned}
p^{'} & = p_{5} + \eta \cdot (x_{1} - p_{5}) \\
      & = (0.725;0.445) + 0.1 \cdot ((0.697;0.460) - (0.725;0.445)) \\
      & = (0.722;0.442).
\end{aligned}
$$

将 $$p_{5}$$ 更新为 $$p^{'}$$ 后，不断重复上述过程，不同轮数之后的聚类结果如下图所示，其中 $$c_{1}$$ ， $$c_{2}$$ 类别样本点与原型向量分别用"●","○"与"+"表示，红色虚线显示出聚类形成的Voronoi剖分。

![](https://farm1.staticflickr.com/715/31427609470_fe9357f0cc_o.png)

## 使用高斯混合聚类

令高斯混合成分的个数$k=3$。算法开始时，假定将高斯混合分布的模型参数初始化为：$$\alpha_{1} = \alpha_{2} = \alpha_{3} = \frac{1}{3}$$；$$\mu_{1} = x_{6}$$，$$\mu_{2}=x_{22}$$，$$\mu_{3} = x_{27}$$；$$\Sigma_{1} = \Sigma_{2} = \Sigma_{3} = \begin{pmatrix}0.1 & 0.0\\0.0 & 0.1\end{pmatrix}$$。

在第一轮迭代中，先计算样本由各混合成分生成的后验概率。
