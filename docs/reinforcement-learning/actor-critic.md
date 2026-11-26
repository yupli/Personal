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
