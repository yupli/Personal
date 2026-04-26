# 最大流问题

很多生产、物流类场景都可以建成弧上带流量上界的网络：在源点有供应、在汇点有需求或接收，希望在满足弧容量与平衡条件的前提下，从源到汇输送尽可能多的流量。这就是经典的最大流问题（Maximum Flow Problem, MFP）。

## 2.3.1 问题描述

下面借助油气输送的例子说明，如何把具体情景写成线性规划；叙述与数表可参见教材（如 Winston and Goldberg, 2004 等）中的同类写法。

某油气加工公司需进行油料输送。输送网络为带源点 $\mathrm{so}$ 与汇点 $\mathrm{si}$ 的管道网络（见下图 2.4）。油料从源到汇中途径中间站点 $1$、$2$、$3$。不同管段因管径等差异具有不同最大通过能力；表 2.1 给出各有向弧的容量，单位为百万桶/小时。希望建立线性规划模型，求该网络在例如「每小时能输送几百万桶」意义下的最大通过能力。

表 2.1 石油运输问题的弧容量（百万桶/时）

| 弧 | 容量 |
|:--:|:--:|
| $(\mathrm{so},1)$ | 2 |
| $(\mathrm{so},2)$ | 3 |
| $(1,2)$ | 3 |
| $(1,3)$ | 4 |
| $(3,\mathrm{si})$ | 1 |
| $(2,\mathrm{si})$ | 2 |

<figure>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 200" width="100%" max-width="420" aria-label="图 2.4 石油运输网络，弧上数字为容量">
  <text x="0" y="16" font-size="13" fill="#333">图 2.4 石油运输网络图（弧上数字为容量；底部虚线为回流示意）</text>
  <defs>
    <marker id="mfl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#1976d2" />
    </marker>
  </defs>
  <g transform="translate(0, 24)" font-size="12" text-anchor="middle" fill="#333">
    <circle cx="40" cy="110" r="12" fill="#5c5c5c" /><text x="40" y="115" font-size="11" fill="#fff" font-weight="600">so</text>
    <circle cx="120" cy="110" r="12" fill="#5c5c5c" /><text x="120" y="115" font-size="11" fill="#fff" font-weight="600">1</text>
    <circle cx="220" cy="110" r="12" fill="#5c5c5c" /><text x="220" y="115" font-size="11" fill="#fff" font-weight="600">2</text>
    <circle cx="160" cy="40" r="12" fill="#5c5c5c" /><text x="160" y="45" font-size="11" fill="#fff" font-weight="600">3</text>
    <circle cx="360" cy="110" r="12" fill="#5c5c5c" /><text x="360" y="115" font-size="11" fill="#fff" font-weight="600">si</text>
  </g>
  <g transform="translate(0, 24)" fill="none" stroke="#1976d2" stroke-width="1.6" font-size="11" fill-opacity="1">
    <line x1="52" y1="110" x2="108" y2="110" marker-end="url(#mfl)" />
    <text x="80" y="102" text-anchor="middle" fill="#c62828" font-size="12">2</text>
    <path d="M52,100 Q110,0 220,100" marker-end="url(#mfl)" />
    <text x="150" y="24" text-anchor="middle" fill="#c62828" font-size="12">3</text>
    <line x1="130" y1="46" x2="152" y2="100" marker-end="url(#mfl)" />
    <text x="128" y="80" text-anchor="middle" fill="#c62828" font-size="12">4</text>
    <line x1="132" y1="110" x2="208" y2="110" marker-end="url(#mfl)" />
    <text x="170" y="102" text-anchor="middle" fill="#c62828" font-size="12">3</text>
    <line x1="170" y1="52" x2="350" y2="100" marker-end="url(#mfl)" />
    <text x="255" y="64" text-anchor="middle" fill="#c62828" font-size="12">1</text>
    <line x1="232" y1="110" x2="348" y2="110" marker-end="url(#mfl)" />
    <text x="290" y="102" text-anchor="middle" fill="#c62828" font-size="12">2</text>
    <path d="M360,120 Q200,200 40,120" stroke-dasharray="5 4" stroke="#888" fill="none" />
    <text x="200" y="196" text-anchor="middle" fill="#555" font-size="12">a₀（总流量；建模见 2.3.2）</text>
  </g>
