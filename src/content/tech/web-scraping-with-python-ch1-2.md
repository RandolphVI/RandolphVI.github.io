---
title: "Web Scraping with Python - Chapter 1 & 2"
date: 2015-11-02
category: "工具"
tags: ["Web Scraping", "Python"]
description: "本文是关于「Web Scraping with Python」这本书的 Chapter 1 & 2的学习笔记。"
draft: false
---

![](https://farm5.staticflickr.com/4316/36049777032_f975ed0941_o.jpg)

> **本系列文章：** [Chapter 1 & 2](/tech/web-scraping-with-python-ch1-2/) · [Chapter 3](/tech/web-scraping-with-python-ch3/) · [Chapter 4 & 5](/tech/web-scraping-with-python-ch4-5/) · [smtplib & email module](/tech/web-scraping-with-python-smtplib/)

# Related

- **BeautifulSoup package**
- **Navigating Trees** 
- **Regular Expression**

-----

# Key:

## urlib or urlib2?

> If you’ve used the urllib2 library in Python 2.x, you might have noticed that things have changed somewhat between urllib2 and urllib. In Python 3.x, urllib2 was renamed urllib and was split into several submodules: urllib.request, urllib.parse, and url lib.error. Although function names mostly remain the same, you might want to note which functions have moved to submodules when using the new urllib. 

在学习这本书之前，使用过此 package（我一开始学习 Python 就用的是 3.x，Mac 自带 Python 2.x），当时出错了，在 Stackoverflow 找到了答案，现在这本书提到了这点，重新回顾一下:

如果你用过 Python 2.x 里的 **`urllib2`** 库，可能会发现 **`urllib2`** 与 **`urllib`** 有些不同。在 Python 3.x 里，**`urllib2`** 改名为 **`urllib`**，被分成一些子模块：**`urllib.request`**、**`urllib.parse`** 和 **`urllib.error`**。尽管函数名称大多和原来一样，但是在用新的 **`urllib`** 库时需要注意哪些函数被移动到子模块里了。

-----

## When to get_text() and When to Preserve Tags?

> .get_text() strips all tags from the document you are working with and returns a string containing the text only. For example, if you are working with a large block of text that contains many hyperlinks, paragraphs, and other tags, all those will be stripped away and you’ll be left with a tagless block of text.

> Keep in mind that it’s much easier to find what you’re looking for in a BeautifulSoup object than in a block of text. Calling .get_text() should always be the last thing you do, immediately before you print, store, or manipulate your final data. In general, you should try to preserve the tag structure of a document as long as possible.

简而言之，通常在我们准备打印、存储和操作数据的时候，即最后的时候才使用 **`.get_text()`**。一般情况下，我们应该尽可能地保留 HTML 文档的标签结构。

-----

## find() and findAll() with BeautifulSoup?

- **findAll(tag, attributes, recursive, text, limit, keywords)**
- **find(tag, attributes, recursive, text, keywords)**

先说结论，再仔细说说参数的用法。

**`find()`** is equivalent to the same **`findAll()`** call, with a **limit** of  1.
**`find()`** 其实等价于 **`findAll()`** 的 **limit** 等于 1 时的特殊情况。 

- **`tag`**: 我们可以传一个标签的名称或多个标签名称组成的 Python 列表做标签参数。例如：**`('span', 'h1', {'span', 'h1'}, {'h1', 'h2', 'h3'})`**。其实就是一个「或」关系的过滤器（即我们可以选择带有 **`span`** 或 **`h1`** 或 **`h2`** 等的一列标签）。
- **`attributes`**: 这是一个用 Python 字典封装某一标签的若干属性和对应的属性值。例如：**`{'class': {'green', 'red'}}`**
- **`recursive`**: 一般情况下，这个参数不需要设置，除非我们真正了解自己需要哪些信息，而且抓取速度非常重要，因为这个参数会根据我们的要求去查找标签参数的所有子标签，以及子标签的子标签。
- **`limit`**: 只适用于 **`findAll()`** 方法，如果我们只对网页中获取的前 *x* 项结果感兴趣，我们就可以通过设置 **`limit`** 来获取。**但是需要注意的是：获得的前几项结果是按照网页上的顺序排序的，未必是我们想要的前几项，所以我们还需要额外做一些自己的排序。**
- **`keyword`**: 使我们选择那些具有制定属性的标签成为可能。

> **keyword 关键词参数的主意事项：**
> 使用 **`keyword`** 偶尔会出现问题，尤其是在用 **class** 属性查找标签的时候，因为 **class** 是 Python 中受保护的关键字。也就是说，**class** 是 Python 语言的保留字，在 Python 程序中是不能充当变量或者参数名使用的。假如我们运行下面的代码，Python 就会因为我们误用 **class** 保留字而产生一个语法错误：

>    **`bsObj.findAll(class='green')`**

> 不过 BeautifulSoup 提供了一个解决方案，就是在 class 后面增加一个下划线：

>    **`bsObj.findAll(class_='green')`**

> 我们也可以使用属性参数来将 **class** 用引号包起来：

>    **`bsObj.findAll('',{'class': 'green'})`**

**另外，如果说 `tag` 参数是相当于一个「或」关系的过滤器，那么 `keyword` 参数就可以为我们构造一个「与」关系的过滤器来提高我们的工作效率，简化我们的工作。**

-----

## Navigating Trees

如果说**`find()`** 和 **`findAll()`**函数是通过标签的名称和属性来查找标签，那么 Navigating Trees 就是通过标签在文档中的位置来查找标签。

### Make Selections Specific

> To make your scrapers more robust, it’s best to be as specific as pos‐ sible when making tag selections. Take advantage of tag attributes when they are available. 

如果想让我们的爬虫更加稳定，最好还是让标签的选择更加具体。如果有属性，就利用标签的属性。

```python
bsObj.tr
bsObj.table.tr
bsObj.find('table', {'id': 'giftList'}).tr
```

上述三行目的都是获取书本上的网站中的表格的第一行。但是我们应该采用最后一条，用更具体的形式来获取，原因很简单，即使页面上只有一个表格（或者其他的目标标签），只用标签也很容易丢失细节。另外，页面的布局总是不断变化的，一个标签这次是在表格中的第一行的位置，没准哪天就在第二行或者第三行了。

-----

## Regular Expression

学好正则表达式，走遍天下都不怕。正则表达式其实就是一个过滤器，如果你给我的字符串符合我写的规则，那么我就返回它。    

让我们来看看用正则表达式来表示邮箱地址：

**[A-Za-z0-9\\._+]+@[A-Za-z]+\\.(com|org|edu|net)**

让我们把它分解开来看：

1. **[A-Za-z0-9\\._+]+** :这个表达式把所有可能的序列和符号放在中括号（而不是小括号）里面，表示“括号中的符号里任何一个”。另外注意，后面的加号表示“这些符号都可以出现多次，而且至少出现一次”。
2. **@**：这个符号很直接，出现在中间位置，有且仅有一次。
3. **[A-Za-z]+** ：可能出现在域名的前半部分、符号@后面用字母。而且，至少有一个字母。
4. **.** :域名前必须有一个点号。
5. **(com|org|edu|net)** :顶级域名可能有很多种，但是作为参考，这是个后缀够用了。

-----

# Correct errors in printing:

- P17:

> 例如，`tr` 标签是 **`tabel`** 标签的子标签，而……

需要更正为：

> 例如，`tr` 标签是 **`table`** 标签的子标签，而……

-----

# Practice:
- **暂无**

-----
