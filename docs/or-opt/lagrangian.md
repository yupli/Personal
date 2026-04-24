# 拉格朗日松弛

拉格朗日（拉格朗日）松弛 / 对偶是整数规划、组合优化中常用的一种**分解与定界**技术：将一批“难”约束**对偶化**到目标里，在保留的“易”可行集上求子问题，并通过对乘子 $\mathbf{u}$ 的优化得到对**原问题目标值**的界。下文结构大致对应教材中第 12 章的叙述，记号与 (IP)、$\mathrm{IP}(\mathbf{u})$、拉格朗日对偶 (LD) 等保持一致（参见 Wolsey, 1998 等标准教材表述）。

---

## 1. 拉格朗日松弛介绍

### 1.1 原问题：易约束与难约束

考虑**整数规划**原问题。若把约束区分为相对**容易**与**困难**的两部分，可写为（极大化，与教材常见写法一致）：

$$
\begin{aligned}
z = \max \quad & \mathbf{c}^\top \mathbf{x} \\
\text{s.t.} \quad & A\mathbf{x} \le \mathbf{b}, \\
& D\mathbf{x} \le \mathbf{d}, \\
& \mathbf{x} \in \mathbb{Z}_+^n.
\end{aligned}
$$

- 若**只**保留 $A\mathbf{x} \le \mathbf{b}$ 与非负整数，问题往往**容易**（结构简单、可分解、或便于求解）。
- 一旦加入 $D\mathbf{x} \le \mathbf{d}$，问题可能变得**极难**（如 TSP 中大量子圈消除约束）。

若**直接删去**难约束 $D\mathbf{x} \le \mathbf{d}$，可行域过大，上界/下界**很松**，缺少对“违反难约束的惩罚”。

### 1.2 用可行集 $X$ 写成的等价形式

令

$$
X = \left\{ \mathbf{x} : A\mathbf{x} \le \mathbf{b},\; \mathbf{x} \in \mathbb{Z}_+^n \right\},
$$

并设 $D\mathbf{x} \le \mathbf{d}$ 为 $m$ 条**相对复杂**的约束。则原问题可写为：

$$
\begin{aligned}
z = \max \quad & \mathbf{c}^\top \mathbf{x} \\
\text{s.t.} \quad & D\mathbf{x} \le \mathbf{d}, \\
& \mathbf{x} \in X.
\end{aligned}
$$

### 1.3 拉格朗日松弛问题 $\mathrm{IP}(\mathbf{u})$

对**任意**非负乘子向量 $\mathbf{u} = (u_1, \ldots, u_m)^\top$（$u_i \ge 0$），将 $D\mathbf{x} \le \mathbf{d}$ 以**惩罚项**形式并入目标，得到**拉格朗日松弛子问题**：

$$
\begin{aligned}
z(\mathbf{u}) = \max \quad & \mathbf{c}^\top \mathbf{x} + \mathbf{u}^\top(\mathbf{d} - D\mathbf{x}) \\
\text{s.t.} \quad & \mathbf{x} \in X.
\end{aligned}
$$

记为 **$\mathrm{IP}(\mathbf{u})$**，其中 $z(\mathbf{u})$ 为在乘子 $\mathbf{u}$ 下该子问题的最优值。直观上，$\mathbf{d} - D\mathbf{x}$ 衡量“难约束的松弛量”：在可行时该项非负，乘上 $\mathbf{u}$ 对目标产生**奖罚**；$\mathbf{u}$ 常被解释为**影子价格 / 对偶变量 / 拉格朗日乘子**（依上下文）。

---

## 2. 松弛性质、上界与定理 12.3.1

### 2.1 定理 12.3.1（Wolsey, 1998）

**定理**：对任意 $\mathbf{u} \ge \mathbf{0}$，问题 $\mathrm{IP}(\mathbf{u})$ 是原问题 (IP) 的**松弛**（relaxation）。

**证明**（满足松弛的两项常见条件）：

