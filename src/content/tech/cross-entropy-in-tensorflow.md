---
title: "Cross Entropy Function in TensorFlow"
date: 2017-09-25
category: "ML-AI"
tags: ["TensorFlow"]
description: "Cross Entropy Introduction"
draft: false
---

![](https://farm5.staticflickr.com/4399/36206153111_6662041dd1_o.png)

有关「TensorFlow」的其他学习笔记系列：[「TensorFlow」](http://randolph.pro/categories/TensorFlow/)

# Cross Entropy Introduction

交叉熵（Cross Entropy）是 Loss 函数的一种（也称为损失函数或代价函数），用于描述模型预测值与真实值的差距大小，常见的 Loss 函数就是均方平方差（Mean Squared Error），定义如下：

平方差很好理解，预测值与真实值直接相减，为了避免得到负数取绝对值或者平方，再做平均就是均方平方差。注意这里预测值需要经过 sigmoid 激活函数，得到取值范围在 0 到 1 之间的预测值。

平方差可以表达预测值与真实值的差异，但在分类问题种效果并不如交叉熵好，原因是：

1. 非负性。交叉熵输出的值是非负的。
2. 当真实值 $a$ 与期望输出 $y$ 的误差越大，权值更新就快；误差越小，权值更新就慢。而使用平方差作为 Loss 函数，其权值更新往往很慢。
3. 其中用于计算的 $a$ 也是经过 sigmoid 激活的，取值范围在 0 到 1。如果 label 是 1，预测值也是 1 的话，前面一项 就是 等于 0，后一项 也就是 等于 0，Loss 函数为 0，反之 Loss 函数为无限大非常符合我们对 Loss 函数的定义。

交叉熵的定义如下：

其中，$a = \sigma(z)$，，$n$ 是训练数据的个数。

这里多次强调 sigmoid 激活函数，是因为在多标签或者多分类的问题下有些函数是不可用的，而 TensorFlow 本身也提供了多种交叉熵算法的实现。

# Cross Entropy in TensorFlow

TensorFlow 针对分类问题，实现了四个交叉熵函数，分别是：

- [tf.nn.sigmoid\_cross\_entropy\_with\_logits](https://www.tensorflow.org/versions/master/api_docs/python/nn.html#sigmoid_cross_entropy_with_logits)
- [tf.nn.softmax\_cross\_entropy\_with\_logits](https://www.tensorflow.org/versions/master/api_docs/python/nn.html#softmax_cross_entropy_with_logits)
- [tf.nn.sparse\_softmax\_cross\_entropy\_with\_logits](https://www.tensorflow.org/versions/master/api_docs/python/nn.html#sparse_softmax_cross_entropy_with_logits)
- [tf.nn.weighted\_cross\_entropy\_with\_logits](https://www.tensorflow.org/versions/master/api_docs/python/nn.html#weighted_cross_entropy_with_logits)

[详细内容参考 API 文档](https://www.tensorflow.org/versions/master/api_docs/python/nn.html#sparse_softmax_cross_entropy_with_logits)

## sigmoid\_cross\_entropy\_with\_logits

我们先看 `sigmoid_cross_entropy_with_logits`，为什么呢，因为它的实现和前面的交叉熵算法定义是一样的，也是 TensorFlow 最早实现的交叉熵算法。这个函数的输入是 logits 和 targets，logits 就是神经网络模型中的 $W \* X$ 矩阵，注意不需要经过 sigmoid，而 targets 的 shape 和 logits 相同，就是正确的 label 值，例如这个模型一次要判断 100 张图是否包含 10 种动物，这两个输入的 shape 都是 $[100, 10]$。注释中还提到这 10 个分类之间是独立的、不要求是互斥，这种问题我们称之为多目标或者多标签分类问题，例如判断图片中是否包含 10 种动物，label 值可以包含多个 1 或 0 个 1。这种问题，我们可以使用 `sigmoid_cross_entropy_with_logits` 函数。

另外，还有一种问题是多分类问题，例如我们对年龄特征分为 5 段，只允许 5 个值有且只有 1 个值为 1，这种问题可以直接用这个函数吗？答案是不可以，我们先来看看 `sigmoid_cross_entropy_with_logits` 的代码实现吧。

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 ``` | ``` """ For brevity, let `x = logits`, `z = labels`.  The logistic loss is        z * -log(sigmoid(x)) + (1 - z) * -log(1 - sigmoid(x))     = z * -log(1 / (1 + exp(-x))) + (1 - z) * -log(exp(-x) / (1 + exp(-x)))     = z * log(1 + exp(-x)) + (1 - z) * (-log(exp(-x)) + log(1 + exp(-x)))     = z * log(1 + exp(-x)) + (1 - z) * (x + log(1 + exp(-x))     = (1 - z) * x + log(1 + exp(-x))     = x - x * z + log(1 + exp(-x)) """ ``` |

可以看到这就是标准的 Cross Entropy 算法实现，对 $W \* X$ 得到的值进行 sigmoid 激活，保证取值在 0 到 1 之间，然后放在交叉熵的函数中计算 Loss。对于二分类问题这样做没问题，但对于前面提到的多分类问题，例如年龄取值范围在 $[0, 4]$，目标值也在 $[0, 4]$，这里如果经过 sigmoid 后预测值就限制在 0 到 1 之间，而且公式中的 $(1 – z)$ 就会出现负数，仔细想一下 0 到 4 之间还不存在线性关系，如果直接把 label 值带入计算肯定会有非常大的误差。但是对于这多分类问题， TensorFlow 又提供了基于 Softmax 的交叉熵函数。

因此对于多分类问题是不能直接代入的，但是对于多标签分类问题，我们可以灵活变通，把 5 个年龄段的预测用 **onehot encoding** 变成 5 维的 label，训练时当做 5 个不同的目标来训练即可，但不保证只有一个为 1。

## softmax\_cross\_entropy\_with\_logits

Softmax 本身的算法很简单，就是把所有值用 $e^n$ 计算出来，求和后算每个值占的比率，保证总和为 1，一般我们可以认为 Softmax 出来的就是 confidence，也就是概率。

`softmax_cross_entropy_with_logits` 和 `sigmoid_cross_entropy_with_logits` 很不一样，输入是类似的 logits 和 lables 的 shape 一样，但这里要求分类的结果是互斥的，保证只有一个字段有值，例如 CIFAR-10 中图片只能分一类而不像前面判断是否包含多类动物。

想一下问什么会有这样的限制？在函数头的注释中我们看到，这个函数传入的 logits 是 unscaled 的，既不做 sigmoid 也不做 softmax，因为函数实现会在内部更高效得使用 softmax，对于任意的输入经过 softmax 都会变成和为 1 的概率预测值，这个值就可以代入变形的 Cross Entroy 算法：

从而得到有意义的 Loss 值了。如果是多标签多目标问题，经过 softmax 就不会得到多个和为 1 的概率，而且 label 有多个 1 也无法计算交叉熵，因此这个函数只适合单目标的二分类或者多分类问题。

再补充一点，对于多分类问题，例如我们的年龄分为 5 类，并且人工编码为 0、1、2、3、4，因为输出值是 5 维的特征，因此我们需要人工做 **onehot encoding** 分别编码为 00001、00010、00100、01000、10000，才可以作为这个函数的输入。理论上我们不做 onehot encoding 也可以，做成和为 1 的概率分布也可以，但需要保证是和为 1，和不为 1 的实际含义不明确，TensorFlow 的 C++ 代码实现计划检查这些参数，可以提前提醒用户避免误用。

## sparse\_softmax\_cross\_entropy\_with\_logits

`sparse_softmax_cross_entropy_with_logits` 是 `softmax_cross_entropy_with_logits`的易用版本，除了输入参数不同，作用和算法实现都是一样的。前面提到 `softmax_cross_entropy_with_logits` 的输入必须是类似 **onehot encoding** 的多维特征，但 CIFAR-10、ImageNet 和大部分分类场景都只有一个分类目标，label 值都是从 0 编码的整数，每次转成 onehot encoding 比较麻烦，有没有更好的方法呢？答案就是用 `sparse_softmax_cross_entropy_with_logits`：

- 它的第一个参数 logits 和前面一样，shape 是 `[batch_size, num_classes]`。
- 而第二个参数 labels，`softmax_cross_entropy_with_logits`规定 shape 必须是 `[batch_size, num_classes]`，否则无法做 Cross Entropy。这意味着，labels 的值必须是从 0 开始编码的 int32 或 int64，而且值范围是 `[0, num_class)`，如果我们从 1 开始编码或者步长大于 1，会导致某些 label 值超过这个范围，代码会直接报错退出，这也很好理解，TensorFlow 通过这样的限制才能知道用户传入的 3、6 或者 9 对应是哪个 class。而 **`sparse`** 版本，则允许 labels 的 shape 是 `[batch_size]`，通过在内部高效实现类似的 **onehot encoding**，从而简化用户的输入。

因此，如果用户已经做了 **onehot encoding** 那可以直接使用不带 `softmax_cross_entropy_with_logits` 函数，如果还没有进行 **onehot encoding**，则可以选择使用 `sparse_softmax_cross_entropy_with_logits` 函数。

## weighted\_cross\_entropy\_with\_logits

`weighted_cross_entropy_with_logits` 是 `sigmoid_cross_entropy_with_logits` 的拓展版，输入参数和实现和后者差不多，只是可以多支持一个 `pos_weight` 参数，目的是可以增加或者减小正样本在算 Cross Entropy 时的 Loss。实现原理很简单，在传统基于 Sigmoid 的交叉熵算法上，正样本算出的值乘以某个系数 **`pos_weight`**，算法实现如下：

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 ``` | ``` """ The usual cross-entropy cost is defined as:      targets * -log(sigmoid(logits)) +         (1 - targets) * -log(1 - sigmoid(logits))  The argument `pos_weight` is used as a multiplier for the positive targets:      targets * -log(sigmoid(logits)) * pos_weight +         (1 - targets) * -log(1 - sigmoid(logits))  For brevity, let `x = logits`, `z = targets`, `q = pos_weight`. The loss is:        qz * -log(sigmoid(x)) + (1 - z) * -log(1 - sigmoid(x))     = qz * -log(1 / (1 + exp(-x))) + (1 - z) * -log(exp(-x) / (1 + exp(-x)))     = qz * log(1 + exp(-x)) + (1 - z) * (-log(exp(-x)) + log(1 + exp(-x)))     = qz * log(1 + exp(-x)) + (1 - z) * (x + log(1 + exp(-x))     = (1 - z) * x + (qz +  1 - z) * log(1 + exp(-x))     = (1 - z) * x + (1 + (q - 1) * z) * log(1 + exp(-x)) """ ``` |

# Summary

这就是 TensorFlow 目前提供的有关 Cross Entropy 的函数实现，用户需要理解多标签和多分类的场景，根据业务需求（分类目标是否独立和互斥）来选择基于 Sigmoid 或者 Softmax 的实现，如果使用 Sigmoid 目前还支持加权的实现，如果使用 Softmax 我们可以自己做 onehot coding 或者使用更易用的 `sparse_softmax_cross_entropy_with_logits` 函数。

TensorFlow 提供的 Cross Entropy 函数基本涵盖了多目标和多分类的问题，但如果同时是多目标多分类的场景，肯定是无法使用 `softmax_cross_entropy_with_logits`，如果使用`sigmoid_cross_entropy_with_logits` 我们就把多分类的特征都认为是独立的特征，而实际上他们有且只有一个为 1 的非独立特征，计算 Loss 时不如 Softmax 有效。这里可以预测下，未来 TensorFlow 社区将会实现更多的 op 解决类似的问题，我们也期待更多人参与 TensorFlow 贡献算法和代码。
