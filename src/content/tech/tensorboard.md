---
title: "Tensorboard"
date: 2017-03-13
category: "AI"
tags: ["TensorFlow", "Machine Learning", "Python"]
description: "本文主要介绍 TensorFlow 的 Tensorboard 功能。"
draft: false
---

![](https://farm5.staticflickr.com/4399/36206153111_6662041dd1_o.png)

> **更多 AI 文章：** [查看 AI 分类](/categories/AI/)

# TensorFlow Tensorboard

Tensorboard 是 TensorFlow 中帮助我们对所构建的静态图 Graph 进行可视化的工具，对于我们初学者理解网络架构、每层网络的细节都是很有帮助的。由于前几天刚接触 TensorFlow，所以在尝试学习 Tensorboard 的过程中，遇到了一些问题。在此基础上，参考了 TensorFlow 官方的 Tensorboard Tutorials 以及网上的一些文章。由于前不久 TensorFlow 1.0 刚发布，网上的一些学习资源或者是 tensorboard 代码在新的版本中并不适用，所以自己改写并实现了官方网站上提及的三个实例的 Tensorboard 版本：

1. 最基础简单的线性回归模型
2. 基于 MNIST 手写体数据集的浅层 MLP 模型
3. 基于 MNIST 手写体数据集的 CNN 模型

文章不会详细介绍 TensorFlow 以及 Tensorboard 的知识，主要是模型的代码以及部分模型实验截图。

注意：文章前提默认读者们知晓 TensorFlow，知晓 Tensorboard，以及 TensorFlow 的一些主要概念<strong>`Variables`</strong>、<strong>`Placeholder`</strong>。还有，默认你已经将需要用到的 MNIST 数据集下载到了你代码当前所在文件夹。

## Environment

**OS: macOS Sierra 10.12.x**

**Python Version: 3.6.x**

**TensorFlow: 1.x**

## Tensorboard

Tensorboard有几大模块：

- <strong>SCALARS</strong>：记录单一变量的，使用 **`tf.summary.scalar()`** 收集构建。
- <strong>IMAGES</strong>：收集的图片数据，当我们使用的数据为图片时（选用）。
- <strong>AUDIO</strong>：收集的音频数据，当我们使用数据为音频时（选用）。
- <strong>GRAPHS</strong>：构件图，效果图类似流程图一样，我们可以看到数据的流向，使用<strong>`tf.name_scope()`</strong>收集构建。
- <strong>DISTRIBUTIONS</strong>：用于查看变量的分布值，比如 W（Weights）变化的过程中，主要是在 0.5 附近徘徊。
- <strong>HISTOGRAMS</strong>：用于记录变量的历史值（比如 weights 值，平均值等），并使用折线图的方式展现，使用<strong>`tf.summary.histogram()`</strong>进行收集构建。

## Examples

### 最简单的线性回归模型

```python
import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt

def add_layer(layoutname, inputs, in_size, out_size, act = None):
	with tf.name_scope(layoutname):
		with tf.name_scope('weights'):
			weights = tf.Variable(tf.random_normal([in_size, out_size]), name = 'weights')
			w_hist = tf.summary.histogram('weights', weights)
		with tf.name_scope('biases'):
			biases = tf.Variable(tf.zeros([1, out_size]) + 0.1, name = 'biases')
			b_hist = tf.summary.histogram('biases', biases)
		with tf.name_scope('Wx_plus_b'):
			Wx_plus_b = tf.add(tf.matmul(inputs, weights), biases)

		if act is None:
			outputs = Wx_plus_b
		else :
			outputs = act(Wx_plus_b)
		return outputs

x_data = np.linspace(-1, 1, 300)[:,np.newaxis]
noise = np.random.normal(0,0.05, x_data.shape)
y_data = np.square(x_data) - 0.5 + noise

with tf.name_scope('Input'):
	xs = tf.placeholder(tf.float32, [None, 1], name = "input_x")
	ys = tf.placeholder(tf.float32, [None, 1], name = "target_y")


l1 = add_layer("first_layer", xs, 1, 10, act = tf.nn.relu)
l1_hist = tf.summary.histogram('l1', l1)

y = add_layer("second_layout", l1, 10, 1, act = None)
y_hist = tf.summary.histogram('y', y)

with tf.name_scope('loss'): 
	loss = tf.reduce_mean(tf.reduce_sum(tf.square(ys - y), 
							reduction_indices = [1]))
	tf.summary.histogram('loss ', loss)
	tf.summary.scalar('loss', loss)

with tf.name_scope('train'):
	train_step = tf.train.GradientDescentOptimizer(0.1).minimize(loss)

init = tf.global_variables_initializer()
merged = tf.summary.merge_all()

with tf.Session() as sess:
	fig = plt.figure()
	ax = fig.add_subplot(1, 1, 1)
	ax.scatter(x_data, y_data)
	plt.ion()
	plt.show()
	
	writer = tf.summary.FileWriter('logs/', sess.graph)
	sess.run(init)
	
	for train in range(1000):
		sess.run(train_step, feed_dict = {xs: x_data, ys: y_data})
		if train % 50 == 0:
			try:
				ax.lines.remove(lines[0])
			except Exception:
				pass
			summary_str = sess.run(merged, feed_dict = {xs: x_data, ys: y_data})
			writer.add_summary(summary_str, train)

			print(train, sess.run(loss, feed_dict = {xs: x_data, ys: y_data}))
			
			prediction_value = sess.run(y, feed_dict = {xs: x_data})
			lines = ax.plot(x_data, prediction_value, 'r-', lw = 5)
			plt.pause(1)
```

### 基于 MNIST 手写体数据集的浅层 MLP 模型

```python
# 基于 MNIST 手写体数据集的浅层 MLP 模型
from tensorflow.examples.tutorials.mnist import input_data
import tensorflow as tf
import numpy as np

def add_layer(layoutname, inputs, in_size, out_size, act = None):
	with tf.name_scope(layoutname):
		with tf.name_scope('weights'):
			weights = tf.Variable(tf.zeros([in_size, out_size]), name = 'weights')
			w_hist = tf.summary.histogram("weights", weights)
		with tf.name_scope('biases'):
			biases = tf.Variable(tf.zeros(out_size), name = 'biases')
			b_hist = tf.summary.histogram("biases", biases)
		with tf.name_scope('Wx_plus_b'):
			Wx_plus_b = tf.add(tf.matmul(inputs, weights), biases)
		
		if act is None:
			outputs = Wx_plus_b
		else:
			outputs = act(Wx_plus_b)
		return outputs
		
# Import data
mnist_data_path = 'MNIST_data/'
mnist = input_data.read_data_sets(mnist_data_path, one_hot = True)

with tf.name_scope('Input'):
	x = tf.placeholder(tf.float32, [None, 28 * 28], name = 'input_x')
	y_ = tf.placeholder(tf.float32, [None, 10], name = 'target_y')

y = add_layer("hidden_layout", x, 28*28, 10, act = tf.nn.softmax)
y_hist = tf.summary.histogram('y', y)

# labels 真实值 logits 预测值
with tf.name_scope('loss'):
	cross_entroy = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(labels = y_,
					logits = y))
	tf.summary.histogram('cross entropy', cross_entroy)
	tf.summary.scalar('cross entropy', cross_entroy)

with tf.name_scope('train'):
	train_step = tf.train.GradientDescentOptimizer(0.5).minimize(cross_entroy)

# Test trained model
with tf.name_scope('test'):
	correct_prediction = tf.equal(tf.argmax(y, 1), tf.argmax(y_, 1))
	accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
	tf.summary.scalar('accuracy', accuracy)

init = tf.global_variables_initializer()
merged = tf.summary.merge_all()

with tf.Session() as sess:
	writer = tf.summary.FileWriter('logs/', sess.graph)
	sess.run(init)

	for i in range(1000):
		if i % 10 == 0:
			feed = {x: mnist.test.images, y_: mnist.test.labels}
			result = sess.run([merged, accuracy], feed_dict = feed)
			summary_str = result[0]
			acc = result[1]
			writer.add_summary(summary_str, i)
			print(i, acc)
		else:
			batch_xs, batch_ys = mnist.train.next_batch(100)
			feed = {x: batch_xs, y_: batch_ys}
			sess.run(train_step, feed_dict = feed)

	print('final result: ', sess.run(accuracy, feed_dict = {x: mnist.test.images, y_: mnist.test.labels}))
```

### 基于 MNIST 手写体数据集的 CNN 模型

```python
# 基于 MNIST 数据集的 CNN 模型
from tensorflow.examples.tutorials.mnist import input_data
import tensorflow as tf
import numpy as np

def weight_variable(shape):
	initial = tf.truncated_normal(shape, stddev = 0.1)
	return tf.Variable(initial)
	
def bias_variable(shape):
	initial = tf.constant(0.1, shape = shape)
	return tf.Variable(initial)

def conv2d(x, W):
	return tf.nn.conv2d(x, W, strides=[1, 1, 1, 1], padding='SAME')

def max_pool_2x2(x):
	return tf.nn.max_pool(x, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')
	
def variable_summaries(var):
	"""Attach a lot of summaries to a Tensor (for TensorBoard visualization)."""
	with tf.name_scope('summaries'):
		mean = tf.reduce_mean(var)
		tf.summary.scalar('mean', mean)
		with tf.name_scope('stddev'):
			stddev = tf.sqrt(tf.reduce_mean(tf.square(var - mean)))
		tf.summary.scalar('stddev', stddev)
		tf.summary.scalar('max', tf.reduce_max(var))
		tf.summary.scalar('min', tf.reduce_min(var))
		tf.summary.histogram('histogram', var)

def add_layer(input_tensor, weights_shape, biases_shape, layer_name, act = tf.nn.relu, flag = 1):
	"""Reusable code for making a simple neural net layer.

	It does a matrix multiply, bias add, and then uses relu to nonlinearize.
	It also sets up name scoping so that the resultant graph is easy to read,
	and adds a number of summary ops."""
    
	with tf.name_scope(layer_name):
		with tf.name_scope('weights'):
			weights = weight_variable(weights_shape)
			variable_summaries(weights)
		with tf.name_scope('biases'):
			biases = bias_variable(biases_shape)
			variable_summaries(biases)
		with tf.name_scope('Wx_plus_b'):
			if flag == 1:
				preactivate = tf.add(conv2d(input_tensor, weights), biases)
			else:
				preactivate = tf.add(tf.matmul(input_tensor, weights), biases)
			tf.summary.histogram('pre_activations', preactivate)
		if act == None:
			outputs = preactivate
		else:
			outputs = act(preactivate, name = 'activation')
			tf.summary.histogram('activation', outputs)
		return outputs

def main():
	# Import data
	mnist_data_path = 'MNIST_data/'
	mnist = input_data.read_data_sets(mnist_data_path, one_hot = True)
	
	with tf.name_scope('Input'):
		x = tf.placeholder(tf.float32, [None, 28*28], name = 'input_x')
		y_ = tf.placeholder(tf.float32, [None, 10], name = 'target_y')

	# First Convolutional Layer
	x_image = tf.reshape(x, [-1, 28, 28 ,1])
	conv_1 = add_layer(x_image, [5, 5, 1, 32], [32], 'First_Convolutional_Layer', flag = 1)
	
	# First Pooling Layer
	pool_1 = max_pool_2x2(conv_1)
	
	# Second Convolutional Layer 
	conv_2 = add_layer(pool_1, [5, 5, 32, 64], [64], 'Second_Convolutional_Layer', flag = 1)

	# Second Pooling Layer 
	pool_2 = max_pool_2x2(conv_2)

	# Densely Connected Layer
	pool_2_flat = tf.reshape(pool_2, [-1, 7*7*64])
	dc_1 = add_layer(pool_2_flat, [7*7*64, 1024], [1024], 'Densely_Connected_Layer', flag = 0) 
	
	# Dropout
	keep_prob = tf.placeholder(tf.float32)
	dc_1_drop = tf.nn.dropout(dc_1, keep_prob)
	
	# Readout Layer
	y = add_layer(dc_1_drop, [1024, 10], [10], 'Readout_Layer', flag = 0)
	
	# Optimizer
	with tf.name_scope('cross_entroy'):
		cross_entroy = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(labels = y_,
						logits = y))
		tf.summary.scalar('cross_entropy', cross_entroy)
		tf.summary.histogram('cross_entropy', cross_entroy)
	
	# Train
	with tf.name_scope('train'):
		train_step = tf.train.AdamOptimizer(1e-4).minimize(cross_entroy)
	
	# Test
	with tf.name_scope('accuracy'):
		with tf.name_scope('correct_prediction'):
			correct_prediction = tf.equal(tf.argmax(y, 1), tf.argmax(y_, 1))
		with tf.name_scope('accuracy'):
			accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
		tf.summary.scalar('accuracy', accuracy)
		
	sess = tf.InteractiveSession()
	merged = tf.summary.merge_all()
	train_writer = tf.summary.FileWriter('train/', sess.graph)
	test_writer = tf.summary.FileWriter('test/')
	tf.global_variables_initializer().run()

	def feed_dict(train):
		if train:
			batch_xs, batch_ys = mnist.train.next_batch(100)
			k = 0.5
		else:
			batch_xs, batch_ys = mnist.test.images, mnist.test.labels
			k = 1.0
		return {x: batch_xs, y_: batch_ys, keep_prob: k}
	
	# Train the model, and also write summaries.
	# Every 10th step, measure test-set accuracy, and write test summaries
	# All other steps, run train_step on training data, & add training summaries
	for i in range(10000):
		if i % 10 == 0:	# Record summaries and test-set accuracy
			summary, acc = sess.run([merged, accuracy], feed_dict = feed_dict(False))
			test_writer.add_summary(summary, i)
			print("step %d, training accuracy %g" %(i, acc))
		else:	# Record train set summaries, and train
			if i % 100 == 99:	# Record execution stats
				run_options = tf.RunOptions(trace_level = tf.RunOptions.FULL_TRACE)
				run_metadata = tf.RunMetadata()
				summary, _ = sess.run([merged, train_step], feed_dict = feed_dict(True), 
										options = run_options, run_metadata = run_metadata)
				train_writer.add_run_metadata(run_metadata, 'step %d ' % i)
				train_writer.add_summary(summary, i)
				print('Adding run metadata for', i)
			else:
				summary, _ = sess.run([merged, train_step], feed_dict = feed_dict(True))
				train_writer.add_summary(summary, i)
main()
```

可能对于最后一个模型 CNN 的代码，需要一些 CNN 卷积神经网络的一些知识。例如什么是卷积、池化，还需要了解 TensorFlow 中用到的相应函数，如 <strong>`tf.nn.conv2d()`</strong>，<strong>`tf.nn.max_pool()`</strong>，这里不再赘述，可以参考我的这篇文章：[CNN Introduction](/tech/cnn-introduction/)。

## Experiment

贴上最后一个模型的部分代码截图：

![](https://farm4.staticflickr.com/3681/32385203053_a1a401b062_o.png)

说明：<strong>上图右侧是 CNN 网络训练的步数以及对应的结果，程序需要运行挺久时间的，CPU 占用率也很高，建议挂在晚上跑，人去休息睡觉。可以根据自身机器条件修改参数 range(10000)。</strong>。

上述代码运行完成之后，命令行中跳转到代码生成的「train」文件夹中（其和代码文件存在于同一文件夹中），然后输入 <strong>`tensorboard --logdir .`</strong>，等待程序反应之后，浏览器访问<strong>`localhost:6006`</strong>（当然你也可以自己定义端口）。如果不出意外，你会得到以下内容：

### Tensorboard Info

#### Scalars:

![](https://farm3.staticflickr.com/2671/33073147421_7e52b090a1_o.png)

#### Graphs:

![](https://farm1.staticflickr.com/740/32818486500_bdd7dacc7f_o.png)

#### Distributions:

![](https://farm4.staticflickr.com/3703/32818489270_ae5fc65e5a_o.png)

#### Histograms:

![](https://farm3.staticflickr.com/2741/33073150051_260717b598_o.png)

关于各个模块的作用，以及各个变量的意义，开篇已经提及，我在此就不再赘述了。

另外，在自己的机器模型在训练期间（特别是深度网络），训练时间通常几小时到十几小时不等，甚至可能会花上好几天，那么在这段时间，你们又会干些什么事情呢？作为程序员，这里提供一个「有趣的」方式，可以使用你的微信来监控你的模型在训练期间的一举一动，具体做法参考我的另一篇文章 [Use WeChat to Monitor Your Network](/tech/use-wechat-to-monitor-your-network/)
