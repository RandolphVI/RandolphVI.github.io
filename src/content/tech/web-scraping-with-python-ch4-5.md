---
title: "Web Scraping with Python - Chapter 4 & 5"
date: 2015-11-27
category: "工具"
tags: ["Web Scraping", "Python"]
description: "本文是关于「Web Scraping with Python」这本书的 Chapter 4 & 5 的学习笔记。"
draft: false
---

![](https://farm5.staticflickr.com/4316/36049777032_f975ed0941_o.jpg)

> **本系列文章：** [Chapter 1 & 2](/tech/web-scraping-with-python-ch1-2/) · [Chapter 3](/tech/web-scraping-with-python-ch3/) · [Chapter 4 & 5](/tech/web-scraping-with-python-ch4-5/) · [smtplib & email module](/tech/web-scraping-with-python-smtplib/)


# Related

- **Parsing JSON**
- **Storing Data to CSV**
- **Integrating with Python & MySQL**

------

# Key：

## Parsing JSON?

> Python uses a more flexible approach and turns JSON objects into dictionaries, JSON arrays into lists, JSON strings into strings, and so forth. In this way, it makes it extremely easy to access and manipulate values stored in JSON.
>
> Python 使用了一种更加灵活的方式来处理 JSON，把 JSON 转换成字典，JSON 数组转换成列表，JSON 字符串转换成 Python 字符串。通过这种方式，就可以让 JSON 的获取和操作变得更加简单。
> 下面的程序对维基百科的编辑历史页面里面的 IP 地址找出来，并查询 IP 地址所属的国家和地区：

```python
from urllib.request import urlopen
from urllib.request import HTTPError
from bs4 import BeautifulSoup
import datetime
import json
import random
import re

random.seed(datetime.datetime.now())
def getLinks(article_url):
    html = urlopen("http://en.wikipedia.org"+article_url)
    bsObj = BeautifulSoup(html.read(),"html5lib")
    return bsObj.find("div",{"id":"bodyContent"}).findAll("a",href=re.compile("^(/wiki/)((?!:).)*$"))

def getHistoryIPs(page_url):
    # http://en.wikipedia.org/w/index.php?title=Title_in_URL&action=history
    page_url = page_url.replace("/wiki/","")
    history_url = "http://en.wikipedia.org/w/index.php?title=" + page_url + "&action=history"
    print("history url is: " + history_url)
    html = urlopen(history_url)
    bsObj = BeautifulSoup(html.read(),"html5lib")
    # finds only the links with class "mw-anonuserlink" which has IP addresses instead of usernames
    ipAddresses = bsObj.findAll("a", {"class":"mw-anonuserlink"})
    addressList = set()
    for ipAddresses in ipAddresses:
        addressList.add(ipAddresses.get_text())
    return addressList

def getCountry(ipAddress):
    try:
        response = urlopen("http://freegeoip.net/json/" + ipAddress).read().decode('utf-8')
    except HTTPError:
        return None
    responseJson = json.loads(response)
    return responseJson.get("country_code")

links = getLinks("/wiki/Python_(programming_language)")

while(len(links) > 0):
    for link in links:
        print("----------------")
        historyIPs = getHistoryIPs(link.attrs["href"])
        for historyIP in historyIPs:
            country = getCountry(historyIP)
            if country is not None:
                print(historyIP + "is from " + country)

    newLink = links[random.randint(0,len(links)-1)].attrs["href"]
    links = getLinks(newLink)
```

------

## Download Page Source

下面的程序将 http://pythonscraping.com 主页上所有 src 属性的文件都下载下来，然后对 URL 链接进行清理和标准化，获得文件对绝对路径（而且去掉了外链）。最后，每个文件都会下载到程序所在文件夹到 downloaded 文件里：

```python
from urllib.request import urlretrieve
from urllib.request import urlopen
from bs4 import BeautifulSoup
import os

download_directory = "downloaded"
base_url = "http://pythonscraping.com"

def getAbsolute_url(base_url,source):
    if source.startswith("http://www."):
        url = "http://" + source[11:]
    elif source.startswith("http://"):
        url = source
    elif source.startswith("www."):
        url = source[4:]
        url = "http://" + source
    else:
        url = base_url + "/" + source
    if base_url not in url:
        return None
    return url

def getDownloadPath(base_url, absolute_url, download_directory):
    path = absolute_url.replace("www","")
    path = path.replace(base_url,"")
    path = download_directory + path
    directory = os.path.dirname(path)

    if not os.path.exists(directory):
        os.makedirs(directory)

    return path

html = urlopen("http://www.pythonscraping.com")
bsObj = BeautifulSoup(html.read(),"html5lib")
downloadList = bsObj.findAll(src=True)

for download in downloadList:
    file_url = getAbsolute_url(base_url, download["src"])
    if file_url is not None:
        print(file_url)

urlretrieve(file_url,getDownloadPath(base_url,file_url,download_directory))
```

------

## Storing Data to CSV

> CSV, or comma-separated values, is one of the most popular file formats in which to store spreadsheet data. It is supported by Microsoft Excel and many other applica‐ tions because of its simplicity. The following is an example of a perfectly valid CSV file: 

```text
fruit,cost
apple,1.00
banana,0.30
pear,1.25
```

网络数据采集的一个常用功能就是获取 HTML 表格并写入 CSV 文件。

------

# Need to Know:

## MySQL

[**The download page**](http://dev.mysql.com/downloads/mysql/)

下载 .dmg 安装包，在 MySQL5.7.x 版本之后，安装的时候会随机分配一个初始密码！这非常重要，例如 root@localhost: __;,aLs&%%4ziE__ 密码很复杂，最好先复制下来，等会更改密码的时候需要用到。

安装完成之后，可以在系统偏好设置中看到多出了一个 MySQL，我们可以通过其来开关 MySQL 服务器，当然我们可以通过命令行输入来控制。
打开服务器，在命令行输入：

```
$ alias mysql=/usr/local/mysql/bin/mysql
$ alias mysqladmin=/usr/local/mysql/bin/mysqladmin
```

ps: 注意，这上面 alias 别名的方法，只是一次性的，意味着我们关闭了终端之后再开，命令行直接输入 mysql 或者 mysqladmin 就无效了。如果需要长期有效，需要修改文件，让终端启动的时候加载。

```
$ cd ~
$ vim ./bash_profile
```
**注意：如果你安装了 oh-my-zsh，需要去更改 .zshrc 文件。**

然后更改密码，命令行输入：

```
$ mysqladmin - u root -p password xxx(我们需要的新密码)
```

确保 MySQL 服务器打开，然后命令输入：

```
$ mysql -u root -p
```

若未显示错误，则表示连接上数据库了

------

## Integrating with Python

Python 没有内置的 MySQL 支持工具。不过，有很多开源的库可以用来与MySQL 做交互，Python2.x 和 Python3.x 版本都支持。最有名的一个库就是PyMySQL。

我是在 PyCharm 直接安装 PyMySQL，安装完成之后，如果我们的MySQL的服务器处于运行状态，应该就可以使用 PyMySQL 包。

```python
>>> import pymysql.conn = pymysql.connect(host='127.0.0.1', unix_socket='/tmp/mysql.sock', 
 			user='root', passwd='xxxx', db='mysql')
>>> cur = conn.cursor()
>>> cur.execute("USE scraping")
>>> cur.execute("SELECT * FROM pages WHERE id=1") 
>>> print(cur.fetchone())cur.close().conn.close() 
```

1. 程序中有两个对象：连接对象 **`conn`** 和光标对象 **`cur`**。
2. 连接/光标模式是数据库编程中常见的模式。连接模式除了要连接数据库之外，还要发送数据库信息，处理回滚操作（当一个查询或一组查询被中断时，数据库需要回到初始状态，一般用事务控制手段实现状态会滚），创建新的光标对象，等等。
3. __而一个 `conn` 可以有很多个 `cur`__。一个光标跟踪一种状态信息，比如跟踪数据库的使用状态。如果你有多个数据库，且需要向所有数据库写内容，就需要多个光标来处理。光标还包含最后一次查询执行的结果。通过调用光标函数，比如 **`cur.fetchone()`**，可以获取查询结果。
4. 用完光标和链接之后，千万记得要把它们关闭。如果不关闭就会导致连接泄漏（__connection leak__），造成一种未关闭连接的现象，即连接已经不在使用，但是数据库却不能关闭，因为数据库不能确定你还要不要继续使用它。这种现象会一直耗费数据库的资源，所以用完数据库之后记得关闭连接！
5. 进行网络数据采集的时候，处理 Unicode 字符串是很痛苦的事情。默认情况下，MySQL 也不支持 Unicode 字符处理。不过我们可以设置这个功能，因为采集的时候，我们难免会遇到各种各样的字符，所以最好一开始就让我们的数据库支持 Unicode：

```SQL
ALTER DATABASE scraping CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci; 
ALTER TABLE pages CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; 
ALTER TABLE pages CHANGE title title VARCHAR(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; 
ALTER TABLE pages CHANGE content content VARCHAR(10000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; 
```

我们尝试用下面的程序来存储数据：

```python
from urllib.request import urlopen
from bs4 import BeautifulSoup
import re
import datetime
import random
import pymysql

conn = pymysql.connect(host='127.0.0.1', unix_socket='/tmp/mysql.sock',
                       user='root',passwd='randolph',db='mysql',charset='utf8')

cur = conn.cursor()
cur.execute("USE scraping")

random.seed(datetime.datetime.now())

def store(title, content):
    cur.execute("INSERT INTO pages(title, content) VALUE (\"%s\",\"%s\")",(title,content))
    cur.connection.commit()

def getLinks(article_url):
    html = urlopen("http://en.wikipedia.org"+article_url)
    bsObj = BeautifulSoup(html.read(),"html5lib")
    title = bsObj.find("h1").get_text()
    content = bsObj.find("div", {"id":"mw-content-text"}).find("p").get_text()
    store(title,content)
    return bsObj.find("div",{"id":"bodyContent"}).findAll("a",href=re.compile("^(/wiki/)(?!:).)*$"))

links = getLinks("/wiki/Kevin_Bacon")

try:
    while len(links) > 0:
        newArticle = links[random.randint(0, len(links)-1)].attrs["href"]
        print(newArticle)
        links = getLinks(newArticle)

finally:
    cur.close()
    conn.close()
```

- 需要注意的是 **`store()`** 函数，它有两个参数：**`title`** 和 **`content`**，并把这两个参数加到了一个 INSERT 语句中并用光标执行，然后用光标进行连接确认。这是一个让光标与连接操作分离的好例子；当光标里存储了一些数据库与数据库上下文的信息时，需要通过连接的确认操作先将信息传进数据库，再将信息插入数据库。
- 最后需要注意的是 finally 语句是在程序主循环的外面，代码的最底下。这样做可以保证，无论程序执行过程中如何发生中断或抛出异常（当然，因为网络很复杂，我们需要随时准备遭遇异常），光标和连接都会在程序结束前立即关闭。无论我们是在采集网络还是在处理一个打开连接的数据库，用 **`try...finally`** 都是一个好主意。

------

# Correct errors in printing:

- **暂无**

------

# Practice:

- **暂无**
