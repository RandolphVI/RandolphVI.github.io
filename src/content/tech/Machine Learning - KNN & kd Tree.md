---
title: "Machine Learning -  KNN & kd Tree"
date: 2017-01-14
category: "AI"
tags: ["Machine Learning", "Books"]
description: "本文是关于周志华「Machine Learning」这本书的 Classification - KNN & kd Tree 的学习笔记。"
draft: false
---

![](https://farm5.staticflickr.com/4307/36174772306_62cfbc8cd6_o.jpg)

> **本系列文章：** [Chapter 1](/tech/machine-learning---chapter-1/) · [Chapter 2](/tech/machine-learning---chapter-2/) · [Clustering](/tech/clustering/) · [KNN & kd Tree](/tech/machine-learning---knn--kd-tree/)



# kNN

$k$-邻近算法(kNN)，是一种基本<strong>分类与回归</strong>方法。

此篇主要讲$k$-邻近算法在分类问题中的应用。

它的工作原理是： 存在一个样本数据合集$S$，也称作训练样本集，并且样本集中每个数据都存在标签，即我们知道样本集中每一数据与所属分的对应关系。输入没有标签的新数据后，将新数据的每个特征与样本集中数据对应的特征进行比较（<strong>距离度量</strong>），然后算法提取样本集中$k$个特征最相似数据（最近邻）的分类标签（<strong>$k$值的选择</strong>）。最后，选择$k$个最相似数据中出现次数最多的分类（<strong>分类决策规则</strong>），作为新数据的分类。

$k$-邻近模型由三个基本要素---距离度量、$k$值的选择和分类决策规定决定。

# 距离度量    

一般使用的是欧氏距离，我们也可以根据自己的需求选择其他距离，比如更一般的$L_p$距离，也称为<strong>Minkowski距离</strong>。

这里$L_p$距离中，$p \geq 1$，当$p=1$时，称为曼哈顿距离；当$p=2$时，称为欧式距离；当$p=\infty$时，它是各个坐标距离的最大值，即切比雪夫距离。

设特征空间$X$是$n$维实数向量空间$R^n$，$x_i$，$x_j$ $\in$ $X$，$x_i = (x_i^{(1)}，x_i^{(2)}，...，x_i^{(n)})^T$，$x_j = (x_j^{(1)}，x_j^{(2)}，...，x_j^{(n)})^T$，$x_i$，$x_j$的$L_p$距离（Minkowski距离）定义为：

$$
L_p(x_i, x_j) = (\sum{l=1}^{n} \left | x{i}^{(l)}-x_{j}^{(l)} \right | ^p)^{1 \over p}
$$

![](https://farm1.staticflickr.com/417/31490650822_a861eca015_o.png)

但是，Minkowski类型的距离函数存在的一个问题是，它们假定数据分布本质上应当具有对称性，即距离在所有方向上都是相同的。然而很多时候，数据并不符合球状分布，因此不宜采用像Minkowski距离这样的对称距离。例如：

![](https://farm1.staticflickr.com/395/31490660172_23aaf2b39a_o.png)

对于这种情况，像图那样所示那样围绕数据画出一个标准圆是不可取的，我们应当对数据分布呈椭圆形这个特点予以考虑：

![](https://farm1.staticflickr.com/289/31521619731_530a2ab0bd_o.png)

因此，我们需要选择一个能够更好地体现数据分布特点的距离度量方法---即Mahalanobis距离。Mahalanobis距离函数会考虑数据在每个维度上的波动性，因此对于数据的每个维度，都存在一个$s_i$，表示该数据集在此维度上的标准差的变量。Mahalanobis距离的计算公式如下：

$$
d(x,y) =\sqrt{\sum_{i=1}^{n}\frac{(x_{i} - y_{i})^2}{s_{i}^2}}
$$

可以看出，该公式与欧式距离非常类似，但是不同的是它考虑到各种特性之间的联系（例如，一条关于身高的信息会带来一条关于体重的信息，因为两者是有关联的，并且是尺度无关的），即独立于测量尺度。

欧式距离就好比一个参照值，它表征的是当所有<strong>类别等概率</strong>出现的情况下，类别之间的距离。此时决策面中心点的位置就是两个类别中心的连线的中点。如下所示：

![](https://farm1.staticflickr.com/458/30795845494_a42900cc19_o.png)

而当<strong>类别先验概率并不相等</strong>时，显然，如果仍然用中垂线作为决策线是不合理的，将出现判别错误（绿色类的点被判别为红色类），假设上图中绿色类别的先验概率变大，那么决策线将左移，如下图黄线。左移的具体位置，就是通过马氏距离来获得的。马氏距离中引入的协方差参数，表征的是点的稀密程度。

![](https://farm1.staticflickr.com/458/30795845494_a42900cc19_o.png)

**从哲学上来说，用马氏距离处理数据时，不再把数据单纯的看作是冷冰冰的数字——那个引入的协方差，承认了客观上的差异性，就好像是有了人类的感情倾向，使得模式识别更加“人性化”也更加“视觉直观”。**

Mahalanobis距离是基于样本分布的一种距离。<strong>物理意义就是在规范化的主成分空间中的欧氏距离。</strong>所谓规范化的主成分空间就是利用主成分分析对一些数据进行主成分分解。再对所有主成分分解轴做归一化，形成新的坐标轴。由这些坐标轴张成的空间就是规范化的主成分空间。

换句话说，主成分分析就是把椭球分布的样本改变到另一个空间里，使其成为球状分布。而Mahalanobis距离就是在样本呈球状分布的空间里面所求得的欧式距离。

当然，上面的解释只是对椭球分布而言，<strong>对一般分布，只能消除分布的二阶相关性，而不能消除高阶相关性</strong>。

----
# $k$值的选择       
-  如果选择$k$比较小，Bias会比较低，但是Variance会比较高，$k$的减小就意味着整体模型变得复杂，容易发生过拟合overfitting。
-  如果选择$k$比较大，Variance会比较低，但是Bias会比较高，$k$的增大就意味着整体模型变得简单，容易发生欠拟合underfitting。
   -   通常来说$k$是一个不大于20的整数。
   -   为了确定$k$值，主要有三种方案可供选择：
       1.  **猜测**
       2.  **使用启发式策略**
           - 当分类问题中只涉及两个类别时，不要将$k$值取为偶数。
               - 使$k$与类别总数互质。将$k$取为与类别总数互质的数，可保证投票数并列的情况较少出现。
           - $k$的值应不小于类别总数加一。（使得所有的类别均有被表示的机会）
           - 为避免出现噪音，$k$的值应足够小。
       3.  **通过算法优化**
           - 使用<strong>遗传算法</strong>或者<strong>暴力网络搜索算法</strong>。
           - 基于一个任意的$k$试图将误差最小化称为爬山问题（Hill Climbing Problem）。其主要思想是对一组可能的$k$值轮流进行考察，直至找到一个可接受的误差。利用遗传算法或者暴力网络搜索这样的算法来寻求$k$的最优值的难点在于，当$k$增大时，分类的复杂性也相应增加，从而降低性能。换言之，当增加$k$时，程序的速度会逐渐变慢。
           > If you want to learn more about genetic algorithms applied to find‐ ing an optimal K, you can read more about it in **Florian Nigsch et al.’s Journal of Chemical Information and Modeling article, “Melting Point Prediction Employing k-Nearest Neighbor Algorithms and Genetic Parameter Optimization”**.

----

# 分类决策规则
$k$-邻近法中的分类决策规则往往是“投票法”（多数表决），即由输入实例的$k$个邻近的训练实例中的多数类决定输入实例的类。

因为算法思想简单，我们可以用很多方法实现它，这时效率就是我们需要慎重考虑的事情，最简单的自然是求出测试样本和训练集所有点的距离然后排序选择前$k$个，这个是$O(n(\log n))$的，而其实从$N$个数据找前$k$个数据是一个很常见的算法题，可以用最大堆（最小堆）实现，其效率是$O(n(\log k))$的，而最广泛的算法是使用$kd$树来减少扫描的点。

目前常用的解决方法是事先对已知样本点进行剪辑，事先去除对分类作用不大的样本。该算法比较适用于样本容量比较大的类域的自动分类，而那些样本容量较小的类域采用这种算法比较容易产生误分。

<strong>KNN算法不仅可以用于分类，还可以用于回归。</strong>通过找出一个样本的$k$个最近邻居，将这些邻居的属性的平均值赋给该样本，就可以得到该样本的属性。更有用的方法是将不同距离的邻居对该样本产生的影响给予不同的权值（weight），如权值与距离成正比。

可以通过数学证明<strong>当数据规模趋于无穷时，最近邻分类器（$k=1$）的泛化错误率不超过贝叶斯最优分类器的错误率的两倍。</strong>

> For every point in our dataset:    
> 1. calculate the distance between inX and the current point.
> 2. sort the distances in increasing order.
> 3. take k items with lowest distances to inX.
> 4. find the majority class among these items.
> 5. return the majority class as our prediction for the class of inX.

对于未知类别属性的数据集中的每一个点一次执行以下操作：
1. 计算已知类别数据集中的点与当前点之间的距离。
2. 按照距离递增次序排序。
3. 选取与当前距离最小的$k$个点。
4. 确定前$k$个点所在类别的出现频率。
5. 返回前$k$个点出现频率最高的类别作为当前点的预测分类。

----
# kNN算法（线性扫描实现方法）

核心代码：

```python
def classify0(inX, dataSet, labels, k):
    dataSetSize = dataSet.shape[0]
    diffMat = tile(inX, (dataSetSize, 1)) - dataSet
    sqDiffMat = diffMat ** 2
    sqDistances = sqDiffMat.sum(axis = 1)
    distances = sqDistances ** 0.5
    sortedDistIndicies = distances.argsort()
    classCount = {}
    for i in range(k):
        voteIlabel = labels[sortedDistIndicies[i]]
        classCount[voteIlabel] = classCount.get(voteIlabel,0) + 1
    sortedClassCount = sorted(classCount.items(),key = operator.itemgetter(1),reverse = True)
    return sortedClassCount[0][0]
```

分析一下代码：

<strong>`tile()`</strong>是Numpy中的一个module。它的用法是：

```
>>> a = np.array([0, 1, 2])
>>> np.tile(a, 2)
array([0, 1, 2, 0, 1, 2])
>>> np.tile(a, (2, 2))
array([[0, 1, 2, 0, 1, 2],
       [0, 1, 2, 0, 1, 2]])
>>> np.tile(a, (2, 1, 2))
array([[[0, 1, 2, 0, 1, 2]],
       [[0, 1, 2, 0, 1, 2]]])
```

```
>>> b = np.array([[1, 2], [3, 4]])
>>> np.tile(b, 2)
array([[1, 2, 1, 2],
       [3, 4, 3, 4]])
>>> np.tile(b, (2, 1))
array([[1, 2],
       [3, 4],
       [1, 2],
       [3, 4]])
```

```
>>> c = np.array([1,2,3,4])
>>> np.tile(c,(4,1))
array([[1, 2, 3, 4],
       [1, 2, 3, 4],
       [1, 2, 3, 4],
       [1, 2, 3, 4]])
```

总结一下：<strong>`tile(A, reps)`</strong>就是将数组A重复reps次。

- A的类型可以是<strong>`array, list, tuple, dict, matrix`</strong>以及<strong>`int, string, float, bool`</strong>。
- reps的类型可以是<strong>`tuple, list, dict, int, bool`</strong>但不可以是<strong>`float, string, matrix`</strong>。

```python
diffMat = tile(inX, (dataSetSize, 1)) - dataSet
```

<strong>`inX`</strong>是我们的未知类别集中的一个点的输入向量（形式为$$[x_i,y_i]$$），也就是我们需要进行分类的一个点。
<strong>`dataSetSize`</strong>是我们已知类别数据集的大小。

这句代码的目的便是生成一个这样的矩阵<strong>`matrix`</strong>:

$$
[[\Delta x_1, \Delta y_1],[\Delta x_2, \Delta y_2],[\Delta x_3, \Delta y_3],...,[\Delta x_{datasize}, \Delta y_{datasize}]]
$$

很明显，矩阵中存储的就是，未知点与已知类别数据集中的所有点的 $x$ 与 $y$ 坐标差值。

----

```python
sqDistances = sqDiffMat.sum(axis = 1)
```

这句代码就是进一步生成的这样的矩阵，用作下一步计算点与点之间距离用：

$$
[[\Delta x_1^2 + \Delta y_1^2],[\Delta x_2^2 + \Delta y_2^2],[\Delta x_3^2 + \Delta y_3^2],...,[\Delta x_{datasize}^2 + \Delta y_{datasize}^2]]
$$

----

```python
sortedDistIndicies = distances.argsort()
```

这句代码的意思便是返回一组索引值，这个索引值分别对应原数组中的点，但是是根据离未知点从最近到最远来排序，只用使用这个索引值就可以找到对应的已知类别数据中的一个点，从而得到该点标签。

举个例子：

```
>>> a = array([1, 9, 7, 8, 10, 2, 0, 3])
>>> a
array([ 1,  9,  7,  8, 10,  2,  0,  3])
>>> b = a.argsort()
>>> b
array([6, 0, 5, 7, 2, 3, 1, 4])
```

此时我们已经使用$k$-邻近算法构造了一个分类器，这个分类器可以处理二分类别任务，也可以处理多类别任务（labels添加多个标签）。对于分类任务而言，评估分类器好坏的标准，最常用的便是错误率与精度，当然还有其他的评判标准，这里就不展开赘述。接下来在现实具体任务中来使用我们的$k$-邻近算法分类器。

-----
## Improving matches from a dating site with kNN

约会数据datingTestSet.txt中包括3种<strong>`feature`</strong>与1个<strong>`label`</strong>:

(每年获得的飞行常客里程数，玩视频游戏所耗时间百分比，每周消费的冰淇淋公升数，是否喜欢)
```text
40920	8.326976	0.953952	largeDoses
14488	7.153469	1.673904	smallDoses
26052	1.441871	0.805124	didntLike
75136	13.147394	0.428964	didntLike
38344	1.669788	0.134296	didntLike
72993	10.141740	1.032955	didntLike
35948	6.830792	1.213192	largeDoses
42666	13.276369	0.543880	largeDoses
67497	8.631577	0.749278	didntLike
35483	12.273169	1.508053	largeDoses
....
```

为了使得这些约会数据能够变成参数，输入分类器中进行处理，我们需要将文件中的数据转换成分类器所需要的<strong>`matrix`</strong>矩阵样式。

```python
def file2matrix(filename):
    fr = open(filename)
    arrayOLines = fr.readlines()
    numberOfLines = len(arrayOLines)
    returnMat = zeros((numberOfLines,3))
    classLabelVector = []
    index = 0
    for line in arrayOLines:
        line = line.strip()
        listFromLine = line.split('\t')
        returnMat[index,:] = listFromLine[0:3]
        classLabelVector.append(listFromLine[-1])
        index += 1
    return returnMat,classLabelVector
```

具体做法为：

1. 打开约会文件，得到文件的行数，即一共多少条数据。
2. 创建一个大小合适的矩阵，并以零填充，这里简化设置矩阵的维度为3，我们也可以按照自己的实际需求增加相应代码来适应变化的维度输入值。(这里维度为3的时候，<strong>`returnMat=[[0,0,0],[0,0,0],...,[0,0,0]]`</strong>)
3. 循环处理每一条数据，<strong>`line.strip()`</strong>截取掉所有的回车字符，然后使用tab字符\t将上一步得到的整行数据分割成一个元素列表，存储到特征矩阵<strong>`returnMat`</strong>中。
4. 原约会文件的每条数据的最后一项（是否喜欢），单独存储到标签向量<strong>`classLabelVector`</strong>，作为类别。
5. 返回得到特征矩阵<strong>`returnMat`</strong>与标签向量<strong>`classLabelVector`</strong>。

可以试着使用一下这个函数，检查一下数据内容：

```
>>> datingDataMat,datingLabels = kNN.file2matrix('datingTestSet.txt')
>>> datingDataMat
array([[  7.29170000e+04,   7.10627300e+00,   2.23600000e-01],
       [  1.42830000e+04,   2.44186700e+00,   1.90838000e-01],
       [  7.34750000e+04,   8.31018900e+00,   8.52795000e-01],
       ...,
       [  1.24290000e+04,   4.43233100e+00,   9.24649000e-01],
       [  2.52880000e+04,   1.31899030e+01,   1.05013800e+00],
       [  4.91800000e+03,   3.01112400e+00,   1.90663000e-01]])
>>> datingLabels[0:20]
['didntLike', 'smallDoses', 'didntLike', 'largeDoses', 'smallDoses',
'smallDoses', 'didntLike', 'smallDoses', 'didntLike', 'didntLike', 'largeDoses', 'largeDose s', 'largeDoses', 'didntLike', 'didntLike', 'smallDoses', 'smallDoses', 'didntLike', 'smallDoses', 'didntLike']

```

<strong>`datingDataMat`</strong>特征矩阵中飞行常客里程数远远大于其他特征值，但是我们认为三种特征是同等重要的，这种不同取值范围的特征值时，我们通常采用的方法将数值归一化，如将取值范围处理为0到1或者-1到1之间。

```python
def autoNorm(dataSet):
    minVals = dataSet.min(0)
    maxVals = dataSet.max(0)
    ranges = maxVals - minVals
    normDataSet = zeros(shape(dataSet))
    m = dataSet.shape[0]
    normDataSet = dataSet - tile(minVals, (m, 1))
    normDataSet = normDataSet/tile(ranges, (m, 1))
    return normDataSet, ranges, minVals
```

这里需要说明的一点是，我们将每列的最小值放在变量<strong>`minVals`</strong>中，将最大值放在<strong>`maxVals`</strong>中，其中<strong>`dataSet.min(0)`</strong>中的参数0使得函数可以从列中选取最小值，而不是选取当前行中的最小值。

- **`numpy.chararray.min`**

> **`chararray.min(axis=None, out=None, keepdims=False)`**

> （Return the minimum along a given axis.）

>  **axis = 1对行进行操作； axis = 0对列进行操作；**

虽然改变数值取值范围增加了分类器的复杂度，但可以得到更为准确的结果。

接着我们需要做的：

```python
def datingClassTest():
    hoRatio = 0.10
    datingDataMat, datingLabels = file2matrix('datingTestSet2.txt')
    normMat, ranges, minVals = autoNorm(datingDataMat)
    m = normMat.shape[0]
    numTestVecs = int(m*hoRatio)
    errorCount = 0.0
    for i in range(numTestVecs):
        classifierResult = classify0(normMat[i, :], normMat[numTestVecs:m, :], datingLabels[numTestVecs:m], 3)
        print("the classifier came back with: %d,the real answer is :%d"%(classifierResult, datingLabels[i]))
        if(classifierResult != datingLabels[i]):errorCount += 1.0
    print("the total error rate is :%f" %(errorCount/float(numTestVecs)))
```

其中<strong>`numTestVecs`</strong>是用于测试的数据集向量，我们可以改变<strong>`datingClassTest`</strong>内变量<strong>`hoRatio`</strong>和变量k的值，检测错误率是否随着变量值的变化而增加，也就是调参。

----
## A handwriting recognition system

手写识别系统

```python
def img2vector(filename):
    returnVect = zeros((1, 1024))
    fr = open(filename)
    for i in range(32):
        lineStr = fr.readline()
        for j in range(32):
            returnVect[0, 32*i+j] = int(lineStr[j])
    return returnVect
```
该函数创建$1 \times 1024$的NumPy数组，然后打开给定的文件，循环独读出文件的前32行，并将每行的头32个字符值存储在NumPy数组中，最后返回数组。（$32 \times 32=1024$）

```python
from os import listdir
def handwritingClassTest():
    hwLabels = []
    trainingFileList = listdir('trainingDigits')
    m = len(trainingFileList)
    trainingMat = zeros((m, 1024))
    for i in range(m):
        fileNameStr = trainingFileList[i]
        fileStr = fileNameStr.split('.')[0]
        classNumStr = int(fileStr.split('_')[0])
        hwLabels.append(classNumStr)
        trainingMat[i, :] = img2vector('trainingDigits/%s' %fileNameStr)

    testFileList = listdir('testDigits')
    errorCount = 0.0
    mTest = len(testFileList)
    for i in range(mTest):
        fileNameStr = testFileList[i]
        fileStr = fileNameStr.split('.')[0]
        classNumStr = int(fileStr.split('_')[0])
        vectorUnderTest = img2vector('testDigits/%s' %fileNameStr)
        classifierResult = classify0(vectorUnderTest, trainingMat, hwLabels, 3)
        print("the classifier came back with: %d, the real answer is: %d" %(classifierResult, classNumStr))
        if(classifierResult != classNumStr):errorCount += 1.0
    print("\n the total number of errors is: %d" %errorCount)
    print("\n the total error rate is: %f" % (errorCount/float(mTest)))
```
步骤是：

1. 将trainingDigits目录中的文件内容存储在列表中<strong>`trainingFileList`</strong>，然后可以得到目录中有多少文件，并将其存储在变量<strong>`m`</strong>中。 
2. 接着，创建一个m行$1024$（$32 \times 32$）列的训练矩阵，该矩阵的每行数据都存储一个图像信息<strong>`trainingMat`</strong>（用到前面定义到的<strong>`img2vector()`</strong>函数）。
3. 从文件名中解析出分类数字，将所有图像类别信息存储在<strong>`hwLabels`</strong>向量中。（例如0_0.txt的类别就是‘0’）
4. 对剩下的testDigits目录中的测试数据进行上述1，2，3操作，但是不同的是，我们并不将测试数据的图像信息载入到新的矩阵当中，而是使用前面定义的<strong>`classify0()`</strong>函数测试该目录下的每个数据文件。

说明：由于简化了图像信息，图像信息均是以0和1进行表示，所以不需要使用<strong>`autoNorm()`</strong>函数对数据进行规范化处理了。


# kNN算法（$kd$ 树实现方法）

（Unfinished.）

# 维度灾难
在高维情形下出现的<strong>数据样本稀疏</strong>、<strong>距离计算困难</strong>等问题，是所有机器学习方法共同面临的严重障碍，被称为“**维度灾难**”（curse of dimensionality）。

自然会想到的一个解决办法便是<strong>降维</strong>（dimension reduction）。这是基于这样的一个事实：在很多时候，人们观测或收集到的数据样本虽然是高维的，但与学习任务密切相关的也许仅是某个低维分布，即高维空间中的一个低维“嵌入”（embedding）。

- 若要求原始空间中样本之间的距离在低维空间中得以保持，我们可以采取“多维缩放”（Multiple Dimensional Scaling, MDS）这样一种经典的降维方法。

那么假如我现在要用kNN邻近算法来实现分类问题，我会考虑：

1. 在训练数据集$D$中寻找$k$个最相似的点的扫描方法的优化，相比线性，<strong>kd树</strong>（利用最大/小堆）是一个更好的选择，这对模型的最终结果无关，但是可以优化程序整体的性能。（试想，我们还可以进一步优化么？）
2. $k$的取值，也是至关决定性的，但一般不考虑超过20的整数，可以进行调参，根据结果选定对于当前问题最优的$k$值。
3. 被测点$x$与测试数据集$D$中的点的距离度量，一般采用欧式距离，标准化欧氏距离会更好么？另外，其他的距离度量方法呢？
4. 选出来的$k$个邻居与被测点$x$的距离不同，应当权重也不同，即在分类决策规则中加入“权重”，对可能出现的不同类别，进行权重乘以距离累加，计算各类别得分，比较得分选择最终所属类别。
5. 训练集与测试集的划分，应该会采用<strong>交叉验证法</strong>。
