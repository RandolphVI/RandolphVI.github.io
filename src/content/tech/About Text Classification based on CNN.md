---
title: "About Text Classification based on CNN"
date: 2017-03-10
category: 自然语言处理
tags: ["Machine Learning", "TensorFlow", "Python"]
description: "本文介绍了 CNN 用于文本分类任务的流程，并结合 TensorFlow 代码详细介绍实现细节。"
draft: false
---

![](https://farm5.staticflickr.com/4373/35507009504_3298ce3029_o.jpg)

> **更多 AI 文章：** [查看 AI 分类](/categories/AI/)

## Outline

- **Embedding Layer**
- **Convolution Layer**
  - Convolution
  - Max-Pooling
- **Dropout**
- **Output Layer**
- **Loss Function**
- **Accuracy**

## Embedding Layer
```python
with tf.device('/cpu:0'), tf.name_scope("embedding"):
    W = tf.Variable(
        tf.random_uniform([vocab_size, embedding_size], -1.0, 1.0),
        name="W")
    self.embedded_sentence = tf.nn.embedding_lookup(W, self.input_x)
    self.embedded_sentence_expanded = tf.expand_dims(self.embedded_chars, -1)
```

存储全部 word vector 的矩阵 $W$，$W$ 初始化时是随机 random 出来的，训练过程中并不是每次都会使用全部的 vocabulary，而只是产生一个 batch（batch 中都是 sentence，每个 sentence 标记了出现哪些 word，每个 sentence 最大长度为 `max_seq_len` 个 word，因此 batch 相当于一个二维列表），这个 batch 就是 <strong>input_x</strong>：

```python
self.input_x = tf.placeholder(tf.int32, [None, sequence_length], name="input_x")
```

`tf.nn.embedding_lookup`：查找 input_x 中所有的 ids，获取它们的 word vector。batch 中的每个 sentence 的每个 word 都要查找。所以得到的 `embedded_sentence` 的 shape 应该是 `[None, max_seq_len, embedding_size]`。
但是，输入的 word vectors 得到之后，下一步就是输入到卷积层，用到 `tf.nn.conv2d()` 函数，`conv2d()` 的参数列表：

- `input: [batch, in_height, in_width, in_channels]`
- `filter: [filter_height, filter_width, in_channels, out_channels]`

对比可以发现，就差一个 ` in_channels` 了，而最 simple 的版本也就只有 1 通道（像有的论文中的模型用到了 multichannel）。因此需要 `expand dim` 来适应 `conv2d` 的 input 要求，tensorflow 已经提供了这样的功能：

> This operation is useful if you want to add a batch dimension to a single element. For example, if you have a single image of shape [height, width, channels], you can make it a batch of 1 image with expand_dims(image, 0), which will make the shape [1, height, width, channels].

Example:

```python
# 't' is a tensor of shape [2]
shape(expand_dims(t, -1)) ==> [2, 1]
```

因此只需要 `tf.expand_dims(self.embedded_chars, -1)`，之后就能在 embedded_sentence 后面加一个 `in_channels=1` 了。

## Convolution Layer

```python
# Create a convolution + maxpool layer for each filter size
pooled_outputs = []
for i, filter_size in enumerate(filter_sizes):
    with tf.name_scope("conv-maxpool-%s" % filter_size):
        # Convolution Layer
        filter_shape = [filter_size, embedding_size, 1, num_filters]
        W = tf.Variable(tf.truncated_normal(filter_shape, stddev=0.1), name="W")
        b = tf.Variable(tf.constant(0.1, shape=[num_filters]), name="b")
        conv = tf.nn.conv2d(
            self.embedded_sentence_expanded,
            W,
            strides=[1, 1, 1, 1],
            padding="VALID",
            name="conv")
        # Apply nonlinearity
        conv_out = tf.nn.relu(tf.nn.bias_add(conv, b), name="relu")
        # Maxpooling over the outputs
        pooled = tf.nn.max_pool(
            conv_out,
            ksize=[1, sequence_length - filter_size + 1, 1, 1],
            strides=[1, 1, 1, 1],
            padding='VALID',
            name="pool")
        pooled_outputs.append(pooled)

# Combine all the pooled features
num_filters_total = num_filters * len(filter_sizes)
self.pool = tf.concat(pooled_outputs, axis=3)
self.pool_flat = tf.reshape(self.pool, [-1, num_filters_total])
```

### Convolution

首先，对 `filter_sizes` 中的每一个 `filter_window_size`（常见的为 3, 4, 5） 都要进行卷积（每一种 `size` 都要产生 `num_filters` 个 `filter maps` 特征图），所以外层就是一个大的 **for** 循环。

由于在 **for** 循环内部，`filter_size` 是固定了的，所以每个 filter 的形状为 `filter_shape = [filter_size, embedding_size, 1, num_filters]`。之所以要弄清楚 `filter shape`，是因为要对 filter 的权重矩阵 $w$ 进行初始化：

```python
W = tf.Variable(tf.truncated_normal(filter_shape, stddev=0.1), name="W")
```

这里为什么要使用 `tf.truncated_normal()` 函数[^1]？

这是因为 tensorflow 中提供了两个 normal 函数：

- `tf.random_normal(shape, mean=0.0, stddev=1.0, dtype=tf.float32, seed=None, name=None)`
- `tf.truncated_normal(shape, mean=0.0, stddev=1.0, dtype=tf.float32, seed=None, name=None)`

对比了一下，这两个函数的参数列表完全相同，不同之处我就直接引用文档中的说明，讲解的很清楚：

> Outputs random values from a truncated normal distribution.
> The generated values follow a normal distribution with specified mean and standard deviation, except that values whose magnitude is more than 2 standard deviations from the mean are dropped and re-picked.

也就是说 random 出来的值的范围都在 `[mean - 2 standard_deviations, mean + 2 standard_deviations]` 内。
下图可以告诉你这个范围在哪：

<img style="width:50%" src="https://farm3.staticflickr.com/2320/32925087411_1151d71bc1_o.jpg">

$$
c_{i} = f(w⋅x_{i:i+h-1}+b)
$$

`conv2d()` 得到的其实是公式中的 $w⋅x $的部分，还要加上 `bias` 项：`tf.nn.bias_add(conv, b)`，并且通过激励函数 relu：`tf.nn.relu`。最终得到卷积层的输出 `conv_out`。

那究竟卷积层的输出 `conv_out` 的 shape 是什么样呢？
官方文档中有一段话解释了卷积后得到的输出结果：

1. Flattens the filter to a 2-D matrix with shape `[filter_height * filter_width * in_channels, output_channels]` .
2. Extracts image patches from the input tensor to form a virtual tensor of shape `[batch, out_height, out_width, filter_height * filter_width * in_channels]` .
3. For each patch, right_multiplies the filter matrix and the image patch over.

第三步进行了 **right-multiply** 之后得到的结果就是 `[batch, out_height, out_width, output_channels]`，但是还是不清楚这里的 `out_height` 和 `out_width` 到底是什么。 

> “VALID” padding means that we slide the filter over our sentence without padding the edges, performing a narrow convolution that gives us an output of shape [1, sequence_length - filter_size + 1, 1, 1]. 

这句话的意思是说 `out_height` 和 `out_width` 其实和 `padding` 的方式有关系，这里选择了 `'VALID' `的方式，也就是不在边缘加 padding，得到：

- `out_height = sequence_length - filter_size + 1`
- `out_width = 1`

因此，综合上面的两个解释，我们知道 `conv2d-(+bias)-relu` 之后得到的卷积输出 `conv_out`  的 shape 为：

`[batch, sequence_length - filter_size + 1, 1, num_filters]`

### Max-Pooling

接下来的工作就是 max-pooling 了，来看一下 tensorflow 中给出的函数:

`tf.nn.max_pool(value, ksize, strides, padding, data_format='NHWC', name=None)`

其中最重要的两个参数是 `value` 和 `ksize`。

- `value` ：相当于是 max pooling 层的输入，在整个网络中就是刚才我们得到的 `conv_out`，检查了一下它俩的 shape 是一致的，说明可以直接传递到下一层。
- `ksize`：官方解释说是 input tensor 每一维度上的 window size。仔细想一下，其实就是想定义多大的范围来进行 max-pooling，比如在图像中常见的 2*2 的小正方形区域对整个 $h$ 得到 feature map 进行 pooling；但是在 NLP 中，每一个 feature map 的 shape 是 `[batch, sequence_length - filter_size + 1, 1, num_filters]`，我们想知道每个 feature map 中的最大值，也就是当前 feature map 中最重要的 feature 是哪一个，因此我们设置 `ksize=[1, sequence_length - filter_size + 1, 1, 1]`。

根据 `ksize` 的设置，和 `value` 的 shape，可以得到 `pooled` 的 shape：`[batch, 1, 1, num_filters]`。

这是一个 `filter_size` 的结果（比如 `filter_size = 3`），`pooled` 存储的是当前 filter_size 下每个 sentence  `num_filters` 个特征图中最重要的 features，将结果 append 到 `pooled_outputs` 列表中存起来，再对下一个 `filter_size` （比如 `filter_size = 4`）进行相同的操作。

等到 for 循环结束时，也就是所有的 `filter_size` 全部进行了 convolution 和 max-pooling 之后，首先需要把相同 `filter_size` 的所有 pooled 结果 concat 起来（组成 batch），再将不同的 filter_size 之间的结果 concat 起来，最后得到的应该类似于二维数组：`[batch, num_filters_total]`

```python
# Combine all the pooled features
num_filters_total = num_filters * len(filter_sizes)
self.pool = tf.concat(pooled_outputs, axis=3)
self.pool_flat = tf.reshape(self.pool, [-1, num_filters_total])
```

`num_filters_total` 一共有 `  num_filters * len(filter_sizes)`个，比如  $100 * 3 = 300$ 个，连接的过程需要使用 `tf.concat`，官方给出的例子很容易理解。

最后得到的 `pool_flat` 就是 shape 为 `[batch, 300]` 的 tensor。


## Dropout
```python
# Add dropout
with tf.name_scope("dropout"):
    self.h_drop = tf.nn.dropout(self.pool_flat, self.dropout_keep_prob)
```

Dropout[^2] 仅对隐层的输出层进行 drop，使得有些结点的值不输出给 softmax 层。

## Output Layer

```python
# Final (unnormalized) scores and predictions
with tf.name_scope("output"):
    W = tf.get_variable(
        "W",
        shape=[num_filters_total, num_classes],
        initializer=tf.contrib.layers.xavier_initializer())
    b = tf.Variable(tf.constant(0.1, shape=[num_classes]), name="b")
    self.logits = tf.nn.xw_plus_b(self.h_drop, W, b, name="scores")
    self.softmax_scores = tf.nn.softmax(self.logits, name="softmax_scores")
    self.predictions = tf.argmax(self.logits, axis=1, name="predictions")
    self.topKPreds = tf.nn.top_k(self.softmax_scores, k=1, sorted=True, name="topKPreds")
```

输出层其实是个 softmax 分类器，可以得到所有类别的 scores 预测概率值，其中 `self.logits` 与 `self.softmax_scores` 的区别就是是否进行了 normalization。

随后，通过 `tf.argmax()` 以及 `tf.topKPreds()`  选出概率值为最大的那个类别以及所预测出来的概率值。`self.logits` 与 `self.softmax_scores` 的 shape均为：`[batch, num_classes]`，进行 `argmax()`  的时候是选取每行的 max，所以`axis=1`，而 `top_k()` 直接取每行概率值最大的数。

因此，最后 `self.predictions` 的 shape 为：`[batch, 1]`。

## Loss function

得到了整个网络的输出之后，也就是我们得到了 `y_prediction` ，但还需要和真实的 `y_label` 进行比较，以此来确定预测好坏。

```python
# CalculateMean cross-entropy loss
with tf.name_scope("loss"):
    losses = tf.nn.softmax_cross_entropy_with_logits(labels=self.input_y, logits=self.logits)
    losses = tf.reduce_mean(losses,  name="softmax_losses")
    l2_losses = tf.add_n([tf.nn.l2_loss(tf.cast(v, tf.float32)) for v in
                          tf.trainable_variables()], name="l2_losses") * l2_reg_lambda
    self.loss = tf.add(losses, l2_losses, name="loss")
```


还是使用常规的交叉熵 [cross_entropy](/tech/cross-entropy-in-tensorflow/)[^4] 作为 loss function。最后一层是全连接层，为了防止过拟合，最后还要在 loss function 中加入 <strong>L2 正则项</strong>[^3]，即 `l2_loss`。`l2_reg_lambda` 来确定惩罚的力度。

## Accuracy
```python
# Accuracy
with tf.name_scope("accuracy"):
    correct_predictions = tf.equal(self.predictions, tf.argmax(self.input_y, 1))
    self.accuracy = tf.reduce_mean(tf.cast(correct_predictions, "float"), name="accuracy")
```

`tf.equal(x, y)` 返回的是一个 bool tensor，如果 x 与 y 对应位置的值相等就是 `true`，否则 `false`。得到的tensor 是 `[batch, 1]` 的。

`tf.cast(x, dtype)` 将 bool tensor 转化成 float 类型的 tensor，方便计算。

`tf.reduce_mean()` 本身输入的就是一个 float 类型的 vector（元素要么是 `0.0`，要么是 `1.0`），直接对这样的vector 计算 mean 得到的就是 accuracy，不需要指定 reduction_indices。

[^1]: 与 `tf.random_normal()` 不同，截断正态分布会将超出均值正负两个标准差范围的值重新采样。这对权重初始化很重要，可防止极端初始化值导致梯度爆炸或消失。
[^2]: Dropout 由 Srivastava et al. (2014) 在同名论文中提出，通过训练时随机将神经元输出置零来防止共同适应（co-adaptation），即多个神经元过度依赖彼此而减弱单个神经元的表达能力。
[^3]: L2 正则化（也称 weight decay）通过向损失函数加入权重平方和来惩罚大权重，过于复杂的模型将被惩罚，从而促使模型学习更泛化的表示以更好地应对测试集。与 Dropout 组合使用效果更佳。
[^4]: 交叉熵（Cross Entropy）是分类任务中最常用的损失函数，详细介绍了 TensorFlow 中四种不同交叉熵函数（sigmoid、softmax、sparse_softmax、weighted）的适用场景与区别。
