# Benders 分解

Benders 分解（Benders Decomposition）是一种将混合整数规划问题分解为主问题和子问题的算法，特别适用于具有可分解结构的大规模优化问题。

## 适用于什么问题

适用情形可以概括为：**先决策一组「主」变量（尤其是整数 / 二元变量 $\boldsymbol{y}$）之后，剩余关于连续变量 $\boldsymbol{x}$ 的问题变为线性规划（或其对偶）**；或者原始模型天然呈「上层选址 / 配组 / 开关」与「下层连续运行成本」的两层结构。如此可把 $\boldsymbol{y}$ 固定在主问题中迭代更新，通过子问题的 **可行性与最优性** Benders 割不断收紧主问题，直到上下界一致。常见语境：**设施选址与网络设计后随线性流量成本**、**两阶段随机规划**中第一阶段整数决策与第二阶段线性追索（recourse）、**生产计划 / 供应链**中离散开通决策与连续补货或运输子问题。

**不适用或需谨慎**：固定 $\boldsymbol{y}$ 后子问题既非凸线性且性质不明；或主问题维度太小、直接整体求解 MILP 更省事；以及子问题对偶无法给出有效极点 / 极射线信息（退化实现困难）时的情形。

---

## 1. 问题形式

考虑如下混合整数规划问题：

$$\min_{\boldsymbol{y}} \quad \boldsymbol{f}^T \boldsymbol{y} + q(\boldsymbol{y})$$

$$\text{s.t.} \quad \boldsymbol{y} \in Y \subseteq \mathbb{R}^q$$

其中 $q(\boldsymbol{y})$ 定义为：

$$q(\boldsymbol{y}) = \min_{\boldsymbol{x}} \quad \boldsymbol{c}^T \boldsymbol{x}$$

$$\text{s.t.} \quad A\boldsymbol{x} \leq \boldsymbol{b} - B\boldsymbol{y}$$

$$\boldsymbol{x} \geq \boldsymbol{0}$$

问题特点：
- $\boldsymbol{y}$：整数决策变量（复杂变量）
- $\boldsymbol{x}$：连续决策变量
- 当 $\boldsymbol{y}$ 固定后，子问题变为关于 $\boldsymbol{x}$ 的线性规划问题

---

## 2. Benders 分解的全过程

### 2.1 第一步：求解初始主问题

首先求解松弛的主问题（Master problem）：

$$\min_{\boldsymbol{y} \in Y} \quad \boldsymbol{f}^T \boldsymbol{y} + q(\boldsymbol{y})$$

$$\text{s.t.} \quad \boldsymbol{y} \in Y \subseteq \mathbb{R}^q$$

得到最优解 $\bar{\boldsymbol{y}}$，将其作为固定值代入下一步的迭代中。

### 2.2 第二步：求解子问题对偶问题

将主问题的最优解 $\bar{\boldsymbol{y}}$ 代入子问题的对偶问题（Subproblem-Dual）中求解：

$$\max_{\boldsymbol{\alpha}} \quad (\boldsymbol{b} - B\bar{\boldsymbol{y}})^T \boldsymbol{\alpha}$$

$$\text{s.t.} \quad A^T \boldsymbol{\alpha} \leq \boldsymbol{c}$$

$$\boldsymbol{\alpha} \text{ free}$$

求解结果分析：
- 得到 Subproblem-Dual 的极点 $\boldsymbol{\alpha}_r^j$（$j = 1, 2, \ldots, J$）和极射线 $\boldsymbol{\alpha}_p^i$（$i = 1, 2, \ldots, I$）
- 如果有最优解，获得其目标值 $q(\boldsymbol{y}^*) = \boldsymbol{\alpha}^{T^*}(\boldsymbol{b} - B\bar{\boldsymbol{y}})$
- 因为 Subproblem 和 Subproblem-Dual 互为对偶，故目标值相同

### 2.3 第三步：更新主问题

求解完子问题的对偶问题后，将极点和极射线的相关约束加入松弛的主问题中，更新主问题为 Benders 重构形式（Benders Original Problem Reformulated）：

