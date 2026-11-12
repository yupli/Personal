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

<figure>
  <img src="./resources/bellman-equation/four-state-grid.png" alt="四格网格。从左上 s₁ 向下到 s₃ 得 0，向右到禁区 s₂ 得 −1。s₂ 和 s₃ 都进入右下目标 s₄ 得 +1，在 s₄ 停留也得 +1。">
  <figcaption>沿绿色箭头走，首步得 0。沿红色箭头走，首步扣 1。两条路线第二步都进入蓝色目标格，之后一直停留，每步得 +1。</figcaption>
</figure>

三个策略只在起点 $s_1$ 的首步选择上不同。两条路线都从第二步开始每步拿到 1 分。这些奖励折算到起点是 $C=\gamma+\gamma^2+\cdots=\gamma/(1-\gamma)$。取 $\gamma=0.9$ 时，$C=0.9/0.1=9$。

- 策略一固定向下，$v_{\pi_1}(s_1)=C$。
- 策略二固定向右，$v_{\pi_2}(s_1)=C-1$。
- 策略三向下、向右各占一半，起点价值是 $0.5C+0.5(C-1)$，也就是 $C-0.5$。

三个策略在 $s_1$ 的价值分别是 <strong>9、8、8.5</strong>。策略三运行一次只会得到 9 或 8。8.5 是很多次运行后趋近的平均回报。

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

看四格图中的 $s_1$。策略三以 0.5 的概率向右，给定向右，环境必定扣 1 分。另有 0.5 的概率向下，给定向下，环境必定给 0 分。因此第一项是 $0.5(-1)+0.5(0)=-0.5$。

### Expected Future Return

