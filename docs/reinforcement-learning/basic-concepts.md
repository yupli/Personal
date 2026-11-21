---
pageClass: rl-summary
---

# 第 1 课 · 基本概念 · V2（总结）

[切换到 V1（逐页）](basic-concepts-slides.md)

## 1. States, Actions & Transitions

#### （1）状态与状态空间

<div class="td-slide">
<div class="td-slide-title">状态与状态空间</div>
<div class="td-slide-body">

- <strong>State（状态）</strong>：智能体（agent）相对于环境所处的情形，记作 $s$。
- <strong>State space（状态空间）</strong>：所有可能状态的集合，记作 $\mathcal S$，因此 $s\in\mathcal S$。若有 $N$ 个状态，可写成 $\mathcal S=\{s_1,\ldots,s_N\}$。

</div>
</div>

#### （2）动作与动作空间

<div class="td-slide">
<div class="td-slide-title">动作与动作空间</div>
<div class="td-slide-body">

- <strong>Action（动作）</strong>：智能体在当前状态下可以做出的一项选择，记作 $a$。
- <strong>Action space of a state（该状态的动作空间）</strong>：状态 $s$ 下所有可用动作的集合，记作 $\mathcal A(s)$。智能体在状态 $s$ 选择的动作满足 $a\in\mathcal A(s)$。不同状态的可用动作可以不同。

</div>
</div>

#### （3）状态转移与转移概率

<div class="td-slide">
<div class="td-slide-title">状态转移与转移概率</div>
<div class="td-slide-body">

<strong>State transition（状态转移）</strong>：智能体在状态 $s$ 执行动作 $a$ 后，环境产生下一状态 $s'$，记作 $s\xrightarrow{a}s'$。下一状态也可能仍是 $s$。

<strong>State transition probability（状态转移概率）</strong>：给定当前状态 $s$ 和动作 $a$，下一状态是 $s'$ 的概率。

$$
p(s'\mid s,a)=\Pr(S_{t+1}=s'\mid S_t=s,A_t=a),
\qquad \sum_{s'\in\mathcal S}p(s'\mid s,a)=1.
$$

- <strong>Deterministic transition（确定性转移）</strong>：给定 $(s,a)$ 后，只有一个下一状态的概率为 $1$，其余为 $0$。
- <strong>Stochastic transition（随机转移）</strong>：即使给定同一个 $(s,a)$，也可能出现多个不同的下一状态，概率分配在这些状态上。

环境同时给出下一状态 $s'$ 和即时奖励 $r$，可用联合分布（joint distribution）$p(s',r\mid s,a)$ 描述。离散情形下，对奖励求和得到状态转移概率；对下一状态求和得到奖励概率：

$$
p(s'\mid s,a)=\sum_r p(s',r\mid s,a),
\qquad
p(r\mid s,a)=\sum_{s'}p(s',r\mid s,a).
$$

</div>
</div>

## 2. Policy

#### （1）策略怎样选动作

<div class="td-slide">
<div class="td-slide-title">Policy · 从状态到动作</div>
<div class="td-slide-body">

<strong>Policy（策略）</strong>规定智能体在每个状态怎样选动作。$\pi(a\mid s)$ 表示在状态 $s$ 选择动作 $a$ 的概率：

$$
\pi(a\mid s)\ge 0,\qquad\sum_{a\in\mathcal A(s)}\pi(a\mid s)=1.
$$

- <strong>Deterministic policy（确定性策略）</strong>：为每个状态指定一个动作 $a^*(s)$，即 $\pi(a^*(s)\mid s)=1$，其他动作的概率为 $0$。
- <strong>Stochastic policy（随机策略）</strong>：可以把正概率分给多个可用动作，再按这个分布抽样。

<strong>策略决定选什么，环境决定选定后会到哪里。</strong> 固定当前状态 $s$，先选中指定动作 $a$、再到达 $s'$ 的联合概率是：

$$
\Pr_\pi(A_t=a,S_{t+1}=s'\mid S_t=s)=\pi(a\mid s)\,p(s'\mid s,a).
$$

</div>
</div>

## 3. Rewards, Trajectories & Returns

#### （1）Reward、Trajectory 与 Return

<div class="td-slide">
<div class="td-slide-title">从单步奖励到整条轨迹的回报</div>
<div class="td-slide-body">

<strong>Reward（奖励）</strong>是执行动作后由环境给出的实数。正奖励鼓励这样的行为，负奖励用来惩罚这样的行为。$R_{t+1}$ 是在 $S_t$ 执行 $A_t$ 后收到的那一笔即时奖励。

<strong>Trajectory（轨迹）</strong>是按时间排列的状态、动作和奖励。箭头上方是执行的动作，下方是获得的奖励：

$$
S_t\xrightarrow[R_{t+1}]{A_t} S_{t+1}
\xrightarrow[R_{t+2}]{A_{t+1}} S_{t+2}
\xrightarrow{\ \cdots\ } S_T .
$$

<strong>Return（回报）</strong>累加一段轨迹上的奖励。对在时刻 $T$ 结束的轨迹，从时刻 $t$ 起的<strong>未折扣回报</strong>是 $R_{t+1}+R_{t+2}+\cdots+R_T$。

</div>
</div>

#### （2）Discounted return 与折扣因子

<div class="td-slide">
<div class="td-slide-title">Discounted return · 折扣回报</div>
<div class="td-slide-body">

引入 <strong>discount factor（折扣因子）</strong> $\gamma\in[0,1)$。第一笔奖励的权重为 $1$，之后每晚一步就多乘一个 $\gamma$：

