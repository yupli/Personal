---
pageClass: rl-summary
---

# 第 3 课 · 贝尔曼最优公式 · V2（总结）

[切换到 V1（逐页）](bellman-optimality-slides.md)

## 1. Optimal Policy {#_1-optimal-policy-optimal-value}

<div class="td-slide">
<div class="td-slide-title">Optimal policy · 怎样比较策略？</div>
<div class="td-slide-body">

本课讨论有限状态、有限动作、奖励有界、$0\le\gamma<1$ 的任务。若

$$
v_{\pi_1}(s)\ge v_{\pi_2}(s),\qquad \forall s\in\mathcal S,
$$

则策略 $\pi_1$ 从任何起点出发都不比 $\pi_2$ 差。若一个策略在某些状态更好、在另一些状态更差，就无法用这个标准把两者排出先后。

<strong>定义 · 最优策略（optimal policy）</strong>：同一个策略 $\pi^*$ 必须在<strong>每个起点</strong>都达到最高价值，也就是

$$
v_{\pi^*}(s)\ge v_\pi(s),\qquad \forall s\in\mathcal S,\ \forall\pi.
$$

它实现的状态价值称为<strong>最优状态价值（optimal state value）</strong>，记为 $v^*(s)=v_{\pi^*}(s)$。这个定义引出四个问题：

- 最优策略一定存在吗？如果存在，它唯一吗？
- 它可以是随机策略（stochastic policy），还是可以用确定性策略（deterministic policy）实现？
- 怎样求出最优策略？

</div>
</div>

## 2. Bellman Optimality Equation(BOE) {#_2-bellman-optimality-equation}

### Elementwise Form

<div class="td-slide">
<div class="td-slide-title">（1）Elementwise form · 对每个状态写一个方程</div>
<div class="td-slide-body">

第 2 课的贝尔曼期望方程按<strong>给定策略</strong>的概率对首步动作取平均。<strong>贝尔曼最优方程（Bellman optimality equation，BOE）</strong>则要在所有可行的动作分布中找到能让这一平均值最大的分布：

