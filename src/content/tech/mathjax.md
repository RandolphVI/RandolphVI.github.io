---
title: "MathJax"
date: 2016-11-11
category: "工具"
tags: ["Tools", "MathJax"]
description: "本文是关于 MathJax 的一些写法。"
draft: false
---

![](https://farm8.staticflickr.com/7874/32461566277_401e85a69d_o.jpg)

> **更多工具文章：** [查看工具分类](/categories/工具/)

# 基础

## 排版方式

使用`MathJax`时，需要用一些适当的标记告诉`MathJax`某段文本是公式代码。此外，`MathJax `中的公式排版有两种方式，`inline`和`displayed`。`inline`表示公式嵌入到文本段中，`displayed`表示公式独自成为一个段落（也就是居中显示）。例如$f(x)=3*x$这是一个`inline`公式，而下面：

$$
f(x)=3*x
$$

这就是一个`displayed`公式。

在`MathJax`中，默认的`displayed`公式分隔符有` $$...$$ `和` \[...\] `，而默认的`inline`公式分隔符是` $...$ `。

## 希腊字母

具体见下表：

|   名称    |     大写     |   Tex    |     小写     |   Tex    |
| :-----: | :--------: | :------: | :--------: | :------: |
|  alpha  |     A      |    A     |  $\alpha$  |  \alpha  |
|  beta   |     B      |    B     |  $\beta$   |  \beta   |
|  gamma  |  $\Gamma$  |  \Gamma  |  $\gamma$  |  \gamma  |
|  delta  |  $\Delta$  |  \Delta  |  $\delta$  |  \delta  |
| epsilon |     E      |    E     | $\epsilon$ | \epsilon |
|  zeta   |     Z      |    Z     |  $\zeta$   |  \zeta   |
|   eta   |     H      |    H     |   $\eta$   |   \eta   |
|  theta  |  $\Theta$  |  \Theta  |  $\theta$  |  \theta  |
|  iota   |     I      |    I     |  $\iota$   |  \iota   |
|  kappa  |     K      |    K     |  $\kappa$  |  \kappa  |
| lambda  | $\Lambda$  | \Lambda  | $\lambda$  | \lambda  |
|   mu    |     M      |    M     |   $\mu$    |   \mu    |
|   nu    |     N      |    N     |   $\nu$    |   \nu    |
|   xi    |   $\Xi$    |   \Xi    |   $\xi$    |   \xi    |
| omicron |     O      |    O     | $\omicron$ | \omicron |
|   pi    |   $\Pi$    |   \Pi    |   $\pi$    |   \pi    |
|   rho   |     P      |    P     |   $\rho$   |   \rho   |
|  sigma  |  $\Sigma$  |  \Sigma  |  $\sigma$  |  \sigma  |
|   tau   |     T      |    T     |   $\tau$   |   \tau   |
| upsilon | $\Upsilon$ | \Upsilon | $\upsilon$ | \upsilon |
|   phi   |   $\Phi$   |   \Phi   |   $\phi$   |   \phi   |
|   chi   |     X      |    X     |   $\chi$   |   \chi   |
|   psi   |   $\Psi$   |   \Psi   |   $\psi$   |   \psi   |
|  omega  |  $\Omega$  |  \Omega  |  $\omega$  |  \omega  |

## 上标 & 下标

- 上标和下标分别用`^`和`_`，如`x_i^2`：$$x_i^2$$，但是`^`和`_`分别只对下一个数起作用，比如`10^10`会得到$10^10$而不是$10^{10}$，这时需要使用`{...}`，也就是`10^{10}`。
- 同时，大括号还能消除二义性，如`x^5^6`将得到一个错误，必须使用大括号来界定`^`的结合性，如`{x^5}^6`：${x^5}^6$ 或者 `x^{5^6}`：$x^{5^6}$。
- 另外，如果要在左右两边都有上下标，可以用`\sideset`命令。例如，`\sideset{^1_2}{^3_4}\bigotimes`：$$\sideset{^1_2}{^3_4}\bigotimes$$。

## 括号

- 小括号和方括号，就用原始的`()`和`[]`:$(2+2)$ $[3+3]$；
- 大括号，由于大括号用来`分组`，所以如果要在公式里面加大括号就使用`\{`和`\}`或者用`\lbrace`和`\rbrace`来表示。如`\{a*b\}`:$\{a∗b\}$，`\lbrace a*b \rbrace`: $\lbrace a*b \rbrace$ ；
- 尖括号，使用`\langle`和`\rangle`表示左右尖括号，`\langle x \rangle`：$\langle x \rangle$；
- 上取整，使用`\lceil`和`\rceil`表示左右尖括号，`\lceil x \rceil`：$\lceil x \rceil$；
- 下取整，使用`\lfloor`和`\rfloor`表示左右尖括号，`\lfloor x \rfloor`：$\lfloor x \rfloor$；
- 不可见括号，使用`\left.`和`\right.`表示，`\left. x\right.`：$\left. x\right.$。

需要注意的是，原始的符号不会随着公式的变大而缩放，比如`\frac{1}{2}`：$\frac{1}{2}$。可以使用`\left( ... \right)`进行缩放，如下：

$$
\begin{array}{cc}
\mathrm{缩放前} & \mathrm{缩放后} \\
\hline \\
\{ \sum_{i=0}^{n}i^2 = \frac {(n^2+n)(2n+1)}{6} \} & \left\{ \sum_{i=0}^{n}i^2 = \frac {(n^2+n)(2n+1)}{6} \right\} \\
\end{array}
$$

## 求和 & 积分

- `\sum`用来表示求和符号，上标表示上限，下标表示下限。如，`\sum_{i=1}^{n}i^2`：$\sum_{i=1}^{n}i^2$；
- `\int`用来表示积分符号，上标表示上限，下标表示下限。如，`\int_{1}^{\infty}i^2`：$\int_{1}^{\infty}i^2$；
- 类似的符号还有，`\prod`：$\prod$， `\bigcup`：$\bigcup$， `\bigcap`：$\bigcap$， `\iint`：$\iint$。

## 分式 & 根式

- 分式：
  - 第一种表示为`\frac{a}{b}`：$\frac{a}{b}$。`\frac`作用于其后的两组 a 与 b，如果分子或者分母不是单个字符，需要使用`{...}`来分组。
  - 第二种表示为`{a+1 \over b+1}`：${a+1 \over b+1}$;
- 根式，表示为`\sqrt`，比如`\sqrt[4]{\frac {x}{y}}`：$\sqrt[4]{\frac {x}{y}}$

## 字体

- 黑板粗体字，例如`\mathbb A`：$\mathbb A$，或者`\mathbb {ABC}`:$$\mathbb {ABC}$$（这种字体常用来表示实数、整数、有理数、复数的大写字母）；
- 黑体字，例如`\mathbf A`：$\mathbf A$，或者`\mathbf {ABC}`：$$\mathbf {ABC}$$；
- 打印机字体，例如`\mathtt A`：$\mathtt A$，或者`\mathtt {ABC}`：$$\mathtt {ABC}$$；
- 罗马字体，例如`\mathrm A`：$\mathrm A$，或者`\mathrm {ABC}`：$$\mathrm {ABC}$$；
- 手写字体，例如`\mathscr A`：$\mathscr A$，或者`\mathscr {ABC}`:$$\mathscr {ABC}$$；
- Fraktur 字体，例如`\mathfrak A`：$\mathfrak A$，或者`\mathfrak {ABC}`:$$\mathfrak {ABC}$$。

## 特殊函数 & 符号

- 常见的三角函数、求极限符号可以直接使用缩写即可：
  - 正弦函数`\sin (x)`：$\sin (x)$⁡；
  - 反正切函数`\arctan (x)`：$\arctan(x)⁡$；
  - 求极限`\lim_{1\rightarrow\infty}x`： $\lim_{1\rightarrow\infty}x$。
- 比较运算符：
  - 小于`\lt`：$\lt$；
  - 大于`\gt`：$\gt$；
  - 小于等于`\le`：$\le$；
  - 大于等于`\ge`：$\ge$；
  - 不等于`\neq`：$\neq$，同时如果在前面加上`\not`就可以是`\not\lt`：$\not\lt$；
- 运算符：
  - 乘`\times`：$\times$；
  - 除`\div`：$\div$；
  - 加减`\pm`：$\pm$；
  - 减加`\mp`：$\mp$；
  - 点乘`x \cdot y`：$x \cdot y$。
- 集合关系运算：
  - 并`\cup`：$\cup$；
  - 交`\cap`：$\cap$；
  - 舍`\setminus`：$\setminus$；
  - 包含于`\subset`：$\subset$；
  - 真包含于`\subseteq`： $\subseteq$；
  - 非真包含于`\subsetneq`：$\subsetneq$；
  - 包含`\supset`：$\supset$；
  - 属于`\in`：$\in$；
  - 不属于`\notin`：$\notin$；
  - 空集`\varnothing`： $\varnothing$。
- 表示排列使用`{n+1 \choose 2k}`或者`\binom{n+1}{2k}`表示：$\binom{n+1}{2k}$；
- 箭头：
  - `\to`：$\to$；
  - `\rightarrow`：$\rightarrow$；
  - `\Rightarrow`：$\Rightarrow$；
  - `\leftarrow`： $\leftarrow$；
  - `\Leftarrow`：$\Leftarrow$；
  - `\mapsto`：$\mapsto$。
- 逻辑运算符：
  - `\land`：$\land$；
  - `\lor`：$\lor$；
  - `\lnot`：$\lnot$；
  - `\forall`：$\forall$；
  - `\exists`：$\exists$；
  - `\top`：$\top$；
  - `\bot`：$\bot$；
  - `\vdash`：$\vdash$；
  - `\vDash`：$\vDash$。
- 特殊运算符:
  - `\star`：$\star$;
  - `\ast`：$\ast$；
  - `\oplus`：$\oplus$；
  - `\circ`：$\circ$；
  - `\bullet`：$\bullet$。
- 等于运算符：
  - `\approx`：$\approx$；
  - `\sim`：$\sim$；
  - `\cong`：$\cong$；
  - `\equiv`：$\equiv$；
  - `\prec`：$\prec$。
- 特殊符号：
  - `\infty`：$\infty$；
  - `\aleph_0`：$\aleph_0$；
  - `\nabla`：$\nabla$；
  - `\partial`：$\partial$；
  - `\Im`：$\Im$；
  - `\Re`：$\Re$。
- 模运算符`a \pmod b`：$a \pmod b$，例如`a\equiv b\pmod n`：$a\equiv b\pmod n$；
- 省略符`\ldots`：$\ldots$ 与 `\cdots`：$\cdots$，就是位置不一样的3个点;
- 一些希腊字母的变体形式，例如 `\epsilon`：$\epsilon$，`\varepsilon`：$\varepsilon$，`\phi`：$\phi$，`\varphi`：$\varphi$。

## 空格

由于`MathJax`的空间管理比较特殊，所以`a.b`或者 `a....b`（…表示空格），都会显示为 `a b`：$a b$。如果要增加间隙，可以使用：
- `a\,b`：$a\,b$；
- `a\;b`：$a\;b$；
- `a \quad b`：$a \quad b$；
- `a \qquad b`：$a \qquad b$。
- 还有一种比较方便的方法是不使用转义字符`\`而是这样 `a~b`：$a~b$，`~`可以表示一个空格。

## 顶部符号

- 对于单字符，`\hat x`：$\hat {x}$；
- 对于多字符，`\widehat {xy}`：$\widehat {xy}$；
- `\overline {xy}`：$\overline {xy}$；
- `\vec {xy}`：$\vec {xy}$；
- `\overrightarrow {xy}`：$\overrightarrow {xy}$；
- `\dot {xy}`：$\dot {xy}$；
- `\ddot {xy}`：$\ddot {xy}$。

# 表格

可以使用` $$\begin{array}{列样式} ... \end{array}$$ `的方式来创建表格。

- 其中`列样式`，可以使用`c`、`l`、`r`分别表示`居中`、`左对齐`、`右对齐`。
- 每行之间使用 `\\` 来分隔（本来是 `\`，但是在 Markdown 中第一个 `\` 被解释为转义字符，所以需要使用 `\\`），每列之间使用`&`来分隔。
- 在列样式中写入`|`可表示一条竖线，在每行前面加上`\hline`可在本行前加入一条直线。

例如：

```text
$$
\begin{array}{c|lcr}
n & \text{Left} & \text{Center} & \text{Right} \\
\hline
1 & 0.24 & 1 & 125 \\
2 & -1 & 189 & -8 \\
3 & -20 & 2000 & 1+10i \\
\end{array}
$$
```

$$
\begin{array}{c|lcr}
n & \text{Left} & \text{Center} & \text{Right} \\
\hline
1 & 0.24 & 1 & 125 \\
2 & -1 & 189 & -8 \\
3 & -20 & 2000 & 1+10i \\
\end{array}
$$

# 矩阵

## 基础用法

可以使用` $$\begin{matrix} ... \end{matrix}$$ `来表示矩阵，同样使用`\\`作为行分隔符，`&`使用列分隔符。

例如：

```text
$$
\begin{matrix}
1 & x & x^2 \\
1 & y & y^2 \\
1 & z & z^2 \\
\end{matrix}
$$
```

$$
\begin{matrix}
1 & x & x^2 \\
1 & y & y^2 \\
1 & z & z^2 \\
\end{matrix}
$$

## 矩阵中的括号

如果要加括号，可以使用`\left`和`\right`，也可以使用特殊的`Matrix`，例如：

- 单独加括号

```text
$$
\left ( \begin{matrix}
1 & x & x^2 \\
1 & y & y^2 \\
1 & z & z^2 \\
\end{matrix} \right )
$$
```

$$
\left ( \begin{matrix}
1 & x & x^2 \\
1 & y & y^2 \\
1 & z & z^2 \\
\end{matrix} \right )
$$

- 使用`pmatrix`

```text
$$
\begin{pmatrix}
1 & x & x^2 \\
1 & y & y^2 \\
1 & z & z^2 \\
\end{pmatrix}
$$
```

$$
\begin{pmatrix}
1 & x & x^2 \\
1 & y & y^2 \\
1 & z & z^2 \\
\end{pmatrix}
$$

- 使用`bmatrix`

```text
$$
\begin{bmatrix}
1 & x & x^2 \\
1 & y & y^2 \\
1 & z & z^2 \\
\end{bmatrix}
$$
```

$$
\begin{bmatrix}
1 & x & x^2 \\
1 & y & y^2 \\
1 & z & z^2 \\
\end{bmatrix}
$$

- 使用`Bmatrix`

```text
$$
\begin{Bmatrix}
1 & x & x^2 \\
1 & y & y^2 \\
1 & z & z^2 \\
\end{Bmatrix}
$$
```

$$
\begin{Bmatrix}
1 & x & x^2 \\
1 & y & y^2 \\
1 & z & z^2 \\
\end{Bmatrix}
$$

- 使用`vmatrix`

```text
$$
\begin{vmatrix}
1 & x & x^2 \\
1 & y & y^2 \\
1 & z & z^2 \\
\end{vmatrix}
$$
```

$$
\begin{vmatrix}
1 & x & x^2 \\
1 & y & y^2 \\
1 & z & z^2 \\
\end{vmatrix}
$$

- 使用`Vmatrix`

```text
$$
\begin{Vmatrix}
1 & x & x^2 \\
1 & y & y^2 \\
1 & z & z^2 \\
\end{Vmatrix}
$$
```

$$
\begin{Vmatrix}
1 & x & x^2 \\
1 & y & y^2 \\
1 & z & z^2 \\
\end{Vmatrix}
$$

## 矩阵中的省略元素

可以使用`\cdots`：$\cdots$、`\ddots`：$\ddots$、`\vdots`：$\vdots$，来省略矩阵中的元素，例如：

```text
$$
\begin{pmatrix}
1 & x & x^2 & \cdots & x^n \\
1 & y & y^2 & \cdots & y^n \\
1 & z & z^2 & \cdots & z^n \\
\vdots & \vdots & \vdots & \ddots & \vdots \\
1 & n & n^2 & \cdots & n^n \\
\end{pmatrix}
$$
```

$$
\begin{pmatrix}
1 & x & x^2 & \cdots & x^n \\
1 & y & y^2 & \cdots & y^n \\
1 & z & z^2 & \cdots & z^n \\
\vdots & \vdots & \vdots & \ddots & \vdots \\
1 & n & n^2 & \cdots & n^n \\
\end{pmatrix}
$$

## 增广矩阵

增广矩阵需要使用前面的`array`来实现，例如：

```text
$$ 
\left[
  \begin{array}{cc|c}
  1 & 2 & 3 \\
  4 & 5 & 6
  \end{array}
\right]
$$
```

$$
\left[
  \begin{array}{cc|c}
  1 & 2 & 3 \\
  4 & 5 & 6
  \end{array}
\right]
$$

# 公式对齐

如果需要一系列的公式中等号对齐，可以使用` $$\begin{align} ... \end{align}$$ `，其中使用 `&` 来对其位置，例如：

```text
$$
\begin{align}
\sqrt{37} & = \sqrt{\frac{73^2-1}{12^2}} \\
 & = \sqrt{\frac{73^2}{12^2}\cdot\frac{73^2-1}{73^2}} \\
 & = \sqrt{\frac{73^2}{12^2}}\sqrt{\frac{73^2-1}{73^2}} \\
 & = \frac{73}{12}\sqrt{1 - \frac{1}{73^2}} \\
 & \approx \frac{73}{12}\left(1 - \frac{1}{2\cdot73^2}\right)
\end{align}
$$
```

$$
\begin{align}
\sqrt{37} & = \sqrt{\frac{73^2-1}{12^2}} \\
 & = \sqrt{\frac{73^2}{12^2}\cdot\frac{73^2-1}{73^2}} \\
 & = \sqrt{\frac{73^2}{12^2}}\sqrt{\frac{73^2-1}{73^2}} \\
 & = \frac{73}{12}\sqrt{1 - \frac{1}{73^2}} \\
 & \approx \frac{73}{12}\left(1 - \frac{1}{2\cdot73^2}\right)
\end{align}
$$

# 分类表示

分类表达式可以使用 ` $$\begin{cases} ... \end{cases}$$ ` ，其中使用`\`来分类，使用`&`指示对齐的位置，例如：

```text
$$
f(n) =
\begin{cases}
n/2,  & \text{if $n$ is even} \\
3n+1, & \text{if $n$ is odd}  \\
\end{cases}
$$
```

$$
f(n) =
\begin{cases}
n/2,  & \text{if $n$ is even} \\
3n+1, & \text{if $n$ is odd}  \\
\end{cases}
$$

上述公式的括号也可以移动到右侧，不过需要使用`array`来实现，如下：

```text
$$
\left.
\begin{array}{l}
\text{if $n$ is even:}&n/2\\
\text{if $n$ is odd:}&3n+1
\end{array}
\right\}
=f(n)
$$
```

$$
\left.
\begin{array}{l}
\text{if $n$ is even:}&n/2\\
\text{if $n$ is odd:}&3n+1
\end{array}
\right\}
=f(n)
$$

最后，如果想分类之间的垂直间隔变大，可以使用`\[2ex]`代替`\`来分隔不同的情况。(`3ex`，`4ex`也可以用，`1ex`相当于原始距离）。

```text
$$
f(n) =
\begin{cases}
n/2,  & \text{if $n$ is even} \\[3ex]
3n+1, & \text{if $n$ is odd}  \\
\end{cases}
$$
```

$$
f(n) =
\begin{cases}
n/2,  & \text{if $n$ is even} \\[3ex]
3n+1, & \text{if $n$ is odd}  \\
\end{cases}
$$

# 空间问题

## 不要在再指数或者积分中使用 `\frac`

不要在再指数或者积分中使用 `\frac`，在指数或者积分表达式中使用 `\frac`会使表达式看起来不清晰，因此在专业的数学排版中很少被使用。应该使用一个水平的`/`来代替，效果如下：

```text
$$
\begin{array}{cc}
\mathrm{Bad} & \mathrm{Better} \\
\hline \\
e^{i\frac{\pi}2} \quad e^{\frac{i\pi}2}& e^{i\pi/2} \\
\int_{-\frac\pi2}^\frac\pi2 \sin x\,dx & \int_{-\pi/2}^{\pi/2}\sin x\,dx \\
\end{array}
$$
```

$$
\begin{array}{cc}
\mathrm{Bad} & \mathrm{Better} \\
\hline \\
e^{i\frac{\pi}2} \quad e^{\frac{i\pi}2}& e^{i\pi/2} \\
\int_{-\frac\pi2}^\frac\pi2 \sin x\,dx & \int_{-\pi/2}^{\pi/2}\sin x\,dx \\
\end{array}
$$

## 使用 `\mid` 代替 `|` 作为分隔符

使用 `\mid` 代替 `|` 作为分隔符，符号 `|` 作为分隔符时有排版空间大小的问题，应该使用`\mid`代替。效果如下：

```text
$$
\begin{array}{cc}
\mathrm{Bad} & \mathrm{Better} \\
\hline \\
\{x|x^2\in\Bbb Z\} & \{x\mid x^2\in\Bbb Z\} \\
\end{array}
$$
```

$$
\begin{array}{cc}
\mathrm{Bad} & \mathrm{Better} \\
\hline \\
\{x|x^2\in\Bbb Z\} & \{x\mid x^2\in\Bbb Z\} \\
\end{array}
$$

## 多重积分

对于多重积分，不要使用`\int\int`此类的表达，应该使用`\iint` `\iiint`等特殊形式。效果如下：

```text
$$
\begin{array}{cc}
\mathrm{Bad} & \mathrm{Better} \\
\hline \\
\int\int_S f(x)\,dy\,dx & \iint_S f(x)\,dy\,dx \\
\int\int\int_V f(x)\,dz\,dy\,dx & \iiint_V f(x)\,dz\,dy\,dx
\end{array}
$$
```

$$
\begin{array}{cc}
\mathrm{Bad} & \mathrm{Better} \\
\hline \\
\int\int_S f(x)\,dy\,dx & \iint_S f(x)\,dy\,dx \\
\int\int\int_V f(x)\,dz\,dy\,dx & \iiint_V f(x)\,dz\,dy\,dx
\end{array}
$$

# 连分数

书写连分数表达式时，请使用`\cfrac`代替`\frac`或者`\over`两者效果对比如下:

```text
$$
x = a_0 + \cfrac{1^2}{a_1
          + \cfrac{2^2}{a_2
            + \cfrac{3^2}{a_3 + \cfrac{4^4}{a_4 + \cdots}}}} \tag{\cfrac}
