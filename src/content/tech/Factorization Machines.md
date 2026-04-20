---
title: "Factorization Machines"
date: 2017-03-03
category: "AI"
tags: ["Machine Learning"]
description: "本文介绍了 Factorization Machines 隐因子分解机模型，包括模型数学知识介绍以及与其他模型的对比。"
draft: false
---

![](https://farm5.staticflickr.com/4300/35460446383_aafc34ca3c_o.jpg)

> **更多 AI 文章：** [查看 AI 分类](/categories/AI/)

# Introduction

Factorization Machines（FM），可译为“隐因子分解机”，由 Steffen Rendle 于 2010 年提出，并发布开源工具 **libFM**[^1] 。他凭借 FM 单个模型，他在 KDD Cup 2012[^2]上，取得 Track1 的第 2 名和 Track2 的第 3 名。

# Compared with Other Models

- 在数据非常稀疏时（如推荐系统），SVM 不能取得很好的效果。
- 对带非线性核函数的 SVM，需要在对偶问题上进行求解。
- 目前还有很多不同的 factorization models ，比如 matrix factorization 和一些特殊的模型 SVD++, PITF, FPMC。这些模型的一个缺点是它们只适用于某些特定的输入数据，优化算法也需要根据问题专门设计。
- FM 适用于实数值的特征向量。并且经过一些变换，可以看出 FM 囊括了以上方法。

# Related

首先考虑线性模型：

$$
\hat y (x) = w_0 + w_1x_1 + w_2x_2+ \dots + w_nx_n = w_0 + \sum_{i=1}^{n}w_ix_i
$$

各特征分量之间是相互孤立的。

$\hat y(x)$ 仅考虑单个的特征分量，而没有考虑特征分量之间的相互关系。

考虑任意两个特征分量之间的关系：

$$
\hat y (x) := w_0 +  \sum_{i=1}^{n}w_ix_i + \sum_{i=1}^{n-1}\sum_{j=i+1}^{n}W_{ij}x_ix_j
$$

在数据高度系数的场景中，上述模型由很大的缺陷：

当 $$x_i$$ 与 $$x_j$$ 未出现过交互时，不能对相应的参数 $$w_{ij}$$ 进行估计， $$w_{ij}$$ 一定为 0 。

因此，需要对每个维度的特征分量 $x_i$ ，引入：

$$
v_i = (v_{i1},v_{i2}, \dots ,v_{ik})^T \epsilon \ \mathbb{R} ^k, \ i = 1,2,\dots,n
$$

改写 $w_{ij}$ :

$$
\hat w_{ij} = v_i^Tv_j := \sum_{l=1}^{k}v_{il}v_{jl}
$$


## 2-way FM

$$
\hat y(x) := w_0 + \sum_{i=1}^{n}w_ix_i + \sum_{i=1}^{n-1}\sum_{j=i+1}^{n}\left \langle  v_i, v_j\right \rangle x_ix_j
$$

$$
w_0 \ \epsilon\  \mathbb{R},w \ \epsilon\  \mathbb{R}^n, V \ \epsilon\  \mathbb{R}^{n\times k}
$$

$$
\left \langle  v_i, v_j\right \rangle := \sum_{f=1}^{k}v_{i,f} \cdot v_{j,f}
$$

- $v_i$ 用 $k$ 个因子描述第 $i$ 个变量。
- 正整数 $k$ 是超参，决定了分解的维度。


## Complexity Analysis

FM 模型中需要估计的参数包括 $$w_0 \ \epsilon\  \mathbb{R},w \ \epsilon\  \mathbb{R}^n, V \ \epsilon\  \mathbb{R}^{n\times k}$$，共 $$1+n+n*k$$ 个，$$w_{0}$$ 为整体的偏置量，$w$ 对特征向量的各个分量的强度进行建模，$V$ 对特征向量中任意两个分量之间的关系进行建模。

直观上看，上述模型的计算复杂度是 $O(kn^2)$ ，但是经过下面的改写后：

$$
\begin{aligned}
& \sum_{i=1}^{n}\sum_{j=i+1}^{n}\left \langle  v_i, v_j\right \rangle x_ix_j \\
=& \frac{1}{2} \sum_{i=1}^{n}\sum_{j=1}^{n}\left \langle  v_i, v_j\right \rangle x_ix_j - \frac{1}{2} \sum_{i=1}^{n}\left \langle  v_i, v_i\right \rangle x_ix_i \\
=& \frac{1}{2} \left ( \sum_{i=1}^{n}\sum_{j=1}^{n}\sum_{f=1}^{k} v_{i,f} \cdot v_{j,f} \ x_ix_j - \sum_{i=1}^{n}\sum_{f=1}^{k} v_{i,f} \cdot v_{i,f} \ x_ix_i \right) \\
=& \frac{1}{2} \sum_{f=1}^{k} \left( \left( \sum_{i=1}^{n}v_{i,f}x_{i}\right) \left( \sum_{j=1}^{n}v_{j,f}x_{j}\right) - \sum_{i=1}^{n}v_{i,f}^2 x_{i}^2\right) \\
=& \frac{1}{2}  \sum_{f=1}^{k} \left( \left( \sum_{i=1}^{n}v_{i,f}x_{i}\right)^2 - \sum_{i=1}^{n}v_{i,f}^2 x_{i}^2\right)
\end{aligned}
$$

计算复杂度经过改写后降低到线性的 $O(kn)$ 。

## d-way FM

方程同时刻画 $l(1 \leq l \leq d)$ 个特征向量之间的相互关系：

$$
\hat y(x) := w_0 + \sum_{i=1}^{n}w_ix_i + \sum_{l=2}^{d}\sum_{i_{1}=1}^{n}\dots \sum_{i_{t} = i_{t-1}+1}^{n}\left ( \prod_{j=1}^{l}x_{i_{j}} \right)\left ( \prod_{f=1}^{k_{l}}\prod_{j=1}^{l}v_{i_{j},f}^{(l)} \right)
$$

## Problem Solving

最小化优化目标函数：

$$
L = \sum_{i=1}^{N} loss(\hat y(x^{(i)}),y^{(i)})
$$

回归问题，损失函数可取为最小平方误差，即：

$$
l^{LS}(y_1,y_2) := (y_1-y_2)^2
$$

二分类问题，损失函数可为 hinge loss 函数或 logistic loss 函数：

$$
l^{C}(y_1,y_2) := -ln\sigma (y_1y_2)
$$

$$
\sigma (x) = \frac{1}{1+e^{-x}}
$$

## Algorithm

- **随机梯度下降法 (StochasticGradient Descent, SGD)**

- **交替最小二乘法 (AlternatingLeast-Squares, ALS)**

- **马尔可夫链蒙特卡洛法 (MarkovChain Monte Carlo, MCMC)**[^3]


## Multilinearity

FM 的一个重要性质—<strong>Multilinearity</strong>，对于 FM 的任意参数 $\theta$ ，存在两个与 $\theta $ 的取值无关的函数 $g(\theta )$ 和 $h(\theta )$ 使得：

$$
\hat y(x) = g_{\theta}(x) + \theta h_{\theta}(x) \qquad \forall\theta \in \Theta
$$

其中：

$$
h_{\theta}(x) = \frac{\partial \hat y(x)}{\partial \theta} = 
\begin{cases}
1,  & \text{if $\theta$ is $w_{0}$} \\
x_{l}, & \text{if $\theta$ is $w_{l}$}  \\
x_{l}\sum_{j \neq l}v_{j,f}x_{f}, & \text{if $\theta$ is $v_{l,f}$}
\end{cases}
$$

$g(\theta)$ 相对复杂，计算时，使用 $$g_{\theta}(x) = \hat y(x) - \theta h_{\theta}(x)$$ 代替。

## Optimization

最小化损失函数的和：

$$
OPT(S) := argmin \sum_{(x, y) \in S} l(\hat y(x \mid \Theta), y)
$$

加入 L2 正则：

$$
OPTREG(S,\lambda) := argmin\left( \sum_{(x, y)\in S}l(\hat y(x \mid \Theta), y) + \sum_{\theta \in \Theta}\lambda_{\theta}\theta^2\right)
$$

[^1]: libFM 是 Rendle 发布的 FM 开源实现，支持 SGD、ALS 和 MCMC 三种优化算法，目前已整合入更广泛的推荐系统框架如 TensorFlow Recommenders 中。
[^2]: KDD Cup 是由 ACM SIGKDD 主办的年度数据挖掘竞赛，2012 年竞赛数据来自腾讯社交广告平台，属于当时规模最大的 CTR 预估赛事之一。
[^3]: 对于 FM，MCMC 方法通常比 SGD 取得更好的效果，但计算成本也更高；Rendle 本人的实验表明在稀疏数据上 MCMC 往往是最优选择。
