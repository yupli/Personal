# 整数规划建模技巧

本文整理混合整数规划（MIP）中常用的建模技巧，主要包括逻辑约束与非线性项的线性化等，可持续增补其他专题。

---

## 1. 逻辑约束

在数学规划中，经常需要把逻辑关系写成线性（或混合整数）约束。下面分三类：二选一约束、指示约束，以及布尔逻辑与门电路的线性化。

### 1.1 二选一约束（Either–Or）

设有两条约束：

$$
\begin{align}
f(x_1, x_2, \ldots, x_n) &\leq 0 \tag{3.1} \\
g(x_1, x_2, \ldots, x_n) &\leq 0 \tag{3.2}
\end{align}
$$

若要求至少满足其中一条（逻辑上的“或”），则称为二选一约束。

Big-M 线性化：引入 $0$–$1$ 变量 $y \in \{0,1\}$ 和充分大的正数 $M$，将条件写为：

$$
\begin{align}
f(x_1, x_2, \ldots, x_n) &\leq M y \tag{3.3} \\
g(x_1, x_2, \ldots, x_n) &\leq M(1 - y) \tag{3.4}
\end{align}
$$

直观说明：
- 当 $y = 0$ 时：（3.3）为 $f \leq 0$，（3.4）为 $g \leq M$，在 $M$ 足够大时后者基本不收紧，故强制 $f \leq 0$。
- 当 $y = 1$ 时：（3.3）为 $f \leq M$（通常不收紧），（3.4）为 $g \leq 0$，故强制 $g \leq 0$。

无论 $y$ 取 $0$ 还是 $1$，（3.1）与（3.2）中至少有一条被满足。

:::tip 软件实现

在 Gurobi 等求解器中，此类关系也可用通用约束（General Constraints，如 And/Or、指示类 API，如 `addGenConstrOr` 等）直接描述，避免手写 Big-M 或减轻调 $M$ 的负担。

:::

### 1.2 指示约束（Indicator）

有时需要刻画条件蕴含：例如，当 $f(x_1,\ldots,x_n) > 0$ 成立时，必须同时有 $g(x_1,\ldots,x_n) \geq 0$；当 $f \leq 0$ 时，对 $g$ 没有强制要求。

引入 $y \in \{0,1\}$ 与充分大的 $M$，可写为：

$$
\begin{align}
-g(x_1, x_2, \ldots, x_n) &\leq M y \tag{3.5} \\
f(x_1, x_2, \ldots, x_n) &\leq M(1 - y) \tag{3.6}
\end{align}
$$

其中 $M$ 需取得足够大，使得在可行域内恒有 $f \leq M$、$-g \leq M$（或按问题重新界定更紧的界）。

验证思路：
- 若 $f > 0$，为使（3.6）可行，必须有 $y = 0$；此时（3.5）给出 $-g \leq 0$，即 $g \geq 0$。
- 若 $f \leq 0$，则（3.6）允许 $y = 0$ 或 $y = 1$；取 $y = 1$ 时（3.5）变为 $-g \leq M$，通常不限制 $g$，即对 $g$ 无额外要求。

现代求解器中的 Indicator Constraint（指示约束）可直接写“$y=0 \Rightarrow$ 某不等式”等形式，不必显式使用大 $M$，数值上往往更稳。

### 1.3 逻辑运算的线性化

设 $x, x_i, y$ 均为 $0$–$1$ 变量。下表给出常见逻辑关系、符号、等价的线性约束及直观解释（在 $0$–$1$ 域内）。

