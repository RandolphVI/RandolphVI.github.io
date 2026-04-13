---
title: "MongoDB and PyMongo"
date: 2017-07-15
category: "工具"
tags: ["Tools", "Python", "MongoDB"]
description: "本文介绍了 MongoDB 的相关知识，以及 PyMongo （Python 上连接 MongoDB 的第三方库）的 API 操作。"
draft: false
---

![](https://farm8.staticflickr.com/7874/32461566277_401e85a69d_o.jpg)

> **更多工具文章：** [查看工具分类](/categories/工具/)

# Chapter 1: Getting Started

## Installing MongoDB on Mac OS

Mac OS 安装 `MongoDB` 的方法有多种多样，这里使用 `Homebrew` 安装 `MongoDB`，在安装之前首先确保 `Homebrew` 更新至最新版本：

```bash
$ brew update
```

接着，使用 `Homebrew` 安装 `MongoDB`：

```bash
$ brew install mongodb
```

安装完成之后，在使用 `MongoDB` 之前，我们需要进行相应的环境配置。

## Setting up a Environment with MongoDB

修改 `MongoDB` 配置文件，配置文件默认在 `/usr/local/etc` 下的 `mongod.conf`（可以参考我的配置文件）：

```
# 日志
systemLog:
    destination: file	# 日志为文件
    path: /Users/XXX/MongoDB/log/mongo.log	# 文件位置
    logAppend: true	# 是否追加

# 进程
processManagement:
    fork: true	# 守护进程方式

# 数据读写
storage:
    dbPath: /Users/XXX/MongoDB/db	# 数据读写目录

net:
    bindIp: 127.0.0.1	# 绑定IP，默认127.0.0.1，只能本机访问
    port: 27017	# 端口 
```

`MongoDB` 默认的数据读写目录为 `/data/db`，默认的日志存储目录为 `/data/log`。

我们可以根据需要将其修改成自己需要的目录路径，其中 `XXX` 为你的电脑的用户名。

同样，我们也可以修改绑定的 IP 地址以及对应的端口号。

修改完 `mongod.conf` 配置文件后，根据自己配置内容，创建数据读写目录：

```bash
$ mkdir -p /Users/XXX/MongoDB/db
```

并要为其提供可读可写的权限：

```bash
$ chown -R /Users/XXX/MongoDB/db
```

最后一步，手动添加 `MongoDB` 安装目录到环境变量中。

如果使用的是 `bash`，请修改 `~/.bash_profile` 配置文件；
如果使用的是 `zsh`，请修改 `~/.zshrc` 配置文件。

```bash
$ vim ~/.bash_profile

```

```bash
alias mongod='mongod --config /usr/local/etc/mongod.conf'
```

这里将`mongod`命令指定为执行`mongod --config /usr/local/etc/mongod.conf`，即按照 `MongoDB` 的配置文件`mongod.conf`（即刚才修改的）的配置信息来启动 `MongoDB` 服务器端。

最后不要忘记让添加的环境变量生效：

```bash
$ source ~/.bash_profile
```

## Running with MongoDB

输入命令测试 `MongoDB` 的环境变量是否生效，尝试启动 `MongoDB` 服务器端：

```bash
$ mongod
```

若未出现报错，则说明 `MongoDB` 服务器端启动成功，会出现如下的信息：

```bash
about to fork child process, waiting until server is ready for connections.
forked process: 15751
child process started successfully, parent exiting
```

我们会得到相应的进程号。

接着，我们就可以进行 `MongoDB` 客户端数据库的连接：

```bash
$ mongo
```

若未出现报错，则进入 `MonogDB` 的使用界面。

## Restart the MongoDB

如果有一天你发现你的数据库突然启动不了了，很可能是你没有正常关闭 `MongoDB` 导致的。

你可以先尝试删除掉 `mongod.lock` 文件，然后重新启动。

如果还是仍然启动不了，可以先通过命令查看所有进程：

```bash
$ ps -A
```

找到 `MongoDB` 服务器端对应的进程号，进行关闭：

```bash
$ kill mongodb-id
```

之后再重新启动 `MongoDB` 服务端：

```bash
$ mongod
```

## MongoDB GUI

存在诸多 MongoDB GUI，我推荐使用的是[Robo 3T](https://robomongo.org)。

---

# Chapter 2: Reading and Writing to MongoDB with Python

## Create and Delete database

- `MongoDB`创建数据库的语法格式如下：

```bash
> use DATABASE_NAME
```

如果数据库不存在，则创建数据库，否则切换到指定数据库。

以下实例我们创建了数据库 **`randolph`**:

```bash
> use randolph
switched to db randolph
> db
randolph
```

如果你想查看所有数据库，可以使用 `show dbs` 命令：

```bash
> show dbs
local  0.078GB
test   0.078GB
```

可以看到，我们刚创建的数据库<strong>`randolph`</strong>并不在数据库的列表中，要显示它，我们需要向 **`randolph`** 数据库插入一些数据：

```bash
> db.randolph.insert({"name":"MongoDB"})
WriteResult({ "nInserted" : 1 })
> show dbs
local   0.078GB
randolph  0.078GB
test    0.078GB
```

**`MongoDB` 中默认的数据库为`test`，如果你没有创建新的数据库，集合将存放在 `test` 数据库中。**

- `MongoDB` 删除数据库的语法格式如下：

```bash
> db.dropDatabase()
```

删除当前数据库，默认为 `test`，你可以使用 `db` 命令查看当前数据库名。

以下实例我们删除了数据库 <strong>`randolph`</strong>。

首先，查看所有数据库：

```bash
> show dbs
local   0.078GB
randolph  0.078GB
test    0.078GB
接下来我们切换到数据库 randolph：
> use randolph
switched to db randolph
```

执行删除命令：

```bash
> db.dropDatabase()
{ "dropped" : "randolph", "ok" : 1 }
最后，我们再通过 show dbs 命令数据库是否删除成功：
> show dbs
local  0.078GB
test   0.078GB
```

以上是数据库的删除操作，而删除集合的语法格式如下：

```bash
> db.collection.drop()
```

以下实例删除了<strong>`randolph`</strong>数据库中的集合<strong>site</strong>：

```bash
> use randolph
switched to db randolph
> show tables
site
> db.site.drop()
true
> show tables
```

## Connecting to MongoDB with Python

`PyMongo` 是 Python 中用来操作 `MongoDB` 的一个库。首先通过 `pip3` 下载 `PyMongo`：

```bash
$ pip3 install pymongo
```

安装完 `PyMongo` 之后，我们直接来看一个使用例子：

```python
import sys

from datetime import datetime
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

def main():
    # 建立连接到默认主机（localhost）和端口（27017）。还可以指定主机和/或使用端口：
    try:
        client = MongoClient('localhost', 27017)
        print('Connected Successfully!')
    except ConnectionFailure as e:
        sys.stderr.write('Could not connect to MongoDB: %s' % e)
        sys.exit(1)

    db = client.local
    collection = db['your_collection']

if __name__ == "__main__":
    main()
```

## ObjectId

在 `MongoDB` 中存储的 `Document` 必须有一个<strong>`_id`</strong>键。这个键的值可以是任何类型的，默认是个`ObjectId`对象。

在一个`Collection`里面，每个`Document`都有唯一的<strong>`_id`</strong>值，来确保`Collection`里面每个`Document`都能被唯一标识。

`MongoDB` 采用 `ObjectId`，而不是其他比较常规的做法（比如自动增加的主键）的主要原因，因为在多个服务器上同步自动增加主键值既费力还费时。

`MongoDB` 的这种设计，就是体现<strong>空间换时间</strong>的思想。

`ObjectId` 是一个<strong>12</strong>字节 `BSON` 类型数据，有以下格式：
- 前 4 个字节表示时间戳
- 接下来的 3 个字节是机器标识码
- 紧接的 2 个字节由进程 id 组成（PID）
- 最后 3 个字节是随机数

举个例子，<strong>`4e7020cb7cac81af7136236b`</strong> 这个 24 位的字符串，虽然看起来很长，也很难理解，但实际上它是由一组十六进制的字符构成，每个字节两位的十六进制数字，总共用了12字节的存储空间。

### Time

对其前四个字节进行提取 <strong>`4e7020cb`</strong>，然后按照十六进制转为十进制，变为 <strong>`1315971275`</strong>，这个数字就是一个时间戳。通过时间戳的转换，就成了易看清的时间格式。

```bash
$ date -r 1315971275
Mer 14 Set 2011 11:34:35 CST
```

### Machine

接下来的三个字节就是 <strong>`7cac81`</strong>，这三个字节是所在主机的唯一标识符，一般是机器主机名的散列值，这样就确保了不同主机生成不同的机器 hash 值。

这样确保在分布式中不造成冲突，这也就是在同一台机器生成的`ObjectId`中间的字符串都是一模一样的原因。

### PID

上面的三个字节的`Machine`是为了确保在不同机器产生的`ObjectId`不冲突，而`PID`就是为了在同一台机器不同的`MongoDB`进程产生了`ObjectId`不冲突。

接下来的两个字节就是<strong>`af71`</strong>，它是产生`ObjectId`的进程标识符。

### INC

自增计数器。前面的九个字节是保证了一秒内不同机器不同进程生成`ObjectId`不冲突，这后面的三个字节<strong>`36236b`</strong>是一个自动增加的计数器，用来确保在同一秒内产生的`ObjectId`也不会发现冲突，允许$256^3=16777216$条记录的唯一性。

总的来看，`ObjectId` 的前4个字节时间戳，记录了文档创建的时间；接下来 3 个字节代表了所在主机的唯一标识符，确定了不同主机间产生不同的`ObjectId`；后 2 个字节的进程 id，决定了在同一台机器下，不同 `MongoDB` 进程产生不同的 `ObjectId`；最后通过 3 个字节的自增计数器，确保同一秒内产生 `ObjectId` 的唯一性。

`ObjectId` 的这个主键生成策略，很好地解决了在分布式环境下高并发情况主键唯一性问题，值得学习借鉴。

### Source Code Analysis

`MongoDB` 可以通过自身的服务来产生 `ObjectId`，也可以通过客户端的驱动程序来生成 `ObjectId`。

虽然 `ObjectId` 是轻量级的，但如果全部在服务端生成肯定会花费一点开销。所以，能从服务器端转移到客户端驱动程序完成的，就尽量转移到客户端来完成，减少服务器端的开销。

我们来看一下，客户端的驱动程序是如何来生成 `ObjectId` 的。首先下载 [mongo-python-driver](https://github.com/mongodb/mongo-python-driver) 源码。

在源码的`/bson`文件夹中找到`objectid.py`，进行分析。默认构建的 `ObjectId` 代码如下代码所示:

```python
class ObjectId(object):
    """A MongoDB ObjectId."""
    
    _inc = random.randint(0, 0xFFFFFF)
    _inc_lock = threading.Lock()
    _machine_bytes = _machine_bytes()
    __slots__ = ('__id')
    _type_marker = 7
    
    def __init__(self, oid=None):
        """Initialize a new ObjectId.
        An ObjectId is a 12-byte unique identifier consisting of:
            - a 4-byte value representing the seconds since the Unix epoch,
            - a 3-byte machine identifier,
            - a 2-byte process id, and
            - a 3-byte counter, starting with a random value.
            By default, ``ObjectId()`` creates a new unique identifier. The
            optional parameter `oid` can be an :class:`ObjectId`, or any 12
            :class:`bytes` or, in Python 2, any 12-character :class:`str`.
            For example, the 12 bytes b'foo-bar-quux'do not follow the ObjectId
            specification but they are acceptable input::
                >>> ObjectId(b'foo-bar-quux')
                ObjectId('666f6f2d6261722d71757578')
            `oid` can also be a :class:`unicode` or :class:`str` of 24 hex digits::
                >>> ObjectId('0123456789ab0123456789ab')
                ObjectId('0123456789ab0123456789ab')
                >>>
                >>> # A u-prefixed unicode literal:
                >>> ObjectId(u'0123456789ab0123456789ab')
                ObjectId('0123456789ab0123456789ab')
            Raises :class:`~bson.errors.InvalidId` if `oid` is not 12 bytes nor
            24 hex digits, or :class:`TypeError` if `oid` is not an accepted type.
            :Parameters:
                - `oid` (optional): a valid ObjectId.
            .. mongodoc:: objectids"""
            
        if oid is None:
            self.__generate()
        elif isinstance(oid, bytes) and len(oid) == 12:
            self.__id = oid
        else:
            self.__validate(oid)
...
    @classmethod
    def __generate(self):
        """Generate a new value for this ObjectId."""
        # 4 bytes current time
        oid = struct.pack(">i", int(time.time()))
        # 3 bytes machine
        oid += ObjectId._machine_bytes
        # 2 bytes pid
        oid += struct.pack(">H", os.getpid() % 0xFFFF)
        # 3 bytes inc
        with ObjectId._inc_lock:
            oid += struct.pack(">i", ObjectId._inc)[1:4]
            ObjectId._inc = (ObjectId._inc + 1) % 0xFFFFFF
        self.__id = oid
```

- **time**

**`oid = struct.pack(">i", int(time.time()))`**

先通过`time.time()`计算出时间，然后`int()`强制类型转换成整数型，然后调用`struct.pack()`计算得出时间戳。

`struct.pack(fmt, v1, v2, ...)`

按照给定的格式 `fmt`，把数据封装成字符串(实际上是类似于C结构体的字节流)。

有的时候需要用 python 处理二进制数据，比如，存取文件，`socket` 操作时。这时候，可以使用python的`struct`模块来完成，可以用`struct`来处理C语言中的结构体。

```python
import sys  
import struct  
  
a = 20  
b = 400   
str = struct.pack("ii", a, b)  
print 'length: ', len(str)          # length:  8  
print str                           # 乱码：   
print repr(str)                     # '\x14\x00\x00\x00\x90\x01\x00\x00' 
```

**格式符 `i` 表示转换为int，`ii` 表示有两个 int 变量。**

进行转换后的结果长度为8个字节（int类型占用4个字节，两个int为8个字节）。

可以看到输出的结果是乱码，因为结果是二进制数据，所以显示为乱码。

可以使用python的内置函数`repr()`来获取可识别的字符串，其中十六进制的<strong>`0x00000014`</strong>, <strong>`0x00001009`</strong>分别表示<strong>`20`</strong>和<strong>`400`</strong>。


- **machine**

**`oid += ObjectId._machine_bytes`**

根据`ObjectId`类中的`_machine_bytes`属性。而`_machine_bytes = _machine_bytes()`，下面看一下定义的 `_machine_bytes()`函数：

```python
def _machine_bytes():
    """Get the machine portion of an ObjectId."""
    
    machine_hash = hashlib.md5()
    if PY3:
        # gethostname() returns a unicode string in python 3.x
        # while update() requires a byte string.
        machine_hash.update(socket.gethostname().encode())
    else:
        # Calling encode() here will fail with non-ascii hostnames
        machine_hash.update(socket.gethostname())
    return machine_hash.digest()[0:3]
```

根据函数定义的那样，Python 3.x 获得`_machine_bytes`的方式是先通过`socket.gethostname().encode()`获得encode之后的`string`字节流。

之后再通过`machine_hash.update()`更新之后，最后再取前面三个字节`machine_hash.digest()[0:3]`。

- **pid**

**`oid += struct.pack(">H", os.getpid() % 0xFFFF)`**

根据`os.getpid()`获取进程号，之后再通过`struct.pack()`获得两个字节的进程标记符。

- **inc**

```python
with ObjectId._inc_lock:
    oid += struct.pack(">i", ObjectId._inc)[1:4]
    ObjectId._inc = (ObjectId._inc + 1) % 0xFFFFFF
```

**`oid += struct.pack(">i", ObjectId._inc)[1:4]`** 先获得三个字节，之后`ObjectId._inc`自增，它能保证每次得到的值是一个递增并不重复的值。

### Get Timestamp on MongoDB
由于 `ObjectId` 中存储了四个字节的时间戳，所以我们不需要为我们的`Document`保存时间戳字段，我们可以通过`getTimestamp()`函数来获取文档的创建时间（将返回 ISO 格式的文档创建时间）:

```bash
> ObjectId("5349b4ddd2781d08c09890f4").getTimestamp()
ISODate("2014-04-12T21:49:17Z")
```

### ObjectId to String
在某些情况下，我们可能需要将`ObjectId`转换为字符串格式。我们可以使用下面的代码（将返回`Guid`格式的字符串）：

```bash
> new ObjectId().str
5349b4ddd2781d08c09890f3
```

## Operators

所有存储在`MongoDB`集合中的数据都是`BSON`格式。

`BSON` 是一种类`JSON`的一种二进制形式的存储格式，简称 `Binary JSON`。

### Insert()

`MongoDB` 的`save()`和`insert()`函数都可以向`collection`里插入数据，但两者是有两个区别：

- `save()` 函数实际就是根据参数条件，调用了`insert()`或`update()`函数。
  - 如果想插入的数据对象存在，`insert()` 函数会报错，而`save()`函数则是相当于使用`update()`函数，改变原来的对象；
  - 如果想插入的对象不存在, 那么它们执行相同的`insert()`函数插入操作。
    这里可以用几个字来概括它们两的区别，即所谓：<strong>“有则改之,无则加之”</strong>。

- `insert()` 可以一次性插入一个列表，而不用遍历，效率高；`save()`则需要遍历列表，一个个插入。

- 另外，还有 `insertOne()` 和 `insertMany()` 插入方法。还是建议直接使用`insert()`函数。
    - `insertOne()`：向指定集合中插入一条文档数据；
    - `insertMany()`：向指定集合中插入多条文档数据。

```python
data_record = {'attribute1': value1, 'attribute2': value2, 'attribute3': value3}
#  插入单条数据
db.collection.insert(data_record)
db.collection.insert_one(data_record)

#  插入多条数据
✗ db.collection.insert_many(data_record) // 会报错，insert_many()时参数必须为 list 形式

record_list = []
record_list.append(data_record)
db.collection.insert_many(record_list)
```

### Remove()

**`remove(spec, multi=True)`**

1. <strong>`spec`</strong>：查询文档，用于定位需要删除的目标文档。
2. <strong>`multi`</strong>：是否更新多个文档。默认是删除多条符合条件的文档。

**同样，和`insert()`插入操作一样，除了`remove()`删除操作外，还有`delete_one()`以及`delete_many()`（需要注意输入参数的形式，单条记录还是记录列表）。**

```python
db.collection.remove() # 表示删除集合里的所有记录
db.collection.remove({'attribute': value}) # 表删除某属性 attribute=value 的所有记录

id = db.collection.find_one({'attribute': value})['_id']
db.collection.remove(id) # 查找到某属性 attribute=value 的记录，并根据记录的 id 删除该记录
db.collection.drop() # 表示删除整个集合
```

删除文档通常很快，但是如果要清空整个集合，那么使用`drop()`直接删除集合会更快（然后在这个空集合上重建各项索引）。 

如果`Collection`有一些`metadata`，例如 `index`，那么`db.collection.remove()`将删除所有的`Document`，但并不会删除 `index` 信息，而 `drop()` 则会删除掉这些 `metadata`。

### Update()

**`update(spec, doucument, upsert=False, multi=False)`**

1. <strong>`spec`</strong>：查询文档，用于定位需要更新的目标文档。
2. <strong>`document`</strong>：修改器文档，用于说明要对找到的文档进行哪些修改。
3. <strong>`upsert`</strong>：如目标记录不存在，是否插入新文档。
4. <strong>`multi`</strong>：<strong>是否更新多个文档。默认是只会修改第一条发现的文档，如果你要修改多条符合条件的文档，则需要设置参数`multi=true`。</strong>

**同样，和`insert()`插入操作一样，除了`update()`更新操作外，还有`replace_one()`、`update_one()`以及`update_many()`（需要注意输入参数的形式，单条记录还是记录列表）。**

#### Fields

| Name    | Description                              |
| ------- | ---------------------------------------- |
| $inc    | Increments the value of the field by the specified amount. |
| $mul    | Multiplies the value of the field by the specified amount. |
| $min    | Only updates the field if the specified value is less than the existing field value. |
| $max    | Only updates the field if the specified value is greater than the existing field value. |
| $set    | Sets the value of a field in a document. |
| $unset  | Removes the specified field from a document. |
| $rename | Renames a field.                         |

- **`$inc`**

<strong>`$inc`</strong>表示对原来的记录中的指定属性进行自增或自减：

例如，存在这样的条数据`{'_id': 1, 'attribute1': 8, 'attribute2': 6}`，对其进行<strong>`$inc`</strong>更新操作：

```python
db.collection.update({'_id': 1}, {'$inc': {'attribute1': -2, 'attribute2': 3}})
```

更新后的数据为`{'_id': 1, 'attribute1': 6, 'attribute2': 9}`。

- **`$mul`**

<strong>`$mul`</strong>表示对原来的记录中的指定属性的值乘以给定的数值，分为以下几种情况：

例如，存在这样的三条数据：

1. `{'_id': 1, 'item': 'ABC', 'price': 10.99}`
2. `{'_id': 2, 'item': 'Unknown'}`
3. `{'_id': 3, 'item': 'XYZ', 'price': NumberLong(10)}`

◎ **Multiply the Value of a Field**

```python
db.collection.update({'_id': 1}, {'$mul': {price: 1.25}})
```
更新后的数据 1 为`{'_id': 1, 'item': 'ABC', 'price': 13.7375}`。

◎ **Apply `$mul` Operator to a Non-existing Field**

```python
db.collection.update({'_id': 2}, {'$mul': {'price': NumberLong(100)}})
```
更新后的数据 2 为`{'_id': 2, 'item': 'Unknown', 'price': NumberLong(0)}`。

◎ **Multiply Mixed Numeric Types**

```python
db.collection.update({'_id': 3}, {'$mul': {'price': NumberInt(5)}})
```
更新后的数据 3 为`{'_id': 3, 'item' : 'XYZ', 'price': NumberLong(50)}`。

- **`$min`** & **`$max`**

<strong>`$min`</strong>表示将原来记录中指定属性的值与给定的数值进行比较，属性的新值选择两者之间更小的值，之后更新新记录至数据库。
<strong>`$max`</strong>表示将原来记录中指定属性的值与给定的数值进行比较，属性的新值选择两者之间更大的值，之后更新新记录至数据库。

例如，存在这样的条数据`{'_id': 1, 'highScore': 800, 'lowScore': 200}`，对其进行<strong>`$min`</strong>以及<strong>`$max`</strong>更新操作：

```python
db.collection.update({'_id': 1}, {'$min': {'lowScore': 50}, '$max': {'highSoce': 750}})
```

更新之后的数据为`{'_id': 1, 'highScore': 800, 'lowScore': 50}`。

- **`$set`** & **`$unSet`**

```python
db.collection.update({'attribute1': value1, 'attribute2': value2}, \
                    {'$set': {'attribute1': new_value1}, '$set': {'attribute2': new_value2}}, multi=True)
db.collection.update({'attribute1': value1}, {'$unset': {'attribute2': value2}}, multi=True)
```

其中，<strong>`$set`</strong>表示对原来的记录进行修改，<strong>`$unset`</strong>表示移除指定属性。

**注意，使用 `'$set': {'attribute1': new_value1}` 只会对 `attribute1` 的部分进行修改，如果使用 `db.collection.update({'attribute1': value1}, {'attribute1': new_value1})`，即不使用 `$set`，则会将整个 `Document` 记录替换成 `{'attribute1': new_value1}`。**

- **`$rename`**

<strong>`$rename`</strong>表示对原来的记录中的指定属性的 **key** 值进行修改：

例如，存在这样的数据`{'_id': 1, 'nmae': {'first': 'george', 'last': 'washington'}}`，对其进行<strong>`$rename`</strong>更新操作，分为以下几种情况：
​    
◎ **Rename a Field**

```python
db.collection.update({'_id': 1}, {'$rename': {'nmae': 'name'}})
```
更新后的数据为`{'_id': 1, 'name': {'first': 'george', 'last': 'washington'}}`。

◎ **Rename a Field in an Embedded Document**

```python
db.collection.update({'_id': 1}, {'$rename': {'name.first': 'name.fname'}})
```
更新后的数据为`{'_id': 1, 'name': {'fname': 'george', 'last': 'washington'}}`。
​    
◎ **Rename a Field That Does Not Exist**

```python
db.collection.update({'_id': 1}, {'$rename': {'job': 'student'}})
```

因为不存在该字段，所以并不会进行修改，更新后的数据仍为`{'_id': 1, 'name': {'fname': 'george', 'last': 'washington'}}`。

#### Array

| Name      | Description                                                                                      |
|-----------|--------------------------------------------------------------------------------------------------|
| $addToSet | Adds elements to an array only if they do not already exist in the set.                          |
| $push     | Adds an item to an array.                                                                        |
| $pushAll  | Deprecated. Adds several items to an array.                                                      |
| $pop      | Removes the first or last item of an array.                                                      |
| $pull     | Removes all array elements that match a specified query.                                         |
| $pullAll  | Removes all matching values from an array.                                                       |
| $each     | Modifies the $push and $addToSet operators to append multiple items for array updates. |
| $position | Modifies the $push operator to specify the position in the array to add elements.      |
| $slice    | Modifies the $push operator to limit the size of updated arrays.                       |
| $sort     | Modifies the $push operator to reorder documents stored in an array.                   |

- **`$addToSet`**

<strong>`$addToSet`</strong>表示添加给定的字段到原来的记录中。

```python
db.collection.update({'attribute1': value1, 'attribute2': value2}, \
                    {'$addToSet': {'attribute3': value3}}, multi=True)
db.collection.update
                    
```

<strong>`$addToSet`</strong>和<strong>`$push`</strong>类似，不过仅在该元素不存在时才添加，相当于将`array`当成`set`来执行`set.add(item)`操作。

- **`$push`** & **`pushAll`**
    - <strong>`push`</strong>：在`Document`记录中末尾添加一项，相当于`list.append(item)`。
    - <strong>`pushAll`</strong>：在`Document`记录中末尾添加多项，相当于`list=list + another_list`。

```python
db.collection.update({'attribute1': value1}, {'$push': {'attribute2': value2}}, multi=True)
db.collection.update({'attribute1': value1}, {'$pushAll': {'attribute2': value2}}, multi=True)
```

- **`$pop`**

<strong>`$pop`</strong>表示按照`index`位置下标移除元素。

例如，存在这样的数据`{'_id': 1, 'attribute1': [1, 2, 3, 4, 5, 6, 7, 2, 3]}`，对其进行<strong>`$pop`</strong>更新操作：

```python
db.collection.update({'_id': 1}, {'$pop': {'attribute1': 1}}) # 移除最后一个元素
# 此刻字段显示：{'_id': 1, 'attribute1': [1, 2, 3, 4, 5, 6, 7, 2]}

db.collection.update({'_id': 1}, {'$pop':{'attribute1': -1}}) # 移除第一个元素
# 此刻字段显示：{'_id': 1, 'attribute1': [2, 3, 4, 5, 6, 7, 2]}
```

- **`$pull`** & **`$pullAll`**

<strong>`$pull`</strong>表示按值移除元素，<strong>`$pullAll`</strong>表示移除所有符合条件的元素。

例如，存在这样的数据`{'_id': 1, 'attribute1': [2, 3, 4, 5, 6, 7, 2]}`，对其进行<strong>`$pull`</strong>以及<strong>`$pullAll`</strong>更新操作：

```python
db.collection..update({'_id': 1}, {'$pull':{'attribute1': 2}}) # 移除全部 2
# 此刻字段显示：{'_id': 1, 'attribute1': [3, 4, 5, 6, 7]}

db.collection.update({'_id': 1}, {'$pullAll':{'attribute1': [3, 5, 6]}}) # 移除 3, 5, 6
# 此刻字段显示：{'_id': 1, 'attribute1': [4, 7]}
```

- **`$each`**

<strong>`$each`</strong>表示添加多个元素，相当于加强版的<strong>`$addToSet`</strong>或者<strong>`$push`</strong>操作（添加多个记录）。

```python
# Use $each with $addToSet Operator
db.collection.update({'_id': 1}, {'$addToSet': {'attribute1': {'$each': [1, 2, 3, 4]}}})

# Use each with $push Operator
db.collection.update({'_id': 1}, {'$push': {'attribute1': {'$each': [1, 2, 3, 4]}}})
```

- **`$position`**

<strong>`$position`</strong>可以看作是指定插入位置的<strong>`$push`</strong>操作。

例如，存在这样的条数据`{'_id': 1, 'scores': [100]}`，对其进行<strong>`$position`</strong>更新操作：

```python
db.collection.update({'_id': 1}, {'$push': {'attribute1': {'$each': [50, 60, 70]}, '$position': 0}})
# 此刻字段显示：{'_id': 1, 'attribute1': [50, 60, 70, 100]}

db.collection.update({'_id': 1}, {'$push': {'attribute1': {'$each': [20, 30]}, '$position': 2}})
# 此刻字段显示：{'_id': 1, 'attribute1': [50, 60, 20, 30, 70, 100]}
```

- **`$slice`**

<strong>`$slice`</strong>可以看作是进行<strong>`$push`</strong>操作之后再进行一次切片操作。

例如，存在这样的几条数据：

1. `{'_id': 2, 'scores': [89, 90]}`
2. `{'_id': 1, 'scores': [40, 50, 60]}`
3. `{'_id': 3, 'scores': [89, 70, 100, 20]}`

◎ Slice from the Front of the Array

```python
db.collection.update({'_id': 1}, {'$push': {'scores': {'$each': [100, 20]}, '$slice': 3}})
```
更新后的数据 1 为`{'_id': 1, 'scores': [89, 90, 100]}`。

◎ Slice from the End of the Array

```python
db.collection.update({'_id': 2}, {'$push': {'scores': {'$each': [80, 78, 86]}, '$slice': -5}})
```
更新后的数据 2 为`{'_id': 2, 'scores': [50, 60, 80, 78, 86]}`。

◎ Update Array Using Slice Only

```python
db.collection.update({'_id': 3}, {'$push': {'scores': {'$each': []}, '$slice': -3}})
```
更新后的数据 3 为`{'_id': 3, 'scores': [70, 100, 20]}`。

- **`$sort`**

<strong>`$sort`</strong>可以看作是<strong>`$push`</strong>操作之后再进行一次排序操作。

例如，存在这样的几条数据：

1. `{'_id': 1, 'quizzes': [{'id': 1, 'score': 6}, {'id': 2, 'score': 9}]}`
2. `{'_id': 2, 'tests': [89, 70, 89, 50] }`

◎ Sort Array of Documents by a Field in the Documents

```python
db.collection.update({'_id': 1}, {'$push': {'quizzes': {'$each': [{id': 3, 'score': 8},	\
                    {'id': 4, 'score': 7}, {'id': 5, 'score': 6}], '$sort': {'score': 1}}})
```
更新后的数据 1 为`{'_id': 1, 'quizzes': [{'id': 1, 'score': 6}, {'id': 5, 'score': 6}, {'id': 4, 'score': 7}, {'id': 3, 'score': 8}, {'id': 2, 'score': 9}]}`。

◎ Sort Array Elements That Are Not Documents

```python
db.collection.update({'_id': 2}, {'$push': {'tests': {'$each': [40, 60], '$sort': 1}}})
)

```

- Use **`$push`** Operator with Multiple Modifiers

例如，存在这样一条数据`{'_id': 1, 'quizzes': [{'wk': 1, 'score': 10}, {'wk': 2, 'score': 8}, {'wk': 3, 'score': 5}, {'wk': 4, 'score': 6}]}`，对其进行<strong>`$push`</strong>以及各种 Modifiers （<strong>`$each`</strong>、<strong>`$slice`</strong>、<strong>`$sort`</strong>以及<strong>`$position`</strong>）更新操作：

```python
db.collection.update({'_id': 4}, {'$push': {'quizzes': {'$each': [{'wk': 5, 'score': 8},	\
                    {'wk': 6, 'score': 7}, {'wk': 7, 'score': 6}],	\
                    '$sort': {'score': -1}, '$slice': 3}})
```
更新后的数据为`{'_id': 1, 'quizzes':[{'wk': 1, 'score': 10}, {'wk': 2, 'score': 8}, {'wk': 5, 'score': 8}}`。

最终目的就是取得分数前三的数据信息，关于<strong>`$each`</strong>、<strong>`$sort`</strong>以及<strong>`$slice`</strong>执行的前后顺序与代码中的顺序无关，其实依照下表优先级：

1. Update array to add elements in the correct position.
2. Apply sort, if specified.
3. Slice the array, if specified.
4. Store the array.

### Find()

**`find(filter, projection,skip=0, limit=0, sort=None)`**

1. <strong>`filter`</strong>：过滤器，用于定位需要更新的目标文档。
2. <strong>`projection`</strong>： 指定返回记录的属性信息。
3. <strong>`skip`</strong>： 跳过指定数量的记录。
4. <strong>`limit`</strong>：指定读取的记录数量。
5. <strong>`sort`</strong>：排序参数。

同样地，和 `insert()` 插入操作一样，除了 `find()` 查询操作之外，还有的 `find_one()`、`find_and_modify()` 等等。

- **`projection`**

```python
# 如果不指定，是默认显示所有字段（包括 _id ）
for item in db.colleciton.find({}, {'_id': 0, 'attribute1': 1, 'attribute2': 1}): print item
```

这里的`projection`就是`{'_id': 0, 'attribute1': 1, 'attribute2': 1}`，表示只显示集合中的所有记录的`attribute1`、`attribute2`属性值，`_id: 0`表示一般忽略不显示`_id`的值，`'attribute': 1`表示显示该字段。

#### Comparison

数据库的查询基本是通过`find()`函数进行查询，其中大于、大于等于、小于、小于等于这些关系运算符经常要用到，分别用`$gt`、`$gte`、`$lt`、`$lte`表示。

| Name | Description                              |
| ---- | ---------------------------------------- |
| $ne  | Matches all values that are not equal to a specified value. |
| $gt  | Matches values that are greater than a specified value. |
| $gte | Matches values that are greater than or equal to a specified value. |
| $lt  | Matches values that are less than a specified value. |
| $lte | Matches values that are less than or equal to a specified value. |
| $in  | Matches any of the values specified in an array. |
| $nin | Matches none of the values specified in an array. |

- **`$ne`**

```python
db.collection.find({'attribute': value}) # 查找符合某属性 attribute 等于 value 的所有记录，查不到时返回 None
db.collection.find({'attribute': {"$ne": 73}}) # 查找符合某属性 attribute 的值不等于 73 的所有记录，查不到时返回 None
# 显示集合中所有 attribute 等于 21 的记录的 attribute1、attribute2 属性值
for item in db.collection.find({'attribute2': 21}, {'_id': 0, 'attribute1': 1, 'attribute2': 1}): print item
```

- **`$gt` & `$gte` & `$lt` & `$lte`**

```python
db.collection.find({'attribute': {"$lt": 15}}) # 查找符合某属性 attribute 的值小于 15 的所有记录，查不到时返回 None

# 查找符合属性 attribute1 大于等于 12 小于等于 15，并且 attribute2 等于value 的所有记录，查不到时返回 None
for item in db.colleciton.find({'attribute1': {'$gte': 12, '$lte': 15}, 'attribute2': value}): print item
```

- **`$in` & `$nin`**

```python
# 查找符合属性 attribute 等于 (23, 26, 32) 的所有记录，查不到时返回 None
for item in db.collection.find({'attribute': {'$in': (23, 26, 32)}}): print item 

# 查找符合属性 attribute 不等于 (23, 26, 32) 的所有记录，查不到时返回 None
for item in db.collection.find({'attribute': {'$nin': (23, 26, 32)}}): print item 
    
# IN 与 查询制定字段结合
for item in db.collection.find({'attribute': {'$in': (value1, value2)}}, {'_id': 0, 'attribute': 1})
```

#### Logical

| Name | Description                              |
| ---- | ---------------------------------------- |
| $and | Joins query clauses with a logical AND returns all documents that match the conditions of both clause. |
| $not | Inverts the effect of a query expression and returns documents that do not match the query expression. |
| $nor | Joins query clauses with a logical NOR returns all documents that fail to match both clauses. |
| $or  | Joins query clauses with a logical OR returns all documents that match the conditions of either clause. |

- **`$or`**

```python
for item in db.collection.find({"$or":[{"age":25}, {"age":28}]}): print item
for item in db.collection.find({"$or":[{"age":{"$lte":23}}, {"age":{"$gte":33}}]}): print item

# OR 与 查询制定字段结合
for item in db.collection.find({'$or': [{'attribute': value1}, {'attribute': value2}]}, {'_id': 0, 'attribute': 1})
```

#### Element

| Name    | Description                              |
| ------- | ---------------------------------------- |
| $exists | Matches documents that have the specified field. |
| $type   | Selects documents if a field is of the specified type. |

- **`$exists`**

```python
# 查找存在属性 attribute 的所有记录
db.collection.find({'attribute': {'$exists':True}})
    
# 查找不存在属性 attribute 的所有记录 
db.collection.find({'attribute': {'$exists':False}})
```

- **`$type`**

```python
# 查询属性 attribute 其数据类型为指定 type 的所有记录
for item in db.collection.find({'attribute': {'$type':1}}): print item # 查询数字类型的
for item in db.collection.find({'attribute': {'$type':2}}): print item # 查询字符串类型的
```

各种类型值的代表值:

|      Condition A       |  Condition B  | Condition C | Condition D |   Condition E   |
| :--------------------: | :-----------: | :---------: | :---------: | :-------------: |
|       Double = 1       |  String = 2   | Object = 3  |  Array = 4  | Binary data = 5 |
| Undefined = 6(Abandon) | Object Id = 7 | Boolean = 8 |  Date = 9   |    Null = 10    |

#### Array

| Name                                     | Description                              |
| ---------------------------------------- | ---------------------------------------- |
| $all                                     | Matches arrays that contain all elements specified in the query. |
| $elemMatch | Selects documents if element in the array field matches all the specified conditions. |                                          |
| $size                                    | Selects documents if the array field is a specified size. |

- **`$all`**

```python
# 查找存在属性 attribute 包含全部条件的所有记录 
for item in db.collection.find({'attribute': {'$all': (23, 26, 32)}}): print item
```
**注意和`$in`的区别。`$in`是检查目标属性值是条件表达式中的一员，而`$all`则要求属性值包含全部条件元素。**

- **`$elemMatch`**

```python
# 查询属性 attribute 其数组元素数量为指定 size 的所有记录
for item in db.collection.find({'attribute': {'$size': 3}}, {'_id': 0}): print item
```

- **`$size`**

```python
# 查询属性 attribute 其数组元素数量为指定 size 的所有记录
for item in db.collection.find({'attribute': {'$size': 3}}, {'_id': 0}): print item
```


- **`$regex`**

正则表达式查询：

```python
# 查询属性 attribute 满足指定正则表达式，即其值为 'value1', 'value3', 'value5' 的所有记录
for item in db.collection.find({'attribute': {'$regex' : r'(?i)value[135]'}}, {'_id': 0, 'attribute': 1}): 
    print item 
```


- **`count()`**

```python
# 计数
print(db.collection.find().count()) 
print(db.collection.find({'attribute': {'$gt':30}}).count()) 
```

- **`sort()`**

对记录进行排序，用`sort()`函数，形如`find().sort([('attribute',1/-1)])`表示按某属性`attribute`的<strong>升序/降序</strong>排列：

```python
pymongo.ASCENDING # 表按升序排列，也可以用 1 来代替
pymongo.DESCENDING #表按降序排列， 也可以用 -1 来代替
    
for item in db.collection.find().sort([('attribute', pymongo.ASCENDING)]): print item
for item in db.collection.find().sort([('attribute', pymongo.DESCENDING)]): print item
    
for item in db.collection.find().sort([('attribute1', pymongo.ASCENDING), ('attribute2', pymongo.DESCENDING)]): 
    print item 
    
for item in db.collection.find(sort = [('attribute1', pymongo.ASCENDING), ('attribute2', pymongo.DESCENDING)]): 
    print item
```

- **指定字段条件查找 + 排序 + 指定字段显示**

```python
for item in db.collection.find({'attribute1': value}, {'_id': 0, 'attribute1': 1, 'attribute2': 1}) \
                            .sort([('attribute1', 1), ('attribute2', -1)]):  print item
```

**可能会出现`OperationFailed: Sort operation used more than the maximum bytes of RAM. Add an index, or specify a smaller limit.`的错误，需要在后面添加一个`limit()`函数：**

```python	
for item in db.collection.find({'attribute1': value}, {'_id': 0, 'attribute1': 1, 'attribute2': 1}) \
                            .sort([('attribute1', 1), ('attribute2', -1)]).limit(100):  print item
```

**比如，我们要做一个排行榜功能，需要在某`collection`中查找分数最多的 100 名玩家。**

- **`skip()` & `limit()`**

从第几行开始读取`skip()`，读取多少行`limit()`：

```python
# 从第2行开始读取，读取3行记录
for item in db.collection.find().skip(2).limit(3): print item
for item in db.collection.find(skip=2, limit=3): print item
for item in db.collection.find({}, {'_id': 0, 'attribute1': 1}, skip=2, limit=3): print item
```

**`skip()`和`limit()`结合就能实现分页，当查询时同时使用`sort()`、`skip()`以及`limit()`，无论位置先后，最先执行顺序先`sort()`再`skip()`最后`limit()`。**

# Chapter 3: Common MongoDB and Python Patterns
