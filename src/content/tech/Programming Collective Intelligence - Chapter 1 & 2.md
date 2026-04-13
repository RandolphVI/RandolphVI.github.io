---
title: "Programming Collective Intelligence - Chapter 1 & 2"
date: 2016-03-12
category: "AI"
tags: ["Machine Learning", "Books", "Python"]
description: "本文是关于「Programming Collective Intelligence」这本书的 Chapter 1 & 2 的学习笔记。"
draft: false
---

![](https://farm5.staticflickr.com/4306/36216231065_8a7e508f9e_o.jpg)

> ** 本系列文章： ** [Chapter 1 & 2](/tech/programming-collective-intelligence---chapter-1--2/) · [Chapter 3](/tech/programming-collective-intelligence---chapter-3/)


在「推荐物品」的模块中，提到了一种方法：

1.  通过函数找出与自己有相似品味的影评者，并按相似度从大到小排序。
2.  对于自己未看过的影片，建立一张表，表的内容包括：品位相似的影评者以及其对应的相似度，对于自己未看过影片的评分（影评者可以看过也可以没有看过）。
3.  对于某一个未看过的电影，影评者的相似度（可理解为权值，不同评论者的权值不同，相似度越高，权值越高）乘以其对该电影的评分，其他影评者也得到一个值（如果没有看过，则为零），然后累加，记为其他影评者对于该电影者的评价总和，之后总和需要除以所有对该电影评过分的影评者的相似度之和。
4.  最后得到的结果，表示为自己对于没有看过的电影，通过自己品位相似的影评者得到的预测评分，根据预测评分，来给出决策。

---

# Need to know:
在「构建一个基于del.icio.us的链接推荐系统」的模块中：
首先我们需要下载 **`pydelicious`** 这一个package。__［这个package不支持python3.x］__

我的尝试：

1. 通过Pycharm自带的“便利”package下载。出错，原因：无法找到对应的版本。
2. 通过命令行输入 **`sudo pip install pydelicious`** 。出错，原因：Could not find a version that satisfies the requirement pydelicious (from versions: )No matching distribution found for pydelicious。
3. 通过命令行输入 **`sudo pip install pydelicious --allow-external pydelicious --allow-unverified pydelicious`** 。出错，原因：Could not find a version that satisfies the requirement pydelicious (from versions: )No matching distribution found for pydelicious。

---
初次尝试失败之后，在Stackoverflow寻找解决办法：

1. 首先，按照书本提供的下载地址：[the pydelicious download page](https://code.google.com/archive/p/pydelicious/downloads)［需要翻墙］下载 **pydelicious-0.5.0.zip** 文件。解压之后得到文件夹。
2. 命令行 **`cd`** 到解压后的文件夹，然后输入 **`sudo python setup.py install`** ，错误提示：Feedparser not available, no RSS parsing。 ** 意思是缺少`feedparser`这一package依赖库，需要安装feedparser** 。
3. 安装feedparser，下载地址：[the feedparser download page](http://download.csdn.net/download/dixin28/5271130)［需要积分］，或者[the feedparser download page](https://github.com/kurtmckee/feedparser)［需要翻墙］，下载文件夹。
4. 命令行 **`cd`** 到feedparser的文件夹，然后输入 **`sudo python setup.py install`** ，feedparser安装完成。
5. 命令行 **`cd`** 回到pydelicious文件夹，再次输入 **`sudo python setup.py install`** ，此时会发现pydelicious安装成功。
6. 测试pydelicious此package是否能够导入，命令行输入 **`python`** 之后，再输入 **`import pydelicious`** ，如果没有报错，这说明pydelicious安装成功。

* 2016.11.28 补充：如果按照书本上下载的pydelicious-0.5.0版本，是可以正常运行书本上的代码的而不报错的，但是会出现无论我如何修改tag的值，返回的内容都是一样的，原因在后面解释了。但是如果我们下载的是[github上更新后的pydelicious版本](https://github.com/dotmpe/python-delicious)，会遇到如下问题，解决办法是需要修改 **`__init__.py`** 文件中的几处代码，但是仍然会出现tag值的问题。

---
本以为问题得到了解决，可以按照书上的代码继续进行:

```bash
$ python
>>> import pydelicious
>>> pydelicious.get_popular(tag='python')
```
此时会报错，无论是否翻墙，显示获取失败。

---
我在stackoverflow.com上找到了原因：[the answer](http://stackoverflow.com/questions/29543799/pydelicious-get-popularprogramming-doesnt-return-any-valid-url)__［需要翻墙］__
仔细看提问者的问题，重点是后面提出解决办法的几个回答。

> **You should modify the \_\_init\_\_.py to:rss =http_request('http://feeds.delicious.com/v2/rss') .read()**


所以解决的办法是：
打开pydelicious的文件夹，找到子文件夹pydelicious下的 **`__init__.py`** 文件，修改三处地方：
- **DLCS\_RSS = 'http://feeds.delicious.com/v2/rss/'**
- **rss = http\_request('http://feeds.delicious.com/v2/rss'). read()**
- **def get\_popular(tag =""):return getrss(tag = tag, popular =0)**

命令行 **`cd`** 到pydelicious安装总文件夹，重新输入 **`sudo python setup.py install`** 。

```bash
$ python
>>> import pydelicious
>>> pydelicious.get_popular(tag='python')
```

此时会发现成功获取到了内容（注意检查网络，如果仍然无法获取，记得翻墙）。

---
本以为到此终于告一段落，但是实际上：

```bash
>>> import pydelicious
>>> pydelicious.get_popular(tag='python')
>>> pydelicious.get_popular(tag='xxx')
```

意思是无论我如何更改参数 **`tag`** 的值，返回的内容会发现是一样。这个问题，stackoverflow老外也同样遇到了：
> __I see the resource code again. Maybe it is wrong. Because If you edit the code, the procedural answer always remain unchanged...I'm studing...__

我个人觉得可能是DLCS\_RSS的网址还需要更改一下（因为这本书在刚出来的时候，pydelicious还是支持原del.icio.us的网站，是不需要去更改 **`__init__.py`** 的文件等，后来是unspported，所以需要更改 **`__init__.py`** 文件中的RSS订阅源，也许可能这个订阅源还不是最新的，反正是坑...），或者说是 **`get_popular()`** 这个function有误（这个不太可能），总而言之，折腾了一下晚上，感觉是遇到了坑，不过好歹也算是解决出来了。

貌似有 **`deliciousapi`** 这个package作为替代，我也尝试过，但运行说明文档中的几个函数，发现会报错，希望如果有人知道如何用 **deliciousapi** 替代pydelicious完成第二章后续的几个模块，请务必告诉我！

注意：新手实践这本书的时候，完全可以跳过这个坑，因为没有必要，只需要get第二章几个重要的算法或者是思想就可以了。

---
# Correct errors in printing:

- P13

```python
# 如果两者没有共同之处，则返回1
if n==0: return 1
```

需要更正为：

```python
# 如果两者没有共同之处，则返回0
if n==0: return 0
```

---
# Practice:
- ** 暂无 **

---
