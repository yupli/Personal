---
pageClass: rl-summary
---

# 第 5 课 · 蒙特卡洛方法 · V2（总结）

## 1. From Policy Iteration to Model-Free RL

第四课的[策略迭代](value-policy-iteration.md#_2-policy-iteration)交替进行策略评价（policy evaluation）和策略改进（policy improvement）。第 $k$ 轮先求当前策略 $\pi_k$ 的状态价值，再找使一步前瞻值最大的策略。用矩阵形式写为

$$
\begin{aligned}
\mathbf v_{\pi_k}
&=\mathbf r_{\pi_k}+\gamma P_{\pi_k}\mathbf v_{\pi_k},\\
\pi_{k+1}
&\in\arg\max_{\pi}
\bigl(\mathbf r_{\pi}+\gamma P_{\pi}\mathbf v_{\pi_k}\bigr).
\end{aligned}
$$

上式中的最大化逐状态进行。在状态 $s$，把策略改进的目标展开为各动作一步前瞻值的加权平均。令

$$
\begin{aligned}
q_{\pi_k}(s,a)
&=\sum_r p(r\mid s,a)\,r\\
&\quad+\gamma\sum_{s'}p(s'\mid s,a)\,v_{\pi_k}(s').
\end{aligned}
$$

于是策略改进可写为

$$
\pi_{k+1}(\cdot\mid s)
\in\arg\max_{\pi(\cdot\mid s)}
\sum_{a\in\mathcal A(s)}\pi(a\mid s)q_{\pi_k}(s,a).
$$

所以，只要得到各动作的 $q_{\pi_k}(s,a)$，就能比较动作并改进策略。上面的一步前瞻式用到了奖励分布 $p(r\mid s,a)$ 和状态转移概率 $p(s'\mid s,a)$。同一个动作价值还可以直接写成回报的条件期望：

$$
q_{\pi_k}(s,a)
=\mathbb E_{\pi_k}[G_t\mid S_t=s,\ A_t=a].
$$

这里固定的是状态 $s$ 和首步动作 $a$，从下一次选动作起才按 $\pi_k$ 行动。只要能与环境交互并观察奖励，就可以用采到的回报估计这个期望，无须事先知道奖励分布和状态转移概率。

## 2. MC Basic

### Monte Carlo Estimation of Action Values

固定 $\pi_k$ 和一个状态动作对 $(s,a)$。从 $s$ 开始，首步执行 $a$，随后按 $\pi_k$ 一直走到回合结束。第 $i$ 条回合从首步开始的折扣回报 $g^{(i)}(s,a)$，就是随机变量 $G_t$ 在同一条件下的一次观测。重复采集 $N$ 条回合，用样本均值估计动作价值：

$$
\widehat q_{\pi_k}(s,a)
=\frac{1}{N}\sum_{i=1}^{N}g^{(i)}(s,a).
$$

在这一轮的评价期间保持 $\pi_k$ 固定。若这些回合独立地按相同规则采集且回报期望有限，样本均值会随 $N$ 增大趋近 $q_{\pi_k}(s,a)$。实际运行时用足够多的有限回合做近似。

### Policy Evaluation & Policy Improvement

1. **策略评价**。给定初始策略 $\pi_0$，在第 $k$ 轮为每个 $(s,a)$ 分别从该对出发采集回合，直接用平均回报估计 $\widehat q_{\pi_k}(s,a)$。
2. **策略改进**。评价完成后，对每个状态从估计值最大的动作中选一个 $a_k^*(s)$，构造贪心策略 $\pi_{k+1}$，再进入下一轮。

$$
\begin{aligned}
a_k^*(s)&\in\arg\max_{a\in\mathcal A(s)}\widehat q_{\pi_k}(s,a),\\
\pi_{k+1}(a\mid s)&=
\begin{cases}
1,&a=a_k^*(s),\\
0,&a\ne a_k^*(s).
\end{cases}
\end{aligned}
$$

MC Basic 保留了策略迭代的评价与改进循环。评价时直接用回合样本估计动作价值，省去了先解 $\mathbf v_{\pi_k}$ 再借助模型计算 $q_{\pi_k}$ 的步骤。有限样本下，贪心改进依据的是估计值，估计接近的动作可能排错顺序。

### Procedure Summary & Pseudocode

课件从 $\pi_0$ 开始，以求最优策略为目标，在价值估计稳定前反复评价和改进。每个状态的所有候选动作都估计完后，才比较它们并写入新策略。本轮用于评价的回合始终按旧策略 $\pi_k$ 继续执行。

<figure>
  <img src="./resources/monte-carlo/mc-basic-pseudocode.png" alt="课件原版 MC Basic 伪代码，展示逐状态动作对采集回合、取回报均值及贪心更新" width="2120" height="1334" loading="lazy">
</figure>

### Episode Length · 回合长度怎么设

在课件的例子里，只有到达目标才获得奖励。回合太短时，只有靠近目标的状态有机会在截止前拿到奖励。较远状态的样本回报都为零，估计出来的状态价值也就为零。把步数上限逐渐调大时，近处的状态通常先出现非零估计，较远的状态要等到回合长到足以走到目标才有机会。

例如，从某个状态最少要走 8 步才能到达目标，若每条回合最多采 5 步，即使多采很多条，也观察不到该状态通往目标的奖励。把上限设到至少 8 步，才有可能采到这笔奖励，实际需要多长还取决于策略走到目标通常要几步。

回合有自然终点时，采到终点即可。需要设置步数上限时，可以逐步加长回合，比较远处状态的价值估计和贪心动作是否仍明显变化。上限要足够覆盖重要的延迟奖励，有限步数也能做到这一点。**增加回合条数**能缓解采样波动，**延长单条回合**才能让原先被截掉的奖励进入估计。

## 3. MC Exploring Starts

### 一条回合里的多次访问

在网格世界里，按策略采集的一条回合可以包含下面这段轨迹：

$$
s_1\xrightarrow{a_2}s_2\xrightarrow{a_4}s_1
\xrightarrow{a_2}s_2\xrightarrow{a_3}s_5
\xrightarrow{a_1}\cdots
$$

每当一个状态动作对出现在回合中，就算一次**访问（visit）**。从时刻 $t$ 开始的那段轨迹给出回报 $G_t$，可以用来估计该时刻的动作价值。因此，这条回合除了提供 $(s_1,a_2)$ 的回报，还为 $(s_2,a_4)$、$(s_2,a_3)$ 和 $(s_5,a_1)$ 等状态动作对提供了样本。遇到重复访问时，有三种取样方式：

- **Initial-visit** 只用时刻 $t=0$ 的回报更新 $(s_1,a_2)$。MC Basic 用的就是这个方法，每条回合只为起点提供一个样本。
- **First-visit** 对每个访问过的状态动作对，只用本回合时间最早的那次回报。例如，$(s_2,a_4)$ 用 $G_1$，重复出现的 $(s_1,a_2)$ 只用 $G_0$。
- **Every-visit** 使用每次访问的回报。在这条轨迹里，$(s_1,a_2)$ 的两次访问分别贡献 $G_0$ 和 $G_2$。

### 什么时候改进策略

MC Basic 在一轮评价中，先为各个状态动作对收集足够多的回合，取平均回报，再统一改进策略。也可以每采完一条回合，就把它提供的新回报加入相应状态动作对已有的样本，重新计算均值，并对本回合更新过的状态做贪心改进。下一条回合使用改进后的策略。

单条回合的回报可能波动很大，但策略评价可以在尚未完全稳定时就与策略改进交替进行。第四课的[截断策略迭代](value-policy-iteration.md#truncated-policy-iteration)也是这个思路。这种交替进行评价与改进的框架叫作**广义策略迭代（generalized policy iteration，GPI）**，许多有模型和无模型算法都采用它。

### MC Exploring Starts 伪代码

从初始策略 $\pi_0$ 开始，每条回合随机选择起始状态动作对 $(s_0,a_0)$，让任意可用的状态动作对都有正概率被选为起点。这就是 **Exploring Starts（探索性起始）**。执行首步后，按当前策略生成剩下的轨迹。回合结束后，用 first-visit 的回报更新样本均值，再按更新后的动作价值选择贪心动作。课件中的 `Returns` 保存每个状态动作对跨回合累积的回报样本。

<figure>
  <img src="./resources/monte-carlo/mc-exploring-starts-pseudocode.png" alt="课件原版 MC Exploring Starts 伪代码，展示随机起点、倒序计算回报、首次访问判断与策略改进" width="1508" height="974" loading="lazy">
</figure>

**为什么 $t$ 从后往前遍历？** 回报 $G_t$ 依赖下一时刻的回报 $G_{t+1}$。在回合终点令 $G_T=0$，从 $t=T-1$ 倒着走，伪代码中的 $g$ 每次就能复用已经算好的后续回报：

$$
G_T=0,\qquad G_t=r_{t+1}+\gamma G_{t+1}.
$$

这样一趟就算出所有时刻的回报，省掉了从每个时刻重新加到终点的重复计算。**首次访问仍按时间正序定义。** 倒序时会先碰到 $t=2$ 的 $(s_1,a_2)$，但它在 $t=0$ 已出现，所以跳过这次价值更新，继续倒推，最后用 $G_0$ 更新。即使某次访问不更新价值，该步的奖励也仍要计入 $g$。

### 为什么需要探索性起始

如果一直按贪心策略行动，某个动作可能始终没被尝试，即使它实际上是最优动作也会被漏掉。让各个状态动作对都有机会成为首步，可以为这些动作提供样本。真实环境往往难以重置到任意状态并指定首步，因此下一步会用**软策略（soft policy）**，让智能体在回合途中也有机会尝试其他动作。

## 4. MC ε-Greedy

### Soft Policies · 把探索放到回合途中

如果策略在每个状态 $s$ 对每个可用动作 $a$ 都有 $\pi(a\mid s)>0$，就称它为**软策略（soft policy）**。这样，从环境允许的起点出发，智能体在回合途中到达某个状态时，仍有机会尝试该状态的所有动作。只要有关状态能够到达，就可以通过多次交互收集这些状态动作对的样本，省去把每一对都设为起点的要求。实际能采到多少，取决于可达性、回合长度和采样次数。

### ε-Greedy · 平衡探索与利用

记 $m=|\mathcal A(s)|$，从估计值最大的动作中选定一个 $a^*(s)$。以 $1-\varepsilon$ 的概率直接选它，以 $\varepsilon$ 的概率在全部 $m$ 个动作中均匀抽取。均匀抽取也可能选中 $a^*(s)$，所以

$$
\pi(a\mid s)=
\begin{cases}
1-\varepsilon+\dfrac{\varepsilon}{m},&a=a^*(s),\\[3pt]
\dfrac{\varepsilon}{m},&a\ne a^*(s).
\end{cases}
$$

$\varepsilon\in[0,1]$。贪心动作的概率至少与其他动作一样大。$\varepsilon=0$ 时只选贪心动作，$\varepsilon=1$ 时所有动作等概率。取 $0<\varepsilon<1$ 时，既优先利用当前估计最好的动作，又持续探索其他动作。

### Policy Improvement · 在固定 ε 的策略中选

MC Basic 和 MC Exploring Starts 在所有策略 $\Pi$ 中最大化 $\sum_a \pi(a\mid s)q_{\pi_k}(s,a)$，可以把全部概率给当前最优动作。MC ε-Greedy 的目标相同，但将候选策略限制为固定 $\varepsilon$ 的策略集合 $\Pi_\varepsilon$。用实际采样得到的估计 $\widehat q_{\pi_k}$ 写成

$$
\pi_{k+1}(\cdot\mid s)
\in\arg\max_{\pi\in\Pi_\varepsilon}
\sum_a\pi(a\mid s)\widehat q_{\pi_k}(s,a).
$$

每个动作先分到 $\varepsilon/m$，剩下的 $1-\varepsilon$ 分给估计值最大的动作，便得到上面的概率分布。评价时仍用完整回合的回报更新动作价值，改进时保留随机探索，下一条回合再按改进后的策略采样。

### MC ε-Greedy 伪代码

给定初始策略和 $\varepsilon$，从允许的起点生成一条回合。回合结束后，仍从 $g=0$ 开始倒序递推 $g\leftarrow r_{t+1}+\gamma g$，把取到的回报加入对应状态动作对的样本均值，再用更新后的价值设置 ε-greedy 动作概率。

<figure>
  <img src="./resources/monte-carlo/mc-epsilon-greedy-pseudocode.png" alt="课件原版 MC ε-Greedy 伪代码，展示逐回合采样、倒序累计回报与 ε-greedy 策略更新" width="1536" height="1086" loading="lazy">
</figure>

**为什么这里用 every-visit？** 采用软策略后，样本可以主要来自回合途中。若起点有限、回合较长，同一个状态动作对可能在一条回合里出现多次。每次访问都计入均值，就能利用这些回报。沿用上一节的例子，every-visit 会同时计入 $(s_1,a_2)$ 的 $G_0$ 和 $G_2$，first-visit 只计入 $G_0$。同一回合的两段回报可能共享后续奖励，因此多计入一个回报，未必等于多获得一个独立样本。ε-greedy 决定**怎么选动作**，访问方式决定**哪些回报计入估计**，所以这里也可以使用 first-visit。

**图中有一处不一致。** 标题行写的是 every-visit，下面的 `If` 却只在 $(s_t,a_t)$ 此前未出现时才更新，照这个条件执行就是 first-visit。要实现图中标注的 every-visit，应删除这条检查，在倒序计算出每个 $G_t$ 后都更新对应的回报统计。