<div class="td-slide-equation">

$$
G_t=R_{t+1}+\gamma R_{t+2}+\gamma^2R_{t+3}+\cdots
=\sum_{k=0}^{\infty}\gamma^kR_{t+k+1}.
$$

</div>

- <strong>让无限和保持有限。</strong> 如果每步奖励有界（$|R_{t+k+1}|\le R_{\max}$），折扣回报的绝对值至多为 $R_{\max}\sum_{k=0}^{\infty}\gamma^k=R_{\max}/(1-\gamma)$。例如，若前 $m$ 步奖励为零、之后每步都是常数 $r$，则 $G_t=r\gamma^m(1+\gamma+\gamma^2+\cdots)=r\gamma^m/(1-\gamma)$。
- <strong>调节近期与远期奖励的权重。</strong> $\gamma=0$ 时只计第一笔奖励；$\gamma$ 接近 $0$ 时远期权重衰减很快，接近 $1$ 时衰减更慢，远期奖励因此更有分量。

</div>
</div>

## 4. Episodic & Continuing Tasks

#### （1）Episode 与两种任务

<div class="td-slide">
<div class="td-slide-title">Episode · 从开始到终止</div>
<div class="td-slide-body">

- <strong>Episode（回合，也称 trial）</strong>：智能体按策略与环境交互，从初始状态开始，到达 <strong>terminal state（终止状态）</strong>时停止；这段完整的有限轨迹就是一个回合。
- <strong>Episodic task（回合型任务）</strong>：交互由一个个有终点的回合组成。若在时刻 $T$ 终止，进入终止状态时获得的 $R_T$ 是回合最后一笔奖励；从 $T$ 开始没有后续奖励，所以 $G_T=0$。
- <strong>Continuing task（持续型任务）</strong>：没有规定的终止状态，智能体可以一直与环境交互。

</div>
</div>

#### （2）怎样用持续形式表示回合任务

<div class="td-slide">
<div class="td-slide-title">两种处理目标状态的方式</div>
<div class="td-slide-body">

1. <strong>设为 absorbing state（吸收状态）。</strong> 到达后只转移到自身，之后奖励恒为 $0$；进入时获得的奖励照常计入。这样可以把有限轨迹补成无限轨迹，同时保留原来的回报。
2. <strong>当作普通状态。</strong> 到达目标后仍按策略行动，可以离开；每次进入目标时都可按规则获得奖励（课件设为 $+1$）。课程采用这种设定，因此目标状态也能用与其他状态相同的方式处理。由于首次到达后仍可能继续得分，这是一个重新定义的持续任务，回报可能与原回合任务不同。

</div>
</div>

## 5. Markov Decision Process (MDP)

#### （1）MDP 的组成与 Markov property

<div class="td-slide">
<div class="td-slide-title">Markov Decision Process · 基本要素</div>
<div class="td-slide-body">

- <strong>集合（sets）</strong>：$\mathcal S$ 是全部状态的集合；$\mathcal A(s)$ 是状态 $s$ 的可用动作集合；$\mathcal R(s,a)$ 是在 $s$ 执行 $a$ 后可能获得的奖励值的集合。
- <strong>环境的概率分布</strong>：$p(s'\mid s,a)$ 是到达 $s'$ 的状态转移概率，$p(r\mid s,a)$ 是获得 $r$ 的奖励概率。联合分布 $p(s',r\mid s,a)$ 同时描述两种结果。
- <strong>策略（policy）</strong>：$\pi(a\mid s)$ 描述智能体在 $s$ 选择 $a$ 的概率。同一个 MDP 可以用来比较不同策略；折扣因子 $\gamma$ 决定怎样给未来奖励加权。

<strong>Markov property（马尔可夫性质）</strong>也叫<strong>无记忆性</strong>：给定当前状态 $s_t$ 和本步动作 $a_t$ 后，再知道更早的交互历史，也不会改变下一状态和奖励的条件分布。令 $h_t=(s_0,a_0,r_1,\ldots,a_{t-1},r_t,s_t)$ 表示截至当前状态的历史，则

$$
\begin{aligned}
p(s_{t+1},r_{t+1}\mid h_t,a_t)&=p(s_{t+1},r_{t+1}\mid s_t,a_t),\\
p(s_{t+1}\mid h_t,a_t)&=p(s_{t+1}\mid s_t,a_t),\\
p(r_{t+1}\mid h_t,a_t)&=p(r_{t+1}\mid s_t,a_t).
\end{aligned}
$$

第一行是联合分布的条件；后两行分别对应只看下一状态、只看即时奖励。

</div>
</div>

#### （2）固定策略后得到 Markov process

<div class="td-slide">
<div class="td-slide-title">从 MDP 到 Markov process</div>
<div class="td-slide-body">

固定一个只依赖当前状态的策略 $\pi$ 后，在 $s$ 怎样选动作已经确定为分布 $\pi(\cdot\mid s)$。将「先选 $a$、再到达 $s'$」的概率对所有可用动作求和，就得到只依赖当前状态的一步转移概率：

$$
p_\pi(s'\mid s)=\sum_{a\in\mathcal A(s)}\pi(a\mid s)\,p(s'\mid s,a).
$$

因此，在策略 $\pi$ 下，只看状态序列 $S_0,S_1,\ldots$，它就是一个 <strong>Markov process（马尔可夫过程）</strong>。第 2 课会用这个转移概率推导 Expected Future Return。

</div>
</div>
