---
pageClass: rl-summary
---

# 第 3 课 · 贝尔曼最优公式 · V2（总结）

[切换到 V1（逐页）](bellman-optimality-slides.md)

## 1. Optimal Policy & Optimal Value

以下讨论有限状态、有限动作、奖励有界且 $0\le\gamma<1$ 的任务。比较两个策略时，要逐状态比较它们的价值。

<strong>最优策略（optimal policy）</strong> $\pi^*$ 是一套完整的行动规则，它从每个起点出发都能达到该起点的最高价值。策略可以在不同状态选不同动作，并且允许其他策略在某些状态与它打平。它实现的状态价值称为<strong>最优状态价值（optimal state value）</strong> $v^*$。

$$
\begin{aligned}
v_{\pi^*}(s)&\ge v_\pi(s) &&\text{对任意 }s,\pi,\\
v^*(s)&=v_{\pi^*}(s).
\end{aligned}
$$

给定旧策略的动作价值后，逐状态选择最大的动作称为策略改进（policy improvement）。旧价值描述的是后续继续按旧策略行动的回报。贝尔曼最优公式则要求后续价值与最优决策本身一致。

## 2. Bellman Optimality Equation

### Elementwise Form

把回报拆成 $G_t=R_{t+1}+\gamma G_{t+1}$。第一项是当前动作直接带来的奖励，第二项涵盖下一步开始的全部回报。$G_{t+1}$ 是站在下一时刻计价的，所以要再乘一次 $\gamma$ 折回当前。给定当前状态 $s$、动作 $a$，暂用 $v(s')$ 表示到达 $s'$ 后的候选价值。把奖励和下一状态分别按环境给出的概率取平均，得到

$$
\begin{aligned}
q_v(s,a)
&=\underbrace{\sum_r p(r\mid s,a)r}_{\text{期望即时奖励}}\\
&\quad+\gamma\underbrace{\sum_{s'}p(s'\mid s,a)v(s')}_{\text{期望下一状态价值}}.
\end{aligned}
$$

这里 $p(r\mid s,a)$ 是做完 $a$ 后得到奖励 $r$ 的概率，$p(s'\mid s,a)$ 是到达下一状态 $s'$ 的概率。

上面已经固定了动作，概率来自环境。如果现在只知道起点，给定策略会用 $\pi(a\mid s)$ 选择动作，还要在各个动作值外面再做一层平均。<strong>贝尔曼最优公式（Bellman optimality equation，BOE）</strong>把策略的这层概率也作为待选量，寻找能得到最大值的分配。

$$
v(s)=\max_{\pi(\cdot\mid s)}
\sum_a\pi(a\mid s)q_v(s,a).
$$

左边是从 $s$ 出发的价值，右边用同一组 $v$ 做<strong>一步前瞻（one-step lookahead）</strong>，再选最好首步。解方程时，每个状态的两边都要相等。为什么这个解就是 $v^*$，第 6 节会通过构造策略来验证。

### Matrix–Vector Form

把所有状态的价值排成列向量 $\mathbf v$。$\mathbf r_\pi$ 的第 $s$ 项是按策略选动作后的期望即时奖励，$P_\pi$ 的第 $s$ 行是按策略选动作后到各下一状态的概率。

$$
\begin{aligned}
r_\pi(s)&=\sum_a\pi(a\mid s)\sum_r p(r\mid s,a)r,\\
[P_\pi]_{ss'}&=\sum_a\pi(a\mid s)p(s'\mid s,a),\\
\mathbf v&=\max_\pi\bigl(\mathbf r_\pi+\gamma P_\pi\mathbf v\bigr).
\end{aligned}
$$

矩阵乘法的第 $s$ 行就是把各个 $v(s')$ 按转移概率加权。

因此 $\max_\pi$ 要<strong>逐状态分量</strong>计算。每一行可以选自己的动作分布，比如 $s_1$ 选向下、$s_4$ 选停留。把各行的选择合起来就是完整策略。给定策略后，$\mathbf r_\pi$ 和 $P_\pi$ 都已确定，方程就回到第 2 课的策略评价。

## 3. Solving for Value and Policy

公式里有两个未知量。<strong>价值 $v$</strong> 同时出现在等式左边和右边的后续价值里。<strong>策略 $\pi$</strong> 则藏在右边的最大化里。处理顺序是先把 $v$ 当作已知，解出右侧最大值的表达式，再用这个表达式求满足整条等式的 $v$。

### Inner Maximization · 从策略到动作

贝尔曼最优公式也按这个顺序处理。固定候选 $v$ 后，每个 $q_v(s,a)$ 都是一个已知数。以 $m=\max_a q_v(s,a)$ 为上界，概率加权平均满足

$$
\sum_a \pi(a\mid s)q_v(s,a)
\le \sum_a \pi(a\mid s)m
=m.
$$

不同的候选价值可能改变最大动作，因此每轮更新价值后都要重新做内层最大化。

内层优化可以直接对动作取最大，逐状态的公式化为

$$
v(s)=\max_{a\in\mathcal A(s)}q_v(s,a).
$$

把右端记为<strong>贝尔曼最优算子（Bellman optimality operator）</strong> $[Tv](s)=\max_a q_v(s,a)$。整组状态价值的求解问题写成

$$
v=Tv.
$$

读作「输入整组 $v$，在每个状态算出所有动作的值并取最大，输出恰好还是这组 $v$」。

## 4. Fixed Points & Contraction

若 $f(x^*)=x^*$，则 $x^*$ 是 $f$ 的<strong>不动点（fixed point）</strong>，也就是更新后保持原值的输入。若存在同一个 $0\le c<1$，使任意两点 $x,y$ 经过 $f$ 后的距离都至多是原来的 $c$ 倍，那么 $f$ 就是<strong>收缩映射（contraction mapping，也称压缩映射）</strong>。

$$
\|f(x)-f(y)\|\le c\|x-y\|.
$$

价值向量之间的距离用最大范数衡量。

### Existence, Uniqueness & Convergence

<strong>收缩映射定理（contraction mapping theorem）</strong>要求 $f$ 把一个完备空间映到自身。完备性保证一个各项最终彼此任意接近的序列会在这个空间里收敛。有限维实数价值向量满足这个条件。

| Conclusion | Derivation |
| --- | --- |
| Existence | 令 $x_{k+1}=f(x_k)$、$d=\|x_1-x_0\|$。相邻距离至多是 $c^kd$，第 $k$ 步之后的总移动距离至多是 $c^kd/(1-c)$。由完备性得到极限 $x^*$，由连续性得 $f(x^*)=x^*$。 |
| Uniqueness | 若 $x^*,y^*$ 都是不动点，则 $\|x^*-y^*\|\le c\|x^*-y^*\|$。由于 $c<1$，两点的距离只能是 0。 |
| Convergence | 任意 $x_0$ 下，每次迭代到不动点的距离至多乘一次 $c$，故 $\|x_k-x^*\|\le c^k\|x_0-x^*\|$。 |

### The Bellman Operator Is a Contraction

用<strong>最大范数（sup norm）</strong> $\|v-w\|_\infty=\max_s|v(s)-w(s)|$ 衡量两组价值的距离。先在每个状态求差的绝对值，再挑最大的一个。

第一步，固定同一个状态和动作。两次计算用的是同一条奖励规则，因此即时奖励相减后抵消。相减后只剩下一状态价值的差。

$$
\begin{aligned}
&|q_v(s,a)-q_w(s,a)|\\
&\quad=\gamma\left|\sum_{s'}p(s'\mid s,a)(v(s')-w(s'))\right|\\
&\quad\le\gamma\sum_{s'}p(s'\mid s,a)|v(s')-w(s')|\\
&\quad\le\gamma\|v-w\|_\infty.
\end{aligned}
$$

最后一步把每个绝对值都换成最大差距，而所有转移概率加起来是 1。

第二步，对动作取最大值。设每个动作值最多改变 $d=\gamma\|v-w\|_\infty$。即使取最大值的动作换了，新列表中的每一项也至多等于旧列表的最大值加 $d$。反过来同理，所以两个最大值最多差 $d$。这对每个状态都成立，于是

$$
\|Tv-Tw\|_\infty\le\gamma\|v-w\|_\infty.
$$

因为 $\gamma<1$，定理适用。<strong>方程存在唯一的价值解，从任何初值反复应用 $T$ 都会趋近它。</strong>

## 5. Value Iteration

<strong>值迭代（value iteration）</strong>从任意一组 $v_0$ 出发，常用全零值。一次完整更新分三步。

1. 用同一份旧值 $v_k$，计算每个状态下所有动作的 $q_{v_k}(s,a)$。
2. 对每个状态取最大值，写入 $v_{k+1}(s)=\max_a q_{v_k}(s,a)$，并可记录取得最大值的动作。
3. 全部状态更新完后，用 $v_{k+1}$ 作为下一轮的输入。可以检查两轮价值最大的差距，判断下一轮还能改变多少。若相邻两轮最多差 $d$，之后每轮差距依次至多是 $\gamma d,\gamma^2d,\ldots$，所以当前新值与最终解最多差 $\gamma d/(1-\gamma)$。

## 6. Extracting a Greedy Policy

求得价值解 $v^*$ 后，固定第一步做 $a$，之后用 $v^*$ 计算后续回报，就得到<strong>最优动作价值（optimal action value）</strong>。

$$
\begin{aligned}
q^*(s,a)&=q_{v^*}(s,a)\\
&=\sum_r p(r\mid s,a)r\\
&\quad+\gamma\sum_{s'}p(s'\mid s,a)v^*(s').
\end{aligned}
$$

允许首步也自由选择时，$v^*(s)=\max_a q^*(s,a)$。$\max$ 给出最大的<strong>数值</strong>，$\arg\max$ 给出取得最大值的<strong>动作</strong>。每个状态都挑一个最大动作，就得到一套确定性的<strong>贪心策略（greedy policy）</strong>。

### Why the Greedy Policy Is Optimal

**先看这套贪心策略能不能实现 $v^*$。** 记 $T_\pi v=\mathbf r_\pi+\gamma P_\pi v$ 为固定策略的一步更新。$T$ 取各动作的最大值，而贪心策略 $\pi^*$ 在每个状态恰好选中这个最大值，所以 $T_{\pi^*}v^*=Tv^*=v^*$。这就是策略 $\pi^*$ 的贝尔曼方程。该方程的解唯一，所以这套策略实际走出来的价值就是 $v^*$。

**再看其他策略能不能超过 $v^*$。** 从同一组 $v^*$ 出发，任意策略 $\pi$ 用概率对动作值取平均，平均值不会超过最大值，故 $T_\pi v^*\le v^*$。这条不等式逐状态成立。再次应用 $T_\pi$ 时，非负的转移概率会保持大小关系，因此 $T_\pi^2v^*\le T_\pi v^*\le v^*$。依此类推，每轮都不超过 $v^*$。根据第 2 课的策略评估迭代，左边最终趋向该策略的真实价值 $v_\pi$。因此从任何状态出发，$\pi$ 的价值都不会超过 $v^*$。

有多个动作并列最大时，可以用并列处理规则（tie-breaking rule）任选一个，也可以只在这些动作之间分配概率。两种做法都能实现同一个 $v^*$。<strong>最优价值唯一，最优策略可以有多个。</strong>

## 7. Reward Transformations

### Positive Affine Transformation

奖励的正仿射变换（positive affine transformation）指先乘正数再加常数。把 $ax+b$ 用于奖励时，$x$ 就是每一步的原始奖励。为免与动作 $a$ 混淆，把缩放系数和平移量记为 $\alpha,\beta$。设持续折扣任务中每一步的奖励都变为 $r'=\alpha r+\beta$，环境转移和折扣因子 $\gamma$ 固定。把新奖励代入一条轨迹的回报，

$$
\begin{aligned}
G'_t
&=\sum_{k=0}^\infty\gamma^k(\alpha R_{t+k+1}+\beta)\\
&=\alpha G_t+\beta\sum_{k=0}^\infty\gamma^k\\
&=\alpha G_t+\frac{\beta}{1-\gamma}.
\end{aligned}
$$

展开看，第一步多出的常数是 $\beta$，第二步是 $\gamma\beta$，第三步是 $\gamma^2\beta$。不管智能体怎么走，这部分都是同一个数。对轨迹回报取平均，得到 $v'_\pi(s)=\alpha v_\pi(s)+\beta/(1-\gamma)$。固定首步动作再取平均，动作价值也遵循同样的变换。

比较同一起点下的两套策略时，减去对方的价值，两边的常数正好消掉，原来的差距只乘一次缩放系数。<strong>缩放系数为正时，领先的仍然领先，并列的仍然并列。</strong> 第 47 页写的是 $a\ne0$，其中 $a<0$ 会反转大小关系，$a=0$ 会让所有回报相同。

如果只在终止前加 $\beta$，不同长度的轨迹累加的折扣常数可能不同，策略排序就可能改变。