</svg>
<figcaption style="font-size:0.9em;color:#555;margin-top:0.3em">与教材图 2.4 同构；底部回流弧在模型里用 $x_0$（或记 $a_0$）与人工弧配合实现平衡。</figcaption>
</figure>

## 2.3.2 问题建模及最优解

为便于在各节点上写出「入流 = 出流」的平衡式，常采用一种技巧：在汇点 $\mathrm{si}$ 到源点 $\mathrm{so}$ 之间人工添加一条有向弧（教材中自汇向源，记法与 $(\mathrm{si},\mathrm{so})$ 一致；有的书写为辅助弧）。设该人工弧上的流量为 $x_0$（图 2.4 中有时把待最大化的总流量标注在回流弧上为 $a_0$，与 $x_0$ 在含义上对应同一流量值）。该弧并不对应真实管输，只用于在模型中把净流量统一写成闭网络形式。

设 $x_{ij}$ 为弧 $(i,j)$ 上每小时通过的流量（百万桶）。在教材给出的一个可行解或最优解（可对照图 2.5）中，有

- $x_{\mathrm{so},1} = 2,\quad x_{\mathrm{so},2} = 0$  
- $x_{12} = 2,\quad x_{13} = 0$  
- $x_{3,\mathrm{si}} = 0,\quad x_{2,\mathrm{si}} = 2$  
- 人工/回流方向取 $x_{\mathrm{si},\mathrm{so}} = 2$（与 $x_0$ 同值，表示网络总流量为 2）  

此配置下，网络最大流量为 2（百万桶/时）。

<figure>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 200" width="100%" max-width="420" aria-label="图 2.5 石油运输可行流，弧上 (流量) 容量">
  <text x="0" y="16" font-size="13" fill="#333">图 2.5 石油运输问题的一个可行解（弧上格式：(流量) 容量）</text>
  <g transform="translate(0, 24)">
  <defs>
    <marker id="mfl2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#2e7d32" />
    </marker>
  </defs>
  <g font-size="12" text-anchor="middle" fill="#333">
    <circle cx="40" cy="110" r="12" fill="#5c5c5c" /><text x="40" y="115" font-size="11" fill="#fff" font-weight="600">so</text>
    <circle cx="120" cy="110" r="12" fill="#5c5c5c" /><text x="120" y="115" font-size="11" fill="#fff" font-weight="600">1</text>
    <circle cx="220" cy="110" r="12" fill="#5c5c5c" /><text x="220" y="115" font-size="11" fill="#fff" font-weight="600">2</text>
    <circle cx="160" cy="40" r="12" fill="#5c5c5c" /><text x="160" y="45" font-size="11" fill="#fff" font-weight="600">3</text>
    <circle cx="360" cy="110" r="12" fill="#5c5c5c" /><text x="360" y="115" font-size="11" fill="#fff" font-weight="600">si</text>
  </g>
  <g fill="none" stroke="#2e7d32" stroke-width="1.6">
    <line x1="52" y1="110" x2="108" y2="110" marker-end="url(#mfl2)" />
    <text x="80" y="100" text-anchor="middle" fill="#333" font-size="11">(2)2</text>
    <line x1="130" y1="50" x2="152" y2="100" marker-end="url(#mfl2)" />
    <text x="130" y="80" text-anchor="middle" fill="#333" font-size="11">(0)4</text>
    <line x1="132" y1="110" x2="208" y2="110" marker-end="url(#mfl2)" />
    <text x="170" y="100" text-anchor="middle" fill="#333" font-size="11">(2)3</text>
    <line x1="170" y1="52" x2="350" y2="100" marker-end="url(#mfl2)" />
    <text x="255" y="64" text-anchor="middle" fill="#333" font-size="11">(0)1</text>
    <line x1="232" y1="110" x2="348" y2="110" marker-end="url(#mfl2)" />
    <text x="290" y="100" text-anchor="middle" fill="#333" font-size="11">(2)2</text>
    <path d="M360,120 Q200,200 40,120" stroke-dasharray="4 3" stroke="#666" fill="none" />
    <text x="200" y="198" text-anchor="middle" fill="#333" font-size="12">x₀(2)</text>
  </g>
  </g>
</svg>
<figcaption style="font-size:0.9em;color:#555;margin-top:0.3em">与教材图 2.5 同构，总流值为 2；与上段给出一组解一致。弧 (so,2) 上流量为 0，故图中从 so 到 2 的管段在可行解中无流，可不必单独画标签。</figcaption>
</figure>