$$\min \quad \boldsymbol{f}^T \boldsymbol{y} + q$$

$$\text{s.t.} \quad (\boldsymbol{\alpha}_r^j)^T (\boldsymbol{b} - B\boldsymbol{y}) \leq 0, \quad \forall j = 1, 2, \ldots, J$$

$$(\boldsymbol{\alpha}_p^i)^T (\boldsymbol{b} - B\boldsymbol{y}) \leq q, \quad \forall i = 1, 2, \ldots, I$$

$$\boldsymbol{y} \in Y, \quad q \text{ free}$$

约束说明：
- 极射线约束（可行性割）：$(\boldsymbol{\alpha}_r^j)^T (\boldsymbol{b} - B\boldsymbol{y}) \leq 0$
  - 保证子问题有可行解
- 极点约束（最优性割）：$(\boldsymbol{\alpha}_p^i)^T (\boldsymbol{b} - B\boldsymbol{y}) \leq q$
  - 提供子问题的下界信息

### 2.4 第四步：迭代与终止

求解更新后的主问题，获得目标值中 $q$ 的值 $q^*$。

终止条件：
- 直到 $q(\boldsymbol{y}^*) = q^*$，算法停止，得到最优解
- 或者从全局上界 UB 和全局下界 LB 判断：
  - 全局 LB：$\boldsymbol{f}^T \boldsymbol{y} + q$
  - 全局 UB：$\boldsymbol{f}^T \boldsymbol{y} + q(\boldsymbol{y})$
  - 当 UB = LB 时，有 $q(\boldsymbol{y}) = q$

---

## 3. 算法框架

### 3.1 基本迭代流程

```
┌─────────────────────────────────────────────────┐
│  初始化                                          │
│  • 设置 LB = -∞, UB = +∞                         │
│  • 初始化主问题（不含 Benders 割）               │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  求解主问题                                      │
│  • 获得最优解 ȳ 和最优值 fᵀȳ + q                │
│  • 更新 LB = fᵀȳ + q                            │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  求解子问题（固定 ȳ）                            │
│  • 得到子问题最优值 q(ȳ)                         │
│  • 计算全局 UB = fᵀȳ + q(ȳ)                     │
└────────┬────────────────────────────────────────┘
         │
         ▼
      ┌─────────────────┐
      │ 判断终止条件    │
      │ UB - LB ≤ ε ?   │
      └────┬─────┬──────┘
           │     │
          否     是
           │     │
           ▼     ▼
┌──────────────────┐    ┌─────────────────────────┐
│ 生成 Benders 割  │    │      算法终止          │
│ • 极点 → 最优性割│    │ • 返回最优解 ȳ, x*     │
│ • 极射线→可行性割│    │ • 返回最优值           │
│ • 加入主问题     │    │                         │
│ • 返回求解主问题 │    │                         │
└──────────────────┘    └─────────────────────────┘
```

### 3.2 割平面类型

| 割平面类型 | 触发条件 | 数学形式 | 作用 |
|-----------|---------|---------|------|
| 最优性割 | 子问题有最优解 | $(\boldsymbol{\alpha}_p^i)^T (\boldsymbol{b} - B\boldsymbol{y}) \leq q$ | 逼近目标函数下界 |
| 可行性割 | 子问题无可行解 | $(\boldsymbol{\alpha}_r^j)^T (\boldsymbol{b} - B\boldsymbol{y}) \leq 0$ | 排除不可行解 |

---

## 4. 与 Dantzig-Wolfe 分解的关系

Benders 分解与 Dantzig-Wolfe 分解是对偶关系：

| 特性 | Benders 分解 | Dantzig-Wolfe 分解 |
|------|-------------|-------------------|
| 分解对象 | 混合整数规划 | 大规模线性规划 |
| 主问题 | 整数变量 + 辅助变量 $q$ | 极点的凸组合系数 $\lambda$ |
| 子问题 | 关于连续变量的线性规划 | 关于局部变量的子问题 |
| 生成方式 | 生成割平面（行生成） | 生成列（列生成） |
| 对偶关系 | 子问题的对偶提供割 | 子问题生成新列 |

