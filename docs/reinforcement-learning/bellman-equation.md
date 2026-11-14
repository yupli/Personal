---
pageClass: rl-summary
---

# 第 2 课 · 贝尔曼公式 · V2（总结）

[切换到 V1（逐页）](bellman-equation-slides.md)

## 1. Return, State Value & Action Value

<strong>给定走法后，贝尔曼公式用来算从每一格出发平均能拿多少分。</strong> 记时刻 $t$ 的状态和动作为 $S_t,A_t$。执行 $A_t$ 后收到的第一笔即时奖励（immediate reward）是 $R_{t+1}$。把一条实际轨迹的奖励按 $1,\gamma,\gamma^2,\ldots$ 加权相加，就得到该次运行的折扣回报 $G_t$，其中 $0\le\gamma<1$。同一个起点可能产生不同的轨迹，所以还要看这些回报的平均值。

<strong>状态价值（state value）</strong>只指定起点 $s$，首步和后续动作都按策略 $\pi$ 选择。

$$
v_\pi(s)=\mathbb E_\pi[G_t\mid S_t=s].
$$

<strong>动作价值（action value）</strong>还指定第一步做 $a$，从第二步起按 $\pi$ 走。即使 $\pi$ 平常不会在 $s$ 选 $a$，也可以计算强制第一步做 $a$ 会怎样。

$$
q_\pi(s,a)=\mathbb E_\pi[G_t\mid S_t=s,A_t=a].
$$

## 2. Bellman Expectation Equation

先从单条轨迹做代数拆分。从 $t+1$ 开始计算时，$R_{t+2}$ 是它的第一笔奖励，权重是 1。换回时刻 $t$ 计价时，它已是第二笔，所以换算时要把整串后续奖励一起乘 $\gamma$。

$$
\begin{aligned}
G_t&=R_{t+1}+\gamma R_{t+2}+\gamma^2R_{t+3}+\cdots\\
   &=R_{t+1}+\gamma\bigl(R_{t+2}+\gamma R_{t+3}+\cdots\bigr)\\
   &=R_{t+1}+\gamma G_{t+1}.
\end{aligned}
$$

再固定起点 $S_t=s$，求这些结果的<strong>条件期望（conditional expectation）</strong>。这表示只在给定起点的条件下按概率取平均。即时奖励和后续回报可以分别取期望，再相加。

$$
\begin{aligned}
v_\pi(s)
&=\underbrace{\mathbb E_\pi[R_{t+1}\mid S_t=s]}_{\text{平均即时奖励}}\\
&\quad+\gamma\underbrace{\mathbb E_\pi[G_{t+1}\mid S_t=s]}_{\text{下一时刻的平均回报}}.
\end{aligned}
$$

### Expected Immediate Reward

只知道起点 $s$ 时，动作由策略选，奖励由环境给。$\pi(a\mid s)$ 是选中 $a$ 的概率，$p(r\mid s,a)$ 是选中 $a$ 后得到 $r$ 的概率。<strong>先按环境概率求每个动作的平均奖励，再按策略概率把各动作合起来。</strong>

$$
\mathbb E[R_{t+1}\mid S_t=s,A_t=a]=\sum_r p(r\mid s,a)r.
$$

用动作的选择概率加权，得到从 $s$ 出发按策略走一步的平均奖励 $r_\pi(s)$。

$$
\begin{aligned}
r_\pi(s)
&=\mathbb E_\pi[R_{t+1}\mid S_t=s]\\
&=\sum_a\pi(a\mid s)\sum_r p(r\mid s,a)r.
\end{aligned}
$$

### Expected Future Return

课件先按<strong>下一状态（next state）</strong>分组，再展开转移概率。这里求的是 $\mathbb E_\pi[G_{t+1}\mid S_t=s]$，也就是已知当前状态 $s$ 时，从下一时刻开始的平均回报。

