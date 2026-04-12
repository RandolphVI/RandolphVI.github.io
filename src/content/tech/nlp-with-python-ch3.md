---
title: "NLP with Python — Chapter 3"
date: 2015-09-17
category: "ML-AI"
tags: ["NLP", "Python"]
description: "- The NLP Pipeline"
draft: false
---

![](https://farm5.staticflickr.com/4423/36425940061_fe957aaf15_o.jpg)

有关该书的其他学习笔记系列：[Book:「NLP with Python」](http://randolph.pro/categories/Books/Book-「NLP-with-Python」/)

# Related

- **The NLP Pipeline**
- **Basic Operations with Strings**
- **Regular Expressions for Detecting Word Patterns**
- **Finding Word Stems**
- **Searching Tokenized Text**
- **Normalizing Text**
- **Word Segmentation**
- **Formatting: From Lists to Strings**

---

# Key:

## The NLP Pipeline

NLP 的处理流程：我们打开一个 URL 代码读取里面 HTML 格式的内容，去除标记，并选择字符的切片，然后分词，是否转换为 **`nltk.Text`** 对象是可选择的。我们也可以将所有词汇小写并提取成词汇表（Vocab）。

![](https://farm1.staticflickr.com/645/30825223223_8abc614f13_o.png)

---

## Basic Operations with Strings

有时候字符串跨好几行。Python 提供了多种方式表示它们。在下面的例子中，一个包含两个字符串的序列被连接为一个字符串。我们需要使用  **反斜杠**  或者  **括号**，这样解释器就知道第一行的表达式不完整了。

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` >>> couplet = "Shall I compare thee to a Summer's day?"\ ...           "Thou are more lovely and more temperate:" >>> print(couplet) Shall I compare thee to a Summer's day?Thou are more lovely and more temperate: >>> couplet = ("Rough winds do shake the darling buds of May," ...           "And Summer's lease hath all too short a date:") >>> print(couplet) Rough winds do shake the darling buds of May,And Summer's lease hath all too short a date: ``` |

不幸的是，这些方法并没有展现给我们十四行诗中两行之间的换行。为此，我们可以使用如下所示的三重引号的字符串。

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 ``` | ``` >>> couplet = """Shall I compare thee to a Summer's day? ...           Thou are more lovely and more temperate:""" >>> print(couplet) Shall I compare thee to a Summer's day? Thou are more lovely and more temperate: >>> couplet = '''Rough winds do shake the darling buds of May, ...           And Summer's lease hath all too short a date:''' >>> print(couplet) Rough winds do shake the darling buds of May, And Summer's lease hath all too short a date: ``` |


---

## Regular Expressions for Detecting Word Patterns

正则表达式基本元字符，其中包括通配符、范围和闭包：

| Operator | Behavior |
| --- | --- |
| . | Wildcard, matches any character |
| ^abc | Matches some pattern abc at the start of a string |
| abc$ | Matches some pattern abc at the end of a string |
| [abc] | Matches one of a set of characters |
| [A-Z0-9] | Matches one of a range of characters |
| ed/ing/s | Matches one of the specified strings (disjunction) |
| \* | Zero or more of previous item, e.g.,a*,[a-z]*(also known as Kleene Closure) |
| + | One or more of previous item, e.g.,a+,[a-z]+ |
| ? | Zero or one of the previous item (i.e., optional), e.g.,a?,[a-z]? |
| {n} | Exactly n repeats where n is a non-negative integer |
| {n,} | At least n repeats |
| {,n} | No more than n repeats |
| {m,n} | At least m and no more than n repeats |
| a(b/c)+ | Parentheses that indicate the scope of the operators |

- 正则表达式是用来指定模式的一种强大而灵活的方法。只要导入了 **`re`** 模块，就可以使用 **`re.findall()`** 找到一个字符串中匹配一个模式的所有子字符串。
- 如果正则表达式字符串包含反斜杠，应该使用原始字符串与 r 前缀：**`r'regexp'`**，告诉 Python 不要预处理这个字符串。

---

## Finding Word Stems

书中提到的，抽出一个词的词干的方法，是直接去掉任何看起来像后缀的字符。听起来很棒，但是仍然存在一个问题。比如这个词 **processes**：

|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` >>> re.findall(r'^(.*)(ing|ly|ed|ious|ies|ive|es|s|ment)$', 'processes') [('processe', 's')] ``` |

正则表达式错误的找到了后缀 `'-s'`，而不是后缀 `'-es'`。这表明另一个微妙之处：

**`*`** 操作符是“贪婪的”，所以表达式的 **`.*`** 部分试图尽可能多地匹配输入的字符串。如果使用“非贪婪”版本的 **`*`** 操作符，写成 **`*?`** 操作符，就得到想要的结果。

|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` >>> re.findall(r'^(.*?)(ing|ly|ed|ious|ies|ive|es|s|ment)$', 'processes') [('process', 'es')] ``` |

还可以通过将第二个括号中的内容变成可选来得到空后缀。  

|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` >>> re.findall(r'^(.*?)(ing|ly|ed|ious|ies|ive|es|s|ment)$', 'language') [('language', '')] ``` |

（虽然以上方法还有许多问题…）

---

## Searching Tokenized Text

可以使用一种特殊的正则表达式搜索一个文本中多个词。例如，在大型文本语料库中搜索 `'x and other ys'` 形式的表达式来发现上位词。

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` >>> from nltk.corpus import brown >>> hobbies_learned = nltk.Text(brown.words(categories=['hobbies', 'learned'])) >>> hobbies_learned.findall(r'<\w*> <and> <other> <\w*s>') speed and other activities; water and other liquids; tomb and other landmarks; Statues and other monuments; pearls and other jewels; charts and other items; roads and other features; figures and other objects; military and other areas; demands and other factors; abstracts and other compilations; iron and other metals ``` |


---

## Normalizing Text

### Stemmers

**词干提取器**。`NLTK` 中包括了一些现成的词干提取器，如果需要使用词干提取器，应该优先使用它们中的一个，而不是使用正则表达式制作自己的词干提取器，因为 `NLTK` 中的词干提取器能处理的不规则情况很广泛。**Porter** 和 **Lancaster** 词干提取器按照它们自己的规则剥离词缀。下面的例子表明 **Porter** 词干提取器正确处理了词 **lying**（将它映射为 **lie**），而 **Lancaster** 词干提取器并没有处理好。

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 ``` | ``` >>> porter = nltk.PorterStemmer() >>> lancaster = nltk.LancasterStemmer() >>> [porter.stem(t) for t in tokens] ['DENNI', ':', 'Listen', ',', 'strang', 'women', 'lie', 'in', 'pond', 'distribut', 'sword', 'is', 'no', 'basi', 'for', 'a', 'system', 'of', 'govern', '.', 'Suprem', 'execut', 'power', 'deriv', 'from', 'a', 'mandat', 'from', 'the', 'mass', ',', 'not', 'from', 'some', 'farcic', 'aquat', 'ceremoni', '.'] >>> [lancaster.stem(t) for t in tokens] ['den', ':', 'list', ',', 'strange', 'wom', 'lying', 'in', 'pond', 'distribut', 'sword', 'is', 'no', 'bas', 'for', 'a', 'system', 'of', 'govern', '.', 'suprem', 'execut', 'pow', 'der', 'from', 'a', 'mand', 'from', 'the', 'mass', ',', 'not', 'from', 'som', 'farc', 'aqu', 'ceremony', '.'] ``` |

词干提取过程没有明确定义，通常选择最合适应用的词干提取器。

书本上的例子不错，使用词干提取器索引文本：

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 ``` | ``` class IndexedText(object):      def __init__(self, stemmer, text):         self._text = text         self._stemmer = stemmer         self._index = nltk.Index((self._stem(word), i)                                 for (i, word) in enumerate(text))      def concordance(self, word, width=40):         key = self._stem(word)         wc = int(width/4)                # words of context         for i in self._index[key]:             lcontext = ''.join(self._text[i-wc:i])             rcontext = ' '.join(self._text[i:i+wc])             ldisplay = '{:>{width}}'.format(lcontext[-width:], width=width)             rdisplay = '{:{width}}'.format(rcontext[:width], width=width)             print(ldisplay, rdisplay)      def _stem(self, word):         return self._stemmer.stem(word).lower() ``` |


|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 ``` | ``` >>> porter = nltk.PorterStemmer() >>> grail = nltk.corpus.webtext.words('grail.txt') >>> text = IndexedText(porter, grail) >>> text.concordance('lie') r king ! DENNIS : Listen , strange women lying in ponds distributing swords is no  beat a very brave retreat . ROBIN : All lies ! MINSTREL : [singing] Bravest of        Nay . Nay . Come . Come . You may lie here . Oh , but you are wounded ! doctors immediately ! No , no , please ! Lie down . [clap clap] PIGLET : Well ere is much danger , for beyond the cave lies the Gorge of Eternal Peril , which    you . Oh ... TIM : To the north there lies a cave -- the cave of Caerbannog -- h it and lived ! Bones of full fifty men lie strewn about its lair . So , brave k not stop our fight ' til each one of you lies dead , and the Holy Grail returns t ``` |


---

## Formatting: From Lists to Strings

### from Lists to Strings

从链表到字符串。用于文本处理最简单的结构化对象是词链表。当需要把这些输出到显示器或者文件中时，必须把这些词的链表转换成字符串。在 Python 中，使用 **`join()`** 方法，并制定作为“胶水”使用的字符串。

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` >>> silly = ['We', 'called', 'him', 'Tortoise', 'because', 'he', 'taught', 'us', '.'] >>> ''.join(silly) 'We called him Tortoise because he taught us .' >>> ';'.join(silly) 'We;called;him;Tortoise;because;he;taught;us;.' >>> ''.join(silly) 'WecalledhimTortoisebecausehetaughtus.' ``` |

- 书本提到了  **间接地提供占位符的值**。例子：

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` >>> template = 'Lee wants a %s right now' >>> menu = ['sandwich', 'spam fritter', 'pancake'] >>> for snack in menu: ...     print (template.format(snack)) ... Lee wants a sandwich right now Lee wants a spam fritter right now Lee wants a pancake right now ``` |


---

# Need to Know:

在 Python 2.x 当中是可以使用：

|  |  |
| --- | --- |
| ``` 1 ``` | ``` from urllib import urlopen ``` |

如果使用的是 Python 3.x 的话，需要更改为：

|  |  |
| --- | --- |
| ``` 1 ``` | ``` from urllib.request import urlopen ``` |


---

在「处理 HTML」的模块中：

书本提到从 HTML 中提取文本，采用辅助函数 **`nltk.clean_html()`** 将 HTML 字符串作为参数，返回原始文本。

然而，现在这个辅助函数已不支持。为了实现这一目的，我们可以下载 **`Beautiful Soup 4`**。

|  |  |
| --- | --- |
| ``` 1 ``` | ``` $ pip3 install beautifulsoup4 ``` |

随后在代码部分中，调用 BeautifulSoup：  

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` import nltk, re, pprint from urllib.request import urlopen from bs4 import *  url = 'http://youraddress' html = urlopen(url).read() soup = BeautifulSoup(html) raw = soup.get_text() tokens = nltk.word_tokenize(raw) ``` |

---

在「分词」的模块中：

> Now the segmentation task becomes a search problem: find the bit string that causes the text string to be correctly segmented into words.  
> 现在分词的任务变成一个搜索问题：找到能将文本字符串正确地分割成词汇的字位串。
>
> **We assume the learner is acquiring words and storing them in an internal lexicon. Given a suitable lexicon, it is possible to reconstruct the source text as a sequence of lexical items.**  
> 假定学习者接受字词，并将它们存储在一个内部的词典当中。给定一个合适的词典，我们是能够使用词典中的词的序列来进行重构文本的。
>
> Following (Brent & Cart- wright, 1995), we can define an **objective function**, a scoring function whose value we will try to optimize, based on the size of the lexicon and the amount of information needed to reconstruct the source text from the lexicon.  
> 为了衡量我们这个词典的优劣，这里我们需要定义一个目标函数（Brent & Cart-wright 在 1995 提出的方法），即一个打分函数，依据两个因素，第一个因素是词典的大小，第二个是使用词典来重构原文本所需的信息量。

![](https://farm1.staticflickr.com/767/31488720242_48aae8823f_o.png)

计算目标函数：给定一个假设的源文本的分词（左），推导出一个词典和推导表，它能让源文本重构，然后合计每个词项（包括边界标志）与推导表的字符数，作为分词质量的得分；得分值越小表明分词越好。

用代码来实现这个目标函数，计算存储词典和重构源文本的成本：

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` def evaluate(text, segs):     words = segment(text, segs)     text_size = len(words)     lexicon_size = len(''.join(list(set(words))))     return text_size + lexicon_size ``` |


|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 ``` | ``` >>> text = 'doyouseethekittyseethedoggydoyoulikethekittylikethedoggy' >>> seg1 = '0000000000000001000000000010000000000000000100000000000' >>> seg2 = '0100100100100001001001000010100100010010000100010010000' >>> seg3 = '0000100100000011001000000110000100010000001100010000001' >>> segment(text, seg3) ['doyou', 'see', 'thekitt', 'y', 'see', 'thedogg', 'y', 'doyou', 'like',  'thekitt', 'y', 'like', 'thedogg', 'y'] >>> evaluate(text, seg3) 46 >>> evaluate(text, seg2) 47 >>> evaluate(text, seg1) 63 ``` |


---

## Simulated Annealing (SA)

**模拟退火算法** 。在提到模拟退火算法之前，我来先介绍一下 **爬山算法（Hill Climbing）**。爬山算法是一种简单的贪心搜索算法，该算法每次从当前的临近解空间中选择一个最优解作为当前解，直到达到一个局部最优解。

爬山算法实现很简单，其主要的缺点就是会陷入局部最优解而不一定能搜索到全局最优解。如图所示，假设 C 点为当前解，爬山算法搜索到 A 点这个局部最优解就会停止搜索，因为 A 点无论向哪个方向小幅度移动都不能得到更优的解。

![](https://farm1.staticflickr.com/768/31263141960_9e2f2a7c44_o.png)

爬山算法是完完全全的贪心算法，每一次都是鼠目寸光地选择一个当前最优解，因此只能搜索到局部的最有值。模拟退火其实也是一种贪心算法，但是它的搜索过程引入了随机因素。模拟退火算法  **以一定的概率**  来接受一个比当前解要差的解，因此  **有可能**  会跳出这个局部的最优解，达到全局的最优解。如上图为例，模拟退火算法在搜索到局部最优解 A 后，会以  **一定的概率**  接受向 E 的移动。也许经过几次这样的不是局部最优的移动后会到达 D 点，于是就跳出了局部最大值 A。

模拟退火算法描述：

- 若 $ J(Y(i+1)) \geqslant J(Y(i)) $ (即移动后得到更优解)，则总是接受该移动
- 若 $ J(Y(i+1)) < J(Y(i)) $ (即移动后的解比当前解要差)，则以一定的概率接受移动，而且这个概率随着时间推移逐渐降低（逐渐降低才能趋向稳定）

**这里的“一定的概率”的计算参考了金属冶炼的退火过程，这也是模拟退火算法名称的由来。**

根据热力学的原理，在温度为 ***T*** 时，出现能量差为 ***dE*** 的降温的概率为 ***P(dE)***，表示为：

其中 ***k*** 是一个常数，***exp*** 表示自然指数，且 ***dE<0***。这条公式说白了就是：温度越高，出现一次能量差为 ***dE*** 的降温的概率就越大；温度越低，则出现降温的概率就越小。又由于 ***dE*** 总是小于 0（否则就不叫退火了），因此 ***dE/kT < 0***，所以 ***P(dE)*** 的函数取值范围是 $(0,1)$ 。

　　随着温度 ***T*** 的降低，***P(dE)*** 会逐渐降低。

我们将一次向较差解的移动看做一次温度跳变过程，我们以概率 ***P(dE)*** 来接受这样的移动。

关于爬山算法与模拟退火，有一个有趣的比喻：

爬山算法：兔子朝着比现在高的地方跳去。它找到了不远处的最高山峰。但是这座山不一定是珠穆朗玛峰。这就是爬山算法，它不能保证局部最优值就是全局最优值。

模拟退火：兔子喝醉了。它随机地跳了很长时间。这期间，它可能走向高处，也可能踏入平地。但是，它渐渐清醒了并朝最高方向跳去。这就是模拟退火。

---

接着，让我们使用带有模拟退火算法思想的非确定性搜索，来确定构建分词最好的词典：

1. 一开始仅搜索短语分词；
2. 随机扰动 0 和 1，它们与“温度”成一定比例；
3. 每次迭代温度都会降低，扰动边界会减少。

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 ``` | ``` from random import randint  # flip()函数，随机扰动 0 和 1 def flip(segs, pos):     return segs[:pos] + str(1-int(segs[pos])) + segs[pos+1:]  # flip_n()函数，n 为迭代次数 def flip_n(segs, n):     for i in range(n):         segs = flip(segs, randint(0,len(segs)-1))     return segs def anneal(text, segs, iterations, cooling_rate):    #cooling_rate“降温”的快慢     temperature = float(len(segs))    # 初始温度     while temperature > 0.5:         # 每一次“降温”的结果，若由于前一次，则会更改 segs 的值并进行下一次“降温”         best_segs, best = segs, evaluate(text, segs)         for i in range(iterations):             guess = flip_n(segs, int(round(temperature)))             score = evaluate(text, guess)             if score < best:                 best, best_segs = score, guess         score, segs = best, best_segs         temperature = temperature / cooling_rate         print(evaluate(text, segs), segment(text, segs))     print     return segs ``` |


|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 ``` | ``` >>> text = 'doyouseethekittyseethedoggydoyoulikethekittylikethedoggy' >>> seg1 = '0000000000000001000000000010000000000000000100000000000' >>> anneal(text, seg1, 5000, 1.2) 60 ['doyouseetheki', 'tty', 'see', 'thedoggy', 'doyouliketh', 'ekittylike', 'thedoggy'] 58 ['doy', 'ouseetheki', 'ttysee', 'thedoggy', 'doy', 'o', 'ulikethekittylike', 'thedoggy'] 56 ['doyou', 'seetheki', 'ttysee', 'thedoggy', 'doyou', 'liketh', 'ekittylike', 'thedoggy'] 54 ['doyou', 'seethekit', 'tysee', 'thedoggy', 'doyou', 'likethekittylike', 'thedoggy'] 53 ['doyou', 'seethekit', 'tysee', 'thedoggy', 'doyou', 'like', 'thekitty', 'like', 'thedoggy'] 51 ['doyou', 'seethekittysee', 'thedoggy', 'doyou', 'like', 'thekitty', 'like', 'thedoggy'] 42 ['doyou', 'see', 'thekitty', 'see', 'thedoggy', 'doyou', 'like', 'thekitty', 'like', 'thedoggy'] '0000100100000001001000000010000100010000000100010000000' ``` |

有了足够的数据，就可能以一个较为合理的准确度自动将文本分割成词汇。

这种方法可用于那些词的边界没有任何视觉表示的书写系统分词。

---

# Correct errors in printing:

- 暂无

---

# Practice:

> 5.○ What happens if you ask the interpreter to evaluate **`monty[::-1]`** ? Explain why this is a reasonable result.

- 逆序输出。

|  |  |
| --- | --- |
| ``` 1 2 3 ``` | ``` >>> a='python' >>> a[::-1] 'nohtyp' ``` |


---

> 6.○ Describe the class of strings matched by the following regular expressions:
>
> 1. [a-zA-Z]+
> 2. [A-Z][a-z]\*
> 3. p[aeiou]{,2}t
> 4. \d+(\.\d+)?
> 5. ([^aeiou][aeiou][^aeiou])
> 6. \w+|[^\w\s]+
>
> Test your answers using **`nltk.re_show()`**.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 ``` | ``` import nltk  # 1. 字母字符串 nltk.re_show(r'[a-zA-Z]+', 'A very Intersting3 example')  # 2. 开头大写后小写字母不限（小写字母可有可没有） nltk.re_show(r'[A-Z][a-z]*', 'A very Intersting3 example')  # 3. p 开头 t 结尾，中间有少于 2 个的元音字母 nltk.re_show(r'p[aeiou]{,2}t', 'two pouting party pets - pt')  # 4. 整数或者带小数的整数（整数与浮点数） nltk.re_show(r'\d+(\.\d+)?', 'This should match 23 as well as 1.093 and 999.9')  # 5.（（非元音）（元音）（非元音））（可有可没有） 例如 'pot' nltk.re_show(r'([^aeiou][aeiou][^aeiou])*', 'This should match pet as well as cut and lol')  # 6. 要么是一个或多个的字母（但不包括空格） nltk.re_show(r'\w+|[^\w\s]+', 'should match me but not a apple \n') ``` |


---

> 7.○ Write regular expressions to match the following classes of strings:
>
> 1. A single determiner (assume that ***a***, ***an***, and ***the*** are the only determiners)
> 2. An arithmetic expression using integers, addition, and multiplication, such as **2\*3+8**

|  |  |
| --- | --- |
| ``` 1 2 ``` | ``` 1. >>> nltk.re_show('an?|the', 'thesisiaishihsthean', left='{', right='}') 2. >>> nltk.re_show('\d+\*\d+\+\d+', '2*3+8', left='{', right='}') ``` |


---

> 9.○ Save some text into a file corpus.txt. Define a function **`load(f)`** that reads from the file named in its sole argument, and returns a string containing the text of the file.
>
> 1. Use **`nltk.regexp_tokenize()`**to create a tokenizer that tokenizes the various kinds of punctuation in this text. Use one multiline regular expression inline comments, using the verbose flag**`(?x)`**.
> 2. Use **`nltk.regexp_tokenize()`** to create a tokenizer that tokenizes the following kinds of expressions: monetary amounts; dates; names of people and organizations.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 ``` | ``` 1. >>> pattern = r'''(?x)    ...           [][.,;"'?()=-_`]    ...           '''    >>> nltk.regexp_tokenize(text, pattern)  2. >>> pattern = r'''(?x)    ...           ([A-Z]\.)+    # eg.  U.S.A    ...           |([A-Z][a-z]*\s[A-Z][a-z]*)    # words with optional internal    ...           |\$?\d+(\.\d+)?%    # currency and percentages eg. $12.40, 82%    ...           | \d{4}\-\d{2}\-\d{2}               # Date like 2016-22-01    ...           | \d{1,2}\s[A-Z][a-z]{2,8}\s\d{4}   # Date like 2 March 1998    ...           '''    >>> nltk.regexp_tokenize(text, pattern) ``` |


---

> 13.○ What is the difference between calling **`split`** on a string with no argument and one with **`' '`** as the argument, e.g., **`sent.split()`** versus **`sent.split(' ')`**? What happens when the string being split contains tab characters, consecutive space characters, or a sequence of tabs and spaces? (In IDLE you will need to use ‘\t’ to enter a tab character.)

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 ``` | ``` >>> raw = 'Tres tristes tigres comen trigo en un trigal.' >>> raw.split() ['Tres', 'tristes', 'tigres', 'comen', 'trigo', 'en', 'un', 'trigal.'] >>> raw.split('') ['Tres', 'tristes', 'tigres', 'comen', 'trigo', 'en', 'un', 'trigal.']  >>> sent = 'Tres\ttristes\ttigres\tcomen\ttrigo\ten\tun\ttrigal.' >>> sent.split() ['Tres', 'tristes', 'tigres', 'comen', 'trigo', 'en', 'un', 'trigal.'] >>> sent.split(' ') ['Tres\ttristes\ttigres\tcomen\ttrigo\ten\tun\ttrigal.']  >>> sent = 'Tres   tristes   tigres   comen   trigo   en   un   trigal.' >>> sent.split() ['Tres', 'tristes', 'tigres', 'comen', 'trigo', 'en', 'un', 'trigal.'] >>> sent.split(' ') ['Tres', '', '', 'tristes', '', '', 'tigres', '', '', 'comen', '', '', 'trigo', '', '', 'en', '', '', 'un', '', '', 'trigal.']  >>> sent = 'Tres \ttristes\t\t\ttigres\t\t comen\t \t trigo en un trigal.' >>> sent.split() ['Tres', 'tristes', 'tigres', 'comen', 'trigo', 'en', 'un', 'trigal.'] >>> sent.split(' ') ['Tres', '\ttristes\t\t\ttigres\t\t', 'comen\t', '\t', 'trigo', 'en', 'un', 'trigal.'] ``` |


---

> 20.◑ Write code to access a favorite web page and extract some text from it. For example, access a weather site and extract the forecast top temperature for your town or city today.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 ``` | ``` def test20():     # search weather     url = 'http://en.weather.com.cn/weather/101220101.shtml'     html = urlopen(url).read()     soup = BeautifulSoup(html, 'lxml')     raw = soup.get_text()     tokens = nltk.word_tokenize(raw)     text = nltk.Text(tokens)     print(text)     print     print(text.concordance('Hefei')) ``` |


---

> 21.◑ Write a function **`unknown()`** that takes a URL as its argument, and returns a list of unknown words that occur on that web page. In order to do this, extract all substrings consisting of lowercase letters (using **`re.findall()`**) and remove any items from this set that occur in the Words Corpus (**nltk.corpus.words**). Try to categorize these words manually and discuss your findings.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 ``` | ``` def test21():     url = 'http://www.bbc.co.uk/news/world-middle-east-18650775'     wordsres = []     def unknown(url):         html = urlopen(url).read()         soup = BeautifulSoup(html)         raw = soup.get_text()         words = re.findall(r'[a-z]+', raw)         wordlist = [w for w in nltk.corpus.words.words('en') if w.islower()]         for word in words:             if word not in wordlist:                 wordsres.append(word)         return wordsres     wordsres = unknown(url)     print(wordsres) ``` |


---

> 25.◑ ***Pig Latin*** is a simple transformation of English text. Each word of the text is converted as follows: move any consonant (or consonant cluster) that appears at the start of the word to the end, then append ***ay***, e.g., ***string*** → ***ingstray***, ***idle*** → ***idleay*** (see *<http://en.wikipedia.org/wiki/Pig_Latin>*).
>
> 1. Write a function to convert a word to Pig Latin.
> 2. Write code that converts text, instead of individual words.
> 3. Extend it further to preserve capitalization, to keep **qu** together (so that **quiet** becomes **ietquay**, for example), and to detect when **y** is used as a consonant (e.g., **yellow**) versus a vowel (e.g., **style**).

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 ``` | ``` def test25():     # Pig Latin     def pig_latin(word):         result = []         if 'qu' in word.lower():             for i in range(len(word)):                 if word[i] in '[AEIOUaeiou]':                     pig_word = [word[i+1:], word[:i+1], 'ay']                     result = ''.join(pig_word)         else:             for i in range(len(word)):                 if word[i] in '[AEIOUaeiou]':                     pig_word = [word[i:], word[:i], 'ay']                     result = ''.join(pig_word)         return result       def translate():         object = open('text25.txt')         try:             text = object.read()         finally:             object.close()         words = nltk.word_tokenize(text)         result = []         for i in range(len(words)):             result.append(pig_latin(words[i]))         return result     result = translate()     print(result)     print(pig_latin('quiet'))     print(pig_latin('string')) ``` |


---

> 27.◑ Python’s **random** module includes a function **`choice()`** which randomly chooses an item from a sequence; e.g., **`choice('aehh ')`** will produce one of four possible characters, with the letter h being twice as frequent as the others. Write a generator expression that produces a sequence of 500 randomly chosen letters drawn from the string **“aehh “**, and put this expression inside a call to the **`''.join()`** function, to concatenate them into one long string. You should get a result that looks like uncontrolled sneezing or maniacal laughter: **he haha ee heheeh eha**. Use **`split()`** and **`join()`** again to normalize the whitespace in this string.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` def test27():     # choice     string = []     for i in range(500):         string.append(random.choice('hahe'))     result = ''.join(string).split()     print(result) ``` |


---

> 29.◑ Readability measures are used to score the reading difficulty of a text, for the purposes of selecting texts of appropriate difficulty for language learners. Let us define $μ\_w$ to be the average number of letters per word, and $μ\_s$ to be the average number of words per sentence, in a given text. The Automated Readability Index (ARI) of the text is defined to be: $4.71 μ\_w + 0.5 μ\_s - 21.43$. Compute the ARI score for various sections of the Brown Corpus, including section f (popular lore) and j (learned). Make use of the fact that **`nltk.corpus.brown.words()`** produces a se- quence of words, whereas **`nltk.corpus.brown.sents()`** produces a sequence of sentences.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 ``` | ``` def test29():     words1 = [len(word) for word in nltk.corpus.brown.words(categories = 'lore')]     sents1 = [len(sent) for sent in nltk.corpus.brown.sents(categories = 'lore')]     words2 = [len(word) for word in nltk.corpus.brown.words(categories = 'learned')]     sents2 = [len(sent) for sent in nltk.corpus.brown.sents(categories = 'learned')]     wordsum = 0     sentsum = 0     for wlength in words1 :         wordsum += int(wlength)      for slength in sents1 :         sentsum += slength      def ARI(uw,us):         return 4.71*uw + 0.5*us - 21.43      uw = wordsum/len(words1)     us = sentsum/len(sents1)     print(us)     print(ARI(uw, us)) ``` |


---

> 30.◑ Use the Porter Stemmer to normalize some tokenized text, calling the stemmer on each word. Do the same thing with the Lancaster Stemmer, and see if you ob- serve any differences.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` def test30():     saying = ['After', 'all', 'is', 'said', 'and', 'done', ',', 'more', 'is', 'said', 'than', 'done', '.']     porter = nltk.PorterStemmer()     lancaster = nltk.LancasterStemmer()     result_porter = [porter.stem(t) for t in saying]     result_lancaster = [lancaster.stem(t) for t in saying]     print(result_porter)     print(result_lancaster) ``` |


---

> 32.◑ Define a variable silly to contain the string: **‘newly formed bland ideas are inexpressible in an infuriating way’**. (This happens to be the legitimate inter- pretation that bilingual English-Spanish speakers can assign to Chomsky’s famous nonsense phrase ***colorless green ideas sleep furiously***, according to Wikipedia). Now write code to perform the following tasks:
>
> 1. Split **silly** into a list of strings, one per word, using Python’s **`split()`** opera- tion, and save this to a variable called **bland**.
> 2. Extract the second letter of each word in **silly** and join them into a string, to get **‘eoldrnnnna’**.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` def test32():     silly='newly formed bland ideas are inexpressible in an infuriating way'     bland = silly.split()     print(bland)     result = ''     for i in range(len(bland)):         result = result + bland[i][1]     print(result,type(result)) ``` |


---

> 35.◑ Read the LanguageLog post on phrases of the form ***as best as p can*** and ***as best p can***, where ***p*** is a pronoun. Investigate this phenomenon with the help of a corpus and the **`findall()`** method for searching tokenized text described in Section 3.5. The post is at *<http://itre.cis.upenn.edu/~myl/languagelog/archives/002733.html>*.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` def test35():     # 为什么我的 brown.words()中没有 as best as p can 以及 as best p can 的形式？     text = nltk.Text(brown.words())     print(text)     print(text.findall(r'<as> <\w*> <as>'))     print     print(text.findall(r'<\w*> <and> <other> <\w*s>')) ``` |


---

> 37.◑ Read about the **`re.sub()`** function for string substitution using regular expres- sions, using **`help(re.sub)`** and by consulting the further readings for this chapter. Use **`re.sub`** in writing code to remove HTML tags from an HTML file, and to normalize whitespace.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 ``` | ``` def test37():     object = open('Language Log: Asbestos she can.html')     try:         text = object.read()         pattern = '''(?x)<html>|</html>'''         text = re.sub(pattern, '', text)         object_copy = open('text36.txt', 'w+')         try:             object_copy.write(text)         finally:             object_copy.close()      finally:         object.close() ``` |


---
