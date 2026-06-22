---
title: "Web Scraping with Python - Chapter 3"
date: 2015-11-13
category: "工具"
tags: ["Web Scraping", "Python"]
description: "本文是关于「Web Scraping with Python」这本书的 Chapter 3 的学习笔记。"
draft: false
---

![](https://farm5.staticflickr.com/4316/36049777032_f975ed0941_o.jpg)

> **本系列文章：** [Chapter 1 & 2](/tech/web-scraping-with-python---chapter-1--2/) · [Chapter 3](/tech/web-scraping-with-python---chapter-3/) · [Chapter 4 & 5](/tech/web-scraping-with-python---chapter-4--5/) · [smtplib & email module](/tech/web-scraping-with-python---smtplib--email-module/)


## Think First

> What data am I trying to gather? Can this be accomplished by scraping just a few predefined websites (almost always the easier option), or does my crawler need to be able to discover new websites I might not know about? 
> 我需要收集哪些数据？这些数据可以通过采集几个已经确定的网站（永远是最简单的做法）完成吗？或者我需要通过爬虫发现那些我可能不知道的网站从而获取我想要的信息吗？

> When my crawler reaches a particular website, will it immediately follow the next outbound link to a new website, or will it stick around for a while and drill down into the current website? 
> 当我的爬虫到了某一个网站，它是立即顺着下一个出站链接跳转到下一个新网站，还是在网站上呆一会，深入采集网站的内容？

> Are there any conditions under which I would not want to scrape a particular site? Am I interested in non-English content? 
> 有没有我不想采集的一些网站？我对非英文网站的内容感兴趣么？

> How am I protecting myself against legal action if my web crawler catches the attention of a webmaster on one of the sites it runs across? 
> 如果我的爬虫引起了某个网站网管的怀疑，我该如何避免法律责任？

-----

## urlparse module

**urlparse** 模块主要是把 url 拆分为六个部分，并返回元组 tuple。并且可以把拆分后的部分再组成一个 url。主要函数有 <strong>`urljoin`</strong>、<strong>`urlsplit`</strong>、<strong>`urlunsplit`</strong>、<strong>`urlparse`</strong> 等。[^1]

### urlparse function

```bash
>>> from urlparse import urlparse
>>> o = urlparse('http://www.cwi.nl:80/%7Eguido/Python.html')
>>> o    
    ParseResult(scheme='http', netloc='www.cwi.nl:80', path='/%7Eguido/Python.html', params='', query='', fragment='')
>>> o.scheme  
    'http'
>>> o.port  
    80
>>> o.geturl()  
    'http://www.cwi.nl:80/%7Eguido/Python.html'
```

其将 url 解析成六个部分<strong>（scheme, netloc, path, parameters, query, fragment）</strong>。

-----

## scrapy

> Scrapy uses the Item objects to determine which pieces of information it should save from the pages it visits. This information can be saved by Scrapy in a variety of ways, such as a CSV, JSON, or XML files, using the following commands: 
> Scrapy 用 Item 对象决定要从它浏览的页面中提取哪些信息。Scrapy 支持用不同的输出格式来保存这些信息，比如 CSV、JSON、XML 文件格式，对应命令如下：

```bash
$ scrapy crawl article -o articles.csv -t csv
$ scrapy crawl article -o articles.json -t json
$ scrapy crawl article -o articles.xml -t xml
```

当然我们也可以自己定义 Item 对象，把结果写入我们需要的一个文件或者数据库中，只要在爬虫的 parse 部分增加相应的代码即可。
Scrapy 是处理网络数据采集相关问题的利器。它可以自动收集所有 URL，然后和指定的规则进行比较；确保所有的 URL 是唯一的；根据需求对相关的 URL 进行标准化；以及到更深层的页面中递归查询。

-----

## Need to know

在「用Scrapy采集」的模块中：

我们需要下载 **`scrapy`** 这一个 package。<strong>「 这个 package 不支持 python3.x 和 python2.6，只能使用 python2.7 。」</strong>

我的尝试：

```bash
$ sudo pip install scrapy
Could not find function xmlCheckVersion in library libxml2. Is libxml2 installed? 
Perhaps try: xcode-select --install
```

意思是缺少 <strong>`libxml2` </strong>，通过命令行输入:

```bash
$ xcode-select --install
```

接着会弹出 Xcode command line tools 下载，里面包含了 <strong>`libxml2`</strong>。安装完成之后，再次尝试 <strong>`sudo pip install scrapy`</strong>，报错，内容为:

```bash
>>> from six.moves import xmlrpc_client as xmlrpclib
ImportError: cannot import name xmlrpc_client
```

在 stackoverflow 上寻找原因:

> - **six.moves** is a virtual namespace. It provides access to packages that were renamed between Python 2 and 3. As such, you shouldn't be installing anything.
>
> - By importing from six.moves.xmlrpc\_client the developer doesn't have to handle the case where it is located at xmlrpclib in Python 2, and at xmlrpc.client in Python 3. Note that these are part of the standard library.
>
> - The mapping was added to six version 1.5.0; make sure you have that version or newer.
>
> - Mac comes with six version 1.4.1 pre-installed in the path:  
>
>   **/System/Library/Frameworks/Python.framework/Versions/2.7/Extras/lib/python** 
>
>   and this will interfere with any version you install in site-packages (which is listed last in the sys.path).
>
>   The best work-around is to use a virtualenv and install your own version of six into that, together with whatever else you need for this project. Create a new virtualenv for new projects.
>
> - If you absolutely have to install this at the system level, then for this specific project you'll have to remove the /System/Library/Frameworks/Python.framework/Versions/2.7/Extras/lib/python path:

```bash
>>> import sys
>>> sys.path.remove('/System/Library/Frameworks/Python.framework/Versions/2.7/Extras/lib/python')
```

> - This will remove various OS X-provided packages from your path for just that run of Python; Apple installs these for their own needs.

Mac 自带的 **`six`** 版本过低，<strong>`scrapy`</strong> 需要 **`six`** 的版本在 1.5.0 以上，建议是采用 Python 虚拟环境，如果真的需要在 system level 上进行更改的话，需要重新安装 <strong>`six`</strong>。
于是，我先尝试了其中的一个解决办法：

```bash
$ sudo rm -rf /Library/Python/2.7/site-packages/six*
$ sudo rm -rf 
/System/Library/Frameworks/Python.framework/Versions/2.7/Extras/lib/python/six*
$ sudo pip install six
```

但很不幸的是，<strong>`sudo rm -rf`</strong> 尝试删除文件的时候失败报错，Operation not Permitted。
继续查找原因：

> - This is because OS X El Capitan ships with six 1.4.1 installed already and when it attempts to uninstall it (because scrapy depends on six >= 1.5) it doesn't have permission to do so because **System Integrity Protection** doesn't allow even root to modify those directories.
> - Ideally, pip should just skip uninstalling those items since they aren't installed to site-packages they are installed to a special Apple directory. However, even if pip skips uninstalling those items and installs six into site-packages we'll hit another bug where Apple puts their pre-installed stuff earlier in the sys.path than site-packages. I've talked to Apple about this and I'm not sure if they're going to do anything about it or not.

我的 Mac OS X 系统版本为 10.11.4，Mac 自版本 10.11 之后，由于新的 SIP 机制[^2]，即使是 root 用户也无法对 /System 中的内容进行修改删除（在系统恢复中可以办到）。

于是，我采用另外一种方法继续尝试：

```bash
$ sudo pip uninstall six
$ easy_install six
```

同样得到的是 `Operation not Permitted`（此方法在10.11之前的版本应该都可以行得通）。

后来尝试了通过 Python 虚拟环境进行解决，能力不够失败。
还尝试了通过下载 Python 官网的 2.7.11，不使用 Mac 系统默认自带的 2.7.10（有人提到使用自己安装的 Python2.7 可以解决问题），折腾了半天，还是失败告终，还差点弄的 pip 无法安装 package。挽救办法为：

```bash
$ brew link python 
$ brew unlink python
```

到最后，本来想着要放弃的，Stackoverflow 上的另一个办法让事情有了转机：

> This is a known issue on Mac OSX for Scrapy. You can refer to [this link](https://github.com/pypa/pip/issues/3165).
> Basically the issue is with the __PYTHONPATH__ in your system. To solve the issue change the current PYTHONPATH to point to the newer or none Mac OSX version of Python. Before running Scrapy, try:

```bash
$ export PYTHONPATH=/Library/Python/2.7/site-packages:$PYTHONPATH
```

> If that worked you can change the .bashrc file permanently:

```bash
$ echo "export PYTHONPATH=/Library/Python/2.7/site-packages:$PYTHONPATH" >> ~/.bashrc
```

> If none of this works, take a look at the link above.

此时命令行输入 python，之后输入：

```bash
>>> import scrapy
```

没有报错，说明可以导入scrapy。

尝试书上的命令：

```bash
$ scrapy startproject wikiSpider
```

得到信息：

```bash
New Scrapy project 'wikiSpider' created in:
	/Users/randolph/PycharmProjects/Scraping/wikiSpider
You can start your first spider with:
	cd wikiSpider
	scrapy genspider example example.com
```

成功！scrapy is ready to go!

-----

## Appendix

### Correct errors in printing

- **暂无**

-----

### Practice
- **暂无**

-----

[^1]: 在 Python 3 中，`urlparse` 模块被移入 `urllib.parse`，使用时需 `from urllib.parse import urlparse`。RFC 3986 定义了 URI 的通用语法，`urlparse` 的六元组正是对应其中的 scheme、netloc、path、params、query、fragment 六个组成部分。
[^2]: SIP（System Integrity Protection，系统完整性保护）是 Apple 在 OS X El Capitan（10.11）引入的安全机制，限制了对 `/System`、`/usr`、`/bin`、`/sbin` 等目录的写权限，即便是 root 权限也无法修改，防止恶意软件篡改系统文件。