$$
\begin{aligned}
v(s)
&=\max_{\pi(\cdot\mid s)}\sum_a \pi(a\mid s)
\left[\sum_r p(r\mid s,a)\,r
 +\gamma\sum_{s'}p(s'\mid s,a)\,v(s')\right]\\
&=\max_{\pi(\cdot\mid s)}\sum_a \pi(a\mid s)\,q_v(s,a),
\qquad s\in\mathcal S.
\end{aligned}
$$

括号里的 $q_v(s,a)$ 是<strong>一步前瞻（one-step lookahead）</strong>：指定首步做 $a$，把平均即时奖励与按候选价值 $v$ 计算的折扣后续价值相加。

- <strong>已知：</strong>环境的奖励概率 $p(r\mid s,a)$、转移概率 $p(s'\mid s,a)$ 和折扣因子 $\gamma$。
- <strong>待求：</strong>整组状态价值 $v$ 同时出现在等式两侧；使右侧最大的策略 $\pi$ 也没有预先给定。$v(s)$ 和 $v(s')$ 是同一组未知价值在不同状态上的分量。

</div>
</div>

### Matrix–Vector Form

<div class="td-slide">
<div class="td-slide-title">（2）Matrix–vector form · 把状态方程合在一起</div>
<div class="td-slide-body">

沿用第 2 课的记号，$\mathbf v$ 是价值列向量，$\mathbf r_\pi$ 和 $P_\pi$ 分别是按策略平均后的即时奖励向量和状态转移矩阵：

$$
\begin{aligned}
r_\pi(s)&=\sum_a\pi(a\mid s)\sum_r p(r\mid s,a)\,r,\\
[P_\pi]_{ss'}&=\sum_a\pi(a\mid s)p(s'\mid s,a),\\[3pt]
\mathbf v&=\max_\pi\bigl(\mathbf r_\pi+\gamma P_\pi\mathbf v\bigr).
\end{aligned}
$$

这里的最大值是<strong>逐分量（componentwise）</strong>取的：每个状态可以选自己的动作分布，再把这些选择合成一套完整策略。这条式子同时刻画了价值和策略；难点是右侧还要做一次最大化，不能直接照搬固定策略时的线性方程求解法。

</div>
</div>

## 3. BOE: Maximization on the right-hand side {#_3-solving-for-value-and-policy}

#### （1）两个未知量：先处理右边的最大化

<div class="td-slide">
<div class="td-slide-title">Two unknowns · 先最大化，再解等式</div>
<div class="td-slide-body">

贝尔曼最优方程右侧既有未知价值，又要对策略取最大。课件先用一个只有两个变量的式子说明这两个未知量怎样处理。设 $x,a\in\mathbb R$，满足

$$
x=\max_{a\in\mathbb R}(2x-1-a^2).
$$

<strong>第一步：先固定 $x$，求右侧最大值。</strong> 对任意 $x$，都有 $2x-1-a^2\le 2x-1$；当 $a=0$ 时取等号。因此

$$
a^*=0,\qquad \max_{a\in\mathbb R}(2x-1-a^2)=2x-1.
$$

<strong>第二步：把最大值代回等式，解出 $x$。</strong>

$$
x=2x-1\quad\Longrightarrow\quad x=1.
$$

所以解是 $x=1$，达到右侧最大值的选择是 $a^*=0$。对应到 BOE，就是先固定右侧的候选价值 $v$，处理对 $\pi$ 的最大化，再求满足等式的 $v$。

</div>
</div>

### Inner Maximization · 三个已知数的加权平均

<div class="td-slide">
<div class="td-slide-title">（2）Inner maximization · 加权平均不会超过最大项</div>
<div class="td-slide-body">

固定右侧的候选价值 $v$ 后，在给定状态 $s$，每个动作对应的 $q_v(s,a)$ 都成了已知数。此时只需选择概率 $\pi(a\mid s)$。先看三个已知实数 $q_1,q_2,q_3$ 的情形：

$$
\begin{aligned}
&\max_{c_1,c_2,c_3}\ \bigl(c_1q_1+c_2q_2+c_3q_3\bigr),\\
&\qquad c_1+c_2+c_3=1,\qquad c_1,c_2,c_3\ge 0.
\end{aligned}
$$

不失一般性，把最大的数记为 $q_3$，即 $q_3\ge q_1,q_2$。因为权重非负，把 $q_1,q_2$ 换成 $q_3$ 只会让加权和变大或不变。对任意可行权重都有

$$
\begin{aligned}
q_3&=(c_1+c_2+c_3)q_3\\
   &=c_1q_3+c_2q_3+c_3q_3\\
   &\ge c_1q_1+c_2q_2+c_3q_3.
\end{aligned}
$$

取 $c_1^*=c_2^*=0$、$c_3^*=1$ 就能达到上界，所以最大值是 $q_3$。若有并列，这仍是一组最优权重。

</div>
</div>

### From Policy to Action · 把结论用回 BOE

<div class="td-slide">
<div class="td-slide-title">（3）从对策略取最大到对动作取最大</div>
<div class="td-slide-body">

回到固定的状态 $s$ 和候选价值 $v$：上一块中的 $q_i$ 对应各个动作的一步前瞻值 $q_v(s,a)$，$c_i$ 对应策略概率 $\pi(a\mid s)$。这些概率非负且 $\sum_a\pi(a\mid s)=1$，因此

$$
\max_{\pi(\cdot\mid s)}\sum_a\pi(a\mid s)q_v(s,a)
=\max_{a\in\mathcal A(s)}q_v(s,a).
$$

任选一个 $a_v^*(s)\in\arg\max_{a\in\mathcal A(s)}q_v(s,a)$。$\max$ 给出最大的数值，$\arg\max$ 找出达到这个数值的动作。把全部概率给所选动作，就是一种达到最大值的策略：

$$
\pi(a\mid s)=
\begin{cases}
1,&a=a_v^*(s),\\
0,&a\ne a_v^*(s).
\end{cases}
$$

如果有多个动作并列最大，只在这些动作之间分配概率也能达到最大值。把右侧最大值代回 BOE，逐状态方程可简写为

$$
v(s)=\max_{a\in\mathcal A(s)}q_v(s,a),\qquad s\in\mathcal S.
$$

内层已不用搜索动作概率分布，但整组 $v$ 仍待求；这里的动作选择只针对暂时固定的候选价值。

</div>
</div>

## 4. Contraction Mapping Theorem

#### （1）不动点与收缩映射

<div class="td-slide">
<div class="td-slide-title">Preliminaries · Fixed point &amp; Contraction mapping</div>
<div class="td-slide-body">

设 $f:X\to X$。若 $x^*\in X$ 经 $f$ 作用后仍是自己，即 $f(x^*)=x^*$，就称 $x^*$ 为 $f$ 的<strong>不动点（fixed point）</strong>。

若存在同一个常数 $\gamma\in(0,1)$，使得对任意 $x_1,x_2\in X$ 都有

$$
\|f(x_1)-f(x_2)\|\le\gamma\|x_1-x_2\|,
$$

就称 $f$ 为<strong>收缩映射（contraction mapping，也称压缩映射）</strong>。每应用一次 $f$，两点距离至多是原来的 $\gamma$ 倍；连续应用 $k$ 次后，缩小因子至多是 $\gamma^k$。正因为 $\gamma<1$，才有 $\gamma^k\to 0$（当 $k\to\infty$）。

$\|\cdot\|$ 可以选用任一种向量范数，但整个不等式要用同一种范数，并在所选范数下验证收缩性。

</div>
</div>

#### （2）例：线性映射

<div class="td-slide">
<div class="td-slide-title">Example · 验证线性映射的收缩性</div>
<div class="td-slide-body">

设 $x\in\mathbb R^n$、$A\in\mathbb R^{n\times n}$，且 $\|A\|\le\gamma<1$，其中 $\|A\|$ 是由所选向量范数诱导的矩阵范数。因 $A0=0$，零向量是 $x=f(x)=Ax$ 的一个不动点。另一方面，

$$
\begin{aligned}
\|Ax_1-Ax_2\|
&=\|A(x_1-x_2)\|\\
&\le\|A\|\,\|x_1-x_2\|\\
&\le\gamma\|x_1-x_2\|.
\end{aligned}
$$

第二行用到诱导范数的性质 $\|Az\|\le\|A\|\|z\|$。同一个 $\gamma<1$ 对所有输入都成立，因此 $f(x)=Ax$ 是收缩映射。

</div>
</div>

#### （3）定理给出的三条结论

<div class="td-theorem">
<div class="td-theorem-title">Theorem · Contraction Mapping Theorem</div>
<div class="td-theorem-body">

若 $X$ 非空且完备，$f:X\to X$ 是收缩映射，则方程 $x=f(x)$ 有以下三条结论。这里「完备」指空间中的柯西序列在空间内有极限；本课用到的有限维实向量空间满足这个条件。

1. <strong>Existence（存在性）：</strong> 至少存在一个 $x^*\in X$，使 $f(x^*)=x^*$。
2. <strong>Uniqueness（唯一性）：</strong> 这样的不动点只有一个。
3. <strong>Algorithm（迭代求解）：</strong> 从任意 $x_0\in X$ 出发，反复执行 $x_{k+1}=f(x_k)$，就有 $x_k\to x^*$，且误差按几何速度衰减：

$$
\|x_k-x^*\|\le\gamma^k\|x_0-x^*\|.
$$

这个上界来自每轮对不动点的距离都至多乘一次 $\gamma$，因为 $f(x^*)=x^*$。

</div>
</div>

## 5. BOE: Solution {#_5-solving-the-bellman-optimality-equation}

#### （1）把 BOE 写成不动点方程

<div class="td-slide">
<div class="td-slide-title">Fixed-point form · 把右侧看作一个映射</div>
<div class="td-slide-body">

把贝尔曼最优方程右侧记为<strong>贝尔曼最优算子（Bellman optimality operator）</strong> $f$：

$$
f(\mathbf v):=\max_\pi\bigl(\mathbf r_\pi+\gamma P_\pi\mathbf v\bigr),
\qquad \mathbf v=f(\mathbf v).
$$

$f$ 输入整组候选价值，输出每个状态做一次最优的一步前瞻后得到的新价值。最大值是逐状态取的，在状态 $s$ 的分量为

$$
[f(\mathbf v)]_s
=\max_{\pi(\cdot\mid s)}\sum_a\pi(a\mid s)q_v(s,a)
=\max_{a\in\mathcal A(s)}q_v(s,a),\qquad s\in\mathcal S.
$$

因此，解 BOE 就是找一组经 $f$ 更新后保持不变的价值。

</div>
</div>

#### （2）BOE 的收缩性

<div class="td-theorem">
<div class="td-theorem-title">Theorem · Contraction Property</div>
<div class="td-theorem-body">

用<strong>最大范数（sup norm）</strong> $\|\mathbf v\|_\infty=\max_s|v(s)|$ 衡量价值向量。对任意 $\mathbf v_1,\mathbf v_2$，都有

$$
\|f(\mathbf v_1)-f(\mathbf v_2)\|_\infty
\le\gamma\|\mathbf v_1-\mathbf v_2\|_\infty.
$$

收缩系数就是折扣因子 $\gamma$。原因是：固定同一个 $(s,a)$ 时，即时奖励项相减后抵消，剩下的是下一状态价值的差按转移概率加权，再乘 $\gamma$：

$$
\begin{aligned}
|q_{v_1}(s,a)-q_{v_2}(s,a)|
&=\gamma\left|\sum_{s'}p(s'\mid s,a)\,[v_1(s')-v_2(s')]\right|\\
&\le\gamma\|\mathbf v_1-\mathbf v_2\|_\infty .
\end{aligned}
$$

若每个动作值最多变动 $d$，两组动作值的最大值也最多相差 $d$，即使取得最大值的动作变了也一样。于是每个状态的输出都满足同一上界。

</div>
</div>

#### （3）解存在、唯一，并可通过迭代求出

<div class="td-theorem">
<div class="td-theorem-title">Theorem · Existence, Uniqueness, and Algorithm</div>
<div class="td-theorem-body">

有限状态的价值向量空间完备，且 $\gamma<1$，因此可以应用上一节的收缩映射定理：BOE <strong>存在唯一的价值解</strong> $\mathbf v^*$。从任意初值 $\mathbf v_0$ 出发，迭代

$$
\mathbf v_{k+1}=f(\mathbf v_k)
=\max_\pi\bigl(\mathbf r_\pi+\gamma P_\pi\mathbf v_k\bigr)
$$

即可求解。实际每轮用同一份 $\mathbf v_k$ 计算各状态的动作值，再逐状态取最大，得到 $\mathbf v_{k+1}$。这就是<strong>值迭代（value iteration）</strong>。误差以几何速度衰减：

$$
\|\mathbf v_k-\mathbf v^*\|_\infty
\le\gamma^k\|\mathbf v_0-\mathbf v^*\|_\infty.
$$

$\gamma$ 决定这个误差上界的衰减速度；越接近 $1$，上界下降越慢。

</div>
</div>

## 6. BOE: Optimality {#_6-policy-optimality}

#### （1）选出的策略能实现 BOE 的解

<div class="td-slide">
<div class="td-slide-title">Policy optimality · 把价值解变成一套策略</div>
<div class="td-slide-body">

先把 BOE 的唯一解 $\mathbf v^*$ 代回右侧，再取一套能在每个状态达到最大值的策略：

$$
\begin{aligned}
\mathbf v^*&=\max_\pi(\mathbf r_\pi+\gamma P_\pi\mathbf v^*),\\
\pi^*&\in\arg\max_\pi(\mathbf r_\pi+\gamma P_\pi\mathbf v^*),\\
\mathbf v^*&=\mathbf r_{\pi^*}+\gamma P_{\pi^*}\mathbf v^* .
\end{aligned}
$$

最后一行是固定策略 $\pi^*$ 的贝尔曼期望方程。由第 2 课，该方程的解唯一，所以 $\mathbf v^*=\mathbf v_{\pi^*}$。这说明<strong>这套策略实际能实现这组价值</strong>。还要证明其他策略无法超过它。

</div>
</div>

#### （2）其他策略不能超过这组价值

<div class="td-theorem">
<div class="td-theorem-title">Theorem · Policy Optimality</div>
<div class="td-theorem-body">

设 $\mathbf v^*$ 是 BOE 的唯一解，$\mathbf v_\pi$ 是任意给定策略 $\pi$ 的价值，满足 $\mathbf v_\pi=\mathbf r_\pi+\gamma P_\pi\mathbf v_\pi$。则

$$
v^*(s)\ge v_\pi(s),\qquad \forall s\in\mathcal S,\ \forall\pi .
$$

把固定策略的一次更新记为 $f_\pi(\mathbf v)=\mathbf r_\pi+\gamma P_\pi\mathbf v$。从 $\mathbf v^*$ 出发，任意策略的一步更新都不会超过逐状态的最大值，即 $f_\pi(\mathbf v^*)\le\mathbf v^*$。转移概率非负，所以再应用 $f_\pi$ 仍保持大小关系。反复更新始终不超过 $\mathbf v^*$，而这些更新会收敛到 $\mathbf v_\pi$。

因此，$\pi^*$ 能实现 $\mathbf v^*$，其他策略又不能超过它，$\pi^*$ 就是最优策略。

</div>
</div>

#### （3）最优策略的具体写法

<div class="td-theorem">
<div class="td-theorem-title">Theorem · Greedy Optimal Policy</div>
<div class="td-theorem-body">

求得 $v^*$ 后，对每个状态和可用动作计算<strong>最优动作价值（optimal action value）</strong>。它表示首步固定执行 $a$，从下一状态起按最优策略行动的期望折扣回报：

$$
q^*(s,a)=\sum_r p(r\mid s,a)r
+\gamma\sum_{s'}p(s'\mid s,a)v^*(s').
$$

逐状态任选一个达到最大值的动作 $a^*(s)\in\arg\max_{a\in\mathcal A(s)}q^*(s,a)$，把全部概率给它：

$$
\pi^*(a\mid s)=
\begin{cases}
1,& a=a^*(s),\\
0,& a\ne a^*(s).
\end{cases}
$$

这是一个<strong>确定性贪心策略（deterministic greedy policy）</strong>，它在每个状态都达到 BOE 的右侧最大值，因此是最优策略。若动作并列最大，任选一个可得到确定性最优策略；只在并列最大动作之间分配概率也可得到最优策略。唯一的是 $\mathbf v^*$，策略可以有多个。

</div>
</div>