**注**：一般情形的弧与节点平衡见下两节；教材《运筹优化常用模型、算法及案例实战：Python+Java 实现》第 14 页附近给出下述 (2.12)–(2.26) 的线性规划形式。

### 一般约束形式

可行流需满足容量与流平衡：

$$
0 \le x_{ij} \le \text{弧 } (i, j) \text{ 的容量}, \quad \forall (i, j) \tag{2.12}
$$

$$
\text{流入点 } i \text{ 的流量} = \text{流出点 } i \text{ 的流量}, \quad \forall i \tag{2.13}
$$

将人工弧 $(\mathrm{si},\mathrm{so})$ 及其流量 $x_0$ 显式放入模型，则极大化 $x_0$ 就等价于极大化从 $\mathrm{so}$ 到 $\mathrm{si}$ 的可行输送量。对本例，得到如下 LP（$z=x_0$ 为目标）。

$$
\max \quad z = x_0 \tag{2.14}
$$

弧容量（与表 2.1 一致）：

$$
\begin{aligned}
& x_{\mathrm{so},1} \le 2 \tag{2.15} \\
& x_{\mathrm{so},2} \le 3 \tag{2.16} \\
& x_{12} \le 3 \tag{2.17} \\
& x_{2,\mathrm{si}} \le 2 \tag{2.18} \\
& x_{13} \le 4 \tag{2.19} \\
& x_{3,\mathrm{si}} \le 1 \tag{2.20}
\end{aligned}
$$

流量平衡（本网络拓扑）：

$$
\begin{aligned}
& x_0 = x_{\mathrm{so},1} + x_{\mathrm{so},2} \tag{2.21} \\
& x_{\mathrm{so},1} = x_{12} + x_{13} \tag{2.22} \\
& x_{\mathrm{so},2} + x_{12} = x_{2,\mathrm{si}} \tag{2.23} \\
& x_{13} = x_{3,\mathrm{si}} \tag{2.24} \\
& x_{3,\mathrm{si}} + x_{2,\mathrm{si}} = x_0 \tag{2.25}
\end{aligned}
$$

$$
x_{ij} \ge 0, \quad \text{对图中出现的弧 } (i,j) \tag{2.26}
$$

**注**：(2.15)–(2.20) 为弧上容量；(2.21)–(2.25) 为在添加人工弧后的节点平衡；模型搭好后可用任意 LP 软件求解。上一段给出的数值解使 $x_0=2$，与「最大 2 百万桶/时」一致。

## 2.3.3 最大流问题的一般模型

设有向图 $G = (V, E)$，$V$ 为顶点、$E$ 为边集。对每条有向边 $(i,j) \in E$ 有上界容量 $u_{ij}$。设 $\mathrm{so}$ 为源、$\mathrm{si}$ 为汇。在一般叙述中，用

- 决策变量 $x_e$ 表示在边 $e$ 上的流量；  
- 标量 $f$ 表示从 $\mathrm{so}$ 到 $\mathrm{si}$ 的总流量（即最大流问题要最大化的量）。

在流守恒表述下，可写为

$$
\max \quad f \tag{2.27}
$$

$$
\sum_{e \in \text{Out}(i)} x_e - \sum_{e \in \text{In}(i)} x_e = b_i, \quad \forall i \in V \tag{2.28}
$$

$$
0 \le x_e \le u_{ij}, \quad \forall e = (i,j) \in E \tag{2.29}
$$

其中 $b_i$ 的取值为：$i = \mathrm{so}$ 时 $b_i = f$；$i = \mathrm{si}$ 时 $b_i = -f$；其余中间节点上 $b_i = 0$。若采用与 2.3.2 相同的人工回流弧技巧，把 $f$ 与某条 $x_0$ 或等价标量对应起来，则一般模型与具体 LP 实现可一一对应。

**注**：(2.28) 中 $\text{Out}(i)$、$\text{In}(i)$ 分别表示离开、进入 $i$ 的弧的集合，与[最短路问题](shortest-path-problem.md) 中的 $\text{out}/\text{in}$ 写法同型，仅记法在教材中可能大小写不统一。最大流是网络流与组合优化的核心模型之一，可用专门算法或 LP/ILP 求解器计算。