:::tip 核心理解

- Benders 分解：通过割平面逐步逼近原问题，每次迭代添加行约束
- Dantzig-Wolfe 分解：通过列生成逐步构建原问题，每次迭代添加列变量

两者本质上是同一个问题的不同视角——Benders 是在对偶空间操作，DW 是在原始空间操作。

:::

---

## 5. 应用场景

Benders 分解特别适用于以下场景：

1. 两阶段随机规划：第一阶段决策（整数）+ 第二阶段情景（连续）
2. 设施选址问题：选址决策（整数）+ 运输/分配（连续）
3. 网络设计：拓扑设计（整数）+ 流量分配（连续）
4. 生产计划：产能决策（整数）+ 生产调度（连续）

---

## 6. 算法变体

### 6.1 多级 Benders 分解

对于多级决策问题，可以递归地应用 Benders 分解：
- 每一级生成割平面传递给上一级
- 形成嵌套的主问题-子问题结构

### 6.2 强化 Benders 割

- Pareto-optimal 割：从多个最优割中选择最强的割
- 多割方法：每个情景生成独立的割平面
- 似然割：基于概率的割平面选择策略

---

## 7. 设施选址问题的 Benders 分解详解（UFLP）

本节专述无容量设施选址（Uncapacitated Facility Location Problem, UFLP）如何写成「二元选址 $\boldsymbol{y}$ + 连续分配 $\boldsymbol{x}$」后再套用前述 Benders 逻辑；模型记号与 [设施选址问题](../classic-models/facility-location.md) 中 (1)–(4) 对齐，此处把固定开设费与运输费一并放进分解叙述。

### 7.1 可分解的混合整数形式

设客户集合 $M=\{1,\ldots,m\}$，候选设施集合 $N=\{1,\ldots,n\}$；开设费 $f_j$，客户 $i$ 由设施 $j$ 服务的线性费用系数 $c_{ij}$（可与需求 $d_i$ 吸收进系数）。决策：

- $y_j \in \{0,1\}$：是否在 $j$ 开设；
- $x_{ij} \ge 0$：客户 $i$ 的需求量中由 $j$ 承担的比例（归一化需求下 $\sum_j x_{ij}=1$）。

$$
\min \quad \sum_{j \in N} f_j y_j + \sum_{i \in M} \sum_{j \in N} c_{ij} x_{ij} \tag{1}
$$

$$
\text{s.t.} \quad \sum_{j \in N} x_{ij} = 1, \quad \forall i \in M \tag{2}
$$

$$
x_{ij} \le y_j, \quad \forall i \in M,\; j \in N \tag{3}
$$

$$
y_j \in \{0,1\},\quad x_{ij} \ge 0 \tag{4}
$$

把 $\boldsymbol{y}$ 固定在主问题中迭代，对固定的 $\bar{\boldsymbol{y}}$，关于 $\boldsymbol{x}$ 的子问题是线性规划：

$$
q(\bar{\boldsymbol{y}}) = \min_{\boldsymbol{x}} \; \sum_{i,j} c_{ij} x_{ij}
$$

$$
\text{s.t. } \sum_j x_{ij} = 1 \ (\forall i),\quad x_{ij} \le \bar{y}_j \ (\forall i,j),\quad x_{ij} \ge 0 .
$$

若某个客户 $i$ 对所有满足 $\bar{y}_j=1$ 的 $j$ 都无法分配（或等价地，与 (2)(3) 联立后出现矛盾），则 $q(\bar{\boldsymbol{y}})=+\infty$（子问题不可行），应由对偶侧极射线生成可行性割；否则求得有限最优值 $q(\bar{\boldsymbol{y}})$，并由对偶极点生成最优性割，在主问题里用辅助变量 $\eta$（或上文记号 $q$）从下方逼近 $\boldsymbol{y} \mapsto q(\boldsymbol{y})$。

### 7.2 子问题的对偶（生成割的标准形式）

