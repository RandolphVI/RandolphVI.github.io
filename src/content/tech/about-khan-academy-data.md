---
title: "About Khan Academy Data"
date: 2018-03-19
category: "ML-AI"
tags: ["Kaggle", "Datasets"]
description: "About Khan Academy Data"
draft: false
---

![](https://farm1.staticflickr.com/797/27030261808_ebe2f72aa4_o.jpg)

有关「Datasets」的其他数据集介绍系列：[「Datasets」](http://randolph.pro/categories/Datasets/)

# About Khan Academy Data

## Introduction

### Khan Academy Knowledge Structure

![](https://farm1.staticflickr.com/815/40007475165_3f002df1fc_o.png)

存在重复项，例如：

1. 「Computer science」 下的 「Hour of Code」 中的内容会重定位到同级的「 Computer science」 的内容中。
2. 「Math by subject」 与 「Math by grade」存在交集。

## Data structure

数据一共为 4 个 `.json` 文件，以及相关视频 **Video** 与相关图片 **Picture**。

- content.json
  - 包含知识点逻辑结构信息
  - 包含内容种类信息（主要用于指向对应的题目类型）
- practice.json
  - 若数据在 `content.json` 中 `content_kind` 字段为 **Exercise** ，则会进一步根据 `practice` \
     中的唯一 **`practice_id`** 对应到 `practice.json` 当中。
  - 包含了试题题面文本信息以及图像信息
  - 包含了试题答案文本信息以及图像信息
- article.json
  - 若数据在 `content.json` 中 `content_kind` 字段为 **Article** ，则会进一步根据唯一的 `article_url` 对应到 `article.json` 当中。
- code.json
  - 属于可汗学院中专门的编程题，但是其实重定向后就是对应种类为 **Scratchpad** 内容，简而言之，就是属于 **Scratchpad** 的一小部分内容，但不是 **Scratchpad** 的全部内容。
  - 另外，若数据在 `content.json` 中 `content_kind` 字段为 **Scratchpad** ，并不存在唯一的字段对应到 `code.json` 当中，即不存在直接联系。

### Logical Structure

![](https://farm1.staticflickr.com/807/26028761257_c79edc4013_o.png)

### `content.json`

![](https://farm1.staticflickr.com/815/40193083274_e7ac89c514_o.png)

### `practice.json`

![](https://farm5.staticflickr.com/4776/40007579025_a3160e419c_o.png)

### Different types of content

#### Exercise

![](https://farm5.staticflickr.com/4776/26028894047_f866849115_o.png)

#### Picture

Total **14839** items = **4128** `.png` + **10709** `.svg` (Exists duplicate items)

![](https://farm1.staticflickr.com/813/40193098264_6ec4f5842e_o.png)

#### Video

![](https://farm1.staticflickr.com/791/39091655630_73e8720a62_o.png)

#### Article

![](https://farm1.staticflickr.com/814/40901331191_30e7694fdb_o.png)

#### Scratchpad

![](https://farm1.staticflickr.com/802/40859462552_e6bdc986ee_o.png)

## Data Analysis

### 针对 Domain 为「Math by subject」

- 各个「subject」的 Video 数量分布图

  ![](https://farm1.staticflickr.com/806/40859498872_f765435403_o.png)
- 各个「subject」的 Exercise 数量分布图

  ![](https://farm1.staticflickr.com/803/27030763818_a44ec0274e_o.png)
- 各个「subject」的 「child\_subject」 数量分布图

  ![](https://farm1.staticflickr.com/817/40859523822_64ec326b8b_o.png)
- 各个「subject」的 「slug」 数量分布图

![](https://farm1.staticflickr.com/813/27030780438_74e889defe_o.png)

#### 针对 Video 在所有各个「subject」的数量分布图

![](https://farm1.staticflickr.com/799/27030789618_113a7e0b9c_o.png)

#### 针对 Exercise 在所有各个「subject」的数量分布图

![](https://farm1.staticflickr.com/807/27030796068_3ee5504c9e_o.png)
