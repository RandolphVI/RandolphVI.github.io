---
title: Fundamentals of Data Visualization A Primer on Making Infor
author: Claus O. Wilke
date: 2025-03-11
cover: "https://res.weread.qq.com/wrepub/CB_GJC4ms4k91JU6do6cNGRh5AH_parsecover"
progress: "17%"
readingTime: 0小时42分钟
publisher: "O'Reilly Media"
---
## 2. Visualizing Data: Mapping Data onto Aesthetics

> [插图]Figure 2-1. Commonly used aesthetics in data visualization: position, shape, size, color, line width, line type. Some of these aesthetics can represent both continuous and discrete data (position, size, line width, color), while others can usually only represent discrete data (shape, line type).图 2-1. 数据可视化中常用的美学：位置、形状、大小、颜色、线条宽度、线条类型。其中一些美学可以同时表示连续和离散数据（位置、大小、线条宽度、颜色），而其他美学通常只能表示离散数据（形状、线条类型）。 

> [插图]Figure 2-5. Fuel efficiency versus displacement, for 32 cars (1973–74 models). This figure uses five separate scales to represent data: (i) the x axis (displacement); (ii) the y axis (fuel efficiency); (iii) the color of the data points (power); (iv) the size of the data points (weight); and (v) the shape of the data points (number of cylinders). Four of the five variables displayed (displacement, fuel efficiency, power, and weight) are numerical continuous. The remaining one (number of cylinders) can be considered to be either numerical discrete or qualitative ordered. Data source: Motor Trend, 1974.图 2-5. 燃油效率与排量对比图，涉及 32 款车型（1973-1974 年车型）。该图使用 5 个单独的标尺来表示数据：（i）x 轴（排量）；（ii）y 轴（燃油效率）；（iii）数据点的颜色（功率）；（iv）数据点的大小（重量）；（v）数据点的形状（汽缸数量）。显示的 5 个变量中的 4 个（排量、燃油效率、功率和重量）是数值连续的。剩下的 1 个变量（汽缸数量）可以被认为是数值离散的或定性的有序的。资料来源：《汽车趋势》，1974 年。 

## 3. Coordinate Systems and Axes

> [插图]Figure 3-2. Daily temperature normals for Houston, TX. Temperature is mapped to the y axis and day of the year to the x axis. Parts (a), (b), and (c) show the same figure in different aspect ratios. All three parts are valid visualizations of the temperature data. Data source: NOAA.图3-2. 休斯顿， TX的每日温度正常值. 温度被映射到y轴上， 年中的天数被映射到x轴上. 部分（a）, （b）， 和（c）显示了相同的图表在不同的长宽比. 所有三个部分都是温度数据的有效可视化. 数据来源: NOAA。 

> You may wonder what happens if you change the units of your data. After all, units are arbitrary, and your preferences might be different from somebody else’s. A change in units is a linear transformation, where we add or subtract a number to or from all data values and/or multiply all data values with another number. Fortunately, Cartesian coordinate systems are invariant under such linear transformations. Therefore, you can change the units of your data and the resulting figure will not change as long as you change the axes accordingly. As an example, compare Figures 3-3a and 3-3b. Both show the same data, but in part (a) the temperature units are degrees Fahrenheit and in part (b) they are degrees Celsius. Even though the grid lines are in different locations and the numbers along the axes are different, the two data visualizations look exactly the same.你可能想知道，如果改变数据单位会发生什么情况。毕竟，单位是随意的，你的偏好可能与他人不同。改变单位是一种线性变换，即将一个数加到或减去所有数据值，或将所有数据值与另一个数相乘。幸运的是，笛卡尔的坐标系统在这种线性变换下是不变的。因此，你可以改变数据单位，只要相应地改变轴，所得到的图形就不会改变。例如，比较图3-3a和图3-3b。这两幅图都显示了相同的数据，但在（a）中，温度单位是华氏度，而在（b）中，温度单位是摄氏度。即使网格线在不同的位置，轴上的数字不同，这两个数据可视化看起来完全一样。 

> [插图]Figure 3-5. Population numbers of Texas counties relative to their median value. Select counties are highlighted by name. The dashed line indicates a ratio of 1, corresponding to a county with median population number. The most populous counties have approximately 100 times more inhabitants than the median county, and the least populous counties have approximately 100 times fewer inhabitants than the median county. Data source: 2010 US Decennial Census.图 3-5. 德克萨斯州各县的人口数量与其中位数的比较。被选中县的名称被突出显示。虚线表示 1 的比率，对应于人口数量中位数的县。人口最多的县大约比中位数县多 100 倍居民，人口最少的县大约比中位数县少 100 倍居民。数据来源：2010 年美国十年一次的人口普查。 

> Figure 3-10. Daily temperature normals for four selected locations in the US, shown in polar coordinates. The radial distance from the center point indicates the daily temperature in Fahrenheit, and the days of the year are arranged counterclockwise starting with Jan. 1st at the 6:00 position. Data source: NOAA.图3-10.美国四个选定地点的每日温度标准，以极坐标表示。从中心点的径向距离表示华氏度的每日温度，以逆时针方向排列一年中的天数，从1月1日开始，位置为6:00。数据来源：美国国家海洋和大气管理局。 