| 逻辑关系 | 符号表达 | 等价线性约束 | 逻辑直觉 |
|----------|----------|--------------|----------|
| 非（NOT） | $y = \neg x$ | $y = 1 - x$（或写成 $y + x = 1$） | $x$ 为 $1$ 时 $y$ 必为 $0$，反之亦然。 |
| 与（AND） | $y = x_1 \wedge x_2 \wedge \cdots \wedge x_n$ | $\begin{cases} y \leq x_i,\ \forall i \\ y \geq \displaystyle\sum_{i=1}^n x_i - (n-1) \end{cases}$ | $y$ 不能超过任一 $x_i$；仅当全部为 $1$ 时，下界才迫使 $y = 1$。 |
| 或（OR） | $y = x_1 \vee x_2 \vee \cdots \vee x_n$ | $\begin{cases} y \geq x_i,\ \forall i \\ y \leq \displaystyle\sum_{i=1}^n x_i \end{cases}$ | 只要有一个 $x_i = 1$，$y$ 就至少为 $1$；全为 $0$ 时上界迫使 $y = 0$。 |
| 蕴含（If–Then） | $x_1 \Rightarrow x_2$ | $x_1 \leq x_2$ | 若 $x_1 = 1$，则 $x_2$ 必须为 $1$；$x_1 = 0$ 时对 $x_2$ 无限制。 |
| 等价（IFF） | $x_1 \Leftrightarrow x_2$ | $x_1 = x_2$（或 $x_1 - x_2 = 0$ 与两条不等式） | 两变量同 $0$ 同 $1$。 |
| 异或（XOR） | $y = x_1 \oplus x_2$ | $\begin{cases} y \leq x_1 + x_2 \\ y \geq x_1 - x_2 \\ y \geq x_2 - x_1 \\ y \leq 2 - x_1 - x_2 \end{cases}$ | 两输入相同则 $y=0$，不同则 $y=1$（两变量互斥情况）。 |
| 与非（NAND） | $y = \neg(x_1 \wedge x_2)$ | $\begin{cases} y \geq 1 - x_1 \\ y \geq 1 - x_2 \\ y \leq 2 - x_1 - x_2 \end{cases}$ | 仅当 $x_1 = x_2 = 1$ 时，上界与下界同时迫使 $y = 0$。 |
| 或非（NOR） | $y = \neg(x_1 \vee x_2)$ | $\begin{cases} y \leq 1 - x_1 \\ y \leq 1 - x_2 \\ y \geq 1 - x_1 - x_2 \end{cases}$ | 只要有一个为 $1$，上界使 $y = 0$；全为 $0$ 时下界使 $y = 1$。 |

上表第三列在格内已分多行；与教材一致时，还可将同一逻辑关系单独排成竖式（每条约束一行），例如：

与（AND） $y = x_1 \wedge x_2 \wedge \cdots \wedge x_n$：

$$
\begin{aligned}
y &\leq x_i, \quad \forall i \\
y &\geq \sum_{i=1}^n x_i - (n-1)
\end{aligned}
$$

或（OR） $y = x_1 \vee x_2 \vee \cdots \vee x_n$：

$$
\begin{aligned}
y &\geq x_i, \quad \forall i \\
y &\leq \sum_{i=1}^n x_i
\end{aligned}
$$

异或（XOR） $y = x_1 \oplus x_2$：

$$
\begin{aligned}
y &\leq x_1 + x_2 \\
y &\geq x_1 - x_2 \\
y &\geq x_2 - x_1 \\
y &\leq 2 - x_1 - x_2
\end{aligned}
$$

与非（NAND） $y = \neg(x_1 \wedge x_2)$：

$$
\begin{aligned}
y &\geq 1 - x_1 \\
y &\geq 1 - x_2 \\
y &\leq 2 - x_1 - x_2
\end{aligned}
$$

或非（NOR） $y = \neg(x_1 \vee x_2)$：

$$
\begin{aligned}
y &\leq 1 - x_1 \\
y &\leq 1 - x_2 \\
y &\geq 1 - x_1 - x_2
\end{aligned}
$$

> 注：上表中 AND/OR 的 $y$ 与多变量 $x_i$ 的联合定义，在 $0$–$1$ 整数规划下与布尔代数一致；XOR 等写法针对两个二元变量，推广到多变量需另行构造。

---

## 2. 线性化

当目标或约束中出现分段线性、绝对值、乘积、分式、$\max$/$\min$ 等非线性（或非凸）项时，常通过引入辅助变量与额外约束将其改写为线性或混合整数线性形式。下面分述常见情形。

### 2.1 分段线性函数线性化

设 $f(x)$ 为分段线性函数，已知断点 $b_1, b_2, \ldots, b_n$。可用非负权变量 $z_i$ 与 $0$–$1$ 区间指示变量 $y_i$ 将 $f(x)$ 与 $x$ 同时线性化。

第 1 步：在模型中凡出现 $f(x)$ 之处，用下式替换：

$$z_1 f(b_1) + z_2 f(b_2) + \cdots + z_n f(b_n).$$

第 2 步增加以下约束（使 $x$ 落在某一段上，$f$ 为端点值凸组合，即分段线性插值）：

