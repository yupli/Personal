---
pageClass: rl-summary
---

# 第 9 课 · 策略梯度方法

## 1. Basic Idea of Policy Gradient {#basic-idea-of-policy-gradient}

### 1.1 从 Tabular Policy 到 Parameterized Policy

<div class="td-slide">
<div class="td-slide-title">Tabular Policy · 每个状态动作对有一个概率</div>
<div class="td-slide-body">

在 **tabular representation** 中，用状态 $s$ 和动作 $a$ 索引一个表项 $\pi(a\mid s)$。每个状态的一行存放所有可用动作的概率。

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">Parameterized Policy · 多个状态共享参数</div>
<div class="td-slide-body">

把策略写成 **parameterized function** $\pi(a\mid s,\theta)$，其中 $\theta\in\mathbb R^m$ 是 **parameter vector**。例如，在离散动作空间中，神经网络可以输入状态 $s$，输出该状态下各个动作的概率。

- **Storage**。大状态空间下，可以用同一组参数表示多个状态的策略，减少逐状态存储。
- **Generalization**。用某个状态的经验更新共享参数，可能同时改变其他状态的动作概率。

</div>
</div>

### 1.2 两种表示如何定义、读取和更新策略？

<div class="td-slide">
<div class="td-slide-title">Optimal Policy · 怎样定义最优？</div>
<div class="td-slide-body">

- **Tabular policy**。前面课程中的最优策略要同时达到每个状态的最优价值 $v^*(s)$。
- **Parameterized policy**。共享参数可能让不同状态的价值此消彼长，因此选一个 **scalar metric** $J(\theta)$，在给定的参数化策略族中寻找使它最大的策略。

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">Action Probability · 怎样读取动作概率？</div>
<div class="td-slide-body">

- **Tabular policy**。直接查表得到 $\pi(a\mid s)$。
- **Parameterized policy**。给定函数结构和当前参数 $\theta$，计算 $\pi(a\mid s,\theta)$。

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">Policy Update · 怎样更新策略？</div>
<div class="td-slide-body">

- **Tabular policy**。直接修改某个状态下各动作的概率表项。
- **Parameterized policy**。更新 $\theta$，再由函数给出新的动作概率。

</div>
</div>

### 1.3 Policy Gradient · 先定义目标，再沿梯度更新

<div class="td-slide">
<div class="td-slide-title">Basic Idea · Objective Function 与 Gradient Ascent</div>
<div class="td-slide-body">

1. **Define the objective**。选定标量目标 $J(\theta)$，衡量策略 $\pi(\cdot\mid\cdot,\theta)$ 的表现。
2. **Optimize the parameters**。用 **gradient ascent** 沿 $J$ 增大的方向更新 $\theta$。

$$
\theta_{t+1}=\theta_t+\alpha\nabla_\theta J(\theta_t).
$$

$\alpha>0$ 是 step size，$\nabla_\theta J(\theta_t)$ 就是 **policy gradient**。

</div>
</div>

## 2. Metrics to Define Optimal Policies {#metrics-to-define-optimal-policies}

### 2.1 Average Value {#average-value}

<div class="td-slide">
<div class="td-slide-title">Metric 1 · Average State Value</div>
<div class="td-slide-body">

课件介绍两种衡量策略表现的指标。第一种是 **average state value**，简称 **average value**。它把各状态在策略 $\pi$ 下的价值加权成一个标量。

$$
\bar v_\pi=\sum_{s\in\mathcal S}d(s)v_\pi(s)
=\mathbb E_{S\sim d}[v_\pi(S)].
$$

每个状态的权重满足 $d(s)\ge 0$，且 $\sum_s d(s)=1$，因此可以把 $d$ 看作状态分布。

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">Vector-product Form</div>
<div class="td-slide-body">

按同一状态顺序，把权重和状态价值分别排成列向量 $d$ 与 $v_\pi$，两者都属于 $\mathbb R^{|\mathcal S|}$。Average value 就是它们的内积。

$$
\bar v_\pi=d^\top v_\pi.
$$

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">Case 1 · 与策略无关的固定分布</div>
<div class="td-slide-body">

将固定分布记为 $d_0$，对应指标为 $\bar v_\pi^{\,0}=d_0^\top v_\pi$。策略参数变化时，$d_0$ 保持不变，求梯度时只需对状态价值求导。

- **Uniform distribution**。取 $d_0(s)=1/|\mathcal S|$，给所有状态相同的权重。
- **Fixed initial state**。如果每个 episode 都从 $s_0$ 开始，取 $d_0(s_0)=1$，其他状态的权重为 $0$。此时 $\bar v_\pi^{\,0}=v_\pi(s_0)$，衡量的是从 $s_0$ 出发的期望折扣回报。

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">Case 2 · 随策略变化的 Stationary Distribution</div>
<div class="td-slide-body">