1. **可行域**  
   原 (IP) 的可行解满足 $\mathbf{x} \in X$ 且 $D\mathbf{x} \le \mathbf{d}$，因而是 $X$ 的子集。$\mathrm{IP}(\mathbf{u})$ 仅在 $\mathbf{x} \in X$ 上优化，**可行域不缩小**了（在“忽略难约束等式/不等式并放到目标中”的松弛意义下，判据与教材一致）。

2. **目标值比较**（对 (IP) 的任一可行解 $\mathbf{x}$）  
   因 $\mathbf{u} \ge \mathbf{0}$ 且 $D\mathbf{x} \le \mathbf{d}$，有 $\mathbf{d} - D\mathbf{x} \ge \mathbf{0}$，故

   $$
   \mathbf{c}^\top \mathbf{x} + \mathbf{u}^\top(\mathbf{d} - D\mathbf{x}) \ge \mathbf{c}^\top \mathbf{x}.
   $$

   即在同一 $\mathbf{x}$ 上，松弛问题的目标**不低于**原目标。

**推论（定界，极大化原问题）**：对任意 $\mathbf{u} \ge \mathbf{0}$，$\mathrm{IP}(\mathbf{u})$ 的最优值 $z(\mathbf{u})$ 给原 (IP) 的最优值 $z$ 一个**上界**：

$$
z(\mathbf{u}) \ge z.
$$

为了得到**尽量紧的**上界，自然希望在 $\mathbf{u} \ge \mathbf{0}$ 上**最小化** $z(\mathbf{u})$。这就引出下一节的**拉格朗日对偶**。

---

## 3. 拉格朗日对偶问题

### 3.1 对偶 (LD) 的写法

为求“最好的”乘子，定义**拉格朗日对偶问题**：

$$
(LD) \qquad w_{LD} = \min \left\{ z(\mathbf{u}) : \mathbf{u} \ge \mathbf{0} \right\}.
$$

**等式难约束**的情形：若难约束在模型中写为 $D\mathbf{x} = \mathbf{d}$，则乘子**不再限制符号**，$\mathbf{u} \in \mathbb{R}^m$，对偶为

$$
w_{LD} = \min_{\mathbf{u} \in \mathbb{R}^m} z(\mathbf{u}).
$$

在一定条件下，求解 (LD) 可得到**紧的**上界，个别情形下还可由此恢复原 (IP) 的最优解（见下述最优性条件）。

### 3.2 定理 12.3.2（Wolsey, 1998）：从 $\mathrm{IP}(\mathbf{u})$ 恢复 (IP) 的最优

设 $\mathbf{u} \ge \mathbf{0}$，并存在 $\mathbf{x}(\mathbf{u})$ 满足：

1. $\mathbf{x}(\mathbf{u})$ 是 $\mathrm{IP}(\mathbf{u})$ 的**最优解**；
2. $D\mathbf{x}(\mathbf{u}) \le \mathbf{d}$（**原**难约束可行）；
3. **互补松弛**：对所有 $i$，若 $u_i > 0$ 则 $[D\mathbf{x}(\mathbf{u})]_i = d_i$。

则 $\mathbf{x}(\mathbf{u})$ 是**原 (IP) 的**最优解。

**证明思路（要点）**：由 (1) 有

$$
w_{LD} \le z(\mathbf{u})
= \mathbf{c}^\top \mathbf{x}(\mathbf{u}) + \mathbf{u}^\top(\mathbf{d} - D\mathbf{x}(\mathbf{u})).
$$

由 (3) 得 $\mathbf{u}^\top(\mathbf{d} - D\mathbf{x}(\mathbf{u})) = 0$，故

$$
z(\mathbf{u}) = \mathbf{c}^\top \mathbf{x}(\mathbf{u}).
$$

