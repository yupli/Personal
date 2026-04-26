# Benders 分解

Benders 分解（Benders Decomposition）是一种将混合整数规划问题分解为主问题和子问题的算法，特别适用于具有可分解结构的大规模优化问题。

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

## 备忘

（在此补充 Benders 分解的收敛性分析、加速技巧、实际应用案例等内容。）
