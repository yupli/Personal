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