<strong>1. 按下一状态使用全期望公式（law of total expectation）。</strong> 现在只知道 $S_t=s$，还不知道 $S_{t+1}$。先固定一个可能的落点 $s'$，求这一组轨迹的平均后续回报，再乘上落到 $s'$ 的条件概率 $p_\pi(s'\mid s)$。对所有可能的 $s'$ 求和。

$$
\begin{aligned}
&\mathbb E_\pi[G_{t+1}\mid S_t=s]\\
&=\sum_{s'}p_\pi(s'\mid s)\,
\mathbb E_\pi[G_{t+1}\mid S_t=s,S_{t+1}=s'].
\end{aligned}
$$

<strong>2. 用马尔可夫性质（Markov property）去掉旧状态。</strong> 给定 $S_{t+1}=s'$ 后，后续动作由同一个只依赖当前状态的策略 $\pi$ 选择，环境也从 $s'$ 按马尔可夫规则继续。因此，知道先前的 $S_t=s$ 不会再改变后续回报的条件分布。课件在这一步划掉了条件里的 $S_t=s$。剩下的期望正是从 $s'$ 出发的状态价值。

$$
\begin{aligned}
&\mathbb E_\pi[G_{t+1}\mid S_t=s,S_{t+1}=s']\\
&=\mathbb E_\pi[G_{t+1}\mid S_{t+1}=s']\\
&=v_\pi(s').
\end{aligned}
$$

<strong>3. 展开落点的概率。</strong> $p_\pi(s'\mid s)$ 是按策略走一步时到达 $s'$ 的概率。它包含所有能到达 $s'$ 的动作。把事件「选 $a$ 且到达 $s'$」对 $a$ 求和，再用条件概率的乘法规则拆开每一项。

$$
\begin{aligned}
p_\pi(s'\mid s)
&=\sum_a \Pr_\pi(A_t=a,S_{t+1}=s'\mid S_t=s)\\
&=\sum_a \pi(a\mid s)\,p(s'\mid s,a).
\end{aligned}
$$

<strong>4. 代回并交换求和顺序。</strong> 课件先保留下一状态在外层。与即时奖励项合并时，再把动作概率放到外层。

$$
\begin{aligned}
\mathbb E_\pi[G_{t+1}\mid S_t=s]
&=\sum_{s'}v_\pi(s')\,p_\pi(s'\mid s)\\
&=\sum_{s'}v_\pi(s')\sum_a p(s'\mid s,a)\pi(a\mid s)\\
&=\sum_a\pi(a\mid s)\sum_{s'}p(s'\mid s,a)v_\pi(s').
\end{aligned}
$$

$G_{t+1}$ 的第一笔奖励是 $R_{t+2}$，它在 $G_{t+1}$ 里的权重是 1。回到时刻 $t$ 计价时，这整项乘一次 $\gamma$。$R_{t+1}$ 已经由即时奖励项单独计算。

### Putting Both Terms Together

合并两项，得到每个状态都满足的贝尔曼期望方程（Bellman expectation equation）。

$$
\begin{aligned}
v_\pi(s)&=\sum_a\pi(a\mid s)\biggl[
  \sum_r p(r\mid s,a)r\\
&\qquad+\gamma\sum_{s'}p(s'\mid s,a)v_\pi(s')
\biggr].
\end{aligned}
$$

左边是当前状态的价值，右边还含有下一状态的未知价值。下一状态也可能是当前状态。有限状态下，每个状态各给出一个方程，合起来就能求解。<strong>策略评估（policy evaluation）</strong>指给定策略，求它在各个起点的价值。

## 3. Matrix Form & Policy Evaluation

把动作概率平均进即时奖励和转移概率。设 $r_\pi(s)$ 是从 $s$ 按策略走一步的平均奖励，$p_\pi(s'\mid s)$ 是按策略走一步到达 $s'$ 的概率。

$$
\begin{aligned}
r_\pi(s)&=\sum_a\pi(a\mid s)\sum_r p(r\mid s,a)r,\\
p_\pi(s'\mid s)&=\sum_a\pi(a\mid s)p(s'\mid s,a).
\end{aligned}
$$

把价值和平均奖励排成列向量（column vectors）。转移矩阵（transition matrix） $P_\pi$ 的第 $i$ 行第 $j$ 列是从 $s_i$ 到 $s_j$ 的概率，每行之和为 1。

$$
\mathbf v_\pi=\mathbf r_\pi+\gamma P_\pi\mathbf v_\pi.
$$

### Closed-form Solution

把含有 $\mathbf v_\pi$ 的项放在左边。$I$ 是单位矩阵，满足 $I\mathbf v_\pi=\mathbf v_\pi$。

$$
\begin{aligned}
\mathbf v_\pi-\gamma P_\pi\mathbf v_\pi&=\mathbf r_\pi,\\
(I-\gamma P_\pi)\mathbf v_\pi&=\mathbf r_\pi,\\
\mathbf v_\pi&=(I-\gamma P_\pi)^{-1}\mathbf r_\pi.
\end{aligned}
$$

最后一行是<strong>闭式解（closed-form solution）</strong>。因为 $\gamma<1$，若一个非零向量 $\mathbf x$ 满足 $\mathbf x=\gamma P_\pi\mathbf x$，它的最大绝对分量就至多是自身的 $\gamma$ 倍，产生矛盾。因此 $I-\gamma P_\pi$ 可逆。实际可以直接解第二行的线性方程组。

### Iterative Solution

<strong>迭代解（iterative solution）</strong>把第 $k$ 轮的整组价值 $\mathbf v_k$ 放到等式右边，得到下一轮 $\mathbf v_{k+1}=\mathbf r_\pi+\gamma P_\pi\mathbf v_k$。全轮都用旧值，算完一组才一起换新值，这叫同步更新（synchronous update）。

令 $\boldsymbol\delta_k=\mathbf v_k-\mathbf v_\pi$。迭代式减去贝尔曼方程后，奖励项抵消。$P_\pi$ 每行的概率之和是 1，所以加权平均无法放大最大绝对误差。

$$
\begin{aligned}
\boldsymbol\delta_{k+1}
&=\gamma P_\pi(\mathbf v_k-\mathbf v_\pi)\\
&=\gamma P_\pi\boldsymbol\delta_k,\\
\|\boldsymbol\delta_k\|_\infty
&\le\gamma^k\|\boldsymbol\delta_0\|_\infty
\longrightarrow 0.
\end{aligned}
$$

#### Iterative Policy Evaluation · 课件原页

<figure>
  <img src="./resources/bellman-equation/bellman-40-procedure.webp" alt="原课件第 40 页的迭代解与收敛公式" width="571" height="265" loading="lazy">
</figure>

一轮内固定策略和整份旧价值。误差递推给出 $\|V-v_\pi\|_\infty\le\gamma\Delta/(1-\gamma)$，其中 $V$ 指刚完成更新后的向量。

## 4. State Value & Action Value · 双向换算

### State Value → Action Value

指定首步动作 $a$ 后，贝尔曼公式的外层动作平均就暂时不需要了。括号里保留两项，即这个动作的平均即时奖励，以及到达下一状态后继续按 $\pi$ 走的折扣价值。

$$
\begin{aligned}
q_\pi(s,a)&=\sum_r p(r\mid s,a)r\\
&\quad+\gamma\sum_{s'}p(s'\mid s,a)v_\pi(s').
\end{aligned}
$$

### Action Value → State Value

把首步选择交回策略。每个动作价值描述一个首步分支，用策略选择该分支的概率作为权重。<strong>状态价值是各动作价值的加权平均（weighted average）。</strong>

$$
v_\pi(s)=\sum_a\pi(a\mid s)q_\pi(s,a).
$$
