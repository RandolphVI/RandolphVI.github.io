---
title: "Factorization Machines"
date: 2017-03-03
category: "ML-AI"
tags: ["推荐系统"]
description: "Introduction"
draft: false
---

![](https://farm5.staticflickr.com/4300/35460446383_aafc34ca3c_o.jpg)

有关「Machine Learning」的其他学习笔记系列：[「Machine Learning」](http://randolph.pro/categories/Machine-Learning/)

# Introduction

Factorization Machines（FM），可译为“隐因子分解机”，由 Steffen Rendle 于 2010 年提出，并发布开源工具 **libFM** 。他凭借 FM 单个模型，他在 KDD Cup 2012 上，取得 Track1 的第 2 名和 Track2 的第 3 名。

# Compared with Other Models

- 在数据非常稀疏时（如推荐系统），SVM 不能取得很好的效果。
- 对带非线性核函数的 SVM，需要在对偶问题上进行求解。
- 目前还有很多不同的 factorization models ，比如 matrix factorization 和一些特殊的模型 SVD++, PITF, FPMC。这些模型的一个缺点是它们只适用于某些特定的输入数据，优化算法也需要根据问题专门设计。
- FM 适用于实数值的特征向量。并且经过一些变换，可以看出 FM 囊括了以上方法。

# Related

首先考虑线性模型：

各特征分量之间是相互孤立的。

$\hat y(x)$ 仅考虑单个的特征分量，而没有考虑特征分量之间的相互关系。

考虑任意两个特征分量之间的关系：

在数据高度系数的场景中，上述模型由很大的缺陷：

当 与 未出现过交互时，不能对相应的参数 进行估计， 一定为 0 。

因此，需要对每个维度的特征分量 $x\_i$ ，引入：

改写 $w\_{ij}$ :

## 2-way FM

- $v\_i$ 用 $k$ 个因子描述第 $i$ 个变量。
- 正整数 $k$ 是超参，决定了分解的维度。

## Complexity Analysis

FM 模型中需要估计的参数包括 ，共 个， 为整体的偏置量，$w$ 对特征向量的各个分量的强度进行建模，$V$ 对特征向量中任意两个分量之间的关系进行建模。

直观上看，上述模型的计算复杂度是 $O(kn^2)$ ，但是经过下面的改写后：

计算复杂度经过改写后降低到线性的 $O(kn)$ 。

## d-way FM

方程同时刻画 $l(1 \leq l \leq d)$ 个特征向量之间的相互关系：

## Problem Solving

最小化优化目标函数：

回归问题，损失函数可取为最小平方误差，即：

二分类问题，损失函数可为 hinge loss 函数或 logistic loss 函数：

## Algorithm

- **随机梯度下降法 (StochasticGradient Descent, SGD)**
- **交替最小二乘法 (AlternatingLeast-Squares, ALS)**
- **马尔可夫链蒙特卡洛法 (MarkovChain Monte Carlo, MCMC)**

## Multilinearity

FM 的一个重要性质—**Multilinearity**，对于 FM 的任意参数 $\theta$ ，存在两个与 $\theta $ 的取值无关的函数 $g(\theta)$ 和 $h(\theta)$ 使得：

其中：

$g(\theta)$ 相对复杂，计算时，使用 代替。

## Optimization

最小化损失函数的和：

加入 L2 正则：

## Gradient

​
