# 第 2 课 · 贝尔曼公式 · V2（总结）

[切换到 V1（逐页）](bellman-equation-slides.md)

## 1. 回报与两种价值

- 折扣回报（discounted return）是一次轨迹的累计奖励。$G_t=R_{t+1}+\gamma G_{t+1}$，其中 $0\le\gamma<1$。
- 状态价值（state value）$v_\pi(s)=\mathbb E_\pi[G_t\mid S_t=s]$ 给定起点，所有动作都按策略 $\pi$ 选择。
- 动作价值（action value）$q_\pi(s,a)=\mathbb E_\pi[G_t\mid S_t=s,A_t=a]$ 再指定首步动作，之后仍按 $\pi$ 走。

四格例子里，从 $s_1$ 向下首步得 0，向右进禁区首步得 −1。两条路线从第二步起都持续得 +1。总向下、各以 0.5 的概率选择、总向右，三种策略的起点价值分别为 $\gamma/(1-\gamma)$、$-0.5+\gamma/(1-\gamma)$、$-1+\gamma/(1-\gamma)$。取 $\gamma=0.9$ 时依次为 9、8.5、8。

## 2. 贝尔曼公式与策略评估

把 $G_t$ 拆为即时奖励和下一时刻的回报。给定下一状态后，马尔可夫性质允许用 $v_\pi(s')$ 替换后续回报的条件期望。先对环境产生的奖励与下一状态加权，再对策略选的动作加权：

$$
\begin{aligned}
q_\pi(s,a)&=\sum_r p(r\mid s,a)r
+\gamma\sum_{s'}p(s'\mid s,a)v_\pi(s'),\\
v_\pi(s)&=\sum_a \pi(a\mid s)q_\pi(s,a).
\end{aligned}
$$

把第一式代入第二式就是逐状态的贝尔曼公式。$\pi$ 和环境模型给定，未知量是各状态的价值。求解它们的过程叫策略评估（policy evaluation）。

## 3. 矩阵形式与求解

将动作概率平均进即时奖励 $r_\pi(s)=\sum_a\pi(a\mid s)\sum_r p(r\mid s,a)r$ 与转移概率 $p_\pi(s'\mid s)=\sum_a\pi(a\mid s)p(s'\mid s,a)$。把每个状态的式子排在一起：

$$
\mathbf v_\pi=\mathbf r_\pi+\gamma P_\pi\mathbf v_\pi,
\qquad [P_\pi]_{ij}=p_\pi(s_j\mid s_i).
$$

- 闭式解为 $\mathbf v_\pi=(I-\gamma P_\pi)^{-1}\mathbf r_\pi$，实际可直接求解线性方程组。
- 迭代解为 $\mathbf v_{k+1}=\mathbf r_\pi+\gamma P_\pi\mathbf v_k$。$P_\pi$ 的每行都是概率分布，所以每轮的最大绝对误差至多为上一轮的 $\gamma$ 倍，任意初值都会收敛。

四格例子可以先用 $v_\pi(s_4)=1+\gamma v_\pi(s_4)$ 求出目标格价值 $1/(1-\gamma)$，再代回其他状态。固定「首步向右进禁区」来算动作价值时，记得把即时的 −1 算进去，即 $q_\pi(s_1,a_2)=-1+\gamma v_\pi(s_2)$。