由 (2) 得 $\mathbf{x}(\mathbf{u})$ 对 (IP) 可行，故 $\mathbf{c}^\top \mathbf{x}(\mathbf{u}) \le z$。结合**弱对偶/对偶界**有 $w_{LD} \ge z$，在适当条件下可推出 $w_{LD} = z$ 与最优性。

**注**：难约束**全部**为等式时 (3) 常自动更自然；若某 $\mathrm{IP}(\mathbf{u})$ 的最优解已经满足 (IP) 的全体约束，它往往也是 (IP) 的最优解之一。

---

## 4. 应用：无容量设施选址 (UFLP) 的拉格朗日松弛

### 4.1 集合、参数与变量

- $N = \{1,\ldots,n\}$：潜在设施下标；$M = \{1,\ldots,m\}$：客户下标。  
- $f_j$：开放设施 $j$ 的**固定**费用；$c_{ij}$：将客户 $i$ 全部分配到 $j$ 时产生的**收益**（与教材中“收益减成本后净得”的写法一致，此处用 $c_{ij}$ 表收益）。  
- 决策：$y_j \in \{0,1\}$ 是否开设施 $j$；$x_{ij} \in [0,1]$ 为客户 $i$ 由 $j$ 满足的需求比例；需求约束 $\sum_{j} x_{ij} = 1$ 保证每个客户**恰好被完全**满足（无容量时可用比例 $1$ 全分给某一设施等解释）。

**原 (IP)（与教材编号对应）**：

$$
\begin{aligned}
\text{(IP)} \qquad
\max z =\ {} & \sum_{i \in M} \sum_{j \in N} c_{ij} x_{ij} - \sum_{j \in N} f_j y_j
& (12.2) \\[0.3em]
\text{s.t.} \quad & \sum_{j \in N} x_{ij} = 1, & \forall i \in M & \quad (12.3) \\
& x_{ij} \le y_j, & \forall i \in M,\, j \in N & \quad (12.4) \\
& \mathbf{x} \in \mathbb{R}_+^{|M| \times |N|}, \; \mathbf{y} \in \{0,1\}^{|N|}. & & (12.5)
\end{aligned}
$$

### 4.2 松弛 (12.3)：$\mathrm{IP}(\mathbf{u})$

对每条需求约束引入乘子 $u_i$，将 (12.3) 对偶到目标。目标中增加

$$
\sum_{i \in M} u_i \left( 1 - \sum_{j \in N} x_{ij} \right),
$$

整理得**等价目标**为（式 (12.6)–(12.7) 的合并写法）：

$$
\sum_{i \in M} \sum_{j \in N} (c_{ij} - u_i) x_{ij} - \sum_{j \in N} f_j y_j + \sum_{i \in M} u_i.
$$

**拉格朗日松弛**（保留 (12.4)(12.5)）为：

$$
\begin{aligned}
\mathrm{IP}(\mathbf{u}) \qquad
\max z(\mathbf{u}) =\ {} & \sum_{i \in M} \sum_{j \in N} (c_{ij} - u_i) x_{ij} - \sum_{j \in N} f_j y_j + \sum_{i \in M} u_i
& (12.8) \\[0.2em]
\text{s.t.} \quad & x_{ij} \le y_j, & \forall i \in M,\, j \in N & \quad (12.9) \\
& \mathbf{x} \ge \mathbf{0},\; \mathbf{y} \in \{0,1\}^{|N|}. & & (12.10)
\end{aligned}
$$

### 4.3 按设施 $j$ 分解

(12.9) 按 $(i,j)$ 可分离为每个 $j$ 一个子问题。总目标

$$
z(\mathbf{u}) = \sum_{j \in N} z_j(\mathbf{u}) + \sum_{i \in M} u_i,
$$

其中

$$
\begin{aligned}
\mathrm{IP}(\mathbf{u})_j: \qquad
z_j(\mathbf{u}) = \max \quad & \sum_{i \in M} (c_{ij} - u_i) x_{ij} - f_j y_j
& (12.11) \\[0.2em]
\text{s.t.} \quad & x_{ij} - y_j \le 0, & \forall i \in M & \quad (12.12) \\
& x_{ij} \ge 0,\; y_j \in \{0,1\}, & \forall i \in M. & (12.13)
\end{aligned}
$$

