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
