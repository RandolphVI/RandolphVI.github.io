---
title: "NLP with Python — Chapter 1 & 2"
date: 2015-09-11
category: "AI"
tags: ["NLP", "Python"]
description: "说明：由于该书出版较早，里面代码内容均是基于 python 2.x 的，且个别函数无法正常使用。另外，本人学习时，则是采用 python 3.x 与 NL..."
draft: false
---

![](https://farm5.staticflickr.com/4423/36425940061_fe957aaf15_o.jpg)

有关该书的其他学习笔记系列：[Book:「NLP with Python」](http://randolph.pro/categories/Books/Book-「NLP-with-Python」/)

**说明：由于该书出版较早，里面代码内容均是基于 python 2.x 的，且个别函数无法正常使用。另外，本人学习时，则是采用 python 3.x 与 NLTK 3.x，文章代码内容均进行了适当的修改，特此说明。**

**另外，该书作者一直有在更新该书，包括一些错误勘正，并且对其进行了从 python 2.x 到 python 3.x 的代码风格转换，可以访问该书网站[Natural Language Processing with Python](http://www.nltk.org/book/)。**

# Related

- **NLTK**
- **concordance() function**
- **Word Sense Disambiguation & Pronoun Resolution**
- **Text Corpus Structure**
- **WordNet**

---

# Key:

## **What’s NLTK?**

**`NLTK`** 是一个自然语言工具包，最初创建于 2001 年，最初是宾州大学计算机与信息科学系计算语言学课程的一部分，大部分 NLP 研究者入门的首选工具。

另外，这本书是关于用 Python 进行自然语言处理的一本入门书，基本上可以看做是 **`NLTK`** 这个库的 HandBook，使用的方法均是 **`nltk`** 库中的方法。如果希望查阅 API 文档或者是下载安装 **`NLTK`**，可以前往  [官方网站](http://www.nltk.org)  下载，官网上提供和的 API 文档涵盖了工具包中的每一个模块、类和函数，详细说明了各种参数，以及用法示例，在此不再赘述。

- **简单介绍一下 `NLTK` 的几个重要的模块以及功能描述：**

| 语言处理任务 | NLTK 模块 | 功能描述 |
| --- | --- | --- |
| 获取语料库 | nltk.corpus | 语料库和字典的标准化接口 |
| 字符串处理 | nltk.tokenize, nltk.stem | 分词、句子分解、提取主干 |
| 搭配探究 | nltk.collocations | t- 检验、卡方、点互信息 |
| 词性标识符 | nltk.tag | n-gram、backoff、Brill、HMM、TnT |
| 分类 | nltk.classify，nltk.cluster | 决策树、最大熵、朴素贝叶斯、EM、k-means |
| 分块 | nltk.chunk | 正则表达式、n-gram、命名实体 |
| 解析 | nltk.parse | 图表、基于特征、一致性、概率性、依赖项 |
| 语义解释 | nltk.sem，nltk.inference | ℷ 演算、一阶逻辑、模型检验 |
| 指标评测 | nltk.metrice | 精度、召回率、协议系数 |
| 概率与估计 | nltk.probability | 频率分布、平滑概率分布 |
| 应用 | nltk.app，nltk.chat | 图形化的关键词排序、分析器、WordNet 查看器、聊天机器人 |
| 语言学领域的工作 | nltk.toolbox | 处理 SIL 数据格式的工具箱 |

---

## Download with NLTK

安装完之后 **`NLTK`**，我们还需要下载 **`NLTK`** 的语料库，在 Python 解释器中输入：

|  |  |
| --- | --- |
| ``` 1 ``` | ``` >>> nltk.download() ``` |

之后，会弹出相应的下载窗口，由于语料库数量较多，内容较大，耐心等待下载完毕。

---

## concordance **function**

- **`concordance()`** 函数：这个函数挺有意思的，是 **`nltk`** 下的一个函数，可以显示指定单词的出现情况（使用这个函数，指定单词的大小写不敏感），同时还可以显示一些上下文。下面是该函数的使用场景（其中 text1 的内容是 `nltk.book` 导入后中的 text1）:

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 ``` | ``` >>> text1.concordance('monstrous')     Building index...     Displaying 11 of 11 matches:     ong the former , one was of a most monstrous size . ... This came towards us ,     ON OF THE PSALMS . " Touching that monstrous bulk of the whale or ork we have r     ll over with a heathenish array of monstrous clubs and spears . Some were thick     d as you gazed , and wondered what monstrous cannibal and savage could ever hav     that has survived the flood ; most monstrous and most mountainous ! That Himmal     they might scout at Moby Dick as a monstrous fable , or still worse and more de     th of Radney .'" CHAPTER 55 Of the monstrous Pictures of Whales . I shall ere l     ing Scenes . In connexion with the monstrous pictures of whales , I am strongly     ere to enter upon those still more monstrous stories of them which are to be fo ``` |


---

## Word Sense Disambiguation & Pronoun Resolution

- Word Sense Disambiguation

词义消歧，简而言之，我们需要做的就是分析出特定上下文中的词被赋予的是哪个意思。例如：

> a. **serve**: help with food or drink; hold an office; put ball into play
>
> b. **dish**: plate; course of a meal; communications device

- Pronoun Resolution

指代消解 ，是解决“词义消歧”的一个手段，解决“谁对谁做了什么”，即检测动词的主语和宾语，另外还有 **语义角色标注**（semantic role labing）— 确定名词短语如何与动词相关联（如代理、受事、工具等）。

---

## Text Corpus Structure

以下是几种常见的语料库结构：

![](https://farm1.staticflickr.com/445/31263100710_d839312795_o.png)

- 最简单的一种语料库是一些孤立的没有什么特别结构的文本集合；
- 一些语料库按如文体（布朗语料库）等分类成组织结构；
- 一些分类会重叠，如主题类别（路透社语料库）；
- 另外一些语料库可以表示随时间变化，语言用法的改变（就职演说语料库）；

---

## WordNet

- Senses and Synonyms.（意义与同义词）
- Synonyms and Synset.（同义词集与词条）
- The WordNet Hierarchy.（WordNet 的层次结构）

> WordNet synsets correspond to abstract concepts, and they don’t always have corre- sponding words in English. These concepts are linked together in a hierarchy. Some concepts are very general, such as Entity, State, Event; these are called unique begin- ners or root synsets. Others, such as gas guzzler and hatchback, are much more specific.

WordNet 概念的层次片段：每个节点对应一个同义词集；边表示上位词 / 下位词关系，即上级概念与从属概念的关系。

![](https://farm1.staticflickr.com/474/31598383846_537809b299_o.png)

- Hyponyms and Hypernyms.（下位词与上位词）
- Antonyms.（反义词）

---

# Correct errors in printing:

- P19:

在 「Frequency Distributions」 的那块内容中：

> … for `text2`. Be careful to use … If you get an error message `NameError: name 'FreqDist'is not defined`, you need to start your work with **`from nltk.book import *`**。

需更正为：

> … for `text2`. Be careful to use … If you get an error message `NameError: name 'FreqDist'is not defined`, you need to start your work with **`from nltk import *`**。

**原因：`nltk.book` 中并不存在 `FreqDist()` 这一函数。**

---

# Practice:

Chapter 1 的习题比较简单，因此以下均是 Chapter 2 的习题解答：

> 4.○ Read in the texts of the ***State of the Union*** addresses, using the **`state_union`** corpus reader. Count occurrences of **men**, **women**, and **people** in each document. What has happened to the usage of these words over time?

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 ``` | ``` import nltk from nltk.corpus import state_union  cfd = nltk.ConditionalFreqDist(     (target, fileid[:4])     for fileid in state_union.fileids()     for w in state_union.words(fileid)     for target in ['men', 'women', 'people']     if w.lower() == target) cfd.plot() ``` |

![](https://farm5.staticflickr.com/4352/36729830135_f3a2ba6679_o.png)

---

> 5.○ Investigate the holonym-meronym relations for some nouns. Remember that there are three kinds of holonym-meronym relation, so you need to use **`member_mer onyms()`**, **`part_meronyms()`**, **`substance_meronyms()`**, **`member_holonyms()`**, **`part_holonyms()`**, and **`substance_holonyms()`**.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 ``` | ``` from nltk.corpus import wordnet as wn  def relations(noun):     noun_synset = wn.synset(noun)     print('Member Meronyms: \n')     print(noun_synset.member_meronyms())     print('\n Part Meronyms: \n')     print(noun_synset.part_meronyms())     print('\n Substance Meronyms: \n')     print(noun_synset.substance_meronyms())     print('\n Member Holonyms: \n')     print(noun_synset.member_holonyms())     print('\n Part Holonyms: \n')     print(noun_synset.part_holonyms())     print('\n Substance Holonyms: \n')     print(noun_synset.substance_holonyms()) relations('tree.n.01') print('----------\n') relations('honey.n.01') print('----------\n') relations('wood.n.01') ``` |


---

> 6.○ In the discussion of comparative wordlists, we created an object called **translate**, which you could look up using words in both German and Italian in order to get corresponding words in English. What problem might arise with this approach? Can you suggest a way to avoid this problem?

- 在德语与意大利语中可能存在拼写相同的单词，通过 **translate** 转换成英语之后分别得到不同的翻译结果。解决办法就是，添加语言 `tag` 标记在各个单词上，避免上述情况发生。

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 ``` | ``` from nltk.corpus import swadesh # 意大利语转英语，添加 '-it' 语言标记 it2en = [(i + '-it', e) for (i, e) in swadesh.entries(['it', 'en'])] translate = dict(it2en) print(translate['madre-it'])  # 德语转英语，添加 '-de' 语言标记 de2en = [(d + '-de', e) for (d, e) in swadesh.entries(['de', 'en'])] translate.update(dict(de2en)) print(translate['Hund-de']) ``` |

- 另外，如果输入错误（例如不存在的词语或者其他没有通过 **`translate.update(dict(xx))`** 加入字典的语言词语，则会引发 **KeyError**）。其中一个解决办法是，添加一个错误处理情况。

---

> 7.○ According to Strunk and White’s ***Elements of Style***, the word **however**, used at the start of a sentence, means “in whatever way” or “to whatever extent,” and not “nevertheless.” They give this example of correct usage: [However you advise him, he will probably do as he thinks best.](http://www.bartleby.com/141/strunk3.html) Use the concordance tool to study actual usage of this word in the various texts we have been considering. See also the **LanguageLog** posting “Fossilized prejudices about ‘however’” at [this website](http://itre.cis.upenn.edu/~myl/languagelog/archives/001913.html).

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 ``` | ``` import nltk from nltk.corpus import *  emma = nltk.Text(gutenberg.words('austen-emma.txt')) emma.concordance('however') print('----------\n') last = inaugural.fileids()[-3] print(last) inaugural = nltk.Text(inaugural.words(last)) inaugural.concordance('however') ``` |


---

> 8.◑ Define a conditional frequency distribution over the Names Corpus that allows you to see which initial letters are more frequent for males versus females (see Figure 2-7).

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 ``` | ``` import nltk  names = nltk.corpus.names cfd = nltk.ConditionalFreqDist(     (fileid, name[0])     for fileid in names.fileids()     for name in names.words(fileid)) cfd.plot() ``` |

![](https://farm5.staticflickr.com/4431/35896100614_0455b1c8b5_o.png)

---

> 9.◑ Pick a pair of texts and study the differences between them, in terms of vocabulary, vocabulary richness, genre, etc. Can you find pairs of words that have quite different meanings across the two texts, such as **monstrous** in ***Moby Dick*** and in ***Sense*** and Sensibility?

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 ``` | ``` import nltk from nltk.corpus import *  religion = brown.words(fileids='cd12') movie = webtext.words(fileids='pirates.txt')  print('Vocabulary of Book1: %d' % len(set(religion))) print('Vocabulary Richness of Book1: %f' % (len(set(religion)) / len(religion)))  print('----------\n') print('Vocabulary of Book2: %d' % len(set(movie))) print('Vocabulary Richness Book2: %f' % (len(set(movie)) / len(movie))) print('----------\n')  movie_text = nltk.Text(movie) religion_text = nltk.Text(religion)  ## Word use: movie_text.concordance('love') print('----------\n') religion_text.concordance('love') print('----------\n')  movie_text.concordance('bear') print('----------\n') religion_text.concordance('bear') ``` |


---

> 10.◑ Read the BBC News article: “UK’s Vicky Pollards ‘left behind’” at [this website](http://news.bbc.co.uk/1/hi/education/6173441.stm). The article gives the following statistic about teen language: “the top 20 words used, including **yeah**, **no**, **but** and like, account for around a third of all words.” How many word types account for a third of all word tokens, for a variety of text sources? What do you conclude about this statistic? Read more about this on LanguageLog, at [this website](http://itre.cis.upenn.edu/~myl/languagelog/archives/003993.html).

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 ``` | ``` import nltk from nltk.corpus import *  emma = gutenberg.words('austen-emma.txt') inaugural = inaugural.words('2001-Bush.txt') religion = brown.words(fileids='cd12') movie = webtext.words(fileids='pirates.txt')  def third_of_tokens(text):     words_in_text = [w for w in text if any(c.isalpha() for c in w)]      fd = nltk.FreqDist(words_in_text)     most = fd.most_common(1000)     count = 0     third_words = []      for word, num in most:         if ((count < (len(words_in_text) / 3)) & any(c.isalpha() for c in word)):             count = count + num             third_words.append(word)     print(third_words)             print(len(third_words))      third_of_tokens(emma) third_of_tokens(inaugural) third_of_tokens(religion) third_of_tokens(movie) ``` |


---

> 11.◑ Investigate the table of modal distributions and look for other patterns. Try to explain them in terms of your own impressionistic understanding of the different genres. Can you find other closed classes of words that exhibit significant differences across different genres?

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 ``` | ``` import nltk from nltk.corpus import brown  cfd = nltk.ConditionalFreqDist(     (genre, word)     for genre in brown.categories()     for word in brown.words(categories=genre))  genres = ['adventure', 'belles_lettres', 'editorial', 'fiction', 'government', 'hobbies', 'humor', 'learned', 'lore', 'mystery', 'news', 'religion', 'reviews', 'romance', 'science_fiction']  pronouns = ['I', 'you', 'he', 'she', 'it', 'we', 'they'] cfd.tabulate(conditions=genres, samples=pronouns) print('----------\n') wh = ['what', 'when', 'who', 'why', 'where'] cfd.tabulate(conditions=genres, samples=wh) ``` |


---

> 12.◑ The CMU Pronouncing Dictionary contains multiple pronunciations for certain words. How many distinct words does it contain? What fraction of words in this dictionary have more than one possible pronunciation?

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 ``` | ``` from nltk.corpus import cmudict  count_distinct = 0 dublettes = [] prev = '' for entry in cmudict.entries():     if ((entry[0] == prev) and (entry[0] not in dublettes)):         dublettes.append(entry[0])     else:          count_distinct = count_distinct + 1         prev = entry[0] print(count_distinct) print('The fraction: %f' % ((len(dublettes) / count_distinct))) ``` |


---

> 13.◑ What percentage of noun synsets have no hyponyms? You can get all noun synsets using **`wn.all_synsets('n')`**.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 ``` | ``` from nltk.corpus import wordnet as wn  all_syns = list(wn.all_synsets('n')) no_hyponyms = [s for s in all_syns if len(s.hyponyms()) == 0] print('The fraction: %f' % (len(no_hyponyms) / len(all_syns))) ``` |


---

> 14.◑ Define a function **`supergloss(s)`** that takes a synset s as its argument and returns a string consisting of the concatenation of the definition of **s**, and the definitions of all the hypernyms and hyponyms of **s**.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 ``` | ``` from nltk.corpus import wordnet as wn  def supergloss(s):     gloss = 'definition:' + s.definition() + '\n\n'     gloss = gloss + 'Hypernyms:\n'     for hypernym in s.hypernyms():         gloss = gloss + hypernym.name() + ':' + hypernym.definition() + '\n'     gloss = gloss + '\nHyponyms:\n'     for hyponym in s.hyponyms():         gloss = gloss + hyponym.name() + ':' + hyponym.definition() + '\n'     return gloss  print(supergloss(wn.synset('bicycle.n.01'))) print('----------\n') print(supergloss(wn.synset('believe.v.01'))) ``` |


---

> 15.◑ Write a program to find all words that occur at least three times in the Brown Corpus.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 ``` | ``` import nltk from nltk.corpus import brown  fd = nltk.FreqDist(brown.words()) triple_words = [w for w in fd.keys() if fd[w] > 2] print(len(brown.words())) print(len(triple_words)) ``` |


---

> 16.◑ Write a program to generate a table of lexical diversity scores (i.e., token/type ratios), as we saw in Table 1-1. Include the full set of Brown Corpus genres (**`nltk.corpus.brown.categories()`**). Which genre has the lowest diversity (greatest number of tokens per type)? Is this what you would have expected?

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 ``` | ``` from nltk.corpus import brown  def lexical_diversity(text):     return (len(text) / len(set(text))) for genre in brown.categories():     print(genre + ':' + str(lexical_diversity(brown.words(categories=genre)))) ``` |


---

> 17.◑ Write a function that finds the 50 most frequently occurring words of a text that are not stopwords.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 ``` | ``` import nltk from nltk.corpus import *  def most_frequent_content_words(text):     stopwords_list = stopwords.words('english')     content_words = [w.lower() for w in text if w.lower() not in stopwords_list and any(c.isalpha() for c in w)]     fd = nltk.FreqDist(content_words)     return [w for w, num in fd.most_common(50)]      emma = gutenberg.words('austen-emma.txt') movie = webtext.words(fileids='pirates.txt') print(most_frequent_content_words(emma)) print('----------\n') print(most_frequent_content_words(movie)) ``` |


---

> 18.◑ Write a program to print the 50 most frequent bigrams (pairs of adjacent words) of a text, omitting bigrams that contain stopwords.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 ``` | ``` import nltk from nltk.corpus import *  def most_frequent_bigrams(text):     stopwords_list = stopwords.words('english')     bigrams = [b for b in nltk.bigrams(text) if b[0] not in stopwords_list and b[1] not in stopwords_list and any(c.isalpha() for c in b[0]) and any(c.isalpha() for c in b[1])]     fd = nltk.FreqDist(bigrams)     return [b for b, num in fd.most_common(50)]  emma = gutenberg.words('austen-emma.txt') movie = webtext.words(fileids='pirates.txt') print(most_frequent_bigrams(emma)) print('----------\n') print(most_frequent_bigrams(movie)) ``` |


---

> 19.◑ Write a program to create a table of word frequencies by genre, like the one given in Section 2.1 for modals. Choose your own words and try to find words whose presence (or absence) is typical of a genre. Discuss your findings.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 ``` | ``` import nltk from nltk.corpus import brown  def table(words, genres):     cfd = nltk.ConditionalFreqDist(         (genre, word)         for genre in brown.categories()         for word in brown.words(categories=genre))     cfd.tabulate(conditions=genres, samples=words)      table(['perhaps', 'maybe', 'possibly', 'surely', 'certainly', 'absolutely'], ['news', 'religion', 'government', 'learned', 'fiction', 'romance', 'humor']) ``` |


---

> 20.◑ Write a function **`word_freq()`** that takes a word and the name of a section of the Brown Corpus as arguments, and computes the frequency of the word in that sec- tion of the corpus.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 ``` | ``` import nltk from nltk.corpus import brown  def word_freq(word, genre):     fd = nltk.FreqDist(brown.words(categories=genre))     return fd[word]  print(word_freq('God', 'religion')) print(word_freq('God', 'government')) ``` |


---

> 21.◑ Write a program to guess the number of syllables contained in a text, making use of the CMU Pronouncing Dictionary.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 ``` | ``` import nltk from nltk.corpus import *  prondict = cmudict.dict()      def guess_syllables(text):     count_syllables = 0     for word in text:         if any(c.isalpha() for c in word):             try:                 pron = prondict[word.lower()][0]             except KeyError:                 print('"' + word.lower() + '" does not exist in CMU!')                 continue             else:                     for syllable in pron:                     if any(c.isnumeric() for c in syllable):                         count_syllables = count_syllables + 1     return count_syllables  print(guess_syllables(['She', 'sells', 'seashells', 'by', 'the', 'seashore'])) print('----------\n') print(guess_syllables(['This', 'is', 'an', 'absolutely', 'fantastic', 'pythonic', 'program', '.'])) print('----------\n') print(guess_syllables(nltk.Text(brown.words(fileids='cd12'))))    # religion_text ``` |


---

> 22.◑ Define a function **`hedge(text)`** that processes a text and produces a new version with the word **‘like’** between every third word.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 ``` | ``` def hedge(text):     text_hedged = []     count = 0     for word in text:         text_hedged.append(word)         count = count + 1         if count == 3:             text_hedged.append('like')             count = 0     return text_hedged  new_text = hedge(['She', 'sells', 'seashells', 'by', 'the', 'seashore', 'the', 'shells', 'she', 'sells', 'are', 'seashells']) print(new_text) ``` |


---

> 23.● **Zipf’s Law**: Let **`f(w)`** be the frequency of a word *w* in free text. Suppose that all the words of a text are ranked according to their frequency, with the most frequent word first. Zipf’s Law states that the frequency of a word type is inversely proportional to its rank (i.e., *f × r = k*, for some constant *k*). For example, the 50th most common word type should occur three times as frequently as the 150th most common word type.  
> a. Write a function to process a large text and plot word frequency against word rank using **`pylab.plot`**. Do you confirm Zipf’s law? (Hint: it helps to use a logarithmic scale.) What is going on at the extreme ends of the plotted line?

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 ``` | ``` import nltk import matplotlib.pyplot as plt from nltk.corpus import *  emma = gutenberg.words('austen-emma.txt') religion = brown.words(fileids='cd12')  def zipf(text):     fd = nltk.FreqDist(text)     rank = 1     freqs = []     ranks = []     for sample, count in fd.most_common(200):         if any(c.isalpha() for c in sample):             freqs.append(fd.freq(sample))             ranks.append(rank)             rank = rank + 1     return (ranks, freqs)  plt.figure(1) plt.subplot(121) plt.plot(zipf(emma)[0], zipf(emma)[1]) plt.xlabel('Ranks') plt.ylabel('Freqs') plt.title('emma')  plt.subplot(122) plt.plot(zipf(religion)[0], zipf(religion)[1]) plt.xlabel('Ranks') plt.ylabel('Freqs') plt.title('religion') plt.show() ``` |

![](https://farm5.staticflickr.com/4372/36755792555_824c407bc2_o.png)

b. Generate random text, e.g., using **`random.choice("abcdefg ")`**, taking care to include the space character. You will need to **`import random first`**. Use the string concatenation operator to accumulate characters into a (very) long string. Then tokenize this string, generate the Zipf plot as before, and compare the two plots. What do you make of Zipf’s Law in the light of this?

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 ``` | ``` import random import nltk import matplotlib.pyplot as plt  def zipf(text):     fd = nltk.FreqDist(text)     rank = 1     freqs = []     ranks = []     for sample, count in fd.most_common(200):         if any(c.isalpha() for c in sample):             freqs.append(fd.freq(sample))             ranks.append(rank)             rank = rank + 1     return (ranks, freqs)  random_text = '' for i in range(100000):     random_text = random_text + random.choice('abcdefg ') text_split = random_text.split()  plt.figure(1) plt.plot(zipf(text_split)[0], zipf(text_split)[1]) plt.xlabel('Ranks') plt.ylabel('Freqs') plt.title('Random Text') plt.show() ``` |

![](https://farm5.staticflickr.com/4372/36755792555_824c407bc2_o.png)

---

> 24.● Modify the text generation program in Example 2-1 further, to do the following tasks:  
> a. Store the *n* most likely words in a list words, then randomly choose a word from the list using **`random.choice()`**. (You will need to **`import random`** first.)  
> b. Select a particular genre, such as a section of the Brown Corpus or a Genesis translation, one of the Gutenberg texts, or one of the Web texts. Train the model on this corpus and get it to generate random text. You may have to experiment with different start words. How intelligible is the text? Discuss the strengths and weaknesses of this method of generating random text.  
> c. Now train your system using two distinct genres and experiment with generating text in the hybrid genre. Discuss your observations.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 ``` | ``` import random import nltk from nltk.corpus import *  emma = gutenberg.words('austen-emma.txt') religion = brown.words(fileids='cd12')  def generate_model_random(text, num=15, n=50):     words = [w for w, count in nltk.FreqDist(text).most_common(n)]     word = random.choice(words)     result = ''     for i in range(num):         result = result + word + ' '         word = random.choice(words)     print(result)  # Question b generate_model_random(emma) generate_model_random(religion, 25, 200)  # Question c generate_model_random(brown.words(categories=['news', 'romance'])) generate_model_random(brown.words(categories=['news', 'romance']), 100, 100) ``` |


---

> 25.● Define a function **`find_language()`** that takes a string as its argument and returns a list of languages that have that string as a word. Use the **udhr** corpus and limit your searches to files in the Latin-1 encoding.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 ``` | ``` import nltk from nltk.corpus import udhr  def find_language(word):     languages = []     for fileid in udhr.fileids():         if fileid.endswith('-Latin1') and word in udhr.words(fileid):             languages.append(fileid[:-7])     return languages                   print(find_language('and')) print find_language('in') ``` |


---

> 26.● What is the branching factor of the noun hypernym hierarchy? I.e., for every noun synset that has hyponyms—or children in the hypernym hierarchy—how many do they have on average? You can get all noun synsets using **`wn.all_syn sets('n')`**.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 ``` | ``` from nltk.corpus import wordnet as wn  num_hyponyms = 0 sum_hyponyms = 0 for synset in wn.all_synsets('n'):     hyponyms = synset.hyponyms()     if len(hyponyms) > 0:         num_hyponyms = num_hyponyms + 1         sum_hyponyms = sum_hyponyms + len(hyponyms)          print(sum_hyponyms / num_hyponyms) ``` |


---

> 27.● The polysemy of a word is the number of senses it has. Using WordNet, we can determine that the noun *dog* has seven senses with **`len(wn.synsets('dog', 'n'))`**. Compute the average polysemy of nouns, verbs, adjectives, and adverbs according to WordNet.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 ``` | ``` from nltk.corpus import wordnet as wn  def average_polysemy(category):     seen_words = []     num_poly = 0     sum_poly = 0     for synset in wn.all_synsets(category):         # Too many words, it's necessary to limit.         if num_poly > 20000:             break;         for lemma in synset.lemmas():             lemma_name = lemma.name()             if lemma_name not in seen_words:                 seen_words.append(lemma_name)                 num_poly = num_poly + 1                 sum_poly = sum_poly + len(wn.synsets(lemma_name, category))     return (sum_poly / num_poly)  print(average_polysemy('n')) print(average_polysemy('v')) print(average_polysemy('a')) print(average_polysemy('r')) ``` |


---

> 28.● Use one of the predefined similarity measures to score the similarity of each of the following pairs of words. Rank the pairs in order of decreasing similarity. How close is your ranking to the order given here, an order that was established exper- imentally by (Miller & Charles, 1998): **`car-automobile`**, **`gem-jewel`**, **`journey-voyage`**, **`boy-lad`**, **`coast-shore`**, **`asylum-madhouse`**, **`magician-wizard`**, **`midday-noon`**, **`furnace- stove`**, **`food-fruit`**, **`bird-cock`**, **`bird-crane`**, **`tool-implement`**, **`brother-monk`**, **`lad- brother`**, **`crane-implement`**, **`journey-car`**, **`monk-oracle`**, **`cemetery-woodland`**, **`food- rooster`**, **`coast-hill`**, **`forest-graveyard`**, **`shore-woodland`**, **`monk-slave`**, **`coast-forest`**, **`lad-wizard`**, **`chord-smile`**, **`glass-magician`**, **`rooster-voyage`**, **`noon-string`**.

|  |  |
| --- | --- |
| ``` 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 ``` | ``` from operator import itemgetter from nltk.corpus import wordnet as wn  pairs = [('car', 'automobile'), ('gem', 'jewel'), ('journey', 'voyage'), ('boy', 'lad'), ('coast', 'shore'),              ('asylum', 'madhouse'), ('magician', 'wizard'), ('midday', 'noon'), ('furnace', 'stove'), ('food', 'fruit'),              ('bird', 'cock'), ('bird', 'crane'), ('tool', 'implement'), ('brother', 'monk'), ('lad', 'brother'),              ('crane', 'implement'), ('journey', 'car'), ('monk', 'oracle'), ('cemetery', 'woodland'), ('food', 'rooster'),              ('coast', 'hill'), ('forest', 'graveyard'), ('shore', 'woodland'), ('monk', 'slave'), ('coast', 'forest'),              ('lad', 'wizard'), ('chord', 'smile'), ('glass', 'magician'), ('rooster', 'voyage'), ('noon', 'string')] lch = [] path = [] for word1, word2 in pairs:     lch.append((word1, word2, wn.lch_similarity(wn.synsets(word1)[0], wn.synsets(word2)[0])))     path.append((word1, word2, wn.path_similarity(wn.synsets(word1)[0], wn.synsets(word2)[0])))  print(sorted(lch, key=itemgetter(2), reverse=True)) print('----------\n') print(sorted(path, key=itemgetter(2), reverse=True)) ``` |