**闭式解**（对固定的 $j$）：

- 若 $y_j = 0$，则 $x_{ij} = 0$，目标为 $0$。  
- 若 $y_j = 1$，为最大化，对每个 $i$ 可在满足 $x_{ij} \in [0,1]$ 下取**尽可能大**的有效贡献。教材中在“需求由唯一设施 1 完全满足”的简化解析下，常写为在 $(c_{ij} - u_i) > 0$ 的项上取 $1$，从而

$$
z_j(\mathbf{u})
= \max \left\{
0,\; \sum_{i \in M} \max\bigl\{ c_{ij} - u_i,\, 0 \bigr\} - f_j
\right\}.
$$

（具体 $x_{ij}$ 是否可同时在多个 $j$ 上为 $1$ 取决于原 (IP) 对 $\sum_{j} x_{ij}=1$ 的松弛后 $\mathrm{IP}(\mathbf{u})$ 的物理解释；上式作为**按 $j$ 的闭式**与教材 (12.11) 后的叙述一致。）

---

## 5. 小算例（教材风格）

取 $m = 6$ 个客户、$n = 5$ 个设施。

**固定费**（教材数据）：

$$
\mathbf{f}^\top = (2,\; 4,\; 5,\; 3,\; 3).
$$

**收益矩阵** $\{c_{ij}\}$（$6 \times 5$）：

$$
\begin{bmatrix}
6 & 2 & 1 & 3 & 5 \\
4 & 10 & 2 & 6 & 1 \\
3 & 2 & 4 & 1 & 3 \\
2 & 0 & 4 & 1 & 4 \\
1 & 8 & 6 & 2 & 5 \\
3 & 2 & 4 & 8 & 1
\end{bmatrix}
$$

**给定**一组乘子（教材数值） $\mathbf{u}^\top = (5, 6, 3, 2, 5, 4)$，则

$$
\sum_{i \in M} u_i = 25.
$$

**有效收益** $c_{ij} - u_i$ 的矩阵为：

$$
\begin{bmatrix}
1 & -3 & -4 & -2 & 0 \\
-2 & 4 & -4 & 0 & -5 \\
0 & -1 & 1 & -2 & 0 \\
0 & -2 & 2 & -1 & 2 \\
-4 & 3 & 1 & -3 & 0 \\
-1 & -2 & 0 & 4 & -3
\end{bmatrix}
$$

**设施 $j = 2$ 为例**：第 2 列 $(-3, 4, -1, -2, 3, -2)^\top$ 中**正**分量为第 $2$ 行的 $4$ 与第 $5$ 行的 $3$。若 $y_2 = 1$，则子问题贡献

$$
z_2(\mathbf{u}) = (4 + 3) - f_2 = 7 - 4 = 3 > 0.
$$

**对所有** $j$ 比较 $z_j$ 后，可得到**一组**在 $\mathrm{IP}(\mathbf{u})$ 下最优的 $\mathbf{x},\mathbf{y}$（教材给出的一种最优形式例如）：$y_2=1$、$x_{22}=1$、$x_{52}=1$；$y_4=1$、$x_{64}=1$；其余为 $0$。于是

$$
z(\mathbf{u}) = 3 + 1 + \sum_{i \in M} u_i = 3 + 1 + 25 = 29,
$$

即该 $\mathbf{u}$ 下松弛目标值为 $29$（作为原问题目标的一个**上界**候选，仍需求解 (LD) 以改进 $\mathbf{u}$）。

---

## 6. 拉格朗日对偶的加强（与凸包表述）

在 $X$ **有限**个极点 $\mathbf{x}^1, \ldots, \mathbf{x}^T$ 的假设下，$z(\mathbf{u})$ 可写为在极点上的极大。对偶界可展开为