为写出割，采用子问题的对偶（变量一律对应极小化原问题）。令 $\boldsymbol{v}=(v_i)_{i \in M}$ 对应式 (2) 的等号约束（$v_i$ 无符号限制），令 $u_{ij} \ge 0$ 对应式 (3) 在固定 $\bar{y}_j$ 时的约束 $x_{ij} \le \bar{y}_j$。可得对偶：

$$
\max_{\boldsymbol{v},\boldsymbol{u}} \quad \sum_{i \in M} v_i + \sum_{i \in M} \sum_{j \in N} u_{ij}\, \bar{y}_j \tag{5}
$$

$$
\text{s.t.} \quad v_i + u_{ij} \le c_{ij}, \quad \forall i \in M,\; j \in N \tag{6}
$$

$$
u_{ij} \ge 0,\quad v_i \ \text{free}. \tag{7}
$$

**含义**：对偶目标在 $\bar{\boldsymbol{y}}$ 处取值 $\sum_i v_i + \sum_{i,j} u_{ij}\bar{y}_j$；由线性规划对偶定理，它与原子问题最优运输费用 $q(\bar{\boldsymbol{y}})$ 相等（可行有界时）。

设在某次迭代求得子问题的一个最优极点 $(\boldsymbol{v}^*, \boldsymbol{u}^*)$，则对任意 $\boldsymbol{y}$ 都有 $q(\boldsymbol{y}) \ge \sum_i v^*_i + \sum_{i,j} u^*_{ij} y_j$（弱对偶给出全局下界族）。

**最优性割**：取如下线性不等式并入主问题：

$$
\eta \;\ge\; \sum_{i \in M} v^*_i + \sum_{i \in M} \sum_{j \in N} u^*_{ij}\, y_j. \tag{8}
$$

把它加入主问题后，主问题在 $(\boldsymbol{y},\eta)$ 上被迫承认「若采用 $\boldsymbol{y}$，则第二阶段费用至少为右端线性函数」。

若子问题不可行，则在 $(5)$–$(7)$ 的对偶侧存在使目标沿某一方向无界增长的极射线 $(\hat{\boldsymbol{v}},\hat{\boldsymbol{u}})$（满足齐次约束 $\hat{v}_i+\hat{u}_{ij}\le 0$ 及符号限制），对应原问题不可行的一种分离凭证。

**可行性割**：取其形如

$$
\sum_{i \in M} \hat{v}_i + \sum_{i \in M} \sum_{j \in N} \hat{u}_{ij}\, y_j \;\ge\; 0 \tag{9}
$$

（符号可依你把射线朝向写成 $\le 0$ 或等价变形；关键是排除导致无可行分配的二元模式。）直观上：某些 $\boldsymbol{y}$ 使得不存在满足 (2)(3) 的 $\boldsymbol{x}$，可行性割将这些 $\boldsymbol{y}$ 从主问题可行域中剪掉。

### 7.3 Benders 主问题（松弛主问题）写法

将 $\eta$ 视作第二阶段费用的下界变量（通常还需 $\eta \ge \underline{\eta}$ 之类的平凡界以防无界），主问题在一族割约束下迭代为：

$$
\min \quad \sum_{j \in N} f_j y_j + \eta \tag{10}
$$

$$
\text{s.t.} \quad y_j \in \{0,1\}\ (\forall j),\quad \eta \in \mathbb{R},
$$

以及迄今为止生成的全部形如 (8)(9) 的割（必要时外加选址问题的有效不等式以加速收敛）。

每次求解得到 $(\bar{\boldsymbol{y}}, \bar{\eta})$，固定 $\bar{\boldsymbol{y}}$ 解子问题或其对偶：若不可行则加 (9)；若可行且最优值为 $q(\bar{\boldsymbol{y}})$，若 $\bar{\eta} < q(\bar{\boldsymbol{y}})$（在数值容差外）则加 (8)。当下界 $\sum_j f_j \bar{y}_j + \bar{\eta}$ 与上界 $\sum_j f_j \bar{y}^* + q(\bar{\boldsymbol{y}}^*)$（取自迄今最好的可行 $\bar{\boldsymbol{y}}$）间隙为零（或小于阈值）时终止。