先固定首步动作 $a$，再按下一状态 $s'$ 分组。马尔可夫性质意味着到达同一格之后，环境的后续规则相同。继续按同一套只依赖当前状态的策略走，后面的平均回报就是 $v_\pi(s')$。用 $p(s'\mid s,a)$ 对落点取平均，得到指定首步后的平均回报。

$$
\begin{aligned}
&\mathbb E_\pi[G_{t+1}\mid S_t=s,A_t=a]\\
&\qquad=\sum_{s'}p(s'\mid s,a)v_\pi(s').
\end{aligned}
$$

然后让策略决定首步，用 $\pi(a\mid s)$ 对上式取平均。这里还没有乘折扣。

$$
\begin{aligned}
&\mathbb E_\pi[G_{t+1}\mid S_t=s]\\
&\qquad=\sum_a\pi(a\mid s)\sum_{s'}p(s'\mid s,a)v_\pi(s').
\end{aligned}
$$

仍看策略三。首步向右必到 $s_2$，向下必到 $s_3$，因此第二项折扣前是 $0.5v_{\pi_3}(s_2)+0.5v_{\pi_3}(s_3)$。进入禁区的 −1 已算在第一项。从 $s_2$ 或 $s_3$ 开始计分时，下一步都进入目标，因此两格的价值都是 $1/(1-\gamma)$。取 $\gamma=0.9$，第二项折扣前为 10，乘上 $\gamma$ 后为 9。两项相加得到 $-0.5+9=8.5$。

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

左边是当前状态的价值，右边还含有下一状态的未知价值。下一状态也可能是当前状态，例如留在目标格。有限状态下，每个状态各给出一个方程，合起来就能求解。<strong>策略评估（policy evaluation）</strong>指给定策略，求它在各个起点的价值。

## 3. Gridworld · 四格求值

用策略一，记 $v_i=v_{\pi_1}(s_i)$。从 $s_1$ 向下到 $s_3$ 得 0，$s_2$ 和 $s_3$ 都直接进入目标得 +1，目标格每步停留也得 +1。因此

$$
\begin{aligned}
v_1&=0+\gamma v_3,& v_2&=1+\gamma v_4,\\
v_3&=1+\gamma v_4,& v_4&=1+\gamma v_4.
\end{aligned}
$$

1. 把最后一式的 $\gamma v_4$ 移到左边，得到 $(1-\gamma)v_4=1$，所以 $v_4=1/(1-\gamma)$。
2. 将 $v_4$ 代入第二、三式，得到 $v_2=v_3=1+\gamma v_4=v_4$。从这两格出发，第一步就开始拿到连续的 $+1$。
3. 将 $v_3$ 代入第一式，得到 $v_1=\gamma/(1-\gamma)$。从这里出发要多等一步才拿到第一个 $+1$。

取 $\gamma=0.9$，四格价值为 $(9,10,10,10)$。禁区 $s_2$ 的价值也为 10，因为 $v_2$ 从已经在禁区的那一刻开始计分，进入禁区的扣分发生在之前。

若换成策略三，只改第一式。在每条分支里，把即时奖励与下一格的折扣价值相加，再对两条分支取平均。

$$
v_1=0.5(0+\gamma v_3)+0.5(-1+\gamma v_2).
$$

其余三式未变。代回可得 $v_1=-0.5+\gamma/(1-\gamma)$，与按轨迹求平均的结果一致。

## 4. Matrix Form & Policy Evaluation

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

四格策略一总是从 $s_1$ 向下到 $s_3$，所以奖励向量的第一项为 0，转移矩阵第一行只有第三列为 1。其余三个状态下一步都到 $s_4$ 并得 1 分。

$$
\mathbf r_\pi=\begin{pmatrix}0\\1\\1\\1\end{pmatrix},
\qquad
P_\pi=\begin{pmatrix}
0&0&1&0\\
0&0&0&1\\
0&0&0&1\\
0&0&0&1
\end{pmatrix}.
$$

用 $P_\pi$ 的第一行乘价值向量，得到 $0v_1+0v_2+1v_3+0v_4=v_3$。于是矩阵式的第一行就是 $v_1=0+\gamma v_3$。策略三向右和向下各一半，第一行变成 $(0,0.5,0.5,0)$，奖励向量第一项也变成 $-0.5$，正好对应上一节的分支计算。

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

用策略一、$\gamma=0.9$ 和零向量起步。第一轮后续价值全是 0，结果就是即时奖励 $(0,1,1,1)^\mathsf T$。第二轮，$s_1$ 用上一轮的 $s_3$ 值，得到 $0+0.9(1)=0.9$。其余三格都用上一轮的 $s_4$ 值，各得到 $1+0.9(1)=1.9$。结果是 $(0.9,1.9,1.9,1.9)^\mathsf T$，继续更新会收敛到 $(9,10,10,10)^\mathsf T$。

设误差 $\boldsymbol\delta_k=\mathbf v_k-\mathbf v_\pi$。把迭代式减去真实价值满足的方程，奖励项抵消，得到 $\boldsymbol\delta_{k+1}=\gamma P_\pi\boldsymbol\delta_k$。$P_\pi$ 的每行都是概率权重，因此一轮后的最大绝对误差至多是上一轮的 $\gamma$ 倍。第 3 课会用同样的思路说明含有最大值的公式也能迭代求解。

## 5. State Value & Action Value · 双向换算

### State Value → Action Value

指定首步动作 $a$ 后，贝尔曼公式的外层动作平均就暂时不需要了。括号里保留两项，即这个动作的平均即时奖励，以及到达下一状态后继续按 $\pi$ 走的折扣价值。

$$
\begin{aligned}
q_\pi(s,a)&=\sum_r p(r\mid s,a)r\\
&\quad+\gamma\sum_{s'}p(s'\mid s,a)v_\pi(s').
\end{aligned}
$$

用四格图和策略三，取 $\gamma=0.9$，已知 $v_{\pi_3}(s_2)=v_{\pi_3}(s_3)=10$。若指定首步向右 $a_2$，得到 $q_{\pi_3}(s_1,a_2)=-1+0.9\times10=8$。若指定首步向下 $a_3$，得到 $q_{\pi_3}(s_1,a_3)=0+0.9\times10=9$。两种算式从第二步起都继续按同一个 $\pi_3$ 走。

### Action Value → State Value

把首步选择交回策略。每个动作价值描述一个首步分支，用策略选择该分支的概率作为权重。<strong>状态价值是各动作价值的加权平均（weighted average）。</strong>

$$
v_\pi(s)=\sum_a\pi(a\mid s)q_\pi(s,a).
$$

策略三向右、向下各占一半，因此 $v_{\pi_3}(s_1)$ 等于 $0.5\times8+0.5\times9=8.5$，与第二节先算两项再相加的结果一致。

如果改为策略二，首步一定向右，起点的状态价值就等于向右的动作价值 8。仍可以单独算「首步指定向下」的 $q_{\pi_2}(s_1,a_3)=9$。策略二平常不会这么走，因此这个分支在状态价值里权重为 0。
