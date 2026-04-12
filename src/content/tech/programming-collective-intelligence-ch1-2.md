---
title: "Programming Collective Intelligence — Chapter 1 & 2"
date: 2016-03-12
category: "AI"
tags: ["Machine Learning", "Python"]
description: "- 欧几里得距离评价"
draft: false
---

![](https://farm5.staticflickr.com/4306/36216231065_8a7e508f9e_o.jpg)

有关该书的其他学习笔记系列：[Book:「Programming Collective Intelligence」](http://randolph.pro/categories/Books/Book-「Programming-Collective-Intelligence」/)

# Related

- **欧几里得距离评价**
- **皮尔逊相关度评价**

> - The formula for this is more complicated than the Euclidean distance score, but it tends to give better results in situations where the data isn’t well normalized—for example, if critics’ movie rankings are routinely more harsh than average. 它相比于欧几里德距离评价更加复杂，但其在数据不是很规范的时候（比如，影评者对影片的评价总是相对于平均水平偏离很大的时候），会给出更好的结果。
> - If one critic is inclined to give higher scores than the other, there can still be perfect correlation if the difference between their scores is consistent. The Euclidean distance score described earlier will say that two critics are dissimilar because one is consistently harsher than the other, even if their tastes are very similar. 如果某人总是倾向于给出比另一个人更高的分值，而两者的分值之差又始终保持一致，则他们依然可能会存在很好的相关性。而欧几里德距离评价会因为一个人的评价之中比另外一个人的更为“严格”（从而导致评价始终相对偏低），从而得出两者不相近的结论，即使他们的品位很相似也是如此。

- **其他相似度计算函数（Minkowski 距离、Mahalanobis 距离等）**

---

# Key:

在「推荐物品」的模块中，提到了一种方法：

1. 通过函数找出与自己有相似品味的影评者，并按相似度从大到小排序。
2. 对于自己未看过的影片，建立一张表，表的内容包括：品位相似的影评者以及其对应的相似度，对于自己未看过影片的评分（影评者可以看过也可以没有看过）。
3. 对于某一个未看过的电影，影评者的相似度（可理解为权值，不同评论者的权值不同，相似度越高，权值越高）乘以其对该电影的评分，其他影评者也得到一个值（如果没有看过，则为零），然后累加，记为其他影评者对于该电影者的评价总和，之后总和需要除以所有对该电影评过分的影评者的相似度之和。
4. 最后得到的结果，表示为自己对于没有看过的电影，通过自己品位相似的影评者得到的预测评分，根据预测评分，来给出决策。

---

# Need to know:

在「构建一个基于 del.icio.us 的链接推荐系统」的模块中：  
首先我们需要下载 **`pydelicious`** 这一个 package。**［这个 package 不支持 python3.x］**

我的尝试：

1. 通过 Pycharm 自带的“便利”package 下载。出错，原因：无法找到对应的版本。
2. 通过命令行输入**`sudo pip install pydelicious`**。出错，原因：Could not find a version that satisfies the requirement pydelicious (from versions:)No matching distribution found for pydelicious。
3. 通过命令行输入**`sudo pip install pydelicious --allow-external pydelicious --allow-unverified pydelicious`**。出错，原因：Could not find a version that satisfies the requirement pydelicious (from versions:)No matching distribution found for pydelicious。

---

初次尝试失败之后，在 Stackoverflow 寻找解决办法：

1. 首先，按照书本提供的下载地址：[the pydelicious download page](https://code.google.com/archive/p/pydelicious/downloads)［需要翻墙］下载 **pydelicious-0.5.0.zip** 文件。解压之后得到文件夹。
2. 命令行 **`cd`** 到解压后的文件夹，然后输入 **`sudo python setup.py install`**，错误提示：Feedparser not available, no RSS parsing。 **意思是缺少 `feedparser` 这一 package 依赖库，需要安装 feedparser**。
3. 安装 feedparser，下载地址：[the feedparser download page](http://download.csdn.net/download/dixin28/5271130)［需要积分］，或者[the feedparser download page](https://github.com/kurtmckee/feedparser)［需要翻墙］，下载文件夹。
4. 命令行 **`cd`** 到 feedparser 的文件夹，然后输入**`sudo python setup.py install`**，feedparser 安装完成。
5. 命令行 **`cd`** 回到 pydelicious 文件夹，再次输入**`sudo python setup.py install`**，此时会发现 pydelicious 安装成功。
6. 测试 pydelicious 此 package 是否能够导入，命令行输入 **`python`** 之后，再输入**`import pydelicious`**，如果没有报错，这说明 pydelicious 安装成功。

- 2016.11.28 补充：如果按照书本上下载的 pydelicious-0.5.0 版本，是可以正常运行书本上的代码的而不报错的，但是会出现无论我如何修改 tag 的值，返回的内容都是一样的，原因在后面解释了。但是如果我们下载的是[github 上更新后的 pydelicious 版本](https://github.com/dotmpe/python-delicious)，会遇到如下问题，解决办法是需要修改 **`__init__.py`** 文件中的几处代码，但是仍然会出现 tag 值的问题。

---

本以为问题得到了解决，可以按照书上的代码继续进行:

|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` $ python >>> import pydelicious >>> pydelicious.get_popular(tag='python') ``` |

此时会报错，无论是否翻墙，显示获取失败。

---

我在 stackoverflow.com 上找到了原因：[the answer](http://stackoverflow.com/questions/29543799/pydelicious-get-popularprogramming-doesnt-return-any-valid-url)**［需要翻墙］**  
仔细看提问者的问题，重点是后面提出解决办法的几个回答。

> **You should modify the \_\_init\_\_.py to:rss =http\_request(‘<http://feeds.delicious.com/v2/rss>‘) .read()**

所以解决的办法是：  
打开 pydelicious 的文件夹，找到子文件夹 pydelicious 下的 **`__init__.py`** 文件，修改三处地方：

- **DLCS\_RSS = ‘<http://feeds.delicious.com/v2/rss/>‘**
- **rss = http\_request(‘<http://feeds.delicious.com/v2/rss>‘). read()**
- **def get\_popular(tag =””):return getrss(tag = tag, popular =0)**

命令行 **`cd`** 到 pydelicious 安装总文件夹，重新输入**`sudo python setup.py install`**。

|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` $ python >>> import pydelicious >>> pydelicious.get_popular(tag='python') ``` |

此时会发现成功获取到了内容（注意检查网络，如果仍然无法获取，记得翻墙）。

---

本以为到此终于告一段落，但是实际上：

|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` >>> import pydelicious >>> pydelicious.get_popular(tag='python') >>> pydelicious.get_popular(tag='xxx') ``` |

意思是无论我如何更改参数 **`tag`** 的值，返回的内容会发现是一样。这个问题，stackoverflow 老外也同样遇到了：

> **I see the resource code again. Maybe it is wrong. Because If you edit the code, the procedural answer always remain unchanged…I’m studing…**

我个人觉得可能是 DLCS\_RSS 的网址还需要更改一下（因为这本书在刚出来的时候，pydelicious 还是支持原 del.icio.us 的网站，是不需要去更改 **`__init__.py`** 的文件等，后来是 unspported，所以需要更改 **`__init__.py`** 文件中的 RSS 订阅源，也许可能这个订阅源还不是最新的，反正是坑…），或者说是 **`get_popular()`** 这个 function 有误（这个不太可能），总而言之，折腾了一下晚上，感觉是遇到了坑，不过好歹也算是解决出来了。

貌似有 **`deliciousapi`** 这个 package 作为替代，我也尝试过，但运行说明文档中的几个函数，发现会报错，希望如果有人知道如何用 **deliciousapi** 替代 pydelicious 完成第二章后续的几个模块，请务必告诉我！

注意：新手实践这本书的时候，完全可以跳过这个坑，因为没有必要，只需要 get 第二章几个重要的算法或者是思想就可以了。

---

# Correct errors in printing:

- P13

|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` # 如果两者没有共同之处，则返回 1 if n==0: return 1 ``` |

需要更正为：

|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` # 如果两者没有共同之处，则返回 0 if n==0: return 0 ``` |


---

# Practice:

- **暂无**

---