$$
```

$$
x = a_0 + \cfrac{1^2}{a_1
          + \cfrac{2^2}{a_2
            + \cfrac{3^2}{a_3 + \cfrac{4^4}{a_4 + \cdots}}}} \tag{\cfrac}
$$

```text
$$
x = a_0 + \frac{1^2}{a_1
          + \frac{2^2}{a_2
            + \frac{3^2}{a_3 + \frac{4^4}{a_4 + \cdots}}}} \tag{\frac}
$$
```

$$
x = a_0 + \frac{1^2}{a_1
          + \frac{2^2}{a_2
            + \frac{3^2}{a_3 + \frac{4^4}{a_4 + \cdots}}}} \tag{\frac}
$$

# 方程组

对于方程组可以使用`\begin{array} ... \end{array}`与`\left{ ... \right.`配合，表示方程组：

```text
$$
\left\{
\begin{array}{c}
a_1x+b_1y+c_1z=d_1 \\
a_2x+b_2y+c_2z=d_2 \\
a_3x+b_3y+c_3z=d_3
\end{array}
\right.
$$
```

$$
\left\{
\begin{array}{c}
a_1x+b_1y+c_1z=d_1 \\
a_2x+b_2y+c_2z=d_2 \\
a_3x+b_3y+c_3z=d_3
\end{array}
\right.
$$

同时，还可以使用`\begin{cases} ... \end{cases}`表达同样的方程组，如：

```text
$$
\begin{cases}
a_1x+b_1y+c_1z=d_1 \\
a_2x+b_2y+c_2z=d_2 \\
a_3x+b_3y+c_3z=d_3
\end{cases}
$$
```

$$
\begin{cases}
a_1x+b_1y+c_1z=d_1 \\
a_2x+b_2y+c_2z=d_2 \\
a_3x+b_3y+c_3z=d_3
\end{cases}
$$

对齐方程组中的 `=` 号，可以使用 `\being{aligned} ... \end{aligned}`，如：

```text
$$
\left\{
\begin{aligned}
a_1x+b_1y+c_1z &=d_1+e_1 \\
a_2x+b_2y&=d_2 \\
a_3x+b_3y+c_3z &=d_3
\end{aligned}
\right.
$$
```

$$
\left\{
\begin{aligned}
a_1x+b_1y+c_1z &=d_1+e_1 \\
a_2x+b_2y&=d_2 \\
a_3x+b_3y+c_3z &=d_3
\end{aligned}
\right.
$$

如果要对齐 `=` 号 和项，可以使用`\being{array}{列样式} ... \end{array}`，如：

```text
$$
\left\{
\begin{array}{ll}
a_1x+b_1y+c_1z &=d_1+e_1 \\
a_2x+b_2y &=d_2 \\
a_3x+b_3y+c_3z &=d_3
\end{array}
\right.
$$
```

$$
\left\{
\begin{array}{ll}
a_1x+b_1y+c_1z &=d_1+e_1 \\
a_2x+b_2y &=d_2 \\
a_3x+b_3y+c_3z &=d_3
\end{array}
\right.
$$

# 颜色

命名颜色是浏览器相关的，如果浏览器没有定义相关的颜色名称，则相关文本将被渲染为黑色，具体列表如下：

$$
\begin{array}{|rc|}
\hline
\verb+\color{black}{text}+ & \color{black}{text} \\
\verb+\color{gray}{text}+ & \color{gray}{text} \\
\verb+\color{silver}{text}+ & \color{silver}{text} \\
\verb+\color{white}{text}+ & \color{white}{text} \\
\hline
\verb+\color{maroon}{text}+ & \color{maroon}{text} \\
\verb+\color{red}{text}+ & \color{red}{text} \\
\verb+\color{yellow}{text}+ & \color{yellow}{text} \\
\verb+\color{lime}{text}+ & \color{lime}{text} \\
\verb+\color{olive}{text}+ & \color{olive}{text} \\
\verb+\color{green}{text}+ & \color{green}{text} \\
\verb+\color{teal}{text}+ & \color{teal}{text} \\
\verb+\color{aqua}{text}+ & \color{aqua}{text} \\
\verb+\color{blue}{text}+ & \color{blue}{text} \\
\verb+\color{navy}{text}+ & \color{navy}{text} \\
\verb+\color{purple}{text}+ & \color{purple}{text} \\
\verb+\color{fuchsia}{text}+ & \color{magenta}{text} \\
\hline
\end{array}
$$

# 公式的标记与引用

使用`\tag{yourtag}`来标记公式，如果想在之后引用该公式，则还需要加上`\label{yourlabel}`在`\tag`之后，如:

```text
$$
a := x^2-y^3 \tag{1-1}\label{1-1}
$$
```

$$
a := x^2-y^3 \tag{1-1}\label{1-1}
$$


为了引用公式，可以使用`\eqref{rlabel}`，如：

$$
a+y^3 \stackrel{\eqref{1-1}}= x^2
$$

```text
$$
a+y^3 \stackrel{\eqref{1-1}}= x^2
$$
```
