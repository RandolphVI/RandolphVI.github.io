---
title: Fundamentals of Data Engineering Plan and Build Robust Data
author: Joe Reis and Matt Housley
date: 2025-03-05
cover: "https://res.weread.qq.com/wrepub/CB_DBz0PD0RyE0c6kY6kuFwU8GT_parsecover"
progress: "4%"
readingTime: 0小时14分钟
publisher: "O'Reilly Media, Inc."
---
## 1. Data Engineering Described

> Data engineering is a set of operations aimed at creating interfaces and mechanisms for the flow and access of information. 

> 数据工程是一组旨在创建信息流动和访问接口和机制的操作。 

> Data engineering is all about the movement, manipulation, and management of data.数据工程是关于数据的移动、操作和管理。 

> Data engineering is the development, implementation, and maintenance of systems and processes that take in raw data and produce high-quality, consistent information that supports downstream use cases, such as analysis and machine learning. 

> 数据工程是开发、实施和维护系统与流程的过程，这些系统与流程接收原始数据并生成高质量、一致的信息，以支持下游用例，例如分析和机器学习。 

> [插图]Figure 1-1. The data engineering lifecycle图 1-1. 数据工程生命周期 

> In 2003, Google published a paper on the Google File System, and shortly after that, in 2004, a paper on MapReduce, an ultra-scalable data-processing paradigm. In truth, big data has earlier antecedents in MPP data warehouses and data management for experimental physics projects, but Google’s publications constituted a “big bang” for data technologies and the cultural roots of data engineering as we know it today. You’ll learn more about MPP systems and MapReduce in Chapters 3 and 8, respectively.2003年，谷歌发表了一篇关于谷歌文件系统的论文，之后不久，在2004年，又发表了一篇关于MapReduce的论文，MapReduce是一种超级可扩展的数据处理范式。事实上，大数据的先驱是实验物理项目的MPP数据仓库和数据管理，但谷歌的出版物构成了数据技术和数据工程文化根源的“大爆炸”，正如我们今天所知道的那样。您将在第3章和第8章中分别了解有关MPP系统和MapReduce的更多信息。 

> The Google papers inspired engineers at Yahoo to develop and later open source Apache Hadoop in 2006.6 It’s hard to overstate the impact of Hadoop. Software engineers interested in large-scale data problems were drawn to the possibilities of this new open source technology ecosystem. As companies of all sizes and types saw their data grow into many terabytes and even petabytes, the era of the big data engineer was born.谷歌的论文启发了雅虎的工程师，他们在 2006 年开发并开源了 Apache Hadoop。Hadoop 的影响之大，难以估量。对大规模数据问题感兴趣的软件工程师被这种新的开源技术生态系统的可能性所吸引。随着各种规模和类型的公司看到他们的数据增长到 TB 甚至 PB 级，大数据工程师的时代诞生了。 

> Around the same time, Amazon had to keep up with its own exploding data needs and created elastic computing environments (Amazon Elastic Compute Cloud, or EC2), infinitely scalable storage systems (Amazon Simple Storage Service, or S3), highly scalable NoSQL databases (Amazon DynamoDB), and many other core data building blocks.7 Amazon elected to offer these services for internal and external consumption through Amazon Web Services (AWS), becoming the first popular public cloud. AWS created an ultra-flexible pay-as-you-go resource marketplace by virtualizing and reselling vast pools of commodity hardware. Instead of purchasing hardware for a data center, developers could simply rent compute and storage from AWS.大约在同一时间，亚马逊必须跟上自身爆炸式的数据需求，创建了弹性计算环境（Amazon Elastic Compute Cloud，或EC2）、无限可扩展的存储系统（Amazon Simple Storage Service，或S3）、高度可扩展的NoSQL数据库（Amazon DynamoDB）和许多其他核心数据构建块。亚马逊选择通过Amazon Web Services（AWS）提供这些服务，供内部和外部使用，成为第一个流行的公共云。AWS通过虚拟化和转售大量的通用硬件，创建了一个超级灵活的按需付费资源市场。开发人员可以简单地从AWS租用计算和存储，而不是为数据中心购买硬件。 

> The public cloud is arguably one of the most significant innovations of the 21st century and spawned a revolution in the way software and data applications are developed and deployed. 

> 公共云可以说是 21 世纪最重要的创新之一，并引发了软件和数据应用程序开发部署方式的革命。 

> Big data quickly became a victim of its own success. As a buzzword, big data gained popularity during the early 2000s through the mid-2010s. Big data captured the imagination of companies trying to make sense of the ever-growing volumes of data and the endless barrage of shameless marketing from companies selling big data tools and services. Because of the immense hype, it was common to see companies using big data tools for small data problems, sometimes standing up a Hadoop cluster to process just a few gigabytes. It seemed like everyone wanted in on the big data action. Dan Ariely tweeted, “Big data is like teenage sex: everyone talks about it, nobody really knows how to do it, everyone thinks everyone else is doing it, so everyone claims they are doing it.”大数据很快成为自身成功的受害者。作为流行语，大数据在 2000 年代初期到 2010 年代中期期间流行起来。大数据激发了企业的想象力，它们试图理解不断增长的数据量，以及销售大数据工具和服务的公司无耻的营销轰炸。由于巨大的炒作，我们经常看到企业使用大数据工具来解决小数据问题，有时甚至要建立一个 Hadoop 集群来处理几个 G 的数据。似乎每个人都想参与大数据行动。丹·艾瑞里（Dan Ariely）在推特上写道：“大数据就像青少年性行为：每个人都在谈论它，没有人真正知道如何去做，每个人都认为其他人都在做，所以每个人都声称自己在做。” 

> Despite the term’s popularity, big data has lost steam. What happened? One word: simplification. Despite the power and sophistication of open source big data tools, managing them was a lot of work and required constant attention. Often, companies employed entire teams of big data engineers, costing millions of dollars a year, to babysit these platforms. Big data engineers often spent excessive time maintaining complicated tooling and arguably not as much time delivering the business’s insights and value.尽管“大数据”这个词很流行，但大数据已经失去了动力。这是怎么回事？一个词：简化。尽管开源大数据工具功能强大、技术成熟，但管理这些工具的工作量很大，而且需要持续不断地关注。通常，公司会雇佣整个大数据工程师团队，每年花费数百万美元来照看这些平台。大数据工程师经常花费大量时间来维护复杂的工具，而没有花太多时间来提供业务洞见和价值。