$$
\begin{aligned}
& z_1 \leq y_1, \\
& z_2 \leq y_1 + y_2, \\
& z_3 \leq y_2 + y_3, \\
& \qquad \vdots \\
& z_{n-1} \leq y_{n-2} + y_{n-1}, \\
& z_n \leq y_{n-1}, \\
& y_1 + y_2 + \cdots + y_{n-1} = 1, \\
& z_1 + z_2 + \cdots + z_n = 1, \\
& x = z_1 b_1 + z_2 b_2 + \cdots + z_n b_n, \\
& y_i \in \{0,1\}, \quad i=1,\ldots,n-1, \\
& z_i \geq 0, \quad i=1,\ldots,n.
\end{aligned}
$$

直观理解：$y$ 的取值唯一激活一段区间，$z$ 的系数结构使仅有相邻断点权可同时非零，从而 $x$ 位于某一子区间上，$f(x)$ 为两端点 $f(b_i)$ 的线性插值。许多商业求解器也提供 SOS2 等专用结构，可替代上述显式 $y$ 表示。

### 2.2 含绝对值形式的线性化

含绝对值的目标（如 $\min |x_1| + |x_2|$）可通过对每个变量引入一正一负辅助量完成线性化。

原问题示例（非光滑）：

$$
\begin{aligned}
\min \quad & |x_1| + |x_2| \\
\text{s.t.} \quad & x_1, x_2 \in \mathbb{R}.
\end{aligned}
$$

定义（对每个 $x_i$）：

$$
\begin{aligned}
x_i^+ &= \max\{0, x_i\}, \\
x_i^- &= \max\{0, -x_i\},
\end{aligned}
$$

则有 $|x_i| = x_i^+ + x_i^-$、$x_i = x_i^+ - x_i^-$。上述问题等价于下列线性规划：

$$
\begin{aligned}
\min \quad & x_1^+ + x_1^- + x_2^+ + x_2^- \\
\text{s.t.} \quad & x_1 = x_1^+ - x_1^-, \\
& x_2 = x_2^+ - x_2^-, \\
& x_1, x_2 \in \mathbb{R}, \\
& x_1^+, x_1^-, x_2^+, x_2^- \geq 0.
\end{aligned}
$$

### 2.3 含乘积形式的线性化

若出现 $x_1 x_2$，可引入 $y$ 并令 $y = x_1 x_2$，再按 $x_1$、$x_2$ 类型分别处理。

情形 1：$x_1, x_2$ 均为 $0$–$1$ 变量

$$
\begin{aligned}
\min \quad & x_1 x_2 \\
\text{s.t.} \quad & x_1, x_2 \in \{0,1\}.
\end{aligned}
$$

等价于对 $y$ 的线性化：

$$
\begin{aligned}
\min \quad & y \\
\text{s.t.} \quad & y \leq x_1, \\
& y \leq x_2, \\
& y \geq x_1 + x_2 - 1, \\
& x_1, x_2, y \in \{0,1\}.
\end{aligned}
$$

情形 2：$x_1 \in \{0,1\}$，$x_2 \in [0, u]$（连续或整数且有上界 $u$）

$$
\begin{aligned}
\min \quad & y \\
\text{s.t.} \quad & y \leq u x_1, \\
& y \leq x_2, \\
& y \geq x_2 - u(1-x_1), \\
& x_1 \in \{0,1\}, \quad x_2, y \in [0, u].
\end{aligned}
$$

情形 3：$x_1 \in \{0,1\}$，$x_2 \in [l, u]$

$$
\begin{aligned}
\min \quad & y \\
\text{s.t.} \quad & y \leq x_2, \\
& y \geq x_2 - u(1-x_1), \\
& l x_1 \leq y \leq u x_1, \\
& x_1 \in \{0,1\}, \quad x_2 \in [l, u], \quad y \in [0, u]
\end{aligned}
$$

（具体整数/连续与模型其余部分一致即可。）

情形 4：$x_1, x_2$ 均为一般连续变量时，$x_1 x_2$ 一般不能在保持等价的前提下完全线性化；仅能做紧近似或松弛（可参见 Sherali & Alameddine, 1992 等文献）。

### 2.4 含分式形式的线性化

以下记法与教材及 Gurobi 文档中常见分式目标线性化一致。设原问题为（分母在可行域上为正，记为式 (3.22) 类形式）：

$$
\begin{aligned}
\min \quad & \frac{\sum_{i} (c_i x_i + \alpha)}{\sum_{i} (d_i x_i) + \beta} \\[0.4em]
\text{s.t.} \quad & \sum_i a_{ij} x_i \leq b_j, \quad \forall j \in J, \\
& \sum_i d_i x_i + \beta > 0, \\
& x_i \geq 0, \quad \forall i \in I.
\end{aligned}
$$

