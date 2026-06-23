---
title: "Web Scraping with Python - smtplib & email module"
date: 2015-12-13
category: "工具"
tags: ["Web Scraping", "Python"]
description: "本文介绍了关于 Web Scraping 网络爬虫时可能会用到的 smtplib & email 模块。"
draft: false
---

![](https://farm5.staticflickr.com/4316/36049777032_f975ed0941_o.jpg)

> **本系列文章：** [Chapter 1 & 2](/tech/web-scraping-with-python---chapter-1--2/) · [Chapter 3](/tech/web-scraping-with-python---chapter-3/) · [Chapter 4 & 5](/tech/web-scraping-with-python---chapter-4--5/) · [smtplib & email module](/tech/web-scraping-with-python---smtplib--email-module/)


## smtplib module

使用 python 脚本发邮件，一般会用到 **`smtplib`** 和 **`email`** 这两个模块。<strong>`smtplib`</strong> 模块定义了一个简单的 SMTP 客户端，可以用来在互联网上发送邮件。参考下面的程序：

```python
from email.header import Header
from bs4 import BeautifulSoup
import smtplib
import time

mail_host = 'smtp.gmail.com'            #设置服务器
mail_port = 587                         #服务器端口号
mail_user = 'your_username@gmail.com'   #用户名
mail_pass = 'your_password'             #口令

sender = 'your_username@gmail.com'
receivers = 'your_other_username@hotmail.com'

# fill content with MIMEText's object
msg = MIMEText('Hi, I am Randolph.')
msg['From'] = sender
msg['To'] = receivers
msg['Subject'] = 'Hello, today is a special day.'
print(msg.as_string())

# connect
try:
    print("Connecting ...")
    smtpObj = smtplib.SMTP(mail_host, mail_port)
except:
    print("CONNECT ERROR ****")

# show the debug log
smtpObj.set_debuglevel(1)

# gmail uses ssl
smtpObj.ehlo()
smtpObj.starttls()
smtpObj.ehlo()

# login with username & password
try:
    print("Loginning ...")
    smtpObj.login(mail_user, mail_pass)
except:
    print("LOGIN ERROR ****")

smtpObj.sendmail(sender, receivers, msg.as_string())
smtpObj.quit()
```

smtp 实例封装一个 smtp 连接，它支持所有的 SMTP 和 ESMTP 操作指令，如果 host 和 port 参数被定义，则 smtp 会在初始化期间自动调用 **`connect()`** 方法，如果 **`connect()`** 方法失败，则会触发 **`SMTPConnectError`** 异常，<strong>`timeout`</strong> 参数设置了超时时间。在一般的调用过程中，应该遵 <strong>`connect()`</strong>、<strong>`sendmail()`</strong>、<strong>`quit()`</strong>步骤。

------

### SMTP模块主要方法

`smtplib.SMTP` 类封装了完整的 SMTP 连接，以下是该类的主要方法及其功能说明：

- **`smtp.set_debuglevel(level)`**
  设置输出 debug 调试信息，默认不输出调试信息。
- **`smtp.docmd(cmd, argstring)`**
  发送一个 command 到 smtp 服务器，
- **`smtp.connect(host, port)`**
  连接到指定的 smtp 服务器，默认是本机的 25 端口。也可以写成 hostname:port 的形式。
- **`smtp.helo(hostname)`**
  使用 helo 指令向 smtp 服务器确认你的身份。
- **`smtp.ehlo(hostname)`**
  使用ehlo指令向 esmtp 服务器确认你的身份。
- **`smtp.ehlo_or_helo_if_needed()`**
  如果在以前的会话连接中没有提供 ehlo 或者 helo 指令，这个方法调用 ehlo() 或者 helo()。
- **`smtp.has_extn(name)`**
  判断指定的名称是否在 smtp 服务器上。
- **`smtp.verify(address)`**
  判断邮件地址是否在 smtp 服务器上存在。
- **`smtp.login(user, password)`**
  登陆需要验证的 smtp 服务器，如果之前没有提供 ehlo 或者 helo 指令，则会先尝试 ESMTP 的 ehlo 指令。
- **`smtp.starttls(keyfile, certfile)`**
  使 smtp 连接运行在 TLS 模式，所有的 smtp 指令都会被加密。[^2]
- **`smtp.sendmail(from_addr, to_addrs, msg, mail_options, rcpt_options)`**
  发送邮件，该方法需要一些邮件地址和消息。
- **`smtp.quit()`**
  终止 smtp 会话并且关闭连接。

------

## email module

如果想在邮件中携带附件，使用 html 书写邮件，附带图片等等，就需要使用 **`email`** 模块及其子模块。下面来看看 email 包，email 包是用来管理 email 信息的，它包括 MIME 和其他基于 RFC 2822 的消息格式。email 包的主要特征是在它内部解析和生成 email 信息是分开的模块来实现的。

MIME 消息由消息头和消息体两大部分组成，在邮件里就是邮件头和邮件体。邮件头与邮件体之间以空行进行分隔。[^1]

邮件头包含了发件人、收件人、主题、时间、MIME 版本、邮件内容的类型等重要信息。每条信息称为一个域，由域名后加 “ : ” 和信息内容构成，可以是一行，较长的也可以占用多行。域的首行必须“顶头”写，即左边不能有空白字符（空格和制表符）；续行则必须以空白字符打头，且第一个空白字符不是信息本身固有的。

邮件体包含邮件的内容，它的类型由邮件头的 “Content-Type” 域指出。最常见的类型有 text/plain（纯文本） 和 text/html（超文本）。邮件体被分为多个段，每个段又包含段头和段体两部分，这两部分之间也以空行分隔。常见的 multipart 类型有三种：multipart/mixed，multipart/related 和 multipart/alternative。

在 email 的包里面包含了很多模块：

- **`email.message`**
- **`email.parser`**
- **`email.generator`**
- **`email.mime` （创建 email 和 MIME 对象）**
- **`email.header`**
- **`email.charset`**
- **`email.encoders`**
- **`email.errors`**
- **`email.utils`**
- **`email.iterators`**

主要来看看 <strong>`email.mime`</strong>，在邮件中携带附件、图片、音频时，主要使用的是该模块。一般情况下，你通过解析一个文件或者一段text来生成一个消息对象结构，你也可以从头开始建立一个消息结构，实际上，你可以给一个已经存在的消息结构追加一个新的消息对象。你可以通过创建 message 实例来创建一个对象结构，然后给该结构追加附件和头部信息。email 包提供了一些子类使得该操作变得很容易。

模拟在邮件内容中携带图片，代码如下：

```python
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from email.message import Message
import email.utils
import smtplib
import time
import smtplib
import base64

mail_host = 'smtp.gmail.com'            #设置服务器
mail_port = 587                         #服务器端口号
mail_user = 'your_username@gmail.com'   #用户名
mail_pass = 'your_password'             #口令

sender = 'your_username@gmail.com'
receivers = 'your_other_username@hotmail.com'

# send email with images use MIMEMultipart's object
msg = MIMEMultipart()
msg['From'] = sender
msg['To'] = receivers
msg['Subject'] = 'An email with a image.'
body = 'Test image send.'
con = MIMEText('<b>%s</b>![](cid:/Users/xxx/xxx/xxx.jpg)' % body, 'html')
msg.attach(con)

img = MIMEImage(open('/Users/xxx/xxx/xxx.jpg', 'rb').read())
img.add_header('Content-ID', '/Users/xxx/xxx/xxx.jpg')
msg.attach(img)

# connect
try:
    print("Connecting ...")
    smtpObj = smtplib.SMTP(mail_host, mail_port)
except:
    print("CONNECT ERROR ****")

# show the debug log
smtpObj.set_debuglevel(1)

# gmail uses ssl
smtpObj.ehlo()
smtpObj.starttls()
smtpObj.ehlo()

# login with username & password
try:
    print("Loginning ...")
    smtpObj.login(mail_user, mail_pass)
except:
    print("LOGIN ERROR ****")

smtpObj.sendmail(sender, receivers, msg.as_string())
smtpObj.quit()
```

------

### Send email with attachment

发送带附件的邮件，首先要创建<strong>`MIMEMultipart()`</strong>实例，然后构造附件，如果有多个附件，可依次构造，最后利用<strong>`smtplib.smtp`</strong>发送。

模拟在邮件中携带附件，代码如下：
```python
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from email.message import Message
import email.utils
import smtplib
import time
import smtplib
import base64

mail_host = 'smtp.gmail.com'            #设置服务器
mail_port = 587                         #服务器端口号
mail_user = 'your_username@gmail.com'   #用户名
mail_pass = 'your_password'             #口令

sender = 'your_username@gmail.com'
receivers = 'your_other_username@hotmail.com'

# send email with attachment
msg = MIMEMultipart()
txt = MIMEText("我这半世未算赶，何妨迷途看风光.",'plain','gb2312')
msg.attach(txt)

#构造附件1
att1 = MIMEText(open('/Users/xxx/xxx/xxx.jpg', 'rb').read(), 'base64', 'gb2312')
att1["Content-Type"] = 'application/octet-stream'
att1["Content-Disposition"] = 'attachment; filename="xxx.jpg"'
#这里的filename可以任意写，写什么名字，邮件中显示什么名字
msg.attach(att1)

#构造附件2
att2 = MIMEText(open('/Users/xxx/xxx/xxx.doc', 'rb').read(), 'base64', 'gb2312')
att2["Content-Type"] = 'application/octet-stream'
att2["Content-Disposition"] = 'attachment; filename="xxx.doc"'
msg.attach(att2)

#加邮件头
msg['to'] = sender
msg['from'] = receivers
msg['subject'] = 'Test.'

# connect
try:
    print("Connecting ...")
    smtpObj = smtplib.SMTP(mail_host, mail_port)
except:
    print("CONNECT ERROR ****")

# show the debug log
smtpObj.set_debuglevel(1)

# gmail uses ssl
smtpObj.ehlo()
smtpObj.starttls()
smtpObj.ehlo()

# login with username & password
try:
    print("Loginning ...")
    smtpObj.login(mail_user, mail_pass)
except:
    print("LOGIN ERROR ****")

smtpObj.sendmail(sender, receivers, msg.as_string())
smtpObj.quit()
```

[^1]: MIME（Multipurpose Internet Mail Extensions，多用途互联网邮件扩展）是 1992 年由 Nathaniel Borenstein 和 Ned Freed 在 RFC 1341 中提出的标准，扩展了原始 SMTP 协议只能传输 ASCII 文本的限制，使邮件可以承载图片、附件、HTML 等多种类型内容。
[^2]: STARTTLS 是一种机会性加密机制：先在明文端口（如 587）建立连接，再通过 `STARTTLS` 命令将连接升级为 TLS 加密。与 SMTPS（端口 465，直接使用 SSL/TLS）不同，STARTTLS 在握手前有一段明文通信，但对现代邮件服务已足够安全。Gmail 要求使用 587 端口 + STARTTLS 或 465 端口 + SSL。
