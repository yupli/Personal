---
pageClass: rl-summary
---

# 第 10 课 · Actor–Critic 方法

## 1. Introduction {#introduction}

<div class="td-slide">
<div class="td-slide-title">Actor–Critic · Policy Gradient 与 Value Estimation</div>
<div class="td-slide-body">

**Actor–Critic** 仍属于 **policy gradient methods**。它把策略梯度与基于价值的方法结合起来，用价值估计为策略梯度更新提供反馈。

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">What Are “Actor” and “Critic”?</div>
<div class="td-slide-body">

- **Actor · Policy Update**。Actor 表示并更新策略 $\pi_\theta$。智能体在状态 $s$ 下按这个策略选择动作，所以称它为 actor。
- **Critic · Policy Evaluation / Value Estimation**。Critic 通过估计价值来评估当前策略。例如，动作价值 $q_{\pi_\theta}(s,a)$ 衡量在 $s$ 采取 $a$、随后按当前策略行动的期望回报。Critic 提供这样的评价，所以得名。

Actor 用当前策略与环境交互，Critic 从交互经验中评估该策略，Actor 再用评价结果更新策略参数。

</div>
</div>

上一课的 REINFORCE 用完整回合中的实际折扣回报估计动作价值。Actor–Critic 则可以用 Critic 学到的价值估计来构造策略更新。[第 9 课 · REINFORCE Algorithm](policy-gradient.md#reinforce-algorithm)

## 2. The Simplest Actor–Critic (QAC) {#qac}

### 2.1 From Policy Gradient to Actor and Critic {#qac-policy-gradient}

<div class="td-slide">
<div class="td-slide-title">Review · 从目标函数到随机梯度更新</div>
<div class="td-slide-body">

1. **Objective**。用标量 $J(\theta)$ 衡量策略表现，例如平均状态价值 $\bar v_\pi$ 或长期平均奖励 $\bar r_\pi$。
2. **Gradient ascent**。用 $\eta$ 表示归一化后的状态分布，令 $Z$ 为归一化前的权重总和，$\pi_t=\pi_{\theta_t}$ 为当前策略。在策略梯度等式成立时，动作价值的定义随目标而定。[第 9 课 · Gradients of the Metrics](policy-gradient.md#gradients-of-the-metrics)

$$
\begin{aligned}
\theta_{t+1}
&=\theta_t+\alpha\nabla_\theta J(\theta_t)\\
&=\theta_t+\alpha Z\,\mathbb E_{S\sim\eta,\,A\sim\pi_t(\cdot\mid S)}
\!\left[\nabla_\theta\ln\pi(A\mid S,\theta_t)\,q_{\pi_t}(S,A)\right].
\end{aligned}
$$

3. **Stochastic gradient ascent**。用抽到的 $(s_t,a_t)$ 代替期望中的随机变量，再用 $q_t(s_t,a_t)$ 估计未知的动作价值。以下沿用课件记法，把固定的正比例因子 $Z$ 并入步长。

$$
\theta_{t+1}
=\theta_t+\alpha\,\nabla_\theta\ln\pi(a_t\mid s_t,\theta_t)\,q_t(s_t,a_t).
$$

执行这条策略更新的是 **Actor**。估计 $q_t(s,a)$ 的算法是 **Critic**。

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">How to Estimate the Action Value?</div>
<div class="td-slide-body">

- **Monte Carlo learning**。用完整回合的折扣回报 $G_t$ 估计 $q_{\pi_t}(s_t,a_t)$。上一课的 **REINFORCE** 就是这种 Monte Carlo policy gradient。
- **Temporal-difference learning**。用即时奖励和下一状态动作对的价值估计构造目标。QAC 的 Critic 用一步 TD，因此收到一条转移就可以更新。

</div>
</div>

### 2.2 QAC Algorithm {#qac-algorithm}

<figure>
  <img src="./resources/actor-critic/qac-pseudocode.webp" alt="课件原版 QAC 伪代码。每个回合内按当前策略采样动作和下一动作，先执行 Critic 的价值更新，再用更新后的动作价值执行 Actor 的策略更新。" width="1588" height="910" loading="lazy">
</figure>

<div class="td-slide">
<div class="td-slide-title">Critic (Value Update) · Sarsa with Function Approximation</div>
<div class="td-slide-body">

第 $t$ 步在 $s_t$ 执行按策略选出的 $a_t$，观察 $r_{t+1}$ 和 $s_{t+1}$。若下一状态未终止，按课件在更新 $\theta_t$ 前从 $\pi(\cdot\mid s_{t+1},\theta_t)$ 抽取 $a_{t+1}$，形成 Sarsa 的一步 TD 目标。

$$
\begin{aligned}
\delta_t&=r_{t+1}+\gamma q(s_{t+1},a_{t+1},w_t)-q(s_t,a_t,w_t),\\
w_{t+1}&=w_t+\alpha_w\,\delta_t\,\nabla_w q(s_t,a_t,w_t).
\end{aligned}
$$

$w$ 是动作价值函数的参数，$\alpha_w$ 是 Critic 的学习率。半梯度更新只对当前预测 $q(s_t,a_t,w_t)$ 求导。终止转移的目标只取 $r_{t+1}$。[第 8 课 · Sarsa with Function Approximation](value-function-approximation.md#approximate-control)

</div>
</div>

<div class="td-slide">
<div class="td-slide-title">Actor (Policy Update) · 用更新后的动作价值</div>
<div class="td-slide-body">

课件先更新 Critic，再用 $q(s_t,a_t,w_{t+1})$ 对当前策略的 log-policy 梯度加权。$\alpha_\theta$ 是 Actor 的学习率。

$$
\theta_{t+1}
=\theta_t+\alpha_\theta\,\nabla_\theta\ln\pi(a_t\mid s_t,\theta_t)\,
q(s_t,a_t,w_{t+1}).
$$

QAC 中的 **Q** 指 Critic 学习动作价值 $q(s,a,w)$。Actor 的梯度由该动作价值加权，TD error $\delta_t$ 用于 Critic 的更新。

</div>
</div>

### 2.3 Why Is QAC On-policy? {#qac-on-policy}

<div class="td-slide">
<div class="td-slide-title">Remarks · 同一策略负责采样和学习</div>
<div class="td-slide-body">

- **On-policy**。这里的策略梯度期望本身按当前策略的状态访问分布和动作概率加权，所以用当前策略与环境交互。Critic 的 Sarsa 目标也用从该策略抽取的下一动作，评估的就是 Actor 正在改进的策略。
- **Exploration**。若 Actor 用 softmax 等随机策略，直接按动作概率采样就能探索，课件算法因此可以省去额外的 $\varepsilon$-greedy 动作选择。
- **Actor–Critic 的基本结构**。Critic 从新转移估计价值，Actor 用估计结果改进策略。沿用这套结构，可以更换价值估计方式或用不同的信号给策略梯度加权，得到其他 Actor–Critic 算法。

</div>
</div>