## 4. Color Scales

> [插图]Figure 4-1. Example qualitative color scales. The Okabe Ito scale is the default scale used throughout this book [Okabe and Ito 2008]. The ColorBrewer Dark2 scale is provided by the ColorBrewer project [Brewer 2017]. The ggplot2 hue scale is the default qualitative scale in the widely used plotting software ggplot2.图 4-1. 示例定性颜色标尺。Okabe Ito 标尺是本书中使用的默认标尺【Okabe and Ito 2008】。ColorBrewer Dark2 标尺由 ColorBrewer 项目提供【Brewer 2017】。ggplot2 hue 标尺是广泛使用的绘图软件 ggplot2 中的默认定性标尺。 

> Figure 4-3. Example sequential color scales. The ColorBrewer Blues scale is a monochromatic scale that varies from dark to light blue. The Heat and Viridis scales are multihue scales that vary from dark red to light yellow and from dark blue via green to light yellow, respectively.图 4-3. 示例序列颜色标尺。ColorBrewer Blues 标尺是一个从深蓝色到浅蓝色的单色标尺。Heat 和 Viridis 标尺是多色标尺，分别从深红色到浅黄色和从深蓝色到绿色再到浅黄色变化。 

> Figure 4-5. Example diverging color scales. Diverging scales can be thought of as two sequential scales stitched together at a common midpoint color. Common color choices for diverging scales include brown to greenish blue, pink to yellow-green, and blue to red.图 4-5. 渐变颜色刻度的示例. 渐变刻度可以看作是两个连续刻度，在共同的中点颜色处缝合在一起. 渐变刻度的常见颜色选择包括棕色到蓝绿色，粉红色到黄绿色，以及蓝色到红色。 

> Figure 4-6. Percentage of people identifying as white in Texas counties. Whites are in the majority in North and East Texas but not in South or West Texas. Data source: 2010 US Decennial Census.图 4-6. 德克萨斯州各县白人比例。白人在北德克萨斯州和东德克萨斯州占多数，但在南德克萨斯州和西德克萨斯州并非如此。数据来源：2010 年美国十年一次的人口普查。 

> Color can also be an effective tool to highlight specific elements in the data. There may be specific categories or values in the dataset that carry key information about the story we want to tell, and we can strengthen the story by emphasizing the relevant figure elements to the reader. An easy way to achieve this emphasis is to color these figure elements in a color or set of colors that vividly stand out against the rest of the figure. This effect can be achieved with accent color scales, which are color scales that contain both a set of subdued colors and a matching set of stronger, darker, and/or more saturated colors (Figure 4-7).颜色也可以是突出数据中特定元素的有效工具。数据集中可能存在特定类别或值，它们承载着我们想要讲述的故事的关键信息，我们可以通过强调向读者展示这些相关的图表元素来加强故事的说服力。实现强调的一种简单方法是，将这些图表元素着色，使其与图表中的其他元素形成鲜明对比。这种效果可以通过强调色标来实现，即包含一组柔和颜色和一组更强烈、更深、更饱和的匹配颜色的色标（图 4-7）。 

> Figure 4-7. Example accent color scales, each with four base colors and three accent colors. Accent color scales can be derived in several different ways: (top) we can take an existing color scale (e.g., the Okabe Ito scale, Figure 4-1) and lighten and/or partially desaturate some colors while darkening others; (middle) we can take gray values and pair them with colors; (bottom) we can use an existing accent color scale (e.g., the one from the ColorBrewer project).图 4-7. 示例强调色标尺，每个标尺有 4 个基础色和 3 个强调色。强调色标尺可以以几种不同的方式生成：（上）我们可以使用现有的色标尺（例如 Okabe Ito 色标尺，图 4-1），并使某些颜色变浅或部分去饱和，同时使其他颜色变暗；（中）我们可以使用灰度值并将它们与颜色配对；（下）我们可以使用现有的强调色标尺（例如 ColorBrewer 项目中的强调色标尺）。 

> When working with accent colors, it is critical that the baseline colors do not compete for attention. Notice how drab the baseline colors are in Figure 4-8, yet they work well to support the accent color. It is easy to make the mistake of using baseline colors that are too colorful, so that they end up competing for the reader’s attention against the accent colors. There is an easy remedy, however: just remove all color from all elements in the figure except the highlighted data categories or points. An example of this strategy is provided in Figure 4-9.在使用强调色时，关键是要让基线颜色不争夺注意力。请注意图 4-8 中基线颜色的单调乏味，然而它们很好地支持了强调色。人们很容易犯下使用过于花哨的基线颜色的错误，以至于它们最终与强调色争夺读者的注意力。然而，有一个简单的补救措施：从图 4-9 中的所有元素中移除所有颜色，除了突出显示的数据类别或数据点。该策略的一个示例如图 4-9 所示。
