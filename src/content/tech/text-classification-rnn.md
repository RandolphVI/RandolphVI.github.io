---
title: "About Text Classification based on RNN"
date: 2017-10-17
category: "AI"
tags: ["Deep Learning", "NLP", "Papers"]
description: "「Recurrent Neural Network for Text Classification with Multi-Task Learning」"
draft: false
---

![](https://farm5.staticflickr.com/4373/35507009504_3298ce3029_o.jpg)

有关「Machine Learning」的其他学习笔记系列：[「Machine Learning」](http://randolph.pro/categories/Machine-Learning/)  
 有关「Papers」的其他论文学习笔记系列：[「Papers」](http://randolph.pro/categories/Machine-Learning/Papers/)

# 「Recurrent Neural Network for Text Classification with Multi-Task Learning」

本文为复旦在 2016 年 IJCAI 上的发表的关于循环神经网络在多任务文本分类上的应用。

问题定义：在先前的许多工作中，模型的学习都是基于单任务，对于复杂的问题，也可以分解为简单且相互独立的子问题来单独解决，然后再合并结果，得到最初复杂问题的结果。这样做看似合理，其实是不正确的，因为现实世界中很多问题不能分解为一个一个独立的子问题，即使可以分解，各个子问题之间也是相互关联的，通过一些共享因素或共享表示（share representation）联系在一起。把现实问题当做一个个独立的单任务处理，往往会忽略了问题之间所富含的丰富的关联信息。

提出的解决办法：多任务学习就是为了解决这个问题而诞生的。把多个相关（related）的任务（task）放在一起学习。多个任务之间共享一些因素，它们可以在学习过程中，共享它们所学到的信息，这是单任务学习没有具备的。相关联的多任务学习比单任务学习能去的更好的泛化（generalization）效果。本文基于 RNN 循环神经网络，提出三种不同的信息共享机制，整体网络是基于所有的任务共同学习得到。

![](https://farm5.staticflickr.com/4486/37490166810_74c95852c5_o.png)

## Introduction

Introduction 里面提及了：

- 词向量的重要性；
- 多任务学习的有效性。

## Related Work

第一个模型使用:

![](https://farm5.staticflickr.com/4510/37490446050_feb6e54ed2_o.png)

:

![](https://farm5.staticflickr.com/4496/37700304396_6447763429_o.png)

:

![](https://farm5.staticflickr.com/4498/37490447880_dfe28b18db_o.png)

## Experiments

### Datasets

实验部分就是使用几个常见的 Datasets，其中用到的有：

- ​

### Experiment Setting

- ​

### Results and Discussion