---

::: algorithm UFLP 的 Benders 分解（叙述骨架）

### 1. 初始化
构造主问题 (10)，可先放入平凡界或少量启发式割；令全局上界 $\mathrm{UB}\leftarrow +\infty$，记下界。

### 2. 解主问题
得到候选选址 $\bar{\boldsymbol{y}}$ 及主问题目标下界 $\mathrm{LB} = \sum_j f_j \bar{y}_j + \bar{\eta}$。

### 3. 解子问题（固定 $\bar{\boldsymbol{y}}$）
求解运输–分配 LP（或对偶 (5)–(7) 在 $\bar{y}$ 处）。若不可行，生成可行性割 (9) 加入主问题，返回步骤 2。

### 4. 最优性检验与割
设子问题最优值为 $q(\bar{\boldsymbol{y}})$，更新 $\mathrm{UB} \leftarrow \min\{\mathrm{UB},\, \sum_j f_j \bar{y}_j + q(\bar{\boldsymbol{y}})\}$。若 $\bar{\eta}$ 已不小于 $q(\bar{\boldsymbol{y}})$（差值在容差内），则当前 $\bar{\boldsymbol{y}}$ 与对应 $\boldsymbol{x}^*$ 最优；否则取最优对偶极点 $(\boldsymbol{v}^*,\boldsymbol{u}^*)$，添加最优性割 (8)，返回步骤 2。

### 5. 终止
当 $\mathrm{UB}-\mathrm{LB}$ 足够小或步骤 4 已判定最优时停止，输出最优 $(\boldsymbol{y}^*,\boldsymbol{x}^*)$。

:::

### 7.4 说明与实务要点

**含义**：UFLP 的子问题是典型的「给定开通哪些设施后的最小费用流/分配」，规模常为 $|M|\cdot|N|$ 量级，对偶维数相同；割 (8) 把「开通集合 $\boldsymbol{y}$」与「运输费用下界」线性衔接，正是 Benders 在选址上的标准用法。

**加强**：实践中常在主问题中加入选址多面体的有效不等式（如紧密表述、对称破缺），或对割做 Pareto 强化（见上文「强化 Benders 割」），以减少迭代次数。

### 7.5 极简数值示意（两条割的直觉）

取 $M=N=\{1,2\}$，$f_1=f_2=3$，费用矩阵 $c_{11}=2,\ c_{12}=5,\ c_{21}=4,\ c_{22}=1$。显然最优选址为只开设施 $2$：客户 $1$、$2$ 均分配到 $2$，运输费 $5+1=6$，加固定费 $3$，总目标 $9$；若只开设施 $1$，运输费 $2+4=6$，总目标亦为 $9$；若两设施同开，最优分配可为 $(i=1\to j=1,\ i=2\to j=2)$，运输 $3$ 加固定 $6$，总目标 $9$。此例多个离散解目标相同，适合检验算法在不同 $\bar{\boldsymbol{y}}$ 上生成的割 (8) 是否逐步收紧 $\eta$。

一次迭代中若主问题给出 $\bar{\boldsymbol{y}}=(1,0)$，子问题迫使两客户均用设施 $1$，得 $q(\bar{\boldsymbol{y}})=6$，$\sum_j f_j\bar{y}_j=3$，合计 $9$。从对偶 (5)–(7) 可读出一个极点给出形如 (8) 的割，使任意 $\boldsymbol{y}$ 下 $\eta$ 不低于相应的线性下界；若主问题随后试探 $\bar{\boldsymbol{y}}=(0,1)$，同理得到运输费 $6$。若某步试探 $\bar{\boldsymbol{y}}=(0,0)$，子问题不可行，对偶无界方向给出可行性割 (9)，排除「一处都不开」的二元串。

完整极点坐标不必手算——实现上交给 LP 求解器同时返回原–对偶最优即可生成 (8)(9)。

---

## 备忘

（在此补充 Benders 分解的收敛性分析、加速技巧、更多应用案例等内容。）
