---
title: "Programming Collective Intelligence - Chapter 3"
date: 2016-03-19
category: "AI"
tags: ["Machine Learning", "Python"]
description: "本文是关于「Programming Collective Intelligence」这本书的 Chapter 3的学习笔记。"
draft: false
---

![](https://farm5.staticflickr.com/4306/36216231065_8a7e508f9e_o.jpg)

> **本系列文章：** [Chapter 1 & 2](/tech/programming-collective-intelligence---chapter-1--2/) · [Chapter 3](/tech/programming-collective-intelligence---chapter-3/)


## 皮尔逊相关系数：

定义：两个变量之间的皮尔逊相关系数定义为**（两个变量之间的协方差）**和**（两个变量标准差的积）**的商。
$$
\rho_{x,y} = \frac{cov(X,Y)}{\sigma_{X}\sigma_{Y}}=\frac{E[(X-E(X))\cdot (Y-E(Y))]}{\sigma_{X}\sigma_{Y}}=\frac{E(XY)-E(X)E(Y)}{\sigma_{X}\sigma_{Y}}
$$
公式进一步推导：
$$
\rho_{x,y} = \frac{\sum XY - \frac{\sum X \sum Y}{N}}{\sqrt{(\sum X-\frac{(\sum X)^2}{N})(\sum Y-\frac{(\sum Y)^2}{N})}}
$$

```python
from math import *

def pearson(v1, v2):
    sum1 = sum(v1)
    sum2 = sum(v2)

    # 求平方和
    sum1_Sq = sum([pow(v, 2) for v in v1])
    sum2_Sq = sum([pow(v, 2) for v in v2])

    # 求乘积之和
    pSum = sum([v1[i]*v2[i] for i in range(len(v1))])

    num = pSum-(sum1*sum2/len(v1))
    den = sqrt((sum1_Sq-pow(sum1, 2)/len(v1))*(sum2_Sq-pow(sum2, 2)/len(v2)))

    if den == 0:
        return 0
    return 1.0 - num/den
```
* 皮尔逊相关度的计算结果在两者完全匹配的情况下为1.0，而在两者毫无关系的情况下则为0.0。此段代码的最后一行，返回的是以1.0减去皮尔逊相关度之后的结果，这样的目的是为了让相似度越大的两个元素之间的距离变得更小（做了一个小处理）。

----

## 分级聚类：

分级聚类通过连续不断地将最为相似的群组两两合并，来构造出一个群组的层级结构。其中的每个群组都是从单一元素开始的。在每次迭代的过程，分级聚类算法会计算每两个群组间的距离，并将距离最近的两个群组合并成一个新的群组。这一过程会一直重复下去，直到只剩一个群组为止。
![](https://farm1.staticflickr.com/591/30827330683_718ddf881c_o.png)

直接使用**blogdata.txt**博客数据集，不要用书上前面的代码来下载一系列博客的订阅源，从而构造这样一个数据集，因为书上的代码无法使用，一些库的模块功能已经过时，运行会出错。

```python
def readfile(filename):
    lines = [line for line in file(filename)]

    colnames = lines[0].strip().split('\t')[1:]

    rownames = []
    data = []
    for line in lines[1:]:
        p = line.strip().split('\t')
        rownames.append(p[0])
        data.append([float(x) for x in p[1:]])

    return colnames, rownames, data
```

* colnames = ['china', 'kids', ..., 'book'] 为所有博客中出现的单词的单词表。
* rownames = ['$blog_1$', '$blog_2$', ..., '$blog_n$'] 为所有博客的名字表。
* data = [[0,0, 1.0, 3.0, ...],[2.0, 3.0, 0.0, ...], ...,[4.0, 5.0, 3.0, …]] 为各个博客在单词表中各个单词出现的次数的表。

很容易想到用树结构来表示聚类这样的结构关系。分级聚类算法中的每一个聚类，可以是树中的枝节点，也可以是与数据集中实际数据行相对应的叶节点。没一个聚类还包含了指示器位置的信息，这一信息可以是来自叶节点的行数据，也可以是来自枝节点的经合并后的数据。我们可以新建一个**`bicluster`**类，将所有这些属性存放其中，并以此来描述这棵层级树。

```python
class bicluster:
    def __init__(self, vec, left = None, right = None, distance = 0.0, id = None):
        self.left = left
        self.right = right
        self.vec = vec
        self.id = id
        self.distance = distance
```

分级聚类算法以一组对应于原始数据项的聚类开始。函数的主循环部分会尝试每一组可能的配对并计算它们的相关度，以此来找出最佳配对。最佳配对的两个聚类会被合并成一个新的聚类。新生成的聚类中所包含的数据，等于将两个旧聚类的数据求均值之后得到的结果。这一过程会一直重复下去，知道只剩下一个聚类为止。由于整个计算过程可能会非常耗时，我们需要将每个配对的相关度计算结果保存起来以便优化执行速度。

```python
def hcluster(rows, distance = pearson):
    distances = {}
    currentclustid = -1
    # 最开始的聚类就是数据集中的行
    clust = [bicluster(rows[i], id = i) for i in range(len(rows))]

    while len(clust) > 1:
        lowestpair = (0, 1)
        closest = distance(clust[0].vec, clust[1].vec)
        # 遍历每一个配对，寻找最小距离
        for i in range(len(clust)):
            for j in range(i+1, len(clust)):
                # 用distances来缓存距离的计算值
                if (clust[i].id, clust[j].id) not in distances:
                    distances[(clust[i].id, clust[j].id)] = distance(clust[i].vec, clust[j].vec)
                d = distances[(clust[i].id, clust[j].id)]
                if d < closest:
                    closest = d
                    lowestpair = (i, j)
        # 计算两个聚类的平均值
        mergevec = [(clust[lowestpair[0]].vec[i] + clust[lowestpair[1]].vec[i])/2.0
                    for i in range(len(clust[0].vec))]
        # 建立新的聚类，聚类后的新聚类的vec更新为两个原先聚类的均值
        newcluster = bicluster(mergevec, left = clust[lowestpair[0]],
                               right = clust[lowestpair[1]],
                               distance = closest, id = currentclustid)
        # 去除原先的两个初始聚类，将新聚类添加至clust，然后递归重复过程
        currentclustid -= 1
        del clust[lowestpair[1]]
        del clust[lowestpair[0]]
        clust.append(newcluster)

    return clust[0]
```
其中**`distance = pearson`**表示的是采用皮尔逊相关系数来度量变量之间的距离，也可以构造其他距离度量函数（比如曼哈顿距离或者欧式距离）。

接下来就是直观地展现最终的聚类结果，就是绘制树状图。

```python
from PIL import Image, ImageDraw

def getheight(clust):
    if clust.left == None and clust.right == None:  return 1
    return  getheight(clust.left) + getheight(clust.right)

def getdepth(clust):
    if clust.left == None and clust.right == None:  return 0
    return max(getdepth(clust.left), getdepth(clust.right)) + clust.distance

def drawdendrogram(clust, labels, jpeg = 'clusters.jpg'):
    h = getheight(clust)*20
    w = 1200
    depth = getdepth(clust)

    scaling = float(w - 150)/depth

    img = Image.new('RGB', (w, h), (255, 255, 255))
    draw = ImageDraw.Draw(img)

    draw.line((0, h/2, 10, h/2), fill = (255, 0, 0))

    drawnode(draw, clust, 10, (h/2), scaling, labels)
    img.save(jpeg, 'JPEG')

def drawnode(draw, clust, x, y, scaling, labels):
    if clust.id < 0:
        h1 = getheight(clust.left)*20
        h2 = getheight(clust.right)*20
        top = y - (h1 + h2)/2
        bottom = y + (h1 + h2)/2

        l1 = clust.distance * scaling

        draw.line((x, top + h1/2, x, bottom - h2/2), fill = (255, 0, 0))
        draw.line((x, top + h1/2, x + l1, top + h1/2), fill = (255, 0, 0))
        draw.line((x, bottom - h2/2, x + l1, bottom - h2/2), fill = (255, 0, 0))

        drawnode(draw, clust.left, x + l1, top + h1/2, scaling, labels)
        drawnode(draw, clust.right, x + l1, bottom - h2/2, scaling, labels)
    else:
        draw.text((x + 5, y - 7), labels[clust.id], (0, 0, 0))

```
输入以下命令，就可以看到最终的博客聚类情况的树状图：
```bash
>>> import clusters
>>> words, blognames, data = clusters.readfile('blogdata.txt')
>>> clust = clusters.hcluster(data)
>>> clusters.drawdendrogram(clust, blogname, jpeg = 'blogclust'.jpg)
```
----
## $K$-均值聚类：

分级聚类有个缺点就是，我们必须计算每两个配对项之间的关系，并且在合并项之后，这些关系还需要重新计算，所以在处理很大规模的数据集时，分级聚类算法的运行速度会非常缓慢。

而$K$-均值聚类，完全不同于分级聚类，因为我们会预先告诉算法希望生成的聚类数量，然后算法会根据数据的结构状况来确定聚类的大小。

$K$-均值聚类算法首先会随机确定$k$个中心位置（位于空间中代表聚类中心的点），然后将各个数据项分配给最临近的中心点。待分配完成之后，聚类中心就会移到分配给该聚类的所有节点的平均位置处，然后整个分配过程重新开始。这一过程会一直重复下去，直到分配过程不再产生变化为止。

![](https://farm1.staticflickr.com/380/31521742461_dcb281b151_o.png)

实现$K$-均值聚类算法的函数与分级聚类算法的一样，接受相同的数据行作为输入，此外它还接受一个调用者期望返回的聚类数（$k$）作为参数。

```python
def kcluster(rows, distance = pearson, k = 4):
    # 确定每个点的最小值和最大值
    ranges = [(min([row[i] for row in rows]), max([row[i] for row in rows]))
              for i in range(len(rows[0]))]
    
    # 随机创建k个中心点
    clusters = [[random.random()*(ranges[i][1] - ranges[i][0]) + ranges[i][0]
                 for i in range(len(rows[0]))] for j in range(k)]
    lastmatches = None

    for t in range(100):
        print('Iteration %d' % t)
        bestmatches = [[] for i in range(k)]

        # 在每一行中寻找距离最近的中心点
        for j in range(len(rows)):
            row = rows[j]
            bestmatch = 0
            for i in range(k):
                d = distance(clusters[i], row)
                if d < distance(clusters[bestmatch], row):
                    bestmatch = i
            bestmatches[bestmatch].append(j)

        # 如果结果与上一次相同，则整个过程结束
        if bestmatches == lastmatches:  break
        lastmatches = bestmatches
 
        # 把中心点移到其所有成员的平均位置处
        for i in range(k):
            avgs = [0.0]*len(rows[0])
            if len(bestmatches[i]) > 0:
                for rowid in bestmatches[i]:
                    for m in range(len(rows[rowid])):
                        avgs[m] += rows[rowid][m]
                for j in range(len(avgs)):
                    avgs[j] /= len(bestmatches[i])
                clusters[i] = avgs

    return bestmatches
```
上述代码在每个变量的值域范围内随机构造了一组聚类。当每次迭代进行的时候，算法会将每一行数据分配给某个中心点，然后再将中心点的数据更新为分配给它的所有项的平均位置。当分配情况与前一次相同的时候，迭代过程就结束了，同时算法会返回$k​$组序列，其中每个序列代表一个聚类。与分级聚类相比，该算法为产生最终结果所须迭代的次数是非常少的。

**由于函数选用随机的中心点作为开始，所以返回结果的顺序几乎总是不同的。根据中心点初始位置的不同，最终聚类中所包含的内容也可能会有所不同。**

我们可以针对博客数据集试验一下该函数。算法的执行速度应该会比分级聚类更快一些：
```python
>>> import clusters
>>> words, blognames, data = clusters.readfile('blogdata.txt')
>>> kclust = clusters.kcluster(data, k = 10)
>>> [blognames[r] for r in kclust[0]]
['Online Marketing Report', "Sifry's Alerts", 'Treehugger', 'Oilman']
>>> [blognames[r] for r in kclust[1]]
['Mashable!', 'Signum sine tinnitu--by Guy Kawasaki', 'TechCrunch']
>>> [blognames[r] for r in kclust[2]]
["The Superficial - Because You're Ugly", 'Wonkette', 'Eschaton', 'we make money not art', 'Joho the Blog', "Neil Gaiman's Journal", 'Signal vs. Noise', 'lifehack.org', 'Kotaku', 'Daily Kos', 'Deadspin', 'Go Fug Yourself', 'Gizmodo', 'Gothamist', 'The Viral Garden', 'SpikedHumor', 'flagrantdisregard', 'Techdirt', 'Schneier on Security', 'Scobleizer - Tech Geek Blogger', 'Little Green Footballs', "Dave Shea's mezzoblue", 'kottke.org', 'MetaFilter', 'ongoing', 'Instapundit.com', "Joi Ito's Web", 'Joel on Software', 'PerezHilton.com', 'Derek Powazek', "Jeremy Zawodny's blog", 'plasticbag.org', 'Gawker', 'WWdN: In Exile', "Seth's Blog", 'The Huffington Post | Raw Feed']
```
现在，**kclust** 中应该包含了一组代表聚类的ID序列。
**kclust** 应该是一个这样的东西：
$$
[[rowid_1,rowid_2,…,rowid_n ]_{(聚类_1)} ,[rowid_1,rowid_2,...,rowid_n ]_{(聚类_2)} ,...,[rowid_1,rowid_2,...,rowid_n]_{(聚类_k)}]
$$

$K$-均值聚类的最佳特质就是各簇在本质上呈紧致的球状分布，且总会收敛到某个解：
![](https://farm1.staticflickr.com/732/31600482456_67bececb29_o.png)

$K$-均值聚类中的距离度量方式除了上述的皮尔逊相关系数，针对具体任务（不同的数据集）可以采用不同的距离度量方式。**但是$K$-均值聚类算法的缺陷是各簇之间必须存在一个“硬”边界，这意味着每个数据点只能属于一个簇，无法跨越两个簇之间的界限。此外，$K$-均值聚类算法适合于呈球状分布的数据，因为大多数情况下人们采用的都是欧式距离。在像上述图中这样的数据分布（位于中间的那些点实际上可以属于两个簇的任意一个），这些缺陷非常明显。**

----
## 针对偏好的聚类：

直接使用**zebo.txt**数据集，虽然书上的网站无法访问导致我们无法构建数据集。但是其中使用 `BeautifulSoup` 这一函数库，以及其中对于网页内容的处理，我们可以学习一下代码。
```python
from BeautifulSoup import BeautifulSoup
import urllib2
import re

def fuck():
    chare = re.compile(r'[!-\.&]')
    itemowners = {}

    # 想要去除的单词
    dropwords = ['a', 'new', 'some', 'more', 'my', 'own', 'the', 'many', 'other', 'another']

    currentuser = 0
    for i in range(1, 51):
        # 搜索想要的对应URL
        c = urllib2.urlopen(
            'http://member.zebo.com/Main?event_key=USERSEARCH&wiowiw=wiw&keyword=car&page=%d'
            % (i))
        soup = BeautifulSoup(c.read())
        for td in soup('td'):
            # 寻找带有bgverdanasmall类的表格单元格
            if ('class' in dict(td.attrs) and td['class'] == 'bgverdanasmall'):
                items = [re.sub(chare, '', str(a.contents[0]).lower()).strip() for a in td('a')]
                for item in items:
                    # 去除多余的单词
                    txt = ' '.join([t for t in item.split(' ') if t not in dropwords])
                    if len(txt) < 2: continue
                    itemowners.setdefault(txt, {})
                    itemowners[txt][currentuser] = 1
                currentuser += 1

    out = file('zebo.txt', 'w')
    out.write('Item')
    for user in range(0, currentuser): out.write('\tU%d' % user)
    out.write('\n')
    for item, owners in itemowners.items():
        # 寻找超过10个人都希望拥有的物品
        if len(owners) > 10:
            out.write(item)
            for user in range(0, currentuser):
                if user in owners:
                    out.write('\t1')
                else:
                    out.write('\t0')
            out.write('\n')
            
fuck()

```
* 其中**`range(1, 51)`**表示我们会处理其中的前五十个页面，当然我们也可以自定义。
* 由于所有的物品的文字都是随意输入的，所以需要进行大量的处理工作，其中包括去除像**dropwords**中“a”、“some”、“new”等这样的单词，去除**chare**标点符号，以及将所有文本转换成小写。

在**zebo.txt**文件当中，如果一个人希望拥有某件物品，那么我们将其标记为1，否则就标记为0。皮尔逊相关度很适合于博客数据集，改数据集中所包含的是单词的实际统计值。而在此处，数据集只有1和0两种取值，分别代表着有或无。并且，假如我们对同时希望拥有两件物品的人在物品方面互有重叠的情况进行度量，那或许是一件更有意义上的事情。

为此，我们采用一种被称为**Tanimoto系数**的度量方法，它代表的是交集（只包含那些在两个集合中都出现的项）与并集（包含所有出现于任一集合中的项）的比率。

```python
def tanimoto(v1, v2):
    c1, c2, shr = 0, 0, 0

    for i in range(len(v1)):
        if v1[i] != 0:  c1 += 1
        if v2[i] != 0:  c2 += 1
        if v1[i] != 0 and v2[i] != 0:   shr += 1

    return 1.0 - (float(shr)/(c1 + c2 - shr))
```
上述代码将返回一个介于1.0和0.0之间的值。其中1.0代表不存在同时喜欢两件物品的人，而0.0则代表所有人都同时喜欢两个向量中的物品。

因为数据的格式与先前所用的相同，所以我们可以利用同样的函数来生成和绘制分级聚类。利用上面的函数并相应传入两个向量，我们很容易就可以实现聚类的功能。
```bash
>>> import clusters
>>> users, items, data = clusters.readfile('zebo.txt')
>>> clust = clusters.hcluster(data)
>>> clust = clusters.hcluster(data, distance = clusters.tanimoto)
>>> clusters.drawdendrogram(clust, items, jpeg = 'itemsclusters.jpg')
```
-----
## 多维缩放：

由于在大多数真是生活的例子中，我们所要聚类的内容都不只包含两个数值，所以我们不可能按照前面的方法来采集数据并以二维的形式将其绘制出来。但是为了要弄明白物品之间的关系，将它们绘制在一个二维的平面上，两两之间的距离远近表达的是两者之间的相似程度。而**多维缩放**目的就是根据每对数据项之间的相似情况，将其表现在一个二维平面上。

```python
def scaledown(data, distance = pearson, rate = 0.01) :
    n = len(data)

    # 每一对数据项之间的真实距离
    realdist = [[distance(data[i], data[j]) for j in range(n)]
                 for i in range(0, n)]

    # 随机初始化节点在二维空间中的初始位置
    loc = [[random.random(), random.random()] for i in range(n)]
    fakedist = [[0.0 for j in range(n)] for i in range(n)]

    lasterror = None
    for m in range(0, 1000) :
        # 寻找投影后的距离
        for i in range(n):
            for j in range(n):
                fakedist[i][j] = sqrt(sum([pow(loc[i][x] - loc[j][x], 2)
                                                for x in range(len(loc[i]))]))

        # 移动节点
        grad = [[0.0, 0.0] for i in range(n)]

        totalerror = 0
        for k in range(n):
            for j in range(n):
                if j == k: continue
                # 误差值等于目标距离与当前距离之间差值的百分比
                errorterm = (fakedist[j][k] - realdist[j][k]) / realdist[j][k]

                # 每个节点都需要根据误差的多少，按照比例移离或者移向其他节点
                # point in proportion to how much error it has
                grad[k][0] += ((loc[k][0] - loc[j][0]) / fakedist[j][k]) * errorterm
                grad[k][1] += ((loc[k][1] - loc[j][1]) / fakedist[j][k]) * errorterm

                # 记录总的误差值
                totalerror += abs(errorterm)
        print totalerror

        # 如果节点移动之后的情况变得更糟，则break程序结束
        if lasterror and lasterror < totalerror: break
        lasterror = totalerror

        # 根据rate参数与grad值相乘的结果，移动每一个节点
        for k in range(n):
            loc[k][0] -= rate * grad[k][0]
            loc[k][1] -= rate * grad[k][1]

    return loc
```
根据**`scaledown()`**函数得到的**`loc`**，我们可以利用PIL在生成一张二维图，根据新的坐标值**`loc`**，在图上标出所有数据项的位置以及对应的标签。
```python
def draw2d(data, labels, jpeg='mds2d.jpg'):
    img = Image.new('RGB', (2000, 2000), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    for i in range(len(data)):
        x = (data[i][0] + 0.5)*1000
        y = (data[i][1] + 0.5)*1000
        draw.text((x, y), labels[i], (0, 0, 0))
    img.save(jpeg, 'JPEG')
```

在命令行中输入：
```bash
>>> import clusters
>>> words, blognames, data = clusters.readfile('blogname.txt')
>>> coords = clusters.scaledown(data)
>>> clusters.draw2d(coords, blognames, jpeg = 'blogs2d.jpg')
```
得到的**blog2d.jpg**反映就是博客数据集中blog之间的相似关系，当然我们也可以通过**`rotatematrix()`**函数来转置矩阵**`data`**，得到**`rdata`**，再根据**`rdata`**画出单词表中的单词的相似度（误差有点大）：
```bash
>>> import clusters
>>> words, blognames, data = clusters.readfile('blogname.txt')
>>> rdata = clusters.rotatematrix(data)
>>> coords = clusters.scaledown(rdata)
>>> clusters.draw2d(coords, words, jpeg = 'words2d.jpg')
```
即得到单词之间的相似关系**words2d.jpg**。

同样，我们可以将其用于我们的欲望物品数据集，距离度量使用**tanimoto系数**，但是要修改**`tanimoto()`**与**`scaledown()`**几处代码，即需要判断分母为0的时候的返回值。修改完之后，调用**`scaledown()`**与**`draw2d()`**，画出欲望物品之间的相似关系图**items2d.jpg**。（同样也可以通过转置**`data`**矩阵，画出用户之间的相似关系图**users2d.jpg**）
```bash
>>> import clusters
>>> users, items, data = clusters.readfile('zebo.txt')
>>> coords = clusters.scaledown(rdata, distance = tanimoto)
>>> clusters.draw2d(coords, items, jpeg = 'items2d.jpg')
```
当然，我们还可以根据需要修改**`rate`**等诸多参数的值来调整算法，在此不再赘述。

----
## EM聚类：

EM聚类算法的重点不是像K-均值聚类那样找到一个质心，然后找到与其相关的数据点，而是求解另一个不同的问题。比如我们希望一个数据集分为两部分：簇1与簇2。**EM聚类算法的目的是，我们希望得到一个关于数据是否存在某个簇中的良好估计，但并不用关心其中是否存在模糊性。我们真正希望获得的是一个数据点属于各簇的概率值，而非分配结果。**

与专注于确定各簇之间边界的$K$-均值聚类算法不同，EM聚类对于可能同属于多个簇的数据点具有一定的稳健性。EM聚类算法非常适用于对不存在明确边界的数据进行分类。


---
# Correct errors in printing:

- P46

> ...代码首先会构造一个列表，其中包含的是超过5个人都希望拥有的物品....

需要更正为：

> ...代码首先会构造一个列表，其中包含的是超过10个人都希望拥有的物品....

---
# Practice:
- **暂无**

---