第 1 步：令 $y = \dfrac{1}{\sum_i d_i x_i + \beta} > 0$，代入后得到仍含双线性项 $x_i y$ 的中等形式（目标与约束略，形式与教材一致）。

第 2 步：再令 $z_i = x_i y$，将模型化为对 $(z, y)$ 线性的形式：

$$
\begin{aligned}
\min \quad & \sum_i (c_i z_i + \alpha y) \\
\text{s.t.} \quad & \sum_i a_{ij} z_i \leq b_j y, \quad \forall j \in J, \\
& \sum_i d_i z_i + \beta y = 1, \\
& y > 0, \quad z_i \geq 0, \quad \forall i \in I.
\end{aligned}
$$

（若需严格 LP/MILP 表述，可结合对 $y$ 下界的处理及约束类型按求解器要求微调。）

### 2.5 含 $\max$ / $\min$ 形式的线性化

要表达 $z$ 为若干可比数量 $a_1, a_2, \ldots, a_n$（决策变量、线性式或常数）的最大值或最小值，可配合 $0$–$1$ 指示变量 $u_i$ 与大 $M$ 写成通用的线性组；也可直接使用 Gurobi 等提供的 `addGenConstrMax` / `addGenConstrMin` 等接口。下面为与教材一致时常用的 Big-M 竖式，其中 $M$ 应取得足够大，使在可行域上各不等式在逻辑上恒可成立，且有界时应取尽可能紧的 $M$ 以改善数值性。

通用形式 1：$z = \max\{a_1, a_2, \ldots, a_n\}$  
对 $i = 1, \ldots, n$，有 $0$–$1$ 变量 $u_i$ 与常数 $M > 0$：

$$
\begin{aligned}
& a_i \leq z, \qquad i = 1, \ldots, n, \\[0.2em]
& a_i \geq z - M(1 - u_i), \qquad i = 1, \ldots, n, \\[0.2em]
& \sum_{i=1}^{n} u_i \geq 1, \\[0.2em]
& u_i \in \{0,1\}, \qquad i = 1, \ldots, n.
\end{aligned}
$$

第一组要求 $z$ 不低于任一项，第二组在至少一个 $u_i=1$ 时让对应 $a_i$ 从下方“顶住”$z$；与第一组合并得到 $z = \max_i a_i$ 的可行刻画。（若需恰好一个指标为 $1$，可将 $\sum u_i \geq 1$ 加强为 $\sum u_i = 1$，视模型与唯一性需要而定。）

通用形式 2：$z = \min\{a_1, a_2, \ldots, a_n\}$  

$$
\begin{aligned}
& a_i \geq z, \qquad i = 1, \ldots, n, \\[0.2em]
& a_i \leq z + M(1 - u_i), \qquad i = 1, \ldots, n, \\[0.2em]
& \sum_{i=1}^{n} u_i \geq 1, \\[0.2em]
& u_i \in \{0,1\}, \qquad i = 1, \ldots, n.
\end{aligned}
$$

第一组要求 $z$ 不高于任一项，第二组在至少一个 $u_i=1$ 时让对应 $a_i$ 从上方“压住”$z$；合起来刻画 $z = \min_i a_i$。

例（$n=3$ 的特例）  
$z = \max\{x, y, 3\}$ 即 $a_1 = x$、$a_2 = y$、$a_3 = 3$，取 $u_1, u_2, u_3 \in \{0,1\}$ 与足够大 $M$：

$$
\begin{aligned}
& x \leq z, \quad y \leq z, \quad 3 \leq z, \\
& x \geq z - M(1 - u_1), \quad y \geq z - M(1 - u_2), \quad 3 \geq z - M(1 - u_3), \\
& u_1 + u_2 + u_3 \geq 1, \\
& u_1, u_2, u_3 \in \{0,1\}.
\end{aligned}
$$

$z = \min\{x, y, 3\}$ 的写法为通用形式 2 在 $a_1=x$、$a_2=y$、$a_3=3$ 时展开，例如：

$$
\begin{aligned}
& x \geq z, \quad y \geq z, \quad 3 \geq z, \\
& x \leq z + M(1 - u_1), \quad y \leq z + M(1 - u_2), \quad 3 \leq z + M(1 - u_3), \\
& u_1 + u_2 + u_3 \geq 1, \\
& u_1, u_2, u_3 \in \{0,1\}.
\end{aligned}
$$

---

## 备忘

（在此补充：特殊有序集、多面体松弛、二次规划/二阶锥在 MIP 中的处理，以及 Gurobi/CPLEX 的 API 速查等。）