也可以取 $d=d_\pi$，即策略 $\pi$ 诱导的 **stationary distribution**。令 $P_\pi$ 为该策略下的状态转移概率矩阵，则

$$
d_\pi^\top P_\pi=d_\pi^\top,
\qquad
\bar v_\pi=d_\pi^\top v_\pi.
$$

在遍历条件下，长期访问频率越高的状态权重越大，较少访问的状态权重较小。策略变化时，$d_\pi$ 也可能随之变化。[第八课 · Stationary Distribution](value-function-approximation.md#_2-2-stationary-distribution)

</div>
</div>

### 2.2 Average Reward {#average-reward}

<div class="td-slide">
<div class="td-slide-title">Metric 2 · Average One-step Reward</div>
<div class="td-slide-body">

**Average reward** 用平稳分布 $d_\pi$ 对各状态的期望单步奖励加权。

$$
\bar r_\pi=\sum_{s\in\mathcal S}d_\pi(s)r_\pi(s)
=\mathbb E_{S\sim d_\pi}[r_\pi(S)].
$$

其中 $r_\pi(s)$ 先按策略对动作取平均，$r(s,a)$ 是给定状态和动作的期望即时奖励。

$$
\begin{aligned}
r_\pi(s)&=\sum_{a\in\mathcal A(s)}\pi(a\mid s)r(s,a),\\
r(s,a)&=\mathbb E[R\mid s,a]=\sum_r r\,p(r\mid s,a).
\end{aligned}
$$

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">Equivalent Definition · 长期每步奖励</div>
<div class="td-slide-body">

从 $s_0$ 出发，按 $\pi$ 生成轨迹。若策略诱导的有限 Markov chain 遍历，且奖励期望有限，则

$$
\lim_{n\to\infty}\frac1n
\mathbb E_\pi\!\left[\sum_{k=1}^n R_k\mid S_0=s_0\right]
=\bar r_\pi.
$$

状态分布趋于 $d_\pi$ 后，每步期望奖励趋于 $\sum_s d_\pi(s)r_\pi(s)$，这些期望的时间平均也趋于同一个值。因此长期平均与起点 $s_0$ 无关。

</div>
</div>

### 2.3 Remarks on the Metrics {#remarks-on-policy-metrics}

<div class="td-slide">
<div class="td-slide-title">Remarks 1–2 · 参数与折扣</div>
<div class="td-slide-body">

- **Parameter dependence**。两种指标都随策略 $\pi_\theta$ 变化，因此都可以选作要最大化的 $J(\theta)$。
- **Discounted and undiscounted settings**。Average value 来自折扣回报，通常取 $0\le\gamma<1$。在持续任务中，若采用 $\gamma=1$，无限奖励总和可能发散，可以用每步长期平均的 $\bar r_\pi$ 定义目标。

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">Remark 3 · 平稳条件下的关系</div>
<div class="td-slide-body">

Average reward 在定义里只出现单步奖励，但 $d_\pi$ 已包含策略长期访问各状态的频率。若 Average Value 也用 $d=d_\pi$ 加权，并且 $0\le\gamma<1$，则

$$
\bar r_\pi=(1-\gamma)\bar v_\pi.
$$

从 $S_0\sim d_\pi$ 出发，之后每一步的状态分布都是 $d_\pi$，所以每步期望奖励都等于 $\bar r_\pi$。把它代入折扣回报并对几何级数求和，即得 $\bar v_\pi=\bar r_\pi/(1-\gamma)$。固定 $\gamma$ 时，这两个指标对策略的排序相同。用一般的固定起点分布 $d_0$ 加权时，这一比例关系一般不成立。

</div>
</div>

### 2.4 Exercise · Expected Discounted Return {#expected-discounted-return}

<div class="td-slide">
<div class="td-slide-title">Exercise · 期望折扣回报对应哪个指标？</div>
<div class="td-slide-body">

令 $G_0=\sum_{t=0}^\infty\gamma^t R_{t+1}$，目标为 $J(\theta)=\mathbb E[G_0]$。轨迹从 $S_0\sim d$ 开始，动作由 $\pi_\theta$ 采样，奖励与下一状态由环境产生。

对起始状态应用 **law of total expectation**。

$$
\begin{aligned}
J(\theta)
&=\sum_{s\in\mathcal S}d(s)\mathbb E_{\pi_\theta}[G_0\mid S_0=s]\\
&=\sum_{s\in\mathcal S}d(s)v_{\pi_\theta}(s)\\
&=\bar v_{\pi_\theta}.
\end{aligned}
$$

所以它就是以起始分布 $d$ 加权的 **Average Value**。

</div>
</div>