$$
\begin{aligned}
\omega_{LD} &= \min_{\mathbf{u} \ge \mathbf{0}} z(\mathbf{u}) & (12.14) \\[0.2em]
&= \min_{\mathbf{u} \ge \mathbf{0}} \; \max_{\mathbf{x} \in X} \left[
\mathbf{c}^\top \mathbf{x} + \mathbf{u}^\top(\mathbf{d} - D\mathbf{x})
\right] & (12.15) \\[0.2em]
&= \min_{\mathbf{u} \ge \mathbf{0}} \; \max_{t=1,\ldots,T} \left[
\mathbf{c}^\top \mathbf{x}^t + \mathbf{u}^\top(\mathbf{d} - D\mathbf{x}^t)
\right]. & (12.16)
\end{aligned}
$$

引入标量 $\eta$ 上界 (12.16) 可写成**线性规划**（对 $(\eta, \mathbf{u})$）：

$$
\begin{aligned}
\min \quad & \eta & (12.17) \\
\text{s.t.} \quad
& \eta \ge \mathbf{c}^\top \mathbf{x}^t + \mathbf{u}^\top(\mathbf{d} - D\mathbf{x}^t), \quad t = 1, \ldots, T, & (12.18) \\
& \mathbf{u} \in \mathbb{R}_+^m,\; \eta \in \mathbb{R}. & (12.19)
\end{aligned}
$$

其**对偶**给出（在凸组合权重 $\mu_t$ 下）的等价形式，并可几何解释为在 $\mathrm{conv}(X)$ 上与 $D\mathbf{x} \le \mathbf{d}$ 的交上极大化 $\mathbf{c}^\top\mathbf{x}$。教材中给出：

- **定理 12.4.1（Wolsey, 1998）**  
  $\omega_{LD} = \max\bigl\{
  \mathbf{c}^\top \mathbf{x} : D\mathbf{x} \le \mathbf{d},\, \mathbf{x} \in \mathrm{conv}(X)
  \bigr\}$。  
  即拉格朗日对偶界相当于在**难约束**与 **$X$ 的凸包** 上作线性优化，一般**不弱于**在 $X$ 的**线性松弛**上直接作 LP 的界（具体比较依赖 $X$ 的表述）。

- **定理 12.4.2（Wolsey, 1998）**（符号略）：若 $X$ 有显式**完美表述**的凸包 $\mathrm{conv}(X) = \{ \mathbf{x} : \bar{A} \mathbf{x} \le \bar{\mathbf{b}} \}$，则 $\omega_{LD}$ 可视为在 $\bar{A}\mathbf{x} \le \bar{\mathbf{b}}$ 与 $D\mathbf{x} \le \mathbf{d}$ 上极大 $\mathbf{c}^\top\mathbf{x}$ 的**联合**问题。

**对偶函数形状**：$z(\mathbf{u}) = \max_{t} [\mathbf{c}^\top \mathbf{x}^t + \mathbf{u}^\top(\mathbf{d} - D\mathbf{x}^t)]$ 是**凸**的**逐段线性**函数；$w_{LD} = \min_{\mathbf{u} \ge 0} z(\mathbf{u})$ 即在其图像（若干仿射函数的上包络）上求**最小值**，极值点可能使“活跃”极点 $\mathbf{x}^t$ 发生切换。教材图 12.2 一维 $\mathbf{u}$ 的示意图中，$z(\mathbf{u})$ 为粗折线，由多条细直线**取大**后形成。实际计算中常配合**次梯度法**、列生成/割平面、或 bundle 方法近似求解 (LD)，此处不展开实现细节。

---

## 备忘

（可在此补：**次梯度**更新 $\mathbf{u}$ 的步长、**枝定界/分支**中拉格朗日界的使用、与 Dantzig–Wolfe / Benders 的对比、Gurobi 中相应接口等。）
