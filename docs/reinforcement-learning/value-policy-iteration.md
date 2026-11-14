---
pageClass: rl-summary
---

# 第 4 课 · 值迭代与策略迭代 · V2（总结）

[切换到 V1（逐页）](value-policy-iteration-slides.md)

## 1. Model-based planning

本课做的是<strong>基于模型的规划（model-based planning）</strong>。环境模型已知。对于任意状态 $s$ 和动作 $a$，能算出这一步的平均奖励，也知道各个下一状态 $s'$ 出现的概率。这类方法属于<strong>动态规划（dynamic programming）</strong>。

给定状态价值估计（state-value estimate）$v$，指定先做动作 $a$，把平均即时奖励与折扣后的落点价值加起来。这种<strong>一步前瞻（one-step lookahead）</strong>用来比较各个首步动作。

$$
\begin{aligned}
q_v(s,a)
&=\underbrace{\sum_r p(r\mid s,a)r}_{\text{平均即时奖励}}\\
&\quad+\gamma\underbrace{\sum_{s'}p(s'\mid s,a)v(s')}_{\text{平均落点价值}}.
\end{aligned}
$$

比较同一状态下的这些分数，选一个最高的动作，就得到对 $v$ 的<strong>贪心策略（greedy policy）</strong>。它依赖所用的 $v$。估计变了，选出的动作也可能变。

后面会反复用到两种更新。<strong>Bellman expectation backup</strong> $T_\pi v$ 按固定策略 $\pi$ 的动作概率加权。<strong>Bellman optimality backup</strong> $Tv$ 在每个状态取最大值。这里的 backup 指用当前估计做一次贝尔曼更新。

$$
\begin{aligned}
[T_\pi v](s)&=\sum_a\pi(a\mid s)q_v(s,a),\\
[Tv](s)&=\max_a q_v(s,a).
\end{aligned}
$$

把所有格子的价值排成向量，固定策略的一次更新也可写成 $T_\pi v=\mathbf r_\pi+\gamma P_\pi v$。其中 $\mathbf r_\pi$ 收集各格的平均即时奖励，$P_\pi$ 的每一行是按该策略走一步的落点概率。

三种算法的主要区别在于<strong>选出一套贪心动作后，用它更新几次价值才重新选动作</strong>。

## 2. Value Iteration

### Bellman optimality equation

第 3 课的贝尔曼最优公式（Bellman optimality equation，BOE）是 $v^*=Tv^*$。当 $0\le\gamma<1$，$T$ 是收缩映射（contraction mapping）。从任意初值 $v_0$ 反复做 $v_{k+1}=Tv_k$，就会趋近最优值 $v^*$。

每一轮先用<strong>同一份旧值</strong> $v_k$ 算所有 $q_{v_k}(s,a)$。先算完所有格、再一起替换旧值，这叫同步更新（synchronous update）。每个状态要记两样东西。

- <strong>Policy update（策略更新）</strong>记录哪一个动作取到最大值，由此得到 $\pi_{k+1}$。
- <strong>Value update（价值更新）</strong>把这个最大分数写进 $v_{k+1}(s)$。所有格写完后，下一轮才改用 $v_{k+1}$。

因为 $\pi_{k+1}$ 选的恰好是最大动作，所以 $v_{k+1}=T_{\pi_{k+1}}v_k=Tv_k$。右侧只做了一次更新，中间的 $v_{k+1}$ 是价值估计，一般尚未等于策略 $\pi_{k+1}$ 的完整价值 $v_{\pi_{k+1}}$。

## 3. Policy Iteration

### Policy evaluation & improvement

从一套初始策略 $\pi_0$ 开始，每轮做两件事。

1. <strong>Policy evaluation（策略评价）</strong>。固定当前策略 $\pi_k$，求它真正的长期价值 $v_{\pi_k}$。这个值满足 $v_{\pi_k}=T_{\pi_k}v_{\pi_k}$。可以直接解线性方程组，也可以反复应用 $T_{\pi_k}$ 直到收敛。这段内层计算始终使用同一套动作概率。
2. <strong>Policy improvement（策略改进）</strong>。用刚求出的 $v_{\pi_k}$ 计算每个首步动作的分数 $q_{\pi_k}(s,a)$。该分数表示第一步指定做 $a$，从第二步起照旧策略走。每格选一个分数最大的动作，组成下一轮的 $\pi_{k+1}$。

外层循环（outer loop）的下标 $k$ 数已经换了几次策略。内层循环（inner loop）的下标 $j$ 数固定同一个策略更新了几次。如果评价完成后，当前动作在每个状态都已经是最大动作，就可以停止。并列时保留原来的最大动作，可以避免在等价选择之间反复切换。

完整评价（exact policy evaluation）可以直接解移项后的线性方程组，也可以从任意初值反复应用第二式，直到收敛。

$$
\begin{aligned}
(I-\gamma P_{\pi_k})v_{\pi_k}&=\mathbf r_{\pi_k},\\
v^{(j+1)}&=\mathbf r_{\pi_k}+\gamma P_{\pi_k}v^{(j)}.
\end{aligned}
$$

### Policy improvement theorem

旧策略自己的价值是 $v_{\pi_k}=T_{\pi_k}v_{\pi_k}$。用这组旧价值比较动作，旧策略取加权平均，新策略 $\pi_{k+1}$ 取最大值，所以第一次按新策略更新后，价值逐状态至少和原来一样高。

$$
T_{\pi_{k+1}}v_{\pi_k}=Tv_{\pi_k}\ge v_{\pi_k}.
$$

固定新策略再更新时，后续价值按非负概率加权。上一轮每个分量都不低于再上一轮，这一轮也会维持同样的大小关系。于是从 $v_{\pi_k}$ 开始评价新策略，内层估计逐步不降，最后收敛到 $v_{\pi_{k+1}}$。

为什么会达到最优？从同一份初值出发，值迭代只做一次最优更新，策略迭代的完整评价至少达到这一次更新的值。由于 $T$ 也保持逐状态的大小关系，后续各轮仍可用值迭代的结果作为下界。上界是 $v^*$，而下界本身就会趋近 $v^*$，所以策略迭代的价值也趋近最优值。

## 4. Truncated Policy Iteration

### Policy Iteration vs. Value Iteration

沿用课件第 32 页的五步对照。记 $\mathcal G(v)$ 为对 $v$ 做一步前瞻后逐状态选出的贪心策略。为了对齐起点，令 Value Iteration 的 $v_0=v_{\pi_0}$，并让两种算法采用同样的并列动作选择规则。

| Step | Policy Iteration | Value Iteration | Difference |
| --- | --- | --- | --- |
| 1. Initial policy | 给定 $\pi_0$ | — | VI 可以直接从价值开始 |
| 2. Initial value | $v_{\pi_0}=T_{\pi_0}v_{\pi_0}$ | $v_0:=v_{\pi_0}$ | 对齐价值起点 |
| 3. Greedy policy | $\pi_1=\mathcal G(v_{\pi_0})$ | $\pi_1=\mathcal G(v_0)$ | 得到同一个 $\pi_1$ |
| 4. Value update | $v_{\pi_1}=T_{\pi_1}v_{\pi_1}$ | $v_1=T_{\pi_1}v_0$ | 完整评价与一次更新。此处 $v_{\pi_1}\ge v_1$ |
| 5. Next policy | $\pi_2=\mathcal G(v_{\pi_1})$ | $\pi'_2=\mathcal G(v_1)$ | 输入不同，动作可能不同 |

第 4 步使用同一个算子 $T_{\pi_1}v=\mathbf r_{\pi_1}+\gamma P_{\pi_1}v$。区别在右侧的价值：PI 求满足不动点方程的 $v_{\pi_1}$，VI 直接代入旧估计 $v_0$。

### Evaluation depth

把课件第 33 页的内层迭代写成 $u_0=v_0$、$u_{j+1}=T_{\pi_1}u_j$。在这个对齐的起点，$u_1=Tv_0\ge v_0$，且 $T_{\pi_1}$ 保持逐状态大小关系。因此

$$
u_0\le u_1\le u_2\le\cdots\le u_m\le v_{\pi_1}.
$$

| Algorithm | Evaluation steps | Next value |
| --- | --- | --- |
| Value Iteration | 只更新 1 步 | $u_1$ |
| Truncated Policy Iteration | 更新有限的 $m$ 步 | $u_m$ |
| Policy Iteration | 求到评价方程的解 | $v_{\pi_1}$ |

有限步截断得到近似策略评价（approximate policy evaluation）。$k$ 数外层换策略的轮次，$j$ 数内层评价步，$m$ 是每轮的截断上限。

$$
\pi_{k+1}=\mathcal G(v_k),\qquad
v_{k+1}=(T_{\pi_{k+1}})^m v_k.
$$

若按课件伪代码从初始策略开始，先评价该策略，再进入这个循环。

### Monotone value improvement

若从上一套策略的真实价值开始，新策略贪心，所以第一次更新已经不低于起点。固定它继续更新会保持这个大小关系。截在第 $m$ 步时，拿到的是一次更新与完整评价之间的价值。随意指定初始估计时，不能仅凭这条结论断言每个分量从第一轮开始都上升。

在上述共同初值下，截断值仍可用值迭代的结果作下界。具体来说，每轮固定策略做的第一步等于 $Tv$，后续几步不降，因此截断值至少达到 $Tv$。把 $u_m$ 交给下一轮时，重新做最优更新又至少和原策略再做一步一样好，所以下一轮仍能重复这个比较。这样得到的价值被夹在值迭代的结果与 $v^*$ 之间。

## 5. Convergence & stopping

评价步数增加时，每个外层循环的成本也增加。比较算法时要区分外层迭代次数与总计算量。

实际求解时 $v^*$ 通常未知，停止条件（stopping criterion）要用可计算的量。值迭代可以检查相邻两轮价值差。对任何一组候选 $v$，也可以算<strong>贝尔曼残差（Bellman residual）</strong> $\|Tv-v\|_\infty$，看看再做一次最优更新还会改变多少。由于 $T$ 每次至多按 $\gamma$ 缩小两组价值的差，当前价值距最优值的最大误差至多是残差除以 $1-\gamma$。只看到贪心动作一轮没变时，仍应检查价值或残差。
